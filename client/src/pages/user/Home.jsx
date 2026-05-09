import { useState, useEffect, useCallback } from 'react';
import { Briefcase, TrendingUp, Zap } from 'lucide-react';
import { getAllJobs } from '../../services/job.service';
import JobCard from '../../components/JobCard';
import SearchBar from '../../components/SearchBar';
import FilterPanel from '../../components/FilterPanel';
import Spinner from '../../components/Spinner';

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({ keyword: '', location: '' });
  const [filters, setFilters] = useState({ jobType: '', experience: '', category: '' });

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...searchParams, ...filters };
      const res = await getAllJobs(params);
      setJobs(res.data.jobs);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [searchParams, filters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSearch = (params) => setSearchParams(params);
  const handleFilterChange = (newFilters) => setFilters(newFilters);
  const handleClearFilters = () => setFilters({ jobType: '', experience: '', category: '' });

  return (
    <div className="page-container">
      {/* Hero Section */}
      <div className="text-center mb-12 animate-fade-in">
        <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-1.5 text-primary-400 text-sm font-medium mb-6">
          <Zap size={14} /> {jobs.length}+ jobs available
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
          Find your dream job and connect with{' '}
          <span className="bg-gradient-to-r from-primary-400 to-violet-400 bg-clip-text text-transparent">
            top companies.
          </span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">
          Linking Talent with Opportunity. Your next career move starts here.
        </p>
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { icon: <Briefcase size={20} />, value: `${jobs.length}+`, label: 'Live Jobs' },
          { icon: <TrendingUp size={20} />, value: '500+', label: 'Companies' },
          { icon: <Zap size={20} />, value: '10k+', label: 'Hired' },
        ].map((s, i) => (
          <div key={i} className="glass rounded-2xl p-4 text-center">
            <div className="text-primary-400 flex justify-center mb-2">{s.icon}</div>
            <p className="text-xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* About Section */}
      <div className="card mb-12 text-center py-10 px-6">
        <h2 className="text-2xl font-bold text-white mb-4">About CareerLink</h2>
        <p className="text-gray-400 max-w-3xl mx-auto leading-relaxed text-lg">
          CareerLink is your ultimate destination for professional growth. We bridge the gap between exceptional talent and industry-leading companies. Whether you're taking your first career step or looking for your next big leap, we provide the tools, connections, and opportunities to make it happen.
        </p>
      </div>

      {/* Content Grid */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <FilterPanel filters={filters} onChange={handleFilterChange} onClear={handleClearFilters} />
        </aside>

        {/* Job Listings */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">
              {loading ? 'Loading...' : `${jobs.length} job${jobs.length !== 1 ? 's' : ''} found`}
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Spinner size="lg" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20 glass rounded-2xl">
              <Briefcase size={48} className="text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No jobs found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
