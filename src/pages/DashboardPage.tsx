import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Navbar } from '../components/Navbar'
import ResumeManagement from '../components/ResumeManagement'
import ApplicationsManagement from '../components/ApplicationsManagement'
import SavedJobs from '../components/SavedJobs'
import Messages from '../components/Messages'
import Schedule from '../components/Schedule'
import SeekerSettings from '../components/SeekerSettings'
import { jobService } from '../services/jobService'
import {
  User,
  Briefcase,
  Bookmark,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle2,
  Settings,
  LayoutDashboard,
  MessageSquare,
  FileText,
  LogOut,
  ChevronRight,
  AlertCircle
} from 'lucide-react'

// Sidebar Navigation Items
const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: 'Overview', active: true },
  { icon: Briefcase, label: 'Applications', active: false },
  { icon: Bookmark, label: 'Saved Jobs', active: false },
  { icon: MessageSquare, label: 'Messages', active: false },
  { icon: FileText, label: 'Resumes', active: false },
  { icon: Calendar, label: 'Schedule', active: false },
  { icon: Settings, label: 'Settings', active: false },
]

// Define interfaces for our data
interface DashboardStats {
  label: string
  value: string
  icon: React.ElementType
  color: string
  bg: string
}

interface RecentActivity {
  id: number
  company: string
  role: string
  status: string
  date: string
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('Overview')
  const [stats, setStats] = useState<DashboardStats[]>([
    { label: 'Applications', value: '0', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Saved Jobs', value: '0', icon: Bookmark, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Interviews', value: '0', icon: Calendar, color: 'text-green-600', bg: 'bg-green-50' },
  ])
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        const token = localStorage.getItem('token')
        
        if (!token) {
          throw new Error('Authentication token not found')
        }

        // Fetch dashboard stats
        const dashboardStats = await jobService.getDashboardStats()
        
        // Update stats with actual data
        setStats([
          {
            label: 'Applications',
            value: dashboardStats.totalApplications?.toString() || '0',
            icon: Briefcase,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
          },
          {
            label: 'Saved Jobs',
            value: '0', // TODO: Implement saved jobs API
            icon: Bookmark,
            color: 'text-purple-600',
            bg: 'bg-purple-50'
          },
          {
            label: 'Interviews',
            value: dashboardStats.shortlistedApplications?.toString() || '0', // Using shortlisted as interviews
            icon: Calendar,
            color: 'text-green-600',
            bg: 'bg-green-50'
          },
        ])

