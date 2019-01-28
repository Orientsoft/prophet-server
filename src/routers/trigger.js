import express from 'express';
import TriggerCtrl from '../controllers/trigger';
import UserCtrl from '../controllers/user';

const router = express.Router();

// trigger
router.route('/triggers')
    .get(UserCtrl.requireLogin, TriggerCtrl.list)
    .post(UserCtrl.requireLogin, TriggerCtrl.create);

router.route('/triggers/:triggerId')
    .get(UserCtrl.requireLogin, TriggerCtrl.read)
    .put(UserCtrl.requireLogin, TriggerCtrl.update)
    .delete(UserCtrl.requireLogin, TriggerCtrl.remove);
router.param('triggerId', TriggerCtrl.triggerById);

export default router;
