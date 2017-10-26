const express = require('express');
const config = require('config');
const morgan = require('morgan');
const logger = require('./log');

logger.info('Initializing...');

const app = express();

app.use(new morgan('short'));
app.use('/v1', require('./v1/routes'));

app.use(express.static('public'))

app.listen(config.port);
logger.info(`server listening on port ${config.port}`);