import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layouts from 'layouts';
import XmlDisplay from 'pages/XmlDisplay';

const RouterConfig = () => {
  return (
    <Routes>
      <Route path="/" element={<Layouts />}>
        <Route index element={<XmlDisplay />} />
      </Route>
    </Routes>
  );
};

export default RouterConfig;
