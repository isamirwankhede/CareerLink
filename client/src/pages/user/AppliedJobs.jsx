import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserApplications } from '../../services/application.service';
import Spinner from '../../components/Spinner';
import { FileText, MapPin, Clock, ArrowRight, Briefcase } from 'lucide-react';

const statusStyles = {
  pending: 'badge-yellow',
  reviewing: 'badge-indigo',
  accepted: 'badge-green',
  rejected: 'badge-red',
};

const AppliedJobs = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserApplications()
      .then((res) => setApplications(res.data.applications))
      .catch(() => setApplications([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container animate-fade-in">
      <div className="mb-8">
        <h1 className="section-title">Applied Jobs</h1>
        <p className="text-gray-400">Track all your job applications</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : applications.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl">
          <FileText size={48} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No applications yet</h3>
          <p className="text-gray-500 mb-6">Start applying to jobs to see them here</p>
          <Link to="/" className="btn-primary inline-flex">Browse Jobs</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const job = app.jobId;
            const company = job?.companyId;
            const daysAgo = Math.floor((Date.now() - new Date(app.createdAt).getTime()) / (1000 * 60 * 60 * 24));
            return (
              <div key={app._id} className="card flex items-center justify-between flex-wrap gap-4 animate-slide-up">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-violet-500/20 border border-primary-500/20 flex items-center justify-center text-primary-400 font-bold text-lg flex-shrink-0">
                    {company?.companyName?.charAt(0) || <Briefcase size={20} />}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{job?.title}</h3>
                    <p className="text-gray-400 text-sm">{company?.companyName}</p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      {job?.location && (
                        <span className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={10} /> {job.location}</span>
                      )}
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={10} /> Applied {daysAgo === 0 ? 'today' : `${daysAgo}d ago`}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={statusStyles[app.status] || 'badge-gray'}>{app.status}</span>
                  {job?._id && (
                    <Link to={`/job/${job._id}`} className="text-primary-400 hover:text-primary-300 flex items-center gap-1 text-sm">
                      View <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AppliedJobs;
