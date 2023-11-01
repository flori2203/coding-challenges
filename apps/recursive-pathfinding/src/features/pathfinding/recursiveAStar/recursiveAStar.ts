import { Maze, MazeDetails } from 'context/MazeContext/MazeContext';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const recursiveAStar = async (
  maze: string[][],
  mazeDetails: MazeDetails[][],
  openSet: MazeDetails[],
  closedSet: MazeDetails[],
  end: number[],
  updateMaze: React.Dispatch<React.SetStateAction<Maze>>,
  updateMazeDetails: (mazeDetails: MazeDetails[][]) => void
) => {
  const endDetails = mazeDetails[end[0]][end[1]];
  const rows = maze.length;
  const cols = maze[0].length;
  const newMazeDetails = mazeDetails;
  const newMaze = maze;

  // Check if there are still nodes to check
  if (openSet.length > 0) {
    // Find the node with the lowest f value
    let lowestIndex = 0;
    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[lowestIndex].f) {
        lowestIndex = i;
      }
    }

    const current = openSet[lowestIndex];

    // Check if the current node is the end node
    if (current === endDetails) {
      // If it is, build the path
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
      return;
    }

    // Remove the current node from the open set and add it to the closed set
    openSet.splice(lowestIndex, 1);
    closedSet.push(current);

    // Get the neighbors of the current node
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

    // Loop through the neighbors and set them as "B"
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
        await sleep(0.0005);
      }

      // If the neighbor is in the closed set, skip it (because it's already been checked)
      if (!closedSet.includes(neighbor)) {
        const tempG = current.g + 1;

        // If the neighbor is in the open set, check if the new g value is lower than the old one
        if (openSet.includes(neighbor)) {
          if (tempG < neighbor.g) {
            neighbor.g = tempG;
          }
        } else {
          neighbor.g = tempG;
          openSet.push(neighbor);
        }

        // Calculate the h and f values
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
      end,
      updateMaze,
      updateMazeDetails
    );
  } else {
    // If there are no more nodes to check, there is no solution
    console.log('No solution');
    // In this case, change all the B's to R's
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
    return;
  }

  return;
};

export default recursiveAStar;
