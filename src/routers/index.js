import express from 'express';
import flowRouter from './flows';
import taskRouter from './tasks';
import portRouter from './ports';
import statusRouter from './status';
import dataRouter from './data';

const routers = express.Router();

routers.use(flowRouter);
routers.use(taskRouter);
routers.use(portRouter);
routers.use(statusRouter);
routers.use(dataRouter);

// testing route
routers.route('/greeting').get((req, res) => {
    res.status(200).send({
        message: 'Welcome to ThisWorld'
    });
});

export default routers;
