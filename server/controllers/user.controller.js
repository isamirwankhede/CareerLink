const User = require('../models/User.model');
const Job = require('../models/Job.model');

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('savedJobs');
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      'name', 'bio', 'location', 'phone', 'skills',
      'resume', 'experience', 'education', 'avatar',
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('savedJobs');

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Save / unsave a job
// @route   PUT /api/user/save-job/:jobId
// @access  Private (user)
exports.toggleSaveJob = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const jobId = req.params.jobId;

    const alreadySaved = user.savedJobs.includes(jobId);

    if (alreadySaved) {
      user.savedJobs = user.savedJobs.filter((id) => id.toString() !== jobId);
    } else {
      user.savedJobs.push(jobId);
    }

    await user.save();

    res.status(200).json({
      success: true,
      saved: !alreadySaved,
      message: alreadySaved ? 'Job removed from saved.' : 'Job saved successfully.',
    });
  } catch (error) {
    next(error);
  }
};
