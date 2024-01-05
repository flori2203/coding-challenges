import React from "react";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";

const LoadingSpinner = () => {
  return (
    <Stack alignItems="center">
      <CircularProgress />
    </Stack>
  );
};

export default LoadingSpinner;
