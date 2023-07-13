const express = require("express");
const router = express.Router();
const rolesController = require("../controllers/roles");
const check = require("../middleware/auth")


router.get("/", check.auth, rolesController.getAllRoles)
router.get("/members", check.auth, rolesController.getAllRolesMembers);
router.get("/:role_code/members", check.auth, rolesController.getRoleMembers);
router.post("/:role_code/members/:member_code", check.checkRole(["Pastor", 'Administrador']), rolesController.associateRoleMember);
router.patch("/:role_code/", check.checkRole(["Pastor"]), rolesController.updateRole);
router.delete("/member/:member_code/roles", check.checkRole(["Pastor", 'Administrador']), rolesController.deleteRoles)
router.delete("/:role_code/", check.checkRole(["Pastor", 'Administrador']), rolesController.deleteRole);


module.exports = router;