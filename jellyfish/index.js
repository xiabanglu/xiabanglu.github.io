const canvas = document.getElementById('jellyfishCanvas');
const ctx = canvas.getContext('2d');

// 设置Canvas尺寸
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

// 动画参数
let t = 0;
let animationSpeed = 0.05;
let pointDensity = 3;
let pointSize = 2;
let hueBase = 220;

// 获取控制元素
const speedControl = document.getElementById('speed');
const densityControl = document.getElementById('density');
const sizeControl = document.getElementById('size');
const hueControl = document.getElementById('hue');

// 设置控制事件
speedControl.addEventListener('input', () => {
    animationSpeed = parseFloat(speedControl.value);
});

densityControl.addEventListener('input', () => {
    pointDensity = parseFloat(densityControl.value);
});

sizeControl.addEventListener('input', () => {
    pointSize = parseFloat(sizeControl.value);
});

hueControl.addEventListener('input', () => {
    hueBase = parseFloat(hueControl.value);
});

// 绘制函数
function draw() {
    // 清除画布，使用半透明填充创建拖尾效果
    ctx.fillStyle = 'rgba(10, 5, 30, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = Math.min(canvas.width, canvas.height) / 500;

    // 在x和y范围内生成点
    for (let x = -100; x <= 100; x += pointDensity) {
        for (let y = -100; y <= 100; y += pointDensity) {
            // 核心公式计算
            const k = 5 * Math.cos(x / 14) * Math.cos(y / 30);
            const e = y / 8 - 13;
            const d = (k * k + e * e) / 59 + 4;
            const a = Math.atan2(e, k);  // 相当于 arctan(k, e)

            const q = 60 - Math.sin(a * e) + k * (3 + (4 / d) * Math.sin(d * d - 2 * t));
            const c = d / 2 + e / 99 - t / 18;

            // 计算屏幕坐标
            const X = q * Math.sin(c) + centerX;
            const Y = (q + 9 * d) * Math.cos(c) + centerY;

            // 计算粒子颜色（随时间和水母位置变化）
            const hue = (hueBase + t * 10 + x * 0.5) % 360;
            const saturation = 80 + Math.sin(t + x * 0.1) * 15;
            const lightness = 50 + Math.cos(t + y * 0.1) * 10;

            // 绘制粒子
            ctx.beginPath();
            ctx.arc(X, Y, pointSize * scale, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
            ctx.fill();
        }
    }

    // 更新时间
    t += animationSpeed;

    // 下一帧
    requestAnimationFrame(draw);
}

// 响应窗口大小变化
window.addEventListener('resize', () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
});

// 开始动画
draw();