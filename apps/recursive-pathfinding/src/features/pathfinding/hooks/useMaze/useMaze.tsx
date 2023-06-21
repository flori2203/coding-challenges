import { useContext } from 'react';
import MazeContext from 'context/MazeContext';
import recursiveAStar from 'features/pathfinding/recursiveAStar';
import { MazeDetails } from 'context/MazeContext/MazeContext';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const useMaze = () => {
  const {
    maze: mazeWithRerender,
    updateMaze,
    mazeDetails,
    updateMazeDetails,
  } = useContext(MazeContext);

  const maze = mazeWithRerender.maze;

  const createEmptyMaze = (rows: number, cols: number) => {
    const maze = [];
    const mazeDetails = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      const rowDetails = [];
      for (let j = 0; j < cols; j++) {
        rowDetails.push({ f: 0, g: 0, h: 0, x: i, y: j, previous: null });
        if (i === 0 || i === rows - 1 || j === 0 || j === cols - 1) {
          row.push('X');
          continue;
        }

        if (i === 1 && j === 1) {
          row.push('A');
          continue;
        }

        if (i === rows - 2 && j === cols - 2) {
          row.push('Z');
          continue;
        }

        if (Math.random() < 0.3) {
          row.push('X');
          continue;
        }

        row.push(' ');
      }
      maze.push(row);
      mazeDetails.push(rowDetails);
    }
    updateMaze({ maze: maze, triggerRerender: false });
    updateMazeDetails(mazeDetails);
  };

  const printMaze = () => {
    console.log(maze);
    console.log(mazeDetails);
  };

  const runAStar = async () => {
    const openSet: MazeDetails[] = [];
    const closedSet: MazeDetails[] = [];
    const start = [1, 1];
    const end = [maze.length - 2, maze[0].length - 2];

    openSet.push(mazeDetails[start[0]][start[1]]);

    await recursiveAStar(
      maze,
      mazeDetails,
      openSet,
      closedSet,
      start,
      end,
      updateMaze,
      updateMazeDetails,
      () => sleep(0.0005)
    );
  };

  return { createEmptyMaze, printMaze, maze, mazeDetails, runAStar };
};

export default useMaze;
