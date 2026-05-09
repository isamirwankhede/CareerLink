const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getUserApplications,
  getJobApplicants,
  getAdminApplicants,
  updateApplicationStatus,
} = require('../controllers/application.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);

router.post('/apply/:jobId', authorize('user'), applyForJob);
router.get('/applications', authorize('user'), getUserApplications);
router.get('/applications/admin', authorize('admin'), getAdminApplicants);
router.get('/applications/job/:jobId', authorize('admin'), getJobApplicants);
router.put('/application/status/:id', authorize('admin'), updateApplicationStatus);

module.exports = router;
