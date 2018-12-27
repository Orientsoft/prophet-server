import express from 'express';
import LogCtrl from '../controllers/log';
import TaskCtrl from '../controllers/task';
import UserCtrl from '../controllers/user';

const router = express.Router();

router.route('/logs/:jobId')
    .get(LogCtrl.readLog);
router.param('jobId', UserCtrl.requireLogin, TaskCtrl.jobById);

export default router;
