import _ from 'lodash';
import Promise from 'bluebird';
import { Task, Port, Trigger } from '../models';
import * as pmService from './pm2';
import * as triggerService from './trigger';
import { logger } from '../lib/logger';
import * as CONSTS from '../consts';
import errors from '../lib/errors';

export async function taskInit() {
    try {
        const tasks = await Task.find();
        await Promise.mapSeries(tasks, (task) => {
            if (task.running) {
                return taskStart(task);
            }

            return Promise.resolve();
        });
    } catch (err) {
        logger.error(err.stack);
    }
}

export async function taskStart(task) {
    try {
        const inputPort = await Port.findById(task.input);
        if (!inputPort) {
            return Promise.reject(new Error(
                JSON.stringify(errors.TASK_INPUT_NOT_FOUND)
            ));
        }
    
        const outputPort = await Port.findById(task.output);
        if (!outputPort) {
            return Promise.reject(new Error(
                JSON.stringify(errors.TASK_OUTPUT_NOT_FOUND)
            ));
        }

        const internalParams = [
            `--input_type ${CONSTS.PORT_TYPES_LIST[inputPort.type]}`,
            `--input_name ${inputPort.name}`,
            `--output_type ${CONSTS.PORT_TYPES_LIST[outputPort.type]}`,
            `--output_name ${outputPort.name}`,
            `--metric_name ${task.metric}`,
            `--task_name ${task.name}`,
        ];
    
        // execute pre-trigger
        const preTrigger = await Trigger.findOne({
            type: CONSTS.TRIGGER_TYPES.PRE,
            task: task._id
        });
    
        if (preTrigger !== undefined && preTrigger != null) {
            await triggerService.execute(preTrigger);
        }
    
        const proc = await pmService.start(
            task.name,
            task.script,
            task.cron,
            _.concat(task.params, internalParams)
        );
    
        task.running = true;
        await task.save();
    
        return Promise.resolve(proc);
    } catch (err) {
        return Promise.reject(err);
    }
}

export async function taskStop(task, executePostTrigger) {
    try {
        task.running = false;
        await task.save();

        const proc = await pmService.stop(task.name);
        if (proc.length === 0) {
            return null;
        }

        if (proc[0].pm2_env.status === 'stopped') {
            if (executePostTrigger) {
                const postTrigger = await Trigger.findOne({
                    type: CONSTS.TRIGGER_TYPES.POST,
                    task: task._id
                });
    
                if (postTrigger !== undefined && postTrigger != null) {
                    await triggerService.execute(postTrigger);
                }
            }
        }

        return proc;
    } catch (err) {
        logger.error(err.stack);

        return null;
    }
}
