import Promise from 'bluebird';
import { Task, Port, Trigger } from '../../models';
import * as pmService from '../../services/pm2';
import * as triggerService from '../../services/trigger';
import * as taskService from '../../services/task';
import * as CONSTS from '../../consts';
import { errors } from '../../lib/errors';
import { logger } from '../../lib/logger';
import { getPageOption, getPageMetadata } from '../../lib/utils';

export function jobById(req, res, next, id) {
    Task.findById(id).then((task) => {
        if (task) {
            req.task = task;
            return next();
        }

        return res.status(400).send(JSON.stringify(errors.TASK_NOT_FOUND));
    }).catch((err) => {
        logger.error(`TaskCtrl::jobById() error`, err);
        return res.status(500).send(err.toString());
    });
}

export function stop(req, res) {
    const { task } = req;

    return pmService.stop(task.name).then(() => {
        task.set({ running: false });
        task.save();

        return res.status(200).end();
    }).catch((err) => {
        logger.error(`TaskCtrl::stop() error`, err);
        return res.status(500).send(err.toString());
    });
}

export async function start(req, res) {
    const { taskId } = req;

    try {
        const procs = await Promise.mapSeries(taskId, async function(id) {
            const task = Task.findById(id);
            if (task === undefined || task == null) {
                logger.error(
                    `TaskCtrl::start() error`,
                    new Error(JSON.stringify(errors.TASK_NOT_FOUND)),
                    id
                );
                return Promise.reject(new Error(
                    JSON.stringify(errors.TASK_NOT_FOUND
                )));
            }

            return await taskService.taskStart(task);
        });
    
        return res.status(200).json(procs);
    } catch (err) {
        logger.error(`TaskCtrl::start() error`, err);
        return res.status(500).send(err.toString());
    }
}

export function ps(req, res) {
    const { name, input, output, type, running } = req.query;

    return Task.find({
        name,
        input,
        output,
        type,
        running
    })
    .sort({ ts: -1 })
    .then((tasks) => {
        return Promise.map(tasks, (task) => {
            return pmService.describe(task.name);
        });
    }).then((procs) => {
        procs = procs.filter((proc) => {
            if (proc !== undefined && proc != null)
                return true;
            return false;
        });

        return res.status(200).json(procs);
    })
    .catch((err) => {
        logger.error(`TaskCtrl::ps() error`, err);
        return res.status(500).send(err.toSTring());
    });
}
