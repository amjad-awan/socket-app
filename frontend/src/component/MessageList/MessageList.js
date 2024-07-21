import React from "react";
import { List, ListItem, ListItemText } from "@material-ui/core";
import styles from "./style.module.css";
import { Box, Typography } from "@mui/material";
import { useChat } from "../../context/chatContext";
import { useAuth } from "../../context/authContext";
const MessageList = ({ messages }) => {
  const {user}=useAuth()

  const { reciever } = useChat()
  console.log('reciever',reciever)

  return (
    <List style={{ flex: 1, position: "relative", padding:"0" }}>
      <Box
      className={styles['chat-header']}
        sx={{
          background: "#fff",
          zIndex: 99,
          // left: "300px",
          top: 0,
          left:0,
          right:0,
          position: "sticky",
          // width: "100%",
          borderRadius: "5px",
          padding: "10px 5px",
        }}
      >
       {
        Object.keys(reciever).length !== 0?<Box sx={{display:"flex", alignItems:"center", gap:"10px"}}>
        <Box sx={{ background: "#FDA329", textTransform:"uppercase",  display: "flex", justifyContent: "center", alignItems: "center", width: "40px", height: "40px", borderRadius: "50%" }}>
          {reciever?.name?.charAt(0)}
        </Box>
        <Typography variant="p">{reciever?.name}</Typography>
      </Box>:<p className={styles['no_chat-selcted']} >No Chat is selected yet</p>
       } 
      </Box>
      {messages.map((msg, index) => {
        return <ListItem
          key={index}
          className={styles["list_item"]}
          style={{
            alignItems: user?.id === msg.senderId
            ? "flex-end" : "flex-start",
          }}
        >
          <Box
            sx={{
              flexDirection: user?.id === msg.senderId ? "row-reverse" : "row",
              display: "flex",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <Box
              className={styles["name_box"]}
              sx={{
                background: user?.id === msg.senderId ? "#18D39E" : "#dfe2df",
              }}
            >
              {user?.id === msg.senderId ?user?.name.charAt(0):msg?.senderName.charAt(0)}
            </Box>
            <ListItemText
              primary={msg.text}
              className={styles["list_item-text"]}
              style={{
                background: user?.id === msg.senderId ? "#18D39E" : "#dfe2df",
                color:user?.id === msg.senderId ? "#fff" : "#000"
              }}
             
            />
            {/* <Typography variant="p" >{new Date(msg.timestamp).toLocaleString()}</Typography> */}
          </Box>
        </ListItem>}
      )}
    </List>
  );
};

export default MessageList;
