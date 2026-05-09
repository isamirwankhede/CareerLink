import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAdminApplicants, getJobApplicants, updateApplicationStatus } from '../../services/application.service';
import { getAdminJobs } from '../../services/job.service';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';
import { Users, Mail, Phone, Link as LinkIcon, ChevronDown, Filter } from 'lucide-react';

const statusStyles = {
  pending: 'badge-yellow',
  reviewing: 'badge-indigo',
  accepted: 'badge-green',
  rejected: 'badge-red',
};

const Applicants = () => {
  const [searchParams] = useSearchParams();
  const jobIdParam = searchParams.get('jobId');
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(jobIdParam || '');
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    getAdminJobs().then((res) => setJobs(res.data.jobs)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const fn = selectedJob ? () => getJobApplicants(selectedJob) : getAdminApplicants;
    fn().then((res) => setApplications(res.data.applications)).catch(() => setApplications([])).finally(() => setLoading(false));
  }, [selectedJob]);

  const handleStatusChange = async (appId, status) => {
    setUpdating(appId);
    try {
      const res = await updateApplicationStatus(appId, status);
      setApplications((prev) => prev.map((a) => (a._id === appId ? { ...a, status: res.data.application.status } : a)));
      toast.success(`Status updated to ${status}`);
    } catch { toast.error('Failed to update status'); } finally { setUpdating(null); }
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="section-title flex items-center gap-3"><Users size={28} className="text-primary-400" /> Applicants</h1>
          <p className="text-gray-400">{applications.length} application{applications.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select
            className="input-field py-2 text-sm"
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
          >
            <option value="" className="bg-dark-700">All Jobs</option>
            {jobs.map((j) => <option key={j._id} value={j._id} className="bg-dark-700">{j.title}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : applications.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl">
          <Users size={48} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400">No applicants yet</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const applicant = app.userId;
            return (
              <div key={app._id} className="card animate-slide-up">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
                      {applicant?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{applicant?.name}</h3>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="text-gray-500 text-xs flex items-center gap-1"><Mail size={10} /> {applicant?.email}</span>
                        {applicant?.phone && <span className="text-gray-500 text-xs flex items-center gap-1"><Phone size={10} /> {applicant.phone}</span>}
                      </div>
                      {app.jobId?.title && <p className="text-primary-400 text-xs mt-1">Applied for: {app.jobId.title}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`badge ${statusStyles[app.status] || 'badge-gray'}`}>{app.status}</span>
                    <div className="relative">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        disabled={updating === app._id}
                        className="input-field py-1.5 text-xs pr-8 cursor-pointer"
                      >
                        {['pending', 'reviewing', 'accepted', 'rejected'].map((s) => (
                          <option key={s} value={s} className="bg-dark-700 capitalize">{s}</option>
                        ))}
                      </select>
                    </div>
                    {updating === app._id && <Spinner size="sm" />}
                  </div>
                </div>

                {(applicant?.skills?.length > 0 || applicant?.experience || applicant?.resume || app.resumeLink) && (
                  <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap gap-4">
                    {applicant?.skills?.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1.5">Skills</p>
                        <div className="flex flex-wrap gap-1.5">
                          {applicant.skills.slice(0, 5).map((s) => <span key={s} className="badge-gray text-xs">{s}</span>)}
                        </div>
                      </div>
                    )}
                    {applicant?.experience && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Experience</p>
                        <p className="text-xs text-gray-300 max-w-xs line-clamp-2">{applicant.experience}</p>
                      </div>
                    )}
                    {(app.resumeLink || applicant?.resume) && (
                      <a
                        href={app.resumeLink || applicant.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300"
                      >
                        <LinkIcon size={11} /> View Resume
                      </a>
                    )}
                  </div>
                )}

                {app.coverLetter && (
                  <div className="mt-3 p-3 bg-white/5 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Cover Letter</p>
                    <p className="text-xs text-gray-300 line-clamp-3">{app.coverLetter}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Applicants;
