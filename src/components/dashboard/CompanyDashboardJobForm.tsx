import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import type { Job, JobType, JobStatus, WorkplaceType, ExperienceLevel, SalaryPeriod, JobApiRequest } from '../../types/job.types';
import { companyJobService } from '../../services/companyJobService';
import { useCompanyAuth } from '../../hooks/useCompanyAuth';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface CompanyDashboardJobFormProps {
  onJobPosted?: (job: Job) => void;
  onCancel?: () => void;
  initialJob?: Job;
}

const CompanyDashboardJobForm: React.FC<CompanyDashboardJobFormProps> = ({
  onJobPosted,
  onCancel,
  initialJob
}) => {
  const { company } = useCompanyAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: initialJob?.title || '',
    companyId: initialJob?.company?.id || (company ? Number(company.id) : 0),
    company: initialJob?.company || (company ? {
      id: Number(company.id),
      name: company.name || ''
    } : { id: 0, name: '' }),
    location: initialJob?.location || { city: '', state: '', country: '', zipCode: '', coordinates: undefined },
    type: initialJob?.type || 'FULL_TIME' as JobType,
    status: initialJob?.status || 'PUBLISHED' as JobStatus,
    typeDisplayName: initialJob?.typeDisplayName || '',
    workplaceType: initialJob?.workplaceType || 'ONSITE' as WorkplaceType,
    experienceLevel: initialJob?.experienceLevel || 'JUNIOR' as ExperienceLevel,
    salary: initialJob?.salary || { min: null, max: null, currency: 'USD', period: 'YEARLY' as SalaryPeriod, isNegotiable: false, formatted: '' },
    description: initialJob?.description || '',
    descriptionHtml: initialJob?.descriptionHtml || '',
    responsibilities: initialJob?.responsibilities || '',
    responsibilitiesHtml: initialJob?.responsibilitiesHtml || '',
    requirements: initialJob?.requirements || '',
    requirementsHtml: initialJob?.requirementsHtml || '',
    benefits: initialJob?.benefits || '',
    benefitsHtml: initialJob?.benefitsHtml || '',
    skills: initialJob?.skills || [] as string[],
    applyUrl: initialJob?.applyUrl || '',
    deadline: initialJob?.deadline || '',
    isActive: initialJob?.isActive ?? true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Update form data when company information is available
    if (company && !initialJob) {
      setFormData(prev => ({
        ...prev,
        companyId: Number(company.id),
        company: {
          id: Number(company.id),
          name: company.name || ''
        }
      }));
    }
  }, [company, initialJob]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // Company is fixed based on authenticated user, no need for change handler

  const handleLocationFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: value
      }
    }));
  };


  const handleDescriptionChange = (value: string) => {
    // ReactQuill passes the HTML value directly
    const cleanValue = (value === '<p><br></p>' || value === '<p></p>') ? '' : value;
    setFormData(prev => ({
      ...prev,
      descriptionHtml: cleanValue,
      description: cleanValue.replace(/<[^>]*>/g, '') // Strip HTML tags for plain text description
    }));
  };

  const handleRequirementsChange = (value: string) => {
    // ReactQuill passes the HTML value directly
    const cleanValue = (value === '<p><br></p>' || value === '<p></p>') ? '' : value;
    setFormData(prev => ({
      ...prev,
      requirementsHtml: cleanValue,
      requirements: cleanValue.replace(/<[^>]*>/g, '') // Strip HTML tags for plain text
    }));
  };

  const handleResponsibilitiesChange = (value: string) => {
    // ReactQuill passes the HTML value directly
    const cleanValue = (value === '<p><br></p>' || value === '<p></p>') ? '' : value;
    setFormData(prev => ({
      ...prev,
      responsibilitiesHtml: cleanValue,
      responsibilities: cleanValue.replace(/<[^>]*>/g, '') // Strip HTML tags for plain text
    }));
  };

  const handleBenefitsChange = (value: string) => {
    // ReactQuill passes the HTML value directly
    const cleanValue = (value === '<p><br></p>' || value === '<p></p>') ? '' : value;
    setFormData(prev => ({
      ...prev,
      benefitsHtml: cleanValue,
      benefits: cleanValue.replace(/<[^>]*>/g, '') // Strip HTML tags for plain text
    }));
  };

  const handleSalaryChange = (field: string, value: string | number | boolean | null) => {
    setFormData(prev => ({
      ...prev,
      salary: typeof prev.salary === 'object' && prev.salary !== null ? {
        ...prev.salary,
        [field]: value
      } : {
        min: null,
        max: null,
        currency: 'USD',
        period: 'yearly',
        isNegotiable: false,
        formatted: '',
        [field]: value
      }
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

  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Validate step 1 fields
    if (!formData.title.trim()) {
      errors.title = 'Job title is required';
    }
    if (!formData.location.city || !formData.location.state) {
      errors.location = 'Please provide a complete location (city, state)';
    }
    if (!formData.deadline) {
      errors.deadline = 'Application deadline is required';
    } else {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (deadlineDate < today) {
        errors.deadline = 'Deadline must be in the future';
      }
    }
    if (formData.applyUrl && !isValidUrl(formData.applyUrl)) {
      errors.applyUrl = 'Please enter a valid URL';
    }

    // Validate salary if provided
    if (typeof formData.salary === 'object' && formData.salary !== null) {
      if (formData.salary.min && formData.salary.max && formData.salary.min > formData.salary.max) {
        errors.salary = 'Minimum salary cannot be greater than maximum salary';
      }
    }

    // Validate step 2 fields
    if (!formData.descriptionHtml.trim()) {
      errors.description = 'Job description is required';
    }
    if (!formData.responsibilitiesHtml.trim()) {
      errors.responsibilities = 'Responsibilities are required';
    }
    if (!formData.requirementsHtml.trim()) {
      errors.requirements = 'Requirements are required';
    }

    // Validate step 3 fields
    if (formData.skills.length === 0) {
      errors.skills = 'Please add at least one required skill';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If not on the final step, just move to the next step
    if (currentStep < 3) {
      nextStep();
      return;
    }

    // On final step, validate and submit the form
    console.log('Submitting job form with data:', formData);
    
    // Validate form before submission
    if (!validateForm()) {
      setError('Please fix the errors below before submitting.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setFormErrors({});

    try {
      // Transform form data to match API request format
      const jobData: JobApiRequest = {
        title: formData.title,
        description: formData.descriptionHtml || formData.description,
        status: formData.status,
        type: formData.type,
        workplaceType: formData.workplaceType,
        experienceLevel: formData.experienceLevel,
        companyId: formData.companyId,
        location: {
          city: formData.location.city,
          state: formData.location.state,
          country: formData.location.country,
          zipCode: formData.location.zipCode,
          coordinates: formData.location.coordinates
        },
        salary: typeof formData.salary === 'object' && formData.salary !== null && formData.salary.min && formData.salary.max ? {
          min: formData.salary.min,
          max: formData.salary.max,
          currency: formData.salary.currency || 'USD',
          period: formData.salary.period as SalaryPeriod,
          isNegotiable: formData.salary.isNegotiable || false
        } : undefined,
        skills: formData.skills,
        applyUrl: formData.applyUrl,
        responsibilities: formData.responsibilitiesHtml || formData.responsibilities,
        requirements: formData.requirementsHtml || formData.requirements,
        benefits: formData.benefitsHtml || formData.benefits,
        deadline: formData.deadline,
        isActive: formData.isActive
      };

      console.log('Sending job data to API:', jobData);

      let savedJob: Job;
      if (initialJob) {
        // Convert JobApiRequest to Partial<Job> for the update method
        const updateData = {
          ...formData,
          company: formData.company,
          postedDate: new Date().toISOString(),
        };
        savedJob = await companyJobService.updateCompanyJob(initialJob.id, updateData);
      } else {
        // Convert JobApiRequest to Omit<Job, 'id'> for the create method
        const createData = {
          ...formData,
          company: formData.company,
          postedDate: new Date().toISOString(),
        };
        savedJob = await companyJobService.createCompanyJob(createData);
      }

      console.log('Job saved successfully:', savedJob);
      onJobPosted?.(savedJob);
      
      // Reset form if it's a new job
      if (!initialJob) {
        setFormData({
          title: '',
          companyId: 0,
          company: { id: 0, name: '' },
          location: { city: '', state: '', country: '', zipCode: '', coordinates: undefined },
          type: 'FULL_TIME',
          status: 'PUBLISHED',
          typeDisplayName: '',
          workplaceType: 'ONSITE',
          experienceLevel: 'JUNIOR',
          salary: { min: null, max: null, currency: 'USD', period: 'YEARLY', isNegotiable: false, formatted: '' },
          description: '',
          descriptionHtml: '',
          responsibilities: '',
          responsibilitiesHtml: '',
          requirements: '',
          requirementsHtml: '',
          benefits: '',
          benefitsHtml: '',
          skills: [],
          applyUrl: '',
          deadline: '',
          isActive: true,
        });
        setCurrentStep(1);
      }
    } catch (err) {
      console.error('Error saving job:', err);
      setError('Failed to save job. Please try again.');
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
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              formErrors.title ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {formErrors.title && (
            <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
          )}
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
            Company *
          </label>
          <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
            {company?.name || 'Your Company'}
          </div>
          <input
            type="hidden"
            name="companyId"
            value={formData.companyId}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div>
              <label htmlFor="city" className="block text-xs font-medium text-gray-600 mb-1">
                City *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.location.city}
                onChange={handleLocationFieldChange}
                required
                placeholder="e.g., San Francisco"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  formErrors.location ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-xs font-medium text-gray-600 mb-1">
                State *
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.location.state}
                onChange={handleLocationFieldChange}
                required
                placeholder="e.g., CA"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  formErrors.location ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            <div>
              <label htmlFor="country" className="block text-xs font-medium text-gray-600 mb-1">
                Country *
              </label>
              <select
                id="country"
                name="country"
                value={formData.location.country}
                onChange={handleLocationFieldChange}
                required
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  formErrors.location ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Country</option>
                <option value="USA">United States</option>
                <option value="Canada">Canada</option>
                <option value="UK">United Kingdom</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="India">India</option>
                <option value="China">China</option>
                <option value="Japan">Japan</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          {formErrors.location && (
            <p className="mt-1 text-sm text-red-600">{formErrors.location}</p>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="zipCode" className="block text-xs font-medium text-gray-600 mb-1">
                Zip Code
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.location.zipCode || ''}
                onChange={handleLocationFieldChange}
                placeholder="e.g., 10001"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Job Type *
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
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
            <option value="FULL_TIME">Full-Time</option>
            <option value="PART_TIME">Part-Time</option>
            <option value="REMOTE">Remote</option>
            <option value="INTERNSHIP">Internship</option>
          </select>
        </div>

        <div>
          <label htmlFor="workplaceType" className="block text-sm font-medium text-gray-700 mb-1">
            Workplace Type
          </label>
          <select
            id="workplaceType"
            name="workplaceType"
            value={formData.workplaceType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ONSITE">On-site</option>
            <option value="HYBRID">Hybrid</option>
            <option value="REMOTE">Remote</option>
          </select>
        </div>

        <div>
          <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-1">
            Experience Level
          </label>
          <select
            id="experienceLevel"
            name="experienceLevel"
            value={formData.experienceLevel}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="JUNIOR">Junior</option>
            <option value="MID">Mid-level</option>
            <option value="SENIOR">Senior</option>
            <option value="LEAD">Lead</option>
          </select>
        </div>

        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
            Application Deadline
          </label>
          <div className="relative">
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]} // Set minimum date to today
              className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer ${
                formErrors.deadline ? 'border-red-500' : 'border-gray-300'
              }`}
              onClick={(e) => e.currentTarget.showPicker?.()}
              style={{
                WebkitAppearance: 'none',
                appearance: 'none',
                colorScheme: 'light',
                background: 'transparent'
              }}
            />
            <style>{`
              input[type="date"]::-webkit-calendar-picker-indicator {
                display: none;
              }
              input[type="date"]::-webkit-inner-spin-button,
              input[type="date"]::-webkit-outer-spin-button {
                -webkit-appearance: none;
                margin: 0;
              }
              input[type="date"]::-ms-clear {
                display: none;
              }
              input[type="date"]::-ms-reveal {
                display: none;
              }
            `}</style>
            <div
              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer pointer-events-auto"
              onClick={(e) => {
                e.preventDefault();
                const input = document.getElementById('deadline') as HTMLInputElement;
                input?.showPicker?.();
              }}
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          {formErrors.deadline && (
            <p className="mt-1 text-sm text-red-600">{formErrors.deadline}</p>
          )}
        </div>

        <div>
          <label htmlFor="applyUrl" className="block text-sm font-medium text-gray-700 mb-1">
            External Application URL
          </label>
          <input
            type="url"
            id="applyUrl"
            name="applyUrl"
            value={formData.applyUrl}
            onChange={handleChange}
            placeholder="https://example.com/apply"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              formErrors.applyUrl ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {formErrors.applyUrl && (
            <p className="mt-1 text-sm text-red-600">{formErrors.applyUrl}</p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-md font-medium text-gray-900 mb-3">Salary Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="salaryMin" className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Salary
            </label>
            <input
              type="number"
              id="salaryMin"
              value={typeof formData.salary === 'object' && formData.salary !== null ? formData.salary.min || '' : ''}
              onChange={(e) => handleSalaryChange('min', e.target.value ? Number(e.target.value) : null)}
              placeholder="e.g., 60000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="salaryMax" className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Salary
            </label>
            <input
              type="number"
              id="salaryMax"
              value={typeof formData.salary === 'object' && formData.salary !== null ? formData.salary.max || '' : ''}
              onChange={(e) => handleSalaryChange('max', e.target.value ? Number(e.target.value) : null)}
              placeholder="e.g., 80000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <select
              id="currency"
              value={typeof formData.salary === 'object' && formData.salary !== null ? formData.salary.currency || 'USD' : 'USD'}
              onChange={(e) => handleSalaryChange('currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CAD">CAD ($)</option>
              <option value="AUD">AUD ($)</option>
            </select>
          </div>

          <div>
            <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">
              Pay Period
            </label>
            <select
              id="period"
              value={typeof formData.salary === 'object' && formData.salary !== null ? formData.salary.period || 'YEARLY' : 'YEARLY'}
              onChange={(e) => handleSalaryChange('period', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="HOURLY">Hourly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
            </select>
          </div>
        </div>

        <div className="mt-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={typeof formData.salary === 'object' && formData.salary !== null ? formData.salary.isNegotiable || false : false}
              onChange={(e) => handleSalaryChange('isNegotiable', e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Salary is negotiable</span>
          </label>
          {formErrors.salary && (
            <p className="mt-1 text-sm text-red-600">{formErrors.salary}</p>
          )}
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
            placeholder="Describe the role, company culture, and what makes this position exciting..."
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
        <label htmlFor="responsibilities" className="block text-sm font-medium text-gray-700 mb-1">
          Responsibilities *
        </label>
        <div className={`editor-wrapper ${formErrors.responsibilities ? 'border border-red-500 rounded-md' : ''}`}>
          {(() => {
            try {
              return (
                <ReactQuill
                  theme="snow"
                  value={formData.responsibilitiesHtml}
                  onChange={handleResponsibilitiesChange}
                  placeholder="List the day-to-day responsibilities and key duties..."
                  modules={{
                    toolbar: [
                      [{ 'header': [2, false] }],
                      ['bold', 'italic'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      ['clean']
                    ],
                  }}
                />
              );
            } catch (error) {
              console.error('Error rendering ReactQuill for responsibilities:', error);
              return (
                <textarea
                  value={formData.responsibilitiesHtml}
                  onChange={(e) => handleResponsibilitiesChange(e.target.value)}
                  placeholder="List the day-to-day responsibilities and key duties..."
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    formErrors.responsibilities ? 'border-red-500' : 'border-gray-300'
                  }`}
                  rows={6}
                />
              );
            }
          })()}
        </div>
        {formErrors.responsibilities && (
          <p className="mt-1 text-sm text-red-600">{formErrors.responsibilities}</p>
        )}
      </div>

      <div>
        <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
          Requirements *
        </label>
        <div className={`editor-wrapper ${formErrors.requirements ? 'border border-red-500 rounded-md' : ''}`}>
          {(() => {
            try {
              return (
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
              );
            } catch (error) {
              console.error('Error rendering ReactQuill for requirements:', error);
              return (
                <textarea
                  value={formData.requirementsHtml}
                  onChange={(e) => handleRequirementsChange(e.target.value)}
                  placeholder="List the skills, experience, and qualifications needed..."
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    formErrors.requirements ? 'border-red-500' : 'border-gray-300'
                  }`}
                  rows={6}
                />
              );
            }
          })()}
        </div>
        {formErrors.requirements && (
          <p className="mt-1 text-sm text-red-600">{formErrors.requirements}</p>
        )}
      </div>

      <div>
        <label htmlFor="benefits" className="block text-sm font-medium text-gray-700 mb-1">
          Benefits
        </label>
        <div className="editor-wrapper">
          {(() => {
            try {
              return (
                <ReactQuill
                  theme="snow"
                  value={formData.benefitsHtml}
                  onChange={handleBenefitsChange}
                  placeholder="Describe the benefits, perks, and compensation package..."
                  modules={{
                    toolbar: [
                      [{ 'header': [2, false] }],
                      ['bold', 'italic'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      ['clean']
                    ],
                  }}
                />
              );
            } catch (error) {
              console.error('Error rendering ReactQuill for benefits:', error);
              return (
                <textarea
                  value={formData.benefitsHtml}
                  onChange={(e) => handleBenefitsChange(e.target.value)}
                  placeholder="Describe the benefits, perks, and compensation package..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={6}
                />
              );
            }
          })()}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Skills & Customization</h3>
      
      <div>
        <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
          Required Skills *
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
            className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              formErrors.skills ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <button
            type="button"
            onClick={handleSkillAdd}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add
          </button>
        </div>
        {formErrors.skills && (
          <p className="mt-1 text-sm text-red-600">{formErrors.skills}</p>
        )}
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
      
      <style>{`
        .editor-wrapper {
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
        }
        .editor-wrapper.border {
          border-width: 2px;
        }
        .editor-wrapper .ql-toolbar {
          border-top: none;
          border-left: none;
          border-right: none;
          border-bottom: 1px solid #e5e7eb;
          border-radius: 0.375rem 0.375rem 0 0;
        }
        .editor-wrapper .ql-container {
          border: none;
          border-radius: 0 0 0.375rem 0.375rem;
          font-size: 1rem;
          min-height: 150px;
        }
        .editor-wrapper.border-red-500 {
          border-color: #ef4444;
        }
        .editor-wrapper.border-red-500 .ql-toolbar {
          border-bottom-color: #ef4444;
        }
      `}</style>
    </div>
  );
};

export default CompanyDashboardJobForm;