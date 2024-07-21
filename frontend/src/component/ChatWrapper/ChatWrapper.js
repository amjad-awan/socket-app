import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { TextField, Button, Container, Typography } from "@material-ui/core";
import { Box } from "@mui/material";
import MessageList from "../MessageList/MessageList";
import UserList from "../UserList/UserList";
import { useChat } from "../../context/chatContext";
import { useAuth } from "../../context/authContext";

import styles from './style.module.css'
const socket = io("http://localhost:3000");
const ChatWrapper = () => {
  const { messages, reciever, setMessages } = useChat();
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const { user } = useAuth();
  const [unreadCounts, setUnreadCounts] = useState({});
  console.log("unreadCounts", unreadCounts)
  console.log("messages", messages)


  useEffect(() => {
    socket.on("connect", () => console.log("Connected to server"));
    socket.on("disconnect", () => console.log("Disconnected from server"));
    socket.on("message", (message) => {
      console.log("message12", message)
      setMessages((prev)=>([
        ...prev,
        message
      ]))
      // if (message.recieverId === user.id) {
      //   setUnreadCounts((prevCounts) => ({
      //     ...prevCounts,
      //     [message.senderId]: (prevCounts[message.senderId] || 0) + 1,
      //   }));
      // }
    });
    // socket.on("unread-count", (data) => {
    //   console.log("data 35", data)
    //   setUnreadCounts(data);
    // });

    return () => {
      socket.off("message");
      // socket.off("unread-count");
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  },[typingTimeout]);


//   const markMessagesAsRead = () => {
//     socket.emit('mark-as-read', reciever.id);
// };




  useEffect(() => {
    if (user && reciever.id) {
      const data = { senderId: user.id, recieverId: reciever.id };
      socket.emit("start-chat", data);
      socket.on("start-chat", (messages) => {
     
        setMessages(messages);
      });
    }
  }, [user, reciever.id]);

  useEffect(() => {
    if (user.id) {
      setUserId(user.id);
      socket.emit("user_connected", user.id);
      socket.emit("join", user.id);
    }
  }, [user.id]);

  const sendMessage = () => {
    const newMessage = {
      id: user.id || null,
      text: message,
      senderName:user.name,
      recieverName:reciever.name,
      recieverId: reciever?.id,
      senderId: user?.id,
      timestamp: new Date(),
    };
    socket.emit("message", newMessage);
    setMessage("");
    // Reset unread count for the receiver
    // setUnreadCounts((prevCounts) => ({
    //   ...prevCounts,
    //   [reciever.id]: 0,
    // }));
  };

  const handleTyping = () => {
    socket.emit("typing", { recieverId: reciever.id, isTyping: true });
    if (typingTimeout) clearTimeout(typingTimeout);

    const newTimeout = setTimeout(() => {
      socket.emit("typing", { recieverId: reciever.id, isTyping: false });
    }, 2000);

    setTypingTimeout(newTimeout);
  };

  return (
    <Container className={styles["chat-container"]} style={{display:"flex", gap:"20px", height:"100vh", overflow:'hidden',   alignItems: "stretch"
    }} >

      {/* <p>{JSON.stringify(messages)}</p> */}
     
     <UserList unreadCounts={unreadCounts} />

     
      <Box className={styles["messages-list"]} style={{flex:1, height:"100%", position:"relative" }}>
      <Box className={styles["hide-scroll"]} style={{overflowY:'auto',overflowX:'hidden', }}>
      {
       Object.keys(reciever).length!==0&& messages.length===0 && <Box className={styles['start-chart-alert']}>No messages yet</Box>
      }
       {
         Object.keys(reciever).length===0 && <Box className={styles['start-chart-alert']}>please start chat with any user</Box>
      }
      <MessageList messages={messages} />
      </Box>
    

      <Box sx={{flex:1, position:"sticky", padding:'0px 0px 20px 0px',left:0, background:'white', right:0, bottom:0 }} >
      <TextField
        label={isTyping ? "Typing..." : "Message"}
        fullWidth
        margin="normal"
        // style={{ marginTop: "80px" }}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleTyping}
      />
      <Button variant="contained" color="primary" onClick={sendMessage}>
        Send
      </Button>
      </Box>
     
      </Box>
     
    
    </Container>
  );
};

export default ChatWrapper;
