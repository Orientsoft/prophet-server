import express from 'express';
import LogCtrl from '../controllers/log';
import TaskCtrl from '../controllers/task';

const router = express.Router();

router.route('/logs/:jobId')
    .get(LogCtrl.readLog)
router.param('jobId', TaskCtrl.jobById);

export default router;
