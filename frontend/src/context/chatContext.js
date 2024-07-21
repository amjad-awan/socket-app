import React, { createContext, useState, useContext } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [reciever, setReciever]= useState({})





  return (
    <ChatContext.Provider value={{ messages,reciever, setReciever, setMessages }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
