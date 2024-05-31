import {
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useWsConnection } from '@pong-game/context/WsConnectionContext';

const Login = () => {
  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState('');
  const { ws } = useWsConnection();

  const onInputChange = (input: string, type: 'name' | 'id') => {
    if (type === 'name') setPlayerName(input);
    if (type === 'id') setGameId(input);
  };

  const handleStartClick = () => {
    const message = {
      type: 'join',
      name: playerName,
      gameId: gameId,
    };

    const messageString = JSON.stringify(message);

    ws.send(messageString);
  };

  return (
    <Stack
      sx={{
        height: (theme) => `calc(100vh - ${theme.appBarHeight})`,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card variant={'outlined'}>
        <CardContent
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <Typography variant={'h4'} color="text.secondary">
            Login
          </Typography>
          <Divider
            sx={{
              borderColor: (theme) => theme.palette.primary.dark,
              my: 2,
              width: '100%',
            }}
          />

          <Stack spacing={1}>
            <Stack direction={'row'} alignItems={'center'} spacing={2}>
              <Typography color="text.secondary">
                Gib deinen Namen ein:
              </Typography>
              <TextField
                id="standard-basic"
                variant="standard"
                onChange={(event) => onInputChange(event.target.value, 'name')}
              />
            </Stack>

            <Stack direction={'row'} alignItems={'center'} spacing={2}>
              <Typography color="text.secondary">Spiel-Nummer:</Typography>
              <TextField
                id="standard-basic"
                variant="standard"
                onChange={(event) => onInputChange(event.target.value, 'id')}
              />
            </Stack>
            <Button
              variant={'text'}
              color={'inherit'}
              onClick={handleStartClick}
            >
              Beitreten
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default Login;
