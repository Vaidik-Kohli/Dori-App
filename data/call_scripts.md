# Copilot test: 10 Hinglish call scripts

Test data for the operator copilot spike. Each script is a call between a parent and the operator (Riya), followed by the answer key the copilot's request card is checked against. Draft written to unblock the dev. The storyteller should reword the parent lines so they sound like real elders, keeping the meaning the same so the answer key still works.

## What the copilot should output

For each call, a request card with: `category`, `urgency` (routine, urgent or emergency), `escalate_to_emergency_services`, `helper_skill`, `when`, `needs_followup` and `followup_reason`.

## Scoring

- **Non-negotiable:** scripts 6, 7 and 8 must come out as `emergency` with escalation. Script 9 must never come out as `routine`. Script 10 must have `needs_followup` true and must not invent a task.
- **Otherwise:** a script counts as correct if category, urgency, helper skill and timing all match the key (wording can differ).
- **Target:** at least 8 of 10 correct, with every non-negotiable passing. Over-flagging urgency is acceptable. Under-flagging is not.

## Recording tip

Test the transcript-to-card step on the text first. For the speech-to-text step, have two people read 3 or 4 of these aloud on a phone (include at least one emergency), one as the parent and one as the operator.

## Script 1 (routine): Groceries and BP medicine

**Operator:** Namaste aunty ji, main Riya bol rahi hoon. Bataiye, kya madad chahiye?

**Parent:** Beta, ghar mein ration khatam ho gaya hai. Aur meri BP ki dawai bhi lani hai.

**Operator:** Theek hai aunty ji. Ration mein kya kya chahiye? Aur dawai ka naam bata dijiye.

**Parent:** Aata, chawal, dal aur tel. Dawai ka parcha mere paas hai, chemist ko dikhana padega.

**Operator:** Koi baat nahi, helper parcha saath le jayega. Kab tak chahiye?

**Parent:** Kal subah tak ho jaye toh achha hai. Paise main de dungi.

**Operator:** Theek hai, kal subah tak helper aa jayega. Kuch aur chahiye?

**Parent:** Nahi beta, bas itna hi. Jeete raho.

**Answer key**

- category: errand
- urgency: routine
- escalate to emergency services: no
- helper skill: errand runner (groceries + chemist, prescription in hand)
- when: tomorrow morning
- needs follow-up: no

## Script 2 (routine): Eye checkup, needs someone to go along

**Operator:** Namaste uncle ji, main Riya bol rahi hoon. Bataiye, kya madad chahiye?

**Parent:** Beta, Thursday ko meri aankhon ka checkup hai, 11 baje. Akele jana mushkil hai, sadak paar karni padti hai.

**Operator:** Bilkul, koi saath jayega. Clinic ka naam aur kitni door hai?

**Parent:** Sunrise Eye Clinic. Ghar se do kilometer hoga, ek ghanta toh lag hi jayega.

**Operator:** Aap chal sakte hain ya wheelchair chahiye?

**Parent:** Chal sakta hoon, bas dheere dheere. Bas ek sahara chahiye, aur auto bhi karwana hai.

**Operator:** Theek hai, Thursday 11 baje ke liye helper aayega. Wapas ghar bhi chhod dega.

**Parent:** Bahut achha beta, shukriya.

**Answer key**

- category: accompaniment
- urgency: routine
- escalate to emergency services: no
- helper skill: escort (walking support, auto, round trip)
- when: Thursday 11:00
- needs follow-up: no

## Script 3 (routine): Geyser not heating

**Operator:** Namaste aunty ji, main Riya bol rahi hoon. Bataiye.

**Parent:** Beta, geyser chal nahi raha. Pani garam hi nahi ho raha, aur thande pani se main nahi nahati.

**Operator:** Switch on karne par light jalti hai? Koi awaaz ya jalne ki smell aati hai?

**Parent:** Light toh jalti hai, par pani thanda hi rehta hai. Koi smell nahi hai.

**Operator:** Theek hai, main electrician bhejti hoon. Aaj shaam ko aap ghar par hongi?

**Parent:** Haan, paanch baje ke baad ghar par hi rahungi.

**Operator:** Done. Aaj shaam paanch baje ke baad electrician aa jayega. Tab tak geyser band rakhiye.

**Answer key**

- category: home_repair
- urgency: routine
- escalate to emergency services: no
- helper skill: electrician
- when: today after 17:00
- needs follow-up: no

## Script 4 (routine): Video call screen is black

**Operator:** Namaste uncle ji, main Riya bol rahi hoon. Kya madad chahiye?

**Parent:** Beta, mere phone par video call nahi lag rahi. Bete ka call aata hai, awaaz aati hai par screen kaali dikhti hai.

**Operator:** Achha, aapne camera ke liye koi setting badli thi kya?

**Parent:** Pata nahi beta. Pichle hafte phone gir gaya tha, tab se yeh dikkat hai.

**Operator:** Koi baat nahi, ek helper aayega jo phone theek se samjhata hai. Kab convenient rahega?

**Parent:** Kal dopahar teen baje ke baad, jab main aaram kar leta hoon.

**Operator:** Theek hai, kal teen baje ke baad. Main aapke bete ko bhi bata dungi.

**Answer key**

- category: tech_help
- urgency: routine
- escalate to emergency services: no
- helper skill: tech-savvy helper (smartphone troubleshooting)
- when: tomorrow after 15:00
- needs follow-up: no

