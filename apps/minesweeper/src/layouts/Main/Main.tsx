import React from "react";
import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";

const Main = () => {
  return (
    <Box
      component={"main"}
      sx={{
        mt: (theme) => theme.appBarHeight,
      }}
    >
      <Container maxWidth="xl">
        <Outlet />
      </Container>
    </Box>
  );
};

export default Main;
