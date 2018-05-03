import express from 'express';
import flowRouter from './flows';
import taskRouter from './tasks';
import portRouter from './ports';
import triggerRouter from './trigger';
import statusRouter from './status';
import dataRouter from './data';
import userRouter from './user';
import settingsRouter from './settings';
import structuresRouter from './structures';
import hostRouter from './hosts';
import alertRouter from './alerts';
import logRouter from './logs';

const routers = express.Router();

routers.use(flowRouter);
routers.use(taskRouter);
routers.use(portRouter);
routers.use(triggerRouter);
routers.use(statusRouter);
routers.use(hostRouter);
routers.use(dataRouter);
routers.use(alertRouter);
routers.use(userRouter);
routers.use(settingsRouter);
routers.use(structuresRouter);
routers.use(logRouter);

// testing route
routers.route('/greeting').get((req, res) => {
    res.status(200).send({
        message: 'Hello, I\'m prophet.'
    });
});

export default routers;
