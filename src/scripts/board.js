class Cell {
    constructor() {
        this.isMine = false;
        this.isRevealed = false;
        this.isFlagged = false;
    }

    static fromState(state) {
        const cell = new Cell();
        Object.assign(cell, state);
        return cell;
    }
}

class Board {
    constructor(rows, cols, mineCount) {
        this.rows = rows;
        this.cols = cols;
        this.mineCount = mineCount;
        this.grid = this.createGrid();
    }

    createGrid() {
        const grid = [];
        for (let row = 0; row < this.rows; row++) {
            grid[row] = [];
            for (let col = 0; col < this.cols; col++) {
                grid[row][col] = new Cell();
            }
        }
        return grid;
    }

    placeMines(firstRow, firstCol) {
        let minesPlaced = 0;

        // Create a list of all possible positions excluding the first click and its adjacent cells
        const positions = [];
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (Math.abs(row - firstRow) > 1 || Math.abs(col - firstCol) > 1) {
                    positions.push([row, col]);
                }
            }
        }

        // Randomly place mines
        while (minesPlaced < this.mineCount && positions.length > 0) {
            const randomIndex = Math.floor(Math.random() * positions.length);
            const [row, col] = positions.splice(randomIndex, 1)[0];
            this.grid[row][col].isMine = true;
            minesPlaced++;
        }
    }

    getCell(row, col) {
        return this.grid[row][col];
    }

    isValidCell(row, col) {
        return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
    }

    getAdjacentCells(row, col) {
        const adjacent = [];
        for (let r = -1; r <= 1; r++) {
            for (let c = -1; c <= 1; c++) {
                if (r === 0 && c === 0) continue;

                const newRow = row + r;
                const newCol = col + c;

                if (this.isValidCell(newRow, newCol)) {
                    adjacent.push([newRow, newCol]);
                }
            }
        }
        return adjacent;
    }

    getAdjacentMines(row, col) {
        let count = 0;
        const adjacent = this.getAdjacentCells(row, col);

        for (const [r, c] of adjacent) {
            if (this.grid[r][c].isMine) {
                count++;
            }
        }

        return count;
    }

    revealCell(row, col) {
        const cell = this.getCell(row, col);

        if (cell.isRevealed || cell.isFlagged) {
            return null;
        }

        cell.isRevealed = true;

        if (cell.isMine) {
            return 'mine';
        }

        // If cell has no adjacent mines, reveal adjacent cells
        if (this.getAdjacentMines(row, col) === 0) {
            this.floodFill(row, col);
        }

        return 'safe';
    }

    floodFill(row, col) {
        const adjacent = this.getAdjacentCells(row, col);

        for (const [r, c] of adjacent) {
            const cell = this.getCell(r, c);
            if (!cell.isRevealed && !cell.isFlagged && !cell.isMine) {
                cell.isRevealed = true;
                if (this.getAdjacentMines(r, c) === 0) {
                    this.floodFill(r, c);
                }
            }
        }
    }

    static fromState(state) {
        const board = new Board(state.rows, state.cols, state.mineCount);
        board.grid = state.grid.map(row =>
            row.map(cellState => Cell.fromState(cellState))
        );
        return board;
    }
}
