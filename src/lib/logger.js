import morgan from 'morgan';
import winston from 'winston';
import fs from 'fs';
import path from 'path';
import { isProduction, getBaseDir } from './utils';

const LOGS_FOLDER_NAME = 'logs/';

// create logs folder if not existed
if (!fs.existsSync(path.resolve(getBaseDir(), LOGS_FOLDER_NAME))) {
    fs.mkdirSync(path.resolve(getBaseDir(), LOGS_FOLDER_NAME));
}

const debugLogger = new winston.Logger({
    level: 'debug',
    transports: [
        new winston.transports.Console({ level: 'debug' })
    ]
});

const prologger = new winston.Logger({
    level: 'info',
    transports: [
        new winston.transports.File({ filename: path.resolve(getBaseDir(), `${LOGS_FOLDER_NAME}system.log`) })
    ]
});

const accessLogStream = fs.createWriteStream(path.resolve(getBaseDir(), `${LOGS_FOLDER_NAME}access.log`), { flags: 'a' });
const proHttpLogger = morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms', { stream: accessLogStream });

const debugHttpLogger = morgan('dev');

const logger = isProduction() ? prologger : debugLogger;
const httpLogger = isProduction() ? proHttpLogger : debugHttpLogger;

export {
    logger,
    httpLogger
};
