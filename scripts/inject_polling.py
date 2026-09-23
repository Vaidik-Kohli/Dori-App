import re

def inject_polling(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    polling_js = """
    // -------------------------------------------------------
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
                
                // If there's a switchState function, transition to State 2
                if (typeof switchState === 'function') {
                    switchState(2);
                }
                
                // Try to populate names if elements exist
                const nriNameEl = document.querySelector('[data-en="Connected"]');
                if (nriNameEl) nriNameEl.innerText = "Dispatching to " + job.caller_name;
            }
        } else if (!job || job.status === 'completed' || job.status === 'pending') {
            if (lastStatus === 'dispatched') {
                lastStatus = null;
                activeJobId = null;
                if (typeof switchState === 'function') {
                    switchState(1);
                }
            }
        }
      } catch (e) {
        console.error("Polling error:", e);
      }
    }

    setInterval(pollActiveJob, 2000);
"""

    if "LIVE DB POLLING" not in content:
        content = content.replace('</script>', polling_js + '\n</script>')
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

inject_polling(r'c:\Users\vaidik\Downloads\Projects\Bharat Innovation LPU\App\public\helper-app.html')
inject_polling(r'c:\Users\vaidik\Downloads\Projects\Bharat Innovation LPU\App\public\nri-app.html')
