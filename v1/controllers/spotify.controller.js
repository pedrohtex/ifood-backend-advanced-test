const request = require('request-promise');
const querystring = require('querystring');
const config = require('config');
const spotifyApi = require('../api/spotify.api');
const logger = require('../../log');
const ERRORS = require('../../errors');

const fname = require('path').basename(__filename);

/**
 * Utility method to chose a single playlist from an array of playlists
 * @param {*} playlists 
 * @returns {*} playlist from playlists
 */
const choosePlaylistAtRandom = playlists => 
    playlists[Math.floor(Math.random()*playlists.length)];

/**
 * Middleware to delegate Spotify API calls to fetch playlist and track list
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const fetchCategoryPlaylist = (req, res, next) => {
    const {category} = req;
    const startTime = new Date();
    logger.info(`${fname} Requesting ${category} playlist`);

    spotifyApi.fetchPlaylists(category)
    .then(choosePlaylistAtRandom)
    .then(spotifyApi.fetchPlaylistTracks)
    .then(tracks => {
        const requestTime = Math.abs(startTime - new Date());
        logger.info(`${fname} Got playlist with ${tracks.length} tracks. It tooks ${requestTime}ms`);
        req.tracks = tracks;
        next();
    })
    .catch(err => {
        logger.error(`${fname} Error fetching playlist ${err}`);
        
        const error = new Error(ERRORS.INTERNAL_ERROR.message);
        error.code = ERRORS.INTERNAL_ERROR.code;
        error.name = ERRORS.INTERNAL_ERROR.name;            
        next(error);
    });
}

/**
 * Public interface
 */
module.exports = {
    fetchCategoryPlaylist
};