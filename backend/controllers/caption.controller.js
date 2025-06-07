import captainModel from '../model/caption.model';
import { createCaption } from '../services/caption.service';
import blackListTokenModel from '../model/blacklistToken.model';
import { validationResult } from 'express-validator';
// const captain = require('../model/caption.model');  


export async function registerCaption(req, res, next) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password, vehicle } = req.body;

    const isCaptainAlreadyExist = await captainModel.findOne({ email });

    if (isCaptainAlreadyExist) {
        return res.status(400).json({ message: 'Captain already exist' });
    }


    const hashedPassword = await captainModel.hashPassword(password);

    const captain = await createCaption({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword,
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        vehicleType: vehicle.vehicleType
    });

    const token = captain.generateAuthToken();

    res.status(201).json({ token, captain });

}



export async function loginCaptain(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Fetch user with password explicitly selected
const captain = await captainModel.findOne({ email }).select('+password');


    if (!captain) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Debug logs
    console.log('Input password:', password);
    console.log('Stored hash:', captain.password);

    const isMatch = await captain.comparePassword(password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = captain.generateAuthToken();
    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ message: 'Login successful', token ,captain });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getCaptionProfile(req, res, next) {
    res.status(200).json({ captain: req.captain });
}

export async function logoutCaption(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];

    await blackListTokenModel.create({ token });

    res.clearCookie('token');

    res.status(200).json({ message: 'Logout successfully' });
}