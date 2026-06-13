const express = require('express');
const router = express.Router();
const { createAppointment, getAppointments, updateAppointment, getAppointment, getTodayAppointments } = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/today', authorize('doctor'), getTodayAppointments);
router.route('/').get(getAppointments).post(authorize('patient'), createAppointment);
router.route('/:id').get(getAppointment).put(updateAppointment);

module.exports = router;
