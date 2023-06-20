import React from 'react';
import { ThemeContextProvider } from 'context/ThemeContext';
import RouterConfig from 'features/router/RouterConfig';
import { BrowserRouter } from 'react-router-dom';

export function App() {
  return (
    <BrowserRouter>
      <ThemeContextProvider>
        <RouterConfig />
      </ThemeContextProvider>
    </BrowserRouter>
  );
}

export default App;
