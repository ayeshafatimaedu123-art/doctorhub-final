const express = require('express');
const router = express.Router();
const { createPrescription, getPrescriptions, getPrescription } = require('../controllers/prescriptionController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.route('/').get(getPrescriptions).post(authorize('doctor'), createPrescription);
router.get('/:id', getPrescription);

module.exports = router;
