// 全局变量
let options = [];
let isSpinning = false;
let currentRotation = 0;
let wheelCanvas, wheelContext;
let wheelRadius;
let centerX, centerY;

// 颜色数组
const defaultColors = [
    '#3B82F6', // 蓝色
    '#10B981', // 绿色
    '#F59E0B', // 橙色
    '#EF4444', // 红色
    '#8B5CF6', // 紫色
    '#EC4899', // 粉色
    '#14B8A6', // 青色
    '#F97316', // 深橙色
];

// DOM元素
const wheelForm = document.getElementById('wheelForm');
const wheelTitle = document.getElementById('wheelTitle');
const wheelTitleDisplay = document.getElementById('wheelTitleDisplay');
const optionsContainer = document.getElementById('optionsContainer');
const addOptionBtn = document.getElementById('addOption');
const spinButton = document.getElementById('spinButton');
const spinCount = document.getElementById('spinCount');
const resultDisplay = document.getElementById('resultDisplay');
const resultText = document.getElementById('resultText');

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化转盘Canvas
    wheelCanvas = document.getElementById('wheelCanvas');
    wheelContext = wheelCanvas.getContext('2d');
    
    // 设置Canvas尺寸
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // 添加默认选项
    addDefaultOptions();
    
    // 初始化转盘
    updateWheel();
    
    // 事件监听
    addOptionBtn.addEventListener('click', addOption);
    wheelTitle.addEventListener('input', updateWheelTitle);
    spinButton.addEventListener('click', spinWheel);
});

// 调整Canvas尺寸
function resizeCanvas() {
    const container = document.getElementById('wheelContainer');
    const size = Math.min(container.clientWidth, container.clientHeight);
    
    wheelCanvas.width = size;
    wheelCanvas.height = size;
    
    wheelRadius = size / 2;
    centerX = size / 2;
    centerY = size / 2;
    
    // 更新转盘
    updateWheel();
}

// 添加默认选项
function addDefaultOptions() {
    const defaultOptions = [
        { text: '大屎', value: 10 },
        { text: '中屎', value: 20 },
        { text: '小屎', value: 30 },
        { text: '屎都不配吃', value: 40 }
    ];
    
    defaultOptions.forEach((option, index) => {
        addOptionElement(option.text, option.value, defaultColors[index % defaultColors.length]);
    });
}

// 添加选项元素
function addOptionElement(text = '', value = 10, color = '#3B82F6') {
    const optionIndex = optionsContainer.children.length;
    
    const optionElement = document.createElement('div');
    optionElement.className = 'option-item';
    optionElement.dataset.index = optionIndex;
    
    optionElement.innerHTML = `
        <div class="option-color" style="background-color: ${color}" data-index="${optionIndex}"></div>
        <input type="text" class="option-input px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
               placeholder="选项${optionIndex + 1}" value="${text}" data-index="${optionIndex}">
        <input type="number" class="option-value w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
               min="1" value="${value}" data-index="${optionIndex}">
        <span class="option-remove text-xl" data-index="${optionIndex}">&times;</span>
    `;
    
    optionsContainer.appendChild(optionElement);
    
    // 添加事件监听
    const colorPicker = optionElement.querySelector('.option-color');
    const textInput = optionElement.querySelector('.option-input');
    const valueInput = optionElement.querySelector('.option-value');
    const removeBtn = optionElement.querySelector('.option-remove');
    
    colorPicker.addEventListener('click', () => openColorPicker(optionIndex));
    textInput.addEventListener('input', updateWheel);
    valueInput.addEventListener('input', updateWheel);
    removeBtn.addEventListener('click', () => removeOption(optionIndex));
    
    // 更新选项数组
    updateOptionsArray();
    
    // 更新转盘
    updateWheel();
}

// 打开颜色选择器
function openColorPicker(index) {
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    
    const optionElement = document.querySelector(`.option-color[data-index="${index}"]`);
    colorPicker.value = optionElement.style.backgroundColor;
    
    colorPicker.addEventListener('input', (e) => {
        optionElement.style.backgroundColor = e.target.value;
        updateWheel();
    });
    
    colorPicker.click();
}

// 添加选项
function addOption() {
    if (optionsContainer.children.length >= 10) {
        alert('最多只能添加10个选项');
        return;
    }
    
    const color = defaultColors[optionsContainer.children.length % defaultColors.length];
    addOptionElement('', 10, color);
}

// 移除选项
function removeOption(index) {
    if (optionsContainer.children.length <= 2) {
        alert('至少需要保留2个选项');
        return;
    }
    
    const optionElement = document.querySelector(`.option-item[data-index="${index}"]`);
    optionElement.remove();
    
    // 更新剩余选项的索引
    updateOptionIndices();
    
    // 更新选项数组
    updateOptionsArray();
    
    // 更新转盘
    updateWheel();
}

// 更新选项索引
function updateOptionIndices() {
    const optionElements = optionsContainer.querySelectorAll('.option-item');
    optionElements.forEach((element, index) => {
        element.dataset.index = index;
        
        const colorPicker = element.querySelector('.option-color');
        const textInput = element.querySelector('.option-input');
        const valueInput = element.querySelector('.option-value');
        const removeBtn = element.querySelector('.option-remove');
        
        colorPicker.dataset.index = index;
        textInput.dataset.index = index;
        valueInput.dataset.index = index;
        removeBtn.dataset.index = index;
    });
}

