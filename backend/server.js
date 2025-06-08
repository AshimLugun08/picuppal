import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app.js';

const port = process.env.PORT || 10000; // Use Render’s PORT, fallback for local testing

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://picuppal08.onrender.com', // Allow frontend
    methods: ['GET', 'POST'],
  },
});

// Socket.IO initialization
io.on('connection', (socket) => {
  console.log(`Client ${socket.id} connected`);
  socket.on('message', (data) => {
    io.emit('message', data); // Broadcast to clients
  });
  socket.on('disconnect', () => {
    console.log(`Client ${socket.id} disconnected`);
  });
});

// Replace initializeSocket if it only contains io setup
// If initializeSocket has custom logic, move it here or keep it separate

server.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});