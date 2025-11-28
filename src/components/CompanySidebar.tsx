import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  BarChart3,
  Settings,
  Building,
  Calendar,
} from 'lucide-react';

export const CompanySidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  const menuItems = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: 'Dashboard',
      path: '/company-dashboard',
    },
    {
      icon: <Briefcase className="w-5 h-5" />,
      label: 'My Jobs',
      path: '/company-dashboard/jobs',
    },
    {
      icon: <FileText className="w-5 h-5" />,
      label: 'Applications',
      path: '/company-dashboard/applications',
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      label: 'Analytics',
      path: '/company-dashboard/analytics',
    },
    {
      icon: <Building className="w-5 h-5" />,
      label: 'Company Profile',
      path: '/company-dashboard/profile',
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: 'Interview Schedule',
      path: '/company-dashboard/interviews',
    },
    {
      icon: <Settings className="w-5 h-5" />,
      label: 'Settings',
      path: '/company-dashboard/settings',
    },
  ];

  const isActive = (path: string) => {
    if (path === '/company-dashboard') {
      return location.pathname === path || location.pathname === '/company-dashboard/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div
      className={`bg-white border-r border-gray-200 transition-all duration-300 ${
        isExpanded ? 'w-64' : 'w-20'
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex flex-col h-full">
        {/* Logo/Brand */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Building className="w-6 h-6 text-white" />
            </div>
            {isExpanded && (
              <span className="ml-3 text-xl font-bold text-gray-900">
                Job<span className="text-indigo-600">Portal</span>
              </span>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="shrink-0">{item.icon}</div>
              {isExpanded && (
                <span className="ml-3 text-sm font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default CompanySidebar;