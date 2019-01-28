import express from 'express';
import HostCtrl from '../controllers/host';
import UserCtrl from '../controllers/user';

const router = express.Router();

router.route('/hosts')
    .get(UserCtrl.requireLogin, HostCtrl.list)
    .post(UserCtrl.requireLogin, HostCtrl.create);
router.route('/hosts/:hostId')
    .get(UserCtrl.requireLogin, HostCtrl.read)
    .put(UserCtrl.requireLogin, HostCtrl.update)
    .delete(UserCtrl.requireLogin, HostCtrl.remove);
router.param('hostId', HostCtrl.hostById);

export default router;
