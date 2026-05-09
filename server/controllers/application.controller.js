const Application = require('../models/Application.model');
const Job = require('../models/Job.model');

// @desc    Apply for a job
// @route   POST /api/apply/:jobId
// @access  Private (user)
exports.applyForJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { coverLetter, resumeLink } = req.body;

    const job = await Job.findById(jobId);
    if (!job || !job.isActive) {
      return res.status(404).json({ success: false, message: 'Job not found or inactive.' });
    }

    const existingApplication = await Application.findOne({
      userId: req.user._id,
      jobId,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job.',
      });
    }

    const application = await Application.create({
      userId: req.user._id,
      jobId,
      coverLetter: coverLetter || '',
      resumeLink: resumeLink || '',
    });

    // Push to job's applicants array
    await Job.findByIdAndUpdate(jobId, {
      $push: { applicants: application._id },
    });

    res.status(201).json({ success: true, application, message: 'Application submitted successfully.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's applications
// @route   GET /api/applications
// @access  Private (user)
exports.getUserApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ userId: req.user._id })
      .populate({
        path: 'jobId',
        populate: { path: 'companyId', select: 'companyName logo location' },
      })
      .sort('-createdAt');

    res.status(200).json({ success: true, applications });
  } catch (error) {
    next(error);
  }
};

// @desc    Get applicants for a specific job
// @route   GET /api/applications/job/:jobId
// @access  Private (admin)
exports.getJobApplicants = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    const applications = await Application.find({ jobId: req.params.jobId })
      .populate('userId', 'name email skills experience education resume phone avatar')
      .sort('-createdAt');

    res.status(200).json({ success: true, applications });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applicants across admin's jobs
// @route   GET /api/applications/admin
// @access  Private (admin)
exports.getAdminApplicants = async (req, res, next) => {
  try {
    const adminJobs = await Job.find({ createdBy: req.user._id }).select('_id');
    const jobIds = adminJobs.map((j) => j._id);

    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate('userId', 'name email skills experience education resume phone avatar')
      .populate('jobId', 'title location jobType')
      .sort('-createdAt');

    res.status(200).json({ success: true, applications });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status
// @route   PUT /api/application/status/:id
// @access  Private (admin)
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'reviewing', 'accepted', 'rejected'];

    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid status value.' });
    }

    const application = await Application.findById(req.params.id).populate('jobId');

    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: 'Application not found.' });
    }

    // Verify the job belongs to the admin
    if (application.jobId.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: 'Not authorized to update this application.' });
    }

    application.status = status;
    await application.save();

    res.status(200).json({
      success: true,
      application,
      message: `Application status updated to '${status}'.`,
    });
  } catch (error) {
    next(error);
  }
};
