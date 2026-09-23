# Bharat Care – Elderly Care Coordination & Triage Platform
**Bharat Innovation Challenge 2.0 (Stage 1 Submission)**

A care-coordination platform designed for NRI families to assist their elderly parents in India. Features a single-tap elderly dashboard, an AI Copilot layer that ingests Hinglish operator call transcripts to extract structured triage cards, and test benchmark datasets.

---

## 📁 Project Structure

```
App/
├── .env                     # API keys (GEMINI_API_KEY)
├── package.json             # Node.js dependencies & scripts
├── README.md                # Project documentation & runbook
│
├── public/                  # Mobile-first frontend web interfaces
│   └── dashboard.html       # Elderly Parent Care Dashboard (WCAG AAA, Bilingual, Dark Mode)
├── dashboard.html           # Root entrypoint (redirects to public/dashboard.html)
│
├── src/                     # Backend & AI Copilot layer
│   └── triage_copilot.js    # Gemini Structured Output triage extraction engine
│
├── data/                    # Evaluation & test datasets
│   ├── call_scripts.json    # 10 Hinglish mock call transcripts & expected cards (JSON)
│   └── call_scripts.md      # Formatted scripts, dialogue transcripts & evaluation answer key
│
└── scripts/                 # Utility & data generation scripts
    ├── make_scripts.py      # Generates and validates call_scripts dataset
    └── format_for_sharing.py# Formats transcripts for voice actor recordings
```

---

## 🚀 Getting Started

### 1. Environment Configuration
Create a `.env` file in the root `App/` directory:
```env
GEMINI_API_KEY="your-gemini-api-key"
```

### 2. Install Dependencies
```bash
npm install
```

---

## 📱 1. Elderly Parent Care Dashboard

- **Location:** `public/dashboard.html` (or open root `dashboard.html`)
- **Key Capabilities:**
  - **Zero Cognitive Clutter:** Minimum 60×60px touch targets, 180px elevated "One-Button" centerpiece.
  - **3 Real-time Lifecycle States:** Idle $\rightarrow$ Connecting/Callback Requested $\rightarrow$ Helper Assigned with 4-Digit OTP security code.
  - **Bilingual Interface:** Toggle seamlessly between English and Hindi (`हिंदी`).
  - **Dark / Light Theme:** Accessible contrast with OLED dark mode toggle (☀️ / 🌙).
  - **Judge Demo Bar:** Discreet floating demo controls at the bottom to switch states instantly during pitch presentations.

---

## 🤖 2. AI Triage Copilot

Run the AI extraction engine on sample transcripts:
```bash
npm start
# or
node src/triage_copilot.js
```

### Output Schema:
```json
{
  "category": "tech_help | medical | errands | household | other",
  "urgency": "routine | urgent | emergency",
  "escalate_to_emergency_services": boolean,
  "helper_skill": "string",
  "when": "string (e.g. ASAP or time preference)",
  "needs_followup": boolean,
  "followup_reason": "string or null"
}
```

---

## 🧪 3. Test Scripts & Voice Recording Data

- **Regenerate test benchmark data:**
  ```bash
  npm run generate-scripts
  # or
  python scripts/make_scripts.py
  ```
- **Print clean copy-pasteable dialogues for voice recording:**
  ```bash
  npm run format-scripts
  # or
  python scripts/format_for_sharing.py
  ```
