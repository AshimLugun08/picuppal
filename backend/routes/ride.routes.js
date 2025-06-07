import { Router } from 'express';
const router = Router();
import { body, query } from 'express-validator';
import { createRide, getFare, confirmRide, startRide, endRide } from '../controllers/ride.controller';
import { authUser, authCaption } from '../middlewares/auth.middleware';

router.post('/create',authUser,
    // body('userId').isString().isLength({min:24,max:24}).withMessage('Invalid user ID'),
    body('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
    body('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
    body('vehicleType').isIn(['auto', 'car', 'moto']).withMessage('Invalid vehicle type'),
    createRide
)

router.get('/get-fare',
    authUser,
    query('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
    query('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
    getFare
)
router.post('/confirm',
    authCaption,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    confirmRide
)

router.get('/start-ride',
    authCaption,
    query('rideId').isMongoId().withMessage('Invalid ride id'),
    query('otp').isString().isLength({ min: 6, max: 6 }).withMessage('Invalid OTP'),
    startRide
)

router.post('/end-ride',
    authCaption,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    endRide
)



export default router;