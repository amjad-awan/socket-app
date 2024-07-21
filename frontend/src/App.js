// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import ProtectedRoute from './protectedRoutes/ProtectedRoute';
import { AuthProvider } from './context/authContext';
import { ChatProvider } from './context/chatContext';
function App() {
  return (
    <AuthProvider>
      <ChatProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute element={<Chat />} />} />
          {/* <Route path="/" element={<Login />} /> */}
        </Routes>
      </Router>
      </ChatProvider>
     
    </AuthProvider>
  );
}

export default App;
