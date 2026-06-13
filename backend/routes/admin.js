const express = require('express');
const router = express.Router();
const { getAnalytics, getUsers, toggleUser, approveDoctor, createAdmin, getAuditLogs } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin', 'superadmin'));
router.get('/analytics', getAnalytics);
router.get('/users', getUsers);
router.put('/users/:id/toggle', toggleUser);
router.put('/doctors/:id/approve', approveDoctor);
router.post('/create-admin', createAdmin);
router.get('/audit-logs', getAuditLogs);

module.exports = router;
