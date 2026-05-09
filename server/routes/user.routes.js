const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, toggleSaveJob } = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/save-job/:jobId', protect, authorize('user'), toggleSaveJob);

module.exports = router;
