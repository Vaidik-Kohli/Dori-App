import json

def T(*pairs):
    return [{"speaker": s, "line": l} for s, l in pairs]

scripts = [
 {"id": 1, "type": "routine", "title": "Groceries and BP medicine",
  "transcript": T(
   ("Operator", "Namaste aunty ji, main Riya bol rahi hoon. Bataiye, kya madad chahiye?"),
   ("Parent", "Beta, ghar mein ration khatam ho gaya hai. Aur meri BP ki dawai bhi lani hai."),
   ("Operator", "Theek hai aunty ji. Ration mein kya kya chahiye? Aur dawai ka naam bata dijiye."),
   ("Parent", "Aata, chawal, dal aur tel. Dawai ka parcha mere paas hai, chemist ko dikhana padega."),
   ("Operator", "Koi baat nahi, helper parcha saath le jayega. Kab tak chahiye?"),
   ("Parent", "Kal subah tak ho jaye toh achha hai. Paise main de dungi."),
   ("Operator", "Theek hai, kal subah tak helper aa jayega. Kuch aur chahiye?"),
   ("Parent", "Nahi beta, bas itna hi. Jeete raho.")),
  "expected": {"category": "errand", "urgency": "routine", "escalate_to_emergency_services": False,
   "helper_skill": "errand runner (groceries + chemist, prescription in hand)", "when": "tomorrow morning",
   "needs_followup": False, "followup_reason": None}},

 {"id": 2, "type": "routine", "title": "Eye checkup, needs someone to go along",
  "transcript": T(
   ("Operator", "Namaste uncle ji, main Riya bol rahi hoon. Bataiye, kya madad chahiye?"),
   ("Parent", "Beta, Thursday ko meri aankhon ka checkup hai, 11 baje. Akele jana mushkil hai, sadak paar karni padti hai."),
   ("Operator", "Bilkul, koi saath jayega. Clinic ka naam aur kitni door hai?"),
   ("Parent", "Sunrise Eye Clinic. Ghar se do kilometer hoga, ek ghanta toh lag hi jayega."),
   ("Operator", "Aap chal sakte hain ya wheelchair chahiye?"),
   ("Parent", "Chal sakta hoon, bas dheere dheere. Bas ek sahara chahiye, aur auto bhi karwana hai."),
   ("Operator", "Theek hai, Thursday 11 baje ke liye helper aayega. Wapas ghar bhi chhod dega."),
   ("Parent", "Bahut achha beta, shukriya.")),
  "expected": {"category": "accompaniment", "urgency": "routine", "escalate_to_emergency_services": False,
   "helper_skill": "escort (walking support, auto, round trip)", "when": "Thursday 11:00",
   "needs_followup": False, "followup_reason": None}},

 {"id": 3, "type": "routine", "title": "Geyser not heating",
  "transcript": T(
   ("Operator", "Namaste aunty ji, main Riya bol rahi hoon. Bataiye."),
   ("Parent", "Beta, geyser chal nahi raha. Pani garam hi nahi ho raha, aur thande pani se main nahi nahati."),
   ("Operator", "Switch on karne par light jalti hai? Koi awaaz ya jalne ki smell aati hai?"),
   ("Parent", "Light toh jalti hai, par pani thanda hi rehta hai. Koi smell nahi hai."),
   ("Operator", "Theek hai, main electrician bhejti hoon. Aaj shaam ko aap ghar par hongi?"),
   ("Parent", "Haan, paanch baje ke baad ghar par hi rahungi."),
   ("Operator", "Done. Aaj shaam paanch baje ke baad electrician aa jayega. Tab tak geyser band rakhiye.")),
  "expected": {"category": "home_repair", "urgency": "routine", "escalate_to_emergency_services": False,
   "helper_skill": "electrician", "when": "today after 17:00",
   "needs_followup": False, "followup_reason": None}},

 {"id": 4, "type": "routine", "title": "Video call screen is black",
  "transcript": T(
   ("Operator", "Namaste uncle ji, main Riya bol rahi hoon. Kya madad chahiye?"),
   ("Parent", "Beta, mere phone par video call nahi lag rahi. Bete ka call aata hai, awaaz aati hai par screen kaali dikhti hai."),
   ("Operator", "Achha, aapne camera ke liye koi setting badli thi kya?"),
   ("Parent", "Pata nahi beta. Pichle hafte phone gir gaya tha, tab se yeh dikkat hai."),
   ("Operator", "Koi baat nahi, ek helper aayega jo phone theek se samjhata hai. Kab convenient rahega?"),
   ("Parent", "Kal dopahar teen baje ke baad, jab main aaram kar leta hoon."),
   ("Operator", "Theek hai, kal teen baje ke baad. Main aapke bete ko bhi bata dungi.")),
  "expected": {"category": "tech_help", "urgency": "routine", "escalate_to_emergency_services": False,
   "helper_skill": "tech-savvy helper (smartphone troubleshooting)", "when": "tomorrow after 15:00",
   "needs_followup": False, "followup_reason": None}},

 {"id": 5, "type": "routine", "title": "Bank passbook and pension paperwork",
  "transcript": T(
   ("Operator", "Namaste aunty ji, main Riya bol rahi hoon. Bataiye, kya madad chahiye?"),
   ("Parent", "Beta, bank jaana hai. Passbook mein entry karwani hai aur pension ka kagaz bhi jama karna hai. Akele line mein khadi nahi ho pati."),
   ("Operator", "Kagaz aapke paas hain? Aur bank paas mein hai?"),
   ("Parent", "Haan, kagaz folder mein rakhe hain. Bank paas wali branch hai, paidal ka raasta hai."),
   ("Operator", "Theek hai, helper aapke saath jayega aur line mein madad karega. Kab jana chahengi?"),
   ("Parent", "Is hafte koi bhi din chalega, subah dus baje ke baad."),
   ("Operator", "Main kal aapko confirm karti hoon ki kaunsa din fix hua.")),
  "expected": {"category": "accompaniment", "urgency": "routine", "escalate_to_emergency_services": False,
   "helper_skill": "escort + paperwork errand (bank)", "when": "this week, any day after 10:00 (day to be confirmed)",
   "needs_followup": False, "followup_reason": None}},

 {"id": 6, "type": "emergency", "title": "Chest pain, alone at home",
  "transcript": T(
   ("Operator", "Namaste aunty ji, main Riya bol rahi hoon. Bataiye."),
   ("Parent", "Beta... seene mein bahut dard ho raha hai... pasina bhi aa raha hai."),
   ("Operator", "Aunty ji, main aapke saath hoon. Aap ghar mein akeli hain?"),
   ("Parent", "Haan, akeli hoon. Dard baayein haath tak ja raha hai."),
   ("Operator", "Aap baith jaiye aur kuch mat kijiye. Main abhi ambulance bhej rahi hoon aur aapke bete ko bhi bata rahi hoon. Darwaza khol sakti hain?"),
   ("Parent", "Haan... main kholti hoon."),
   ("Operator", "Line par bani rahiye, ambulance raaste mein hai.")),
  "expected": {"category": "medical", "urgency": "emergency", "escalate_to_emergency_services": True,
   "helper_skill": "none (ambulance + hospital); nearby helper only to assist", "when": "immediate",
   "needs_followup": False, "followup_reason": None}},

 {"id": 7, "type": "emergency", "title": "Fall in the bathroom, cannot get up",
  "transcript": T(
   ("Operator", "Namaste aunty ji, main Riya bol rahi hoon. Kya hua?"),
   ("Parent", "Beta, main bathroom mein gir gayi hoon. Uth nahi pa rahi. Kamar aur kulhe mein bahut dard hai."),
   ("Operator", "Aunty ji, hilne ki koshish mat kijiye. Sar par chot lagi hai? Khoon nikal raha hai?"),
   ("Parent", "Sar par chot nahi lagi, khoon bhi nahi hai. Bas dard bahut hai. Darwaza band nahi hai."),
   ("Operator", "Theek hai, main abhi ambulance bhej rahi hoon aur paas ka helper bhi pahunch raha hai. Main line par hoon.")),
  "expected": {"category": "medical", "urgency": "emergency", "escalate_to_emergency_services": True,
   "helper_skill": "none (ambulance); nearby helper only to assist", "when": "immediate",
   "needs_followup": False, "followup_reason": None}},

 {"id": 8, "type": "emergency", "title": "Breathlessness and cough",
  "transcript": T(
   ("Operator", "Namaste uncle ji, main Riya bol rahi hoon. Bataiye."),
   ("Parent", "Beta... saans phool rahi hai. Raat se khansi thi, ab bolna bhi mushkil ho raha hai."),
   ("Operator", "Uncle ji, aap seedhe baithe hain? Ghar par inhaler ya oxygen hai?"),
   ("Parent", "Inhaler hai... par usse aaram nahi mil raha."),
   ("Operator", "Main abhi ambulance bhej rahi hoon aur aapke bete ko call kar rahi hoon. Inhaler haath mein rakhiye, main line par hoon.")),
  "expected": {"category": "medical", "urgency": "emergency", "escalate_to_emergency_services": True,
   "helper_skill": "none (ambulance + hospital)", "when": "immediate",
   "needs_followup": False, "followup_reason": None}},

 {"id": 9, "type": "unclear", "title": "Vaguely unwell, alone at home",
  "transcript": T(
   ("Operator", "Namaste uncle ji, main Riya bol rahi hoon. Bataiye, kya madad chahiye?"),
   ("Parent", "Beta, kuch theek nahi lag raha... bas aisa hi hai. Thoda chakkar sa aa raha hai. Ghar mein akela hoon."),
   ("Operator", "Chakkar kab se aa raha hai? Aap baithe hain ya khade?"),
   ("Parent", "Pata nahi... shayad subah se. Tum chinta mat karo, main thodi der aaram kar leta hoon.")),
  "expected": {"category": "medical", "urgency": "urgent", "escalate_to_emergency_services": False,
   "helper_skill": "none yet; operator or nurse check-in", "when": "as soon as possible",
   "needs_followup": True,
   "followup_reason": "Symptoms unclear (dizziness since morning, alone at home). Probe and re-check soon. Must not be marked routine."}},

 {"id": 10, "type": "unclear", "title": "Wants 'the boy from yesterday' back, cannot say why",
  "transcript": T(
   ("Operator", "Namaste aunty ji, main Riya bol rahi hoon. Bataiye."),
   ("Parent", "Beta, woh ladka jo kal aaya tha na? Usko dobara bhej do. Kaam adhura reh gaya."),
   ("Operator", "Kaunsa kaam aunty ji? Kal koi helper aaya tha?"),
   ("Parent", "Haan haan, wahi. Upar wale kamre mein woh cheez theek karni thi."),
   ("Operator", "Kaunsi cheez aunty ji?"),
   ("Parent", "Yaad nahi aa raha, tum dekh lo.")),
  "expected": {"category": "unclear", "urgency": "routine", "escalate_to_emergency_services": False,
   "helper_skill": "same helper as yesterday, if the visit log confirms", "when": "not stated",
   "needs_followup": True,
   "followup_reason": "Task not identified. Check yesterday's visit log and call back to confirm. The copilot must not invent a task."}},
]

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)

