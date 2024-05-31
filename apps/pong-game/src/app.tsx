import React from 'react';
import { ThemeContextProvider } from 'apps/pong-game/src/context/ThemeContext';
import RouterConfig from 'apps/pong-game/src/features/router/RouterConfig';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WsConnectionContextProvider } from '@pong-game/context/WsConnectionContext';

export function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={'/'}>
        <ThemeContextProvider>
          <WsConnectionContextProvider url={'ws://10.221.0.52:3000'}>
            <RouterConfig />
          </WsConnectionContextProvider>
        </ThemeContextProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
