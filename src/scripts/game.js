class Game {
    constructor() {
        this.difficulties = {
            beginner: { rows: 9, cols: 9, mines: 10 },
            intermediate: { rows: 16, cols: 16, mines: 40 },
            expert: { rows: 16, cols: 30, mines: 99 }
        };

        this.board = null;
        this.gameStarted = false;
        this.gameOver = false;
        this.mineCount = 0;
        this.flagCount = 0;
        this.timer = 0;
        this.timerInterval = null;

        this.initializeGame();
        this.setupEventListeners();
    }

    initializeGame() {
        const difficulty = document.getElementById('difficulty').value;
        const { rows, cols, mines } = this.difficulties[difficulty];

        this.board = new Board(rows, cols, mines);
        this.mineCount = mines;
        this.flagCount = 0;
        this.gameStarted = false;
        this.gameOver = false;
        this.timer = 0;

        UI.resetGameBoard();
        this.renderBoard();

        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        UI.updateTimer(0);
        UI.updateMineCounter(this.mineCount);
    }

    startTimer() {
        if (this.timerInterval) return;

        this.timerInterval = setInterval(() => {
            this.timer++;
            UI.updateTimer(this.timer);
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    handleCellClick(row, col, isRightClick = false) {
        if (this.gameOver) return;

        if (isRightClick) {
            this.handleFlag(row, col);
            return;
        }

        if (!this.gameStarted) {
            this.board.placeMines(row, col);
            this.gameStarted = true;
            this.startTimer();
        }

        const result = this.board.revealCell(row, col);

        if (result === 'mine') {
            this.gameOver = true;
            this.revealAllMines();
            this.stopTimer();
            this.showGameOver();
        } else if (this.checkWin()) {
            this.gameOver = true;
            this.stopTimer();
            this.handleWin();
        }

        this.renderBoard();
    }

    handleFlag(row, col) {
        if (!this.gameStarted) return;

        const cell = this.board.getCell(row, col);
        if (cell.isRevealed) return;

        if (cell.isFlagged) {
            cell.isFlagged = false;
            this.flagCount--;
        } else if (this.flagCount < this.mineCount) {
            cell.isFlagged = true;
            this.flagCount++;
        }

        UI.updateMineCounter(this.mineCount - this.flagCount);
        this.renderBoard();
    }

    revealAllMines() {
        for (let row = 0; row < this.board.rows; row++) {
            for (let col = 0; col < this.board.cols; col++) {
                const cell = this.board.getCell(row, col);
                if (cell.isMine) {
                    cell.isRevealed = true;
                }
            }
        }
    }

    checkWin() {
        for (let row = 0; row < this.board.rows; row++) {
            for (let col = 0; col < this.board.cols; col++) {
                const cell = this.board.getCell(row, col);
                if (!cell.isMine && !cell.isRevealed) {
                    return false;
                }
            }
        }
        return true;
    }

    handleWin() {
        const score = {
            difficulty: document.getElementById('difficulty').value,
            time: this.timer,
            date: new Date().toLocaleDateString()
        };

        Storage.saveHighScore(score);
        UI.showHighScores();
        UI.showVictory();
        UI.showToast('🏆 Congratulations! You won!');
    }

    showGameOver() {
        UI.showGameOver();
        UI.showToast('💥 Game Over!');
    }

    renderBoard() {
        const gameBoard = document.getElementById('gameBoard');
        gameBoard.style.gridTemplateColumns = `repeat(${this.board.cols}, 40px)`;
        gameBoard.innerHTML = '';

        for (let row = 0; row < this.board.rows; row++) {
            for (let col = 0; col < this.board.cols; col++) {
                const cell = this.board.getCell(row, col);
                const cellElement = document.createElement('button');
                cellElement.className = 'cell';

                if (cell.isRevealed) {
                    if (cell.isMine) {
                        cellElement.textContent = '💣';
                        cellElement.classList.add('exploded');
                    } else {
                        const count = this.board.getAdjacentMines(row, col);
                        cellElement.textContent = count === 0 ? '⬜' : count;
                        cellElement.setAttribute('data-number', count);
                    }
                } else if (cell.isFlagged) {
                    cellElement.textContent = '🚩';
                } else {
                    cellElement.textContent = '🟦';
                }

                cellElement.addEventListener('click', () => this.handleCellClick(row, col));
                cellElement.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    this.handleCellClick(row, col, true);
                });

                gameBoard.appendChild(cellElement);
            }
        }
    }

    setupEventListeners() {
        document.getElementById('newGame').addEventListener('click', () => {
            this.initializeGame();
        });

        document.getElementById('difficulty').addEventListener('change', () => {
            this.initializeGame();
        });

        document.getElementById('saveGame').addEventListener('click', () => {
            Storage.saveGameState(this.board, this.timer, this.flagCount);
            UI.showToast('Game saved!');
        });

        document.getElementById('loadGame').addEventListener('click', () => {
            const savedState = Storage.loadGameState();
            if (savedState) {
                this.loadGameState(savedState);
                UI.showToast('Game loaded!');
            }
        });
    }

    loadGameState(savedState) {
        this.board = Board.fromState(savedState.board);
        this.timer = savedState.timer;
        this.flagCount = savedState.flagCount;
        this.gameStarted = true;
        this.gameOver = false;

        UI.updateTimer(this.timer);
        UI.updateMineCounter(this.mineCount - this.flagCount);

        this.renderBoard();
        this.startTimer();
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});
