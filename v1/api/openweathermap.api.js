const config = require('config');
const request = require('request-promise');
const querystring = require('querystring');
const logger = require('../../log');

const fname = require('path').basename(__filename);

/**
 * Private Variables
 */
let connectionAttempts = 0;
let connectionErrors = 0;
let consecutiveErrors = 0; 

const fetchWeather = ({city, lat, lon}) => new Promise((resolve, reject) => {
    logger.info(`${fname} Fetching city and temperature ${JSON.stringify({city, lat, lon})}`);
    const startTime = new Date();
    const query = querystring.stringify({
        q: city, 
        units: 'metric',
        appid: config.OPENWEATHERMAP_KEY,
        lat, 
        lon
    });

    const opts = {
        uri: `${config.OPENWEATHERMAP_WEATHER_URL}?${query}`,
        json: true,
        timeout: config.OPENWEATHERMAP_TIMEOUT
    }

    logger.debug(`${fname} Request opts ${opts}`);

    connectionAttempts++;
    
    request(opts).then(res => {
        const requestTime = Math.abs(startTime - new Date());
        logger.info(`${fname} Got weather. It tooks ${requestTime}ms`);
        consecutiveErrors = 0;
        resolve(res);
    })
    .catch(err => {
        connectionErrors++;
        consecutiveErrors++;

        reject(err);
    });

});

/**
 * Getter connectionAttempts
 * Protects variable from module clients
 */
const getConnectionAttempts = () => connectionAttempts;

/**
 * Getter connectionErrors
 * Protects variable from module clients
 */
const getConnectionErrors = () => connectionErrors;

/**
 * Getter consecutiveErrors
 * Protects variable from module clients
 */
const getConsecutiveErrors = () => consecutiveErrors;

module.exports = {
    fetchWeather,
    getConnectionAttempts,
    getConnectionErrors,
    getConsecutiveErrors
}