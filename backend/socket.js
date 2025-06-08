// socket.js
import { Server as socketIo } from 'socket.io';
import userModal from './model/user.model.js';
import captainModel from './model/caption.model.js'; // Fixed typo (caption -> captain)

let io;

function initializeSocket(server) {
    console.log('Initializing Socket.io');
    io = new socketIo(server, {
        cors: {
            origin: 'https://picuppal08.onrender.com', // Allow frontend
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        socket.on('join', async (data) => {
            try {
                const { userId, userType } = data;
                console.log(`User joined: ${userId}, Type: ${userType}`);
                if (userType === 'user') {
                    await userModal.findByIdAndUpdate(userId, { socketId: socket.id });
                } else if (userType === 'captain') {
                    await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
                }
            } catch (error) {
                console.error('Join error:', error);
                socket.emit('error', { message: 'Failed to join' });
            }
        });

        socket.on('update-location-captain', async (data) => {
            try {
                const { userId, location } = data;
                if (!location || !location.ltd || !location.lng) {
                    return socket.emit('error', { message: 'Invalid location data' });
                }
                await captainModel.findByIdAndUpdate(userId, {
                    location: {
                        ltd: location.ltd,
                        lng: location.lng,
                    }
                });
            } catch (error) {
                console.error('Location update error:', error);
                socket.emit('error', { message: 'Failed to update location' });
            }
        });

        socket.on('message', (data) => {
            io.emit('message', data); // Broadcast messages to all clients
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}

const sendMessageToSocketId = (socketId, messageObject) => {
    if (!io) {
        console.error('Socket.io not initialized. Ensure initializeSocket is called in the main server file.');
        return;
    }
    if (!socketId || !messageObject?.event || !messageObject?.data) {
        console.error('Invalid parameters:', { socketId, messageObject });
        return;
    }
    console.log('Sending message to socket:', socketId, messageObject);
    io.to(socketId).emit(messageObject.event, messageObject.data);
};

export { initializeSocket, sendMessageToSocketId };