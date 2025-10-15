import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Trophy, X } from 'lucide-react';
import "./App.css";
const GRID_SIZE = 4;
const CELL_SIZE = 100;
const CELL_GAP = 10;

// Tile color mapping
const getTileColor = (value) => {
  const colors = {
    2: 'bg-amber-100 text-gray-800',
    4: 'bg-amber-200 text-gray-800',
    8: 'bg-orange-300 text-white',
    16: 'bg-orange-400 text-white',
    32: 'bg-orange-500 text-white',
    64: 'bg-red-500 text-white',
    128: 'bg-yellow-400 text-white',
    256: 'bg-yellow-500 text-white',
    512: 'bg-yellow-600 text-white',
    1024: 'bg-yellow-700 text-white',
    2048: 'bg-yellow-800 text-white',
  };
  return colors[value] || 'bg-gray-800 text-white';
};

// Pure function to create empty board
const createEmptyBoard = (size) => {
  return Array(size).fill(null).map(() => Array(size).fill(0));
};

// Pure function to get empty cells
const getEmptyCells = (board) => {
  const empty = [];
  board.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell === 0) empty.push({ row: i, col: j });
    });
  });
  return empty;
};

// Pure function to add random tile
const addRandomTile = (board) => {
  const emptyCells = getEmptyCells(board);
  if (emptyCells.length === 0) return board;
  
  const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const value = Math.random() < 0.9 ? 2 : 4;
  
  const newBoard = board.map(r => [...r]);
  newBoard[row][col] = value;
  return newBoard;
};

// Pure function to initialize board with 2 random tiles
const initializeBoard = (size) => {
  let board = createEmptyBoard(size);
  board = addRandomTile(board);
  board = addRandomTile(board);
  return board;
};

// Pure function to move and merge tiles left
const moveLeft = (board) => {
  let newBoard = board.map(r => [...r]);
  let scoreGained = 0;
  let moved = false;

  for (let i = 0; i < newBoard.length; i++) {
    let row = newBoard[i].filter(cell => cell !== 0);
    let newRow = [];
    
    for (let j = 0; j < row.length; j++) {
      if (j < row.length - 1 && row[j] === row[j + 1]) {
        newRow.push(row[j] * 2);
        scoreGained += row[j] * 2;
        j++;
      } else {
        newRow.push(row[j]);
      }
    }
    
    while (newRow.length < newBoard.length) {
      newRow.push(0);
    }
    
    if (JSON.stringify(newRow) !== JSON.stringify(newBoard[i])) {
      moved = true;
    }
    
    newBoard[i] = newRow;
  }

  return { board: newBoard, score: scoreGained, moved };
};

// Pure function to rotate board 90 degrees clockwise
const rotateBoard = (board) => {
  const size = board.length;
  return board[0].map((_, i) => 
    board.map(row => row[i]).reverse()
  );
};

// Pure function to move in any direction
const move = (board, direction) => {
  let rotations = 0;
  let tempBoard = board;

  // Rotate to convert all moves to left moves
  if (direction === 'up') rotations = 1;
  else if (direction === 'right') rotations = 2;
  else if (direction === 'down') rotations = 3;

  for (let i = 0; i < rotations; i++) {
    tempBoard = rotateBoard(tempBoard);
  }

  const result = moveLeft(tempBoard);

  // Rotate back
  for (let i = 0; i < (4 - rotations) % 4; i++) {
    result.board = rotateBoard(result.board);
  }

  return result;
};

// Pure function to check if game is over
const isGameOver = (board) => {
  // Check for empty cells
  if (getEmptyCells(board).length > 0) return false;

  // Check for possible merges
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      const current = board[i][j];
      if (j < board[i].length - 1 && current === board[i][j + 1]) return false;
      if (i < board.length - 1 && current === board[i + 1][j]) return false;
    }
  }

  return true;
};

// Pure function to check if won
const hasWon = (board) => {
  return board.some(row => row.some(cell => cell === 2048));
};

