import React from 'react';
import { Box, styled, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

const GradientBackgroundBox = styled(Box)`
  background: linear-gradient(135deg, #f5f5f5 25%, #e5e5e5 25%, #e5e5e5 50%, #f5f5f5 50%, #f5f5f5 75%, #e5e5e5 75%);
  background-size: 50px 50px;
`;

export const LoadingMessageBox = ({message}: {message: string}) => {
    return (
      <GradientBackgroundBox
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          overflow: 'hidden',
          marginTop: '64px',
        }}
      >
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
          }}
        >
          <CircularProgress
            style={{
              color: '#3f51b5',
              marginBottom: '1rem',
              animation: 'spin 1s linear infinite',
            }}
          />
          <Typography variant="h5" color="text.secondary">
            {message}
          </Typography>
        </Box>
      </GradientBackgroundBox>
    );
  };
