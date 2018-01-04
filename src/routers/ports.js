import express from 'express';
import PortCtrl from '../controllers/port';

const router = express.Router();

router.route('/ports')
    .get(PortCtrl.list)
    .post(PortCtrl.create);
router.route('/ports/:portId')
    .get(PortCtrl.read)
    .put(PortCtrl.update)
    .delete(PortCtrl.remove);
router.param('portId', PortCtrl.portById);

export default router;
