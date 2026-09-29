# Hyperframes Composition Brief: Dori (डोरी)

## Objective
Create a short, punchy, mission-critical launch-style brag video for Dori.

## Output
- Composition directory: `brag-output-v2/composition/`
- Rendered video: `brag-output-v2/brag.mp4`
- Format: landscape — 1920x1080
- Duration: 20.0 seconds

## Source Material
- Project root: `c:\Users\vaidik\Downloads\Projects\Bharat Innovation LPU\App\`
- Primary files read: `dashboard.html`, `helper-app.html`, `operator-console.html`, `nri-app.html`, `README.md`
- Product name: Dori (डोरी)
- Tagline / strongest claim: "Zero cognitive load for parents — from panic audio to a verified paramedic on your doorstep in under 5 seconds."
- Key UI or visual moment to recreate:
  - Big emerald tactile SOS button with 3D drop shadow (`btn-tactile`, `shadow-btn-3d`)
  - Active gold voice waveform (`#waveform`)
  - AI Triage Copilot with real-time extracted badges (Urgency: High, Skill: Paramedic)
  - The 4-digit high-contrast OTP security digits (`[ 4 ] [ 0 ] [ 9 ] [ 2 ]`)
  - Live timeline event tracker from the Family Hub
- Copy that must appear verbatim:
  - "When an elderly parent needs help..."
  - "Call Now" / "कॉल करें"
  - "AI Triage Copilot"
  - " छाती में बहुत दर्द हो रहा है "
  - "Security Code (OTP): 4092"
  - "Zero Impersonation Risk"
  - "Dori (डोरी)"

## Creative Direction
- Tone preset: `polished`
- Creative direction: Mission-critical, high-energy product film with crisp glassmorphic UI cards and rhythmic beat drops.
- Interpretation: Restrained, cinematic confidence. Text enters with authority and stays settled long enough to read; transitions are snappy and locked to music cues.
- Angle: From raw distress to verified paramedic in under 5 seconds with zero cognitive load.
- Hook: Dark canvas, glowing emerald badge, bold text, tactile SOS button dropping in on beat 1.60s.
- Outro / punchline: Bold typography "Dori (डोरी) — Zero Cognitive Load • Algorithmic Care".
- Avoid:
  - Generic SaaS language
  - Abstract filler visuals
  - Unrelated visual redesign

## Visual Identity
- Background: `#0A0A0A`
- Text: `#FFFFFF` / `#FAF9F6`
- Accent: `#059669` (Strong emerald) / `#2563EB` (Blue UI) / `#F59E0B` (Warning)
- Display font: `'Figtree', system-ui, sans-serif`
- Body font: `'Figtree', system-ui, sans-serif`
- Visual references from the project: The exact button CSS (`rounded-[44px] bg-primary shadow-btn-3d`), OTP digits (`otp-digit`), and glassmorphic card borders (`border-2 border-borderDark`).

## Storyboard
Use the storyboard in `brag-output-v2/brag-plan.md` as the creative contract.

Scene summary:
1. **Scene 1 (0.0s - 3.70s)**: Hook & SOS Button Drop (beat-locked at 1.60s).
2. **Scene 2 (3.70s - 8.96s)**: Ambient AI Triage & Speech-to-Intent Badges (beat grid 5.80s, 6.34s, 6.86s).
3. **Scene 3 (8.96s - 14.76s)**: Sunil Verma Dispatch & Zero-Trust OTP Handshake 4092 (verified at 12.65s).
4. **Scene 4 (14.76s - 17.91s)**: Cross-Border Family Hub real-time telemetry.
5. **Scene 5 (17.91s - 20.00s)**: Dori brand reveal and challenge landing.

## Audio
- Audio role: High-energy, modern rhythmic electronic groove.
- Audio arc: Tight intro build, energetic drum groove throughout triage and dispatch, triumphant resolution on logo.
- Music: `happy-beats-business-moves-vol-11-by-ende-dot-app.mp3`
- Music treatment: Plays from 0.0s to 20.0s, subtle fade out on final half second.
- Music cue guidance:
  - 1.60s (strong beat): Button drops
  - 3.70s (strong beat): Triage card transition
  - 5.80s, 6.34s, 6.86s (beat grid): Triage badge reveals
  - 8.96s (strong beat): Dispatch scene cut
  - 12.65s (strong beat): Verification checkmark pulse
  - 17.91s (strong beat): Final logo drop
- Audio-reactive treatment: Subtle breathing on the SOS button glow and status rings.
- SFX selection guidance: Tactile button clicks, soft UI blips, success chime.
- Audio files: `happy-beats-business-moves-vol-11-by-ende-dot-app.mp3` and UI SFX.

## Hyperframes Instructions
Build a standalone 1920x1080 composition in `brag-output-v2/composition/` with HTML, CSS (Tailwind), and GSAP. Run `npx hyperframes check` to validate before render.
