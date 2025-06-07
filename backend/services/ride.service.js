const rideModel = require('../model/ride.modal');
const mapService = require('./maps.service');
// const bycrypt = require('bcryptjs');
const crypto = require('crypto');

async function getFare(pickup ,destination){
    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required to calculate fare');
    }
    const distanceTime = await mapService.getDistanceTime(pickup, destination);
     const baseFare = {
        auto: 20,
        car: 30,
        moto: 20
    };

    const perKmRate = {
        auto: 8,
        car: 12,
        moto: 6
    };

    const perMinuteRate = {
        auto: 1.5,
        car: 2,
        moto: 1.5
    };



    const fare = {
        auto: Math.round(baseFare.auto + ((distanceTime.distance.value / 1000) * perKmRate.auto) + ((distanceTime.duration.value / 60) * perMinuteRate.auto)),
        car: Math.round(baseFare.car + ((distanceTime.distance.value / 1000) * perKmRate.car) + ((distanceTime.duration.value / 60) * perMinuteRate.car)),
        moto: Math.round(baseFare.moto + ((distanceTime.distance.value / 1000) * perKmRate.moto) + ((distanceTime.duration.value / 60) * perMinuteRate.moto))
    };

    return fare;

}

module.exports.getFare=getFare;

function getOtp(num){
function generateOtp(num){
    const otp = crypto.randomBytes(num).toString('hex').slice(0, num);
    return otp;
}
return generateOtp(num);
}

module.exports.createRide = async ({ user, pickup, destination, vehicleType }) => {
    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error('all fields are required');
    }

    const fare = await getFare(pickup, destination);

    const ride = await rideModel.create({
        user,
        pickup,
        destination,
        fare: fare[vehicleType],
        // status: 'pending',
        otp: getOtp(6) // Generate a 6-digit OTP
    });

    return ride;
};


module.exports.confirmRide = async ({
    rideId, captain
}) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'accepted',
        captain: captain._id
    })

    const ride = await rideModel.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    return ride;

}

module.exports.startRide = async ({ rideId, otp, captain }) => {
    if (!rideId || !otp) {
        throw new Error('Ride id and OTP are required');
    }

    const ride = await rideModel.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'accepted') {
        throw new Error('Ride not accepted');
    }

    if (ride.otp !== otp) {
        throw new Error('Invalid OTP');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'ongoing'
    })

    return ride;
}

module.exports.endRide = async ({ rideId, captain }) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    const ride = await rideModel.findOne({
        _id: rideId,
        captain: captain._id
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'ongoing') {
        throw new Error('Ride not ongoing');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'completed'
    })

    return ride;
}