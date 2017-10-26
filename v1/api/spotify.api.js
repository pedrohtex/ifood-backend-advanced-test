const request = require('request-promise');
const querystring = require('querystring');
const config = require('config');
const moment = require('moment');
const logger = require('../../log');

const fname = require('path').basename(__filename);

/**
 * Private Variables
 */
let header = '';
let tokenExpirationDate = moment();
let authorizationAttempts = 0;
let consecutiveAuthErrors = 0; 
let requestErrors = 0;

/**
 * Do Spotify 'Client Credential' login flow
 * and save the token and expiration date for further requests
 */
const doAuthentication = () => new Promise((resolve, reject) => {
    logger.info(`${fname} Requesting Authorization`);

    const basicAuth = Buffer.from(`${config.SPOTIFY_CLIENT_ID}:${config.SPOTIFY_CLIENT_SECRET}`).toString('base64');
    const postHeader = {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    const data = querystring.stringify({ grant_type: "client_credentials" });
    const opts = {
        method: 'POST',
        body: data,
        json: true,
        headers: postHeader,
        uri: config.SPOTIFY_AUTH_URL,
        timeout: config.SPOTIFY_TIMEOUT
    };

    logger.debug(`${fname} Request opts ${opts}`);
    authorizationAttempts++;
    
    request(opts)
    .then(res => {
        const { access_token, token_type, expires_in } = res;
        tokenExpirationDate = moment().add(expires_in, 'seconds');
        header = { 'Authorization': `${token_type} ${access_token}` };

        logger.info(`${fname} Authorization success, saving token. Token expires at ${tokenExpirationDate.format('LLLL')}`);
        
        consecutiveAuthErrors = 0;
        resolve(header);
    })
    .catch(err => {
        logger.error(`${fname} Authorization error. ${err}`);
        
        requestErrors++;
        consecutiveAuthErrors++;
        reject(err);
    });

});

/**
 * Utility method to check if token is still valid;
 * If token is valid return formatted header for further Spotify API Requests
 * Otherwise renew token and return formatted header
 */
const getAuthHeader = () => new Promise((resolve, reject) => {

    if(tokenExpirationDate && tokenExpirationDate.isBefore(new Date())) {
        logger.info(`${fname} Token expired. Going to renew it.`);
        doAuthentication().then(resolve).catch(reject);
    } else {
        resolve(header);
    }

});

/**
 * Encapsulates Spotify Fetch Playlist service call
 * @param {*} category of the playlist
 */
const fetchPlaylists = category => new Promise((resolve, reject) => {
    logger.info(`${fname} Fetching ${category} Playlist`);
    getAuthHeader()
    .then(header => {
        const opts = {
            headers: header,
            uri: getPlaylistUrl(category),
            json: true,
            timeout: config.SPOTIFY_TIMEOUT
        };

        logger.debug(`${fname} fetchPlaylist request opts ${opts}`);
        
        return request(opts);
    })
    .then(extractPlaylists)
    .then(resolve)
    .catch(err => {
        logger.error(`${fname} Error fetching playlist ${err}`);
        requestErrors++;
        reject(err);
    });
});

/**
 * Encapsulates Spotify Fetch Tracks from a playlist service call
 * @param {*} playlist 
 */
const fetchPlaylistTracks = playlist => new Promise((resolve, reject) => {
    logger.info(`${fname} Fetching track list`);

    getAuthHeader()
    .then(header => {
        const {tracks} = playlist;
        const opts = {
            headers: header,
            uri: tracks.href,
            json: true,
            timeout: config.SPOTIFY_TIMEOUT
        };

        logger.debug(`${fname} fetchPlaylistTracks request opts ${opts}`);
        return request(opts);        
    })
    .then(extractTrackNames)
    .then(resolve)
    .catch(err => {
        logger.error(`${fname} Error fetching playlist tracks ${err}`);
        requestErrors++;
        reject(err);
    });
});

/**
 * Utility method to, given a category, generate URL to fetch playlists
 * @param {*} category 
 */
const getPlaylistUrl = category => config.SPOTIFY_TRACKLIST_URL.replace('$1', category);

/**
 * Getter connectionAttempts
 * Protects variable from module clients
 */
const getConnectionAttempts = () => authorizationAttempts;

/**
 * Getter connectionErrors
 * Protects variable from module clients
 */
const getConnectionErrors = () => requestErrors;

/**
 * Getter consecutiveErrors
 * Protects variable from module clients
 */
const getConsecutiveErrors = () => consecutiveAuthErrors;

/**
 * Utility method to extract all playlists from Spotify API response
 * @param {*} spotifyPlaylists 
 */
const extractPlaylists = spotifyPlaylists => 
    spotifyPlaylists.playlists.items;

/**
 * Utility method to extract Author and Track names from Spotify API Track 
 * @param {*} tracks 
 * @returns {Array} of Author - Track name
 */
const extractTrackNames = tracks => 
    tracks.items.map(e => `${e.track.artists[0].name} - ${e.track.name}`);

/**
 * Public interface
 */
module.exports = {
    getAuthHeader,
    getConnectionAttempts,
    getConnectionErrors,
    getConsecutiveErrors,
    fetchPlaylists,
    fetchPlaylistTracks
};