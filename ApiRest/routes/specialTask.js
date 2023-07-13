const express = require("express");
const router = express.Router();
const specialTaskController = require("../controllers/specialTask");
const check = require("../middleware/auth")


router.get("/", check.auth, specialTaskController.getAllspecialTasks);
router.post("/", check.checkRole(['Pastor', 'Administrador']), specialTaskController.postSpecialTask);
router.post("/:specialTask_code/member/:member_code", check.checkRole(['Pastor', 'Administrador']), specialTaskController.postSpecialTaskMember);
router.get("/:specialTask_code/members", check.auth, specialTaskController.getSpecialTaskMembers);
router.get("/date", check.auth, specialTaskController.getDateSpecialTaskMembers);
router.patch("/:specialTask_code/", check.checkRole(['Pastor', 'Administrador']), specialTaskController.updateSpecialTask);
router.delete("/:specialTask_code/", check.checkRole(['Pastor', 'Administrador']), specialTaskController.deleteSpecialTask);


module.exports = router