import React, { useState } from 'react';

export type MazeDetails = {
  x: number;
  y: number;
  f: number;
  g: number;
  h: number;
  previous: MazeDetails | null;
};

export type Maze = {
  maze: string[][];
  triggerRerender: boolean;
};

interface MazeContextProps {
  maze: Maze;
  updateMaze: React.Dispatch<React.SetStateAction<Maze>>;
  mazeDetails: MazeDetails[][];
  updateMazeDetails: (mazeDetails: MazeDetails[][]) => void;
}

const ThemeContext = React.createContext<MazeContextProps>({
  maze: { maze: [[]], triggerRerender: false },
  updateMaze: () => {},
  mazeDetails: [],
  updateMazeDetails: () => {},
});

export const MazeContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [maze, setMaze] = useState<Maze>({
    maze: [[]],
    triggerRerender: false,
  });
  const [mazeDetails, setMazeDetails] = useState<MazeDetails[][]>([[]]);

  const contextValue = {
    maze: maze,
    updateMaze: setMaze,
    mazeDetails: mazeDetails,
    updateMazeDetails: setMazeDetails,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
