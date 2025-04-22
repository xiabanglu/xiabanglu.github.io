class Tetris {
    constructor() {
        console.log('游戏初始化开始');
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.nextPieceCanvas = document.getElementById('next-piece-canvas');
        this.nextPieceCtx = this.nextPieceCanvas.getContext('2d');
        
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
        
        // 初始化方块类型和颜色
        this.pieces = [
            null,
            [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], // I
            [[2, 0, 0], [2, 2, 2], [0, 0, 0]],                         // J
            [[0, 0, 3], [3, 3, 3], [0, 0, 0]],                         // L
            [[0, 4, 4], [0, 4, 4], [0, 0, 0]],                         // O
            [[0, 5, 5], [5, 5, 0], [0, 0, 0]],                         // S
            [[0, 6, 0], [6, 6, 6], [0, 0, 0]],                         // T
            [[7, 7, 0], [0, 7, 7], [0, 0, 0]]                          // Z
        ];
        
        this.colors = [
            null,
            '#FF0D72', // I
            '#0DC2FF', // J
            '#0DFF72', // L
            '#F538FF', // O
            '#FF8E0D', // S
            '#FFE138', // T
            '#3877FF'  // Z
        ];
        
        // 初始化当前方块和下一个方块
        this.currentPiece = this.newPiece();
        this.nextPiece = this.newPiece();
        
        this.dropCounter = 0;
        this.dropInterval = 1000;
        this.lastTime = 0;
        
        console.log('游戏初始化完成');
    }

    init() {
        console.log('初始化事件监听器');
        const startBtn = document.getElementById('start-btn');
        const pauseBtn = document.getElementById('pause-btn');
        
        if (!startBtn || !pauseBtn) {
            console.error('按钮元素未找到');
            return;
        }

        startBtn.addEventListener('click', () => {
            console.log('开始按钮被点击');
            this.start();
        });
        
        pauseBtn.addEventListener('click', () => {
            console.log('暂停按钮被点击');
            this.togglePause();
        });
        
        document.addEventListener('keydown', (e) => {
            console.log('按键按下:', e.keyCode);
            this.handleKeyPress(e);
        });
        
        this.updateScore();
        this.drawNextPiece();
        console.log('事件监听器初始化完成');
    }

    start() {
        console.log('游戏开始');
        if (this.gameOver) {
            this.reset();
        }
        this.gameOver = false;
        this.isPaused = false;
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
    }

    togglePause() {
        console.log('游戏暂停状态切换:', !this.isPaused);
        this.isPaused = !this.isPaused;
        if (!this.isPaused && !this.gameOver) {
            requestAnimationFrame((time) => this.gameLoop(time));
        }
    }

    newPiece() {
        // 生成1-7之间的随机数
        const pieceType = Math.floor(Math.random() * 7) + 1;
        console.log('生成新方块，类型:', pieceType);
        
        // 确保方块类型有效
        if (!this.pieces[pieceType]) {
            console.error('无效的方块类型:', pieceType);
            return this.newPiece(); // 如果无效，重新生成
        }
        
        return {
            type: pieceType,
            matrix: JSON.parse(JSON.stringify(this.pieces[pieceType])), // 深拷贝方块矩阵
            pos: {x: Math.floor(this.cols / 2) - 2, y: 0}
        };
    }

    drawMatrix(matrix, offset, ctx = this.ctx) {
        matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    ctx.fillStyle = this.colors[value];
                    ctx.fillRect(
                        (x + offset.x) * this.blockSize,
                        (y + offset.y) * this.blockSize,
                        this.blockSize,
                        this.blockSize
                    );
                    ctx.strokeStyle = '#000';
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

    draw() {
        console.log('绘制游戏画面');
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawMatrix(this.board, {x: 0, y: 0});
        this.drawMatrix(this.currentPiece.matrix, this.currentPiece.pos);
    }

    drawNextPiece() {
        this.nextPieceCtx.fillStyle = '#000';
        this.nextPieceCtx.fillRect(0, 0, this.nextPieceCanvas.width, this.nextPieceCanvas.height);
        const offset = {
            x: (this.nextPieceCanvas.width / this.blockSize - this.nextPiece.matrix[0].length) / 2,
            y: (this.nextPieceCanvas.height / this.blockSize - this.nextPiece.matrix.length) / 2
        };
        this.drawMatrix(this.nextPiece.matrix, offset, this.nextPieceCtx);
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

    rotate() {
        const matrix = this.currentPiece.matrix;
        const N = matrix.length;
        for (let y = 0; y < N; y++) {
            for (let x = 0; x < y; x++) {
                [
                    matrix[x][y],
                    matrix[y][x]
                ] = [
                    matrix[y][x],
                    matrix[x][y]
                ];
            }
        }
        matrix.forEach(row => row.reverse());
    }

    move(dir) {
        this.currentPiece.pos.x += dir;
        if (this.collide()) {
            this.currentPiece.pos.x -= dir;
        }
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
            }
        }
        this.dropCounter = 0;
    }

    collide() {
        const matrix = this.currentPiece.matrix;
        const pos = this.currentPiece.pos;
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

    updateScore() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
    }

    handleKeyPress(event) {
        if (this.isPaused || this.gameOver) return;
        switch (event.keyCode) {
            case 37: // 左箭头
                this.move(-1);
                break;
            case 39: // 右箭头
                this.move(1);
                break;
            case 40: // 下箭头
                this.drop();
                break;
            case 38: // 上箭头
                this.rotate();
                if (this.collide()) {
                    for (let i = 0; i < 3; i++) this.rotate();
                }
                break;
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
}

// 初始化游戏
const game = new Tetris(); 