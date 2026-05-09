import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile, getProfile } from '../../services/user.service';
import toast from 'react-hot-toast';
import Spinner from '../../components/Spinner';
import { User, MapPin, Phone, Briefcase, GraduationCap, Code, Edit3, Save, X, Plus, Link as LinkIcon } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', bio: '', location: '', phone: '', experience: '', education: '', resume: '', skills: [] });
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', bio: user.bio || '', location: user.location || '', phone: user.phone || '', experience: user.experience || '', education: user.education || '', resume: user.resume || '', skills: user.skills || [] });
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await updateProfile(form);
      updateUser(res.data.user);
      setEditing(false);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !form.skills.includes(newSkill.trim())) {
      setForm({ ...form, skills: [...form.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  return (
    <div className="page-container max-w-3xl animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-title">My Profile</h1>
          <p className="text-gray-400">Manage your professional information</p>
        </div>
        {editing ? (
          <div className="flex gap-2">
            <button onClick={() => setEditing(false)} className="btn-secondary py-2 px-4 text-sm"><X size={15} /> Cancel</button>
            <button onClick={handleSave} disabled={loading} className="btn-primary py-2 px-4 text-sm">
              {loading ? <Spinner size="sm" /> : <Save size={15} />} Save
            </button>
          </div>
        ) : (
          <button onClick={() => setEditing(true)} className="btn-primary py-2 px-4 text-sm"><Edit3 size={15} /> Edit Profile</button>
        )}
      </div>

      <div className="space-y-6">
        <div className="card flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center text-3xl font-bold text-white flex-shrink-0 shadow-glow">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
            <p className="text-gray-400">{user?.email}</p>
            <span className="badge badge-green mt-2">{user?.role}</span>
          </div>
        </div>

        <div className="card space-y-4">
          <h3 className="text-white font-semibold text-lg flex items-center gap-2"><User size={18} className="text-primary-400" /> Personal Information</h3>
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Full Name</label>
            {editing ? <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /> : <p className="text-white">{user?.name || '—'}</p>}
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Bio</label>
            {editing ? <textarea className="input-field resize-none" rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Tell recruiters about yourself..." /> : <p className="text-gray-300">{user?.bio || '—'}</p>}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1.5 flex items-center gap-1"><MapPin size={13} /> Location</label>
              {editing ? <input className="input-field" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="City, Country" /> : <p className="text-gray-300">{user?.location || '—'}</p>}
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 flex items-center gap-1"><Phone size={13} /> Phone</label>
              {editing ? <input className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 234 567 8900" /> : <p className="text-gray-300">{user?.phone || '—'}</p>}
            </div>
          </div>
        </div>

        <div className="card space-y-4">
          <h3 className="text-white font-semibold text-lg flex items-center gap-2"><Briefcase size={18} className="text-primary-400" /> Professional Details</h3>
          <div>
            <label className="text-sm text-gray-400 mb-1.5 flex items-center gap-1"><Briefcase size={13} /> Experience</label>
            {editing ? <textarea className="input-field resize-none" rows={3} value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} placeholder="3 years as Frontend Developer..." /> : <p className="text-gray-300 whitespace-pre-wrap">{user?.experience || '—'}</p>}
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1.5 flex items-center gap-1"><GraduationCap size={13} /> Education</label>
            {editing ? <textarea className="input-field resize-none" rows={2} value={form.education} onChange={(e) => setForm({ ...form, education: e.target.value })} placeholder="B.Tech Computer Science, 2020..." /> : <p className="text-gray-300">{user?.education || '—'}</p>}
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1.5 flex items-center gap-1"><LinkIcon size={13} /> Resume URL</label>
            {editing ? <input className="input-field" value={form.resume} onChange={(e) => setForm({ ...form, resume: e.target.value })} placeholder="https://drive.google.com/your-resume" /> : user?.resume ? <a href={user.resume} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline break-all">{user.resume}</a> : <p className="text-gray-500">—</p>}
          </div>
        </div>

        <div className="card">
          <h3 className="text-white font-semibold text-lg flex items-center gap-2 mb-4"><Code size={18} className="text-primary-400" /> Skills</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {(editing ? form.skills : user?.skills || []).map((skill) => (
              <span key={skill} className="badge-indigo flex items-center gap-1">
                {skill}
                {editing && <button onClick={() => setForm({ ...form, skills: form.skills.filter((s) => s !== skill) })} className="ml-1 hover:text-red-400"><X size={10} /></button>}
              </span>
            ))}
            {!(editing ? form.skills : user?.skills || []).length && <p className="text-gray-500 text-sm">No skills added yet</p>}
          </div>
          {editing && (
            <div className="flex gap-2">
              <input className="input-field flex-1" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} placeholder="Add a skill (press Enter)" />
              <button onClick={addSkill} className="btn-secondary py-2 px-4 text-sm"><Plus size={15} /> Add</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
