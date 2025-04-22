const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const currentPlayerDisplay = document.getElementById('currentPlayer');

const boardSize = window.innerWidth <= 600 ? 10 : 20; // 根据窗口宽度设置棋盘大小

function resizeCanvas() {
    const size = Math.min(window.innerWidth - 40, window.innerHeight - 40, boardSize * 30); // 30为每个单元格的大小
    canvas.width = size;
    canvas.height = size;
    cellSize = canvas.width / (boardSize - 1);
    drawBoard();
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const board = [];

for (let i = 0; i < boardSize; i++) {
    board[i] = new Array(boardSize).fill(null);
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#DEB887';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = Math.max(1, cellSize * 0.05); // 根据单元格大小调整线宽

    for (let i = 0; i < boardSize; i++) {
        const pos = i * cellSize;
        ctx.beginPath();
        ctx.moveTo(pos, 0);
        ctx.lineTo(pos, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, pos);
        ctx.lineTo(canvas.width, pos);
        ctx.stroke();
    }

    const starPoints = [3, 9, 15];
    ctx.fillStyle = '#8B4513';
    const starSize = Math.max(2, cellSize * 0.1);

    starPoints.forEach(x => {
        starPoints.forEach(y => {
            ctx.beginPath();
            ctx.arc(x * cellSize, y * cellSize, starSize, 0, 2 * Math.PI);
            ctx.fill();
        });
    });
}

function drawPiece(x, y, color) {
    const radius = cellSize * 0.4;
    const gradient = ctx.createRadialGradient(
        x * cellSize - radius * 0.3,
        y * cellSize - radius * 0.3,
        radius * 0.1,
        x * cellSize,
        y * cellSize,
        radius
    );

    if (color === 'black') {
        gradient.addColorStop(0, '#666');
        gradient.addColorStop(1, '#000');
    } else {
        gradient.addColorStop(0, '#fff');
        gradient.addColorStop(1, '#ddd');
    }

    ctx.beginPath();
    ctx.arc(x * cellSize, y * cellSize, radius, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x * cellSize - radius * 0.3, y * cellSize - radius * 0.3, radius * 0.2, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fill();
}

function checkWin(x, y, player) {
    const directions = [
        { dx: 1, dy: 0 },
        { dx: 0, dy: 1 },
        { dx: 1, dy: 1 },
        { dx: 1, dy: -1 }
    ];

    for (const { dx, dy } of directions) {
        let count = 1;

        for (let step = 1; step < 5; step++) {
            const nx = x + step * dx;
            const ny = y + step * dy;
            if (nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize && board[nx][ny] === player) {
                count++;
            } else {
                break;
            }
        }

        for (let step = 1; step < 5; step++) {
            const nx = x - step * dx;
            const ny = y - step * dy;
            if (nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize && board[nx][ny] === player) {
                count++;
            } else {
                break;
            }
        }

        if (count >= 5) {
            return true;
        }
    }

    return false;
}

function handleClick(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.round((e.clientX - rect.left) * scaleX / cellSize);
    const y = Math.round((e.clientY - rect.top) * scaleY / cellSize);

    if (board[x] && board[x][y] === null) {
        board[x][y] = currentPlayer;
        drawPiece(x, y, currentPlayer);

        if (checkWin(x, y, currentPlayer)) {
            setTimeout(() => {
                alert(`${currentPlayer === 'white' ? '白棋' : '黑棋'}获胜！`);
                resetGame();
            }, 100);
            return;
        }

        currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
        currentPlayerDisplay.textContent = currentPlayer === 'white' ? '白棋' : '黑棋';
        currentPlayerDisplay.className = `current-player ${currentPlayer}`;
    }
}

canvas.addEventListener('click', handleClick);
canvas.addEventListener('touchstart', function (e) {
    e.preventDefault();
    handleClick(e.touches[0]);
}, { passive: false });

function resetGame() {
    for (let i = 0; i < boardSize; i++) {
        board[i].fill(null);
    }
    currentPlayer = 'white';
    currentPlayerDisplay.textContent = '白棋';
    currentPlayerDisplay.className = 'current-player white';
    drawBoard();
}

drawBoard();