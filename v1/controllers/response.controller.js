const logger = require('../../log');

const fname = require('path').basename(__filename);

/**
 * Encapsulate all success responses to this server services
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const sendResponse = (req, res, next) => {
    const response = {
        city: {
            name: req.city,
            temperature: req.temperature
        },
        playlist: {
            category: req.category,
            tracks: req.tracks
        }
    };

    const time = Math.abs(req.arrivalTime - new Date());
    logger.info(`${fname} Sending response ${JSON.stringify(response)}`);
    logger.info(`${fname} Request took ${time} ms`);
    
    res.set({
        'content-type': 'application/json'
    });
    res.status(200).send(response);
};

/**
 * Default errorHandler. Encapsulate all error messages to be returned to client
 * @param {*} err 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const errorHandler = (err, req, res, next) => {
    res.status(err.code).send(`${err.message}`);
}

/**
 * Public Interface
 */
module.exports = {
    sendResponse,
    errorHandler
}