class ControlsManager {
    constructor(containerId, defaultParams) {
        this.container = document.getElementById(containerId);
        this.params = { ...defaultParams };
        this.sliders = {};
        this.displays = {};
        this.regenerateCallback = null;
        
        this.initControls();
    }
    
    initControls() {
        this.container.innerHTML = '';
        
        const title = document.createElement('h2');
        
        const paramConfigs = [
            {
                id: 'spawnChance',
                label: 'Spawn Chance',
                type: 'range',
                min: 0,
                max: 100,
                step: 1,
                unit: '%',
                description: 'Initial chance of a cell being a wall'
            },
            {
                id: 'createLimit',
                label: 'Create Limit',
                type: 'range',
                min: 1,
                max: 8,
                step: 1,
                unit: '',
                description: 'Neighbors needed to create a new wall'
            },
            {
                id: 'destroyLimit',
                label: 'Destroy Limit',
                type: 'range',
                min: 1,
                max: 8,
                step: 1,
                unit: '',
                description: 'Neighbors needed to keep a wall'
            },
            {
                id: 'iterations',
                label: 'Iterations',
                type: 'range',
                min: 1,
                max: 20,
                step: 1,
                unit: '',
                description: 'Number of cellular automata iterations'
            }
        ];
        
        paramConfigs.forEach(config => {
            this.createControlGroup(config);
        });
        
        this.createRegenerateButton();
    }
    
    createControlGroup(config) {
        const group = document.createElement('div');
        group.className = 'control-group';
        
        const label = document.createElement('label');
        label.htmlFor = config.id;
        label.textContent = config.label;
        group.appendChild(label);
        
        const sliderContainer = document.createElement('div');
        sliderContainer.className = 'slider-container';
        
        const slider = document.createElement('input');
        slider.type = config.type;
        slider.id = config.id;
        slider.min = config.min;
        slider.max = config.max;
        slider.step = config.step;
        slider.value = this.params[config.id];
        this.sliders[config.id] = slider;
        
        const valueDisplay = document.createElement('span');
        valueDisplay.className = 'value-display';
        valueDisplay.id = `${config.id}Value`;
        valueDisplay.textContent = this.params[config.id] + config.unit;
        this.displays[config.id] = { element: valueDisplay, unit: config.unit };
        
        slider.addEventListener('input', () => {
            this.params[config.id] = this.parseValue(slider.value, config);
            this.updateDisplay(config.id);
        });
        
        sliderContainer.appendChild(slider);
        sliderContainer.appendChild(valueDisplay);
        group.appendChild(sliderContainer);
        
        if (config.description) {
            const description = document.createElement('p');
            description.className = 'param-description';
            description.textContent = config.description;
            group.appendChild(description);
        }
        
        this.container.appendChild(group);
    }
    

    createRegenerateButton() {
        const button = document.createElement('button');
        button.id = 'regenerate';
        button.innerHTML = '<i class="fa fa-refresh" aria-hidden="true"></i> Regenerate Map';
        
        button.addEventListener('click', () => {
            if (this.regenerateCallback) {
                this.regenerateCallback();
            }
        });
        
        this.container.appendChild(button);
    }
    
    parseValue(value, config) {
        if (config.step.toString().includes('.')) {
            return parseFloat(value);
        }
        return parseInt(value, 10);
    }
    
    updateDisplay(paramId) {
        const display = this.displays[paramId];
        if (display) {
            display.element.textContent = this.params[paramId] + display.unit;
        }
    }
    
    getParameters() {
        return { ...this.params };
    }
    
    onRegenerate(callback) {
        this.regenerateCallback = callback;
    }
    
    triggerRegenerate() {
        if (this.regenerateCallback) {
            this.regenerateCallback();
        }
    }
}

export { ControlsManager };
