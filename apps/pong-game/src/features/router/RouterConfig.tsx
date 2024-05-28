import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layouts from '@pong-game/layouts';
import Pong from "@pong-game/pages/Pong";

const RouterConfig = () => {
  return (
    <Routes>
      <Route path="/" element={<Layouts />}>
        <Route index element={<Pong />} />
      </Route>
    </Routes>
  );
};

export default RouterConfig;
