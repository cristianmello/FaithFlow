const express = require('express');
const { Model } = require('sequelize');
const router = express.Router();
const taskController = require("../controllers/task");
const check = require("../middleware/auth")


router.post('/', check.checkRole(['admin', 'pastor', 'maestro']), taskController.createTask);
router.get('/', check.auth, taskController.getTasks);
router.patch('/:task_code', check.checkRole(['Administrador', 'pastor', 'maestro']), taskController.updateTask);
router.delete('/:task_code', check.checkRole(['Administrador', 'pastor', 'maestro']), taskController.deleteTask);


module.exports = router; 