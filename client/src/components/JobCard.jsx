import { Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Bookmark, BookmarkCheck, Briefcase, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toggleSaveJob } from '../services/user.service';
import { useState } from 'react';
import toast from 'react-hot-toast';

const jobTypeColors = {
  'Full-time': 'badge-green',
  'Part-time': 'badge-yellow',
  'Contract': 'badge-indigo',
  'Internship': 'badge-indigo',
  'Remote': 'badge-green',
};

const JobCard = ({ job, onSaveToggle }) => {
  const { user, updateUser } = useAuth();
  const isSaved = user?.savedJobs?.some((id) =>
    typeof id === 'object' ? id._id === job._id : id === job._id
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user || user.role !== 'user') {
      toast.error('Please login as a job seeker to save jobs');
      return;
    }
    setSaving(true);
    try {
      const res = await toggleSaveJob(job._id);
      const updatedSavedJobs = res.data.saved
        ? [...(user.savedJobs || []), job._id]
        : (user.savedJobs || []).filter((id) =>
            typeof id === 'object' ? id._id !== job._id : id !== job._id
          );
      updateUser({ ...user, savedJobs: updatedSavedJobs });
      toast.success(res.data.message);
      if (onSaveToggle) onSaveToggle(job._id, res.data.saved);
    } catch (err) {
      toast.error('Failed to save job');
    } finally {
      setSaving(false);
    }
  };

  const company = job.companyId;
  const postedDate = new Date(job.createdAt);
  const daysAgo = Math.floor((Date.now() - postedDate.getTime()) / (1000 * 60 * 60 * 24));
  const timeLabel = daysAgo === 0 ? 'Today' : daysAgo === 1 ? '1 day ago' : `${daysAgo} days ago`;

  return (
    <Link to={`/job/${job._id}`}>
      <div className="card group cursor-pointer h-full flex flex-col animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-violet-500/20 border border-primary-500/20 flex items-center justify-center text-primary-400 font-bold text-lg flex-shrink-0">
              {company?.logo ? (
                <img src={company.logo} alt={company.companyName} className="w-full h-full object-cover rounded-xl" />
              ) : (
                company?.companyName?.charAt(0) || <Briefcase size={20} />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-300">{company?.companyName || 'Company'}</p>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <MapPin size={10} /> {company?.location || job.location}
              </p>
            </div>
          </div>

          {user?.role === 'user' && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-primary-400 flex-shrink-0"
              title={isSaved ? 'Remove from saved' : 'Save job'}
            >
              {isSaved ? (
                <BookmarkCheck size={18} className="text-primary-400" />
              ) : (
                <Bookmark size={18} />
              )}
            </button>
          )}
        </div>

        {/* Job Info */}
        <div className="flex-1">
          <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
            {job.title}
          </h3>
          <p className="text-gray-500 text-sm line-clamp-2 mb-4">{job.description}</p>

          {/* Skills */}
          {job.skills?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {job.skills.slice(0, 3).map((skill, i) => (
                <span key={i} className="badge-gray text-xs">{skill}</span>
              ))}
              {job.skills.length > 3 && (
                <span className="badge-gray text-xs">+{job.skills.length - 3}</span>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 pt-4 mt-2 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <span className={jobTypeColors[job.jobType] || 'badge-gray'}>{job.jobType}</span>
            {job.salary && (
              <span className="flex items-center gap-1 text-xs text-emerald-400">
                <DollarSign size={12} /> {job.salary}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock size={11} /> {timeLabel}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-1 text-primary-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          View Details <ArrowRight size={14} />
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
