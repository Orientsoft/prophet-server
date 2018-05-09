import mongoose from 'mongoose';
import * as CONSTS from '../consts';

const watchdogchema = new mongoose.Schema({
    pid: Number
}, { timestamps: true });

const Watchdog = mongoose.model('Watchdog', watchdogchema);

let watchdogInterval = null;

export function startFeeding() {
    if (watchdogInterval != null) {
        clearInterval(watchdogInterval);
    }

    watchdogInterval = setInterval(async () => {
        const existedCount = await Watchdog.count();

        if (existedCount === 0) {
            // create new watchdog info
            await Watchdog.create({
                pid: process.pid
            });
        } else {
            // update
            const watchdog = await Watchdog.findOne();
            watchdog.pid = process.pid;
            watchdog.markModified('pid');
            
            await watchdog.save();
        }
    }, CONSTS.WATCHDOG_INTERVAL);
}

export function stopFeeding() {
    clearInterval(watchdogInterval);
    watchdogInterval = null;
}
