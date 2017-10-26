const logger = require('../../log');
const validator = require('validator');
const ERRORS = require('../../errors');

const fname = require('path').basename(__filename);

/**
 * Encapsulates all request validations
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const validateRequest = (req, res, next) => {
    logger.info(`${fname} querystring ${JSON.stringify(req.query)}` )
    
    const {lat, lon, city } = req.query;
    const cityWithoutSpaces = removeSpaces(city);

    if (!city && (!lat || !lon)) {
        logger.error('request.validator Invalid Request');

        const err = new Error(ERRORS.INVALID_REQUEST.message);
        err.code = ERRORS.INVALID_REQUEST.code;
        err.name = ERRORS.INVALID_REQUEST.name;
        return next(err);
    }

    if(city && !validator.isAlpha(cityWithoutSpaces)) {
        logger.error(`${fname} Invalid city value`);

        const err = new Error(ERRORS.INVALID_REQUEST.message);
        err.code = ERRORS.INVALID_REQUEST.code;
        err.name = ERRORS.INVALID_REQUEST.name;
        return next(err);
    }

    if(lat && lon && (!validator.isFloat(lat) || !validator.isFloat(lon))) {
        logger.error(`${fname} Invalid geolocation value`);
        
        const err = new Error(ERRORS.INVALID_REQUEST.message);
        err.code = ERRORS.INVALID_REQUEST.code;
        err.name = ERRORS.INVALID_REQUEST.name;
        return next(err);
    }
        
    logger.info(`${fname} Request is valid`);
    next();
};

/**
 * Utility method to remove spaces from a String
 * @param {*} str 
 */
const removeSpaces = (str='') => str.replace(' ', '');

module.exports = {
    validateRequest
};