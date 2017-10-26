const assert = require('chai').assert;
const spotifyApi = require('../v1/api/spotify.api');

describe('Spotify API Test', function () {
    this.timeout(4000);
    
    it('Should get Authorization Header with generated Token', (done) => {
        
        spotifyApi.getAuthHeader().then(header => {
            assert.isObject(header);
            assert.property(header, 'Authorization');
            assert.isString(header.Authorization);
            done();
        });
    });

    it('Should get Playlists for a category', (done) => {
        spotifyApi.fetchPlaylists('party')
        .then(playlists => {
            assert.isArray(playlists);
            assert.isAtLeast(playlists.length, 1);
            done();
        });
    });

    it('Should get tracks for Playlist', (done) => {
        spotifyApi.fetchPlaylists('party')
        .then(playlists => playlists[Math.floor(Math.random()*playlists.length)])
        .then(spotifyApi.fetchPlaylistTracks)
        .then(tracks => {
            assert.isArray(tracks);
            assert.isAtLeast(tracks.length, 1);
            assert.isString(tracks[0]);
            done();
        });
    });

  });