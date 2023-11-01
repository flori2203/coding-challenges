import { Box, Button, TextField } from '@mui/material';
import React from 'react';
import { calculateScore, Roll } from './BowlingCounter';

interface BowlingProps {
  initialRolls: string;
}

const Bowling: React.FC<BowlingProps> = ({ initialRolls }) => {
  const rollsFromInitialRolls = initialRolls
    .split(',')
    .map((roll) => parseInt(roll));

  const [score, setScore] = React.useState(0);
  const [rolls, setRolls] = React.useState<Roll[]>(rollsFromInitialRolls);

  const handleClick = () => {
    const totalScore = calculateScore(rolls);
    setScore(totalScore);
  };

  const rollChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rolls = event.target.value.split(',').map((roll) => parseInt(roll));
    console.log(rolls);
    setRolls(rolls);
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <h1>Score: {score}</h1>
      <h2>Rolls: {rolls.join(', ')}</h2>
      <TextField
        label="Rolls (separate with ',')"
        onChange={rollChangeHandler}
      />
      <Button onClick={handleClick}>Spiel</Button>
      <Button onClick={() => setScore(0)}>Reset</Button>
    </Box>
  );
};

export default Bowling;
