import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJob } from '../../services/job.service';
import { applyForJob } from '../../services/application.service';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';
import {
  MapPin, Briefcase, DollarSign, Clock, Building2, Globe,
  CheckCircle, ArrowLeft, Send, BookmarkCheck, Bookmark,
} from 'lucide-react';
import { toggleSaveJob } from '../../services/user.service';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeLink, setResumeLink] = useState('');
  const [resumeOption, setResumeOption] = useState('new');
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const isSaved = user?.savedJobs?.some((sid) =>
    typeof sid === 'object' ? sid._id === job?._id : sid === job?._id
  );

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await getJob(id);
        setJob(res.data.job);
      } catch {
        toast.error('Job not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, navigate]);

  const handleApply = async () => {
    setApplying(true);
    try {
      await applyForJob(id, { coverLetter, resumeLink });
      setApplied(true);
      setShowApplyForm(false);
      toast.success('Application submitted successfully! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    if (!user || user.role !== 'user') return;
    setSaving(true);
    try {
      const res = await toggleSaveJob(job._id);
      const updatedSavedJobs = res.data.saved
        ? [...(user.savedJobs || []), job._id]
        : (user.savedJobs || []).filter((sid) =>
            typeof sid === 'object' ? sid._id !== job._id : sid !== job._id
          );
      updateUser({ ...user, savedJobs: updatedSavedJobs });
      toast.success(res.data.message);
    } catch {
      toast.error('Failed to save job');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-32"><Spinner size="lg" /></div>;
  if (!job) return null;

  const company = job.companyId;

  return (
    <div className="page-container max-w-5xl animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft size={18} /> Back to Jobs
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Header */}
          <div className="card">
            <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500/20 to-violet-500/20 border border-primary-500/20 flex items-center justify-center text-2xl font-bold text-primary-400 flex-shrink-0">
                  {company?.companyName?.charAt(0) || <Building2 size={28} />}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">{job.title}</h1>
                  <p className="text-gray-400">{company?.companyName}</p>
                </div>
              </div>
              {user?.role === 'user' && (
                <button onClick={handleSave} disabled={saving} className="btn-secondary py-2 px-4 text-sm">
                  {isSaved ? <BookmarkCheck size={16} className="text-primary-400" /> : <Bookmark size={16} />}
                  {isSaved ? 'Saved' : 'Save Job'}
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-3 mb-4">
              <span className="flex items-center gap-1.5 text-sm text-gray-400">
                <MapPin size={14} className="text-primary-400" /> {job.location}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-gray-400">
                <Briefcase size={14} className="text-primary-400" /> {job.jobType}
              </span>
              {job.salary && (
                <span className="flex items-center gap-1.5 text-sm text-emerald-400">
                  <DollarSign size={14} /> {job.salary}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-sm text-gray-400">
                <Clock size={14} className="text-primary-400" /> {job.experience}
              </span>
            </div>

            {/* Skills */}
            {job.skills?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, i) => (
                  <span key={i} className="badge-indigo">{skill}</span>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="card">
            <h2 className="text-lg font-semibold text-white mb-4">Job Description</h2>
            <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">{job.description}</p>
          </div>

          {/* Requirements */}
          {job.requirements?.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-semibold text-white mb-4">Requirements</h2>
              <ul className="space-y-2">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-400 text-sm">
                    <CheckCircle size={15} className="text-primary-400 flex-shrink-0 mt-0.5" /> {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Apply Form */}
          {showApplyForm && (
            <div className="card animate-slide-up">
              <h2 className="text-lg font-semibold text-white mb-4">Apply for this Job</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">Resume Link (optional)</label>
                  {user?.resume && (
                    <select 
                      value={resumeOption}
                      onChange={(e) => {
                        setResumeOption(e.target.value);
                        if (e.target.value === 'profile') setResumeLink(user.resume);
                        else setResumeLink('');
                      }}
                      className="input-field mb-3 py-2.5 text-sm cursor-pointer"
                    >
                      <option value="profile" className="bg-dark-700">Use resume from my profile</option>
                      <option value="new" className="bg-dark-700">Provide a different link</option>
                    </select>
                  )}
                  {(!user?.resume || resumeOption === 'new') && (
                    <input
                      type="url"
                      value={resumeLink}
                      onChange={(e) => setResumeLink(e.target.value)}
                      placeholder="https://drive.google.com/your-resume"
                      className="input-field"
                    />
                  )}
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">Cover Letter (optional)</label>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    rows={5}
                    placeholder="Tell the recruiter why you're a great fit..."
                    className="input-field resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={() => setShowApplyForm(false)} className="btn-secondary">Cancel</button>
                <button onClick={handleApply} disabled={applying} className="btn-primary flex-1 justify-center">
                  {applying && <Spinner size="sm" />}
                  {applying ? 'Submitting...' : 'Submit Application'}
                  {!applying && <Send size={15} />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Apply CTA */}
          {user?.role === 'user' && (
            <div className="card text-center">
              {applied ? (
                <div>
                  <CheckCircle size={40} className="text-emerald-400 mx-auto mb-3" />
                  <p className="text-white font-semibold">Application Submitted!</p>
                  <p className="text-gray-400 text-sm mt-1">We'll notify you on updates</p>
                </div>
              ) : (
                <>
                  <p className="text-gray-400 text-sm mb-4">Interested in this role?</p>
                  <button
                    onClick={() => {
                      if (user?.resume) {
                        setResumeOption('profile');
                        setResumeLink(user.resume);
                      } else {
                        setResumeOption('new');
                        setResumeLink('');
                      }
                      setShowApplyForm(true);
                    }}
                    className="btn-primary w-full justify-center"
                    disabled={showApplyForm}
                  >
                    <Send size={15} /> Apply Now
                  </button>
                </>
              )}
            </div>
          )}

          {/* Company Info */}
          <div className="card">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Building2 size={16} className="text-primary-400" /> About Company
            </h3>
            <div className="space-y-3">
              <p className="text-lg font-semibold text-white">{company?.companyName}</p>
              {company?.description && (
                <p className="text-gray-400 text-sm line-clamp-4">{company.description}</p>
              )}
              {company?.location && (
                <p className="text-gray-500 text-sm flex items-center gap-1.5">
                  <MapPin size={12} /> {company.location}
                </p>
              )}
              {company?.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-400 text-sm flex items-center gap-1.5 hover:text-primary-300"
                >
                  <Globe size={12} /> {company.website}
                </a>
              )}
              {company?.industry && (
                <p className="text-gray-500 text-sm">Industry: {company.industry}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
