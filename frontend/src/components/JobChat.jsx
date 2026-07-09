import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { FaPaperPlane, FaUser, FaBriefcase } from 'react-icons/fa';

const JobChat = ({ applicationId, jobTitle, otherUserName, otherUserRole }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user || !applicationId) return;

    // Connect to socket
    socketRef.current = io('http://localhost:5000');
    
    socketRef.current.on('connect', () => {
      console.log('🟢 Connected to chat server');
      setIsConnected(true);
      socketRef.current.emit('user_connected', user.id);
    });

    // Load chat history
    socketRef.current.emit('get_job_chat_history', { applicationId });

    // Listen for new messages
    socketRef.current.on('new_job_message', (message) => {
      if (message.applicationId === applicationId) {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      }
    });

    socketRef.current.on('job_chat_history', (history) => {
      setMessages(history);
      setLoading(false);
      scrollToBottom();
    });

    socketRef.current.on('job_message_sent', (message) => {
      // Message saved
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user, applicationId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !applicationId) return;

    const messageData = {
      senderId: user.id,
      applicationId: applicationId,
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

    socketRef.current.emit('send_job_message', messageData);
    setNewMessage('');
    scrollToBottom();
  };

  if (!applicationId) {
    return (
      <div className="text-center text-gray-400 py-8">
        <p>No application selected for chat.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-white">
              {otherUserName?.charAt(0).toUpperCase() || '?'}
            </div>
            <div className="ml-3">
              <div className="font-medium text-white flex items-center gap-2">
                {otherUserName || 'User'}
                <span className="text-xs text-gray-400">
                  {otherUserRole === 'STUDENT' ? '🎓' : '💼'}
                </span>
              </div>
              <div className="text-sm text-gray-400 flex items-center gap-2">
                <FaBriefcase className="text-purple-400" size={12} />
                <span>Job: {jobTitle || 'Job'}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
              {isConnected ? '● Online' : '● Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-900">
        {loading ? (
          <div className="text-center text-gray-400 py-8">
            <div className="animate-pulse">Loading messages...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <p>No messages yet.</p>
            <p className="text-sm mt-2">Start the conversation about this job!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-lg ${
                  msg.senderId === user.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-white'
                }`}
              >
                {msg.senderId !== user.id && (
                  <div className="text-xs text-purple-400 font-semibold mb-1">
                    {msg.sender?.name || 'Unknown'}
                  </div>
                )}
                <div className="break-words">{msg.content}</div>
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
            placeholder={isConnected ? "Type a message about this job..." : "Connecting..."}
            disabled={!isConnected}
            className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!isConnected || !newMessage.trim()}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
          >
            <FaPaperPlane size={16} />
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobChat;