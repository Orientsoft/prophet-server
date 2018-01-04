import express from 'express';
import FlowCtrl from '../controllers/flow';

const router = express.Router();

router.route('/flows')
    .get(FlowCtrl.list)
    .post(FlowCtrl.create);
router.route('/flows/:flowId')
    .get(FlowCtrl.read)
    .put(FlowCtrl.update)
    .delete(FlowCtrl.remove);
router.param('flowId', FlowCtrl.flowById);

export default router;
