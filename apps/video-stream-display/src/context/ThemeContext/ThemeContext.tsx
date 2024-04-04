import { createTheme, ThemeProvider } from '@mui/material';
import { createThemePalette } from 'context/ThemeContext/theme-palette';
import React, { useState, useMemo } from 'react';

declare module '@mui/material/styles' {
  interface Theme {
    appBarHeight: string;
  }

  export interface Palette {}

  interface PaletteOptions {}

  interface ThemeOptions {
    appBarHeight: string;
  }
}

interface ThemeContextData {
  currentTheme: string;
  toggleDarkMode: () => void;
}

const ThemeContext = React.createContext<ThemeContextData>({
  currentTheme: 'light',
  toggleDarkMode: () => {},
});

export const ThemeContextProvider: React.FC<{ children: React.ReactNode }> = (
  props
) => {
  const [mode, setMode] = useState<string>('light');

  const { palette } = useMemo(() => {
    const palette = createThemePalette(mode);
    return { palette };
  }, [mode]);

  const theme = createTheme({
    appBarHeight: '4rem',
    typography: {
      fontFamily: [
        'roboto',
        'open sans',
        'Helvetica Neue',
        'Arial',
        'sans-serif',
      ].join(','),
    },
    palette: palette,
  });

  const toggleDarkModeHandler = () => {
    setMode((prev) => {
      const newMode = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('palette-mode', newMode);
      return newMode;
    });
  };

  const contextValue = {
    toggleDarkMode: toggleDarkModeHandler,
    currentTheme: mode,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
