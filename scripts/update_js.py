import re

with open('public/operator-console.html', 'r', encoding='utf-8') as f:
    content = f.read()

new_js = """
    // -------------------------------------------------------
    // DATA FOR CALLS
    // -------------------------------------------------------
    const callsData = [
      {
        name: "Kaur Aunty",
        location: "Amritsar, Punjab",
        urgencyText: "Routine",
        urgencyColor: "blue",
        issue: "Video call screen is black. Audio works but camera shows nothing. Phone was dropped last week.",
        category: "Tech Help",
        skill: "Tech-savvy helper",
        time: "Tomorrow after 3:00 PM",
        followup: "Yes — Inform son",
        followupColor: "emerald",
        helperName: "Rajesh Kumar",
        transcriptHtml: `
          <p><span class="font-bold text-emerald-600 dark:text-emerald-400">Operator:</span> <span class="text-slate-600 dark:text-slate-300">Namaste aunty ji, main Riya bol rahi hoon. Kya madad chahiye?</span></p>
          <p><span class="font-bold text-blue-600 dark:text-blue-400">Parent:</span> <span class="text-slate-600 dark:text-slate-300">Beta, mere phone par video call nahi lag rahi. Bete ka call aata hai, awaaz aati hai par screen kaali dikhti hai.</span></p>
          <p><span class="font-bold text-emerald-600 dark:text-emerald-400">Operator:</span> <span class="text-slate-600 dark:text-slate-300">Achha, aapne camera ke liye koi setting badli thi kya?</span></p>
          <p><span class="font-bold text-blue-600 dark:text-blue-400">Parent:</span> <span class="text-slate-600 dark:text-slate-300">Pata nahi beta. Pichle hafte phone gir gaya tha, tab se yeh dikkat hai.</span></p>
          <p><span class="font-bold text-emerald-600 dark:text-emerald-400">Operator:</span> <span class="text-slate-600 dark:text-slate-300">Koi baat nahi, ek helper aayega jo phone theek se samjhata hai. Kal teen baje ke baad bhej du?</span></p>
          <p><span class="font-bold text-blue-600 dark:text-blue-400">Parent:</span> <span class="text-slate-600 dark:text-slate-300">Theek hai beta. Main aapke bete ko bhi bata dungi.</span></p>
        `
      },
      {
        name: "Sharma Uncle",
        location: "Lucknow, UP",
        urgencyText: "Urgent",
        urgencyColor: "amber",
        issue: "BP medicine refill needed. Current stock runs out tonight. Prescription is available.",
        category: "Medical Errand",
        skill: "Pharmacy runner",
        time: "Today before 8:00 PM",
        followup: "No",
        followupColor: "slate",
        helperName: "Amit Singh",
        transcriptHtml: `
          <p><span class="font-bold text-emerald-600 dark:text-emerald-400">Operator:</span> <span class="text-slate-600 dark:text-slate-300">Namaste uncle ji, main Riya bol rahi hoon. Bataiye.</span></p>
          <p><span class="font-bold text-blue-600 dark:text-blue-400">Parent:</span> <span class="text-slate-600 dark:text-slate-300">Beta meri BP ki goliyan khatam hone wali hain. Raat ko ek leni hai aur kal subah ke liye nahi hai.</span></p>
          <p><span class="font-bold text-emerald-600 dark:text-emerald-400">Operator:</span> <span class="text-slate-600 dark:text-slate-300">Theek hai uncle, dawa ka parcha hai aapke paas?</span></p>
          <p><span class="font-bold text-blue-600 dark:text-blue-400">Parent:</span> <span class="text-slate-600 dark:text-slate-300">Haan parcha toh idhar hi hai table par.</span></p>
          <p><span class="font-bold text-emerald-600 dark:text-emerald-400">Operator:</span> <span class="text-slate-600 dark:text-slate-300">Main abhi kisi ko bhejti hoon jo dawai le aayega. 8 baje se pehle aa jayegi.</span></p>
        `
      },
      {
        name: "Mehra Aunty",
        location: "New Delhi, Delhi",
        urgencyText: "Emergency",
        urgencyColor: "red",
        issue: "Chest pain, alone at home. Sweating and feeling dizzy.",
        category: "Medical Emergency",
        skill: "Ambulance / EMT",
        time: "Immediate (ASAP)",
        followup: "Yes — Call Daughter (Priya)",
        followupColor: "emerald",
        helperName: "Apollo Ambulance",
        transcriptHtml: `
          <p><span class="font-bold text-emerald-600 dark:text-emerald-400">Operator:</span> <span class="text-slate-600 dark:text-slate-300">Namaste aunty ji...</span></p>
          <p><span class="font-bold text-red-600 dark:text-red-400">Parent:</span> <span class="text-slate-600 dark:text-slate-300">Beta... mere seene mein bahut dard ho raha hai... saans lene mein takleef hai...</span></p>
          <p><span class="font-bold text-emerald-600 dark:text-emerald-400">Operator:</span> <span class="text-slate-600 dark:text-slate-300">Aunty aap ghabraiye mat, aap akele hain ghar par?</span></p>
          <p><span class="font-bold text-red-600 dark:text-red-400">Parent:</span> <span class="text-slate-600 dark:text-slate-300">Haan akeli hoon... chakkar aa rahe hain...</span></p>
          <p><span class="font-bold text-emerald-600 dark:text-emerald-400">Operator:</span> <span class="text-slate-600 dark:text-slate-300">Main turant ambulance bhej rahi hoon. Line par rahiye, main aapki beti ko bhi call lagati hoon.</span></p>
        `
      },
      {
        name: "Gupta Aunty",
        location: "Jaipur, Rajasthan",
        urgencyText: "Done",
        urgencyColor: "emerald",
        issue: "Geyser repair. Water is not heating and there is a slight leak.",
        category: "Home Repair",
        skill: "Plumber / Electrician",
        time: "Today at 4:00 PM",
        followup: "No",
        followupColor: "slate",
        helperName: "Vikram Plumber",
        transcriptHtml: `
          <p><span class="font-bold text-emerald-600 dark:text-emerald-400">Operator:</span> <span class="text-slate-600 dark:text-slate-300">Namaste aunty, kaise madad kar sakti hoon?</span></p>
          <p><span class="font-bold text-blue-600 dark:text-blue-400">Parent:</span> <span class="text-slate-600 dark:text-slate-300">Beta bathroom ka geyser kharab ho gaya hai, paani garam nahi ho raha. Aur thoda paani tapak bhi raha hai.</span></p>
          <p><span class="font-bold text-emerald-600 dark:text-emerald-400">Operator:</span> <span class="text-slate-600 dark:text-slate-300">Theek hai aunty, main ek plumber bhejti hoon sham 4 baje tak.</span></p>
          <p><span class="font-bold text-blue-600 dark:text-blue-400">Parent:</span> <span class="text-slate-600 dark:text-slate-300">Haan, bhej do. Main ghar par hi hoon.</span></p>
        `
      }
    ];

    let currentCallIndex = 0;

    // -------------------------------------------------------
    // QUEUE SELECTION & RENDER
    // -------------------------------------------------------
    function selectCall(index) {
      currentCallIndex = index;
      document.querySelectorAll('.queue-card').forEach((card, i) => {
        if (i === index) {
          card.classList.add('border-emerald-500', 'dark:border-emerald-600', 'bg-emerald-50', 'dark:bg-emerald-950/30');
          card.classList.remove('border-slate-200', 'dark:border-slate-700', 'bg-white', 'dark:bg-slate-800');
          card.setAttribute('aria-current', 'true');
        } else {
          card.classList.remove('border-emerald-500', 'dark:border-emerald-600', 'bg-emerald-50', 'dark:bg-emerald-950/30');
          card.classList.add('border-slate-200', 'dark:border-slate-700', 'bg-white', 'dark:bg-slate-800');
          card.removeAttribute('aria-current');
          if (!card.classList.contains('border-2')) {
            card.classList.remove('border-2');
          }
        }
      });
      renderCall(index);
    }

    function getUrgencyBadgeHtml(text, color) {
      return `<span class="px-3 py-1 rounded-full text-xs font-bold bg-${color}-100 dark:bg-${color}-900/50 text-${color}-700 dark:text-${color}-300 uppercase tracking-wide border border-${color}-200 dark:border-${color}-700">${text}</span>`;
    }

    function renderCall(index) {
      const data = callsData[index];
      
      document.getElementById('card-name').innerText = data.name;
      document.getElementById('card-location').innerText = data.location;
      document.getElementById('urgencyBadge').innerHTML = getUrgencyBadgeHtml(data.urgencyText, data.urgencyColor);
      document.getElementById('card-issue').innerText = data.issue;
      document.getElementById('card-category').innerText = data.category;
      document.getElementById('card-skill').innerText = data.skill;
      document.getElementById('card-time').innerText = data.time;
      
      const followupEl = document.getElementById('card-followup');
      followupEl.innerText = data.followup;
      followupEl.className = `text-sm font-semibold text-${data.followupColor}-700 dark:text-${data.followupColor}-400`;
      
      document.getElementById('card-transcript').innerHTML = data.transcriptHtml;
      
      const loc = data.location.split(',')[0];
      document.getElementById('searching-text').innerText = `Searching for available helpers near ${loc}...`;
      document.getElementById('matching-text').innerText = `Matching skill: ${data.skill}, available ${data.time.toLowerCase()}`;
      document.getElementById('matched-helper-name').innerText = `Matched: ${data.helperName}`;
      
      if (index === 3) {
        setDispatchState('dispatched');
      } else {
        setDispatchState('pending');
      }
    }
"""

