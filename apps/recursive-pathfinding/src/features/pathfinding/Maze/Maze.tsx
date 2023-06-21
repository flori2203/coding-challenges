import useMaze from '../hooks/useMaze/useMaze';
import { Box, Button, TextField } from '@mui/material';
import { useState } from 'react';
import Maze3D from '../Maze3D/Maze3D';

const Maze = () => {
  const [x, setX] = useState(10);
  const [y, setY] = useState(10);

  const { createEmptyMaze, printMaze, maze, runAStar } = useMaze();

  const handleXChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setX(parseInt(event.target.value));
  };

  const handleYChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setY(parseInt(event.target.value));
  };

  return (
    <Box
      sx={{
        pt: 2,
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        width: '100%',
      }}
    >
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
        <TextField
          label="Felder-X"
          variant="outlined"
          onChange={handleXChange}
        />
        <TextField
          label="Felder-Y"
          variant="outlined"
          onChange={handleYChange}
        />
        <Button onClick={() => createEmptyMaze(x, y)} variant="contained">
          Create Maze
        </Button>
        <Button onClick={printMaze} variant="contained">
          Print Maze
        </Button>
        <Button onClick={runAStar} variant="contained">
          Run A*
        </Button>
      </Box>

      <Maze3D maze={maze} />
    </Box>
  );
};

export default Maze;
