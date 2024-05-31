import http from 'http';
import express from 'express';
import WebSocket from 'ws';
import { Game, Message, Player } from '@coding-challenges/pong-types';
import {
  handleGameSizeUpdate,
  handleGameStart,
  handleJoin,
  handleMovePaddle,
  handleSideSelection,
} from './handlers';

const host = process.env.HOST ?? '10.221.0.52';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let players: Player[] = [];
let games: Game[] = [];

wss.on('connection', function (ws) {
  console.log('Connected to client');

  ws.on('message', function (data) {
    const message: Message = JSON.parse(data.toString());

    if (message.type === 'join') {
      handleJoin(message, players, games, ws);
    }

    if (message.type === 'selectSide') {
      handleSideSelection(message, players, games, ws);
    }

    if (message.type === 'updateGameSize') {
      handleGameSizeUpdate(message, games);
    }

    if (message.type === 'startGame') {
      handleGameStart(message, games);
    }

    if (message.type === 'movePaddle') {
      handleMovePaddle(message, games, ws);
    }
  });
});

wss.on('close', function (ws) {});

server.listen(port, function () {
  console.log('Server running');
});