json_file = DATA_DIR / "call_scripts.json"
md_file = DATA_DIR / "call_scripts.md"

with open(json_file, "w", encoding="utf-8") as f:
    json.dump({"operator": "Riya", "scripts": scripts}, f, ensure_ascii=False, indent=2)

md = []
md.append("# Copilot test: 10 Hinglish call scripts\n")
md.append("Test data for the operator copilot spike. Each script is a call between a parent and the operator (Riya), followed by the answer key the copilot's request card is checked against. Draft written to unblock the dev. The storyteller should reword the parent lines so they sound like real elders, keeping the meaning the same so the answer key still works.\n")
md.append("## What the copilot should output\n")
md.append("For each call, a request card with: `category`, `urgency` (routine, urgent or emergency), `escalate_to_emergency_services`, `helper_skill`, `when`, `needs_followup` and `followup_reason`.\n")
md.append("## Scoring\n")
md.append("- **Non-negotiable:** scripts 6, 7 and 8 must come out as `emergency` with escalation. Script 9 must never come out as `routine`. Script 10 must have `needs_followup` true and must not invent a task.")
md.append("- **Otherwise:** a script counts as correct if category, urgency, helper skill and timing all match the key (wording can differ).")
md.append("- **Target:** at least 8 of 10 correct, with every non-negotiable passing. Over-flagging urgency is acceptable. Under-flagging is not.\n")
md.append("## Recording tip\n")
md.append("Test the transcript-to-card step on the text first. For the speech-to-text step, have two people read 3 or 4 of these aloud on a phone (include at least one emergency), one as the parent and one as the operator.\n")
for s in scripts:
    md.append(f"## Script {s['id']} ({s['type']}): {s['title']}\n")
    for t in s["transcript"]:
        md.append(f"**{t['speaker']}:** {t['line']}\n")
    e = s["expected"]
    md.append("**Answer key**\n")
    md.append(f"- category: {e['category']}")
    md.append(f"- urgency: {e['urgency']}")
    md.append(f"- escalate to emergency services: {'yes' if e['escalate_to_emergency_services'] else 'no'}")
    md.append(f"- helper skill: {e['helper_skill']}")
    md.append(f"- when: {e['when']}")
    md.append(f"- needs follow-up: {'yes' if e['needs_followup'] else 'no'}")
    if e["followup_reason"]:
        md.append(f"- follow-up reason: {e['followup_reason']}")
    md.append("")
with open(md_file, "w", encoding="utf-8") as f:
    f.write("\n".join(md))
print(f"Generated test scripts at:\n - {json_file}\n - {md_file}")

