import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { TextField, Button, Container, Typography } from "@material-ui/core";
import { Box } from "@mui/material";
import MessageList from "../MessageList/MessageList";
const socket = io(process.env.REACT_APP_BASE_URI);
const ChatWrapper = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);


  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem("messages") || "[]");
    setMessages(storedMessages);

    socket.on("message", (message) => {
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages, message];
        localStorage.setItem("messages", JSON.stringify(newMessages));
        return newMessages;
      });
    });

    socket.on("typing", (data) => setIsTyping(data));
 

    return () => {
      socket.off("message");
      socket.off("typing");
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [typingTimeout]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("users") || "{}");
    if (user.id) {
      setUserId(user.id);
      socket.emit("user_connected", user.id);
    }
  }, []);

  const sendMessage = () => {
    const user = JSON.parse(localStorage.getItem("users") || "{}");
    const newMessage = {
      id: user.id || null,
      text: message,
      username:user.username,
      timestamp: new Date(),
    };
    socket.emit("message", newMessage);
    setMessage("");
  };

  const handleTyping = () => {
    socket.emit("typing", true);
    if (typingTimeout) clearTimeout(typingTimeout);

    const newTimeout = setTimeout(() => {
      socket.emit("typing", false);
    }, 2000);

    setTypingTimeout(newTimeout);
  };

  return (
    <Container>
      <Box
        sx={{
          background: "#95d18d",
          zIndex: 99,
          left: 0,
          position: "fixed",
          width: "100%",
          borderRadius: "5px",
          padding: "10px 5px",
        }}
      >
        <Typography variant="h4">Chat App</Typography>
      </Box>
     
      <MessageList messages={messages} userId={userId} />
      <TextField
        label={isTyping ? "Typing..." : "Message"}
        fullWidth
        margin="normal"
        style={{ marginTop: "80px" }}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleTyping}
      />
      <Button variant="contained" color="primary" onClick={sendMessage}>
        Send
      </Button>
    </Container>
  );
};

export default ChatWrapper;
