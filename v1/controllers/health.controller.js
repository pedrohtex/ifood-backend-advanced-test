const spotifyApi = require('../api/spotify.api');
const weatherApi = require('../api/openweathermap.api');

/**
 * Middleware to send back health status response back to client
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const getServiceHealth = (req, res, next) => {

    const spotify = {
        connections: spotifyApi.getConnectionAttempts(),
        errors: spotifyApi.getConnectionErrors(),
        consecutiveErrors: spotifyApi.getConsecutiveErrors()
    }

    const openWeatherMap = {
        connections: weatherApi.getConnectionAttempts(),
        errors: weatherApi.getConnectionErrors(),
        consecutiveErrors: weatherApi.getConsecutiveErrors()
    }

    if (spotify.consecutiveErrors >= 5 || openWeatherMap.consecutiveErrors >= 5) {
        return res.status(400).send('too many errors. Something is not right');
    }

    res.status(200).json({
        status: 'healthy',
        statistics: { spotify, openWeatherMap }
    });

}

module.exports = {
    getServiceHealth
}