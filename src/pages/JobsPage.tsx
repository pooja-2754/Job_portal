import { useState, useEffect } from 'react'
import { Navbar } from '../components/Navbar'
import { JobCard } from '../components/JobCard'
import { Search, MapPin, Loader2, AlertCircle, Briefcase, Filter, X } from 'lucide-react'
import { jobService } from '../services/jobService'
import type { Job } from '../types/job.types'

export default function JobsPage() {
  // State
  const [searchQuery, setSearchQuery] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch jobs
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

  // Filter Logic
  const filteredJobs = jobs.filter(job => {
    // FIX: Access properties .title and .company.name
    const matchesSearch = !searchQuery ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // FIX: Access .location.city or .state
    // We check if the search string is inside city OR state
    const matchesLocation = !locationFilter ||
      job.location.city.toLowerCase().includes(locationFilter.toLowerCase()) ||
      job.location.state.toLowerCase().includes(locationFilter.toLowerCase());
    
    const matchesType = !typeFilter || job.type === typeFilter
    
    return matchesSearch && matchesLocation && matchesType
  })

  // Helper for clear button
  const clearFilters = () => {
    setSearchQuery('')
    setLocationFilter('')
    setTypeFilter('')
  }

  const hasActiveFilters = searchQuery || locationFilter || typeFilter

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      
      {/* Header / Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">
            Find your next <span className="text-blue-600">dream job</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl">
            Browse thousands of job openings from top companies and startups.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 -mt-8">
        
        {/* Search & Filter Container */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-8 relative z-10">
          
          {/* Input Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
            {/* Search Input */}
            <div className="md:col-span-7 relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Job title, keywords, or company"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            {/* Location Input */}
            <div className="md:col-span-5 relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="City, state, or zip code"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              />
            </div>
          </div>

          {/* Filter Pills & Meta */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-gray-100 pt-4">
            
            {/* Type Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center text-sm text-gray-500 mr-2">
                <Filter className="w-4 h-4 mr-1" />
                <span>Type:</span>
              </div>
              
              <button
                onClick={() => setTypeFilter('')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                  typeFilter === ''
                    ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                All
              </button>
              
              {['Full-Time', 'Part-Time', 'Remote', 'Internship'].map(type => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                    typeFilter === type
                      ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Clear Filters (Only visible if filters active) */}
            {hasActiveFilters && (
              <button 
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-red-600 flex items-center transition-colors self-start sm:self-auto"
              >
                <X className="w-4 h-4 mr-1" />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Area */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-xl font-semibold text-gray-800">Job Listings</h2>
            {!loading && (
              <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {filteredJobs.length} Found
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200 border-dashed">
              <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
              <p className="text-gray-500 font-medium">Finding the best roles for you...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start">
              <AlertCircle className="w-6 h-6 text-red-500 mr-3 mt-0.5" />
              <div>
                <h3 className="text-red-800 font-medium">Failed to load jobs</h3>
                <p className="text-red-600 text-sm mt-1">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-3 text-sm font-medium text-red-700 hover:text-red-800 underline"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredJobs.map(job => (
                <div key={job.id} className="transition-transform duration-200 hover:-translate-y-1">
                  <JobCard {...job} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-200 border-dashed">
              <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
              <p className="text-gray-500 mt-1 max-w-sm mx-auto">
                We couldn't find any jobs matching your current filters. Try broadening your search or clearing filters.
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}