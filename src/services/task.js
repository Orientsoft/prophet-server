import Promise from 'bluebird';
import { Port, Trigger } from '../models';
import * as pmService from './pm2';
import * as triggerService from './trigger';
import * as CONSTS from '../consts';
import errors from '../lib/errors';

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
            task.params
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
        const proc = await pmService.stop(task.name);
        
        if (proc.pm2_env.status === 'stopped') {
            task.running = false;
            await task.save();
    
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

        return Promise.resolve(proc);
    } catch (err) {
        return Promise.reject(err);
    }
}
