// Dori Family App (NRI) Tutorial
(function() {
    const style = document.createElement('style');
    style.innerHTML = `
        #dori-tutorial-overlay {
            position: fixed; inset: 0; pointer-events: none; z-index: 9998;
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 0 0 9999px rgb(var(--shadow-color) / 0.8);
            border-radius: 24px;
            opacity: 0; visibility: hidden;
        }
        #dori-tutorial-tooltip {
            position: fixed; z-index: 9999;
            background: rgb(var(--surface));
            backdrop-filter: blur(12px);
            border: 2px solid rgb(var(--border-strong));
            border-radius: 16px;
            padding: 20px; color: rgb(var(--text)); width: 300px;
            box-shadow: 0 20px 40px rgb(var(--shadow-color) / 0.5);
            opacity: 0; visibility: hidden;
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: auto;
        }
        .dori-tut-active { opacity: 1 !important; visibility: visible !important; }
        .dori-tut-target { position: relative; z-index: 9999 !important; pointer-events: auto !important; }
    `;
    document.head.appendChild(style);

    const overlay = document.createElement('div');
    overlay.id = 'dori-tutorial-overlay';
    document.body.appendChild(overlay);

    const tooltip = document.createElement('div');
    tooltip.id = 'dori-tutorial-tooltip';
    document.body.appendChild(tooltip);

    let currentStep = 0;
    let currentTargetEl = null;

    const steps = [
        {}, // dummy step 0
        {
            targetId: 'timelineContainer',
            text: '<b>Live Remote Tracking</b><br/><br/>Family members instantly receive an SMS link to monitor the emergency in real-time, no matter where they are.',
            button: 'Next &rarr;',
            position: 'top'
        },
        {
            targetId: 'nriHelperCard', 
            text: '<b>Full Transparency</b><br/><br/>Instantly view the verified responder\'s credentials, background check status, and live ETA.',
            button: 'Next &rarr;',
            position: 'top'
        },
        {
            targetId: 'msgBtn',
            text: '<b>Instant Communication</b><br/><br/>Chat or call the responder directly to provide critical medical context or building access codes before they even arrive.',
            button: 'Done',
            position: 'top'
        }
    ];

    function positionHighlight(stepNum) {
        const step = steps[stepNum];
        if(!step) return endTutorial();

        if (currentTargetEl) {
            currentTargetEl.classList.remove('dori-tut-target');
        }

        const target = document.getElementById(step.targetId);
        if (!target) return;
        currentTargetEl = target;
        target.classList.add('dori-tut-target');

        const rect = target.getBoundingClientRect();
        
        // Move overlay hole
        overlay.style.left = (rect.left - 10) + 'px';
        overlay.style.top = (rect.top - 10) + 'px';
        overlay.style.width = (rect.width + 20) + 'px';
        overlay.style.height = (rect.height + 20) + 'px';
        overlay.style.borderRadius = window.getComputedStyle(target).borderRadius;
        
        overlay.classList.add('dori-tut-active');

        // Render Tooltip
        let btnHtml = step.button ? `<button id="doriTutBtn" style="margin-top:15px; width:100%; padding:10px; border-radius:10px; background:rgb(var(--primary)); color:rgb(var(--on-primary)); font-weight:bold; border:none; cursor:pointer;">${step.button}</button>` : '';
        let skipHtml = `<button id="doriTutSkip" style="display:block; margin: 12px auto 0; background:transparent; border:none; color: rgb(var(--text-muted)); font-size:12px; cursor:pointer; text-decoration:underline;">Skip Tutorial</button>`;
        tooltip.innerHTML = `<div style="font-size:14px; line-height:1.5;">${step.text}</div>${btnHtml}${skipHtml}`;
        
        document.getElementById('doriTutSkip').onclick = () => {
            localStorage.setItem('dori-tut-skipped-global', 'true');
            localStorage.setItem('dori-tut-done-tutorial-family', 'true');
            endTutorial();
        };
        
        if(step.button) {
            document.getElementById('doriTutBtn').onclick = () => {
                if (stepNum < steps.length - 1) advance(stepNum + 1); else { localStorage.setItem('dori-tut-done-tutorial-family', 'true'); endTutorial(); }
            };
        }

        // Position tooltip
        tooltip.classList.add('dori-tut-active');
        if (step.position === 'bottom') {
            tooltip.style.top = (rect.bottom + 30) + 'px';
            tooltip.style.left = (rect.left + rect.width/2 - 150) + 'px';
        } else {
            let offset = 150;
            if (stepNum === 1) offset = 150; // top of timeline
            else if (stepNum === 3) offset = 180; // above message button
            
            tooltip.style.top = Math.max(20, rect.top - offset) + 'px'; 
            tooltip.style.left = Math.max(20, rect.left + rect.width/2 - 150) + 'px';
        }
    }

    function advance(step) {
        currentStep = step;
        positionHighlight(step);
    }

    function endTutorial() {
        overlay.classList.remove('dori-tut-active');
        tooltip.classList.remove('dori-tut-active');
        if (currentTargetEl) currentTargetEl.classList.remove('dori-tut-target');
    }

    window.addEventListener('load', () => {
        // Start tutorial 1.5 seconds after load
        if (localStorage.getItem('dori-tut-skipped-global') || (localStorage.getItem('dori-tut-done-tutorial-family'))) return;
        setTimeout(() => advance(1), 1500);
    });

})();
