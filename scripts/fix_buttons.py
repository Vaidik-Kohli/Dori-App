import re

# Fix helper-app.html buttons
with open('public/helper-app.html', 'r', encoding='utf-8') as f:
    helper = f.read()

# Add onclick to Accept Job
helper = helper.replace('Accept Job\n            </button>', 'Accept Job\n            </button>').replace('<button class="flex-1 h-[72px]', '<button onclick="updateJobStatus(\'en_route\')" class="flex-1 h-[72px]')

# Add onclick to Mark Task Complete
helper = helper.replace('<button id="completeBtn"', '<button id="completeBtn" onclick="updateJobStatus(\'completed\')"')

# Ensure we have updateJobStatus function
update_js = """
    async function updateJobStatus(status) {
        if (!activeJobId) return;
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

if 'updateJobStatus' not in helper:
    helper = helper.replace('// LIVE DB POLLING', update_js + '\n    // LIVE DB POLLING')

with open('public/helper-app.html', 'w', encoding='utf-8') as f:
    f.write(helper)

# Fix dashboard.html buttons
with open('public/dashboard.html', 'r', encoding='utf-8') as f:
    dashboard = f.read()

# Make sure handleHeroPress works. It calls setState('connecting'). Let's just make it call the API to create a dummy job if it's pressed.
# Wait, dashboard.html shouldn't create a real job, it's just a demo of the hardware button. 
# But if they press it, let's just make it switch states locally so it feels alive.
# handleHeroPress is already defined in dashboard.html.
# Does handleHeroPress work?
# The code is:
# function handleHeroPress() {
#    if (appState === 'idle') {
#        setState('connecting');
#    }
# }
# It should work. If it doesn't work, maybe JS errors are breaking it.

