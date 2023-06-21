import { Maze, MazeDetails } from 'context/MazeContext/MazeContext';

const recursiveAStar = async (
  maze: string[][],
  mazeDetails: MazeDetails[][],
  openSet: MazeDetails[],
  closedSet: MazeDetails[],
  start: number[],
  end: number[],
  updateMaze: React.Dispatch<React.SetStateAction<Maze>>,
  updateMazeDetails: (mazeDetails: MazeDetails[][]) => void,
  sleep: () => void
) => {
  const endDetails = mazeDetails[end[0]][end[1]];
  const rows = maze.length;
  const cols = maze[0].length;
  const newMazeDetails = mazeDetails;
  const newMaze = maze;

  if (openSet.length > 0) {
    let lowestIndex = 0;
    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[lowestIndex].f) {
        lowestIndex = i;
      }
    }
    const current = openSet[lowestIndex];
    if (current === endDetails) {
      const path: MazeDetails[] = [];
      let temp = current;
      path.push(temp);
      while (temp.previous) {
        path.push(temp.previous);
        temp = temp.previous;
      }

      for (let i = 0; i < path.length; i++) {
        if (
          maze[path[i].x][path[i].y] !== 'A' &&
          maze[path[i].x][path[i].y] !== 'Z'
        ) {
          newMaze[path[i].x][path[i].y] = 'P';
        }
      }

      updateMaze((prev) => {
        return { maze: newMaze, triggerRerender: !prev.triggerRerender };
      });

      console.log('Done');
      return newMaze;
    }

    openSet.splice(lowestIndex, 1);
    closedSet.push(current);

    let neighborCords: number[][] = [
      [current.x + 1, current.y],
      [current.x - 1, current.y],
      [current.x, current.y + 1],
      [current.x, current.y - 1],
    ];

    // Remove neighbors that are walls or are in the closed set
    neighborCords = neighborCords.filter((cords) => {
      const [x, y] = cords;
      if (x < 0 || x >= rows || y < 0 || y >= cols) {
        return false;
      }
      const neighborType = maze[x][y];
      return neighborType !== 'X' && !closedSet.includes(mazeDetails[x][y]);
    });
    const neighbors = neighborCords.map((cords) => {
      const [x, y] = cords;
      return mazeDetails[x][y];
    });

    for (let i = 0; i < neighbors.length; i++) {
      const neighbor = neighbors[i];

      if (
        maze[neighbor.x][neighbor.y] !== 'A' &&
        maze[neighbor.x][neighbor.y] !== 'Z'
      ) {
        newMaze[neighbor.x][neighbor.y] = 'B';
        updateMaze((prev) => {
          return { maze: newMaze, triggerRerender: !prev.triggerRerender };
        });
        await sleep();
      }

      if (!closedSet.includes(neighbor)) {
        const tempG = current.g + 1;

        if (openSet.includes(neighbor)) {
          if (tempG < neighbor.g) {
            neighbor.g = tempG;
          }
        } else {
          neighbor.g = tempG;
          openSet.push(neighbor);
        }

        neighbor.h =
          Math.abs(neighbor.x - endDetails.x) +
          Math.abs(neighbor.y - endDetails.y);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.previous = current;

        // Replace the maze details with the updated neighbor
        newMazeDetails[neighbor.x][neighbor.y] = neighbor;
      }
    }

    recursiveAStar(
      newMaze,
      newMazeDetails,
      openSet,
      closedSet,
      start,
      end,
      updateMaze,
      updateMazeDetails,
      sleep
    );
  } else {
    console.log('No solution');
    // Change all the B's to R's
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (newMaze[i][j] === 'B') {
          newMaze[i][j] = 'R';
        }
      }
    }
    updateMaze((prev) => {
      return { maze: newMaze, triggerRerender: !prev.triggerRerender };
    });
    return newMaze;
  }

  return newMaze;
};

export default recursiveAStar;
