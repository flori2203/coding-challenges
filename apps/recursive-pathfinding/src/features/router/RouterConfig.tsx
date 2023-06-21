import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layouts from 'layouts';
import Pathfinding from 'pages/Pathfinding/Pathfinding';

const RouterConfig = () => {
  return (
    <Routes>
      <Route path="/" element={<Layouts />}>
        <Route index element={<Pathfinding />} />
      </Route>
    </Routes>
  );
};

export default RouterConfig;
