const weatherAPI = require('../api/openweathermap.api');
const ERRORS = require('../../errors');
const logger = require('../../log');

const fname = require('path').basename(__filename);

/**
 * Middleware to delegate OpenWeatherMap API calls and, once it get the response, 
 * send to the next middleware.
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const getTemperatureAndCity = (req, res, next) => {
    logger.info(`${fname} Requesting city and temperature`);
    
    weatherAPI.fetchWeather(req.query)
    .then(weatherMap => {
        try {
            req.temperature = extractTemperature(weatherMap);
            req.city = extractCityName(weatherMap);
            logger.info(`${fname} Got City ${req.city} and temperature ${req.temperature}`);
        } catch (err) {
            logger.error(`${fname} Error parsing city and temperature ${error}`);
            
            const error = new Error(ERRORS.INTERNAL_ERROR.message);
            error.code = ERRORS.INTERNAL_ERROR.code;
            error.name = ERRORS.INTERNAL_ERROR.name;            
            throw error;
        }        
        next();
    })
    .catch(err => {
        logger.error(`${fname} Error fetching city and temperature ${err}`);

        const error = new Error(ERRORS.INTERNAL_ERROR.message);
        error.code = ERRORS.INTERNAL_ERROR.code;
        error.name = ERRORS.INTERNAL_ERROR.name;            
        next(error);
    });
};

/**
 * Utility method to extract temperature value from OpenWeatherMap API response
 * @param {*} weatherMap 
 */
const extractTemperature = weatherMap => weatherMap.main.temp;

/**
 * Utility method to extract temperature value from OpenWeatherMap API response
 * @param {*} weatherMap 
 */
const extractCityName = weatherMap => weatherMap.name;

/**
 * Public Interface
 */
module.exports = {
    getTemperatureAndCity
};