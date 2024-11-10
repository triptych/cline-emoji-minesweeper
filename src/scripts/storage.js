class Storage {
    static GAME_STATE_KEY = 'minesweeper_game_state';
    static HIGH_SCORES_KEY = 'minesweeper_high_scores';
    static MAX_HIGH_SCORES = 10;

    static saveGameState(board, timer, flagCount) {
        const gameState = {
            board: {
                rows: board.rows,
                cols: board.cols,
                mineCount: board.mineCount,
                grid: board.grid
            },
            timer,
            flagCount
        };

        localStorage.setItem(this.GAME_STATE_KEY, JSON.stringify(gameState));
    }

    static loadGameState() {
        const savedState = localStorage.getItem(this.GAME_STATE_KEY);
        if (!savedState) return null;

        try {
            return JSON.parse(savedState);
        } catch (e) {
            console.error('Error loading game state:', e);
            return null;
        }
    }

    static saveHighScore(score) {
        const scores = this.getHighScores();
        scores.push(score);

        // Sort by time (ascending) and difficulty (expert > intermediate > beginner)
        scores.sort((a, b) => {
            if (a.difficulty !== b.difficulty) {
                const difficultyOrder = { expert: 0, intermediate: 1, beginner: 2 };
                return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
            }
            return a.time - b.time;
        });

        // Keep only the top scores
        const topScores = scores.slice(0, this.MAX_HIGH_SCORES);
        localStorage.setItem(this.HIGH_SCORES_KEY, JSON.stringify(topScores));
    }

    static getHighScores() {
        const scores = localStorage.getItem(this.HIGH_SCORES_KEY);
        if (!scores) return [];

        try {
            return JSON.parse(scores);
        } catch (e) {
            console.error('Error loading high scores:', e);
            return [];
        }
    }

    static clearHighScores() {
        localStorage.removeItem(this.HIGH_SCORES_KEY);
    }

    static clearGameState() {
        localStorage.removeItem(this.GAME_STATE_KEY);
    }

    static clearAll() {
        this.clearGameState();
        this.clearHighScores();
    }
}
