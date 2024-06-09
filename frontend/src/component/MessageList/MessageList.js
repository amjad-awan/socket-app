import React from "react";
import { List, ListItem, ListItemText } from "@material-ui/core";
import styles from "./style.module.css";
import { Box } from "@mui/material";
const MessageList = ({ messages, userId }) => {
  console.log("messages", messages);
  return (
    <List>
      {messages.map((msg, index) => (
        <ListItem
          key={index}
          className={styles["list_item"]}
          style={{
            alignItems: userId === msg.id ? "flex-end" : "flex-start",
          }}
        >
          <Box
            sx={{
              flexDirection: userId === msg.id ? "row-reverse" : "row",
              display: "flex",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <Box
              className={styles["name_box"]}
              sx={{
                background: userId === msg.id ? "#95d18d" : "#dfe2df",
              }}
            >
              {msg?.username?.charAt(0)}
            </Box>
            <ListItemText
              primary={msg.text}
              className={styles["list_item-text"]}
              style={{
                background: userId === msg.id ? "#95d18d" : "#dfe2df",
              }}
              secondary={new Date(msg.timestamp).toLocaleString()}
            />
          </Box>
        </ListItem>
      ))}
    </List>
  );
};

export default MessageList;
