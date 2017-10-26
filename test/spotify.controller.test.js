const assert = require('chai').assert;
const httpMocks = require('node-mocks-http');
const spotifyController = require('../v1/controllers/spotify.controller');

describe('Spotify Controller Test', function () {
    this.timeout(4000); //authorization and data fetching
    
    it('Should get Playlist tracks for category', (done) => {
        
        const request = httpMocks.createRequest({
            method: 'GET',
            url: '/v1/playlist',
            query: {
              city: 'Campinas'
            },
            category: 'party'
        });

        const response = httpMocks.createResponse();

        spotifyController.fetchCategoryPlaylist(request, response, () => {
            assert.isArray(request.tracks);
            done();
        });        
    });
  });