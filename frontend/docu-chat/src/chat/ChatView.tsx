import { Button, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Divider } from "semantic-ui-react";
import { CollectionModelSchema } from "../utils/types";
import { ErrorMessageBox } from "../widgets/errors/ErrorMessageBox";
import ChatMessage from "./ChatMessage";
import { ChatMessageLoading } from "./ChatMessageLoading";


interface Message {
    sender_id: "user" | "server";
    message: string;
    timestamp: string;
}

const ChatView = ({ authToken, selectedCollection }: { authToken: string, selectedCollection: CollectionModelSchema }) => {
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

    const [error, setError] = useState(false);
    const [inputMessage, setInputMessage] = useState("");
    const [awaitingMessage, setAwaitingMessage] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const websocket = useRef<WebSocket | null>(null);
    const [userInput, setUserInput] = useState("");

    const setupWebsocket = () => {
        setConnecting(true);
        websocket.current = new WebSocket(`ws://localhost:8000/ws/collections/${selectedCollection.id}/query/?token=${authToken}`);

        websocket.current.onopen = (event) => {
            setError(false);
            setConnecting(false);
            console.log('WebSocket connected:', event);
        };

        websocket.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('WebSocket message received:', data);

            if (awaitingMessage) {
                setAwaitingMessage(false);
            }

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
            if (event.code === 4000) {
                toast.warning("Selected collection's model is unavailable. Was it created properly?")
                setError(true);
                setConnecting(false);
            }
            console.log('WebSocket closed:', event);
        };

        websocket.current.onerror = (event) => {
            setError(true);
            setConnecting(false);
            console.error('WebSocket error:', event);
        };

        return () => {
            websocket.current?.close();
        };
    }

    useEffect(() => {
        setupWebsocket();
    }, []);

    useEffect(() => {
        setupWebsocket();
    }, [selectedCollection])

    const handleSendMessage = () => {
        if (inputMessage.trim()) {
            // Update the messages state with the new user message
            setAwaitingMessage(true);
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
            {
                error ?
                    <ErrorMessageBox message="Collection Cannot be Loaded" /> :
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
                            {messages.map((message, index) => (
                                <ChatMessage
                                    key={index}
                                    sender_id={message.sender_id}
                                    message={message.message}
                                    timestamp={message.timestamp}
                                />
                            ))}
                            {
                                awaitingMessage ? <ChatMessageLoading /> : <></>
                            }
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
                                onClick={() => handleSendMessage()}
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
                    </>
            }
        </div >
    );
};

export default ChatView;
