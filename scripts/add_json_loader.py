import json
import os

filepath = r'c:\Users\vaidik\Downloads\Projects\Bharat Innovation LPU\App\public\operator-console.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add Call IDs to callsData
content = content.replace('name: "Gurleen Kaur",', 'callId: "#1047",\n        name: "Gurleen Kaur",')
content = content.replace('name: "Rajesh Sharma",', 'callId: "#1048",\n        name: "Rajesh Sharma",')
content = content.replace('name: "Anita Mehra",', 'callId: "#1049",\n        name: "Anita Mehra",')
content = content.replace('name: "Sunita Gupta",', 'callId: "#1050",\n        name: "Sunita Gupta",')

# 2. Update renderCall to set callId
old_render = "      document.getElementById('card-name').innerText = data.name;"
new_render = "      document.getElementById('card-call-id').innerText = 'Call ' + (data.callId || '#XXXX');\n      document.getElementById('card-name').innerText = data.name;"
content = content.replace(old_render, new_render)

# 3. Add 'Load Script JSON' button to the header
header_insertion = '        <button id="themeToggle"'
upload_btn = '''        <label class="cursor-pointer text-[10px] font-black uppercase tracking-widest bg-blueUI/10 text-blueUI border-2 border-blueUI/20 px-4 py-2 rounded-[12px] hover:bg-blueUI/20 transition-colors mr-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Load Call JSON
          <input type="file" id="jsonUploader" accept=".json" class="hidden" onchange="loadCustomCall(event)">
        </label>
        <button id="themeToggle"'''
content = content.replace(header_insertion, upload_btn)

# 4. Add the loadCustomCall function to JS
js_logic = '''
    // -------------------------------------------------------
    // LOAD CUSTOM CALL
    // -------------------------------------------------------
    function loadCustomCall(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const json = JSON.parse(e.target.result);
          
          const newCall = {
            callId: '#' + Math.floor(1000 + Math.random() * 9000),
            name: json.caller_name || 'Imported Call',
            location: json.location || 'Unknown Location',
            urgencyText: json.urgency_level || 'Routine',
            urgencyColor: (json.urgency_level || '').toLowerCase() === 'emergency' ? 'alert' : ((json.urgency_level || '').toLowerCase() === 'urgent' ? 'warning' : 'blueUI'),
            issue: json.summary || json.reasoning || 'No summary provided',
            category: json.category || 'General',
            skill: json.required_skill || 'General Helper',
            time: 'ASAP',
            followup: json.followup_action || 'None',
            followupColor: 'blueUI',
            helperName: 'Auto-Assigned Helper',
            transcriptHtml: '<p class="text-sm italic text-slate-500 mb-4">Imported from JSON script output:</p><pre class="text-[10px]">' + JSON.stringify(json, null, 2) + '</pre>'
          };
          
          callsData.unshift(newCall);
          renderQueue();
          selectCall(0);
          
        } catch (err) {
          alert('Invalid JSON file');
          console.error(err);
        }
      };
      reader.readAsText(file);
    }
    
    function renderQueue() {
      const container = document.querySelector('.queue-scroll');
      container.innerHTML = ''; // clear existing items
      
      callsData.forEach((call, i) => {
        const timeStr = i === 0 ? 'Now' : (i*2) + ' min ago';
        const html = `
          <button onclick="selectCall(${i})" id="q-${i}" class="queue-card w-full text-left p-4 rounded-[16px] border-2 border-borderLight dark:border-borderDark bg-surfaceLight dark:bg-surfaceDark transition-all relative">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-slate-400">${timeStr}</span>
              <span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-${call.urgencyColor}/10 text-${call.urgencyColor} border border-${call.urgencyColor}/20">${call.urgencyText}</span>
            </div>
            <p class="text-base font-bold truncate">${call.name}</p>
            <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate mt-1">${call.issue}</p>
          </button>
        `;
        container.insertAdjacentHTML('beforeend', html);
      });
    }

    // -------------------------------------------------------
    // INIT
'''
content = content.replace("    // -------------------------------------------------------\n    // INIT", js_logic)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
