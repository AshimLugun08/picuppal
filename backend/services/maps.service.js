const axios = require('axios');
const captainModel = require('../model/caption.model');


module.exports.getAddressCoordinate= async(address) =>{
    const apikey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apikey}`;
    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            const location = response.data.results[0].geometry.location;
            return {
                lat: location.lat,
                lng: location.lng
            };
        } else {
            throw new Error('Unable to find address');
        }
    } catch (error) {
        console.error('Error fetching address coordinates:', error);
        throw error;
    }

}

module.exports.getDistanceTime =async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }
    const apikey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apikey}`;
    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
           if (response.data.rows[0].elements[0].status ==='ZERO_RESULTS') {
                throw new Error('No route found');
            }
            return response.data.rows[0].elements[0];
        } else {
            throw new Error('Error fetching distance matrix');
        }
    } catch (error) {
        console.error('Error fetching distance and time:', error);
        throw error;
    }}

    module.exports.getAutoCompleteSuggestions=async (input) => {
        if (!input) {
            throw new Error('query is required');
        }
        apikey = process.env.GOOGLE_MAPS_API;
        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apikey}`;
        try {
            const response = await axios.get(url);
            if (response.data.status === 'OK') {
                return response.data.predictions;
            } else {
                throw new Error('Error fetching autocomplete suggestions');
            }
        } catch (error) {
            console.error('Error fetching autocomplete suggestions:', error);
            throw error;
        }
    }


    module.exports.getCaptiansInTheRadius= async (ltd, lng, radius) => {
        const captains=await captainModel.find({
            location:{
                $geoWithin:{
                    $centerSphere:[[ltd,lng],radius/6371]
                }
            }
        })
    
    return captains;
    }
