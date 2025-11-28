import React from 'react';
import { Building, Settings, Globe, Mail, Phone, MapPin } from 'lucide-react';

const CompanyDashboardProfile: React.FC = () => {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Company Profile</h1>
        <p className="text-gray-600 mt-2">
          Manage your company information and settings
        </p>
      </div>

      {/* Profile Content */}
      <div className="bg-white rounded-lg shadow p-8">
        <div className="flex items-center mb-6">
          <div className="bg-indigo-100 p-4 rounded-full mr-4">
            <Building className="w-12 h-12 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Company Name</h2>
            <p className="text-gray-600">company@example.com</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Building className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Industry</p>
                  <p className="text-sm text-gray-600">Technology</p>
                </div>
              </div>
              <div className="flex items-center">
                <Globe className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Website</p>
                  <p className="text-sm text-blue-600">www.example.com</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Location</p>
                  <p className="text-sm text-gray-600">San Francisco, CA</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">hr@company.com</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Phone</p>
                  <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Description</h3>
          <p className="text-gray-600 mb-6">
            We are a leading technology company focused on innovation and excellence. Our team is passionate about creating solutions that make a difference in people's lives.
          </p>
          
          <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            <Settings className="w-4 h-4 mr-2" />
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboardProfile;