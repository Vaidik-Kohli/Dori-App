class SpotlightTutorial {
    constructor(steps, storageKey) {
        this.steps = steps;
        this.storageKey = storageKey;
        this.currentStep = 0;
        this.overlay = null;
        this.tooltip = null;
        this.spotlight = null;
        this.resizeHandler = this.updatePositions.bind(this);
    }

    init(force = false) {
        if (!force && localStorage.getItem(this.storageKey)) {
            return;
        }
        this.currentStep = 0;
        this.createElements();
        this.showStep();
        window.addEventListener('resize', this.resizeHandler);
        window.addEventListener('scroll', this.resizeHandler, true);
    }

    createElements() {
        if (document.getElementById('tutorial-overlay')) return;

        this.overlay = document.createElement('div');
        this.overlay.id = 'tutorial-overlay';
        this.overlay.style.cssText = `
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            z-index: 10000;
            pointer-events: auto;
        `;

        this.spotlight = document.createElement('div');
        this.spotlight.style.cssText = `
            position: absolute;
            border-radius: 12px;
            box-shadow: 0 0 0 9999px rgba(0,0,0,0.7);
            transition: all 0.3s ease;
            pointer-events: none;
        `;

        this.tooltip = document.createElement('div');
        this.tooltip.className = 'bg-surfaceLight dark:bg-surfaceDark border-2 border-primary rounded-xl p-4 shadow-xl flex flex-col gap-3 text-black dark:text-white w-[250px]';
        this.tooltip.style.cssText = `
            position: absolute;
            transition: all 0.3s ease;
            z-index: 10001;
        `;

        this.overlay.appendChild(this.spotlight);
        this.overlay.appendChild(this.tooltip);
        document.body.appendChild(this.overlay);
    }

    showStep() {
        if (this.currentStep >= this.steps.length) {
            this.end();
            return;
        }

        const step = this.steps[this.currentStep];
        const target = document.getElementById(step.target);

        if (!target) {
            console.warn('Tutorial target not found:', step.target);
            this.currentStep++;
            this.showStep();
            return;
        }

        target.scrollIntoView({ behavior: 'smooth', block: 'center' });

        setTimeout(() => this.updatePositions(), 50);

        const isLast = this.currentStep === this.steps.length - 1;
        
        this.tooltip.innerHTML = `
            <p class="text-sm font-bold">${step.text}</p>
            <div class="flex justify-end gap-2 mt-2">
                ${!isLast ? `<button id="tut-skip" class="text-xs font-semibold text-slate-500 hover:text-black dark:hover:text-white px-2">Skip</button>` : ''}
                <button id="tut-next" class="bg-primary text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors shadow-sm">
                    ${isLast ? 'Done' : 'Next'}
                </button>
            </div>
        `;

        const nextBtn = this.tooltip.querySelector('#tut-next');
        const skipBtn = this.tooltip.querySelector('#tut-skip');
        
        nextBtn.onclick = () => {
            this.currentStep++;
            this.showStep();
        };

        if (skipBtn) {
            skipBtn.onclick = () => this.end();
        }
    }

    updatePositions() {
        if (!this.overlay || this.currentStep >= this.steps.length) return;

        const step = this.steps[this.currentStep];
        const target = document.getElementById(step.target);
        if (!target) return;

        const rect = target.getBoundingClientRect();
        const padding = 8;
        
        this.spotlight.style.top = `${rect.top - padding}px`;
        this.spotlight.style.left = `${rect.left - padding}px`;
        this.spotlight.style.width = `${rect.width + padding*2}px`;
        this.spotlight.style.height = `${rect.height + padding*2}px`;

        let tooltipTop = rect.bottom + padding + 12;
        if (tooltipTop + 150 > window.innerHeight) {
            tooltipTop = Math.max(10, rect.top - padding - 130);
        }
        
        let tooltipLeft = rect.left;
        if (tooltipLeft + 250 > window.innerWidth) {
            tooltipLeft = window.innerWidth - 270;
        }
        
        this.tooltip.style.top = `${tooltipTop}px`;
        this.tooltip.style.left = `${Math.max(10, tooltipLeft)}px`;
    }

    end() {
        localStorage.setItem(this.storageKey, 'true');
        if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
        }
        window.removeEventListener('resize', this.resizeHandler);
        window.removeEventListener('scroll', this.resizeHandler, true);
    }
}
