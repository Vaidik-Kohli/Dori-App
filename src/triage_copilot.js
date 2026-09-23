import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

// Ensure .env is loaded regardless of the working directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Initialize the client
// Make sure to set GEMINI_API_KEY in your .env file
const ai = new GoogleGenAI();

const SYSTEM_PROMPT = `You are an expert AI triage assistant for an elderly care coordination service. 
Your job is to read or listen to call transcripts between elderly parents (often speaking in Hinglish or Hindi) and human operators.

Your ONLY task is to analyze the conversation and output a raw JSON object containing the extracted details. 

STRICT RULES:
1. Output ONLY valid JSON. Do not include markdown formatting, conversational text, greetings, or explanations.
2. If health, physical safety, or severe distress is mentioned, aggressively set "escalate_to_emergency_services" to true and "urgency" to emergency.
3. Keep the "helper_skill" description concise but specific (e.g., "electrician", "medical transport", "tech-savvy helper").
4. ALWAYS extract the exact caller_name as mentioned in the transcript. DO NOT hallucinate, assume, or put random colloquial terms like "Aunty Ji", "Uncle Ji", etc. If the name is truly not provided, set it to "Unknown".
5. Similarly, accurately extract the location. DO NOT hallucinate locations not explicitly mentioned.`;

// Define the response schema explicitly to guarantee structured JSON output
const triageSchema = {
    type: Type.OBJECT,
    properties: {
        hinglish_transcript: {
            type: Type.STRING,
            description: "The full transcript transliterated into Hinglish (Hindi words written using English alphabets, e.g., 'Namaste aunty ji...'). Do not use Devanagari script.",
        },
        caller_name: {
            type: Type.STRING,
            description: "The exact name of the caller if explicitly mentioned in the audio. DO NOT use generic terms like 'Aunty Ji', 'Uncle Ji', or 'Beta'. If the actual proper name is not explicitly spoken, you MUST return 'Unknown - Please verify'. DO NOT hallucinate.",
        },
        location: {
            type: Type.STRING,
            description: "The specific location, city, or address of the caller if mentioned. If they do not explicitly state where they are calling from, you MUST return 'Unknown - Please verify'. DO NOT hallucinate.",
        },
        category: {
            type: Type.STRING,
            description: "Must be one of [tech_help, medical, errands, household, other]",
        },
        urgency: {
            type: Type.STRING,
            description: "Must be one of [routine, urgent, emergency]",
        },
        escalate_to_emergency_services: {
            type: Type.BOOLEAN,
            description: "True if immediate danger/health risk, else false",
        },
        helper_skill: {
            type: Type.STRING,
            description: "What kind of skill is required? e.g., 'plumber', 'electrician', 'paramedic', 'general_helper'. Be concise.",
        },
        assigned_helper_name: {
            type: Type.STRING,
            description: "Use your AI persona to invent a highly realistic Indian name (first and last name) for the gig-worker who fits the required skill and location. E.g. 'Ramesh Sharma' for a plumber, 'Sunita Patel' for a nurse. Do not use Rajesh Kumar. Make it sound authentic to the context.",
        },
        when: {
            type: Type.STRING,
            description: "Exact time/date mentioned, or 'ASAP' if not specified",
        },
        needs_followup: {
            type: Type.BOOLEAN,
            description: "True if the operator promised to check back or if the issue is unresolved",
        },
        followup_reason: {
            type: Type.STRING,
            description: "Reason for followup, or null if none",
            nullable: true,
        }
    },
    required: ["hinglish_transcript", "caller_name", "location", "category", "urgency", "escalate_to_emergency_services", "helper_skill", "assigned_helper_name", "when", "needs_followup"],
};

/**
 * Analyzes a call transcript (text) and returns the structured triage JSON.
 * @param {string} transcript - The call transcript (e.g., in Hinglish, Punjabi, or Hindi)
 */
async function analyzeCallTranscript(transcript) {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite", // Fast and efficient for structured JSON extraction
            contents: transcript,
            config: {
                systemInstruction: SYSTEM_PROMPT,
                responseMimeType: "application/json",
                responseSchema: triageSchema,
                // Using a lower temperature for extraction tasks keeps responses more deterministic
                temperature: 0.1, 
            }
        });

        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error analyzing transcript:", error);
        throw error;
    }
}

