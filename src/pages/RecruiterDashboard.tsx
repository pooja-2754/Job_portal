import React, { useState, useEffect } from 'react'
import { jobService } from '../services/jobService'
import type { Job, Company } from '../types/job.types'
import JobManagementList from '../components/JobManagementList'
import ApplicationManagement from '../components/ApplicationManagement'
import JobPostingForm from '../components/JobPostingForm'
import RecruiterSettings from '../components/RecruiterSettings'
import { CompanyList } from '../components/CompanyList'
import { CompanyCreateForm } from '../components/CompanyCreateForm'
import { CompanyEditForm } from '../components/CompanyEditForm'
import { Navbar } from '../components/Navbar'
import { RecruiterRoute } from '../components/RoleBasedRoute'
import {
  LayoutDashboard,
  Briefcase,
  Users,
  PlusCircle,
  Settings,
  LogOut,
  TrendingUp,
  FileText,
  AlertCircle,
  Clock,
  CheckCircle2,
  Building
} from 'lucide-react'

// Define View Types
type ViewType = 'overview' | 'jobs' | 'applications' | 'create-job' | 'companies' | 'create-company' | 'edit-company' | 'settings'

// Define Stats Interface
interface DashboardStats {
  totalJobs: number
  activeJobs: number
  totalApplications: number
  pendingApplications: number
}

