import express from 'express';
import DataCtrl from '../controllers/data';

const router = express.Router();

// data
router.route('/data')
    .get(DataCtrl.list)
    .post(DataCtrl.create);

router.route('/data/:dataId')
    .get(DataCtrl.read)
    .put(DataCtrl.update)
    .delete(DataCtrl.remove);
router.param('dataId', DataCtrl.dataById);

export default router;
