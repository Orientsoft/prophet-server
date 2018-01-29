import express from 'express';
import SettingsCtrl from '../controllers/settings';

const router = express.Router();

// settings
router.route('/settings/menus')
    .get(SettingsCtrl.menuList)


export default router;
