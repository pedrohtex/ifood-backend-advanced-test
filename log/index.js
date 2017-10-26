const winston = require('winston');

const logger = new winston.Logger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ 
            name: 'info-log',
            filename: './log/info.log',
            level: 'info'
        }),
        new winston.transports.File({
            name: 'error-log',
            filename: './log/error.log',
            level: 'error'
        })
    ]
});

module.exports = logger;