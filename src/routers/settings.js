import express from 'express';
import SettingsCtrl from '../controllers/settings';
import UserCtrl from '../controllers/user';

const router = express.Router();

// settings
router.route('/settings/menus')
    .get(UserCtrl.requireLogin, SettingsCtrl.menuList)


export default router;
