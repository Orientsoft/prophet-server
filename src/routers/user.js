import express from 'express';
import UserCtrl from '../controllers/user';

const router = express.Router();

// user
router.route('/user')
    .get(UserCtrl.info)

router.route('/user/login')
    .post(UserCtrl.login)

router.route('/user/logout')
    .post(UserCtrl.logout)

export default router;
