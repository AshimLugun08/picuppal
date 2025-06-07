import { Router } from 'express';
const router = Router();
import { authUser } from '../middlewares/auth.middleware.js';
import { getCoordinate, getDistanceTime, getAutoCompleteSuggestions } from '../controllers/map.controller.js';
import { query } from 'express-validator';
// const  = require('../controllers/map.controller');

router.get('/get-coordinates', authUser, query('address').isString().isLength({min:3}), getCoordinate)

router.get('/get-distance-time',query('origin').isString().isLength({min:3}),
            query('destination').isString().isLength({min:3}),authUser,getDistanceTime);

router.get('/get-suggestions', authUser, query('input').isString().isLength({min:1}), getAutoCompleteSuggestions);

export default router;