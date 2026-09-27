const fs = require('fs');
let help = fs.readFileSync('helper-app.html', 'utf8');

help = help.replace(/async function updateJobStatus\(status\) \{[\s\S]*?const tutorialSteps = \[/s, `
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
    } else if (status === 'en_route') {
        showState(3);
    }
}
      const tutorialSteps = [`);

fs.writeFileSync('helper-app.html', help);
console.log('Fixed helper app correctly');
