import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Users, 
  Building2, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-700">
      
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-indigo-50 blur-3xl opacity-50"></div>
        <div className="absolute top-20 -left-20 w-72 h-72 rounded-full bg-green-50 blur-3xl opacity-50"></div>
      </div>

      {/* Hero Section */}
      <div className="relative pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium mb-8">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2"></span>
            The #1 Platform for Modern Hiring
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8">
            Find Your <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">Dream Job</span>
            <br />
            Hire <span className="text-transparent bg-clip-text bg-linear-to-r from-green-600 to-teal-600">Top Talent</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-gray-500 mb-10 leading-relaxed">
            Connecting world-class professionals with amazing companies. 
            No complex forms, no ghosting—just seamless connections.
          </p>

          {/* Social Proof Strip */}
          <div className="pt-8 border-t border-gray-100">
            <p className="text-sm text-gray-400 font-medium mb-6 uppercase tracking-wider">Trusted by innovative teams</p>
            <div className="flex justify-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Placeholders for logos */}
              <div className="h-8 w-24 bg-gray-800 rounded"></div>
              <div className="h-8 w-24 bg-gray-800 rounded"></div>
              <div className="h-8 w-24 bg-gray-800 rounded"></div>
              <div className="h-8 w-24 bg-gray-800 rounded hidden sm:block"></div>
            </div>
          </div>
        </div>
      </div>

      {/* The Choice Section (CTA) */}
      <div className="bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Choose your path</h2>
            <p className="mt-4 text-lg text-gray-600">Select how you want to use our platform today.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Job Seeker Card */}
            <div className="group relative bg-white rounded-3xl border border-gray-200 p-8 shadow-sm hover:shadow-2xl hover:shadow-indigo-100 hover:border-indigo-200 transition-all duration-300">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Search className="w-32 h-32 text-indigo-600 transform rotate-12" />
              </div>
              
              <div className="relative z-10">
                <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-7 h-7 text-indigo-600" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">I'm a Candidate</h3>
                <p className="text-gray-500 mb-8">Looking for opportunities to grow my career and skills.</p>
                
                <ul className="space-y-4 mb-8">
                  {['One-click applications', 'Salary transparency', 'Direct messaging with recruiters'].map((item, i) => (
                    <li key={i} className="flex items-center text-gray-600">
                      <CheckCircle2 className="w-5 h-5 text-indigo-500 mr-3 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/signup"
                  className="block w-full py-4 px-6 bg-gray-900 hover:bg-indigo-600 text-white font-semibold rounded-xl text-center transition-colors duration-200 shadow-lg shadow-gray-200 group-hover:shadow-indigo-200"
                >
                  Find Jobs Now
                </Link>
                
                <div className="mt-4 text-center">
                  <span className="text-sm text-gray-500">Already a member? </span>
                  <Link to="/login" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
                    Sign in
                  </Link>
                </div>
              </div>
            </div>

            {/* Employer Card */}
            <div className="group relative bg-white rounded-3xl border border-gray-200 p-8 shadow-sm hover:shadow-2xl hover:shadow-green-100 hover:border-green-200 transition-all duration-300">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Building2 className="w-32 h-32 text-green-600 transform -rotate-12" />
              </div>
              
              <div className="relative z-10">
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Briefcase className="w-7 h-7 text-green-600" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">I'm an Employer</h3>
                <p className="text-gray-500 mb-8">Looking to build a world-class team with top talent.</p>
                
                <ul className="space-y-4 mb-8">
                  {['Access to top 1% talent', 'AI-powered candidate matching', 'Automated interview scheduling'].map((item, i) => (
                    <li key={i} className="flex items-center text-gray-600">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/company-signup"
                  className="block w-full py-4 px-6 bg-white border-2 border-gray-200 hover:border-green-600 hover:text-green-700 text-gray-900 font-semibold rounded-xl text-center transition-colors duration-200"
                >
                  Post a Job
                </Link>

                <div className="mt-4 text-center">
                  <span className="text-sm text-gray-500">Hiring already? </span>
                  <Link to="/company-login" className="text-sm font-semibold text-green-600 hover:text-green-500">
                    Company Login
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to succeed</h2>
            <p className="text-gray-500 text-lg">Whether you're hiring or hunting, our platform provides the tools to make the process simple and effective.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="h-6 w-6 text-indigo-600" />,
                title: "Vetted Community",
                desc: "Access a network of verified professionals and legitimate companies. No spam, just real opportunities."
              },
              {
                icon: <TrendingUp className="h-6 w-6 text-indigo-600" />,
                title: "Smart Analytics",
                desc: "Track your applications or job post performance with real-time insights and data."
              },
              {
                icon: <ShieldCheck className="h-6 w-6 text-indigo-600" />,
                title: "Secure Process",
                desc: "Your data is protected. We prioritize privacy and security for both candidates and employers."
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-20 text-center">
            <Link to="/about" className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">
              Learn more about our mission <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;