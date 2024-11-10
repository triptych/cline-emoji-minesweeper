class UI {
    static showHighScores() {
        const highScores = Storage.getHighScores();
        const container = document.getElementById('highScoresList');

        if (!container) return;

        container.innerHTML = '';

        if (highScores.length === 0) {
            container.innerHTML = '<div class="high-score-entry">No scores yet!</div>';
            return;
        }

        highScores.forEach((score, index) => {
            const entry = document.createElement('div');
            entry.className = 'high-score-entry';
            entry.innerHTML = `
                <span>${index + 1}. ${score.difficulty}</span>
                <span>${score.time}s</span>
                <span>${score.date}</span>
            `;
            container.appendChild(entry);
        });
    }

    static showToast(message, duration = 3000) {
        // Remove existing toast if any
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        // Create and show new toast
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        // Trigger animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // Remove toast after duration
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, duration);
    }

    static toggleLoading(button, isLoading) {
        if (isLoading) {
            button.disabled = true;
            const loadingSpinner = document.createElement('span');
            loadingSpinner.className = 'loading';
            button.textContent = '';
            button.appendChild(loadingSpinner);
        } else {
            button.disabled = false;
            button.textContent = button.getAttribute('data-text') || button.textContent;
        }
    }

    static updateMineCounter(count) {
        const counter = document.getElementById('mineCount');
        if (counter) {
            counter.textContent = count;
        }
    }

    static updateTimer(time) {
        const timer = document.getElementById('timeCount');
        if (timer) {
            timer.textContent = time;
        }
    }

    static setDifficulty(difficulty) {
        const select = document.getElementById('difficulty');
        if (select) {
            select.value = difficulty;
        }
    }

    static showGameOver() {
        const gameBoard = document.getElementById('gameBoard');
        if (gameBoard) {
            gameBoard.classList.add('game-over');
        }
    }

    static showVictory() {
        const gameBoard = document.getElementById('gameBoard');
        if (gameBoard) {
            gameBoard.classList.add('game-won');
        }
    }

    static resetGameBoard() {
        const gameBoard = document.getElementById('gameBoard');
        if (gameBoard) {
            gameBoard.classList.remove('game-over', 'game-won');
        }
    }
}

// Initialize UI elements when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    UI.showHighScores();
});
