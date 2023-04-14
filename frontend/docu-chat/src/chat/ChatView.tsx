import { Button, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Divider } from "semantic-ui-react";
import { CollectionModelSchema } from "../utils/types";
import ChatMessage from "./ChatMessage";


interface Message {
    sender_id: "user" | "server";
    message: string;
    timestamp: string;
}

const ChatView = ({authToken, selectedCollection}: {authToken: string, selectedCollection: CollectionModelSchema}) => {
    const [messages, setMessages] = useState<Message[]>([
        { sender_id: "user", message: "I hope you're happy today", timestamp: "12:23:56" },
        { sender_id: "server", message: "No, I am angry", timestamp: "12:23:58" },
        { sender_id: "user", message: "I am very sorry to hear that", timestamp: "12:24:56" },
        { sender_id: "user", message: "I hope you're happy today", timestamp: "12:23:56" },
        { sender_id: "server", message: "No, I am angry", timestamp: "12:23:58" },
        { sender_id: "user", message: "I am very sorry to hear that", timestamp: "12:24:56" },
        { sender_id: "user", message: "I hope you're happy today", timestamp: "12:23:56" },
        { sender_id: "server", message: "No, I am angry", timestamp: "12:23:58" },
        { sender_id: "user", message: "I am very sorry to hear that", timestamp: "12:24:56" },
    ]);

    const [inputMessage, setInputMessage] = useState("");
    const websocket = useRef<WebSocket | null>(null);
    const [userInput, setUserInput] = useState("");

    useEffect(() => {
        websocket.current = new WebSocket(`ws://localhost:8000/ws/collections/${selectedCollection.id}/query/?token=${authToken}`);

        websocket.current.onopen = (event) => {
            console.log('WebSocket connected:', event);
        };

        websocket.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('WebSocket message received:', data);

            if (data.response) {
                // Update the messages state with the new message from the server
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        sender_id: 'server',
                        message: data.response,
                        timestamp: new Date().toLocaleTimeString(),
                    },
                ]);
            }
        };

        websocket.current.onclose = (event) => {
            console.log('WebSocket closed:', event);
        };

        websocket.current.onerror = (event) => {
            console.error('WebSocket error:', event);
        };

        return () => {
            websocket.current?.close();
        };
    }, []);

    const handleSendMessage = () => {
        if (inputMessage.trim()) {
            // Update the messages state with the new user message
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    sender_id: 'user',
                    message: inputMessage,
                    timestamp: new Date().toLocaleTimeString(),
                },
            ]);

            // Send the message to the server through the WebSocket
            websocket.current?.send(JSON.stringify({ query: inputMessage }));

            // Clear the input message
            setInputMessage('');
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputMessage(event.target.value);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: 'hidden', marginTop: '64px' }}>
            <div
                style={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    overflowY: "auto",
                    padding: "16px",
                }}
            >
                {messages.map((message, index) => (
                    <ChatMessage
                        key={index}
                        sender_id={message.sender_id}
                        message={message.message}
                        timestamp={message.timestamp}
                    />
                ))}
            </div>
            <Divider />
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: 8,
                    marginBottom: 8
                }}
            >
                <TextField
                    multiline
                    rows={2}
                    variant="outlined"
                    style={{
                        flexGrow: 1,
                        marginRight: 8,
                        marginLeft: 8
                    }}
                    value={inputMessage}
                    onChange={handleInputChange}
                />
                <Button
                    variant="contained"
                    style={{
                        height: "100%",
                        borderRadius: 5,
                        color: "white",
                        marginRight: 10
                    }}
                >
                    Send
                </Button>
            </div>
            {/* <div style={{ padding: "8px" }}>
        <textarea
          value={userInput}
          onChange={handleInputChange}
          rows={3}
          style={{
            width: "100%",
            resize: "both",
            borderRadius: "8px",
            padding: "8px",
          }}
          placeholder="Type your message here..."
        /> */}
        </div >
    );
};

export default ChatView;
