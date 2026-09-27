// Dori Operator Console Dynamic Tutorial
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
            targetId: 'queueList',
            text: '<b>Intelligent Triage Queue</b><br/><br/>All incoming calls are automatically prioritized by urgency, allowing dispatchers to focus on high-risk emergencies first.',
            button: 'Next &rarr;',
            position: 'right'
        },
        {
            targetId: 'metadataGrid', 
            text: '<b>Instant AI Triage</b><br/><br/>Dori\'s LLM instantly extracts the patient\'s name, location, medical need, and required responder skills directly from the ambient audio.',
            button: 'Next &rarr;',
            position: 'left'
        },
        {
            targetId: 'card-transcript',
            text: '<b>Real-Time Translation</b><br/><br/>The operator can read exactly what is happening on-scene, automatically translated from the native language into English.',
            button: 'Next &rarr;',
            position: 'left'
        },
        {
            targetId: 'btnDispatch',
            text: '<b>Skill-Based Dispatch</b><br/><br/>Dori filters nearby verified responders matching the exact medical skills required. Click \'Assign Helper\' to initiate the dispatch.',
            button: null, // user must click dispatch
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
            localStorage.setItem('dori-tut-done-tutorial-operator', 'true');
            endTutorial();
        };

        if(step.button) {
            document.getElementById('doriTutBtn').onclick = () => {
                if (stepNum < steps.length - 1) {
                    advance(stepNum + 1);
                } else {
                    localStorage.setItem('dori-tut-done-tutorial-operator', 'true');
                    endTutorial();
                }
            };
        }

        // Position tooltip
        tooltip.classList.add('dori-tut-active');
        if (step.position === 'right') {
            tooltip.style.top = Math.max(20, rect.top + rect.height/2 - 100) + 'px';
            tooltip.style.left = (rect.right + 30) + 'px';
        } else if (step.position === 'left') {
            tooltip.style.top = Math.max(20, rect.top + rect.height/2 - 100) + 'px';
            tooltip.style.left = (rect.left - 330) + 'px';
        } else if (step.position === 'top') {
            tooltip.style.top = (rect.top - 150) + 'px';
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
        if (localStorage.getItem('dori-tut-skipped-global') || localStorage.getItem('dori-tut-done-tutorial-operator')) return;
        setTimeout(() => advance(1), 500);

        // Intercept startDispatch
        if (typeof window.startDispatch === 'function') {
            const original = window.startDispatch;
            window.startDispatch = function() {
                localStorage.setItem('dori-tut-done-tutorial-operator', 'true');
                endTutorial();
                original();
            };
        }
    });

})();
