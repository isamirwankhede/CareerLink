const express = require('express');
const router = express.Router();
const {
  createJob,
  getAllJobs,
  getAdminJobs,
  getJob,
  updateJob,
  deleteJob,
} = require('../controllers/job.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/', getAllJobs);
router.get('/admin', authorize('admin'), getAdminJobs);
router.get('/:id', getJob);
router.post('/', authorize('admin'), createJob);
router.put('/:id', authorize('admin'), updateJob);
router.delete('/:id', authorize('admin'), deleteJob);

module.exports = router;
