import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layouts from 'layouts';
import Minesweeper from 'pages/Minesweeper';

const RouterConfig = () => {
  return (
    <Routes>
      <Route path="/" element={<Layouts />}>
        <Route index element={<Minesweeper />} />
      </Route>
    </Routes>
  );
};

export default RouterConfig;
