import express from 'express';
import TriggerCtrl from '../controllers/trigger';
import UserCtrl from '../controllers/user';

const router = express.Router();

// trigger
router.route('/triggers')
    .get(UserCtrl.requireLogin, TriggerCtrl.list)
    .post(UserCtrl.requireLogin, TriggerCtrl.create);

router.route('/triggers/:triggerId')
    .get(TriggerCtrl.read)
    .put(TriggerCtrl.update)
    .delete(TriggerCtrl.remove);
router.param('triggerId', UserCtrl.requireLogin, TriggerCtrl.triggerById);

export default router;
