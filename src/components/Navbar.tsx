import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface NavbarProps {
  role: 'JOB_SEEKER' | 'RECRUITER' | null
  isLoggedIn: boolean
}

export function Navbar({ role, isLoggedIn }: NavbarProps) {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">JobPortal</h1>
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn && (
              <>
                <button
                  onClick={() => navigate('/jobs')}
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Jobs
                </button>
                {role === 'JOB_SEEKER' && (
                  <button
                    onClick={() => navigate('/jobs')}
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Browse Jobs
                  </button>
                )}
                {role === 'RECRUITER' && (
                  <button
                    onClick={() => navigate('/recruiter-dashboard')}
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </button>
                )}
                <span className="text-sm text-gray-600 capitalize">
                  {role}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}