import { createServer } from 'http';
import app from './app.js';
import { initializeSocket } from './socket.js';
const port = process.env.PORT || 3000;

const server = createServer(app);

initializeSocket(server);

export default function handler(req, res) {
  res.status(200).json({ message: 'Hello from Vercel!' });
}
