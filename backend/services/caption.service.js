// const captainModel = require('../model/caption.model');
import captainModel from '../model/caption.model.js';

export async function createCaption({ firstname, lastname, email, password, color, plate, capacity, vehicleType }) {
    if (!firstname || !lastname || !email || !password || !color || !plate || !capacity || !vehicleType) {
        throw new Error('All fields are required');
    }

    const caption = await captainModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password, // ✅ already hashed before passed in
        vehicle: {
            color,
            plate,
            capacity,
            vehicleType
        }
    });

    return caption;
}