/**
 * Pipeline for processing raw audio calls (e.g., Punjabi voice notes).
 * Uses gemini-3.5-transcribe for high-quality audio-to-text, then flash-lite for JSON extraction.
 * @param {string} audioFilePath - Path to the local audio file
 * @param {string} mimeType - The audio mime type (default: audio/mp3)
 */
async function processAudioCall(audioFilePath, mimeType = null) {
    try {
        console.log(`[1/3] Uploading audio file: ${audioFilePath}`);
        
        if (!mimeType) {
            const ext = path.extname(audioFilePath).toLowerCase();
            if (ext === '.mp3') mimeType = 'audio/mp3';
            else if (ext === '.m4a') mimeType = 'audio/mp4';
            else if (ext === '.mp4') mimeType = 'audio/mp4'; // Treat as audio since these are VNs
            else if (ext === '.wav') mimeType = 'audio/wav';
            else if (ext === '.ogg') mimeType = 'audio/ogg';
            else mimeType = 'audio/mp4'; // fallback
        }

        const uploadResult = await ai.files.upload({ file: audioFilePath, mimeType });
        console.log(`File uploaded: ${uploadResult.name}. Waiting for processing...`);

        // Wait for file to become active
        let currentFile = await ai.files.get({ name: uploadResult.name });
        while (currentFile.state === 'PROCESSING') {
            await new Promise(resolve => setTimeout(resolve, 2000));
            currentFile = await ai.files.get({ name: uploadResult.name });
            process.stdout.write('.');
        }
        console.log('');
        
        if (currentFile.state === 'FAILED') {
            throw new Error(`File processing failed. This usually means the mimeType (${mimeType}) doesn't match the actual file encoding, or the file is corrupted.`);
        }
        
        console.log(`[2/3] Transcribing audio with gemini-3.5-transcribe...`);
        const transcriptionResponse = await ai.models.generateContent({
            model: "gemini-3.5-transcribe",
            contents: [
                {
                    role: 'user',
                    parts: [
                        { fileData: { fileUri: currentFile.uri, mimeType: currentFile.mimeType } },
                        { text: "Please transcribe this call accurately. The speakers might be speaking in Punjabi, Hindi, or English." }
                    ]
                }
            ]
        });
        
        const transcriptText = transcriptionResponse.text || (transcriptionResponse.candidates?.[0]?.content?.parts?.[0]?.audioTranscription?.text) || "Transcription failed or returned empty.";
        console.log(`\n--- TRANSCRIPT ---\n${transcriptText}\n------------------\n`);
        
        console.log(`[3/3] Extracting JSON with gemini-3.5-flash-lite...`);
        const triageJson = await analyzeCallTranscript(transcriptText);
        
        return {
            transcript: transcriptText,
            triage: triageJson
        };
    } catch (error) {
        console.error("\nError processing audio call:", error);
        throw error;
    }
}

// === EXAMPLE USAGE ===
async function runDemo() {
    const sampleTranscript = `
    Operator: Namaste, Bharat Care mein aapka swagat hai. Main aapki kaise madad kar sakta hoon?
    Parent: Beta, meri tabiyat theek nahi lag rahi. Seene mein thoda dard ho raha hai subah se, aur saans lene mein takleef ho rahi hai. 
    Operator: Oh, aap bilkul ghabrayein mat. Hum abhi aapke paas madad bhejte hain. Main ambulance aur ek nurse ka intezaam karta hoon.
    Parent: Theek hai beta, jaldi bhejo.
    Operator: Ji, main abhi karta hoon, aur 5 minute mein aapko wapas call karke update deta hoon.
    `;

    console.log("Analyzing transcript...");
    const result = await analyzeCallTranscript(sampleTranscript);
    
    console.log("Extracted Triage JSON:");
    console.log(JSON.stringify(result, null, 2));
}

// Export functions and schema for modular use
export { analyzeCallTranscript, processAudioCall, triageSchema, SYSTEM_PROMPT, runDemo };

// Run the demo if executed directly
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
    runDemo();
}