// 更新选项数组
function updateOptionsArray() {
    options = [];
    
    const optionElements = optionsContainer.querySelectorAll('.option-item');
    optionElements.forEach(element => {
        const textInput = element.querySelector('.option-input');
        const valueInput = element.querySelector('.option-value');
        const colorPicker = element.querySelector('.option-color');
        
        options.push({
            text: textInput.value || `选项${options.length + 1}`,
            value: parseInt(valueInput.value) || 10,
            color: colorPicker.style.backgroundColor
        });
    });
}

// 更新转盘标题
function updateWheelTitle() {
    wheelTitleDisplay.textContent = wheelTitle.value || '牙签肉吃屎去吧';
}

// 更新转盘
function updateWheel() {
    // 更新选项数组
    updateOptionsArray();
    
    // 更新转盘标题
    updateWheelTitle();
    
    // 清空画布
    wheelContext.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
    
    // 计算总权重
    const totalValue = options.reduce((sum, option) => sum + option.value, 0);
    
    // 绘制转盘
    let startAngle = 0;
    
    options.forEach(option => {
        // 计算扇形角度
        const sliceAngle = (2 * Math.PI * option.value) / totalValue;
        
        // 绘制扇形
        wheelContext.beginPath();
        wheelContext.moveTo(centerX, centerY);
        wheelContext.arc(centerX, centerY, wheelRadius, startAngle, startAngle + sliceAngle);
        wheelContext.closePath();
        
        // 设置扇形颜色
        wheelContext.fillStyle = option.color;
        wheelContext.fill();
        
        // 绘制扇形边框
        wheelContext.strokeStyle = '#ffffff';
        wheelContext.lineWidth = 2;
        wheelContext.stroke();
        
        // 绘制文本
        wheelContext.save();
        wheelContext.translate(centerX, centerY);
        
        // 计算文本位置
        const textAngle = startAngle + sliceAngle / 2;
        const textRadius = wheelRadius * 0.7;
        
        wheelContext.rotate(textAngle);
        wheelContext.textAlign = 'center';
        wheelContext.fillStyle = '#ffffff';
        wheelContext.font = 'bold 14px Arial';
        
        // 处理长文本
        const text = option.text;
        if (text.length > 6) {
            wheelContext.font = 'bold 12px Arial';
        }
        
        // 绘制文本
        wheelContext.fillText(text, textRadius, 10);
        
        wheelContext.restore();
        
        // 更新起始角度
        startAngle += sliceAngle;
    });
    
    // 绘制中心圆
    wheelContext.beginPath();
    wheelContext.arc(centerX, centerY, 20, 0, 2 * Math.PI);
    wheelContext.fillStyle = '#ffffff';
    wheelContext.fill();
    wheelContext.strokeStyle = '#dddddd';
    wheelContext.lineWidth = 2;
    wheelContext.stroke();
    
    // 绘制中心圆点
    wheelContext.beginPath();
    wheelContext.arc(centerX, centerY, 8, 0, 2 * Math.PI);
    wheelContext.fillStyle = '#333333';
    wheelContext.fill();
}

// 旋转转盘
function spinWheel() {
    if (isSpinning) return;
    
    // 隐藏结果
    resultDisplay.classList.add('hidden');
    
    // 禁用旋转按钮
    spinButton.disabled = true;
    spinButton.innerHTML = '<i class="fa fa-spinner fa-spin mr-2"></i> 旋转中...';
    
    // 设置旋转状态
    isSpinning = true;
    
    // 获取旋转次数
    const spins = parseInt(spinCount.value) || 3;
    
    // 计算总旋转角度 (360 * 旋转次数 + 随机角度)
    const randomAngle = Math.random() * 360;
    const totalRotation = spins * 360 + randomAngle;
    
    // 计算旋转时间 (秒)
    const duration = 3 + spins * 0.5;
    
    // 开始旋转动画
    const startTime = performance.now();
    
    function animate(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / (duration * 1000), 1);
        
        // 使用缓动函数使动画更自然
        const easeProgress = easeOutCubic(progress);
        
        // 计算当前旋转角度
        currentRotation = (currentRotation + totalRotation * easeProgress) % 360;
        
        // 应用旋转
        wheelCanvas.style.transform = `rotate(${currentRotation}deg)`;
        
        // 继续动画
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // 动画结束，计算结果
            setTimeout(() => {
                calculateResult();
                isSpinning = false;
                spinButton.disabled = false;
                spinButton.innerHTML = '<i class="fa fa-refresh mr-2"></i> 开始旋转';
            }, 500);
        }
    }
    
    requestAnimationFrame(animate);
}

// 缓动函数 - 慢出
function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

// 计算结果
function calculateResult() {
    // 计算总权重
    const totalValue = options.reduce((sum, option) => sum + option.value, 0);
    
    // 计算当前旋转角度对应的扇形
    // 注意：Canvas的0度在右侧，顺时针为正，而我们的旋转是顺时针的
    let normalizedAngle = (360 - (currentRotation % 360)) % 360;
    let startAngle = 0;
    
    for (const option of options) {
        // 计算扇形角度
        const sliceAngle = (360 * option.value) / totalValue;
        
        // 检查当前角度是否在扇形范围内
        if (normalizedAngle >= startAngle && normalizedAngle < startAngle + sliceAngle) {
            // 显示结果
            showResult(option.text);
            break;
        }
        
        // 更新起始角度
        startAngle += sliceAngle;
    }
}

// 显示结果
function showResult(result) {
    resultText.textContent = result;
    resultDisplay.classList.remove('hidden');
}
