import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getProfile } from '../../services/user.service';
import JobCard from '../../components/JobCard';
import Spinner from '../../components/Spinner';
import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';

const SavedJobs = () => {
  const { user, updateUser } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then((res) => {
        const jobs = res.data.user.savedJobs || [];
        setSavedJobs(jobs.filter((j) => j && typeof j === 'object'));
      })
      .catch(() => setSavedJobs([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSaveToggle = (jobId, isSaved) => {
    if (!isSaved) setSavedJobs((prev) => prev.filter((j) => j._id !== jobId));
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="mb-8">
        <h1 className="section-title">Saved Jobs</h1>
        <p className="text-gray-400">Jobs you've bookmarked for later</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : savedJobs.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl">
          <Bookmark size={48} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No saved jobs</h3>
          <p className="text-gray-500 mb-6">Bookmark jobs you're interested in</p>
          <Link to="/" className="btn-primary inline-flex">Browse Jobs</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedJobs.map((job) => (
            <JobCard key={job._id} job={job} onSaveToggle={handleSaveToggle} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
