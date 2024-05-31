import {
  Game,
  JoinMessage,
  MovePaddleMessage,
  Player,
  SelectSideMessage,
  StartGameMessage,
  UpdateGameSizeMessage,
} from '@coding-challenges/pong-types';
import { runGame } from './game';

export const handleJoin = (
  message: JoinMessage,
  players: Player[],
  games: Game[],
  ws: WebSocket
) => {
  let player: Player;
  let game: Game;
  const playerIndex = players.findIndex((p) => p.name === message.name);
  const gameIndex = games.findIndex((g) => g.id === message.gameId);

  if (playerIndex !== -1) {
    player = players[playerIndex];
    player.ws = ws;
    player.currentGameId = message.gameId;
    player.currentSide = null;
    player.currentPoints = 0;

    players[playerIndex] = player;
  } else {
    player = {
      name: message.name,
      currentGameId: message.gameId,
      currentSide: null,
      currentPoints: 0,
      ws,
    };
    players.push(player);
  }

  if (gameIndex !== -1) {
    game = games[gameIndex];

    if (game.players.length >= 2) {
      const message = {
        type: 'error',
        message: 'Game is full',
      };
      console.log('Game is full');
      ws.send(JSON.stringify(message));
      return;
    }
  } else {
    game = {
      id: message.gameId,
      players: [],
      isStarted: false,
      countDown: null,
      winner: null,
      boardSize: { width: 30, height: 15 },
      positions: {
        ball: { x: 0, y: 0 },
        leftPaddleY: 0,
        rightPaddleY: 0,
      },
    };
  }

  game.players.push(player);

  if (gameIndex !== -1) {
    games[gameIndex] = game;
  } else {
    games.push(game);
  }

  console.log('Player ' + player.name + ' joined game ' + game.id);

  const redirectMessage = {
    type: 'redirect',
    to: `/menu`,
  };

  ws.send(JSON.stringify(redirectMessage));
  updateClientsByGame(game);
};

export const handleSideSelection = (
  message: SelectSideMessage,
  players: Player[],
  games: Game[],
  ws: WebSocket
) => {
  const playerIndex = players.findIndex((p) => p.ws === ws);
  const player = players[playerIndex];
  const game = games.find((g) => g.id === player.currentGameId);

  if (!game) {
    const message = {
      type: 'error',
      message: 'Game not found',
    };
    console.log('Game not found');
    ws.send(JSON.stringify(message));
    return;
  }

  if (message.side === 'left') {
    player.currentSide = 'left';
  } else {
    player.currentSide = 'right';
  }

  players[playerIndex] = player;

  updateClientsByGame(game);
};

export const handleGameSizeUpdate = (
  message: UpdateGameSizeMessage,
  games: Game[]
) => {
  const game = games.find((g) => g.id === message.gameId);

  if (!game) {
    console.log('Game not found');
    return;
  }

  game.boardSize = {
    width: message.width,
    height: message.height,
  };

  updateClientsByGame(game);
};

export const handleGameStart = async (
  message: StartGameMessage,
  games: Game[]
) => {
  const game = games.find((g) => g.id === message.gameId);

  if (!game) {
    console.log('Game not found');
    return;
  }
  redirectToGame(game);

  for (let i = 3; i > 0; i--) {
    game.countDown = i;
    updateClientsByGame(game);
    await new Promise((r) => setTimeout(r, 1000));
    if (i === 1) {
      game.isStarted = true;
      game.countDown = null;
      updateClientsByGame(game);
      runGame(game);
    }
  }
};

export const handleMovePaddle = (
  message: MovePaddleMessage,
  games: Game[],
  ws: WebSocket
) => {
  const game = games.find((g) => g.id === message.gameId);

  if (!game) {
    console.log('Game not found');
    return;
  }

  const player = game.players.find((p) => p.ws === ws);

  if (!player) {
    console.log('Player not found');
    return;
  }

  if (player.currentSide === 'left') {
    if (message.move === 'up') {
      game.positions.leftPaddleY = Math.min(
        game.positions.leftPaddleY + 0.5,
        game.boardSize.height / 2 - 1
      );
    }
    if (message.move === 'down') {
      game.positions.leftPaddleY = Math.max(
        game.positions.leftPaddleY - 0.5,
        -game.boardSize.height / 2 + 1
      );
    }
  } else {
    if (message.move === 'up') {
      game.positions.rightPaddleY = Math.min(
        game.positions.rightPaddleY + 0.5,
        game.boardSize.height / 2 - 1
      );
    }
    if (message.move === 'down') {
      game.positions.rightPaddleY = Math.max(
        game.positions.rightPaddleY - 0.5,
        -game.boardSize.height / 2 + 1
      );
    }
  }

  updateClientsByGame(game);
};

export const updateClientsByGame = (game: Game) => {
  const message = {
    type: 'updateGame',
    game,
  };

  game.players.map((player) => {
    if (player.ws) {
      player.ws.send(JSON.stringify(message));
    }
  });
};

const redirectToGame = (game: Game) => {
  game.players.map((player) => {
    if (player.ws) {
      const redirectMessage = {
        type: 'redirect',
        to: `/pong`,
      };

      player.ws.send(JSON.stringify(redirectMessage));
    }
  });
};
