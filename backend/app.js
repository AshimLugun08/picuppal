const express = require('express');
require('dotenv').config();
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const userRoutes = require('./routes/user.routes');
const captionRoutes = require('./routes/caption.routes');
const connectDB = require('./db/db');
const mapRoutes = require('./routes/map.routes');
const rideRoutes = require('./routes/ride.routes'); // Assuming you have a ride.routes.js file
  connectDB();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());   

app.get('/', (req, res) => {
    res.send('Hello World!');
});


app.use('/users' ,userRoutes);
app.use('/captions', captionRoutes);
app.use('/map', mapRoutes);
app.use('/rides',rideRoutes); // Registering ride routes);




module.exports = app;   