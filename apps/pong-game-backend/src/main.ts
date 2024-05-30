import http from 'http';
import express from 'express';
import WebSocket from 'ws';
import { game, player } from './types';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let players: player[] = [];
let games: game[] = [];

wss.on('connection', function (ws) {
  console.log('new connection');

  ws.on('message', function (data) {
    console.log('New message: ' + data);

    ws.send('Thanks for connecting');
  });
});

wss.on('close', function (ws) {});

server.listen(port, function () {
  console.log('Server running');
});
