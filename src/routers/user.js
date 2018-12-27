import express from 'express';
import UserCtrl from '../controllers/user';

const router = express.Router();

// user
router.route('/user')
    .get(UserCtrl.requireLogin, UserCtrl.info);

router.route('/user/login')
    .post(UserCtrl.login);

router.route('/user/register')
    .post(UserCtrl.requireAdmin, UserCtrl.register);

router.route('/user/logout')
    .post(UserCtrl.requireLogin, UserCtrl.logout);

export default router;
