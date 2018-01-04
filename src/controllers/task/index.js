import * as task from './task.controller';
import * as job from './job.controller';

export default {
    ...task,
    ...job
};
