import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Building2, MapPin, Clock, DollarSign, Calendar, CheckCircle } from 'lucide-react'
import { Navbar } from '../components/Navbar'
import { JobApplicationForm } from '../components/JobApplicationForm'
import { jobService } from '../services/jobService'
import DOMPurify from 'dompurify'
import type { Job } from '../types/job.types'

export const JobDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      
      try {
        setLoading(true)
        const data = await jobService.getJob(id);
        setJob(data);
      } catch (error) {
        console.error("Error fetching job", error)
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [id])

  const handleApplyNow = () => {
    setShowApplicationForm(true)
  }

  const handleCloseApplicationForm = () => {
    setShowApplicationForm(false)
  }

  const handleApplicationSuccess = () => {
    setShowSuccessMessage(true)
    setShowApplicationForm(false)
    setTimeout(() => setShowSuccessMessage(false), 5000)
  }

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>

  if (!job) return <div className="flex justify-center items-center h-screen">Job not found</div>

  const cleanDescription = DOMPurify.sanitize(job.description || '')
  const cleanRequirements = DOMPurify.sanitize(job.requirements || '')
  const cleanResponsibilities = DOMPurify.sanitize(job.responsibilities || '')
  const cleanBenefits = DOMPurify.sanitize(job.benefits || '')

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - 70% width on large screens */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Job Header */}
              <div className="p-8 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                      <p className="text-xl text-gray-600">{job.company.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleApplyNow}
                    className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Apply Now
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-4 text-gray-600 mt-6">
                  <span className="flex items-center"><MapPin className="w-4 h-4 mr-1"/> {job.location.city}, {job.location.state}</span>
                  <span className="flex items-center"><Clock className="w-4 h-4 mr-1"/> {job.type}</span>
                  {job.salary && <span className="flex items-center"><DollarSign className="w-4 h-4 mr-1"/> {typeof job.salary === 'object' ? job.salary.formatted || 'Salary not specified' : job.salary}</span>}
                </div>
              </div>
              
              {/* Job Description */}
              <div className="p-8 border-b border-gray-100">
                <h2 className="text-2xl font-bold mb-4">About the Job</h2>
                <div 
                  className="prose prose-lg max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: cleanDescription }} 
                />
              </div>
              
              {/* Responsibilities */}
              {job.responsibilities && (
                <div className="p-8 border-b border-gray-100">
                  <h2 className="text-2xl font-bold mb-4">Responsibilities</h2>
                  <div
                    className="prose prose-lg max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: cleanResponsibilities }}
                  />
                </div>
              )}

              {/* Requirements */}
              {job.requirements && (
                <div className="p-8 border-b border-gray-100">
                  <h2 className="text-2xl font-bold mb-4">Requirements</h2>
                  <div
                    className="prose prose-lg max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: cleanRequirements }}
                  />
                </div>
              )}

              {/* Benefits */}
              {job.benefits && (
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Benefits</h2>
                  <div
                    className="prose prose-lg max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: cleanBenefits }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - 30% width on large screens */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-bold mb-4">Job Overview</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Posted Date</p>
                  <div className="flex items-center mt-1">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <p className="font-medium">{job.postedDate ? new Date(job.postedDate).toLocaleDateString() : 'Recently'}</p>
                  </div>
                </div>

                {job.deadline && (
                  <div>
                    <p className="text-sm text-gray-500">Application Deadline</p>
                    <div className="flex items-center mt-1">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <p className="font-medium">{new Date(job.deadline).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}

                {job.salary && (
                  <div>
                    <p className="text-sm text-gray-500">Salary Range</p>
                    <div className="flex items-center mt-1">
                      <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                      <p className="font-medium">{typeof job.salary === 'object' ? job.salary.formatted || 'Salary not specified' : job.salary}</p>
                    </div>
                  </div>
                )}

                {job.skills && job.skills.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Required Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill) => (
                        <span 
                          key={skill} 
                          className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={handleApplyNow}
                  className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply for this Position
                </button>
                <button className="w-full border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                  Save Job
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Form Modal */}
      {job && (
        <JobApplicationForm
          job={job}
          isOpen={showApplicationForm}
          onClose={handleCloseApplicationForm}
          onSuccess={handleApplicationSuccess}
        />
      )}

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed bottom-4 right-4 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg z-[60] flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
          <div>
            <p className="text-green-800 font-medium">Application submitted successfully!</p>
            <p className="text-green-600 text-sm">Your application has been received and is being reviewed.</p>
          </div>
        </div>
      )}
    </div>
  )
}