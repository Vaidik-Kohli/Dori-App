import re

with open('public/helper-app.html', 'r', encoding='utf-8') as f:
    helper = f.read()

script_to_inject = """    // -------------------------------------------------------
    // LIVE DB POLLING
    // -------------------------------------------------------
    let activeJobId = null;
    let lastStatus = null;

    async function pollActiveJob() {
      try {
        const res = await fetch('/api/jobs/active');
        const job = await res.json();
        
        if (job && job.status === 'dispatched') {
            activeJobId = job.id;
            if (lastStatus !== 'dispatched') {
                lastStatus = 'dispatched';
                
                if (typeof showState === 'function') {
                    showState(2);
                }
                
                const nriNameEl = document.querySelector('[data-en="Connected"]');
                if (nriNameEl) nriNameEl.innerText = "Dispatching to " + job.caller_name;
            }
        } else if (!job || job.status === 'completed' || job.status === 'pending') {
            if (lastStatus === 'dispatched') {
                lastStatus = null;
                activeJobId = null;
                if (typeof showState === 'function') {
                    showState(1);
                }
            }
        }
      } catch (e) {
        console.error("Polling error:", e);
      }
    }

    setInterval(pollActiveJob, 2000);

    async function updateJobStatus(status) {
        // Optimistically advance UI for demo purposes immediately
        if (status === 'en_route') {
            showState(3); // Go to OTP verification state
            const completeBtn = document.getElementById('completeBtn');
            if(completeBtn) {
                completeBtn.classList.remove('pointer-events-none', 'bg-borderLight', 'dark:bg-borderDark', 'text-slate-400');
                completeBtn.classList.add('bg-primary', 'text-white', 'shadow-btn-3d');
            }
        } else if (status === 'completed') {
            showState(1); // Go back to idle
        }

        if (!activeJobId) {
            console.log("No active job to update.");
            return;
        }
        try {
            await fetch('/api/jobs/' + activeJobId + '/status', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
        } catch (e) {
            console.error("Failed to update status", e);
        }
    }
"""

helper = helper.replace('})();// -------------------------------------------------------', '})();\n\n' + script_to_inject)

with open('public/helper-app.html', 'w', encoding='utf-8') as f:
    f.write(helper)
