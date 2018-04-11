import _ from 'lodash';
import Promise from 'bluebird';
import { Task, Port, Trigger } from '../../models';
import * as pmService from '../../services/pm2';
import * as triggerService from '../../services/trigger';
import * as taskService from '../../services/task';
import * as CONSTS from '../../consts';
import { errors } from '../../lib/errors';
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

        let procs = await Promise.map(tasks, async (task) => {
            const proc = await pmService.describe(task.name);

            return {
                task,
                proc
            };
        });

        procs = procs.filter((proc) => {
            if (proc.proc !== undefined && proc.proc != null)
                return true;
            return false;
        });

        const resps = procs.map((proc) => {
            const resp = {
                taskId: proc.task._id,
                status: {
                    uptime: new Date(proc.proc[0].pm2_env.pm_uptime),
                    restart: proc.proc[0].pm2_env.restart_time,
                    status: CONSTS.JOB_STATUS_TYPES[proc.proc[0].pm2_env.status],
                    pid: proc.proc[0].pid
                },
                createdAt: proc.task.createdAt,
                updatedAt: proc.task.updatedAt
            }

            return resp;
        });

        return res.status(200).json(resps);
    } catch (err) {
        logger.error(`TaskCtrl::ps() error`, err);
        return res.status(500).send(err.toString());
    }
}

export async function read(req, res) {
    try {
        const task = req.task;
        const proc = await pmService.describe(task.name);

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
        };

        return res.status(200).json(resp);
    } catch (err) {
        logger.error(`TaskCtrl::read() error`, err);
        return res.status(500).send(err.toString());
    }
}
