const http = require('http');
const app = require('./app');
const { initializeSocket } = require('./socket');
const port = process.env.PORT || 3000;

const server = http.createServer(app);

initializeSocket(server);

export default function handler(req, res) {
  res.status(200).json({ message: 'Hello from Vercel!' });
}
