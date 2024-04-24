import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { BoxGeometry, MeshStandardMaterial, Mesh } from 'three';
import { ThreeEvent } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

type CellState = 'hidden' | 'revealed' | 'mine' | 'marked';

interface Cell {
  state: CellState;
  isMine: boolean;
  hasNearbyMines: boolean;
  nearbyMinesCount: number;
}

interface MinesweeperProps {
  rows: number;
  cols: number;
  mines: number;
}

const Minesweeper: React.FC<MinesweeperProps> = ({ rows, cols, mines }) => {
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [playerWon, setPlayerWon] = useState(false);
  const [markedMines, setMarkedMines] = useState(0);
  const meshRef = useRef<Mesh>(null);

  useEffect(() => {
    initializeBoard();
  }, []);

  const initializeBoard = () => {
    const newBoard: Cell[][] = [];
    for (let i = 0; i < rows; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < cols; j++) {
        row.push({
          state: 'hidden',
          isMine: false,
          hasNearbyMines: false,
          nearbyMinesCount: 0,
        });
      }
      newBoard.push(row);
    }
    placeMines(newBoard, mines);
    setBoard(newBoard);
  };

  const placeMines = (board: Cell[][], mines: number) => {
    let minesPlaced = 0;
    while (minesPlaced < mines) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      if (!board[row][col].isMine) {
        board[row][col].isMine = true;
        updateNearbyMinesCounts(board, row, col);
        minesPlaced++;
      }
    }
  };

  const updateNearbyMinesCounts = (
    board: Cell[][],
    row: number,
    col: number
  ) => {
    for (let i = Math.max(row - 1, 0); i <= Math.min(row + 1, rows - 1); i++) {
      for (
        let j = Math.max(col - 1, 0);
        j <= Math.min(col + 1, cols - 1);
        j++
      ) {
        if (!board[i][j].isMine) {
          board[i][j].hasNearbyMines = true;
          board[i][j].nearbyMinesCount++;
        }
      }
    }
  };

  const handleCellClick = (row: number, col: number) => {
    if (!gameOver && !playerWon) {
      const newBoard = [...board];
      revealCell(newBoard, row, col);
      setBoard(newBoard);
    }
  };

  const revealCell = (board: Cell[][], row: number, col: number) => {
    if (board[row][col].isMine) {
      setGameOver(true);
      return;
    }

    const revealRecursive = (r: number, c: number) => {
      if (
        r < 0 ||
        r >= rows ||
        c < 0 ||
        c >= cols ||
        board[r][c].state === 'revealed' ||
        board[r][c].state === 'marked'
      ) {
        return;
      }

      board[r][c].state = 'revealed';

      if (!board[r][c].hasNearbyMines) {
        revealRecursive(r - 1, c);
        revealRecursive(r + 1, c);
        revealRecursive(r, c - 1);
        revealRecursive(r, c + 1);
        revealRecursive(r - 1, c - 1);
        revealRecursive(r - 1, c + 1);
        revealRecursive(r + 1, c - 1);
        revealRecursive(r + 1, c + 1);
      }
    };

    revealRecursive(row, col);
    checkForWin();
  };

  const handleCellRightClick = (
    row: number,
    col: number,
    event: ThreeEvent<MouseEvent>
  ) => {
    event.nativeEvent.preventDefault();
    if (!gameOver && !playerWon) {
      const newBoard = [...board];
      if (newBoard[row][col].state === 'hidden') {
        newBoard[row][col].state = 'marked';
        setMarkedMines(markedMines + 1);
      } else if (newBoard[row][col].state === 'marked') {
        newBoard[row][col].state = 'hidden';
        setMarkedMines(markedMines - 1);
      }
      setBoard(newBoard);
      checkForWin();
    }
  };

  const checkForWin = () => {
    let allMinesMarked = true;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (board[i][j].isMine && board[i][j].state !== 'marked') {
          allMinesMarked = false;
          break;
        }
      }
    }

    if (allMinesMarked) {
      setPlayerWon(true);
    }
  };

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      <Cells
        board={board}
        rows={rows}
        cols={cols}
        onClick={handleCellClick}
        onRightClick={handleCellRightClick}
      />
      <OrbitControls />
    </Canvas>
  );
};

interface CellsProps {
  board: Cell[][];
  rows: number;
  cols: number;
  onClick: (row: number, col: number) => void;
  onRightClick: (
    row: number,
    col: number,
    event: ThreeEvent<MouseEvent>
  ) => void;
}

const Cells: React.FC<CellsProps> = ({
  board,
  rows,
  cols,
  onClick,
  onRightClick,
}) => {
  const meshRef = useRef<Mesh>(null);

  /* useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  }); */

  return (
    <mesh ref={meshRef}>
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            cell={cell}
            position={[colIndex * 2, rowIndex * 2, 0]}
            onClick={() => onClick(rowIndex, colIndex)}
            onRightClick={(event) => onRightClick(rowIndex, colIndex, event)}
          />
        ))
      )}
    </mesh>
  );
};

interface CellProps {
  cell: Cell;
  position: [number, number, number];
  onClick: () => void;
  onRightClick: (event: ThreeEvent<MouseEvent>) => void;
}

const Cell: React.FC<CellProps> = ({
  cell,
  position,
  onClick,
  onRightClick,
}) => {
  const meshRef = useRef<Mesh>(null);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onClick();
  };

  const handleRightClick = (event: ThreeEvent<MouseEvent>) => {
    event.nativeEvent.preventDefault();
    event.stopPropagation();
    onRightClick(event);
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={handleClick}
      onContextMenu={handleRightClick}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={
          cell.state === 'revealed'
            ? 'gray'
            : cell.state === 'marked'
            ? 'yellow'
            : cell.isMine
            ? 'red'
            : 'white'
        }
      />
    </mesh>
  );
};

export default Minesweeper;
