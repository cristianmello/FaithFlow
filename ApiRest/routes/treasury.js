const express = require('express');
const router = express.Router();
const treasuryController = require("../controllers/treasury");
const check = require("../middleware/auth");

router.get('/', check.auth, treasuryController.getTreasuries);
router.get('/:activity_code', check.auth, treasuryController.getTreasury);
router.get('/lastTreasuries', check.auth, treasuryController.getLastTreasuries);
router.get('/treasuries/date', check.auth, treasuryController.getTreasuriesbetweenDate)
router.post('/', check.checkRole(['Pastor', 'Tesorero', 'Administrador']), treasuryController.postTreasury);
router.patch('/:activity_code', check.checkRole(['Pastor', 'Tesorero', 'Administrador']), treasuryController.updateTreasury);
router.delete('/:activity_code', check.checkRole(['Pastor', 'Tesorero', 'Administrador']), treasuryController.deleteTreasury);

module.exports = router;
