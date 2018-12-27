import express from 'express';
import FlowCtrl from '../controllers/flow';
import UserCtrl from '../controllers/user';

const router = express.Router();

router.route('/flows')
    .get(UserCtrl.requireLogin, FlowCtrl.list)
    .post(UserCtrl.requireLogin, FlowCtrl.create);

router.route('/flows/:flowId/jobs')
    .get(
        UserCtrl.requireLogin,
        FlowCtrl.flowById,
        FlowCtrl.ps
    );

router.route('/flows/:flowId')
    .get(FlowCtrl.read)
    .put(FlowCtrl.update)
    .delete(FlowCtrl.remove);
router.param('flowId', UserCtrl.requireLogin, FlowCtrl.flowById);

export default router;
