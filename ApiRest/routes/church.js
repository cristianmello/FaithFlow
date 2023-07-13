const express = require('express');
const router = express.Router();
const churchController = require("../controllers/church");
const check = require("../middleware/auth")


router.get('/', check.auth, churchController.getChurch);
router.get('/list/:church_department', churchController.getChurchsForDepartment);
router.post('/register', churchController.churchRegister);
router.patch('/', check.checkRole(['Pastor', 'Administrador']), churchController.updateChurch);
router.patch('/income', check.checkRole(['Pastor', 'Administrador', 'Tesorero']), churchController.updateChurchIncome);
router.patch('/totalTreasuries', check.checkRole(['Pastor', 'Administrador', 'Tesorero']), churchController.updateChurchTotalTreasuries);
router.delete('/:church_code', check.checkRole(['Pastor', 'Administrador']), churchController.deleteChurch);


module.exports = router; 