import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    // Only connect if user is logged in
    if (!user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Create socket connection
    const newSocket = io('http://localhost:5000', {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    // Connection events
    newSocket.on('connect', () => {
      console.log('🟢 Socket connected');
      setIsConnected(true);
      newSocket.emit('join', user.id);
    });

    newSocket.on('disconnect', () => {
      console.log('🔴 Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      toast.error('Connection error. Please refresh.');
    });

    // Receive message from server
    newSocket.on('receiveMessage', (data) => {
      console.log('📩 Message received:', data);
      setMessages(prev => {
        // Check if message already exists (prevent duplicates)
        const exists = prev.some(m => 
          m.senderId === data.senderId && 
          m.message === data.message && 
          m.timestamp === data.timestamp
        );
        if (exists) return prev;
        return [...prev, {
          ...data,
          id: data.id || `temp_${Date.now()}_${Math.random()}`,
          isRead: false
        }];
      });

      // Show notification
      if (data.senderId !== user?.id) {
        toast(`${data.senderName || 'Someone'} sent a message`, {
          icon: '💬',
          duration: 3000
        });
      }
    });

    // User typing indicator
    newSocket.on('userTyping', (data) => {
      // You can implement typing indicator UI here
      console.log('✏️ User typing:', data);
    });

    // Online users list
    newSocket.on('onlineUsers', (users) => {
      setOnlineUsers(users);
    });

    // Cleanup on unmount
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [user]);

  // Send a message
  const sendMessage = (receiverId, message, jobId = null) => {
    if (!socketRef.current || !isConnected) {
      toast.error('Not connected to chat server');
      return false;
    }

    if (!message.trim()) {
      toast.error('Message cannot be empty');
      return false;
    }

    const messageData = {
      senderId: user.id,
      senderName: user.name,
      receiverId,
      message: message.trim(),
      jobId,
      timestamp: new Date().toISOString()
    };

    socketRef.current.emit('sendMessage', messageData);
    
    // Add to local messages (optimistic update)
    setMessages(prev => [...prev, {
      ...messageData,
      id: `temp_${Date.now()}_${Math.random()}`,
      isRead: false,
      isSent: true
    }]);

    return true;
  };

  // Send typing indicator
  const sendTyping = (receiverId, isTyping = true) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('typing', {
        receiverId,
        isTyping
      });
    }
  };

  // Mark messages as read
  const markAsRead = async (senderId) => {
    setMessages(prev => prev.map(msg => 
      msg.senderId === senderId && msg.receiverId === user?.id
        ? { ...msg, isRead: true }
        : msg
    ));

    // Optional: Send to server to mark as read in database
    if (socketRef.current && isConnected) {
      socketRef.current.emit('markAsRead', {
        senderId,
        receiverId: user?.id
      });
    }
  };

  // Get conversation between two users
  const getConversation = (userId) => {
    return messages.filter(msg => 
      (msg.senderId === userId && msg.receiverId === user?.id) ||
      (msg.senderId === user?.id && msg.receiverId === userId)
    ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  };

  // Get unread count for a user
  const getUnreadCount = (senderId) => {
    return messages.filter(msg => 
      msg.senderId === senderId && 
      msg.receiverId === user?.id && 
      !msg.isRead
    ).length;
  };

  // Get all users with unread messages
  const getUnreadUsers = () => {
    const unreadMap = {};
    messages.forEach(msg => {
      if (msg.senderId !== user?.id && !msg.isRead) {
        unreadMap[msg.senderId] = (unreadMap[msg.senderId] || 0) + 1;
      }
    });
    return unreadMap;
  };

  // Clear all messages for a user (local)
  const clearConversation = (userId) => {
    setMessages(prev => prev.filter(msg => 
      msg.senderId !== userId && msg.receiverId !== userId
    ));
  };

  const value = {
    socket,
    messages,
    onlineUsers,
    isConnected,
    sendMessage,
    sendTyping,
    markAsRead,
    getConversation,
    getUnreadCount,
    getUnreadUsers,
    clearConversation,
    // Aliases for convenience
    send: sendMessage,
    markRead: markAsRead,
    getMessages: getConversation,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;