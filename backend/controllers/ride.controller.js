import { createRides, getFares, confirmRides, startRides, endRides } from '../services/ride.service.js';
import { validationResult } from 'express-validator';
import { getAddressCoordinate, getCaptiansInTheRadius } from '../services/maps.service.js';
import { sendMessageToSocketId } from '../socket.js';
import Ride from '../model/ride.modal.js';

export async function createRide(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, pickup, destination, vehicleType } = req.body;
    try {
        // Create the ride
        const ride = await createRides({
           user: req.user._id,
            pickup,
            destination,
            vehicleType,
        });
         

        // Fetch coordinates first
        const pickupCoordinates = await getAddressCoordinate(pickup);
        console.log('Pickup Coordinates:', pickupCoordinates);

        // Then fetch captains using the coordinates
        const captianInRadius = await getCaptiansInTheRadius(
            pickupCoordinates.lat, // Assuming 'lat' is the correct property
            pickupCoordinates.lng,
            2
        ).catch(err => {
            console.error('Error fetching captains:', err.message);
            return []; // Return empty array if captains fetch fails
        });

        ride.otp=""
        console.log('Captains in Radius:', captianInRadius);
      const rideWithUser = await Ride.findOne({ _id: ride._id }).populate('user');


      (captianInRadius.map( captain=>{
sendMessageToSocketId(captain.socketId ,{
    event:'new-ride',
    data:rideWithUser
})
      }))

      res.status(201).json({
            ride
        });
       
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function getFare(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;

    try {
        const fare = await getFares(pickup, destination);
        return res.status(200).json(fare);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}


export async function confirmRide(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await confirmRides({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {

        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}

export async function startRide(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;

    try {
        const ride = await startRides({ rideId, otp, captain: req.captain });

        console.log(ride);

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

export async function endRide(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await endRides({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        })



        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    } s
}