import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
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
} from 'lucide-react'

export function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  
  // State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  
  // Refs for click outside detection
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isLoggedIn = !!user
  const role = user?.role || null
  const username = user?.name || user?.email?.split('@')[0] || 'Guest'

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
    logout()
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
                </div>

                <div className="h-6 w-px bg-gray-200 mx-2"></div>

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <UserIcon className="w-4 h-4" />
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
                      </div>
                      
                      <div className="py-1">
                        <button
                          onClick={() => handleNavigation(role === 'RECRUITER' ? '/recruiter-dashboard' : '/dashboard')}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <LayoutDashboard className="w-4 h-4 mr-2" />
                          Dashboard
                        </button>
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
                <button
                  onClick={() => handleNavigation('/login')}
                  className="text-gray-600 hover:text-gray-900 font-medium text-sm px-3 py-2"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNavigation('/register')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all shadow-sm hover:shadow"
                >
                  Sign Up
                </button>
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
                {/* Mobile User Header */}
                <div className="flex items-center gap-3 py-4 border-b border-gray-100 mb-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <UserIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-semibold text-gray-900">{username}</span>
                    <span className="text-xs text-gray-500 capitalize">{role?.replace('_', ' ').toLowerCase()}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleNavigation('/jobs')}
                  className="flex items-center w-full px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Search className="w-5 h-5 mr-3 text-gray-400" />
                  Find Jobs
                </button>

                <div className="border-t border-gray-100 my-2 pt-2">
                  <button
                    onClick={() => handleNavigation(role === 'RECRUITER' ? '/recruiter-dashboard' : '/dashboard')}
                    className="flex items-center w-full px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <LayoutDashboard className="w-5 h-5 mr-3 text-gray-400" />
                    Dashboard
                  </button>
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
                <button
                  onClick={() => handleNavigation('/login')}
                  className="w-full text-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNavigation('/register')}
                  className="w-full text-center px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}