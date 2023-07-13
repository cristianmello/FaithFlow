const express = require('express');
const router = express.Router();
const typeTreasuryController = require("../controllers/typeTreasury");
const check = require("../middleware/auth");

router.get('/', check.auth, typeTreasuryController.getTypeTreasuries);
router.get('/typeTreasuries/:TypeTreasury_code', check.auth, typeTreasuryController.getTypeTreasury);
router.post('/', check.checkRole(['Pastor', 'tesorero']), typeTreasuryController.createTypeTreasury);
router.patch('/typeTreasuries/:TypeTreasury_code', check.checkRole(['Pastor', 'Tesorero', 'Administrador']), typeTreasuryController.updateTypeTreasury);
router.delete('/typeTreasuries/:TypeTreasury_code', check.checkRole(['Pastor', 'Tesorero', 'Administrador']), typeTreasuryController.deleteTypeTreasury);

// Exportar router
module.exports = router;

