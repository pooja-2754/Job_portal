import { useState, useEffect } from 'react'
import { X, Send, FileText, Upload } from 'lucide-react'
import { applicationService } from '../services/applicationService'
import { useAuth } from '../hooks/useAuth'
import type { ApplicationRequest, ApplicationResponse, Job } from '../types/job.types'

interface JobApplicationFormProps {
  job: Job
  isOpen: boolean
  onClose: () => void
  onSuccess: (application: ApplicationResponse) => void
}

export function JobApplicationForm({ job, isOpen, onClose, onSuccess }: JobApplicationFormProps) {
  const { token, user } = useAuth()
  const [formData, setFormData] = useState<ApplicationRequest>({
    jobId: parseInt(job.id),
    coverLetter: '',
    customResumeUrl: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setFormData({
        jobId: parseInt(job.id),
        coverLetter: '',
        customResumeUrl: ''
      })
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
    
    if (!token) {
      setError('You must be logged in to apply for this job')
      return
    }
    
    // Basic validation
    if (!formData.coverLetter.trim()) {
      setError('Please provide a cover letter')
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)
      
      const application = await applicationService.submitApplication(formData, token)
      onSuccess(application)
      onClose()
      
      // Reset form
      setFormData({
        jobId: parseInt(job.id),
        coverLetter: '',
        customResumeUrl: ''
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

          {/* User Info */}
          <div className="px-6 py-4 bg-blue-50 border-b border-gray-200">
            <p className="text-sm text-blue-800">
              Applying as: <span className="font-semibold">{user?.name || user?.email}</span>
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Your primary resume will be used unless you provide a custom resume URL below
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Custom Resume URL */}
            <div className="mb-6">
              <label htmlFor="customResumeUrl" className="block text-sm font-medium text-gray-700 mb-2">
                <Upload className="w-4 h-4 inline mr-2" />
                Custom Resume URL (Optional)
              </label>
              <input
                type="url"
                id="customResumeUrl"
                name="customResumeUrl"
                value={formData.customResumeUrl}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/custom-resume.pdf"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave blank to use your primary resume from your profile
              </p>
            </div>

            {/* Cover Letter */}
            <div className="mb-6">
              <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Cover Letter *
              </label>
              <textarea
                id="coverLetter"
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleInputChange}
                rows={6}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tell us why you're interested in this position and how your experience aligns with the requirements..."
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
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