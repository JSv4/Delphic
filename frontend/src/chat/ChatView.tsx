import { Button, Divider, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import { CollectionModelSchema } from "../types";
import { ErrorMessageBox } from "../widgets/ErrorMessageBox";
import { LoadingMessageBox } from "../widgets/LoadingMessageBox";
import { ChatCaption } from "./ChatCaption";
import ChatMessage from "./ChatMessage";
import { ChatMessageLoading } from "./ChatMessageLoading";

interface Message {
  sender_id: "user" | "server";
  message: string;
  timestamp: string;
}

const ChatView = ({
  authToken,
  selectedCollection,
}: {
  authToken: string;
  selectedCollection: CollectionModelSchema;
}) => {
  const websocket = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [awaitingMessage, setAwaitingMessage] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [userInput, setUserInput] = useState("");

  const setupWebsocket = () => {
    setConnecting(true);
    websocket.current = new WebSocket(
      `ws://localhost:8000/ws/collections/${selectedCollection.id}/query/?token=${authToken}`
    );

    websocket.current.onopen = (event) => {
      setError(false);
      setConnecting(false);
      setAwaitingMessage(false);

      console.log("WebSocket connected:", event);
    };

    websocket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("WebSocket message received:", data);
      setAwaitingMessage(false);

      if (data.response) {
        // Update the messages state with the new message from the server
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender_id: "server",
            message: data.response,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      }
    };

    websocket.current.onclose = (event) => {
      if (event.code === 4000) {
        toast.warning(
          "Selected collection's model is unavailable. Was it created properly?"
        );
        setError(true);
        setConnecting(false);
        setAwaitingMessage(false);
      }
      console.log("WebSocket closed:", event);
    };

    websocket.current.onerror = (event) => {
      setError(true);
      setConnecting(false);
      setAwaitingMessage(false);

      console.error("WebSocket error:", event);
    };

    return () => {
      websocket.current?.close();
    };
  };

  useEffect(() => {
    setupWebsocket();
    setMessages([]);
  }, []);

  useEffect(() => {
    setupWebsocket();
    setMessages([]);
  }, [selectedCollection]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      // Update the messages state with the new user message
      setAwaitingMessage(true);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender_id: "user",
          message: inputMessage,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);

      // Send the message to the server through the WebSocket
      websocket.current?.send(JSON.stringify({ query: inputMessage }));

      // Clear the input message
      setInputMessage("");
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(event.target.value);
  };

  let content = <></>;
  if (connecting) {
    content = <LoadingMessageBox message="Connecting..." />;
  } else if (error) {
    content = <ErrorMessageBox message="Collection Cannot be Loaded" />;
  } else {
    content = (
      <>
        <div
          style={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            padding: "16px",
          }}
        >
          {messages.length === 0 ? (
            <ChatCaption caption="Welcome! Start a conversation by sending a message." />
          ) : (
            <></>
          )}
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              sender_id={message.sender_id}
              message={message.message}
              timestamp={message.timestamp}
            />
          ))}
          {awaitingMessage ? <ChatMessageLoading /> : <></>}
        </div>
        <Divider />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 8,
            marginBottom: 8,
          }}
        >
          <TextField
            multiline
            rows={2}
            variant="outlined"
            style={{
              flexGrow: 1,
              marginRight: 8,
              marginLeft: 8,
            }}
            value={inputMessage}
            onChange={handleInputChange}
          />
          <Button
            onClick={() => handleSendMessage()}
            variant="contained"
            style={{
              height: "100%",
              borderRadius: 5,
              color: "white",
              marginRight: 10,
            }}
          >
            Send
          </Button>
        </div>
      </>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        overflow: "hidden",
        marginTop: "64px",
      }}
    >
      {content}
    </div>
  );
};

export default ChatView;
