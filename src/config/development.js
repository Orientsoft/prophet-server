module.exports = {
    port: process.env.PS_PORT_DEV,
    mongoURL: process.env.PS_MONGO_URL_DEV,
    redis: {
        host: process.env.PS_REDIS_HOST_DEV,
        port: process.env.PS_REDIS_PORT_DEV
    },
    sessionSecret: process.env.PS_SESSION_SECRET_DEV,
    // The name of the MongoDB collection to store sessions in
    sessionCollection: process.env.PS_SESSION_COL_DEV,
    // The session cookie name
    sessionName: process.env.PS_SESSION_NAME_DEV,
};
