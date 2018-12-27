import express from 'express';
import HostCtrl from '../controllers/host';
import UserCtrl from '../controllers/user';

const router = express.Router();

router.route('/hosts')
    .get(UserCtrl.requireLogin, HostCtrl.list)
    .post(UserCtrl.requireLogin, HostCtrl.create);
router.route('/hosts/:hostId')
    .get(HostCtrl.read)
    .put(HostCtrl.update)
    .delete(HostCtrl.remove);
router.param('hostId', UserCtrl.requireLogin, HostCtrl.hostById);

export default router;
