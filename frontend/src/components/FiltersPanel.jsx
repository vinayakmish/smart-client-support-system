import { useState, useEffect } from 'react';
import { IconSearch } from './Icons';

const FiltersPanel = ({ filters, onFilterChange, onReset }) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [categoryTerm, setCategoryTerm] = useState(filters.category || '');

  useEffect(() => {
    setSearchTerm(filters.search || '');
  }, [filters.search]);

  useEffect(() => {
    setCategoryTerm(filters.category || '');
  }, [filters.category]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== (filters.search || '')) {
        onFilterChange('search', searchTerm);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Debounce category input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (categoryTerm !== (filters.category || '')) {
        onFilterChange('category', categoryTerm);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [categoryTerm]);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 mb-6 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div>
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
            Search
          </label>
          <div className="relative">
            <IconSearch className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search title, description..."
              className="w-full pl-9 pr-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-xs outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-all placeholder-zinc-400"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
            Status
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-xs outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-all"
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
            Priority
          </label>
          <select
            value={filters.priority || ''}
            onChange={(e) => onFilterChange('priority', e.target.value)}
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-xs outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-all"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
            Category
          </label>
          <input
            type="text"
            value={categoryTerm}
            onChange={(e) => setCategoryTerm(e.target.value)}
            placeholder="Filter category..."
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-xs outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-all placeholder-zinc-400"
          />
        </div>
      </div>

      <div className="mt-3.5 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
        <button
          onClick={onReset}
          className="px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 rounded-md transition-colors cursor-pointer"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default FiltersPanel;
