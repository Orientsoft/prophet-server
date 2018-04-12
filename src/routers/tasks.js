import express from 'express';
import TaskCtrl from '../controllers/task';

const router = express.Router();

// task
router.route('/tasks')
    .get(TaskCtrl.list)
    .post(TaskCtrl.create);

router.route('/tasks/:taskId')
    .get(TaskCtrl.read)
    .put(TaskCtrl.update)
    .delete(TaskCtrl.remove);
router.param('taskId', TaskCtrl.taskById);

// job
router.route('/jobs')
    .get(TaskCtrl.ps)
    .post(TaskCtrl.start)
    .delete(TaskCtrl.stopAll);

router.route('/jobs/:jobId')
    .get(TaskCtrl.read) // TODO : implementation
    .delete(TaskCtrl.stop);
router.param('jobId', TaskCtrl.jobById);

export default router;
