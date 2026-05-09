import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob } from '../../services/job.service';
import { getCompanies } from '../../services/company.service';
import toast from 'react-hot-toast';
import Spinner from '../../components/Spinner';
import { PlusCircle, X, Plus, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
const EXPERIENCE_LEVELS = ['0-1 years', '1-3 years', '3-5 years', '5+ years'];
const CATEGORIES = ['Technology', 'Marketing', 'Finance', 'Healthcare', 'Education', 'Design', 'Sales', 'Engineering'];

const PostJob = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newReq, setNewReq] = useState('');
  const [form, setForm] = useState({
    title: '', description: '', salary: '', location: '',
    jobType: 'Full-time', experience: '0-1 years', category: '',
    companyId: '', skills: [], requirements: [],
  });

  useEffect(() => {
    getCompanies().then((res) => {
      setCompanies(res.data.companies);
      if (res.data.companies.length > 0) {
        setForm((f) => ({ ...f, companyId: res.data.companies[0]._id }));
      }
    }).catch(() => {});
  }, []);

  const addSkill = () => {
    if (newSkill.trim() && !form.skills.includes(newSkill.trim())) {
      setForm({ ...form, skills: [...form.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const addReq = () => {
    if (newReq.trim()) {
      setForm({ ...form, requirements: [...form.requirements, newReq.trim()] });
      setNewReq('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.companyId) return toast.error('Please select or create a company first.');
    setLoading(true);
    try {
      await createJob(form);
      toast.success('Job posted successfully! 🎉');
      navigate('/admin/jobs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container max-w-3xl animate-fade-in">
      <div className="mb-8">
        <h1 className="section-title flex items-center gap-3"><PlusCircle size={28} className="text-primary-400" /> Post a Job</h1>
        <p className="text-gray-400">Fill in the details to attract the right candidates</p>
      </div>

      {companies.length === 0 ? (
        <div className="card text-center py-10">
          <Building2 size={48} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Company Found</h3>
          <p className="text-gray-400 mb-6">You need to create a company before posting jobs</p>
          <Link to="/admin/company" className="btn-primary inline-flex">Create Company</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card space-y-4">
            <h3 className="text-white font-semibold text-lg">Basic Information</h3>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Job Title *</label>
              <input className="input-field" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Senior React Developer" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Company *</label>
              <select className="input-field" value={form.companyId} onChange={(e) => setForm({ ...form, companyId: e.target.value })}>
                {companies.map((c) => <option key={c._id} value={c._id} className="bg-dark-700">{c.companyName}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Description *</label>
              <textarea className="input-field resize-none" rows={5} required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the role, responsibilities, and what makes this opportunity great..." />
            </div>
          </div>

          <div className="card space-y-4">
            <h3 className="text-white font-semibold text-lg">Job Details</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Location *</label>
                <input className="input-field" required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. New York, Remote" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Salary</label>
                <input className="input-field" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} placeholder="e.g. $80k - $120k/year" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Job Type</label>
                <select className="input-field" value={form.jobType} onChange={(e) => setForm({ ...form, jobType: e.target.value })}>
                  {JOB_TYPES.map((t) => <option key={t} value={t} className="bg-dark-700">{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Experience</label>
                <select className="input-field" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })}>
                  {EXPERIENCE_LEVELS.map((l) => <option key={l} value={l} className="bg-dark-700">{l}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm text-gray-400 mb-1.5 block">Category</label>
                <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  <option value="" className="bg-dark-700">Select category...</option>
                  {CATEGORIES.map((c) => <option key={c} value={c} className="bg-dark-700">{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="card space-y-4">
            <h3 className="text-white font-semibold text-lg">Skills Required</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.skills.map((s) => (
                <span key={s} className="badge-indigo flex items-center gap-1">
                  {s} <button type="button" onClick={() => setForm({ ...form, skills: form.skills.filter((x) => x !== s) })}><X size={10} /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input className="input-field flex-1" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} placeholder="e.g. React, Node.js, Python" />
              <button type="button" onClick={addSkill} className="btn-secondary py-2 px-4 text-sm"><Plus size={15} /> Add</button>
            </div>
          </div>

          <div className="card space-y-4">
            <h3 className="text-white font-semibold text-lg">Requirements</h3>
            <div className="space-y-2 mb-2">
              {form.requirements.map((r, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-400 flex-shrink-0" />
                  {r}
                  <button type="button" onClick={() => setForm({ ...form, requirements: form.requirements.filter((_, j) => j !== i) })} className="ml-auto text-gray-500 hover:text-red-400"><X size={12} /></button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input className="input-field flex-1" value={newReq} onChange={(e) => setNewReq(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addReq())} placeholder="e.g. 3+ years of experience with React" />
              <button type="button" onClick={addReq} className="btn-secondary py-2 px-4 text-sm"><Plus size={15} /> Add</button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
            {loading ? <Spinner size="sm" /> : <PlusCircle size={18} />}
            {loading ? 'Posting Job...' : 'Post Job'}
          </button>
        </form>
      )}
    </div>
  );
};

export default PostJob;
