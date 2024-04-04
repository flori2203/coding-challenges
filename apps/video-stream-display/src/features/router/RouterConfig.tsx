import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layouts from 'layouts';
import StreamGrid from 'pages/StreamGrid';

const RouterConfig = () => {
  return (
    <Routes>
      <Route path="/" element={<Layouts />}>
        <Route index element={<StreamGrid />} />
      </Route>
    </Routes>
  );
};

export default RouterConfig;
