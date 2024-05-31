import { useWsConnection } from '@pong-game/context/WsConnectionContext';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  Paper,
  Slider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

const Menu = () => {
  const { ws, game } = useWsConnection();
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (game) {
      setWidth(game.boardSize.width);
      setHeight(game.boardSize.height);
    }
  }, [game]);

  const handleSlide = (type: 'height' | 'width', value: number | number[]) => {
    if (type === 'height') setHeight(value as number);
    if (type === 'width') setWidth(value as number);
  };

  if (!game) {
    return (
      <Stack
        sx={{
          height: (theme) => `calc(100vh - ${theme.appBarHeight})`,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant={'h4'}>Loading...</Typography>
      </Stack>
    );
  }

  const leftPlayers = game.players.filter(
    (player) => player.currentSide === 'left'
  );
  const rightPlayers = game.players.filter(
    (player) => player.currentSide === 'right'
  );
  const playersWithoutSide = game.players.filter(
    (player) => !player.currentSide
  );
  const isGameReady = leftPlayers.length === 1 && rightPlayers.length === 1;

  const handleSideSelectionClick = (side: 'left' | 'right') => {
    const message = {
      type: 'selectSide',
      side,
    };

    ws.send(JSON.stringify(message));
  };

  const handleStartClick = () => {
    const message = {
      type: 'startGame',
      gameId: game.id,
    };

    ws.send(JSON.stringify(message));
  };

  const handleSizeChange = (
    value: number | number[],
    type: 'width' | 'height'
  ) => {
    const message = {
      type: 'updateGameSize',
      gameId: game.id,
      width: type === 'width' ? value : game.boardSize.width,
      height: type === 'height' ? value : game.boardSize.height,
    };

    ws.send(JSON.stringify(message));
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
        <CardHeader title="Menü" subheader={`Game-ID: ${game.id}`} />
        <Divider
          sx={{
            borderColor: (theme) => theme.palette.primary.dark,
            my: 2,
            width: '100%',
          }}
        />
        <CardContent
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <Stack spacing={1}>
            <Card
              variant={'outlined'}
              sx={{ background: (theme) => theme.palette.background.default }}
            >
              <CardHeader title="Einstellungen" />
              <CardContent
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}
              >
                <Stack spacing={1} sx={{ width: 700 }}>
                  <Grid container>
                    <Grid item xs={3}>
                      <Typography noWrap={true}>Spielfeld-Breite:</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Slider
                        defaultValue={0}
                        value={width}
                        step={5}
                        valueLabelDisplay="auto"
                        marks
                        min={10}
                        max={80}
                        onChange={(e, value) => {
                          handleSlide('width', value);
                        }}
                        onChangeCommitted={(e, value) =>
                          handleSizeChange(value, 'width')
                        }
                      />
                    </Grid>

                    <Grid item xs={3}>
                      <Typography noWrap={true}>Spielfeld-Höhe:</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Slider
                        defaultValue={0}
                        value={height}
                        step={5}
                        valueLabelDisplay="auto"
                        marks
                        min={10}
                        max={80}
                        onChange={(e, value) => handleSlide('height', value)}
                        onChangeCommitted={(e, value) =>
                          handleSizeChange(value, 'height')
                        }
                      />
                    </Grid>

                    <Grid item xs={12} sx={{ my: 2 }}>
                      <Divider
                        sx={{
                          borderColor: (theme) => theme.palette.primary.main,
                        }}
                      />
                    </Grid>

                    <Grid
                      item
                      xs={5}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      <Button
                        variant={'contained'}
                        onClick={() => handleSideSelectionClick('left')}
                      >
                        <Typography variant={'h6'}>&#9194; Links</Typography>
                      </Button>
                      {leftPlayers.map((player) => (
                        <Chip
                          key={player.name}
                          variant={'outlined'}
                          label={player.name}
                        />
                      ))}
                    </Grid>

                    <Grid
                      item
                      xs={2}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                        minHeight: 200,
                      }}
                    >
                      <Divider
                        orientation="vertical"
                        sx={{
                          borderColor: (theme) => theme.palette.primary.main,
                        }}
                      >
                        <Stack spacing={1}>
                          {playersWithoutSide.map((player) => (
                            <Chip
                              key={player.name}
                              variant={'outlined'}
                              label={player.name}
                            />
                          ))}
                        </Stack>
                      </Divider>
                    </Grid>
                    <Grid
                      item
                      xs={5}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      <Button
                        variant={'contained'}
                        onClick={() => handleSideSelectionClick('right')}
                      >
                        <Typography variant={'h6'}>Rechts &#9193;</Typography>
                      </Button>
                      {rightPlayers.map((player) => (
                        <Chip
                          key={player.name}
                          variant={'outlined'}
                          label={player.name}
                        />
                      ))}
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Button
                        variant={'outlined'}
                        sx={{ width: '100%' }}
                        disabled={!isGameReady}
                        onClick={handleStartClick}
                      >
                        <Typography variant={'h4'}>Start</Typography>
                      </Button>
                    </Grid>
                  </Grid>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default Menu;
