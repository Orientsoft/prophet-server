import express from 'express';
import FlowCtrl from '../controllers/flow';
import UserCtrl from '../controllers/user';

const router = express.Router();

router.route('/flows')
    .get(UserCtrl.requireAdmin, FlowCtrl.list)
    .post(FlowCtrl.create);

router.route('/flows/:flowId/jobs')
    .get(
        FlowCtrl.flowById,
        FlowCtrl.ps
    );

router.route('/flows/:flowId')
    .get(FlowCtrl.read)
    .put(FlowCtrl.update)
    .delete(FlowCtrl.remove);
router.param('flowId', FlowCtrl.flowById);

export default router;
