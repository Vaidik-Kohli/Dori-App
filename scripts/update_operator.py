import re

with open('public/operator-console.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the hardcoded callsData and logic
new_js = """
    // -------------------------------------------------------
    // DISPATCH STATE MACHINE
    // -------------------------------------------------------
    // States: 'pending' | 'searching' | 'dispatched' | 'en_route' | 'arrived' | 'completed'
    // -------------------------------------------------------

    let dispatchState = 'pending';

    function setDispatchState(state) {
      dispatchState = state;
      const pendingEl = document.getElementById('state-pending');
      const searchEl = document.getElementById('state-searching');
      const dispatchEl = document.getElementById('state-dispatched');
      
      if(pendingEl) pendingEl.classList.toggle('hidden', state !== 'pending');
      if(searchEl) searchEl.classList.toggle('hidden', state !== 'searching');
      if(dispatchEl) {
        dispatchEl.classList.toggle('hidden', !['dispatched', 'en_route', 'arrived', 'completed'].includes(state));
        if (state !== 'pending' && state !== 'searching') {
            const statusBadge = dispatchEl.querySelector('span');
            if(statusBadge) {
                statusBadge.innerText = state.replace('_', ' ').toUpperCase();
            }
        }
      }
    }

    async function startDispatch() {
      const activeCall = callsData[currentCallIndex];
      if (!activeCall) return;
      
      setDispatchState('searching');
      
      // Simulate matching delay
      setTimeout(async () => {
        try {
          const res = await fetch('/api/jobs/' + activeCall.id + '/status', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'dispatched' })
          });
          if (res.ok) {
              setDispatchState('dispatched');
              fetchJobs(); // Refresh queue
          } else {
              setDispatchState('pending');
              alert('Failed to dispatch');
          }
        } catch (e) {
            console.error(e);
            setDispatchState('pending');
        }
      }, 1500);
    }

    function resetDispatch() {
      setDispatchState('pending');
    }

    // -------------------------------------------------------
    // LIVE DATA POLLING
    // -------------------------------------------------------
    let callsData = [];
    let currentCallIndex = 0;

    async function fetchJobs() {
        try {
            const res = await fetch('/api/jobs');
            const jobs = await res.json();
            
            // If data changed, re-render
            if (JSON.stringify(jobs) !== JSON.stringify(callsData)) {
                callsData = jobs;
                renderQueue();
                if (callsData.length > 0) {
                    // Ensure valid index
                    if (currentCallIndex >= callsData.length) currentCallIndex = 0;
                    selectCall(currentCallIndex);
                }
            }
        } catch (err) {
            console.error('Polling failed:', err);
        }
    }

    // -------------------------------------------------------
    // QUEUE SELECTION & RENDER
    // -------------------------------------------------------
    function selectCall(index) {
      if (callsData.length === 0) return;
      currentCallIndex = index;
      document.querySelectorAll('.queue-card').forEach((card, i) => {
        if (i === index) {
          card.classList.remove('border-borderLight', 'dark:border-borderDark');
          card.classList.add('border-primary');
          card.setAttribute('aria-current', 'true');
          
          if (!card.querySelector('.active-indicator')) {
            const indicator = document.createElement('div');
            indicator.className = 'active-indicator absolute left-0 top-0 bottom-0 w-1.5 bg-primary';
            card.appendChild(indicator);
            card.classList.add('relative', 'overflow-hidden');
          }
        } else {
          card.classList.remove('border-primary');
          card.classList.add('border-borderLight', 'dark:border-borderDark');
          card.removeAttribute('aria-current');
          
          const indicator = card.querySelector('.active-indicator');
          if (indicator) {
            indicator.remove();
          }
        }
      });
      renderCall(index);
    }

    function getUrgencyColor(level) {
        const u = (level || '').toLowerCase();
        if (u === 'emergency') return 'alert';
        if (u === 'urgent') return 'warning';
        if (u === 'done' || u === 'completed') return 'primary';
        return 'blueUI';
    }

    function getUrgencyBadgeHtml(text, color) {
      return `<span class="px-4 py-1.5 rounded-full text-xs font-black bg-${color}/10 text-${color} uppercase tracking-widest border border-${color}/20">${text}</span>`;
    }

    function renderCall(index) {
      if (callsData.length === 0) return;
      const data = callsData[index];
      
      const uColor = getUrgencyColor(data.urgency_level);

      document.getElementById('card-call-id').innerText = 'Call ' + (data.call_id || '#XXXX');
      document.getElementById('card-name').innerText = data.caller_name;
      document.getElementById('card-location').innerText = data.location;
      document.getElementById('urgencyBadge').innerHTML = getUrgencyBadgeHtml(data.urgency_level, uColor);
      document.getElementById('card-issue').innerText = data.summary;
      document.getElementById('card-category').innerText = data.category;
      document.getElementById('card-skill').innerText = data.required_skill;
      
      const timeStr = new Date(data.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      document.getElementById('card-time').innerText = timeStr;
      
      const followupEl = document.getElementById('card-followup');
      followupEl.innerText = data.followup_action || 'None';
      
      document.getElementById('card-transcript').innerHTML = `
        <p class="text-sm italic text-slate-500 mb-4">Extracted Data:</p>
        <pre class="text-[10px] whitespace-pre-wrap">${JSON.stringify(data, null, 2)}</pre>
      `;
      
      const loc = data.location.split(',')[0];
      const searchEl = document.getElementById('searching-text');
      if (searchEl) searchEl.innerText = `Searching for available helpers near ${loc}...`;
      
      const matchEl = document.getElementById('matching-text');
      if (matchEl) matchEl.innerText = `Matching skill: ${data.required_skill}`;
      
      setDispatchState(data.status);
    }

    // -------------------------------------------------------
    // DARK MODE / THEME TOGGLE
    // -------------------------------------------------------
    function applyTheme(theme) {
      const sunIcon = document.getElementById('iconSun');
      const moonIcon = document.getElementById('iconMoon');

      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        if (sunIcon) sunIcon.classList.remove('hidden');
        if (moonIcon) moonIcon.classList.add('hidden');
      } else {
        document.documentElement.classList.remove('dark');
        if (sunIcon) sunIcon.classList.add('hidden');
        if (moonIcon) moonIcon.classList.remove('hidden');
      }
    }

    function toggleTheme() {
      const isDark = document.documentElement.classList.contains('dark');
      const nextTheme = isDark ? 'light' : 'dark';
      localStorage.setItem('bharatcare-theme', nextTheme);
      applyTheme(nextTheme);
    }

    // -------------------------------------------------------
    // LOAD CUSTOM CALL
    // -------------------------------------------------------
    function loadCustomCall(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = async function(e) {
        try {
          const json = JSON.parse(e.target.result);
          
          const payload = {
            caller_name: json.caller_name || 'Imported Call',
            location: json.location || 'Unknown Location',
            urgency_level: json.urgency_level || 'Routine',
            category: json.category || 'General',
            required_skill: json.required_skill || 'General Helper',
            summary: json.summary || json.reasoning || 'No summary',
            followup_action: json.followup_action || 'None',
            escalate_to_emergency: json.escalate_to_emergency || false
          };
          
          const res = await fetch('/api/jobs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          
          if (res.ok) {
            await fetchJobs();
            selectCall(0);
          }
          
        } catch (err) {
          alert('Invalid JSON file');
          console.error(err);
        }
      };
      reader.readAsText(file);
    }
    
    function renderQueue() {
      const container = document.querySelector('.queue-scroll');
      if (!container) return;
      container.innerHTML = '';
      
      callsData.forEach((call, i) => {
        const timeStr = new Date(call.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const uColor = getUrgencyColor(call.urgency_level);
        const html = `
          <button onclick="selectCall(${i})" id="q-${i}" class="queue-card w-full text-left p-4 rounded-[16px] border-2 border-borderLight dark:border-borderDark bg-surfaceLight dark:bg-surfaceDark transition-all relative mb-3">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-slate-400">${timeStr}</span>
              <span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-${uColor}/10 text-${uColor} border border-${uColor}/20">${call.urgency_level}</span>
            </div>
            <p class="text-base font-bold truncate">${call.caller_name}</p>
            <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate mt-1">${call.summary}</p>
          </button>
        `;
        container.insertAdjacentHTML('beforeend', html);
      });
    }

    // -------------------------------------------------------
    // INIT
    // -------------------------------------------------------
    document.addEventListener('keydown', async (e) => {
      if (e.key === 'D' && e.shiftKey) {
        if (dispatchState === 'pending') {
            await startDispatch();
        }
      }
    });

    (function init() {
      const savedTheme = localStorage.getItem('bharatcare-theme') ||
        (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      applyTheme(savedTheme);
      
      // Initial fetch and start polling
      fetchJobs();
      setInterval(fetchJobs, 2000);
    })();
"""

start_idx = content.find('    // -------------------------------------------------------\n    // DISPATCH STATE MACHINE')
end_idx = content.find('</script>', start_idx)

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + new_js + '\n  ' + content[end_idx:]
    with open('public/operator-console.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
else:
    print("Could not find script block")
