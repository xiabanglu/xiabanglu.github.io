class Tetris {
    constructor() {
        console.log('游戏初始化开始');
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.nextPieceCanvas = document.getElementById('next-piece-canvas');
        this.nextPieceCtx = this.nextPieceCanvas.getContext('2d');
        this.gameOverlay = document.getElementById('game-overlay');

        if (!this.canvas || !this.ctx || !this.nextPieceCanvas || !this.nextPieceCtx) {
            console.error('Canvas 元素或上下文未找到');
            return;
        }

        this.blockSize = 30;
        this.cols = 10;
        this.rows = 20;
        this.score = 0;
        this.level = 1;
        this.gameOver = false;
        this.isPaused = false;
        this.board = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
        this.dropCounter = 0;
        this.dropInterval = 1000;
        this.lastTime = 0;
        this.softDropSpeed = 50;
        this.colors = [
            '#FF0D72', // I
            '#0DC2FF', // J
            '#0DFF72', // L
            '#F538FF', // O
            '#FF8E0D', // S
            '#FFE138', // T
            '#3877FF'  // Z
        ];
        this.pieces = [
            [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], // I
            [[2, 0, 0], [2, 2, 2], [0, 0, 0]],                         // J
            [[0, 0, 3], [3, 3, 3], [0, 0, 0]],                         // L
            [[0, 4, 4], [0, 4, 4], [0, 0, 0]],                         // O
            [[0, 5, 5], [5, 5, 0], [0, 0, 0]],                         // S
            [[0, 6, 0], [6, 6, 6], [0, 0, 0]],                         // T
            [[7, 7, 0], [0, 7, 7], [0, 0, 0]]                          // Z
        ];

        this.currentPiece = this.newPiece();
        this.nextPiece = this.newPiece();

        console.log('游戏初始化完成');
    }

    start() {
        console.log('游戏开始');
        if (this.gameOver) {
            this.reset();
        }
        this.gameOver = false;
        this.isPaused = false;
        if (this.gameOverlay) {
            this.gameOverlay.style.display = 'none';
        }
        this.draw();
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    reset() {
        console.log('游戏重置');
        this.board = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
        this.score = 0;
        this.level = 1;
        this.dropInterval = 1000;
        this.updateScore();
        this.currentPiece = this.newPiece();
        this.nextPiece = this.newPiece();
        this.drawNextPiece();
    }

    draw() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制网格
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 0.5;
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                this.ctx.strokeRect(x * this.blockSize, y * this.blockSize, this.blockSize, this.blockSize);
            }
        }

        // 绘制已固定的方块
        this.drawMatrix(this.board, { x: 0, y: 0 });

        // 绘制当前方块
        this.drawMatrix(this.currentPiece.matrix, this.currentPiece.pos);
    }

    drawMatrix(matrix, offset, ctx = this.ctx) {
        matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    ctx.fillStyle = this.colors[value - 1];
                    ctx.fillRect(
                        (x + offset.x) * this.blockSize,
                        (y + offset.y) * this.blockSize,
                        this.blockSize,
                        this.blockSize
                    );

                    // 添加方块高光效果
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                    ctx.fillRect(
                        (x + offset.x) * this.blockSize,
                        (y + offset.y) * this.blockSize,
                        this.blockSize * 0.3,
                        this.blockSize * 0.3
                    );

                    ctx.strokeStyle = '#000';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(
                        (x + offset.x) * this.blockSize,
                        (y + offset.y) * this.blockSize,
                        this.blockSize,
                        this.blockSize
                    );
                }
            });
        });
    }

    drop() {
        this.currentPiece.pos.y++;
        if (this.collide()) {
            this.currentPiece.pos.y--;
            this.merge();
            this.clearLines();
            this.currentPiece = this.nextPiece;
            this.nextPiece = this.newPiece();
            this.drawNextPiece();
            if (this.collide()) {
                this.gameOver = true;
                if (this.gameOverlay) {
                    this.gameOverlay.style.display = 'flex';
                }
            }
        }
        this.dropCounter = 0;
    }

    findDropPosition() {
        let y = this.currentPiece.pos.y;
        while (!this.collide({ matrix: this.currentPiece.matrix, pos: { x: this.currentPiece.pos.x, y: y + 1 } })) {
            y++;
        }
        return y;
    }

    clearLines() {
        let linesCleared = 0;
        outer: for (let y = this.rows - 1; y >= 0; y--) {
            for (let x = 0; x < this.cols; x++) {
                if (this.board[y][x] === 0) {
                    continue outer;
                }
            }
            const row = this.board.splice(y, 1)[0].fill(0);
            this.board.unshift(row);
            y++;
            linesCleared++;
        }
        if (linesCleared > 0) {
            this.score += linesCleared * 100;
            this.level = Math.floor(this.score / 1000) + 1;
            this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);
            this.updateScore();
        }
    }

    gameLoop(time = 0) {
        if (this.gameOver || this.isPaused) {
            console.log('游戏循环暂停或结束');
            return;
        }

        const deltaTime = time - this.lastTime;
        this.lastTime = time;
        this.dropCounter += deltaTime;

        if (this.dropCounter > this.dropInterval) {
            this.drop();
        }

        this.draw();
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    newPiece() {
        const pieceIndex = Math.floor(Math.random() * this.pieces.length);
        return {
            matrix: this.pieces[pieceIndex],
            pos: { x: Math.floor(this.cols / 2) - Math.floor(this.pieces[pieceIndex][0].length / 2), y: 0 }
        };
    }

    drawNextPiece() {
        this.nextPieceCtx.fillStyle = '#000';
        this.nextPieceCtx.fillRect(0, 0, this.nextPieceCanvas.width, this.nextPieceCanvas.height);

        // 计算方块在预览画布中的居中位置
        const pieceWidth = this.nextPiece.matrix[0].length * this.blockSize;
        const pieceHeight = this.nextPiece.matrix.length * this.blockSize;
        const offsetX = (this.nextPieceCanvas.width - pieceWidth) / 2;
        const offsetY = (this.nextPieceCanvas.height - pieceHeight) / 2;

        this.drawMatrix(this.nextPiece.matrix, { x: offsetX / this.blockSize, y: offsetY / this.blockSize }, this.nextPieceCtx);
    }

    updateScore() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
    }

    collide(piece = this.currentPiece) {
        const matrix = piece.matrix;
        const pos = piece.pos;
        for (let y = 0; y < matrix.length; y++) {
            for (let x = 0; x < matrix[y].length; x++) {
                if (matrix[y][x] !== 0 &&
                    (this.board[y + pos.y] === undefined ||
                        this.board[y + pos.y][x + pos.x] === undefined ||
                        this.board[y + pos.y][x + pos.x] !== 0)) {
                    return true;
                }
            }
        }
        return false;
    }

    merge() {
        this.currentPiece.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    this.board[y + this.currentPiece.pos.y][x + this.currentPiece.pos.x] = value;
                }
            });
        });
    }

    move(dir) {
        this.currentPiece.pos.x += dir;
        if (this.collide()) {
            this.currentPiece.pos.x -= dir;
        }
    }

    rotate() {
        const matrix = this.currentPiece.matrix;
        for (let y = 0; y < matrix.length; y++) {
            for (let x = 0; x < y; x++) {
                [
                    matrix[x][y],
                    matrix[y][x],
                ] = [
                        matrix[y][x],
                        matrix[x][y],
                    ];
            }
        }
        matrix.reverse();
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        if (!this.isPaused) {
            this.lastTime = performance.now();
            this.gameLoop();
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM 加载完成');
    try {
        const game = new Tetris();
        console.log('游戏实例创建成功');

        // 绑定开始按钮事件
        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', function () {
                console.log('开始按钮被点击');
                game.start();
            });
        }

        // 绑定暂停按钮事件
        const pauseBtn = document.getElementById('pause-btn');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', function () {
                console.log('暂停按钮被点击');
                game.togglePause();
            });
        }

        // 绑定重新开始按钮事件
        const restartBtns = document.querySelectorAll('#restart-btn, #restart-btn-2');
        restartBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                console.log('重新开始按钮被点击');
                game.reset();
                game.start();
            });
        });

        // 绑定方向控制按钮事件
        const leftBtn = document.getElementById('left-btn');
        const rightBtn = document.getElementById('right-btn');
        const downBtn = document.getElementById('down-btn');
        const rotateBtn = document.getElementById('rotate-btn');

        if (leftBtn) {
            leftBtn.addEventListener('click', function () {
                game.move(-1);
            });
        }

        if (rightBtn) {
            rightBtn.addEventListener('click', function () {
                game.move(1);
            });
        }

        if (downBtn) {
            downBtn.addEventListener('click', function () {
                game.drop();
            });
        }

        if (rotateBtn) {
            rotateBtn.addEventListener('click', function () {
                game.rotate();
                if (game.collide()) {
                    for (let i = 0; i < 3; i++) game.rotate();
                }
            });
        }
    } catch (error) {
        console.error('游戏初始化失败:', error);
    }
});

// 初始化游戏
const game = new Tetris(); 