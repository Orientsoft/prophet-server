import express from 'express';
import AlertCtrl from '../controllers/alert';

const router = express.Router();

router.route('/alerts')
    .get(AlertCtrl.list)
    .post(AlertCtrl.create);
router.route('/alerts/:alertId')
    .get(AlertCtrl.read)
    .put(AlertCtrl.update)
    .delete(AlertCtrl.remove);
router.param('alertId', AlertCtrl.alertById);

export default router;
