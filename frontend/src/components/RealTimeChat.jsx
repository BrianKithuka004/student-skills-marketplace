import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const RealTimeChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Connect to WebSocket
  useEffect(() => {
    if (!user) return;

    // Connect to socket server
    socketRef.current = io('http://localhost:5000');

    // Register user
    socketRef.current.emit('user_connected', user.id);

    // Load all users
    fetchUsers();

    // Socket event listeners
    socketRef.current.on('new_message', (message) => {
      setMessages(prev => [...prev, message]);
      scrollToBottom();
    });

    socketRef.current.on('message_sent', (message) => {
      // Message saved confirmation
    });

    socketRef.current.on('user_online', (userId) => {
      setOnlineUsers(prev => [...prev, userId]);
    });

    socketRef.current.on('user_offline', (userId) => {
      setOnlineUsers(prev => prev.filter(id => id !== userId));
    });

    socketRef.current.on('chat_history', (history) => {
      setMessages(history);
      setLoading(false);
      scrollToBottom();
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user]);

  // Load chat history when user is selected
  useEffect(() => {
    if (selectedUser && socketRef.current) {
      setLoading(true);
      socketRef.current.emit('get_chat_history', {
        userId1: user.id,
        userId2: selectedUser.id
      });
    }
  }, [selectedUser]);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.users.filter(u => u.id !== user.id));
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    const messageData = {
      senderId: user.id,
      receiverId: selectedUser.id,
      content: newMessage.trim()
    };

    // Add message optimistically
    const tempMessage = {
      id: Date.now().toString(),
      ...messageData,
      createdAt: new Date().toISOString(),
      sender: { id: user.id, name: user.name }
    };
    setMessages(prev => [...prev, tempMessage]);

    socketRef.current.emit('send_message', messageData);
    setNewMessage('');
    scrollToBottom();
  };

  const isUserOnline = (userId) => {
    return onlineUsers.includes(userId);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please Login</h2>
          <p className="text-gray-400">You need to be logged in to chat</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Users List - Left Side */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">💬 Messages</h2>
          <p className="text-sm text-gray-400 mt-1">
            {users.length} users available
          </p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {users.map((u) => (
            <div
              key={u.id}
              className={`p-4 hover:bg-gray-700 cursor-pointer border-b border-gray-700 transition ${
                selectedUser?.id === u.id ? 'bg-gray-700' : ''
              }`}
              onClick={() => setSelectedUser(u)}
            >
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center font-bold text-white">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-800 ${
                    isUserOnline(u.id) ? 'bg-green-500' : 'bg-gray-500'
                  }`}></span>
                </div>
                <div className="ml-3 flex-1">
                  <div className="font-medium">{u.name}</div>
                  <div className="text-sm text-gray-400">
                    {isUserOnline(u.id) ? '🟢 Online' : '⚪ Offline'}
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {u.role === 'STUDENT' ? '🎓' : '💼'}
                </div>
              </div>
            </div>
          ))}
          {users.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              No other users found
            </div>
          )}
        </div>
      </div>

      {/* Chat Area - Right Side */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-700 bg-gray-800">
          {selectedUser ? (
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center font-bold text-white">
                {selectedUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <div className="font-medium">{selectedUser.name}</div>
                <div className={`text-sm ${isUserOnline(selectedUser.id) ? 'text-green-400' : 'text-gray-400'}`}>
                  {isUserOnline(selectedUser.id) ? '● Online' : '○ Offline'}
                </div>
              </div>
              <div className="ml-auto text-sm text-gray-400">
                {selectedUser.role}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400">
              Select a user to start chatting
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-900">
          {loading ? (
            <div className="text-center text-gray-400 py-8">
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.senderId === user.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-white'
                  }`}
                >
                  {msg.senderId !== user.id && (
                    <div className="text-xs text-purple-400 font-semibold mb-1">
                      {users.find(u => u.id === msg.senderId)?.name || 'Unknown'}
                    </div>
                  )}
                  <div>{msg.content}</div>
                  <div className="text-xs opacity-75 mt-1 text-right">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {msg.senderId === user.id && msg.read && ' ✓✓'}
                    {msg.senderId === user.id && !msg.read && ' ✓'}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-700 bg-gray-800">
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={selectedUser ? "Type a message..." : "Select a user first"}
              disabled={!selectedUser}
              className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
            />
            <button
              type="submit"
              disabled={!selectedUser || !newMessage.trim()}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RealTimeChat;