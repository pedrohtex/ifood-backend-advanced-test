const assert = require('chai').assert;
const httpMocks = require('node-mocks-http');
const weatherController = require('../v1/controllers/weather.controller');

describe('Weather Controller Test', () => {
    it('Should get temperature for campinas', (done) => {
        const request = httpMocks.createRequest({
            method: 'GET',
            url: '/v1/playlist',
            query: {
              city: 'Campinas'
            }
        });

        const response = httpMocks.createResponse();

        weatherController.getTemperatureAndCity(request, response, () => {
            assert.equal(request.city, 'Campinas');
            assert.isNumber(request.temperature);
            done();
        });        
    });    
  });