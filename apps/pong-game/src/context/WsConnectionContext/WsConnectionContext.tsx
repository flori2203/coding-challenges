import React, { useState, useMemo, useEffect } from 'react';
import { Game, Message, Player } from '@coding-challenges/pong-types';
import { useNavigate } from 'react-router-dom';

interface WsConnectionContextData {
  ws: WebSocket | null;
  game: Game | null;
}

const WsConnectionContext = React.createContext<WsConnectionContextData>({
  ws: null,
  game: null,
});

interface WsConnectionContextProviderProps {
  children: React.ReactNode;
  url: string;
}

export const WsConnectionContextProvider: React.FC<
  WsConnectionContextProviderProps
> = ({ children, url }) => {
  const [game, setGame] = React.useState<Game | null>(null);

  const ws = useMemo(() => new WebSocket(url), [url]);
  const navigate = useNavigate();

  ws.onmessage = (event) => {
    const message: Message = JSON.parse(event.data);

    if (message.type === 'redirect') {
      navigate(message.to);
    }

    if (message.type === 'error') {
      console.error(message.message);
    }

    if (message.type === 'updateGame') {
      setGame(message.game);
    }
  };

  const contextValue = {
    ws,
    game,
  };

  return (
    <WsConnectionContext.Provider value={contextValue}>
      {children}
    </WsConnectionContext.Provider>
  );
};

export const useWsConnection = () => {
  const context = React.useContext(WsConnectionContext);
  if (context === undefined) {
    throw new Error(
      'useWsConnection must be used within a WsConnectionContextProvider'
    );
  }
  const ws = context.ws;
  if (ws === null) {
    throw new Error('WebSocket connection is not initialized');
  }

  return {
    ws,
    game: context.game,
  };
};

export default WsConnectionContext;
