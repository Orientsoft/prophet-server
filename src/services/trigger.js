import * as pmService from './pm2';
import { Task, Trigger } from '../models';
import taskService from './task';
import * as CONSTS from '../consts';
import errors from '../lib/errors';

const snapshot = [];

async function getDeadbody(prevSnapshot, currSnapshot) {
    const deadbodies = currSnapshot.filter((now) => {
        const result = prevSnapshot.reduce((prev, curr) => {
            if (prev)
                return prev;

            if (
                curr.name === now.name &&
                now.pm2_env.status === 'stopped' &&
                curr.pm2_env.status !== 'stopped'
            ) {
                return true;
            }
        }, false);

        return result;
    });

    return deadbodies;
}

export async function execute(trigger) {
    try {
        const target = await Task.findById(trigger.target);
        
        if (target !== undefined && target != null) {
            switch (trigger.action) {
                case CONSTS.TRIGGER_ACTIONS.START:
                    if (!target.running) {
                        await taskService.taskStart(target);
                    }
                    break;
        
                case CONSTS.TRIGGER_ACTIONS.STOP:
                    if (target.running) {
                        await taskService.taskStop(target, false);
                    }
                    break;
        
                case CONSTS.TRIGGER_ACTIONS.RESTART:
                    if (target.running) {
                        await taskService.taskStop(target, false);
                    }
                    await taskService.taskStart(target);
                    break;
        
                default:
                    return Promise.reject(new Error(
                        JSON.stringify(errors.UNKNOWN_TRIGGER_TYPE)
                    ));
            }

            return Promise.resolve(target);
        }

        return Promise.reject(new Error(
            JSON.stringify(TASK_NOT_FOUND)
        ));
    } catch (err) {
        return Promise.reject(err);
    }
}

export function startWatchdog() {
    return new Promise((resolve, reject) => {
        setInterval(async () => {
            const currSnapshot = await pmService.list();
            /*
            const deadboies = await getDeadbody(snapshot, currSnapshot);

            await Promise.map(deadboies, async (deadbody) => {
                const { name } = deadbody;

                const task = await Task.findOne({ name });

                if (
                    task !== undefined &&
                    task != null &&
                    task.running === false
                ) {
                    // this is supposed to be dead, now post-trigger
                    const postTrigger = await Trigger.findOne({
                        type: CONSTS.TRIGGER_TYPES.POST,
                        task: task._id
                    });

                    if (postTrigger !== undefined && postTrigger != null) {
                        await executePostTrigger(postTrigger);
                    }
                }

                return Promise.resolve();

            });

            // refresh snapshot
            snapshot = currSnapshot;
            */
        }, CONSTS.WATCHDOG_INTERVAL);
    });
}
