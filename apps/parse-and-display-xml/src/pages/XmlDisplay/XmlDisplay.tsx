import Maze from 'features/pathfinding/Maze/Maze';
import { Box } from '@mui/material';

const Pathfinding = () => {
  return (
    <Box
      sx={{
        width: '100%',
        height: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Maze />
    </Box>
  );
};

export default Pathfinding;
