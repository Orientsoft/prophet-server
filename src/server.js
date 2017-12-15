import http from 'http';

// load environment variables from dotenv file
import {} from 'dotenv/config';
import config from './config';
import { logger } from './lib/logger';

/**
 * Module dependencies.
 */
const app = require('./app');
const debug = require('debug')('mern:server');

/**
 * Get port from environment and store in Express.
 */

app.set('port', config.port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(config.port, () => {
    logger.info('Express server listening on %d, in %s mode', config.port, app.get('env'));
});
server.on('error', onError);
server.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof config.port === 'string'
        ? `Pipe ${config.port}`
        : `Port ${config.port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
    case 'EACCES':
        logger.error(`${bind} requires elevated privileges`);
        process.exit(1);
    case 'EADDRINUSE':
        logger.error(`${bind} is already in use`);
        process.exit(1);
    default:
        throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? `pipe ${addr}`
        : `port ${addr.port}`;
    debug(`Listening on ${bind}`);
}
