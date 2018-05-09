import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import * as triggerService from './services/trigger';
import { startFeeding } from './services/watchdog';
import * as mongoose from './lib/mongoose';
// import * as redis from './lib/redis';
import { httpLogger } from './lib/logger';
// import ssr from './lib/ssr';
import routers from './routers';
import config from './config';

const app = express();
const RedisStore = require('connect-redis')(session);

// watchdog
startFeeding();

// post-trigger watcher
// triggerService.startWatchdog();

// MongoDB Connection
mongoose.connect();

// Redis Connection
// redis.connect();

// Express MongoDB session storage
/*
app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: config.sessionSecret,
    store: new RedisStore({
        client: redis.connection,
    }),
    cookie: config.sessionCookie,
    name: config.sessionName,
}));
*/

// mount passport middleware
// passportRegister(app);

app.use(httpLogger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(`/api/${config.apiVersion}`, routers);

// app.use(/^\/(?!static).*/, ssr);

// Serve static assets
app.use(express.static(path.resolve(__dirname, 'public')));

// catch 404 and forward to error handler
// app.use((req, res, next) => {
//     const err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

// // error handler
// app.use((err, req, res, next) => {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
//     res.locals.url = req.originalUrl;

//     res.status(err.status || 500).end();
// });

module.exports = app;
