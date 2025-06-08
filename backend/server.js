// index.js (or your main server file)
import { createServer } from 'http';
import { initializeSocket } from './socket.js'; // Import initializeSocket
import app from './app.js';

const port = process.env.PORT || 10000; // Use Render’s PORT or fallback

const server = createServer(app);

// Initialize Socket.io using socket.js
initializeSocket(server);

server.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});