import express from 'express';
import UserCtrl from '../controllers/user';

const router = express.Router();

// user
router.route('/user')
    .get(UserCtrl.info)

router.route('/user/list')
    .get(UserCtrl.userList)

router.route('/user/remove')
    .post(UserCtrl.remove)

router.route('/user/setMenus')
    .post(UserCtrl.setMenus)

router.route('/user/login')
    .post(UserCtrl.login)

router.route('/user/register')
    .post(UserCtrl.register)

router.route('/user/logout')
    .post(UserCtrl.logout)

export default router;
