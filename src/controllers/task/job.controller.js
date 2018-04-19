import _ from 'lodash';
import Promise from 'bluebird';
import { Task, Port, Trigger } from '../../models';
import * as pmService from '../../services/pm2';
import * as triggerService from '../../services/trigger';
import * as taskService from '../../services/task';
import * as CONSTS from '../../consts';
import errors from '../../lib/errors';
import { logger } from '../../lib/logger';
import { getPageOption, getPageMetadata } from '../../lib/utils';

export async function jobById(req, res, next, id) {
    try {
        const task = await Task.findById(id);
        if (task) {
            req.task = task;
            return next();
        }

        return res.status(400).send(JSON.stringify(errors.TASK_NOT_FOUND));
    } catch (err) {
        logger.error(`TaskCtrl::jobById() error`, err);
        return res.status(500).send(err.toString());
    }
}

export async function stop(req, res) {
    const { task } = req;

    return taskService.taskStop(task, false).then(() => {
        return res.status(200).end();
    }).catch((err) => {
        logger.error(`TaskCtrl::stop() error`, err);
        
        return res.status(500).send(err.toString());
    });
}

export async function stopAll(req, res) {
    try {
        await Promise.map(req.body.taskId, async (id) => {
            const task = await Task.findById(id);
            if (
                task !== undefined &&
                task != null
            ) {
                await taskService.taskStop(task, false);
            }
    
            return true;
        });

        return res.status(200).end();
    } catch (err) {
        logger.error(`TaskCtrl::stopAll() error`, err);
        
        return res.status(500).send(err.toString());
    }
}

export async function start(req, res) {
    const { taskId } = req.body;

    try {
        const procs = await Promise.mapSeries(taskId, async function(id) {
            const task = await Task.findById(id);
            if (task === undefined || task == null) {
                logger.error(
                    `TaskCtrl::start() error`,
                    new Error(JSON.stringify(errors.TASK_NOT_FOUND)),
                    id
                );

                return Promise.reject(new Error(
                    JSON.stringify(errors.TASK_NOT_FOUND)
                ));
            }

            const proc = await taskService.taskStart(task);
            if (proc.length === 0) {
                return res.status(400).send(
                    JSON.stringify(errors.PROCESS_NOT_FOUND)
                );
            }

            const resp = {
                taskId: task._id,
                status: {
                    uptime: new Date(proc[0].pm2_env.pm_uptime),
                    restart: proc[0].pm2_env.restart_time,
                    status: CONSTS.JOB_STATUS_TYPES[proc[0].pm2_env.status],
                    pid: proc[0].pid
                },
                createdAt: task.createdAt,
                updatedAt: task.updatedAt
            }

            return resp;
        });
    
        return res.status(200).json(procs);
    } catch (err) {
        logger.error(`TaskCtrl::start() error`, err);
        return res.status(500).send(err.toString());
    }
}

export async function ps(req, res) {
    const { name, input, output, type, running } = req.query;
    const query = _.pickBy({ name, input, output, type, running }, _.identity);

    try {
        const tasks = await Task.find(query).sort({ createdAt: -1 });

        const procs = await Promise.map(tasks, async (task) => {
            const proc = await pmService.describe(task.name);

            if (
                proc === undefined ||
                proc == null ||
                proc.length === 0
            ) {
                return {
                    taskId: task._id,
                    status: null,
                    createdAt: task.createdAt,
                    updatedAt: task.updatedAt
                };
            }

            return {
                taskId: task._id,
                status: {
                    uptime: new Date(proc[0].pm2_env.pm_uptime),
                    restart: proc[0].pm2_env.restart_time,
                    status: CONSTS.JOB_STATUS_TYPES[proc[0].pm2_env.status],
                    pid: proc[0].pid
                },
                createdAt: task.createdAt,
                updatedAt: task.updatedAt
            };
        });

        return res.status(200).json(procs);
    } catch (err) {
        logger.error(`TaskCtrl::ps() error`, err);
        return res.status(500).send(err.toString());
    }
}

export async function read(req, res) {
    try {
        const task = req.task;
        const proc = await pmService.describe(task.name);

        if (
            proc === undefined ||
            proc == null ||
            proc.length === 0
        ) {
            return res.status(200).json({
                taskId: task._id,
                status: null,
                createdAt: task.createdAt,
                updatedAt: task.updatedAt
            });
        }

        return res.status(200).json({
            taskId: task._id,
            status: {
                uptime: new Date(proc[0].pm2_env.pm_uptime),
                restart: proc[0].pm2_env.restart_time,
                status: CONSTS.JOB_STATUS_TYPES[proc[0].pm2_env.status],
                pid: proc[0].pid
            },
            createdAt: task.createdAt,
            updatedAt: task.updatedAt
        });
    } catch (err) {
        logger.error(`TaskCtrl::read() error`, err);
        return res.status(500).send(err.toString());
    }
}
