import { X, SlidersHorizontal } from 'lucide-react';

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
const EXPERIENCE_LEVELS = ['0-1 years', '1-3 years', '3-5 years', '5+ years'];
const CATEGORIES = ['Technology', 'Marketing', 'Finance', 'Healthcare', 'Education', 'Design', 'Sales', 'Engineering'];

const FilterPanel = ({ filters, onChange, onClear }) => {
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="glass rounded-2xl p-5 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-primary-400" /> Filters
        </h3>
        {hasFilters && (
          <button
            onClick={onClear}
            className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1"
          >
            <X size={12} /> Clear all
          </button>
        )}
      </div>

      {/* Job Type */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Job Type</p>
        <div className="space-y-2">
          {JOB_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="jobType"
                value={type}
                checked={filters.jobType === type}
                onChange={() =>
                  onChange({ ...filters, jobType: filters.jobType === type ? '' : type })
                }
                className="accent-primary-500"
              />
              <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Experience</p>
        <div className="space-y-2">
          {EXPERIENCE_LEVELS.map((level) => (
            <label key={level} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="experience"
                value={level}
                checked={filters.experience === level}
                onChange={() =>
                  onChange({ ...filters, experience: filters.experience === level ? '' : level })
                }
                className="accent-primary-500"
              />
              <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{level}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Category</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onChange({ ...filters, category: filters.category === cat ? '' : cat })}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 ${
                filters.category === cat
                  ? 'bg-primary-500/30 border-primary-500/50 text-primary-300'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:border-primary-500/30 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
