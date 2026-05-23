import React, { useState, useEffect, useCallback } from 'react';
import { AdminRoute } from '../components/RoleBasedRoute';
import { adminService, type AdminStats, type AdminUser, type AdminCompany, type AdminApplication } from '../services/adminService';
import { Navbar } from '../components/Navbar';
import {
  Users,
  Building2,
  Briefcase,
  FileText,
  CheckCircle,
  XCircle,
  Trash2,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Clock,
} from 'lucide-react';

type Tab = 'stats' | 'companies' | 'users' | 'applications';

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    VERIFIED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    PENDING_VERIFICATION: 'bg-yellow-100 text-yellow-800',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status.replace('_', ' ')}
    </span>
  );
};

const AdminDashboardContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('stats');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Companies state
  const [companies, setCompanies] = useState<AdminCompany[]>([]);
  const [companyPage, setCompanyPage] = useState(0);
  const [companyTotalPages, setCompanyTotalPages] = useState(0);
  const [companyLoading, setCompanyLoading] = useState(false);

  // Users state
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [userPage, setUserPage] = useState(0);
  const [userTotalPages, setUserTotalPages] = useState(0);
  const [userLoading, setUserLoading] = useState(false);

  // Applications state
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [appPage, setAppPage] = useState(0);
  const [appTotalPages, setAppTotalPages] = useState(0);
  const [appLoading, setAppLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const showError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(null), 5000);
  };

  useEffect(() => {
    adminService.getStats()
      .then(setStats)
      .catch(() => showError('Failed to load stats'))
      .finally(() => setStatsLoading(false));
  }, []);

  const loadCompanies = useCallback(async (page: number) => {
    try {
      setCompanyLoading(true);
      const data = await adminService.getCompanies(page, 15);
      setCompanies(data.content);
      setCompanyTotalPages(data.totalPages);
      setCompanyPage(data.number);
    } catch {
      showError('Failed to load companies');
    } finally {
      setCompanyLoading(false);
    }
  }, []);

  const loadUsers = useCallback(async (page: number) => {
    try {
      setUserLoading(true);
      const data = await adminService.getUsers(page, 20);
      setUsers(data.content);
      setUserTotalPages(data.totalPages);
      setUserPage(data.number);
    } catch {
      showError('Failed to load users');
    } finally {
      setUserLoading(false);
    }
  }, []);

  const loadApplications = useCallback(async (page: number) => {
    try {
      setAppLoading(true);
      const data = await adminService.getApplications(page, 20);
      setApplications(data.content);
      setAppTotalPages(data.totalPages);
      setAppPage(data.number);
    } catch {
      showError('Failed to load applications');
    } finally {
      setAppLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'companies') loadCompanies(0);
    else if (activeTab === 'users') loadUsers(0);
    else if (activeTab === 'applications') loadApplications(0);
  }, [activeTab]);

  const handleVerify = async (id: number) => {
    try {
      setActionLoading(id);
      await adminService.verifyCompany(id);
      setCompanies(prev => prev.map(c => c.id === id ? { ...c, verificationStatus: 'VERIFIED' } : c));
      if (stats) setStats({ ...stats, pendingCompanies: stats.pendingCompanies - 1, verifiedCompanies: stats.verifiedCompanies + 1 });
    } catch {
      showError('Failed to verify company');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: number) => {
    try {
      setActionLoading(id);
      await adminService.rejectCompany(id);
      setCompanies(prev => prev.map(c => c.id === id ? { ...c, verificationStatus: 'REJECTED' } : c));
      if (stats) setStats({ ...stats, pendingCompanies: Math.max(0, stats.pendingCompanies - 1) });
    } catch {
      showError('Failed to reject company');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteCompany = async (id: number) => {
    if (!window.confirm('Delete this company? This cannot be undone.')) return;
    try {
      setActionLoading(id);
      await adminService.deleteCompany(id);
      setCompanies(prev => prev.filter(c => c.id !== id));
      if (stats) setStats({ ...stats, totalCompanies: stats.totalCompanies - 1 });
    } catch {
      showError('Failed to delete company');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return;
    try {
      setActionLoading(id);
      await adminService.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      if (stats) setStats({ ...stats, totalUsers: stats.totalUsers - 1 });
    } catch {
      showError('Failed to delete user');
    } finally {
      setActionLoading(null);
    }
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'stats', label: 'Overview', icon: BarChart3 },
    { id: 'companies', label: 'Companies', icon: Building2 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'applications', label: 'Applications', icon: FileText },
  ];

  const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString() : '—';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage users, companies, and platform data</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-3 px-1 border-b-2 font-medium text-sm gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div>
            {statsLoading ? (
              <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
            ) : stats ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {[
                  { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'Total Companies', value: stats.totalCompanies, icon: Building2, color: 'text-purple-600', bg: 'bg-purple-50' },
                  { label: 'Total Jobs', value: stats.totalJobs, icon: Briefcase, color: 'text-green-600', bg: 'bg-green-50' },
                  { label: 'Total Applications', value: stats.totalApplications, icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50' },
                  { label: 'Active Jobs', value: stats.activeJobs, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
                  { label: 'Pending Companies', value: stats.pendingCompanies, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
                  { label: 'Verified Companies', value: stats.verifiedCompanies, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${s.bg}`}>
                      <s.icon className={`w-6 h-6 ${s.color}`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{s.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Could not load stats.</p>
            )}
          </div>
        )}

        {/* Companies Tab */}
        {activeTab === 'companies' && (
          <div>
            {companyLoading ? (
              <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
            ) : (
              <>
                <div className="space-y-3">
                  {companies.length === 0 && <p className="text-gray-500 text-center py-8">No companies found.</p>}
                  {companies.map(company => (
                    <div key={company.id} className="bg-white border border-gray-200 rounded-lg p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{company.name}</h3>
                            <StatusBadge status={company.verificationStatus} />
                          </div>
                          {company.industry && <p className="text-sm text-gray-500">{company.industry}</p>}
                          {company.description && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{company.description}</p>}
                          <p className="text-xs text-gray-400 mt-1">Created {formatDate(company.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {(company.verificationStatus === 'PENDING' || company.verificationStatus === 'PENDING_VERIFICATION') && (
                            <>
                              <button
                                onClick={() => handleVerify(company.id)}
                                disabled={actionLoading === company.id}
                                className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50"
                              >
                                {actionLoading === company.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(company.id)}
                                disabled={actionLoading === company.id}
                                className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50"
                              >
                                {actionLoading === company.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                                Reject
                              </button>
                            </>
                          )}
                          {company.verificationStatus === 'VERIFIED' && (
                            <button
                              onClick={() => handleReject(company.id)}
                              disabled={actionLoading === company.id}
                              className="flex items-center gap-1 px-3 py-1.5 border border-red-300 text-red-600 text-sm rounded-lg hover:bg-red-50 disabled:opacity-50"
                            >
                              <XCircle className="w-3 h-3" />
                              Revoke
                            </button>
                          )}
                          {company.verificationStatus === 'REJECTED' && (
                            <button
                              onClick={() => handleVerify(company.id)}
                              disabled={actionLoading === company.id}
                              className="flex items-center gap-1 px-3 py-1.5 border border-green-300 text-green-600 text-sm rounded-lg hover:bg-green-50 disabled:opacity-50"
                            >
                              <CheckCircle className="w-3 h-3" />
                              Approve
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteCompany(company.id)}
                            disabled={actionLoading === company.id}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                            title="Delete company"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Pagination
                  currentPage={companyPage}
                  totalPages={companyTotalPages}
                  onPageChange={(p) => loadCompanies(p)}
                />
              </>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            {userLoading ? (
              <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
            ) : (
              <>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.length === 0 && (
                        <tr><td colSpan={5} className="text-center py-8 text-gray-500">No users found.</td></tr>
                      )}
                      {users.map(u => (
                        <tr key={u.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{u.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{u.email}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">{formatDate(u.createdAt)}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              disabled={actionLoading === u.id}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                              title="Delete user"
                            >
                              {actionLoading === u.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination
                  currentPage={userPage}
                  totalPages={userTotalPages}
                  onPageChange={(p) => loadUsers(p)}
                />
              </>
            )}
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div>
            {appLoading ? (
              <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
            ) : (
              <>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicant</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {applications.length === 0 && (
                        <tr><td colSpan={5} className="text-center py-8 text-gray-500">No applications found.</td></tr>
                      )}
                      {applications.map(app => (
                        <tr key={app.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium text-gray-900">{app.applicantName}</div>
                            <div className="text-xs text-gray-500">{app.applicantEmail}</div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{app.jobTitle}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{app.jobCompany}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                              {app.statusDisplayName || app.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">{formatDate(app.appliedDate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination
                  currentPage={appPage}
                  totalPages={appTotalPages}
                  onPageChange={(p) => loadApplications(p)}
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Pagination: React.FC<{ currentPage: number; totalPages: number; onPageChange: (p: number) => void }> = ({
  currentPage, totalPages, onPageChange,
}) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-sm text-gray-700">Page {currentPage + 1} of {totalPages}</p>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="p-2 rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-50"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className="p-2 rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-50"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const AdminDashboard: React.FC = () => (
  <AdminRoute>
    <AdminDashboardContent />
  </AdminRoute>
);
