const Company = require('../models/Company.model');

// @desc    Create company
// @route   POST /api/company
// @access  Private (admin)
exports.createCompany = async (req, res, next) => {
  try {
    const { companyName, description, website, location, industry, size } = req.body;

    if (!companyName) {
      return res
        .status(400)
        .json({ success: false, message: 'Company name is required.' });
    }

    const existingCompany = await Company.findOne({
      companyName,
      createdBy: req.user._id,
    });

    if (existingCompany) {
      return res
        .status(400)
        .json({ success: false, message: 'You already have a company with this name.' });
    }

    const company = await Company.create({
      companyName,
      description,
      website,
      location,
      industry,
      size,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, company });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all companies for admin
// @route   GET /api/company
// @access  Private (admin)
exports.getCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find({ createdBy: req.user._id }).sort(
      '-createdAt'
    );
    res.status(200).json({ success: true, companies });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single company
// @route   GET /api/company/:id
// @access  Private
exports.getCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id).populate(
      'createdBy',
      'name email'
    );

    if (!company) {
      return res
        .status(404)
        .json({ success: false, message: 'Company not found.' });
    }

    res.status(200).json({ success: true, company });
  } catch (error) {
    next(error);
  }
};

// @desc    Update company
// @route   PUT /api/company/:id
// @access  Private (admin)
exports.updateCompany = async (req, res, next) => {
  try {
    let company = await Company.findById(req.params.id);

    if (!company) {
      return res
        .status(404)
        .json({ success: false, message: 'Company not found.' });
    }

    if (company.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: 'Not authorized to update this company.' });
    }

    company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, company });
  } catch (error) {
    next(error);
  }
};
