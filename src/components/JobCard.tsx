import { MapPin, DollarSign, Building2, Clock, ArrowRight, Bookmark } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Job } from '../types/job.types'

export function JobCard({ id, title, company, location, type, salary, description }: Job) {
  const navigate = useNavigate()
  
  const handleApplyNow = () => {
    navigate(`/jobs/${id}`)
  }

  // Helper to format location string
  const locationString = location ? `${location.city}, ${location.state}` : 'Remote';

  return (
    <article className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-blue-300 transition-all duration-200">
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        
        {/* Company Logo Logic */}
        <div className="shrink-0">
          {company.logoUrl ? (
            <img 
              src={company.logoUrl} 
              alt={company.name} 
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-contain border border-gray-100"
            />
          ) : (
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-blue-600 transition-colors">
              <Building2 className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors mb-1">
                {title}
              </h3>
              {/* FIX: Use company.name instead of company */}
              <p className="text-sm font-medium text-gray-600 mb-2">
                {company.name}
              </p>
            </div>
            
            <button className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors -mt-2 -mr-2">
              <Bookmark className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
              {/* FIX: Use formatted location string */}
              {locationString}
            </div>
            {salary && (
              <div className="flex items-center text-gray-700 font-medium">
                <DollarSign className="w-3.5 h-3.5 mr-1 text-green-600" />
                {typeof salary === 'object' ? salary.formatted || 'Salary Confidential' : salary}
              </div>
            )}
            <div className="flex items-center px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
              <Clock className="w-3 h-3 mr-1" />
              {type}
            </div>
          </div>

          {/* Description - Strip HTML tags for preview */}
          <div 
            className="text-gray-600 text-sm leading-relaxed mb-5 line-clamp-2"
            dangerouslySetInnerHTML={{ __html: description }} 
          />

          <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
            <span className="text-xs text-gray-400 font-medium">Posted recently</span>
            <button
              onClick={handleApplyNow}
              className="inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
            >
              Apply Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}