const logger = require('../../log');

const fname = require('path').basename(__filename);

const constants = {
    CATEGORY_ROCK: 'rock',
    CATEGORY_PARTY: 'party',
    CATEGORY_POP: 'pop',
    CATEGORY_CLASSICAL: 'classical',

    HOT: 30,
    COOL: 15,
    COLD: 10
};

/**
 * Middleware to encapsulate business logic to choose appropriate playlist category 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const categoryDecider = (req, res, next) => {
    const {temperature} = req;
    let category;
    
    if (temperature >= constants.HOT) {
        category = constants.CATEGORY_PARTY;
    } else if (temperature >= constants.COOL) {
        category = constants.CATEGORY_POP;
    } else if (temperature >= constants.COLD) {
        category = constants.CATEGORY_ROCK;
    } else {
        category = constants.CATEGORY_CLASSICAL;
    }

    logger.info(`${fname} Playlist category decided: ${category}`);
    
    req.category = category;
    next();
};

module.exports = {
    categoryDecider,
    constants
};