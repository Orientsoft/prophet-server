import express from 'express';
import TaskCtrl from '../controllers/task';

const router = express.Router();

// task
router.route('/tasks')
    .get(TaskCtrl.list)
    .post(TaskCtrl.create);

router.route('/tasks/:taskId')
    .put(TaskCtrl.update)
    .delete(TaskCtrl.remove);
router.param('taskId', TaskCtrl.taskById);

// job
router.route('/jobs')
    .get(TaskCtrl.ps)
    .post(TaskCtrl.start);

router.route('/jobs/:jobId')
    .delete(TaskCtrl.stop);
router.param('jobId', TaskCtrl.jobById);

export default router;
