// const captainModel = require('../model/caption.model');
import { create } from '../model/caption.model';

export async function createCaption({ firstname, lastname, email, password, color, plate, capacity, vehicleType }) {
    if (!firstname || !lastname || !email || !password || !color || !plate || !capacity || !vehicleType) {
        throw new Error('All fields are required');
    }

    const caption = await create({
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
