import React from 'react';
import { AppBar as MuiAppBar, Box, Typography } from '@mui/material';
import StyledIcon from 'apps/pong-game/src/components/UI/StyledIcon';
import SchulzLogo from 'apps/pong-game/src/assets/schulzLogos/Logo_SCHULZ.svg';

const AppBar = () => {
  return (
    <MuiAppBar
      position="fixed"
      elevation={0}
      sx={(theme) => ({
        height: theme.appBarHeight,
        background: '#212121',
      })}
    >
      <Box
        sx={{
          display: 'flex',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <StyledIcon
          src={SchulzLogo}
          alt="Schulz Systemtechnik Logo"
          iconProps={{
            sx: {
              height: '3.5rem',
              width: '6rem',
              marginTop: 1,
              marginLeft: 2,
              marginBottom: 1,
            },
          }}
        />

        <Box sx={{ display: 'flex' }}>
          <Typography
            variant="h5"
            component="h1"
            color={'text.primary'}
            fontWeight="700"
          >
            &#127955; Schulz-Pong &#127955;
          </Typography>
          <Typography
            variant="h5"
            component="h1"
            color={'text.disabled'}
            fontWeight="500"
            ml={1}
          ></Typography>
        </Box>

        <Typography color={'text.disabled'} mr={2}>
          Coding-Challenge
        </Typography>
      </Box>
    </MuiAppBar>
  );
};

export default AppBar;
