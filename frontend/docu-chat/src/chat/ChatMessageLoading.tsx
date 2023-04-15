import React from "react";
import "./ChatMessageLoading.module.css";


export const ChatMessageLoading: React.FC = () => {

  const messageStyle = {
    padding: "8px 16px",
    borderRadius: "16px",
    margin: "4px",
    maxWidth: "70%",
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
    alignItems: "flex-end",
  }}
>
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
    }}
  >
    <div style={serverStyle}>
        <div className="chat-bubble loading-bubble">
            <span className="loading-dot"></span>
            <span className="loading-dot"></span>
            <span className="loading-dot"></span>
        </div>
    </div>
  
  </div>
  {/* <small>{timestamp}</small> */}
</div>
    
  );
};
