import express from 'express';
import DataCtrl from '../controllers/data';
import UserCtrl from '../controllers/user';

const router = express.Router();

// data
router.route('/data')
    .get(UserCtrl.requireLogin, DataCtrl.list)
    .post(UserCtrl.requireLogin, DataCtrl.create);

router.route('/data/:dataId')
    .get(UserCtrl.requireLogin, DataCtrl.read)
    .put(UserCtrl.requireLogin, DataCtrl.update)
    .delete(UserCtrl.requireLogin, DataCtrl.remove);
router.param('dataId', DataCtrl.dataById);

export default router;
