import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useCompanyAuth } from '../hooks/useCompanyAuth'
import {
  Briefcase,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  User as UserIcon,
  Search,
  Settings,
  ChevronDown,
  Building,
} from 'lucide-react'

export function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout: userLogout } = useAuth()
  const { company, logout: companyLogout } = useCompanyAuth()
  
  // State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  
  // Refs for click outside detection
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isLoggedIn = !!(user || company)
  const isCompany = !!company
  const role = isCompany ? 'COMPANY' : user?.role || null
  const username = isCompany
    ? company?.name || company?.email?.split('@')[0] || 'Company'
    : user?.name || user?.email?.split('@')[0] || 'Guest'

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    if (isCompany) {
      companyLogout()
    } else {
      userLogout()
    }
    navigate('/login')
    setIsMobileMenuOpen(false)
    setIsProfileOpen(false)
  }

  const handleNavigation = (path: string) => {
    navigate(path)
    setIsMobileMenuOpen(false)
    setIsProfileOpen(false)
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Section */}
          <div 
            className="flex items-center cursor-pointer group" 
            onClick={() => handleNavigation('/')}
          >
            <div className="bg-blue-600 p-1.5 rounded-lg mr-2 group-hover:bg-blue-700 transition-colors">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              Job<span className="text-blue-600">Portal</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {isLoggedIn && (
              <>
                {/* Main Navigation Links */}
                <div className="flex items-center gap-1 mr-2">
                  {isCompany ? (
                    <>
                      <button
                        onClick={() => handleNavigation('/company-dashboard')}
                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          isActive('/company-dashboard')
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </button>
                      <button
                        onClick={() => handleNavigation('/company-jobs')}
                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          isActive('/company-jobs')
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <Briefcase className="w-4 h-4 mr-2" />
                        My Jobs
                      </button>
                      <button
                        onClick={() => handleNavigation('/company-applications')}
                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          isActive('/company-applications')
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <Search className="w-4 h-4 mr-2" />
                        Applications
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleNavigation('/jobs')}
                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          isActive('/jobs')
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <Search className="w-4 h-4 mr-2" />
                        Find Jobs
                      </button>
                    </>
                  )}
                </div>

                <div className="h-6 w-px bg-gray-200 mx-2"></div>

                {/* User/Company Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCompany ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                      {isCompany ? <Building className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{username}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 animation-fade-in">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs text-gray-500">Signed in as</p>
                        <p className="text-sm font-semibold text-gray-900 truncate">{username}</p>
                        <p className="text-xs text-gray-500 capitalize">{isCompany ? 'Company' : role?.replace('_', ' ').toLowerCase()}</p>
                      </div>
                      
                      <div className="py-1">
                        {isCompany ? (
                          <>
                            <button
                              onClick={() => handleNavigation('/company-dashboard')}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <LayoutDashboard className="w-4 h-4 mr-2" />
                              Company Dashboard
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                if (role === 'ADMIN') {
                                  handleNavigation('/admin')
                                } else {
                                  handleNavigation('/dashboard')
                                }
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <LayoutDashboard className="w-4 h-4 mr-2" />
                              Dashboard
                            </button>
                            {role === 'ADMIN' && (
                              <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-100">
                                Administrator Access
                              </div>
                            )}
                          </>
                        )}
                        <button
                          onClick={() => handleNavigation('/settings')}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Settings
                        </button>
                      </div>

                      <div className="border-t border-gray-100 py-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {!isLoggedIn && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 border-r border-gray-200 pr-3">
                  <button
                    onClick={() => handleNavigation('/login')}
                    className="text-gray-600 hover:text-gray-900 font-medium text-sm px-3 py-2"
                  >
                    User Login
                  </button>
                  <button
                    onClick={() => handleNavigation('/company-login')}
                    className="text-gray-600 hover:text-gray-900 font-medium text-sm px-3 py-2"
                  >
                    Company Login
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleNavigation('/signup')}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm px-3 py-2"
                  >
                    User Sign Up
                  </button>
                  <button
                    onClick={() => handleNavigation('/company-signup')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all shadow-sm hover:shadow"
                  >
                    Company Sign Up
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-md"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg h-screen">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {isLoggedIn ? (
              <>
                {/* Mobile User/Company Header */}
                <div className="flex items-center gap-3 py-4 border-b border-gray-100 mb-4">
                  <div className={`${isCompany ? 'bg-green-100' : 'bg-blue-100'} p-3 rounded-full`}>
                    {isCompany ? (
                      <Building className="w-6 h-6 text-green-600" />
                    ) : (
                      <UserIcon className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-semibold text-gray-900">{username}</span>
                    <span className="text-xs text-gray-500 capitalize">{isCompany ? 'Company' : role?.replace('_', ' ').toLowerCase()}</span>
                  </div>
                </div>

                {isCompany ? (
                  <>
                    <button
                      onClick={() => handleNavigation('/company-dashboard')}
                      className="flex items-center w-full px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <LayoutDashboard className="w-5 h-5 mr-3 text-gray-400" />
                      Company Dashboard
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleNavigation('/jobs')}
                      className="flex items-center w-full px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <Search className="w-5 h-5 mr-3 text-gray-400" />
                      Find Jobs
                    </button>
                  </>
                )}

                <div className="border-t border-gray-100 my-2 pt-2">
                  {!isCompany && (
                    <>
                      <button
                        onClick={() => {
                          if (role === 'ADMIN') {
                            handleNavigation('/admin')
                          } else {
                            handleNavigation('/dashboard')
                          }
                        }}
                        className="flex items-center w-full px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
                      >
                        <LayoutDashboard className="w-5 h-5 mr-3 text-gray-400" />
                        Dashboard
                      </button>
                      {role === 'ADMIN' && (
                        <div className="px-3 py-2 text-xs text-gray-500">
                          Administrator Access
                        </div>
                      )}
                    </>
                  )}
                  <button
                    onClick={() => handleNavigation('/settings')}
                    className="flex items-center w-full px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Settings className="w-5 h-5 mr-3 text-gray-400" />
                    Settings
                  </button>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 mt-2"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </button>
              </>
            ) : (
              <div className="grid gap-3 pt-4">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleNavigation('/login')}
                    className="text-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 text-sm"
                  >
                    User Login
                  </button>
                  <button
                    onClick={() => handleNavigation('/company-login')}
                    className="text-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 text-sm"
                  >
                    Company Login
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleNavigation('/signup')}
                    className="text-center px-4 py-3 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 text-sm"
                  >
                    User Sign Up
                  </button>
                  <button
                    onClick={() => handleNavigation('/company-signup')}
                    className="text-center px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 text-sm"
                  >
                    Company Sign Up
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}