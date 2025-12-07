import { useState, useEffect } from 'react'
import { X, Send, FileText, User, Mail, Phone, Briefcase, GraduationCap } from 'lucide-react'
import { applicationService } from '../services/applicationService'
import type { ApplicationRequest, ApplicationResponse, Job } from '../types/job.types'

interface JobApplicationFormProps {
  job: Job
  isOpen: boolean
  onClose: () => void
  onSuccess: (application: ApplicationResponse) => void
}

export function JobApplicationForm({ job, isOpen, onClose, onSuccess }: JobApplicationFormProps) {
  const [formData, setFormData] = useState<ApplicationRequest>({
    jobId: parseInt(job.id),
    applicantName: '',
    applicantEmail: '',
    applicantPhone: '',
    resumeUrl: '',
    coverLetter: '',
    experience: '',
    education: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        jobId: parseInt(job.id), // Ensures ID is always synced with the current job prop
        // Optional: Uncomment lines below if you want to clear the form every time it opens
        // applicantName: '',
        // applicantEmail: '',
        // applicantPhone: '',
        // resumeUrl: '',
        // coverLetter: '',
        // experience: '',
        // education: ''
      }))
    }
  }, [isOpen, job.id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.applicantName.trim()) {
      setError('Please enter your name')
      return
    }
    
    if (!formData.applicantEmail.trim()) {
      setError('Please enter your email')
      return
    }
    
    if (!formData.applicantEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address')
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)
      
      const application = await applicationService.submitApplication(formData)
      onSuccess(application)
      onClose()
      
      // Reset form
      setFormData({
        jobId: parseInt(job.id),
        applicantName: '',
        applicantEmail: '',
        applicantPhone: '',
        resumeUrl: '',
        coverLetter: '',
        experience: '',
        education: ''
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit application')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Modal Container */}
      <div className="fixed inset-0 z-[50] overflow-y-auto">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />
        
        <div className="flex min-h-full items-center justify-center p-4">
          {/* Modal */}
          <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl z-[60]">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Apply for {job.title}</h2>
              <p className="text-gray-600 mt-1">{job.company.name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label htmlFor="applicantName" className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  id="applicantName"
                  name="applicantName"
                  value={formData.applicantName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="applicantEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  id="applicantEmail"
                  name="applicantEmail"
                  value={formData.applicantEmail}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="john@example.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="applicantPhone" className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="applicantPhone"
                  name="applicantPhone"
                  value={formData.applicantPhone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+1-555-123-4567"
                />
              </div>

              {/* Resume URL */}
              <div>
                <label htmlFor="resumeUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Resume URL
                </label>
                <input
                  type="url"
                  id="resumeUrl"
                  name="resumeUrl"
                  value={formData.resumeUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/resume.pdf"
                />
              </div>
            </div>

            {/* Experience */}
            <div className="mt-6">
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                <Briefcase className="w-4 h-4 inline mr-2" />
                Work Experience
              </label>
              <textarea
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe your relevant work experience..."
              />
            </div>

            {/* Education */}
            <div className="mt-6">
              <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-2">
                <GraduationCap className="w-4 h-4 inline mr-2" />
                Education
              </label>
              <textarea
                id="education"
                name="education"
                value={formData.education}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe your educational background..."
              />
            </div>

            {/* Cover Letter */}
            <div className="mt-6">
              <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Cover Letter
              </label>
              <textarea
                id="coverLetter"
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Why are you interested in this position?"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Application
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  )
}