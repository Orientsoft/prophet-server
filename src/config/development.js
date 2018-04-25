module.exports = {
    port: process.env.PS_PORT_DEV || 9527,
    mongoURL: process.env.PS_MONGO_URL_DEV || 'mongodb://127.0.0.1:27017',
    redis: {
        host: process.env.PS_REDIS_HOST_DEV || '127.0.0.1',
        port: process.env.PS_REDIS_PORT_DEV || '6379'
    },
    sessionSecret: process.env.PS_SESSION_SECRET_DEV,
    // The name of the MongoDB collection to store sessions in
    sessionCollection: process.env.PS_SESSION_COL_DEV,
    // The session cookie name
    sessionName: process.env.PS_SESSION_NAME_DEV,
    
    esUrl: process.env.PS_ES_URL_DEV,
    nodeInterpreter: process.env.PS_NODE_INTERPRETER_DEV,
    pythonInterpreter: process.env.PS_PYTHON_INTERPRETER_DEV,
};
