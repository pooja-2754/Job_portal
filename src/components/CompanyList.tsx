import React, { useState, useEffect } from 'react';
import { companyService } from '../services/companyService';
import type { Company, CompanyStatus } from '../types/job.types';

interface CompanyListProps {
  showActions?: boolean;
  onEdit?: (company: Company) => void;
  onDelete?: (company: Company) => void;
  onVerify?: (company: Company) => void;
  refreshTrigger?: number;
}

export const CompanyList: React.FC<CompanyListProps> = ({
  showActions = true,
  onEdit,
  onDelete,
  onVerify,
  refreshTrigger
}) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true
  });
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const fetchCompanies = async (page?: number, size?: number, sortBy?: string, sortDir?: 'asc' | 'desc') => {
    try {
      setLoading(true);
      setError(null);
      const data = await companyService.getMyCompanies({
        page: page ?? pagination.page,
        size: size ?? pagination.size,
        sortBy: sortBy ?? sortBy,
        sortDir: sortDir ?? sortDir
      });
      setCompanies(data.content);
      setPagination({
        page: data.number,
        size: data.size,
        totalElements: data.totalElements,
        totalPages: data.totalPages,
        first: data.first,
        last: data.last
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch companies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [refreshTrigger]);

  const handlePageChange = (newPage: number) => {
    fetchCompanies(newPage, pagination.size, sortBy, sortDir);
  };

  const handleSort = (field: string) => {
    const newSortDir = sortBy === field && sortDir === 'asc' ? 'desc' : 'asc';
    setSortBy(field);
    setSortDir(newSortDir);
    fetchCompanies(pagination.page, pagination.size, field, newSortDir);
  };

  const getStatusBadge = (status?: CompanyStatus) => {
    if (!status) return null;

    const statusStyles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      VERIFIED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}>
        {status}
      </span>
    );
  };

  const handleDelete = async (company: Company) => {
    if (!window.confirm(`Are you sure you want to delete ${company.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      await companyService.deleteCompany(company.id);
      // Refresh the current page to update the list
      fetchCompanies(pagination.page, pagination.size, sortBy, sortDir);
      onDelete?.(company);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete company');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => fetchCompanies(pagination.page, pagination.size, sortBy, sortDir)}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No companies yet</h3>
        <p className="text-gray-500">Get started by creating your first company.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Sort controls */}
      <div className="mb-4 flex items-center space-x-4">
        <span className="text-sm text-gray-600">Sort by:</span>
        <button
          onClick={() => handleSort('name')}
          className={`text-sm px-3 py-1 rounded ${
            sortBy === 'name'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Name {sortBy === 'name' && (sortDir === 'asc' ? '↑' : '↓')}
        </button>
        <button
          onClick={() => handleSort('createdAt')}
          className={`text-sm px-3 py-1 rounded ${
            sortBy === 'createdAt'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Created Date {sortBy === 'createdAt' && (sortDir === 'asc' ? '↑' : '↓')}
        </button>
        <button
          onClick={() => handleSort('status')}
          className={`text-sm px-3 py-1 rounded ${
            sortBy === 'status'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Status {sortBy === 'status' && (sortDir === 'asc' ? '↑' : '↓')}
        </button>
      </div>

      {/* Company list */}
      <div className="space-y-4">
        {companies.map((company) => (
        <div key={company.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                {getStatusBadge(company.status)}
              </div>
              
              <p className="text-gray-600 mb-3 line-clamp-2">{company.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                {company.website && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                    </svg>
                    <a 
                      href={company.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 truncate"
                    >
                      {company.website}
                    </a>
                  </div>
                )}
                
                {company.location && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{company.location}</span>
                  </div>
                )}
                
                {company.industry && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="truncate">{company.industry}</span>
                  </div>
                )}
              </div>

              {company.size && (
                <div className="mt-2 text-sm text-gray-500">
                  <span className="font-medium">Size:</span> {company.size} employees
                </div>
              )}

              {company.createdAt && (
                <div className="mt-2 text-xs text-gray-400">
                  Created: {new Date(company.createdAt).toLocaleDateString()}
                </div>
              )}
            </div>

            {showActions && (
              <div className="flex flex-col space-y-2 ml-4">
                <button
                  onClick={() => onEdit?.(company)}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Edit
                </button>
                
                {company.status === 'PENDING' && onVerify && (
                  <button
                    onClick={() => onVerify(company)}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Verify
                  </button>
                )}
                
                <button
                  onClick={() => handleDelete(company)}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
      </div>

      {/* Pagination controls */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {pagination.page * pagination.size + 1} to{' '}
            {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of{' '}
            {pagination.totalElements} companies
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.first}
              className={`px-3 py-1 text-sm rounded ${
                pagination.first
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            
            <span className="px-3 py-1 text-sm text-gray-700">
              Page {pagination.page + 1} of {pagination.totalPages}
            </span>
            
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.last}
              className={`px-3 py-1 text-sm rounded ${
                pagination.last
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};