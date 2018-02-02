import express from 'express';
import StructuresCtrl from '../controllers/structures';

const router = express.Router();

// structures
router.route('/structures')
    .get(StructuresCtrl.structrueList)
    .post(StructuresCtrl.create)

router.route('/structures/:structureId')
    .get(StructuresCtrl.read)
    .put(StructuresCtrl.update)
    .delete(StructuresCtrl.remove)

router.param('structureId', StructuresCtrl.getStructureById)

router.route('/meta-structure')
    .get(StructuresCtrl.structrueMetaData)

export default router;