replacement_js = """    // -------------------------------------------------------
    // QUEUE SELECTION (visual only for demo)
    // -------------------------------------------------------
    function selectCall(index) {
      document.querySelectorAll('.queue-card').forEach((card, i) => {
        if (i === index) {
          card.classList.add('border-emerald-500', 'dark:border-emerald-600', 'bg-emerald-50', 'dark:bg-emerald-950/30');
          card.classList.remove('border-slate-200', 'dark:border-slate-700', 'bg-white', 'dark:bg-slate-800');
          card.setAttribute('aria-current', 'true');
        } else {
          card.classList.remove('border-emerald-500', 'dark:border-emerald-600', 'bg-emerald-50', 'dark:bg-emerald-950/30');
          card.classList.add('border-slate-200', 'dark:border-slate-700', 'bg-white', 'dark:bg-slate-800');
          card.removeAttribute('aria-current');
          // Keep the border width consistent
          if (!card.classList.contains('border-2')) {
            card.classList.remove('border-2');
          }
        }
      });
    }"""

content = content.replace(replacement_js, new_js)

# I also need to add id="matched-helper-name" to the HTML
content = content.replace(
    '<p class="text-sm font-bold text-emerald-900 dark:text-emerald-200">Matched: Rajesh Kumar</p>',
    '<p id="matched-helper-name" class="text-sm font-bold text-emerald-900 dark:text-emerald-200">Matched: Rajesh Kumar</p>'
)

with open('public/operator-console.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('JavaScript replacements done.')
