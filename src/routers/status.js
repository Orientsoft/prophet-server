import express from 'express';
import StatusCtrl from '../controllers/status';
import UserCtrl from '../controllers/user';

const router = express.Router();

router.route('/status')
    .get(UserCtrl.requireLogin, StatusCtrl.list)
    .post(UserCtrl.requireLogin, StatusCtrl.create);

export default router;
