import express, { json, urlencoded } from 'express';
require('dotenv').config();
const app = express();
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRoutes from './routes/user.routes';
import captionRoutes from './routes/caption.routes';
import connectDB from './db/db';
import mapRoutes from './routes/map.routes';
import rideRoutes from './routes/ride.routes'; // Assuming you have a ride.routes.js file
  connectDB();
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true })); 
app.use(cookieParser());   

app.get('/', (req, res) => {
    res.send('Hello World!');
});


app.use('/users' ,userRoutes);
app.use('/captions', captionRoutes);
app.use('/map', mapRoutes);
app.use('/rides',rideRoutes); // Registering ride routes);




export default app;   