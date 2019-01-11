import express from 'express';
import TaskCtrl from '../controllers/task';
import UserCtrl from '../controllers/user';

const router = express.Router();

// task
router.route('/tasks')
    .get(UserCtrl.requireLogin, TaskCtrl.list)
    .post(UserCtrl.requireLogin, TaskCtrl.create);

router.route('/tasks/:taskId')
    .get(TaskCtrl.read)
    .put(TaskCtrl.update)
    .delete(TaskCtrl.remove);
router.param('taskId', TaskCtrl.taskById, UserCtrl.requireLogin);

// job
router.route('/jobs')
    .get(UserCtrl.requireLogin, TaskCtrl.ps)
    .post(UserCtrl.requireLogin, TaskCtrl.start)
    .delete(UserCtrl.requireLogin, TaskCtrl.stopAll);

router.route('/jobs/:jobId')
    .get(TaskCtrl.read) // TODO : implementation
    .delete(TaskCtrl.stop);
router.param('jobId', TaskCtrl.jobById, UserCtrl.requireLogin);

export default router;
