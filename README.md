# Emoji Minesweeper 💣

A modern take on the classic Minesweeper game, implemented with emojis and featuring save/load functionality and high scores.

## How to Play 🎮

1. **Objective**: Clear the board without detonating any mines.
2. **Controls**:
   - Left Click: Reveal a cell
   - Right Click: Place/Remove a flag 🚩
3. **Game Elements**:
   - 🟦 Hidden cell
   - 🚩 Flagged cell
   - 💣 Mine
   - ⬜ Empty revealed cell
   - Numbers (1-8): Indicate adjacent mines

### Difficulty Levels

- **Beginner**: 9x9 grid with 10 mines
- **Intermediate**: 16x16 grid with 40 mines
- **Expert**: 16x30 grid with 99 mines

### Features

- Timer tracking your solving speed ⏱️
- Mine counter showing remaining mines 💣
- Save/Load game functionality
- High scores tracking 🏆

## Code Architecture 🏗️

The game is built using vanilla JavaScript with a modular architecture split into several key components:

### Core Components

1. **Game Class** (`game.js`)
   - Main game controller
   - Handles game initialization, timer, and game state
   - Manages user interactions and game flow
   - Coordinates between Board, UI, and Storage components

2. **Board Class** (`board.js`)
   - Manages the game grid and cell states
   - Handles mine placement and cell revelation
   - Implements flood fill algorithm for revealing empty cells
   - Contains game logic for adjacent mine counting

3. **Cell Class** (`board.js`)
   - Represents individual grid cells
   - Tracks cell properties (isMine, isRevealed, isFlagged)

4. **UI Module** (`ui.js`)
   - Handles all DOM updates and user interface elements
   - Manages game board rendering
   - Updates timer and mine counter
   - Shows game over and victory states

5. **Storage Module** (`storage.js`)
   - Manages save/load game functionality
   - Handles high score persistence

### Key Features Implementation

1. **Mine Placement**
   - First click is always safe
   - Mines are randomly distributed after first click
   - Ensures playable board configuration

2. **Flood Fill**
   - Automatically reveals adjacent empty cells
   - Implements recursive revelation for connected empty areas

3. **Game State Management**
   - Tracks game progress
   - Handles win/lose conditions
   - Manages difficulty settings

4. **Save/Load System**
   - Persists complete game state
   - Allows resuming games later

## File Structure 📁

```
├── index.html           # Main game HTML
├── src/
│   ├── scripts/
│   │   ├── game.js     # Main game controller
│   │   ├── board.js    # Board and Cell classes
│   │   ├── ui.js       # UI management
│   │   └── storage.js  # Save/Load functionality
│   └── styles/
│       ├── main.css    # Main styles
│       ├── board.css   # Game board styles
│       └── ui.css      # UI element styles
```

## Getting Started 🚀

1. Clone the repository
2. Open `index.html` in a modern web browser
3. Select your preferred difficulty level
4. Start playing!

No build process or dependencies required - it's pure HTML, CSS, and JavaScript!
