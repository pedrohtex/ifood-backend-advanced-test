const assert = require('chai').assert;
const httpMocks = require('node-mocks-http');
const playlistController = require('../v1/controllers/playlist.controller');

describe('Playlist Controller Test', () => {
    it('Should get category Party for HOT weather', () => {
        const request = httpMocks.createRequest({
            temperature: 30
        });

        const response = httpMocks.createResponse();

        playlistController.categoryDecider(request, response, () => {
            assert.equal(request.category, playlistController.constants.CATEGORY_PARTY);
        });        
    });

    it('Should get category POP for COOL weather', () => {
        const request = httpMocks.createRequest({
            temperature: 20
        });

        const response = httpMocks.createResponse();

        playlistController.categoryDecider(request, response, () => {
            assert.equal(request.category, playlistController.constants.CATEGORY_POP);
        });        
    });
    
    it('Should get category ROCK for COLD weather', () => {
        const request = httpMocks.createRequest({
            temperature: 10
        });

        const response = httpMocks.createResponse();

        playlistController.categoryDecider(request, response, () => {
            assert.equal(request.category, playlistController.constants.CATEGORY_ROCK);
        });        
    });

    it('Should get category Classical for FREEZING weather', () => {
        const request = httpMocks.createRequest({
            temperature: 0
        });

        const response = httpMocks.createResponse();

        playlistController.categoryDecider(request, response, () => {
            assert.equal(request.category, playlistController.constants.CATEGORY_CLASSICAL);
        });        
    });
  });