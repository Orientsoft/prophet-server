import _ from 'lodash';
import Promise from 'bluebird';
import { Flow, Task } from '../../models';
import * as pmService from '../../services/pm2';
import * as CONSTS from '../../consts';
import errors from '../../lib/errors';
import { logger } from '../../lib/logger';
import { getPageOption, getPageMetadata } from '../../lib/utils';
import { embedTaskPorts } from '../task/task.controller';

async function embedFlowTasks(flow) {
    const plainFlow = flow.toJSON();

    plainFlow.tasks = await Promise.map(flow.tasks, async (taskId) => {
        const task = await Task.findById(taskId);
        const embededTask = await embedTaskPorts(task);

        return embededTask;
    });

    return plainFlow;
}

export async function flowById(req, res, next, id) {
    try {
        const flow = await Flow.findById(id);
        if (flow) {
            req.flow = flow;

            return next();
        }

        return res.status(400).send(JSON.stringify(errors.FLOW_NOT_FOUND));
    } catch (err) {
        logger.error(`FlowCtrl::flowById() error`, err);

        res.status(500).send(err.toString());
    }
}

export async function read(req, res) {
    try {
        // embed tasks
        const embededFlow = await embedFlowTasks(req.flow);

        return res.status(200).json(embededFlow);
    } catch (err) {
        return res.status(500).send(err.toString());
    }
}

export async function update(req, res) {
    const { flow, body } = req;
    const { name, tasks } = body;
    const query = _.pickBy({ name, tasks }, _.identity);

    try {
        if (name !== flow.name) {
            const existedFlow = await Flow.findOne({ name });
            if (
                existedFlow !== undefined &&
                existedFlow != null &&
                existedFlow._id.toString() !== req.flow._id.toString()
            ) {
                return res.status(400).send(JSON.stringify(errors.FLOW_NAME_EXISTED));
            }
        }

        flow.set(query);
        const updatedFlow = await flow.save();
        return res.status(200).json(updatedFlow.toJSON());
    }
    catch(err) {
        logger.error(`FlowCtrl::update() error`, err);
        return res.status(500).send(err.toString());
    }
}

export async function remove(req, res) {
    return req.flow.remove().then(() => {
        return res.status(200).end();
    }).catch((err) => {
        logger.error(`FlowCtrl::remove() error`, err);
        return res.status(500).send(err.toString());
    });
}

export function create(req, res) {
    return Flow.find({
        name: req.body.name
    }).then((existedFlow) => {
        if (existedFlow.length === 0) {
            return Flow.create({
                name: req.body.name,
                tasks: req.body.tasks || []
            });
        }

        return Promise.reject(JSON.stringify(errors.FLOW_NAME_EXISTED));
    })
    .then((flow) => {
        return res.status(200).json(flow);
    }).catch((err) => {
        logger.error(`FlowCtrl::create() error`, err);
        return res.status(500).send(err.toString());
    });
}

export async function list(req, res) {
    const pageOption = getPageOption(req);
    const { offset, limit } = pageOption;

    const { name } = req.query;
    const query = _.pickBy({ name }, _.identity);

    // TODO : check param

    try {
        const flows = await Flow.find(query)
            .sort({ ts: -1 })
            .limit(limit)
            .skip(offset);
        
        // embed tasks
        const embededFlows = await Promise.map(flows, async (flow) => {
            const embedFlow = await embedFlowTasks(flow);

            return embedFlow;
        });

        const count = await Flow.count(query);

        return res.status(200).json({
            _metadata: getPageMetadata(pageOption, count),
            flows: embededFlows
        });
    } catch (err) {
        logger.error(`FlowCtrl::list() error`, err);
        return res.status(500).send(err.toString());
    }
}

export async function ps(req, res) {
    const { tasks } = req.flow;

    try {
        const procs = await Promise.map(tasks, async (id) => {
            const task = await Task.findById(id);
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
        logger.error(`FlowCtrl::ps() error`, err);

        return res.status(500).send(err.toString());
    }
}
