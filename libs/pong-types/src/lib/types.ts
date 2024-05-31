export type Player = {
  name: string;
  currentGameId: string | null;
  currentSide: PlayingSide | null;
  currentPoints: number;
  ws: WebSocket | null;
};

export type PlayingSide = 'left' | 'right';

export type Game = {
  id: string;
  players: Player[];
  isStarted: boolean;
  countDown: number | null;
  winner: Player | null;
  boardSize: { width: number; height: number };
  positions: {
    ball: { x: number; y: number };
    leftPaddleY: number;
    rightPaddleY: number;
  };
};

export type JoinMessage = {
  type: 'join';
  name: string;
  gameId: string;
};

export type UpdateGameMessage = {
  type: 'updateGame';
  game: Game;
};

export type ErrorMessage = {
  type: 'error';
  message: string;
};

export type SuccessMessage = {
  type: 'success';
  message: string;
};

export type RedirectMessage = {
  type: 'redirect';
  to: string;
};

export type SelectSideMessage = {
  type: 'selectSide';
  side: PlayingSide;
};

export type UpdateGameSizeMessage = {
  type: 'updateGameSize';
  gameId: string;
  width: number;
  height: number;
};

export type StartGameMessage = {
  type: 'startGame';
  gameId: string;
};

export type MovePaddleMessage = {
  type: 'movePaddle';
  gameId: string;
  move: 'up' | 'down';
};

export type Message =
  | JoinMessage
  | UpdateGameMessage
  | ErrorMessage
  | SuccessMessage
  | RedirectMessage
  | SelectSideMessage
  | UpdateGameSizeMessage
  | StartGameMessage
  | MovePaddleMessage;
