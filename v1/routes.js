const express = require('express');
const requestValidator = require('./validators/request.validator');
const responseController = require('./controllers/response.controller');
const weatherController = require('./controllers/weather.controller');
const playlistController = require('./controllers/playlist.controller');
const spotifyController = require('./controllers/spotify.controller');
const healthController = require('./controllers/health.controller');

const router = express.Router();

/**
 * Save request time to get KPI
 */
router.use((req, res, next) => {
    req.arrivalTime = new Date();
    next();
});

/**
 * Swagger file route
 */
router.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(require('../swagger'));
});

/**
 * @swagger
 * definitions:
 *   APIResponse:
 *     type: object
 *     properties:
 *       city:
 *         type: object
 *         properties:
 *           name:
 *             type: string
 *             description: City's name
 *           temperature:
 *             type: string
 *             description: City's temperature
 *       playlist:
 *         type: object
 *         properties:
 *           category:
 *             type: string
 *             description: Playlist's category
 *           tracks:
 *             type: array
 *             items:
 *               type: string
 *               description: Track author and name
 */
/**
 * @swagger
 * /playlist:
 *   get:
 *     tags:
 *       - playlist
 *     summary: Find playlist by city or geolocation
 *     operationId: getPlaylist
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: city
 *         description: City value to look for playlist
 *         in: query
 *         required: false
 *         type: string
 *       - name: lat
 *         description: Latitute value to look for playlist
 *         in: query
 *         required: false
 *         type: float
 *       - name: lon
 *         description: Longitude value to look for playlist
 *         in: query
 *         required: false
 *         type: float
 *     responses:
 *       200:
 *         description: Generated playlist
 *         schema:
 *           $ref: "#/definitions/APIResponse"
 *       400:
 *         description: Invalid Request
 *       500:
 *         description: Internal Server Error
 */
router.get('/playlist', 
    requestValidator.validateRequest, weatherController.getTemperatureAndCity, 
    playlistController.categoryDecider, spotifyController.fetchCategoryPlaylist,
    responseController.sendResponse);

/**
 * Route /health middleware
 */
router.get('/health', healthController.getServiceHealth);

/**
 * Default Error Handler
 */
router.use(responseController.errorHandler);

module.exports = router;