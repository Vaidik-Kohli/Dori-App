// Dori Parent App Dynamic Tutorial
(function() {
    const style = document.createElement('style');
    style.innerHTML = `
        #dori-tutorial-overlay {
            position: fixed; inset: 0; pointer-events: none; z-index: 9998;
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 0 0 9999px rgba(0,0,0,0.7);
            border-radius: 24px;
            opacity: 0; visibility: hidden;
        }
        #dori-tutorial-tooltip {
            position: fixed; z-index: 9999;
            background: rgba(15, 23, 42, 0.95);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 16px;
            padding: 20px; color: white; width: 300px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.5);
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
            targetId: 'heroBtn',
            text: '<b>One-Tap Emergency Response</b><br/><br/>Press this button to trigger Dori\'s AI.',
            button: null,
            position: 'bottom'
        },
        {
            targetId: 'waveform', 
            text: '<b>Dori is listening.</b><br/><br/>The AI analyzes ambient audio and voice to automatically categorize the emergency.',
            button: null,
            position: 'top'
        },
        {
            targetId: 'parentHelperName',
            text: '<b>Verified Dispatch</b><br/><br/>Within seconds, the closest verified responder is automatically dispatched.',
            button: 'Next &rarr;',
            position: 'top'
        },
        {
            targetId: 'otpArea',
            text: '<b>Zero-Trust Security</b><br/><br/>Share this one-time code to verify the responder\'s identity upon arrival.',
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
        
        overlay.classList.add('dori-tut-active');

        // Render Tooltip
        let btnHtml = step.button ? `<button id="doriTutBtn" style="margin-top:15px; width:100%; padding:10px; border-radius:10px; background:#10b981; color:white; font-weight:bold; border:none; cursor:pointer;">${step.button}</button>` : '';
        let skipHtml = `<button id="doriTutSkip" style="display:block; margin: 12px auto 0; background:transparent; border:none; color: #9ca3af; font-size:12px; cursor:pointer; text-decoration:underline;">Skip Tutorial</button>`;
        tooltip.innerHTML = `<div style="font-size:14px; line-height:1.5;">${step.text}</div>${btnHtml}${skipHtml}`;
        
        document.getElementById('doriTutSkip').onclick = () => {
            localStorage.setItem('dori-tut-skipped-global', 'true');
            localStorage.setItem('dori-tut-done-tutorial-parent', 'true');
            endTutorial();
        };
        
        if(step.button) {
            document.getElementById('doriTutBtn').onclick = () => {
                if (stepNum === 3) advance(4); else { localStorage.setItem('dori-tut-done-tutorial-parent', 'true'); endTutorial(); }
            };
        }

        // Position tooltip
        tooltip.classList.add('dori-tut-active');
        if (step.position === 'bottom') {
            tooltip.style.top = (rect.bottom + 30) + 'px';
            tooltip.style.left = (rect.left + rect.width/2 - 150) + 'px';
        } else {
            let offset = 140;
            if(stepNum === 3) offset = 160;
            tooltip.style.top = (rect.top - offset) + 'px'; 
            tooltip.style.left = (rect.left + rect.width/2 - 150) + 'px';
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
        // Start tutorial step 1
        if (localStorage.getItem('dori-tut-skipped-global') || (localStorage.getItem('dori-tut-done-tutorial-parent'))) return;
        setTimeout(() => advance(1), 500);

        // Intercept setState
        if (typeof window.setState === 'function') {
            const original = window.setState;
            window.setState = function(st) {
                original(st);
                if (st === 'connecting') {
                    endTutorial();
                    setTimeout(() => advance(2), 500);
                } else if (st === 'helper_assigned') {
                    endTutorial();
                    setTimeout(() => advance(3), 500);
                }
            };
        }
    });

})();
