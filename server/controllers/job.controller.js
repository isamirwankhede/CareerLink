const Job = require('../models/Job.model');
const Company = require('../models/Company.model');
const Application = require('../models/Application.model');

// @desc    Create job
// @route   POST /api/job
// @access  Private (admin)
exports.createJob = async (req, res, next) => {
  try {
    const {
      title, description, requirements, salary,
      location, jobType, experience, skills, category, companyId,
    } = req.body;

    if (!title || !description || !location || !companyId) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, location, and company are required.',
      });
    }

    // Verify company belongs to admin
    const company = await Company.findById(companyId);
    if (!company || company.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to post jobs for this company.',
      });
    }

    const job = await Job.create({
      title,
      description,
      requirements: requirements || [],
      salary,
      location,
      jobType,
      experience,
      skills: skills || [],
      category,
      companyId,
      createdBy: req.user._id,
    });

    const populatedJob = await Job.findById(job._id).populate('companyId', 'companyName logo location');

    res.status(201).json({ success: true, job: populatedJob });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs (public/user)
// @route   GET /api/jobs
// @access  Private (user)
exports.getAllJobs = async (req, res, next) => {
  try {
    const { keyword, location, jobType, salary, category, experience } = req.query;

    const query = { isActive: true };

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { skills: { $in: [new RegExp(keyword, 'i')] } },
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    if (experience) {
      query.experience = { $regex: experience, $options: 'i' };
    }

    const jobs = await Job.find(query)
      .populate('companyId', 'companyName logo location industry')
      .populate('createdBy', 'name')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin's jobs
// @route   GET /api/jobs/admin
// @access  Private (admin)
exports.getAdminJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ createdBy: req.user._id })
      .populate('companyId', 'companyName logo location')
      .sort('-createdAt');

    res.status(200).json({ success: true, jobs });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job
// @route   GET /api/job/:id
// @access  Private
exports.getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('companyId', 'companyName logo location website description industry')
      .populate('createdBy', 'name email');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    res.status(200).json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job
// @route   PUT /api/job/:id
// @access  Private (admin)
exports.updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: 'Not authorized to update this job.' });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('companyId', 'companyName logo location');

    res.status(200).json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job
// @route   DELETE /api/job/:id
// @access  Private (admin)
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: 'Not authorized to delete this job.' });
    }

    await Job.findByIdAndDelete(req.params.id);
    // Also remove related applications
    await Application.deleteMany({ jobId: req.params.id });

    res.status(200).json({ success: true, message: 'Job deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
