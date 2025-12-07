import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { resumeService } from '../services/resumeService';
import type { Resume } from '../types/resume.types';
import {
  Upload,
  FileText,
  Eye,
  Download,
  Plus,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  File,
  Star,
  Crown
} from 'lucide-react';

const ResumeManagement: React.FC = () => {
  const { token } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const [isSettingPrimary, setIsSettingPrimary] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchUserResumes();
  }, [token]);

  const fetchUserResumes = async () => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      const userResumes = await resumeService.getUserResumes(token);
      setResumes(userResumes);
    } catch (error) {
      console.error('Error fetching resumes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type (PDF, DOC, DOCX)
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setUploadStatus('error');
        setUploadMessage('Please upload a PDF, DOC, or DOCX file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadStatus('error');
        setUploadMessage('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setUploadStatus('idle');
      setUploadMessage('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !token) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setIsUploading(true);
      const response = await resumeService.uploadResume(formData, token);
      
      setResumes([response, ...resumes]);
      setSelectedFile(null);
      setUploadStatus('success');
      setUploadMessage('Resume uploaded successfully!');
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      setUploadStatus('error');
      setUploadMessage(error instanceof Error ? error.message : 'Failed to upload resume');
    } finally {
      setIsUploading(false);
    }
  };

  const handlePreview = (resume: Resume) => {
    setPreviewUrl(resume.previewUrl);
  };

  const handleClosePreview = () => {
    setPreviewUrl(null);
  };

  const handleDownload = (resume: Resume) => {
    window.open(resume.fileUrl, '_blank');
  };

  const handleSetPrimary = async (resumeId: number) => {
    if (!token) return;

    try {
      setIsSettingPrimary(resumeId);
      await resumeService.setPrimaryResume(resumeId, token);
      
      // Update the resumes list to reflect the change
      setResumes(prevResumes =>
        prevResumes.map(resume => ({
          ...resume,
          isPrimary: resume.id === resumeId
        }))
      );
    } catch (error) {
      console.error('Error setting primary resume:', error);
      setUploadStatus('error');
      setUploadMessage(error instanceof Error ? error.message : 'Failed to set primary resume');
    } finally {
      setIsSettingPrimary(null);
    }
  };

  const formatDate = (dateValue: string | number[]) => {
    let date: Date;
    
    if (Array.isArray(dateValue)) {
      // Handle array format: [year, month, day, hour, minute, second, nanosecond]
      const [year, month, day, hour = 0, minute = 0, second = 0] = dateValue;
      date = new Date(year, month - 1, day, hour, minute, second); // month is 0-indexed in Date constructor
    } else {
      // Handle string format
      date = new Date(dateValue);
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileText className="w-6 h-6 text-red-500" />;
      case 'doc':
      case 'docx':
        return <File className="w-6 h-6 text-blue-500" />;
      default:
        return <File className="w-6 h-6 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Upload className="w-5 h-5 mr-2" />
          Upload Resume
        </h3>
        
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
              id="resume-upload"
            />
            <label
              htmlFor="resume-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <FileText className="w-12 h-12 text-gray-400 mb-3" />
              <span className="text-sm font-medium text-gray-700">
                {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
              </span>
              <span className="text-xs text-gray-500 mt-1">
                PDF, DOC, DOCX (max 5MB)
              </span>
            </label>
          </div>

          {selectedFile && (
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                {getFileIcon(selectedFile.name)}
                <span className="ml-3 text-sm font-medium text-gray-900">{selectedFile.name}</span>
                <span className="ml-2 text-xs text-gray-500">
                  ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setUploadStatus('idle');
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {uploadStatus !== 'idle' && (
            <div className={`p-3 rounded-lg flex items-center ${
              uploadStatus === 'success' 
                ? 'bg-green-50 text-green-800' 
                : 'bg-red-50 text-red-800'
            }`}>
              {uploadStatus === 'success' ? (
                <CheckCircle className="w-4 h-4 mr-2" />
              ) : (
                <AlertCircle className="w-4 h-4 mr-2" />
              )}
              <span className="text-sm">{uploadMessage}</span>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Upload Resume
              </>
            )}
          </button>
        </div>
      </div>

      {/* Resumes List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          My Resumes
        </h3>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No resumes uploaded yet</p>
            <p className="text-sm text-gray-400 mt-1">Upload your first resume to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className={`flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors ${
                  resume.isPrimary ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {getFileIcon(resume.name)}
                  <div className="flex-1">
                    <div className="flex items-center">
                      <p className="font-medium text-gray-900">{resume.name}</p>
                      {resume.isPrimary && (
                        <div className="ml-2 flex items-center text-blue-600">
                          <Crown className="w-4 h-4 mr-1" />
                          <span className="text-xs font-medium">Primary</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      Uploaded on {formatDate(resume.createdAt)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {!resume.isPrimary && (
                    <button
                      onClick={() => handleSetPrimary(resume.id)}
                      disabled={isSettingPrimary === resume.id}
                      className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Set as Primary"
                    >
                      {isSettingPrimary === resume.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Star className="w-4 h-4" />
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => handlePreview(resume)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDownload(resume)}
                    className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Resume Preview</h3>
              <button
                onClick={handleClosePreview}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
              <img
                src={previewUrl}
                alt="Resume Preview"
                className="max-w-full h-auto mx-auto"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeManagement;