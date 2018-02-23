import _ from 'lodash';
import Promise from 'bluebird';
import { Task, Port, Job, Flow } from '../../models';
import { taskStart } from './job.controller';
import * as pmService from '../../services/pm2';
import * as CONSTS from '../../consts';
import errors from '../../lib/errors';
import { logger } from '../../lib/logger';
import { getPageOption, getPageMetadata } from '../../lib/utils';

export function taskById(req, rex, next, id) {
    return Task.findById(id).then((task) => {
        if (task) {
            req.task = task;
            next();
        }

        return res.status(400).send(JSON.stringify(errors.TASK_NOT_FOUND));
    }).catch((err) => {
        logger.error(`TaskCtrl::taskById() error`, err);
        res.status(500).send(err.toString());
    });
}

export function read(req, res) {
    return res.status(200).json(req.task.toJSON());
}

export async function update(req, res) {
    const { task, body } = req;
    const {
        name,
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
            const existedTask = await Task.find({ name });
            if (existedTask !== undefined && existedTask != null) {
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

        const running = task.running;

        // stop old job
        if (running) {
            await pmService.stop(task.name);
        }

        _.assignIn(task, newTask);
        const updatedTask = await task.save();

        // start new job
        if (running) {
            await taskStart(updatedTask);
        }

        return res.status(200).json(updatedTask.toJSON());
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

export function create(req, res) {
    const { name, input, output } = req.body;

    let namePromise = Promise.resolve();
    if (name !== undefined && name != null && name != '') {
        namePromise = Task.find({ name }).then((existedTask) => {
            if (existedTask.length === 0) {
                return Promise.resolve();
            }

            return Promise.reject(new Error(JSON.stringify(errors.TASK_NAME_EXISTED)));
        });
    }

    let inputPromise = Promise.resolve();
    if (input !== undefined && input != null) {
        inputPromise = Port.findById(input).then((inputPort) => {
            if (inputPort) {
                return Promise.resolve();
            }

            return Promise.reject(new Error(JSON.stringify(errors.TASK_INPUT_NOT_FOUND)));
        });
    }

    let outputPromise = Promise.resolve();
    if (output !== undefined && output != null) {
        outputPromise = Port.findById(output).then((outputPort) => {
            if (outputPort) {
                return Promise.resolve();
            }

            return Promise.reject(new Error(JSON.stringify(errors.TASK_OUTPUT_NOT_FOUND)));
        });
    }

    return Promise.join(namePromise, inputPromise, outputPromise).then(() => {
        return Task.create({
            name,
            input,
            output,
            script: req.body.script || '',
            params: req.body.params || [],
            type: req.body.type || CONSTS.TASK_TYPE.NORMAL,
            cron: req.body.cron || '',
            running: false
        });
    }).then((task) => {
        return res.status(200).json(task);
    }).catch((err) => {
        logger.error(`TaskCtrl::create() error`, err);
        return res.status(500).send(err.toString());
    });
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
            .skip(offset);

        const count = await Task.count(query);

        return res.status(200).json({
            _metadata: getPageMetadata(pageOption, count),
            tasks
        });
    } catch (err) {
        logger.error(`TaskCtrl::list() error`, err);
        return res.status(500).send(err.toSTring());
    }
}
