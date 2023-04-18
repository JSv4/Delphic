import React from "react";
import { Box, styled, Typography } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";

const GradientBackgroundBox = styled(Box)`
  background: linear-gradient(
    135deg,
    #f5f5f5 25%,
    #e5e5e5 25%,
    #e5e5e5 50%,
    #f5f5f5 50%,
    #f5f5f5 75%,
    #e5e5e5 75%
  );
  background-size: 50px 50px;
`;

export const ErrorMessageBox = ({ message }: { message: string }) => {
  return (
    <GradientBackgroundBox
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        overflow: "hidden",
      }}
    >
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <ErrorIcon
          style={{
            fontSize: 80,
            color: "#f44336",
            marginBottom: "1rem",
          }}
        />
        <Typography variant="h5" color="text.secondary">
          {message}
        </Typography>
      </Box>
    </GradientBackgroundBox>
  );
};
