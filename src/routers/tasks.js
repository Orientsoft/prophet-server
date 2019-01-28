import express from 'express';
import TaskCtrl from '../controllers/task';
import UserCtrl from '../controllers/user';

const router = express.Router();

// task
router.route('/tasks')
    .get(UserCtrl.requireLogin, TaskCtrl.list)
    .post(UserCtrl.requireLogin, TaskCtrl.create);

router.route('/tasks/:taskId')
    .get(UserCtrl.requireLogin, TaskCtrl.read)
    .put(UserCtrl.requireLogin, TaskCtrl.update)
    .delete(UserCtrl.requireLogin, TaskCtrl.remove);
router.param('taskId', TaskCtrl.taskById);

// job
router.route('/jobs')
    .get(UserCtrl.requireLogin, TaskCtrl.ps)
    .post(UserCtrl.requireLogin, TaskCtrl.start)
    .delete(UserCtrl.requireLogin, TaskCtrl.stopAll);

router.route('/jobs/:jobId')
    .get(UserCtrl.requireLogin, TaskCtrl.read) // TODO : implementation
    .delete(UserCtrl.requireLogin, TaskCtrl.stop);
router.param('jobId', TaskCtrl.jobById);

export default router;
