import { Box, Typography } from "@mui/material";

export const ChatCaption = ({ caption }: { caption: string }) => {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "0.5rem",
          borderRadius: "1rem",
          backgroundColor: "#f0f0f0",
          marginBottom: "0.5rem",
          maxWidth: "70%",
        }}
      >
        <Typography variant="body1">{caption}</Typography>
      </Box>
    );
  };
