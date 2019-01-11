import express from 'express';
import AlertCtrl from '../controllers/alert';
import UserCtrl from '../controllers/user';

const router = express.Router();

router.route('/alerts')
    .get(UserCtrl.requireLogin, AlertCtrl.list)
    .post(UserCtrl.requireLogin, AlertCtrl.create);
router.route('/alerts/:alertId')
    .get(AlertCtrl.read)
    .put(AlertCtrl.update)
    .delete(AlertCtrl.remove);
router.param('alertId', AlertCtrl.alertById, UserCtrl.requireLogin);

export default router;
