import React from "react";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import ReactMarkdown from "react-markdown";
import Tooltip from "@mui/material/Tooltip";

interface ChatMessageProps {
  sender_id: "user" | "server";
  message: string;
  timestamp: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  sender_id,
  message,
  timestamp,
}) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      console.log("Message copied to clipboard");
    } catch (err) {
      console.error("Failed to copy message: ", err);
    }
  };

  const messageStyle = {
    padding: "8px 16px",
    borderRadius: "16px",
    margin: "4px",
    maxWidth: "70%",
    minWidth: "25%",
  };

  const userStyle = {
    ...messageStyle,
    background: "#cce6ff",
    alignSelf: "flex-start",
  };

  const serverStyle = {
    ...messageStyle,
    background: "#f2ccff",
    alignSelf: "flex-end",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: sender_id === "user" ? "flex-start" : "flex-end",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: sender_id === "user" ? "flex-start" : "flex-end",
        }}
      >
        <div style={sender_id === "user" ? userStyle : serverStyle}>
          <ReactMarkdown>{message}</ReactMarkdown>
        </div>
        <Tooltip title="Copy" arrow>
          <FileCopyIcon
            onClick={handleCopy}
            style={{
              fontSize: 16,
              marginLeft: 4,
              cursor: "pointer",
              color: "#777",
            }}
          />
        </Tooltip>
      </div>
      <small>{timestamp}</small>
    </div>
  );
};

export default ChatMessage;
