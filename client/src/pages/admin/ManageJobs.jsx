import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminJobs, deleteJob, updateJob } from '../../services/job.service';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';
import { ListChecks, MapPin, Users, Trash2, PlusCircle, Eye, EyeOff } from 'lucide-react';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    getAdminJobs().then((res) => setJobs(res.data.jobs)).catch(() => setJobs([])).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job?')) return;
    setDeleting(id);
    try {
      await deleteJob(id);
      setJobs((prev) => prev.filter((j) => j._id !== id));
      toast.success('Job deleted');
    } catch { toast.error('Failed to delete'); } finally { setDeleting(null); }
  };

  const toggleActive = async (job) => {
    try {
      const res = await updateJob(job._id, { isActive: !job.isActive });
      setJobs((prev) => prev.map((j) => (j._id === job._id ? res.data.job : j)));
      toast.success(`Job ${!job.isActive ? 'activated' : 'deactivated'}`);
    } catch { toast.error('Failed to update'); }
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="section-title flex items-center gap-3"><ListChecks size={28} className="text-primary-400" /> Manage Jobs</h1>
          <p className="text-gray-400">{jobs.length} job{jobs.length !== 1 ? 's' : ''} posted</p>
        </div>
        <Link to="/admin/post-job" className="btn-primary py-2 px-4 text-sm"><PlusCircle size={15} /> Post New Job</Link>
      </div>
      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl">
          <ListChecks size={48} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No jobs posted yet</h3>
          <Link to="/admin/post-job" className="btn-primary inline-flex mt-4"><PlusCircle size={15} /> Post Your First Job</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job._id} className="card flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-violet-500/20 border border-primary-500/20 flex items-center justify-center text-primary-400 font-bold text-lg flex-shrink-0">
                  {job.companyId?.companyName?.charAt(0) || 'J'}
                </div>
                <div>
                  <h3 className="text-white font-semibold">{job.title}</h3>
                  <p className="text-gray-400 text-sm">{job.companyId?.companyName}</p>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={10} /> {job.location}</span>
                    <span className="text-xs text-gray-500 flex items-center gap-1"><Users size={10} /> {job.applicants?.length || 0} applicants</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`badge text-xs ${job.isActive ? 'badge-green' : 'badge-gray'}`}>{job.isActive ? 'Active' : 'Closed'}</span>
                <button onClick={() => toggleActive(job)} className="btn-secondary py-1.5 px-3 text-xs">
                  {job.isActive ? <EyeOff size={13} /> : <Eye size={13} />}{job.isActive ? 'Close' : 'Activate'}
                </button>
                <Link to={`/admin/applicants?jobId=${job._id}`} className="btn-secondary py-1.5 px-3 text-xs"><Users size={13} /> Applicants</Link>
                <button onClick={() => handleDelete(job._id)} disabled={deleting === job._id} className="btn-danger py-1.5 px-3 text-xs">
                  {deleting === job._id ? <Spinner size="sm" /> : <Trash2 size={13} />} Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageJobs;
