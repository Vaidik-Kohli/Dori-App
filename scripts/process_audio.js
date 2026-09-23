import { processAudioCall } from "../src/triage_copilot.js";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { execSync } from "child_process";
import os from "os";

// ES modules workaround for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRootDir = path.resolve(__dirname, '..');

// Get the audio file path from the command line arguments
const rawFilePath = process.argv[2];

if (!rawFilePath) {
    console.error("Usage: node process_audio.js <path_to_audio_or_video_file>");
    process.exit(1);
}

if (!fs.existsSync(rawFilePath)) {
    console.error(`Error: File not found at ${rawFilePath}`);
    process.exit(1);
}

async function main() {
    try {
        console.log(`Starting AI pipeline for: ${rawFilePath}`);
        
        // Convert to standard MP3 to guarantee Gemini compatibility
        const tempMp3Path = path.join(os.tmpdir(), `bharat_care_${Date.now()}.mp3`);
        console.log(`[0/3] Normalizing audio format with FFmpeg to prevent Google API rejection...`);
        try {
            execSync(`ffmpeg -y -i "${rawFilePath}" -vn -ar 16000 -ac 1 -b:a 64k "${tempMp3Path}" 2> NUL`, { stdio: 'ignore' });
        } catch (e) {
            console.error("FFmpeg conversion failed. Is FFmpeg installed? Attempting to proceed with raw file...");
        }

        const audioFilePath = fs.existsSync(tempMp3Path) ? tempMp3Path : rawFilePath;
        
        const result = await processAudioCall(audioFilePath);
        
        // Structure the output to perfectly match what the Operator Console expects
        const outputJson = {
            caller_name: result.triage.caller_name,
            location: result.triage.location,
            urgency_level: result.triage.urgency,
            category: result.triage.category,
            required_skill: result.triage.helper_skill,
            assigned_helper_name: result.triage.assigned_helper_name,
            summary: result.triage.hinglish_transcript.substring(0, 150) + "...", // Or we could use a summarized version if we had one
            followup_action: result.triage.needs_followup ? (result.triage.followup_reason || "Yes") : "None",
            escalate_to_emergency: result.triage.escalate_to_emergency_services,
            raw_transcript: result.triage.hinglish_transcript,
            raw_triage: result.triage
        };

        // Determine output filenames
        const baseName = path.basename(rawFilePath, path.extname(rawFilePath));
        
        // Ensure directories exist relative to the App project root (not where terminal is running from)
        const dataDir = path.join(appRootDir, 'data');
        const callsDir = path.join(dataDir, 'calls');
        const transcriptsDir = path.join(dataDir, 'transcripts');
        
        if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
        if (!fs.existsSync(callsDir)) fs.mkdirSync(callsDir);
        if (!fs.existsSync(transcriptsDir)) fs.mkdirSync(transcriptsDir);
        
        const jsonOutPath = path.join(callsDir, `${baseName}.json`);
        const txtOutPath = path.join(transcriptsDir, `${baseName}.txt`);
        
        // Save the JSON and Transcript separately
        fs.writeFileSync(jsonOutPath, JSON.stringify(outputJson, null, 2));
        fs.writeFileSync(txtOutPath, result.triage.hinglish_transcript);
        
        console.log(`\n✅ Success! Data extracted and organized:`);
        console.log(`-> JSON saved to: ${jsonOutPath}`);
        console.log(`-> Transcript saved to: ${txtOutPath}`);
        console.log(`\nYou can now upload the JSON file directly into the Operator Console!`);
        
    } catch (error) {
        console.error("Pipeline failed:", error);
    }
}

main();
