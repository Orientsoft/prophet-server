import Promise from 'bluebird';
import { Task, Port } from '../../models';
import * as pmService from '../../services/pm2';
import * as CONSTS from '../../consts';
import { errors } from '../../lib/errors';
import { logger } from '../../lib/logger';
import { getPageOption, getPageMetadata } from '../../lib/utils';

export function jobById(req, res, next, id) {
    Task.findById(id).then((task) => {
        if (task) {
            req.task = task;
            next();
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

export function start(req, res) {
    const { task } = req;

    const inputPromise = Port.findById(task.input);
    const outputPromise = Port.findById(task.output);

    return Promise.join(inputPromise, outputPromise).then((inputPort, outputPort) => {
        if (!inputPort) {
            return res.status(400).send(JSON.stringify(errors.TASK_INPUT_NOT_FOUND));
        }

        if (!outputPort) {
            return res.status(400).send(JSON.stringify(errors.TASK_OUTPUT_NOT_FOUND));
        }

        if (task.params === undefined || task.params == null) {
            task.params = [
                `--input-type ${inputPort.type}`,
                `--input-name ${inputPort.name}`,
                `--output-type ${outputPort.type}`,
                `--output-name ${outputPort.name}`
            ];
        } else {
            task.params.push(`--input-type ${inputPort.type}`);
            task.params.push(`--input-name ${inputPort.name}`);
            task.params.push(`--output-type ${outputPort.type}`);
            task.params.push(`--output-name ${outputPort.name}`);
        }

        return pmService.start(task.name, task.script, task.cron, task.params);
    }).then((proc) => {
        task.set({ running: true });
        task.save();

        return res.status(200).json(proc);
    }).catch((err) => {
        logger.error(`TaskCtrl::start() error`, err);
        return res.status(500).send(err.toString());
    });
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
