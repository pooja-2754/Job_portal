import { useState, useEffect } from 'react'
import { Navbar } from '../components/Navbar'
import { JobCard } from '../components/JobCard'
import { Search, MapPin, Loader2, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { jobService } from '../services/jobService'
import type { Job } from '../types/job.types'


export default function JobsPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true)
        setError(null)
        const fetchedJobs = await jobService.getJobs(0, 10, 'postedDate', 'desc')
        setJobs(fetchedJobs)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch jobs')
        console.error('Error fetching jobs:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  // Calculate filtered jobs based on search criteria
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = !searchQuery ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesLocation = !locationFilter ||
      job.location.toLowerCase().includes(locationFilter.toLowerCase())
    
    const matchesType = !typeFilter || job.type === typeFilter
    
    return matchesSearch && matchesLocation && matchesType
  })

  return (
    <>
      <Navbar role={user?.role || null} isLoggedIn={true} />
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by job title or company"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Location */}
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Filter by location"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Job Type Filter */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setTypeFilter('')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    typeFilter === ''
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Types
                </button>
                {['Full-Time', 'Part-Time', 'Remote', 'Internship'].map(type => (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      typeFilter === type
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-3" />
                <span className="text-gray-600">Loading jobs...</span>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <p className="text-red-700">Error: {error}</p>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-4">
                  Found {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}
                </p>
                <div className="grid gap-4">
                  {filteredJobs.length > 0 ? (
                    filteredJobs.map(job => (
                      <JobCard key={job.id} {...job} />
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-600 text-lg">No jobs found matching your criteria.</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}