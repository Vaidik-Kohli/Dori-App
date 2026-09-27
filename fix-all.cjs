const fs = require('fs');

function renameToDori(text) {
    text = text.replace(/Bharat Care/g, 'Dori');
    text = text.replace(/BharatCare/gi, 'Dori');
    return text;
}

const files = ['dashboard.html', 'operator-console.html', 'helper-app.html', 'nri-app.html', 'index.html', 'login.html', 'README.md'];

for (const file of files) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        content = renameToDori(content);
        fs.writeFileSync(file, content);
    }
}

// FIX NRI APP
let nri = fs.readFileSync('nri-app.html', 'utf8');
// Fix the bottom card to be Sunil Verma instantly
nri = nri.replace(/<div class="relative shrink-0">[\s\S]*?Message Helper\s*<\/button>\s*<\/div>/, `<div class="flex items-center gap-4 mb-5">
              <div class="relative shrink-0">
                <div class="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-primary flex items-center justify-center text-xl font-black text-slate-500">SV</div>
                <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-white dark:bg-surfaceDark rounded-full flex items-center justify-center">
                  <div class="w-4 h-4 bg-emerald-500 rounded-full"></div>
                </div>
              </div>
              <div>
                <p class="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Assigned Helper</p>
                <h3 id="nriHelperName" class="text-xl font-black">Sunil Verma</h3>
                <p class="text-sm font-bold text-primary mt-0.5">Paramedic &bull; En Route</p>
              </div>
            </div>
            <div class="flex gap-2">
              <span class="px-3 py-1.5 rounded-[10px] bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center gap-1.5">
                Background Verified
              </span>
              <span class="px-3 py-1.5 rounded-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold flex items-center gap-1.5">
                4.9/5 Rating
              </span>
            </div>
            <button onclick="document.getElementById('chatModal').classList.remove('hidden')" class="w-full mt-6 bg-surfaceLight dark:bg-surfaceDark hover:bg-white/5 text-white py-4 rounded-[16px] font-black tracking-tight transition-colors flex items-center justify-center gap-2 border-2 border-borderLight dark:border-borderDark">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              Message Helper
            </button>
          </div>
          
          <!-- CHAT MODAL -->
          <div id="chatModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
             <div class="bg-surfaceLight dark:bg-surfaceDark border-2 border-borderLight dark:border-borderDark rounded-[32px] w-full max-w-md overflow-hidden flex flex-col h-[500px]">
                <div class="p-5 border-b border-borderLight dark:border-borderDark flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center">SV</div>
                        <div>
                            <h4 class="font-bold">Sunil Verma</h4>
                            <p class="text-xs text-primary">Active Now</p>
                        </div>
                    </div>
                    <button onclick="document.getElementById('chatModal').classList.add('hidden')" class="p-2 rounded-full bg-bgLight dark:bg-bgDark text-slate-500 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                </div>
                <div class="flex-1 p-5 overflow-y-auto flex flex-col gap-4 bg-bgLight dark:bg-bgDark">
                    <div class="self-end bg-primary text-white p-3 rounded-2xl rounded-tr-none max-w-[80%]">
                        <p class="text-sm font-medium">Hi Sunil, please hurry, my father is having chest pain.</p>
                    </div>
                    <div class="self-start bg-surfaceLight dark:bg-surfaceDark border border-borderLight dark:border-borderDark p-3 rounded-2xl rounded-tl-none max-w-[80%]">
                        <p class="text-sm font-medium text-slate-800 dark:text-white">I am on my way. ETA 2 minutes. Please keep him seated and calm.</p>
                    </div>
                </div>
                <div class="p-4 border-t border-borderLight dark:border-borderDark bg-surfaceLight dark:bg-surfaceDark flex gap-2">
                    <input type="text" placeholder="Type a message..." class="flex-1 bg-bgLight dark:bg-bgDark border-2 border-borderLight dark:border-borderDark rounded-full px-4 text-sm focus:outline-none">
                    <button class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                    </button>
                </div>
             </div>
          </div>`);
fs.writeFileSync('nri-app.html', nri);


// FIX HELPER APP
let help = fs.readFileSync('helper-app.html', 'utf8');

// 1. Replace updateJobStatus logic to show full screen with button instead of just hardcoded innerHTML
help = help.replace(/async function updateJobStatus\(status\) \{[\s\S]*?function setLocation/s, `
function showCompleteScreen() {
    document.body.insertAdjacentHTML('beforeend', \`
        <div id="completeOverlay" style="position:fixed;inset:0;background:#10b981;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;color:white;">
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:1.5rem;"><path d="M20 6 9 17l-5-5"/></svg>
            <div style="font-size:3rem;font-weight:900;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:2rem;">Task Secured!</div>
            <button onclick="document.getElementById('completeOverlay').remove(); window.location.reload();" style="padding:1rem 2rem; border-radius:100px; background:rgba(255,255,255,0.2); border:2px solid rgba(255,255,255,0.4); color:white; font-weight:bold; font-size:1.2rem; cursor:pointer; transition:all 0.2s;">Go Back</button>
        </div>
    \`);
}

async function updateJobStatus(status) {
    if (status === 'completed') {
        showCompleteScreen();
    }
}
function setLocation`);

// 2. Remove the alert on mark task complete
help = help.replace(/alert\('Marking task complete[^\n]*\n\s*/g, '');

fs.writeFileSync('helper-app.html', help);

console.log('Update finished.');
