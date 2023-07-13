const express = require('express');
const router = express.Router();
const answerController = require("../controllers/answer");
const check = require("../middleware/auth")


router.get("/:question_code/answers", check.auth, answerController.getAnswers);
router.post("/", check.checkRole(['admin', 'pastor', 'maestro']), answerController.createAnswer);
router.patch("/:answer_code", check.checkRole(['admin', 'pastor', 'maestro']), answerController.updateAnswer);
router.delete("/:answer_code", check.checkRole(['admin', 'pastor', 'maestro']), answerController.deleteAnswer);


module.exports = router;