const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const  mapController  = require('../controllers/map.controller');
const {query} = require('express-validator');
// const  = require('../controllers/map.controller');

router.get('/get-coordinates', authMiddleware.authUser, query('address').isString().isLength({min:3}), mapController.getCoordinate)

router.get('/get-distance-time',query('origin').isString().isLength({min:3}),
            query('destination').isString().isLength({min:3}),authMiddleware.authUser,mapController.getDistanceTime);

router.get('/get-suggestions', authMiddleware.authUser, query('input').isString().isLength({min:1}), mapController.getAutoCompleteSuggestions);

module.exports = router;