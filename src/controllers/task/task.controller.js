import _ from 'lodash';
import Promise from 'bluebird';
import { Task, Port, Job, Flow, Trigger } from '../../models';
import * as taskService from '../../services/task';
import * as pmService from '../../services/pm2';
import * as CONSTS from '../../consts';
import errors from '../../lib/errors';
import { logger } from '../../lib/logger';
import { getPageOption, getPageMetadata } from '../../lib/utils';

export async function embedTaskPorts(task) {
    const plainTask = task.toJSON();
    plainTask.input = await Port.findById(task.input);
    plainTask.output = await Port.findById(task.output);

    return plainTask;
}

export function taskById(req, res, next, id) {
    return Task.findById(id).then((task) => {
        if (task) {
            req.task = task;
            return next();
        }

        return res.status(400).send(JSON.stringify(errors.TASK_NOT_FOUND));
    }).catch((err) => {
        logger.error(`TaskCtrl::taskById() error`, err);
        return res.status(500).send(err.toString());
    });
}

export async function read(req, res) {
    try {
        // embed ports
        const plainTask = await embedTaskPorts(req.task);

        return res.status(200).json(plainTask);
    } catch (err) {
        return res.status(500).send(err.toString());
    }
}

export async function update(req, res) {
    const { task, body } = req;
    const {
        name,
        metric,
        description,
        input,
        output,
        script,
        params,
        type,
        cron,
        running
    } = body;
    const newTask = _.pickBy({
        name,
        metric,
        description,
        input,
        output,
        script,
        params,
        type,
        cron,
        running
    }, _.identity);

    try {
        if (name !== undefined && name != null && name != '') {
            const existedTask = await Task.findOne({ name });
            if (
                existedTask !== undefined &&
                existedTask != null &&
                existedTask._id.toString() !== req.task._id.toString()
            ) {
                return res.status(400).send(JSON.stringify(errors.TASK_NAME_EXISTED));
            }
        }

        if (input !== undefined && input != null) {
            const inputPort = await Port.findById(input);
            if (inputPort === undefined && inputPort == null) {
                return res.status(400).send(JSON.stringify(errors.TASK_INPUT_NOT_FOUND));
            }
        }

        if (output !== undefined && output != null) {
            const outputPort = await Port.findById(output);
            if (outputPort === undefined && outputPort == null) {
                return res.status(400).send(JSON.stringify(errors.TASK_OUTPUT_NOT_FOUND));
            }
        }

        _.assignIn(task, newTask);
        const updatedTask = await task.save();

        const running = task.running;

        try {
            // stop old job
            if (running) {
                await pmService.stop(task.name);
            }

            // start new job
            if (running) {
                await taskService.taskStart(updatedTask);
            }
        } catch (err) {
            logger.error('TaskCtrl:update() restart job error', err.stack);
        } finally {
            return res.status(200).json(updatedTask.toJSON());
        }
    } catch (err) {
        logger.error(`TaskCtrl::update() error`, err);
        return res.status(500).send(err.toString());
    }
}

export async function remove(req, res) {
    const { task } = req;

    try {
        // check if this task is in flow
        const flows = await Flow.find({ tasks: task._id });
        if (flows.length > 0) {
            return res.status(400)
                .send(JSON.stringify(errors.TASK_IN_FLOW));
        }

        // remove attached trigger(s)
        await Trigger.remove({ task: task._id });

        // stop job
        if (task.running) {
            pmService.stop(task.name);
        }

        await task.remove();

        return res.status(200).end();
    } catch (err) {
        logger.error(`TaskCtrl::remove() error`, err);
        return res.status(500).send(err.toString());
    }
}

export async function create(req, res) {
    const { name, input, output } = req.body;

    try {
        if (name !== undefined && name != null && name != '') {
            const existedTask = await Task.findOne({ name });
            if (existedTask) {
                return res.status(400)
                    .send(JSON.stringify(errors.TASK_NAME_EXISTED));
            }
        }

        if (input !== undefined && input != null) {
            const inputPort = await Port.findById(input);
            if (!inputPort) {
                return res.status(400)
                    .send(JSON.stringify(errors.TASK_INPUT_NOT_FOUND));
            }
        }

        if (output !== undefined && output != null) {
            const outputPort = await Port.findById(output);
            if (!outputPort) {
                return res.status(400)
                    .send(JSON.stringify(errors.TASK_OUTPUT_NOT_FOUND));
            }
        }

        const task = await Task.create({
            name,
            metric: req.body.metric || '',
            description: req.body.description || '',
            input,
            output,
            script: req.body.script || '',
            params: req.body.params || [],
            type: req.body.type || CONSTS.TASK_TYPES.NORMAL,
            cron: req.body.cron || '',
            running: false
        });

        return res.status(200).json(task.toJSON());
    } catch (err) {
        logger.error(`TaskCtrl::create() error`, err);
        return res.status(500).send(err.toString());
    }
}

export async function list(req, res) {
    const pageOption = getPageOption(req);
    const { offset, limit } = pageOption;

    const { name, input, output, type, running } = req.query;
    const query = _.pickBy({ name, input, output, type, running }, _.identity);

    // TODO : check param

    try {
        const tasks = await Task.find(query)
            .sort({ ts: -1 })
            .limit(limit)
            .skip(offset)

        // embed ports
        const embededTasks = await Promise.mapSeries(tasks, (task) => {
            return embedTaskPorts(task);
        });

        const count = await Task.count(query);
        
        return res.status(200).json({
            _metadata: getPageMetadata(pageOption, count),
            tasks: embededTasks
        });
    } catch (err) {
        logger.error(`TaskCtrl::list() error`, err);
        return res.status(500).send(err.toString());
    }
}
