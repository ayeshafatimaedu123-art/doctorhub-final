const express = require('express');
const router = express.Router();
const { updateProfile, uploadProfileImage, updatePatientProfile, changePassword } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect);
router.put('/profile', updateProfile);
router.put('/profile-image', upload.single('profileImage'), uploadProfileImage);
router.put('/patient-profile', updatePatientProfile);
router.put('/change-password', changePassword);

module.exports = router;
