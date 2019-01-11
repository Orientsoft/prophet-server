import express from 'express';
import DataCtrl from '../controllers/data';
import UserCtrl from '../controllers/user';

const router = express.Router();

// data
router.route('/data')
    .get(UserCtrl.requireLogin, DataCtrl.list)
    .post(UserCtrl.requireLogin, DataCtrl.create);

router.route('/data/:dataId')
    .get(DataCtrl.read)
    .put(DataCtrl.update)
    .delete(DataCtrl.remove);
router.param('dataId', DataCtrl.dataById, UserCtrl.requireLogin);

export default router;
