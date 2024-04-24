import Minesweeper from 'features/minesweeper/Minesweeper';
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
      <Minesweeper rows={10} cols={10} mines={30} />
    </Box>
  );
};

export default Pathfinding;