// Sidebar Navigation Items
const SIDEBAR_ITEMS = [
  { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
  { id: 'jobs', icon: Briefcase, label: 'Manage Jobs' },
  { id: 'applications', icon: Users, label: 'Applications' },
  { id: 'companies', icon: Building, label: 'My Companies' },
  { id: 'create-job', icon: PlusCircle, label: 'Post New Job' },
  { id: 'settings', icon: Settings, label: 'Settings' },
]

const RecruiterDashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('overview')
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [companyRefreshTrigger, setCompanyRefreshTrigger] = useState(0)
  
  // Stats State
  const [stats, setStats] = useState<DashboardStats>({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch Stats
  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      const dashboardStats = await jobService.getDashboardStats()
      setStats(dashboardStats)
    } catch (err) {
      setError('Failed to fetch dashboard statistics.')
      console.error('Error fetching dashboard stats:', err)
    } finally {
      setLoading(false)
    }
  }

  // Navigation Handlers
  const handleJobSelect = (job: Job) => {
    setSelectedJob(job)
    setCurrentView('applications')
  }

  const handleBackToJobs = () => {
    setSelectedJob(null)
    setCurrentView('jobs')
  }

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company)
    setCurrentView('edit-company')
  }

  const handleCompanyCreated = () => {
    setCompanyRefreshTrigger(prev => prev + 1)
    setCurrentView('companies')
  }

  const handleCompanyUpdated = () => {
    setCompanyRefreshTrigger(prev => prev + 1)
    setCurrentView('companies')
  }

  const handleCompanyDeleted = () => {
    setCompanyRefreshTrigger(prev => prev + 1)
  }

  // --- Render Sections ---

  const renderOverview = () => {
    const statCards = [
      { label: 'Total Jobs', sub: 'Posted', value: stats.totalJobs, icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50' },
      { label: 'Active Jobs', sub: 'Open', value: stats.activeJobs, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
      { label: 'Total Applicants', sub: 'All Time', value: stats.totalApplications, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
      { label: 'Pending Review', sub: 'Action Needed', value: stats.pendingApplications, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    ]

    return (
      <div className="space-y-8 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-gray-200/60">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Recruiter Overview</h1>
            <p className="text-gray-500 mt-1">Track your recruitment pipeline and job performance.</p>
          </div>
          <button 
            onClick={() => setCurrentView('create-job')}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Post New Job
          </button>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center hover:shadow-md transition-shadow">
                <div className={`p-3 rounded-lg ${stat.bg} mr-4`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm font-medium text-gray-900">{stat.label}</p>
                  <p className="text-xs text-gray-500">{stat.sub}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => setCurrentView('jobs')}
                className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 rounded-lg transition-colors group"
              >
                <span className="font-medium">Manage Active Jobs</span>
                <Briefcase className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
              </button>
              <button
                onClick={() => setCurrentView('applications')}
                className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded-lg transition-colors group"
              >
                <span className="font-medium">Review Applications</span>
                <Users className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
              </button>
              <button
                onClick={() => setCurrentView('companies')}
                className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-purple-50 text-gray-700 hover:text-purple-700 rounded-lg transition-colors group"
              >
                <span className="font-medium">Manage Companies</span>
                <Building className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
              </button>
              <button
                onClick={() => setCurrentView('create-job')}
                className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-green-50 text-gray-700 hover:text-green-700 rounded-lg transition-colors group"
              >
                <span className="font-medium">Draft New Posting</span>
                <FileText className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
              </button>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Activity</h3>
            <div className="space-y-0 divide-y divide-gray-100">
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                  <span className="text-gray-600">New applications pending review</span>
                </div>
                <span className="font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-full text-sm">
                  {stats.pendingApplications}
                </span>
              </div>
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-600">Active job postings live</span>
                </div>
                <span className="font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-full text-sm">
                  {stats.activeJobs}
                </span>
              </div>
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                  <span className="text-gray-600">Closed jobs (Archived)</span>
                </div>
                <span className="font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-full text-sm">
                  {stats.totalJobs - stats.activeJobs}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // --- Main Layout ---

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        
        {/* Hoverable Sidebar */}
        <aside className="hidden md:flex flex-col bg-white border-r border-gray-200 h-[calc(100vh-64px)] sticky top-16 w-20 hover:w-64 transition-all duration-300 ease-in-out group z-20 shadow-lg hover:shadow-xl">
          <div className="flex-1 py-6 flex flex-col gap-2 overflow-y-auto">
            {SIDEBAR_ITEMS.map((item) => {
              // Determine active state logic
              const isActive = currentView === item.id ||
                           (item.id === 'applications' && selectedJob !== null) ||
                           (item.id === 'companies' && ['create-company', 'edit-company'].includes(currentView))

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'applications') setSelectedJob(null)
                    if (item.id === 'companies') {
                      setSelectedCompany(null)
                    }
                    // Cast string ID to ViewType safely or handle specific logic
                    if (['overview', 'jobs', 'applications', 'companies', 'create-job', 'settings'].includes(item.id)) {
                      setCurrentView(item.id as ViewType)
                    }
                  }}
                  className={`relative flex items-center h-12 px-6 transition-colors duration-200
                    ${isActive
                      ? 'text-indigo-600 bg-indigo-50 border-r-4 border-indigo-600' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  <div className="min-w-8 flex items-center justify-center">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <span className="ml-4 font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-75 overflow-hidden">
                    {item.label}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="p-4 border-t border-gray-100">
            <button className="flex items-center w-full p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <div className="min-w-8 flex items-center justify-center">
                <LogOut className="w-6 h-6" />
              </div>
              <span className="ml-4 font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 overflow-hidden">
                Sign Out
              </span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)] bg-gray-50 p-4 sm:p-8">
          
          {/* Content Switcher */}
          {currentView === 'overview' && renderOverview()}
          
          {currentView === 'jobs' && (
            <div className="max-w-6xl mx-auto">
               <JobManagementList onJobSelect={handleJobSelect} onPostNewJob={() => setCurrentView('create-job')} />
            </div>
          )}
          
          {currentView === 'applications' && (
            <div className="max-w-6xl mx-auto h-full">
              <ApplicationManagement
                selectedJobId={selectedJob?.id}
                selectedJobTitle={selectedJob?.title}
                onBack={selectedJob ? handleBackToJobs : undefined}
              />
            </div>
          )}

          {currentView === 'create-job' && (
             <div className="max-w-4xl mx-auto">
               <JobPostingForm
                 onJobPosted={() => {
                   // Add the new job to the jobs list
                   // This would ideally refresh the jobs list, but for now we'll just navigate back
                   setCurrentView('jobs');
                 }}
                 onCancel={() => setCurrentView('jobs')}
               />
             </div>
          )}

          {currentView === 'companies' && (
            <div className="max-w-6xl mx-auto">
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">My Companies</h2>
                    <p className="text-gray-600 mt-1">Manage your company profiles and verification status.</p>
                  </div>
                  <button
                    onClick={() => setCurrentView('create-company')}
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add New Company
                  </button>
                </div>
              </div>
              <CompanyList
                refreshTrigger={companyRefreshTrigger}
                onEdit={handleCompanySelect}
                onDelete={handleCompanyDeleted}
              />
            </div>
          )}

          {currentView === 'create-company' && (
            <div className="max-w-4xl mx-auto">
              <CompanyCreateForm
                onSuccess={handleCompanyCreated}
                onCancel={() => setCurrentView('companies')}
              />
            </div>
          )}

          {currentView === 'edit-company' && selectedCompany && (
            <div className="max-w-4xl mx-auto">
              <CompanyEditForm
                companyId={selectedCompany.id}
                onSuccess={handleCompanyUpdated}
                onCancel={() => setCurrentView('companies')}
              />
            </div>
          )}

          {currentView === 'settings' && (
            <RecruiterSettings />
          )}

        </main>
      </div>
    </div>
  )
}

// Wrap the component with RecruiterRoute for access control
const RecruiterDashboardWithAuth: React.FC = () => (
  <RecruiterRoute>
    <RecruiterDashboard />
  </RecruiterRoute>
)

export default RecruiterDashboardWithAuth