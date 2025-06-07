const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService =require('../services/maps.service')
const {sendMessageToSocketId}=require('../socket')
const rideModal=require('../model/ride.modal')

module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, pickup, destination, vehicleType } = req.body;
    try {
        // Create the ride
        const ride = await rideService.createRide({
           user: req.user._id,
            pickup,
            destination,
            vehicleType,
        });
         

        // Fetch coordinates first
        const pickupCoordinates = await mapService.getAddressCoordinate(pickup);
        console.log('Pickup Coordinates:', pickupCoordinates);

        // Then fetch captains using the coordinates
        const captianInRadius = await mapService.getCaptiansInTheRadius(
            pickupCoordinates.lat, // Assuming 'lat' is the correct property
            pickupCoordinates.lng,
            2
        ).catch(err => {
            console.error('Error fetching captains:', err.message);
            return []; // Return empty array if captains fetch fails
        });

        ride.otp=""
        console.log('Captains in Radius:', captianInRadius);
      const rideWithUser = await rideModal.findOne({ _id: ride._id }).populate('user');


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
};

module.exports.getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;

    try {
        const fare = await rideService.getFare(pickup, destination);
        return res.status(200).json(fare);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}


module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.confirmRide({ rideId, captain: req.captain });

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

module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;

    try {
        const ride = await rideService.startRide({ rideId, otp, captain: req.captain });

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

module.exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.endRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        })



        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    } s
}