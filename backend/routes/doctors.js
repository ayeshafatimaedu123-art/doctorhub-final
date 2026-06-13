const express = require('express');
const router = express.Router();
const { getDoctors, getDoctor, createDoctor, updateDoctor, deleteDoctor, getMyDoctorProfile } = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getDoctors);
router.get('/my-profile', protect, authorize('doctor'), getMyDoctorProfile);
router.get('/:id', getDoctor);
router.post('/', protect, authorize('doctor'), createDoctor);
router.put('/:id', protect, authorize('doctor', 'admin', 'superadmin'), updateDoctor);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteDoctor);

module.exports = router;
