import express from 'express';
import StatusCtrl from '../controllers/status';

const router = express.Router();

router.route('/status')
    .get(StatusCtrl.list)
    .post(StatusCtrl.create);

export default router;
