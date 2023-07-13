const express = require("express");
const router = express.Router();
const questionController = require("../controllers/question");
const check = require("../middleware/auth")


router.get("/:task_code/questions", check.auth, questionController.getQuestions);
router.post("/", check.checkRole(['Administrador', 'pastor', 'maestro']), questionController.createQuestion);
router.patch("/:question_code", check.checkRole(['Administrador', 'pastor', 'maestro']), questionController.updateQuestion);
router.delete("/:question_code", check.checkRole(['Administrador', 'pastor', 'maestro']), questionController.deleteQuestion);



module.exports = router;