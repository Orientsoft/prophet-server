import express from 'express';
import PortCtrl from '../controllers/port';
import UserCtrl from '../controllers/user';

const router = express.Router();

router.route('/ports')
    .get(UserCtrl.requireLogin, PortCtrl.list)
    .post(UserCtrl.requireLogin, PortCtrl.create);
router.route('/ports/:portId')
    .get(PortCtrl.read)
    .put(PortCtrl.update)
    .delete(PortCtrl.remove);
router.param('portId', PortCtrl.portById, UserCtrl.requireLogin);

export default router;
