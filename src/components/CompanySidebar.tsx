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
      label: 'Interviews',
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
    <>
      {/* Mobile Bottom Navigation (Visible < md) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 z-50 flex justify-around items-center px-2 shadow-[0_-1px_3px_rgba(0,0,0,0.1)]">
        {menuItems.slice(0, 5).map((item) => ( // Show top 5 items on mobile to fit
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center p-2 rounded-lg ${
              isActive(item.path) ? 'text-indigo-600' : 'text-gray-500'
            }`}
          >
            {item.icon}
          </button>
        ))}
        {/* Mobile "More" button for remaining items could go here if needed */}
      </div>

      {/* Desktop Sidebar (Visible >= md) */}
      <div
        className={`hidden md:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 h-screen sticky top-0 z-40 ${
          isExpanded ? 'w-64' : 'w-20'
        }`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="flex flex-col h-full overflow-y-auto no-scrollbar">
          {/* Logo Area Placeholder (Optional - aligns with Navbar height) */}
          <div className="h-16 shrink-0" /> 

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors whitespace-nowrap overflow-hidden ${
                  isActive(item.path)
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                title={!isExpanded ? item.label : ''}
              >
                <div className="shrink-0">{item.icon}</div>
                <span
                  className={`ml-3 text-sm font-medium transition-opacity duration-200 ${
                    isExpanded ? 'opacity-100' : 'opacity-0 w-0'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default CompanySidebar;