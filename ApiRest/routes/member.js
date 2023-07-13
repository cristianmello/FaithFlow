const express = require('express');
const router = express.Router();
const memberController = require("../controllers/member");
const check = require("../middleware/auth");
const multer = require("multer");

// Configuracion de subida
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/avatars/")
    },
    filename: (req, file, cb) => {
        cb(null, "avatar-" + Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });


router.post('/', memberController.register);
router.post('/login', memberController.login);
router.post('/logout', check.auth, memberController.logout);
router.post('/upload', [check.auth, upload.single('image')], memberController.upload);
router.post('/reset-password', memberController.resetPassword);
router.get('/profile/:member_code', check.auth, memberController.getProfile);
router.get('/list', check.auth, memberController.members);
router.get('/membersByName', check.auth, memberController.listMembersByName);
router.get('/avatar/:file', check.auth, memberController.avatar);
router.put('/update', check.auth, memberController.updateMember);
router.delete('/:member_code', check.checkRole(["pastor"]), memberController.deleteMember);


//exportar router 
module.exports = router;