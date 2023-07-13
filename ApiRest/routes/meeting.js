const express = require("express");
const router = express.Router();
const meetingsController = require("../controllers/meeting");
const check = require("../middleware/auth")


router.get("/", check.auth, meetingsController.getAllMeetings);
router.get("/:meeting_code/members", check.auth, meetingsController.getMeetingMembers);
router.get("/members", check.auth, meetingsController.getDateMeetingMembers);
router.post("/", check.checkRole(['Pastor', 'Administrador']), meetingsController.createMeeting);
router.post("/:meeting_code/meetings/:member_code/associate", check.checkRole(['Pastor', 'Administrador']), meetingsController.associateMeetingMembers);
router.patch("/:meeting_code/", check.checkRole(['Pastor', 'Administrador']), meetingsController.updateMeeting);
router.delete("/:meeting_code/", check.checkRole(['Pastor', 'Administrador']), meetingsController.deleteMeeting);
router.delete("/:meeting_code/meetings/:member_code/disassociate", check.checkRole(['Pastor', 'Administrador']), meetingsController.disassociateMeetingMembers);


module.exports = router;