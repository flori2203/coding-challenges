import React from 'react';
import { CssBaseline, Box } from '@mui/material';
import Main from './Main';
import AppBar from 'features/appBar';

const Layout = () => {
  return (
    <CssBaseline enableColorScheme>
      <Box overflow={'clip'}>
        <AppBar />
        <Main />
      </Box>
    </CssBaseline>
  );
};

export default Layout;