const App = () => {
  const [boardSize, setBoardSize] = useState(GRID_SIZE);
  const [board, setBoard] = useState(() => initializeBoard(GRID_SIZE));
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);

  // Handle keyboard input
  const handleKeyDown = useCallback((e) => {
    if (gameOver || showWinModal) return;

    const keyMap = {
      'ArrowUp': 'up',
      'ArrowDown': 'down',
      'ArrowLeft': 'left',
      'ArrowRight': 'right',
    };

    const direction = keyMap[e.key];
    if (!direction) return;

    e.preventDefault();
    handleMove(direction);
  }, [gameOver, showWinModal, board, score]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleMove = (direction) => {
    const result = move(board, direction);
    
    if (!result.moved) return;

    const newBoard = addRandomTile(result.board);
    const newScore = score + result.score;
    
    setBoard(newBoard);
    setScore(newScore);
    
    if (newScore > bestScore) {
      setBestScore(newScore);
    }

    if (!won && hasWon(newBoard)) {
      setWon(true);
      setShowWinModal(true);
    }

    if (isGameOver(newBoard)) {
      setGameOver(true);
    }
  };

  const restartGame = () => {
    setBoard(initializeBoard(boardSize));
    setScore(0);
    setGameOver(false);
    setWon(false);
    setShowWinModal(false);
  };

  const changeBoardSize = (newSize) => {
    setBoardSize(newSize);
    setBoard(initializeBoard(newSize));
    setScore(0);
    setGameOver(false);
    setWon(false);
    setShowWinModal(false);
  };

  const continueGame = () => {
    setShowWinModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-gray-800 mb-2">2048</h1>
          <p className="text-gray-600">Join tiles to reach 2048!</p>
        </div>

        {/* Score and Controls */}
        <div className="flex justify-between items-center mb-6 gap-4">
          <div className="flex gap-3">
            <div className="bg-orange-400 rounded-lg px-6 py-3">
              <div className="text-white text-sm font-semibold">SCORE</div>
              <div className="text-white text-2xl font-bold">{score}</div>
            </div>
            <div className="bg-orange-400 rounded-lg px-6 py-3">
              <div className="text-white text-sm font-semibold">BEST</div>
              <div className="text-white text-2xl font-bold">{bestScore}</div>
            </div>
          </div>
          
          <button
            onClick={restartGame}
            className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <RotateCcw size={20} />
            New Game
          </button>
        </div>

        {/* Board Size Selector */}
        <div className="mb-6 flex items-center gap-3">
          <span className="text-gray-700 font-semibold">Board Size:</span>
          {[3, 4, 5, 6].map(size => (
            <button
              key={size}
              onClick={() => changeBoardSize(size)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                boardSize === size
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-orange-100'
              }`}
            >
              {size}x{size}
            </button>
          ))}
        </div>

        {/* Game Board */}
        <div 
          className="bg-amber-300 rounded-xl p-3 mx-auto shadow-2xl"
          style={{ 
            width: 'fit-content',
            display: 'grid',
            gridTemplateColumns: `repeat(${boardSize}, ${CELL_SIZE}px)`,
            gap: `${CELL_GAP}px`
          }}
        >
          {board.map((row, i) => (
            row.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                className={`rounded-lg flex items-center justify-center font-bold transition-all duration-150 ${
                  cell === 0 
                    ? 'bg-amber-200' 
                    : getTileColor(cell)
                }`}
                style={{ 
                  width: `${CELL_SIZE}px`, 
                  height: `${CELL_SIZE}px`,
                  fontSize: cell >= 1000 ? '28px' : cell >= 100 ? '36px' : '44px'
                }}
              >
                {cell !== 0 && cell}
              </div>
            ))
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center text-gray-600">
          <p className="text-sm">Use arrow keys to move tiles</p>
          <p className="text-xs mt-1">Tiles with the same number merge into one!</p>
        </div>

        {/* Win Modal */}
        {showWinModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
              <div className="text-center">
                <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-4xl font-bold text-gray-800 mb-2">You Win!</h2>
                <p className="text-gray-600 mb-6">You reached 2048!</p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={continueGame}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Keep Playing
                  </button>
                  <button
                    onClick={restartGame}
                    className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    New Game
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Game Over Modal */}
        {gameOver && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
              <div className="text-center">
                <X className="w-20 h-20 text-red-500 mx-auto mb-4" />
                <h2 className="text-4xl font-bold text-gray-800 mb-2">Game Over!</h2>
                <p className="text-gray-600 mb-2">No more moves available</p>
                <p className="text-2xl font-bold text-orange-500 mb-6">Score: {score}</p>
                <button
                  onClick={restartGame}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;