import { useState } from 'react';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';
import clsx from 'clsx';

export interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: unknown) => React.ReactNode;
  sortable?: boolean;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading: boolean;
  pageSize?: number;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  searchFields?: (keyof T)[];
}

export default function Table<T extends { id?: string | number }>({
  columns,
  data,
  loading,
  pageSize = 10,
  onEdit,
  onDelete,
  searchFields = [],
}: TableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null);

  // Filter data
  const filteredData = data.filter(item => {
    if (!searchTerm) return true;
    return searchFields.some(field => {
      const value = item[field];
      return String(value).toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  // Sort data
  let sortedData = [...filteredData];
  if (sortConfig) {
    sortedData.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (key: keyof T) => {
    setSortConfig(prev => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="space-y-3 text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading data...</p>
        </div>
      </div>
    );
  }

  if (filteredData.length === 0) {
    return (
      <div className="glass-effect rounded-xl p-12 text-center card-shadow">
        <div className="w-16 h-16 mx-auto mb-4 opacity-50">
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 3.5a7.5 7.5 0 0013.15 13.15z" />
          </svg>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg font-semibold">No data found</p>
        <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      {searchFields.length > 0 && (
        <div className="relative">
          <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="input-field pl-11"
          />
        </div>
      )}

      {/* Table Container */}
      <div className="glass-effect rounded-xl overflow-hidden card-shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header border-b border-gray-200 dark:border-gray-700">
                {columns.map(column => (
                  <th
                    key={String(column.key)}
                    onClick={() => column.sortable && handleSort(column.key)}
                    className={clsx(
                      'px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100',
                      column.sortable && 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 select-none',
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span>{column.header}</span>
                      {column.sortable && sortConfig?.key === column.key && (
                        sortConfig.direction === 'asc' ? (
                          <ChevronUp className="w-4 h-4 text-blue-600" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-blue-600" />
                        )
                      )}
                    </div>
                  </th>
                ))}
                {(onEdit || onDelete) && (
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, idx) => (
                <tr
                  key={item.id || idx}
                  className={clsx(
                    'table-row transition-colors duration-150',
                    idx % 2 === 0
                      ? ''
                      : 'bg-gray-50/50 dark:bg-gray-800/30',
                  )}
                >
                  {columns.map(column => (
                    <td key={String(column.key)} className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      {column.render ? column.render(item[column.key]) : String(item[column.key] || '-')}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-6 py-4">
                      <div className="flex gap-2 items-center">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            className="inline-flex items-center justify-center w-8 h-8 p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200"
                            title="Edit"
                            aria-label="Edit item"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(item)}
                            className="inline-flex items-center justify-center w-8 h-8 p-1.5 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors duration-200"
                            title="Delete"
                            aria-label="Delete item"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Showing <span className="text-gray-900 dark:text-gray-100">{(currentPage - 1) * pageSize + 1}</span> to <span className="text-gray-900 dark:text-gray-100">{Math.min(currentPage * pageSize, sortedData.length)}</span> of <span className="text-gray-900 dark:text-gray-100">{sortedData.length}</span>
          </p>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="btn-secondary !px-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={clsx(
                    'w-9 h-9 rounded-lg font-medium transition-all duration-200',
                    currentPage === page
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600',
                  )}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="btn-secondary !px-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
