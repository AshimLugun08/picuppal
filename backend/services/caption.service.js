// const captainModel = require('../model/caption.model');
const captionModel = require('../model/caption.model');

module.exports.createCaption = async ({ firstname, lastname, email, password, color, plate, capacity, vehicleType }) => {
    if (!firstname || !lastname || !email || !password || !color || !plate || !capacity || !vehicleType) {
        throw new Error('All fields are required');
    }

    const caption = await captionModel.create({
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
};
