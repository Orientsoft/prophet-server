import mongoose from 'mongoose';
import Promise from 'bluebird';
import { logger } from './logger';
import config from '../config';

mongoose.Promise = Promise;
const { connection } = mongoose;

function connect() {
    return new Promise((resolve, reject) => {
        mongoose.connect(config.mongoURL, (err) => {
            if (err) {
                logger.error('Please make sure Mongodb is installed and running!', err);
                return reject(err);
            }
            resolve();
        });
    });
}

export {
    connect,
    connection
};
