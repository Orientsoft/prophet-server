module.exports = {
    port: process.env.TW_PORT,
    mongoURL: process.env.TW_MONGO_URL,
    redis: {
        host: process.env.TW_REDIS_HOST,
        port: process.env.TW_REDIS_PORT
    },
    sessionSecret: process.env.TW_SESSION_SECRET,
    // The name of the MongoDB collection to store sessions in
    sessionCollection: process.env.TW_SESSION_COL,
    // The session cookie name
    sessionName: process.env.TW_SESSION_NAME,
};
