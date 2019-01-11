import express from 'express';
import StructuresCtrl from '../controllers/structures';
import UserCtrl from '../controllers/user';

const router = express.Router();

// structures
router.route('/structures')
    .get(UserCtrl.requireLogin, StructuresCtrl.structrueList)
    .post(UserCtrl.requireLogin, StructuresCtrl.create)

router.route('/structures/:structureId')
    .get(StructuresCtrl.read)
    .put(StructuresCtrl.update)
    .delete(StructuresCtrl.remove)

router.param('structureId', StructuresCtrl.getStructureById, UserCtrl.requireLogin)

router.route('/meta-structure')
    .get(UserCtrl.requireLogin, StructuresCtrl.structrueMetaData)

export default router;
