import { useEffect, useState } from 'react';
import { createCompany, getCompanies, updateCompany } from '../../services/company.service';
import toast from 'react-hot-toast';
import Spinner from '../../components/Spinner';
import { Building2, Plus, Edit3, Save, X, Globe, MapPin } from 'lucide-react';

const CompanySetup = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ companyName: '', description: '', website: '', location: '', industry: '', size: '' });

  const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'Education', 'Retail', 'Manufacturing', 'Media', 'Other'];
  const SIZES = ['1-10', '11-50', '51-200', '201-500', '500+'];

  useEffect(() => {
    getCompanies()
      .then((res) => setCompanies(res.data.companies))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const resetForm = () => {
    setForm({ companyName: '', description: '', website: '', location: '', industry: '', size: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (company) => {
    setForm({
      companyName: company.companyName,
      description: company.description || '',
      website: company.website || '',
      location: company.location || '',
      industry: company.industry || '',
      size: company.size || '',
    });
    setEditingId(company._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.companyName.trim()) return toast.error('Company name is required');
    setSaving(true);
    try {
      if (editingId) {
        const res = await updateCompany(editingId, form);
        setCompanies((prev) => prev.map((c) => (c._id === editingId ? res.data.company : c)));
        toast.success('Company updated!');
      } else {
        const res = await createCompany(form);
        setCompanies((prev) => [res.data.company, ...prev]);
        toast.success('Company created!');
      }
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save company');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container max-w-3xl animate-fade-in">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="section-title flex items-center gap-3">
            <Building2 size={28} className="text-primary-400" /> Company Setup
          </h1>
          <p className="text-gray-400">Manage your company profiles</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn-primary py-2 px-4 text-sm">
            <Plus size={15} /> Add Company
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-6 space-y-4 animate-slide-up">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-semibold">{editingId ? 'Edit Company' : 'New Company'}</h3>
            <button type="button" onClick={resetForm} className="text-gray-400 hover:text-white">
              <X size={18} />
            </button>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Company Name *</label>
            <input className="input-field" required value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} placeholder="e.g. TechCorp Inc." />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Description</label>
            <textarea className="input-field resize-none" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description of your company..." />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1.5 flex items-center gap-1"><Globe size={12} /> Website</label>
              <input className="input-field" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://yourcompany.com" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 flex items-center gap-1"><MapPin size={12} /> Location</label>
              <input className="input-field" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. New York, USA" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Industry</label>
              <select className="input-field" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })}>
                <option value="" className="bg-dark-700">Select industry...</option>
                {INDUSTRIES.map((i) => <option key={i} value={i} className="bg-dark-700">{i}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Company Size</label>
              <select className="input-field" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })}>
                <option value="" className="bg-dark-700">Select size...</option>
                {SIZES.map((s) => <option key={s} value={s} className="bg-dark-700">{s} employees</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={resetForm} className="btn-secondary py-2 px-4 text-sm"><X size={15} /> Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center py-2 text-sm">
              {saving ? <Spinner size="sm" /> : editingId ? <Save size={15} /> : <Plus size={15} />}
              {saving ? 'Saving...' : editingId ? 'Update Company' : 'Create Company'}
            </button>
          </div>
        </form>
      )}

      {/* Company List */}
      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : companies.length === 0 && !showForm ? (
        <div className="text-center py-20 glass rounded-2xl">
          <Building2 size={48} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No companies yet</h3>
          <p className="text-gray-500 mb-6">Create a company profile to start posting jobs</p>
          <button onClick={() => setShowForm(true)} className="btn-primary inline-flex"><Plus size={15} /> Add Company</button>
        </div>
      ) : (
        <div className="space-y-4">
          {companies.map((company) => (
            <div key={company._id} className="card flex items-start justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/20 to-violet-500/20 border border-primary-500/20 flex items-center justify-center text-2xl font-bold text-primary-400 flex-shrink-0">
                  {company.companyName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">{company.companyName}</h3>
                  <div className="flex flex-wrap gap-3 mt-1">
                    {company.location && (
                      <span className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={10} /> {company.location}</span>
                    )}
                    {company.industry && (
                      <span className="badge-indigo text-xs">{company.industry}</span>
                    )}
                    {company.size && (
                      <span className="text-xs text-gray-500">{company.size} employees</span>
                    )}
                  </div>
                  {company.description && (
                    <p className="text-gray-500 text-sm mt-2 line-clamp-2 max-w-md">{company.description}</p>
                  )}
                  {company.website && (
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-primary-400 text-xs flex items-center gap-1 mt-1 hover:text-primary-300">
                      <Globe size={10} /> {company.website}
                    </a>
                  )}
                </div>
              </div>
              <button onClick={() => handleEdit(company)} className="btn-secondary py-2 px-4 text-sm">
                <Edit3 size={14} /> Edit
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanySetup;