        // Use recent applications from dashboard stats
        if (dashboardStats.recentApplications && dashboardStats.recentApplications.length > 0) {
          const formattedActivity = dashboardStats.recentApplications.map(app => ({
            id: app.id,
            company: app.jobCompany || 'Unknown Company',
            role: app.jobTitle || 'Unknown Position',
            status: app.statusDisplayName || app.status,
            date: formatRelativeDate(app.appliedDate)
          }))
          setRecentActivity(formattedActivity)
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Helper function to format relative date
  const formatRelativeDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - date.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) return 'Today'
      if (diffDays === 1) return 'Yesterday'
      if (diffDays < 7) return `${diffDays} days ago`
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`
      return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`
    } catch {
      return 'Recently'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* Top Navbar stays persistent */}
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        
        {/* 
          HOVERABLE SIDEBAR 
          - w-20: Default width (Icons only)
          - hover:w-64: Expands on hover
          - -mt-px: Fixes double border with navbar if needed
        */}
        <aside className="hidden md:flex flex-col bg-white border-r border-gray-200 h-[calc(100vh-64px)] sticky top-16 w-20 hover:w-64 transition-all duration-300 ease-in-out group z-20 shadow-lg hover:shadow-xl">
          
          <div className="flex-1 py-6 flex flex-col gap-2 overflow-y-auto">
            {SIDEBAR_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.label)}
                className={`relative flex items-center h-12 px-6 transition-colors duration-200
                  ${activeTab === item.label
                    ? 'text-blue-600 bg-blue-50 border-r-4 border-blue-600'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                {/* Icon is always centered in the collapsed state (w-20) */}
                <div className="min-w-8 flex items-center justify-center">
                  <item.icon className="w-6 h-6" />
                </div>
                
                {/* Text hidden by default, visible on group-hover */}
                <span className="ml-4 font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-75 overflow-hidden">
                  {item.label}
                </span>
                
                {/* Active Indicator Dot (optional, for collapsed state) */}
                {activeTab === item.label && (
                  <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-md bg-blue-600 md:hidden" />
                )}
              </button>
            ))}
          </div>

          {/* Bottom Action (Logout) */}
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

        {/* MAIN CONTENT AREA - Contains Center */}
        <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)] bg-gray-50 p-4 sm:p-8">
          <div className="mx-auto max-w-6xl space-y-8">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-gray-200/60">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {activeTab === 'Resumes' ? 'Resume Management' : activeTab === 'Applications' ? 'My Applications' : 'Dashboard'}
                </h1>
                <p className="text-gray-500 mt-1">
                  Welcome back, {user?.name || 'User'}.
                </p>
              </div>
              <div className="flex gap-3">
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Find Jobs
                </button>
              </div>
            </div>

            {/* Content based on active tab */}
            {activeTab === 'Resumes' ? (
              <ResumeManagement />
            ) : activeTab === 'Applications' ? (
              <ApplicationsManagement />
            ) : activeTab === 'Saved Jobs' ? (
              <SavedJobs />
            ) : activeTab === 'Messages' ? (
              <Messages />
            ) : activeTab === 'Schedule' ? (
              <Schedule />
            ) : activeTab === 'Settings' ? (
              <SeekerSettings />
            ) : (
              <>
                {/* Error State */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center text-red-700">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <p>{error}</p>
                  </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {isLoading ? (
                    // Loading skeletons for stats
                    Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg mr-4"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    stats.map((stat) => (
                      <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center hover:shadow-md transition-shadow">
                        <div className={`p-3 rounded-lg ${stat.bg} mr-4`}>
                          <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Content Grid: Activity & Profile */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Activity Feed */}
                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full">
                      <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                          Recent Activity
                        </h3>
                      </div>
                      <div className="divide-y divide-gray-50">
                        {isLoading ? (
                          // Loading skeletons for recent activity
                          Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="p-6 animate-pulse">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
                                  <div className="flex-1">
                                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end">
                                  <div className="h-6 bg-gray-200 rounded w-16 mb-2"></div>
                                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : recentActivity.length > 0 ? (
                          recentActivity.map((activity) => (
                            <div key={activity.id} className="p-6 hover:bg-gray-50/80 transition-colors group cursor-pointer">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 font-bold border border-gray-200">
                                    {activity.company.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{activity.role}</p>
                                    <p className="text-sm text-gray-500">{activity.company}</p>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                    activity.status === 'Interview' ? 'bg-green-50 text-green-700 border-green-100' :
                                    activity.status === 'In Review' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                    'bg-blue-50 text-blue-700 border-blue-100'
                                  }`}>
                                    {activity.status}
                                  </span>
                                  <span className="text-xs text-gray-400 mt-2 flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {activity.date}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-8 text-center">
                            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No recent activity</p>
                            <p className="text-sm text-gray-400 mt-1">Start applying for jobs to see your activity here</p>
                          </div>
                        )}
                      </div>
                      <div className="p-4 border-t border-gray-100 bg-gray-50/30">
                        <button
                          onClick={() => setActiveTab('Applications')}
                          className="w-full text-center text-sm text-gray-500 hover:text-blue-600 font-medium py-2"
                        >
                          View all applications
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Profile / Status Card */}
                  <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
                      <div className="flex items-start justify-between mb-6">
                        <div className="h-16 w-16 bg-linear-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/30">
                          {user?.name ? user.name.charAt(0).toUpperCase() : <User />}
                        </div>
                        <button className="text-gray-400 hover:text-gray-600 p-1">
                          <Settings className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-900">{user?.name || 'Guest User'}</h2>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                        <div className="mt-3 inline-flex items-center px-2 py-1 bg-green-50 border border-green-200 rounded text-xs text-green-700 font-medium">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                          Open to work
                        </div>
                      </div>

                      <div className="space-y-4 pt-6 border-t border-gray-100">
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Completion</h4>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm group cursor-pointer">
                            <span className="text-gray-600 flex items-center group-hover:text-gray-900">
                              <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                              Email Verified
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm group cursor-pointer">
                            <span className="text-gray-600 flex items-center group-hover:text-gray-900">
                              <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                              Resume Added
                            </span>
                            <ChevronRight className="w-4 h-4 text-gray-300" />
                          </div>
                          <div className="flex items-center justify-between text-sm group cursor-pointer">
                            <span className="text-gray-600 flex items-center group-hover:text-gray-900">
                              <div className="w-4 h-4 mr-2 border-2 border-gray-300 rounded-full"></div>
                              LinkedIn Profile
                            </span>
                            <span className="text-blue-600 text-xs font-medium hover:underline">Link</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardPage