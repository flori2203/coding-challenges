import React from 'react';
import { ThemeContextProvider } from 'apps/pong-game/src/context/ThemeContext';
import RouterConfig from 'apps/pong-game/src/features/router/RouterConfig';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={"/"}>
        <ThemeContextProvider>
            <RouterConfig />
        </ThemeContextProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
