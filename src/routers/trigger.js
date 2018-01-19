import express from 'express';
import TriggerCtrl from '../controllers/trigger';

const router = express.Router();

// trigger
router.route('/trigger')
    .get(TriggerCtrl.list)
    .post(TriggerCtrl.create);

router.route('/trigger/:triggerId')
    .get(TriggerCtrl.read)
    .put(TriggerCtrl.update)
    .delete(TriggerCtrl.remove);
router.param('triggerId', TriggerCtrl.triggerById);

export default router;
