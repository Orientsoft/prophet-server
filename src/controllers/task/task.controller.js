import _ from 'lodash';
import Promise from 'bluebird';
import { Task, Port } from '../../models';
import * as CONSTS from '../../consts';
import errors from '../../lib/errors';
import { logger } from '../../lib/logger';
import { getPageOption, getPageMetadata } from '../../lib/utils';

export function taskById(req, rex, next, id) {
    return Task.findById(id).then((task) => {
        if (task) {
            req.task = task;
            next();
        } else {
            return res.status(400).send(JSON.stringify(errors.TASK_NOT_FOUND));
        }
    }).catch((err) => {
        logger.error(`TaskCtrl::taskById() error`, err);
        res.status(500).send(err.toString());
    });
}

export function read(req, res) {
    return res.status(200).json(req.task.toJSON());
}

// front-end should check if there's job instanced from
// this task before updating or deleting

export function update(req, res) {
    const { task, body } = req;
    const { name, input, output, script, params, type, cron, running } = body;

    let namePromise = Promise.resolve();
    if (name !== undefined && name != null && name != '') {
        namePromise = Task.find({ name }).then((existedTask) => {
            if (!existedTask) {
                task.set({ name });
                return Promise.resolve();
            }

            return Promise.reject(new Error(JSON.stringify(TASK_NAME_EXISTED)));
        });
    }

    let inputPromise = Promise.resolve();
    if (input !== undefined && input != null) {
        inputPromise = Port.findById(input).then((inputPort) => {
            if (inputPort) {
                task.set({ input })
                return Promise.resolve();
            }

            return Promise.reject(new Error(JSON.stringify(errors.TASK_INPUT_NOT_FOUND)));
        });
    }

    let outputPromise = Promise.resolve();
    if (output !== undefined && output != null) {
        outputPromise = Port.findById(output).then((outputPort) => {
            if (outputPort) {
                task.set({ output })
                return Promise.resolve();
            }

            return Promise.reject(new Error(JSON.stringify(errors.TASK_OUTPUT_NOT_FOUND)));
        });
    }

    if (script !== undefined && script != null) {
        task.set({ script });
    }

    if (params !== undefined && params != null) {
        task.set({ params });
    }

    if (type !== undefined && type != null) {
        task.set({ type });
    }

    if (cron !== undefined && cron != null) {
        task.set({ cron });
    }

    if (running !== undefined && running !=null) {
        task.set({ running });
    }

    return Promise.join(namePromise, inputPromise, outputPromise).then(() => {
        return task.save();
    }).then((updatedTask) => {
        return res.status(200).json(updatedTask.toJSON());
    }).catch((err) => {
        logger.error(`TaskCtrl::update() error`, err);
        return res.status(500).send(err.toString());
    });
}

export function remove(req, res) {
    return req.task.remove().then(() => {
        return res.status(200).end();
    }).catch((err) => {
        logger.error(`TaskCtrl::remove() error`, err);
        return res.status(500).send(err.toString());
    });
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