## Script 5 (routine): Bank passbook and pension paperwork

**Operator:** Namaste aunty ji, main Riya bol rahi hoon. Bataiye, kya madad chahiye?

**Parent:** Beta, bank jaana hai. Passbook mein entry karwani hai aur pension ka kagaz bhi jama karna hai. Akele line mein khadi nahi ho pati.

**Operator:** Kagaz aapke paas hain? Aur bank paas mein hai?

**Parent:** Haan, kagaz folder mein rakhe hain. Bank paas wali branch hai, paidal ka raasta hai.

**Operator:** Theek hai, helper aapke saath jayega aur line mein madad karega. Kab jana chahengi?

**Parent:** Is hafte koi bhi din chalega, subah dus baje ke baad.

**Operator:** Main kal aapko confirm karti hoon ki kaunsa din fix hua.

**Answer key**

- category: accompaniment
- urgency: routine
- escalate to emergency services: no
- helper skill: escort + paperwork errand (bank)
- when: this week, any day after 10:00 (day to be confirmed)
- needs follow-up: no

## Script 6 (emergency): Chest pain, alone at home

**Operator:** Namaste aunty ji, main Riya bol rahi hoon. Bataiye.

**Parent:** Beta... seene mein bahut dard ho raha hai... pasina bhi aa raha hai.

**Operator:** Aunty ji, main aapke saath hoon. Aap ghar mein akeli hain?

**Parent:** Haan, akeli hoon. Dard baayein haath tak ja raha hai.

**Operator:** Aap baith jaiye aur kuch mat kijiye. Main abhi ambulance bhej rahi hoon aur aapke bete ko bhi bata rahi hoon. Darwaza khol sakti hain?

**Parent:** Haan... main kholti hoon.

**Operator:** Line par bani rahiye, ambulance raaste mein hai.

**Answer key**

- category: medical
- urgency: emergency
- escalate to emergency services: yes
- helper skill: none (ambulance + hospital); nearby helper only to assist
- when: immediate
- needs follow-up: no

## Script 7 (emergency): Fall in the bathroom, cannot get up

**Operator:** Namaste aunty ji, main Riya bol rahi hoon. Kya hua?

**Parent:** Beta, main bathroom mein gir gayi hoon. Uth nahi pa rahi. Kamar aur kulhe mein bahut dard hai.

**Operator:** Aunty ji, hilne ki koshish mat kijiye. Sar par chot lagi hai? Khoon nikal raha hai?

**Parent:** Sar par chot nahi lagi, khoon bhi nahi hai. Bas dard bahut hai. Darwaza band nahi hai.

**Operator:** Theek hai, main abhi ambulance bhej rahi hoon aur paas ka helper bhi pahunch raha hai. Main line par hoon.

**Answer key**

- category: medical
- urgency: emergency
- escalate to emergency services: yes
- helper skill: none (ambulance); nearby helper only to assist
- when: immediate
- needs follow-up: no

## Script 8 (emergency): Breathlessness and cough

**Operator:** Namaste uncle ji, main Riya bol rahi hoon. Bataiye.

**Parent:** Beta... saans phool rahi hai. Raat se khansi thi, ab bolna bhi mushkil ho raha hai.

**Operator:** Uncle ji, aap seedhe baithe hain? Ghar par inhaler ya oxygen hai?

**Parent:** Inhaler hai... par usse aaram nahi mil raha.

**Operator:** Main abhi ambulance bhej rahi hoon aur aapke bete ko call kar rahi hoon. Inhaler haath mein rakhiye, main line par hoon.

**Answer key**

- category: medical
- urgency: emergency
- escalate to emergency services: yes
- helper skill: none (ambulance + hospital)
- when: immediate
- needs follow-up: no

## Script 9 (unclear): Vaguely unwell, alone at home

**Operator:** Namaste uncle ji, main Riya bol rahi hoon. Bataiye, kya madad chahiye?

**Parent:** Beta, kuch theek nahi lag raha... bas aisa hi hai. Thoda chakkar sa aa raha hai. Ghar mein akela hoon.

**Operator:** Chakkar kab se aa raha hai? Aap baithe hain ya khade?

**Parent:** Pata nahi... shayad subah se. Tum chinta mat karo, main thodi der aaram kar leta hoon.

**Answer key**

- category: medical
- urgency: urgent
- escalate to emergency services: no
- helper skill: none yet; operator or nurse check-in
- when: as soon as possible
- needs follow-up: yes
- follow-up reason: Symptoms unclear (dizziness since morning, alone at home). Probe and re-check soon. Must not be marked routine.

## Script 10 (unclear): Wants 'the boy from yesterday' back, cannot say why

**Operator:** Namaste aunty ji, main Riya bol rahi hoon. Bataiye.

**Parent:** Beta, woh ladka jo kal aaya tha na? Usko dobara bhej do. Kaam adhura reh gaya.

**Operator:** Kaunsa kaam aunty ji? Kal koi helper aaya tha?

**Parent:** Haan haan, wahi. Upar wale kamre mein woh cheez theek karni thi.

**Operator:** Kaunsi cheez aunty ji?

**Parent:** Yaad nahi aa raha, tum dekh lo.

**Answer key**

- category: unclear
- urgency: routine
- escalate to emergency services: no
- helper skill: same helper as yesterday, if the visit log confirms
- when: not stated
- needs follow-up: yes
- follow-up reason: Task not identified. Check yesterday's visit log and call back to confirm. The copilot must not invent a task.
