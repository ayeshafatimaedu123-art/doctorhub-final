const express = require('express');
const router = express.Router();
const { createClinic, getClinics, updateClinic } = require('../controllers/clinicController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.route('/').get(getClinics).post(authorize('doctor'), createClinic);
router.put('/:id', authorize('doctor', 'admin'), updateClinic);

module.exports = router;
