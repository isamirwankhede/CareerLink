const express = require('express');
const router = express.Router();
const {
  createCompany,
  getCompanies,
  getCompany,
  updateCompany,
} = require('../controllers/company.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);

router.post('/', authorize('admin'), createCompany);
router.get('/', authorize('admin'), getCompanies);
router.get('/:id', getCompany);
router.put('/:id', authorize('admin'), updateCompany);

module.exports = router;
