import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layouts from '@pong-game/layouts';
import Pong from '@pong-game/pages/Pong';
import Login from '@pong-game/pages/Login';
import Menu from '@pong-game/pages/Menu';

const RouterConfig = () => {
  return (
    <Routes>
      <Route path="/" element={<Layouts />}>
        <Route index element={<Login />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/pong" element={<Pong />} />
      </Route>
    </Routes>
  );
};

export default RouterConfig;
