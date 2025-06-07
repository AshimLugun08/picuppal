const captainModel = require('../model/caption.model');
const captainService = require('../services/caption.service');
const blackListTokenModel = require('../model/blacklistToken.model');
const { validationResult } = require('express-validator');
// const captain = require('../model/caption.model');  


module.exports.registerCaption = async (req, res, next) => {

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

    const captain = await captainService.createCaption({
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



module.exports.loginCaptain = async (req, res) => {
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
};

module.exports.getCaptionProfile = async (req, res, next) => {
    res.status(200).json({ captain: req.captain });
}

module.exports.logoutCaption = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];

    await blackListTokenModel.create({ token });

    res.clearCookie('token');

    res.status(200).json({ message: 'Logout successfully' });
}