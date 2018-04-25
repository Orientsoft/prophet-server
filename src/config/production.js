module.exports = {
    port: process.env.PS_PORT,
    mongoURL: process.env.PS_MONGO_URL,
    redis: {
        host: process.env.PS_REDIS_HOST,
        port: process.env.PS_REDIS_PORT
    },
    sessionSecret: process.env.PS_SESSION_SECRET,
    // The name of the MongoDB collection to store sessions in
    sessionCollection: process.env.PS_SESSION_COL,
    // The session cookie name
    sessionName: process.env.PS_SESSION_NAME,

    esUrl: process.env.PS_ES_URL,
    nodeInterpreter: process.env.PS_NODE_INTERPRETER,
    pythonInterpreter: process.env.PS_PYTHON_INTERPRETER,
};
