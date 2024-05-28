import React from "react";
import { BoxProps, SxProps } from "@mui/system";
import { Box } from "@mui/material";

interface PageProps {
  boxProps?: BoxProps;
  sx?: SxProps;
  children?: React.ReactNode;
}

const Page: React.FC<PageProps> = (props) => {
  return (
    <Box
      sx={{
        ...props.sx,
        minHeight: (theme) => `calc(100vh - ${theme.appBarHeight})`,
      }}
      {...props.boxProps}
    >
      {props.children}
    </Box>
  );
};

export default Page;
