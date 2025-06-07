// const {  } = require('jsonwebtoken');
const userModel = require('../model/user.model');
const userService = require('../services/user.services');
const {validationResult} = require('express-validator');
// const user = require('../model/user.model');
const blackListTokenSchema = require('../model/blacklistToken.model');


module.exports.registerUser = async (req, res) => {
    const errors =validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { fullname, email, password } = req.body;


    const isUserAlreadyExists = await userModel.findOne({   email });
    if (isUserAlreadyExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
        firstname:fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashPassword
    });

    const token = user.genterateAuthToken(); 
    res.status(200).json({token,user})

}


module.exports.loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select('+password');
    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = user.genterateAuthToken();
      res.cookie('token', token);
    res.status(200).json({ token, user });
  
}

module.exports.getUserProfile = async (req, res) => {
    const userId = req.user._id; // Assuming you have middleware to set req.user
    const user = await userModel.findById(userId).select('-password');
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
}

module.exports.logoutUser = async (req, res) => {
    res.clearCookie('token'); // Clear the cookie
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    await blackListTokenSchema.create({ token }); // Add token to blacklist
    res.status(200).json({ message: 'Logged out successfully' });
}