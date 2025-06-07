import { Router } from 'express';
const router =Router();
import { body } from 'express-validator';
import { registerCaption, loginCaptain, getCaptionProfile, logoutCaption } from '../controllers/caption.controller';
import { authCaption } from '../middlewares/auth.middleware';


router.post('/register',[
    body('email').isEmail().withMessage('Invalid email'),
    body('fullname.firstname')
        .isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),

    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('vehicle.color')
        .isLength({ min: 3 }).withMessage('Color must be at least 3 characters long'),
    body('vehicle.plate')
        .isLength({ min: 3 }).withMessage('Plate must be at least 3 characters long'),
    body('vehicle.capacity')
        .isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
    body('vehicle.vehicleType')
        .isIn(['car', 'motorcycle', 'auto']).withMessage('Vehicle type must be car, bike, or truck'),
], 
    registerCaption);

router.post('/login', [
    body('email').isEmail().withMessage('Invalid email'),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
],loginCaptain);




router.get('/profile', authCaption, getCaptionProfile);

router.get('/logout', authCaption, logoutCaption);


export default router;