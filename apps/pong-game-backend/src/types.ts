export type player = {
  name: string;
  wins: number;
  played: number;
};

export type playingSide = 'left' | 'right';

export type game = {
  id: string;
  player1: player;
  player1Side: playingSide;
  player2: player;
  player2Side: playingSide;
  isStarted: boolean;
  boardSize: { width: number; height: number };
  positions: {
    ball: { x: number; y: number };
    leftPaddleY: number;
    rightPaddleY: number;
  };
};
