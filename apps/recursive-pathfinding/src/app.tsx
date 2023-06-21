import React from 'react';
import { ThemeContextProvider } from 'context/ThemeContext';
import RouterConfig from 'features/router/RouterConfig';
import { BrowserRouter } from 'react-router-dom';
import { MazeContextProvider } from 'context/MazeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeContextProvider>
          <MazeContextProvider>
            <RouterConfig />
          </MazeContextProvider>
        </ThemeContextProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
