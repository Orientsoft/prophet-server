import express from 'express';
import StructuresCtrl from '../controllers/structures';

const router = express.Router();

// structures
router.route('/structures')
    .get(StructuresCtrl.structrueList)

router.route('/meta-structure')
    .get(StructuresCtrl.structrueMetaData)

export default router;
