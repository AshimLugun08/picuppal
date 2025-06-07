const mongoose = require('mongoose');

function connectDB() {
    // Ensure MONGO_URI is defined
    if (!process.env.MONGO_URI) {
        console.error('Error: MONGO_URI is not defined in the .env file');
        process.exit(1); // Exit the process if MONGO_URI is missing
    }
    


    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log('MongoDB connected successfully');
        })
        .catch(err => {
            console.error('MongoDB connection error:', err);
            process.exit(1); // Exit the process on connection failure
        });
}

module.exports = connectDB;