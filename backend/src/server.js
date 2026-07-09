const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
dotenv.config();

// Routes
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const userRoutes = require('./routes/users');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    message: '🚀 API is running!', 
    timestamp: new Date().toISOString() 
  });
});

// ========== SOCKET.IO REAL-TIME CHAT ==========
const userSockets = {}; // { userId: socketId }

io.on('connection', (socket) => {
  console.log('🟢 New client connected:', socket.id);

  // User joins with their ID
  socket.on('user_connected', (userId) => {
    userSockets[userId] = socket.id;
    console.log(`👤 User ${userId} connected`);
    socket.broadcast.emit('user_online', userId);
  });

  // ========== GLOBAL CHAT ==========
  
  // Send global message
  socket.on('send_message', async (data) => {
    try {
      const { senderId, receiverId, content } = data;
      
      const message = await prisma.message.create({
        data: {
          content,
          senderId,
          receiverId,
          read: false
        }
      });

      const receiverSocketId = userSockets[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('new_message', {
          ...message,
          sender: { id: senderId }
        });
      }

      socket.emit('message_sent', message);
      console.log(`💬 Global message from ${senderId} to ${receiverId}`);
    } catch (error) {
      console.error('Message error:', error);
      socket.emit('message_error', error.message);
    }
  });

  // Get global chat history
  socket.on('get_chat_history', async (data) => {
    try {
      const { userId1, userId2 } = data;
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: userId1, receiverId: userId2 },
            { senderId: userId2, receiverId: userId1 }
          ]
        },
        orderBy: { createdAt: 'asc' },
        include: {
          sender: {
            select: { id: true, name: true }
          }
        }
      });
      socket.emit('chat_history', messages);
    } catch (error) {
      console.error('History error:', error);
    }
  });

  // Mark global message as read
  socket.on('mark_read', async (data) => {
    try {
      const { messageId, userId } = data;
      await prisma.message.update({
        where: { id: messageId },
        data: { read: true }
      });
      
      const message = await prisma.message.findUnique({
        where: { id: messageId }
      });
      
      if (message) {
        const senderSocketId = userSockets[message.senderId];
        if (senderSocketId) {
          io.to(senderSocketId).emit('message_read', { messageId });
        }
      }
    } catch (error) {
      console.error('Mark read error:', error);
    }
  });

  // Get unread global messages count
  socket.on('get_unread_count', async (userId) => {
    try {
      const count = await prisma.message.count({
        where: {
          receiverId: userId,
          read: false
        }
      });
      socket.emit('unread_count', count);
    } catch (error) {
      console.error('Unread count error:', error);
    }
  });

  // ========== JOB-SPECIFIC CHAT ==========
  
  // Send job message
  socket.on('send_job_message', async (data) => {
    try {
      const { senderId, applicationId, content } = data;
      
      // Save message to database
      const message = await prisma.jobMessage.create({
        data: {
          content,
          senderId,
          applicationId,
          read: false
        },
        include: {
          sender: {
            select: { id: true, name: true }
          },
          application: {
            include: {
              job: {
                select: { id: true, title: true, clientId: true }
              },
              student: {
                select: { id: true, name: true }
              }
            }
          }
        }
      });

      // Get the application to find receiver
      const application = await prisma.application.findUnique({
        where: { id: applicationId },
        include: {
          job: { select: { clientId: true } },
          student: { select: { id: true } }
        }
      });

      // Determine receiver (the other person in the conversation)
      const receiverId = senderId === application.studentId 
        ? application.job.clientId 
        : application.studentId;

      // Send to receiver if online
      const receiverSocketId = userSockets[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('new_job_message', message);
      }

      // Send back to sender (confirmation)
      socket.emit('job_message_sent', message);

      console.log(`💬 Job message from ${senderId} for application ${applicationId}`);
    } catch (error) {
      console.error('Job message error:', error);
      socket.emit('message_error', error.message);
    }
  });

  // Get job chat history
  socket.on('get_job_chat_history', async (data) => {
    try {
      const { applicationId } = data;
      const messages = await prisma.jobMessage.findMany({
        where: { applicationId },
        orderBy: { createdAt: 'asc' },
        include: {
          sender: {
            select: { id: true, name: true }
          }
        }
      });
      socket.emit('job_chat_history', messages);
    } catch (error) {
      console.error('Job history error:', error);
    }
  });

  // Mark job message as read
  socket.on('mark_job_read', async (data) => {
    try {
      const { messageId } = data;
      await prisma.jobMessage.update({
        where: { id: messageId },
        data: { read: true }
      });
    } catch (error) {
      console.error('Mark job read error:', error);
    }
  });

  // Get unread count for a user (job messages)
  socket.on('get_unread_job_messages', async (userId) => {
    try {
      // Get all applications where user is involved
      const applications = await prisma.application.findMany({
        where: {
          OR: [
            { studentId: userId },
            { job: { clientId: userId } }
          ]
        },
        select: { id: true }
      });
      
      const applicationIds = applications.map(a => a.id);
      
      const count = await prisma.jobMessage.count({
        where: {
          applicationId: { in: applicationIds },
          read: false,
          NOT: { senderId: userId }
        }
      });
      socket.emit('unread_job_count', count);
    } catch (error) {
      console.error('Unread job count error:', error);
    }
  });

  // User disconnects
  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected:', socket.id);
    for (const [userId, socketId] of Object.entries(userSockets)) {
      if (socketId === socket.id) {
        delete userSockets[userId];
        socket.broadcast.emit('user_offline', userId);
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📡 API ready at http://localhost:${PORT}/api/health`);
  console.log(`💬 WebSocket ready for real-time chat`);
});