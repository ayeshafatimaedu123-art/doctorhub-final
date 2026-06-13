const express = require('express');
const router = express.Router();
const { getMyAssistantProfile, createAssistant, getAssistants, removeAssistant } = require('../controllers/assistantController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/me', authorize('assistant'), getMyAssistantProfile);
router.route('/')
  .get(authorize('doctor'), getAssistants)
  .post(authorize('doctor'), createAssistant);
router.delete('/:id', authorize('doctor', 'admin'), removeAssistant);

module.exports = router;
