import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layouts from 'layouts';

const RouterConfig = () => {
  return (
    <Routes>
      <Route path="/" element={<Layouts />}>
        <Route index element={<div></div>} />
      </Route>
    </Routes>
  );
};

export default RouterConfig;
