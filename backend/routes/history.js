const express = require('express');
const router = express.Router();
const { getMedicalHistory, addMedicalHistory, uploadReport } = require('../controllers/historyController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect);
router.route('/').get(getMedicalHistory).post(authorize('doctor'), addMedicalHistory);
router.post('/:id/report', upload.single('report'), uploadReport);

module.exports = router;
