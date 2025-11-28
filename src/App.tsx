

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CompanyAuthProvider } from './contexts/CompanyAuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CompanyLoginPage from './pages/CompanyLoginPage';
import CompanySignupPage from './pages/CompanySignupPage';
import DashboardPage from './pages/DashboardPage';
import CompanyDashboardPage from './pages/CompanyDashboardPage';
import JobsPage from './pages/JobsPage';
import CompanyJobsPage from './pages/CompanyJobsPage';
import CompanyApplicationsPage from './pages/CompanyApplicationsPage';
import { JobDetailsPage } from './pages/JobDetailsPage';
import RecruiterDashboard from './pages/RecruiterDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import NotFoundPage from './pages/NotFoundPage';

// Dashboard Components
import CompanyDashboardOverview from './components/dashboard/CompanyDashboardOverview';
import CompanyDashboardJobs from './components/dashboard/CompanyDashboardJobs';
import CompanyDashboardApplications from './components/dashboard/CompanyDashboardApplications';
import CompanyDashboardAnalytics from './components/dashboard/CompanyDashboardAnalytics';
import CompanyDashboardProfile from './components/dashboard/CompanyDashboardProfile';
import CompanyDashboardInterviews from './components/dashboard/CompanyDashboardInterviews';
import CompanyDashboardSettings from './components/dashboard/CompanyDashboardSettings';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CompanyAuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* User Authentication Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              
              {/* Company Authentication Routes */}
              <Route path="/company-login" element={<CompanyLoginPage />} />
              <Route path="/company-signup" element={<CompanySignupPage />} />
              
              {/* User Dashboard Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              
              {/* Company Dashboard Routes with Nested Routes */}
              <Route
                path="/company-dashboard"
                element={
                  <ProtectedRoute authType="company">
                    <CompanyDashboardPage />
                  </ProtectedRoute>
                }
              >
                <Route index element={<CompanyDashboardOverview />} />
                <Route path="jobs" element={<CompanyDashboardJobs />} />
                <Route path="applications" element={<CompanyDashboardApplications />} />
                <Route path="analytics" element={<CompanyDashboardAnalytics />} />
                <Route path="profile" element={<CompanyDashboardProfile />} />
                <Route path="interviews" element={<CompanyDashboardInterviews />} />
                <Route path="settings" element={<CompanyDashboardSettings />} />
              </Route>
              
              {/* Legacy Company Routes (for backward compatibility) */}
              <Route
                path="/company-jobs"
                element={
                  <ProtectedRoute authType="company">
                    <CompanyJobsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/company-applications"
                element={
                  <ProtectedRoute authType="company">
                    <CompanyApplicationsPage />
                  </ProtectedRoute>
                }
              />
              
              {/* Public Routes */}
              <Route
                path="/jobs"
                element={
                  <ProtectedRoute>
                    <JobsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/jobs/:id"
                element={
                  <ProtectedRoute>
                    <JobDetailsPage />
                  </ProtectedRoute>
                }
              />
              
              {/* Legacy Routes (for backward compatibility) */}
              <Route
                path="/recruiter-dashboard"
                element={<RecruiterDashboard />}
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute authType="user" requiredRole="recruiter">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              
              {/* Other Routes */}
              <Route
                path="/unauthorized"
                element={<UnauthorizedPage />}
              />
              {/* Landing Page - Public Route */}
              <Route path="/" element={<LandingPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </Router>
      </CompanyAuthProvider>
    </AuthProvider>
  );
};

export default App;
