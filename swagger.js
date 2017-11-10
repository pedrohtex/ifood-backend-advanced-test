const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
    info: {
        title: 'ifood-backend-advanced-test',
        version: '1.0.0',
        description: 'This is a service for ifood-backend-advanced-test.'
    },
    host: 'localhost:3000',
    basePath: '/v1'
};

var swaggerOpt = {
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: ['./v1/routes.js']
};

// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(swaggerOpt);

module.exports = swaggerSpec;