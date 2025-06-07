import Ride from '../model/ride.modal.js';

import { getDistanceTime } from './maps.service.js';
// const bycrypt = require('bcryptjs');
import { randomBytes } from 'crypto';

async function getFares(pickup ,destination){
    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required to calculate fare');
    }
    const distanceTime = await getDistanceTime(pickup, destination);
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

const _getFare = getFares;
export { _getFare as getFare };

function getOtp(num){
function generateOtp(num){
    const otp = randomBytes(num).toString('hex').slice(0, num);
    return otp;
}
return generateOtp(num);
}

export async function createRides({ user, pickup, destination, vehicleType }) {
    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error('all fields are required');
    }

    const fare = await getFares(pickup, destination);

    const ride = await  Ride.create({
        user,
        pickup,
        destination,
        fare: fare[vehicleType],
        // status: 'pending',
        otp: getOtp(6) // Generate a 6-digit OTP
    });

    return ride;
}


export async function confirmRides({
    rideId, captain
}) {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    await  Ride.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'accepted',
        captain: captain._id
    })

    const ride = await  Ride.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    return ride;

}

export async function startRides({ rideId, otp, captain }) {
    if (!rideId || !otp) {
        throw new Error('Ride id and OTP are required');
    }

    const ride = await  Ride.findOne({
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

    await  Ride.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'ongoing'
    })

    return ride;
}

export async function endRides({ rideId, captain }) {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    const ride = await  Ride.findOne({
        _id: rideId,
        captain: captain._id
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'ongoing') {
        throw new Error('Ride not ongoing');
    }

    await  Ride.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'completed'
    })

    return ride;
}