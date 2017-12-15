module.exports = {
    port: process.env.TW_PORT_DEV,
    mongoURL: process.env.TW_MONGO_URL_DEV,
    redis: {
        host: process.env.TW_REDIS_HOST_DEV,
        port: process.env.TW_REDIS_PORT_DEV
    },
    sessionSecret: process.env.TW_SESSION_SECRET_DEV,
    // The name of the MongoDB collection to store sessions in
    sessionCollection: process.env.TW_SESSION_COL_DEV,
    // The session cookie name
    sessionName: process.env.TW_SESSION_NAME_DEV,
};
