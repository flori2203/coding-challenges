import { Game } from '@coding-challenges/pong-types';
import { updateClientsByGame } from './handlers';

export const runGame = (game: Game) => {
  const { boardSize, positions } = game;
  const { width, height } = boardSize;
  const { ball, leftPaddleY, rightPaddleY } = positions;

  let velocityX = Math.random() < 0.5 ? -0.2 : 0.2;
  let velocityY = Math.random() < 0.5 ? -0.2 : 0.2;

  const paddleWidth = 1;
  const paddleHeight = 5;

  const ballRadius = 0.5;

  const gameLoop = () => {
    ball.x += velocityX;
    ball.y += velocityY;

    // Check for collision with top or bottom border
    if (
      ball.y - ballRadius <= -height / 2 - 1.5 ||
      ball.y + ballRadius >= height / 2 + 1.5
    ) {
      velocityY = -velocityY;
    }

    // Check for collision with left paddle
    if (
      ball.x - ballRadius <= -width / 2 + paddleWidth + 1.5 &&
      ball.y >= leftPaddleY - paddleHeight / 2 &&
      ball.y <= leftPaddleY + paddleHeight / 2
    ) {
      if (velocityX < 0) {
        velocityX = -velocityX;
      }
    }

    // Check for collision with right paddle
    if (
      ball.x + ballRadius >= width / 2 - paddleWidth - 1.5 &&
      ball.y >= rightPaddleY - paddleHeight / 2 &&
      ball.y <= rightPaddleY + paddleHeight / 2
    ) {
      if (velocityX > 0) {
        velocityX = -velocityX;
      }
    }

      // Check if ball goes out of bounds (left or right)
      if (ball.x - ballRadius <= -width / 2 - 1.5) {
        // Right player wins
        game.winner = game.players[1];
        game.isStarted = false;
        updateClientsByGame(game);
        return;
    } else if (ball.x + ballRadius >= width / 2 + 1.5) {
      // Left player wins
      game.winner = game.players[0];
      game.isStarted = false;
      updateClientsByGame(game);
      return;
    }

    updateClientsByGame(game);

    // Recursive call for the next frame after a delay of 1000/30 milliseconds (30 FPS)
    setTimeout(gameLoop, 1000 / 30);
  };

  gameLoop();
};
