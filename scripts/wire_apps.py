import re

with open('public/helper-app.html', 'r', encoding='utf-8') as f:
    helper = f.read()

# Make sure updateJobStatus actually exists in JS
update_js = """
    async function updateJobStatus(status) {
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
            
            // Advance UI based on status
            if (status === 'en_route') {
                showState(3); // Go to OTP verification state
                // Enable complete button
                const completeBtn = document.getElementById('completeBtn');
                if(completeBtn) {
                    completeBtn.classList.remove('pointer-events-none', 'bg-borderLight', 'dark:bg-borderDark', 'text-slate-400');
                    completeBtn.classList.add('bg-primary', 'text-white', 'shadow-btn-3d');
                }
            } else if (status === 'completed') {
                showState(1); // Go back to idle
            }
        } catch (e) {
            console.error("Failed to update status", e);
        }
    }
"""

if 'async function updateJobStatus' not in helper:
    helper = helper.replace('// LIVE DB POLLING', update_js + '\n    // LIVE DB POLLING')

# Fix accept job button onclick
helper = helper.replace('Accept Job\n            </button>', 'Accept Job\n            </button>').replace('<button class="flex-1 h-[72px] rounded-[24px] bg-primary text-white shadow-btn-3d text-lg font-black tracking-wide flex flex-col items-center justify-center gap-1">', '<button onclick="updateJobStatus(\'en_route\')" class="flex-1 h-[72px] rounded-[24px] bg-primary text-white shadow-btn-3d text-lg font-black tracking-wide flex flex-col items-center justify-center gap-1">')


with open('public/helper-app.html', 'w', encoding='utf-8') as f:
    f.write(helper)

# Dashboard / Parent interface integration
with open('public/dashboard.html', 'r', encoding='utf-8') as f:
    dash = f.read()

dash_polling = """
    let dashPollInterval;
    let dashActiveJobId = null;

    async function pollJobStatus() {
        if (!dashActiveJobId) return;
        try {
            const res = await fetch('/api/jobs');
            const jobs = await res.json();
            const myJob = jobs.find(j => j.id === dashActiveJobId);
            
            if (myJob) {
                if (myJob.status === 'dispatched' || myJob.status === 'en_route') {
                    if (appState !== 'helper_assigned') {
                        setState('helper_assigned');
                    }
                } else if (myJob.status === 'completed') {
                    setState('idle');
                    dashActiveJobId = null;
                }
            }
        } catch(e) {
            console.error(e);
        }
    }

    async function postEmergencyJob() {
        try {
            const res = await fetch('/api/jobs', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    caller_name: "Parent Device",
                    location: "Unknown Location",
                    urgency_level: "Emergency",
                    category: "Medical",
                    required_skill: "Emergency Helper",
                    summary: "SOS button pressed on Parent Device.",
                    followup_action: "Call immediately",
                    escalate_to_emergency: true
                })
            });
            const data = await res.json();
            if (data.id) {
                dashActiveJobId = data.id;
                dashPollInterval = setInterval(pollJobStatus, 2000);
            }
        } catch(e) {
            console.error(e);
        }
    }
"""

if 'async function postEmergencyJob' not in dash:
    dash = dash.replace('function handleHeroPress() {', dash_polling + '\n    function handleHeroPress() {')
    dash = dash.replace("setTimeout(() => { if(appState === 'connecting') setState('helper_assigned') }, 4000);", "postEmergencyJob(); // Wait for operator to dispatch")
    
with open('public/dashboard.html', 'w', encoding='utf-8') as f:
    f.write(dash)
