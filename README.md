# 2048 Game Implementation

A fully functional implementation of the popular 2048 game with a modern GUI, built using React and functional programming principles.

## 🎮 Live Demo

[Play the game here](#) *(https://kashish2310.github.io/Game2048)*

## Features

- **Configurable Board Size**: Play on 3x3, 4x4, 5x5, or 6x6 grids
- **Smooth Gameplay**: Arrow key controls for intuitive tile movement
- **Score Tracking**: Real-time score updates and best score persistence
- **Win/Lose Detection**: Automatic detection when reaching 2048 or no moves available
- **Responsive UI**: Beautiful, modern interface with smooth animations
- **Game Controls**: Restart game and change board size anytime
- **Functional Programming**: Pure functions for all game logic

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/kashish2310/Game2048.git
cd game2048
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open in browser**
Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

## How to Play

1. **Objective**: Combine tiles with the same number to reach 2048
2. **Controls**: Use arrow keys (↑ ↓ ← →) to move tiles
3. **Merging**: When two tiles with the same number touch, they merge into one
4. **Scoring**: Each merge adds the tile value to your score
5. **Winning**: Reach 2048 to win (you can continue playing after)
6. **Losing**: Game ends when the board is full and no moves are possible

## Implementation Details

### Architecture

The game follows functional programming principles with the following structure:

#### Pure Functions (No Side Effects)

- `createEmptyBoard(size)`: Creates an empty board of given size
- `getEmptyCells(board)`: Returns array of empty cell positions
- `addRandomTile(board)`: Adds a random tile (2 or 4) to the board
- `initializeBoard(size)`: Creates initial board with 2 random tiles
- `moveLeft(board)`: Handles tile movement and merging for left direction
- `rotateBoard(board)`: Rotates board 90° clockwise
- `move(board, direction)`: Handles movement in any direction
- `isGameOver(board)`: Checks if no moves are possible
- `hasWon(board)`: Checks if 2048 tile exists

#### State Management

React hooks are used for state management:
- `useState`: Manages board state, score, game status
- `useEffect`: Handles keyboard event listeners
- `useCallback`: Optimizes event handlers

### Key Algorithms

#### Movement Algorithm
1. All directional moves are converted to left moves using rotation
2. For each row:
   - Filter out zeros
   - Merge adjacent equal tiles
   - Add zeros back to fill row
3. Rotate back to original orientation

#### Merge Logic
```javascript
// Simplified merge example for [2, 2, 4, 4]
// Step 1: Filter [2, 2, 4, 4]
// Step 2: Merge [4, 8]
// Step 3: Pad [4, 8, 0, 0]
```

#### Rotation Logic
- Board rotation enables reusing left-move logic for all directions
- Up = 1 rotation, Right = 2 rotations, Down = 3 rotations

### Data Structures

- **Board**: 2D array (Array<Array<number>>)
- **Empty Cells**: Array of objects with {row, col} coordinates
- **Score**: Integer tracking merged tile values

## Technology Stack

- **React**: UI framework
- **Tailwind CSS**: Styling
- **Lucide React**: Icons
- **JavaScript ES6+**: Core logic

## Project Structure

```
game2048/
├── src/
│   ├── App.jsx              # Main game component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── public/
│   └── index.html          # HTML template
├── package.json            # Dependencies
└── README.md              # This file
```
