import express from 'express';
import flowRouter from './flows';
import taskRouter from './tasks';
import portRouter from './ports';
import statusRouter from './status';
import dataRouter from './data';
import hostRouter from './hosts';
import alertRouter from './alerts';

const routers = express.Router();

routers.use(flowRouter);
routers.use(taskRouter);
routers.use(portRouter);
routers.use(statusRouter);
routers.use(hostRouter);
routers.use(dataRouter);
routers.use(alertRouter);

// testing route
routers.route('/greeting').get((req, res) => {
    res.status(200).send({
        message: 'Hello, I\'m prophet.'
    });
});

export default routers;
