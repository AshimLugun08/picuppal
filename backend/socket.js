import socketIo from 'socket.io';
import { findByIdAndUpdate } from './model/user.model.js'; // Assuming you have a user model
import { findByIdAndUpdate as _findByIdAndUpdate } from './model/caption.model.js'; // Assuming you have a ride model


let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: [ 'GET', 'POST' ]
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);


        socket.on('join', async (data) => { 
          console.log('User joined:  fron join event');
            const { userId, userType } = data;
            
console.log(`User joined: ${userId}, Type: ${userType}`);
            if (userType === 'user') {
                await findByIdAndUpdate(userId, { socketId: socket.id });
            } else if (userType === 'captain') {
                await _findByIdAndUpdate(userId, { socketId: socket.id });
            }
        });


        socket.on('update-location-captain', async (data) => {
            const { userId, location } = data;

            if (!location || !location.ltd || !location.lng) {
                return socket.emit('error', { message: 'Invalid location data' });
            }

            await _findByIdAndUpdate(userId, {
                location: {
                    ltd: location.ltd,
                    lng: location.lng
                }
            });
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}

const sendMessageToSocketId = (socketId, messageObject) => {

console.log(messageObject);

    if (io) {
        io.to(socketId).emit(messageObject.event, messageObject.data);
    } else {
        console.log('Socket.io not initialized.');
    }
}

export default { initializeSocket, sendMessageToSocketId };