class ControlsManager {
    constructor(containerId, defaultParams) {
        this.container = document.getElementById(containerId);
        this.params = { ...defaultParams };
        this.sliders = {};
        this.displays = {};
        this.regenerateCallback = null;
        
        this.initControls();
    }
    
    // 初始化所有控制组件
    initControls() {
        // 清空容器
        this.container.innerHTML = '';
        
        // 添加标题
        const title = document.createElement('h2');
        title.textContent = 'Parameters';
        this.container.appendChild(title);
        
        // 定义参数配置
        const paramConfigs = [
            {
                id: 'gridWidth',
                label: 'Grid Width',
                type: 'range',
                min: 50,
                max: 200,
                step: 1,
                unit: '',
                description: 'Size of the generation grid (width)'
            },
            {
                id: 'gridHeight',
                label: 'Grid Height',
                type: 'range',
                min: 50,
                max: 200,
                step: 1,
                unit: '',
                description: 'Size of the generation grid (height)'
            },
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
            },
            {
                id: 'threshold',
                label: 'Contour Threshold',
                type: 'range',
                min: 0,
                max: 1,
                step: 0.05,
                unit: '',
                description: 'Threshold for contour generation'
            }
        ];
        
        // 创建每个参数的控制组件
        paramConfigs.forEach(config => {
            this.createControlGroup(config);
        });
        
        // 创建再生按钮
        this.createRegenerateButton();
    }
    
    // 创建单个参数的控制组
    createControlGroup(config) {
        const group = document.createElement('div');
        group.className = 'control-group';
        
        // 创建标签
        const label = document.createElement('label');
        label.htmlFor = config.id;
        label.textContent = config.label;
        group.appendChild(label);
        
        // 创建滑块容器
        const sliderContainer = document.createElement('div');
        sliderContainer.className = 'slider-container';
        
        // 创建滑块
        const slider = document.createElement('input');
        slider.type = config.type;
        slider.id = config.id;
        slider.min = config.min;
        slider.max = config.max;
        slider.step = config.step;
        slider.value = this.params[config.id];
        this.sliders[config.id] = slider;
        
        // 创建值显示
        const valueDisplay = document.createElement('span');
        valueDisplay.className = 'value-display';
        valueDisplay.id = `${config.id}Value`;
        valueDisplay.textContent = this.params[config.id] + config.unit;
        this.displays[config.id] = { element: valueDisplay, unit: config.unit };
        
        // 添加事件监听
        slider.addEventListener('input', () => {
            this.params[config.id] = this.parseValue(slider.value, config);
            this.updateDisplay(config.id);
        });
        
        // 添加到容器
        sliderContainer.appendChild(slider);
        sliderContainer.appendChild(valueDisplay);
        group.appendChild(sliderContainer);
        
        // 添加描述
        if (config.description) {
            const description = document.createElement('p');
            description.className = 'param-description';
            description.textContent = config.description;
            group.appendChild(description);
        }
        
        this.container.appendChild(group);
    }
    
    // 创建再生按钮
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
    
    // 修复：解析滑块值为正确的类型
    parseValue(value, config) {
        // 将step转换为字符串后再检查是否包含小数点
        if (config.step.toString().includes('.')) {
            return parseFloat(value);
        }
        return parseInt(value, 10);
    }
    
    // 更新显示值
    updateDisplay(paramId) {
        const display = this.displays[paramId];
        if (display) {
            display.element.textContent = this.params[paramId] + display.unit;
        }
    }
    
    // 获取当前参数
    getParameters() {
        return { ...this.params };
    }
    
    // 设置再生回调
    onRegenerate(callback) {
        this.regenerateCallback = callback;
    }
    
    // 触发再生
    triggerRegenerate() {
        if (this.regenerateCallback) {
            this.regenerateCallback();
        }
    }
}

export { ControlsManager };
