import express from 'express';
import FlowCtrl from '../controllers/flow';
import UserCtrl from '../controllers/user';

const router = express.Router();

router.route('/flows')
    .get(UserCtrl.requireLogin, FlowCtrl.list)
    .post(UserCtrl.requireLogin, FlowCtrl.create);

router.route('/flows/:flowId/jobs')
    .get(
        FlowCtrl.flowById,
        UserCtrl.requireLogin,
        FlowCtrl.ps
    );

router.route('/flows/:flowId')
    .get(UserCtrl.requireLogin, FlowCtrl.read)
    .put(UserCtrl.requireLogin, FlowCtrl.update)
    .delete(UserCtrl.requireLogin, FlowCtrl.remove);
router.param('flowId', FlowCtrl.flowById);

export default router;
