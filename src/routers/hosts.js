import express from 'express';
import HostCtrl from '../controllers/host';

const router = express.Router();

router.route('/hosts')
    .get(HostCtrl.list)
    .post(HostCtrl.create);
router.route('/hosts/:hostId')
    .get(HostCtrl.read)
    .put(HostCtrl.update)
    .delete(HostCtrl.remove);
router.param('hostId', HostCtrl.hostById);

export default router;
