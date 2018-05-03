import _ from 'lodash';
import Promise from 'bluebird';
import reader from 'read-last-lines';
import { Port } from '../../models';
import * as CONSTS from '../../consts';
import errors from '../../lib/errors';
import { logger } from '../../lib/logger';
import { describe, flush } from '../../services/pm2';

export async function readLog(req, res) {
    try {
        // read log path from task
        const proc = await describe(req.task.name);
        const logPath = proc[0].pm2_env.pm_out_log_path;
        
        let lines = await reader.read(logPath, CONSTS.MAX_LOG_LINES);
        lines = lines.split('\n');

        res.status(200).json({
            lines,
        });
    } catch (err) {
        logger.error(err.stack);
        res.status(500).send(err.toString());
    }
}
