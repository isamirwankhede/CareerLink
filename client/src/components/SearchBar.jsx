import { useState } from 'react';
import { Search, MapPin, X } from 'lucide-react';

const SearchBar = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ keyword, location });
  };

  const handleClear = () => {
    setKeyword('');
    setLocation('');
    onSearch({ keyword: '', location: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-3 p-2 glass rounded-2xl border border-white/15">
        {/* Keyword */}
        <div className="flex-1 flex items-center gap-2 px-4">
          <Search size={18} className="text-gray-500 flex-shrink-0" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Job title, keywords, or skills..."
            className="bg-transparent w-full text-white placeholder-gray-500 focus:outline-none text-sm"
          />
          {keyword && (
            <button type="button" onClick={() => setKeyword('')} className="text-gray-500 hover:text-gray-300">
              <X size={14} />
            </button>
          )}
        </div>

        <div className="hidden sm:block w-px bg-white/10" />

        {/* Location */}
        <div className="flex-1 flex items-center gap-2 px-4">
          <MapPin size={18} className="text-gray-500 flex-shrink-0" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, state, or remote..."
            className="bg-transparent w-full text-white placeholder-gray-500 focus:outline-none text-sm"
          />
          {location && (
            <button type="button" onClick={() => setLocation('')} className="text-gray-500 hover:text-gray-300">
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex gap-2 px-2">
          {(keyword || location) && (
            <button type="button" onClick={handleClear} className="btn-secondary py-2 px-4 text-sm">
              Clear
            </button>
          )}
          <button type="submit" className="btn-primary py-2 px-6 text-sm">
            <Search size={15} /> Search
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
