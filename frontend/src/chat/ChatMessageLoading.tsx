import { keyframes } from "@emotion/react";
import { styled } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import "./ChatMessageLoading.module.css";


const fadeInOut = keyframes`
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;


const Dot = styled("span")<{ delay: number }>`
  animation: ${fadeInOut} 1.5s linear infinite;
  animation-delay: ${(props) => props.delay}s;
  font-size: 1.2rem;
  margin-left: 2px;
  margin-right: 2px;
`;

export const ChatMessageLoading: React.FC = () => {

  const messageStyle = {
    padding: "8px 16px",
    borderRadius: "16px",
    margin: "4px",
    maxWidth: "70%",
  };

  return (
    <Box
      sx={{
        alignSelf: "flex-end",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "0.5rem",
        borderRadius: "1rem",
        backgroundColor: "#f0f0f0",
        height: "48px",
        marginBottom: "0.5rem",
        maxWidth: "70%",
      }}
    >
      <Dot delay={0}>.</Dot>
      <Dot delay={0.2}>.</Dot>
      <Dot delay={0.4}>.</Dot>
    </Box>

  );
};
