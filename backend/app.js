import express, { json, urlencoded } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';
import captionRoutes from './routes/caption.routes.js';
import connectDB from './db/db.js';
import mapRoutes from './routes/map.routes.js';
import rideRoutes from './routes/ride.routes.js';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: 'https://picuppal08.onrender.com', // Match frontend
  credentials: true, // Allow cookies if needed
}));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use('/users', userRoutes);
app.use('/captions', captionRoutes);
app.use('/map', mapRoutes);
app.use('/rides', rideRoutes);

export default app;