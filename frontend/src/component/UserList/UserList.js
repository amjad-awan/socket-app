import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getAllUser } from '../../services/auth';
import styles from "./style.module.css";
import { useAuth } from '../../context/authContext';
import { useChat } from '../../context/chatContext';
import { io } from 'socket.io-client';

const socket = io("http://localhost:3000");

const UserList = () => {
  const { user } = useAuth();
  const { setReciever, messages, reciever } = useChat();
  const [users, setUsers] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  console.log("unreadCounts",unreadCounts)

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await getAllUser();
        if (res) {
          const filteredUsers = res.users.filter(listUser => listUser.id !== user?.id);
          setUsers(filteredUsers);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (user.id) {
      getUsers();
    }
  }, [user.id]);

  useEffect(() => {
    if (user?.id) {
      // Request unread counts
      socket.emit('get-unread-counts', user.id);

      // Listen for unread counts
      socket.on('unread-counts', (counts) => {
        setUnreadCounts(counts);
      });

      // Listen for updates to unread counts for specific senders
      socket.on('update-unread-count', (counts) => {
        setUnreadCounts(prevCounts => ({
          ...prevCounts,
          ...counts,
        }));
      });
      // Cleanup
      return () => {
        socket.off('unread-counts');
        socket.off('update-unread-count');
      };
    }
  }, [user?.id, messages,reciever]);

  const handleUserClick = (selectedUser) => {
    setReciever(selectedUser);
    // Emit event to mark messages from the selected user as read
    socket.emit('mark-as-read', { senderId: selectedUser.id, recieverId: user.id });
  };

  return (
    <Box className={styles["user-list"]} sx={{ width: "300px", padding: "20px", display: "flex", flexDirection: "column", gap: "10px", background: "#fff" }}>
      {
        users?.length === 0 ? <p>No user</p> : users?.map((listUser) => (
          <Box key={listUser?.id} sx={{ background: "#FDA329", cursor: "pointer", borderRadius: "5px", padding: "10px" }}
            onClick={() => handleUserClick(listUser)}
          >
            <p className={styles["list-item"]}>{listUser?.name}</p>
            <p className={styles["list-item_text"]}>{listUser?.name}</p>
            {unreadCounts[listUser.id] > 0 && (
              <Box className={styles["unread-count"]}>
                {unreadCounts[listUser.id]}
              </Box>
            )}
          </Box>
        ))
      }
    </Box>
  );
};

export default UserList;
