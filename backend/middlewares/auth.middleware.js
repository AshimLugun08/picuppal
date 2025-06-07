const jwt = require('jsonwebtoken');
const userModel = require('../model/user.model');
const blackListTokenModel = require('../model/blacklistToken.model');
const captionModel = require('../model/caption.model');

const authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const isBlacklisted = await userModel.findOne({ token });
    if (isBlacklisted) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id);
        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ message: 'Unauthorized' });
    }
};

const authCaption = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const isBlacklisted = await blackListTokenModel.findOne({ token });
    if (isBlacklisted) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const captain = await captionModel.findById(decoded._id);
        req.captain = captain;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = {
    authUser,
    authCaption
};
