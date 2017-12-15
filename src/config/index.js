import _ from 'lodash';

const baseConfig = {
    app: {
        title: 'prophet-server',
        description: 'AI Control Flow Backend',
        keywords: 'mongodb, express, node.js, mongoose, passport',
    },
    apiVersion: 'v1.0',
    sessionCookie: {
        path: '/',
        httpOnly: true,
        secure: false,
        maxAge: 1800000, // 10 mins
    }
};

// eslint-disable-next-line global-require
const envConfig = require(`./${process.env.NODE_ENV || 'development'}.js`) || {};

export default _.merge(
    baseConfig,
    envConfig
);
