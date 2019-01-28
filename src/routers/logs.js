import express from 'express';
import LogCtrl from '../controllers/log';
import TaskCtrl from '../controllers/task';
import UserCtrl from '../controllers/user';

const router = express.Router();

router.route('/logs/:jobId')
    .get(UserCtrl.requireLogin, LogCtrl.readLog);
router.param('jobId', TaskCtrl.jobById);

export default router;
