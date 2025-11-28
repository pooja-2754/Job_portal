import React, { useState, useEffect } from 'react';
import { companyService } from '../services/companyService';
import type { Company, CompanyStatus } from '../types/job.types';
import { AdminRoute } from '../components/RoleBasedRoute';

const AdminDashboardContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'verified' | 'rejected' | 'all'>('pending');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const tabs = [
    { id: 'pending' as const, label: 'Pending Verification', count: 0 },
    { id: 'verified' as const, label: 'Verified', count: 0 },
    { id: 'rejected' as const, label: 'Rejected', count: 0 },
    { id: 'all' as const, label: 'All Companies', count: 0 },
  ];

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data: Company[] = [];
      
      if (activeTab === 'all') {
        data = await companyService.getAllCompanies();
      } else if (activeTab === 'pending') {
        data = await companyService.getCompaniesByStatus('PENDING');
      } else if (activeTab === 'verified') {
        data = await companyService.getCompaniesByStatus('VERIFIED');
      } else if (activeTab === 'rejected') {
        data = await companyService.getCompaniesByStatus('REJECTED');
      }
      
      setCompanies(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch companies');
    } finally {
      setLoading(false);
    }
  };

  const fetchTabCounts = async () => {
    try {
      const [pending, verified, rejected, all] = await Promise.all([
        companyService.getCompaniesByStatus('PENDING'),
        companyService.getCompaniesByStatus('VERIFIED'),
        companyService.getCompaniesByStatus('REJECTED'),
        companyService.getAllCompanies(),
      ]);

      tabs[0].count = pending.length;
      tabs[1].count = verified.length;
      tabs[2].count = rejected.length;
      tabs[3].count = all.length;
    } catch (err) {
      console.error('Failed to fetch tab counts:', err);
    }
  };

  useEffect(() => {
    fetchCompanies();
    fetchTabCounts();
  }, [activeTab, refreshTrigger]);

  const handleVerifyCompany = async (company: Company, status: CompanyStatus) => {
    try {
      await companyService.verifyCompany(company.id, status);
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify company');
    }
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

  if (loading && companies.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Manage company verifications and platform administration</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-1">
              <p className="text-red-600">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-4 text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Companies List */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      ) : companies.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
          <p className="text-gray-500">
            {activeTab === 'pending' 
              ? 'No companies are currently pending verification.'
              : `No ${activeTab} companies found.`
            }
          </p>
        </div>
      ) : (
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

                  {company.ownerId && (
                    <div className="mt-2 text-sm text-gray-500">
                      <span className="font-medium">Owner ID:</span> {company.ownerId}
                    </div>
                  )}

                  {company.createdAt && (
                    <div className="mt-2 text-xs text-gray-400">
                      Created: {new Date(company.createdAt).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {/* Admin Actions */}
                <div className="flex flex-col space-y-2 ml-4">
                  {company.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleVerifyCompany(company, 'VERIFIED')}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleVerifyCompany(company, 'REJECTED')}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  
                  {company.status === 'VERIFIED' && (
                    <button
                      onClick={() => handleVerifyCompany(company, 'REJECTED')}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Revoke Access
                    </button>
                  )}
                  
                  {company.status === 'REJECTED' && (
                    <button
                      onClick={() => handleVerifyCompany(company, 'VERIFIED')}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      Approve
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Wrap the component with AdminRoute for access control
export const AdminDashboard: React.FC = () => (
  <AdminRoute>
    <AdminDashboardContent />
  </AdminRoute>
);