import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import type { Job, JobType, Company } from '../types/job.types';
import { jobService } from '../services/jobService';
import { companyService } from '../services/companyService';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface JobPostingFormProps {
  onJobPosted?: (job: Job) => void;
  onCancel?: () => void;
  initialJob?: Job;
}

const JobPostingForm: React.FC<JobPostingFormProps> = ({ 
  onJobPosted, 
  onCancel, 
  initialJob 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: initialJob?.title || '',
    companyId: initialJob?.company?.id || 0,
    company: initialJob?.company || { id: 0, name: '' },
    location: initialJob?.location || { city: '', state: '', country: '' },
    type: initialJob?.type || 'Full-Time' as JobType,
    salary: initialJob?.salary || '',
    description: initialJob?.description || '',
    descriptionHtml: initialJob?.descriptionHtml || '',
    requirements: initialJob?.requirements || '',
    requirementsHtml: initialJob?.requirementsHtml || '',
    skills: initialJob?.skills || [] as string[],
    deadline: initialJob?.deadline || '',
    isActive: initialJob?.isActive ?? true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);
  const [companyError, setCompanyError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoadingCompanies(true);
        setCompanyError(null);
        const verifiedCompanies = await companyService.getVerifiedCompanies();
        setCompanies(verifiedCompanies);
        
        // If no verified companies, show error
        if (verifiedCompanies.length === 0) {
          setCompanyError('You must have at least one verified company to post a job. Please create and verify a company first.');
        }
      } catch (err) {
        setCompanyError(err instanceof Error ? err.message : 'Failed to load companies. Please try again.');
      } finally {
        setIsLoadingCompanies(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const companyId = parseInt(e.target.value);
    const selectedCompany = companies.find(c => c.id === companyId);
    
    setFormData(prev => ({
      ...prev,
      companyId,
      company: selectedCompany || { id: 0, name: '' }
    }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Parse location string "City, State" into location object
    const parts = value.split(',').map(part => part.trim());
    const city = parts[0] || '';
    const state = parts[1] || '';
    setFormData(prev => ({
      ...prev,
      location: { city, state, country: 'USA' }
    }));
  };

  const handleDescriptionChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      descriptionHtml: value
    }));
  };

  const handleRequirementsChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      requirementsHtml: value
    }));
  };

  const handleSkillAdd = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const handleSkillRemove = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSkillInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSkillAdd();
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      nextStep();
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const jobData = {
        ...formData,
        company: formData.company,
        postedDate: new Date().toISOString(),
      };

      let savedJob: Job;
      if (initialJob) {
        savedJob = await jobService.updateJob(initialJob.id, jobData);
      } else {
        savedJob = await jobService.createJob(jobData);
      }

      onJobPosted?.(savedJob);
      
      // Reset form if it's a new job
      if (!initialJob) {
        setFormData({
          title: '',
          companyId: 0,
          company: { id: 0, name: '' },
          location: { city: '', state: '', country: '' },
          type: 'Full-Time',
          salary: '',
          description: '',
          descriptionHtml: '',
          requirements: '',
          requirementsHtml: '',
          skills: [],
          deadline: '',
          isActive: true,
        });
        setCurrentStep(1);
      }
    } catch (err) {
      setError('Failed to save job. Please try again.');
      console.error('Error saving job:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center">
          {[1, 2, 3].map((step) => (
            <React.Fragment key={step}>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step 
                  ? 'bg-indigo-600 border-indigo-600 text-white' 
                  : 'border-gray-300 text-gray-500'
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`w-12 h-1 mx-2 ${
                  currentStep > step ? 'bg-indigo-600' : 'bg-gray-300'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Job Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="companyId" className="block text-sm font-medium text-gray-700 mb-1">
            Company *
          </label>
          {isLoadingCompanies ? (
            <div className="flex items-center justify-center py-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
              <span className="ml-2 text-sm text-gray-500">Loading companies...</span>
            </div>
          ) : companyError ? (
            <div className="text-red-600 text-sm p-2 bg-red-50 border border-red-200 rounded">
              {companyError}
            </div>
          ) : companies.length === 0 ? (
            <div className="text-yellow-600 text-sm p-2 bg-yellow-50 border border-yellow-200 rounded">
              No verified companies found. Please create and verify a company first.
            </div>
          ) : (
            <select
              id="companyId"
              name="companyId"
              value={formData.companyId}
              onChange={handleCompanyChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select a company</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={typeof formData.location === 'object' ? `${formData.location.city}, ${formData.location.state}` : formData.location}
            onChange={handleLocationChange}
            required
            placeholder="e.g., San Francisco, CA"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Job Type *
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Remote">Remote</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        <div>
          <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
            Salary
          </label>
          <input
            type="text"
            id="salary"
            name="salary"
            value={typeof formData.salary === 'object' && formData.salary !== null ? formData.salary.formatted || '' : formData.salary}
            onChange={handleChange}
            placeholder="e.g., $60,000 - $80,000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
            Application Deadline
          </label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Job Details</h3>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Job Description *
        </label>
        <div className="editor-wrapper">
          <ReactQuill 
            theme="snow" 
            value={formData.descriptionHtml} 
            onChange={handleDescriptionChange} 
            placeholder="Describe the role, responsibilities, and what you're looking for..."
            modules={{
              toolbar: [
                [{ 'header': [1, 2, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['link', 'clean']
              ],
            }}
          />
        </div>
      </div>

      <div>
        <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
          Requirements *
        </label>
        <div className="editor-wrapper">
          <ReactQuill 
            theme="snow" 
            value={formData.requirementsHtml} 
            onChange={handleRequirementsChange} 
            placeholder="List the skills, experience, and qualifications needed..."
            modules={{
              toolbar: [
                [{ 'header': [2, false] }],
                ['bold', 'italic'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['clean']
              ],
            }}
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Skills & Customization</h3>
      
      <div>
        <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
          Required Skills
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {formData.skills.map((skill) => (
            <span 
              key={skill} 
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
            >
              {skill}
              <button
                type="button"
                onClick={() => handleSkillRemove(skill)}
                className="ml-2 text-indigo-600 hover:text-indigo-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleSkillInputKeyDown}
            placeholder="Add a skill and press Enter"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="button"
            onClick={handleSkillAdd}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add
          </button>
        </div>
      </div>

      {initialJob && (
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
            Active (visible to job seekers)
          </label>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {initialJob ? 'Edit Job' : 'Post New Job'}
      </h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {renderStepIndicator()}

      <form onSubmit={handleSubmit} className="space-y-6">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        <div className="flex justify-between pt-4">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </button>
            )}
          </div>
          
          <div className="flex space-x-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {currentStep < 3 ? (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  {isSubmitting ? 'Saving...' : (initialJob ? 'Update Job' : 'Post Job')}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default JobPostingForm;