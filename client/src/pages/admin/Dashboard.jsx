import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminJobs } from '../../services/job.service';
import { getCompanies } from '../../services/company.service';
import { getAdminApplicants } from '../../services/application.service';
import DashboardCards from '../../components/DashboardCards';
import Spinner from '../../components/Spinner';
import { LayoutDashboard, Briefcase, Users, Building2, PlusCircle, ArrowRight, MapPin, Clock } from 'lucide-react';

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAdminJobs(), getCompanies(), getAdminApplicants()])
      .then(([jobsRes, companiesRes, appsRes]) => {
        setJobs(jobsRes.data.jobs);
        setCompanies(companiesRes.data.companies);
        setApplications(appsRes.data.applications);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Total Jobs', value: jobs.length, icon: <Briefcase size={22} />, from: '#6366f1', to: '#8b5cf6', change: 'Active listings' },
    { label: 'Applications', value: applications.length, icon: <Users size={22} />, from: '#06b6d4', to: '#3b82f6', change: 'Total received' },
    { label: 'Companies', value: companies.length, icon: <Building2 size={22} />, from: '#10b981', to: '#06b6d4', change: 'Managed by you' },
    { label: 'Pending', value: applications.filter((a) => a.status === 'pending').length, icon: <Clock size={22} />, from: '#f59e0b', to: '#ef4444', change: 'Need review' },
  ];

  if (loading) return <div className="flex justify-center py-32"><Spinner size="lg" /></div>;

  return (
    <div className="page-container animate-fade-in">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="section-title flex items-center gap-3"><LayoutDashboard size={28} className="text-primary-400" /> Dashboard</h1>
          <p className="text-gray-400">Overview of your recruitment activity</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/company" className="btn-secondary py-2 px-4 text-sm"><Building2 size={15} /> Company</Link>
          <Link to="/admin/post-job" className="btn-primary py-2 px-4 text-sm"><PlusCircle size={15} /> Post Job</Link>
        </div>
      </div>

      <DashboardCards stats={stats} />

      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        {/* Recent Jobs */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-lg">Recent Jobs</h3>
            <Link to="/admin/jobs" className="text-primary-400 text-sm flex items-center gap-1 hover:text-primary-300">View all <ArrowRight size={14} /></Link>
          </div>
          <div className="space-y-3">
            {jobs.slice(0, 5).map((job) => (
              <div key={job._id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                <div>
                  <p className="text-white text-sm font-medium">{job.title}</p>
                  <p className="text-gray-500 text-xs flex items-center gap-1 mt-0.5"><MapPin size={10} /> {job.location}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{job.applicants?.length || 0} applicants</span>
                  <span className={`badge text-xs ${job.isActive ? 'badge-green' : 'badge-gray'}`}>{job.isActive ? 'Active' : 'Closed'}</span>
                </div>
              </div>
            ))}
            {jobs.length === 0 && <p className="text-gray-500 text-sm text-center py-4">No jobs posted yet</p>}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-lg">Recent Applications</h3>
            <Link to="/admin/applicants" className="text-primary-400 text-sm flex items-center gap-1 hover:text-primary-300">View all <ArrowRight size={14} /></Link>
          </div>
          <div className="space-y-3">
            {applications.slice(0, 5).map((app) => (
              <div key={app._id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white">
                    {app.userId?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{app.userId?.name}</p>
                    <p className="text-gray-500 text-xs">{app.jobId?.title}</p>
                  </div>
                </div>
                <span className={`badge text-xs ${
                  app.status === 'accepted' ? 'badge-green' :
                  app.status === 'rejected' ? 'badge-red' :
                  app.status === 'reviewing' ? 'badge-indigo' : 'badge-yellow'
                }`}>{app.status}</span>
              </div>
            ))}
            {applications.length === 0 && <p className="text-gray-500 text-sm text-center py-4">No applications yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
