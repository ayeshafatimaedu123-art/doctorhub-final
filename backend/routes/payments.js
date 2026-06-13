const express = require('express');
const router = express.Router();
const { uploadPayment, getPayments, verifyPayment } = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect);
router.route('/').get(getPayments).post(authorize('patient'), upload.single('screenshot'), uploadPayment);
router.put('/:id/verify', authorize('assistant', 'admin', 'superadmin'), verifyPayment);

module.exports = router;
