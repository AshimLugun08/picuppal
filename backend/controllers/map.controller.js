import { getAddressCoordinate, getDistanceTimes, getAutoCompleteSuggestions } from '../services/maps.service.js';
import { validationResult } from 'express-validator';


export async function getCoordinate(req, res) {
    const errors = validationResult(req);       
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { address } = req.query;

    if (!address) {
        return res.status(400).json({ message: 'Address is required' });
    }

    try {
        const coordinates = await getAddressCoordinate(address);
         res.status(200).json(coordinates);
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
export async function getDistanceTime(req, res ,next) {
    try{

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { origin, destination } = req.query;

        if (!origin || !destination) {
            return res.status(400).json({ message: 'Origin and destination are required' });
        }

        const distanceTime = await getDistanceTimes(origin, destination);
        res.status(200).json(distanceTime);
    } catch (error) {
        console.error('Error fetching distance and time:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }}

export async function getAutoCompleteSuggestions(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { input } = req.query;

    if (!input) {
        return res.status(400).json({ message: 'Input is required' });
    }

    try {
        const suggestions = await getAutoCompleteSuggestions(input);
        res.status(200).json(suggestions);
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}