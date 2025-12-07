import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  Calendar,
  Clock,
  Video,
  User,
  Building,
  Plus,
  Filter,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  ExternalLink
} from 'lucide-react';

// Define schedule/event types
interface InterviewEvent {
  id: string;
  title: string;
  company: {
    id: string;
    name: string;
    logo?: string;
  };
  jobTitle: string;
  type: 'phone' | 'video' | 'onsite' | 'technical' | 'behavioral';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  location?: string;
  meetingLink?: string;
  interviewer?: {
    name: string;
    email: string;
    role: string;
  };
  notes?: string;
  reminder?: {
    enabled: boolean;
    time: number; // minutes before event
  };
  createdAt: string;
  updatedAt: string;
}

const Schedule: React.FC = () => {
  const { token } = useAuth();
  const [events, setEvents] = useState<InterviewEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    fetchScheduleEvents();
  }, [token]);

  const fetchScheduleEvents = async () => {
    if (!token) {
      setError('Authentication token not found');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      // TODO: Replace with actual API call when schedule endpoint is available
      // For now, we'll simulate with mock data
      const mockEvents: InterviewEvent[] = [
        {
          id: '1',
          title: 'Technical Interview - Senior Frontend Developer',
          company: {
            id: '1',
            name: 'Tech Corp',
            logo: ''
          },
          jobTitle: 'Senior Frontend Developer',
          type: 'technical',
          status: 'scheduled',
          date: '2023-12-10',
          startTime: '14:00',
          endTime: '15:30',
          duration: 90,
          meetingLink: 'https://zoom.us/j/123456789',
          interviewer: {
            name: 'Sarah Johnson',
            email: 'sarah@techcorp.com',
            role: 'Senior Engineering Manager'
          },
          notes: 'Focus on React and TypeScript experience. Bring portfolio examples.',
          reminder: {
            enabled: true,
            time: 30
          },
          createdAt: '2023-12-06T10:00:00Z',
          updatedAt: '2023-12-06T10:00:00Z'
        },
        {
          id: '2',
          title: 'Behavioral Interview',
          company: {
            id: '1',
            name: 'Tech Corp',
            logo: ''
          },
          jobTitle: 'Senior Frontend Developer',
          type: 'behavioral',
          status: 'scheduled',
          date: '2023-12-12',
          startTime: '10:00',
          endTime: '11:00',
          duration: 60,
          meetingLink: 'https://zoom.us/j/987654321',
          interviewer: {
            name: 'Michael Chen',
            email: 'michael@techcorp.com',
            role: 'HR Manager'
          },
          notes: 'Discuss previous work experience and team collaboration.',
          reminder: {
            enabled: true,
            time: 15
          },
          createdAt: '2023-12-06T10:30:00Z',
          updatedAt: '2023-12-06T10:30:00Z'
        },
        {
          id: '3',
          title: 'Phone Screening',
          company: {
            id: '2',
            name: 'StartupXYZ',
            logo: ''
          },
          jobTitle: 'Full Stack Engineer',
          type: 'phone',
          status: 'completed',
          date: '2023-12-01',
          startTime: '15:00',
          endTime: '15:30',
          duration: 30,
          interviewer: {
            name: 'Alex Rodriguez',
            email: 'alex@startupxyz.com',
            role: 'Recruiter'
          },
          notes: 'Initial phone screening went well. Discuss technical skills and experience.',
          reminder: {
            enabled: false,
            time: 0
          },
          createdAt: '2023-11-28T09:00:00Z',
          updatedAt: '2023-12-01T15:30:00Z'
        }
      ];
      setEvents(mockEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch schedule events');
    } finally {
      setIsLoading(false);
    }
  };


  const handleDeleteEvent = async (eventId: string) => {
    try {
      // TODO: Replace with actual API call
      // await scheduleService.deleteEvent(eventId, token);
      setEvents(events.filter(event => event.id !== eventId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete event');
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const now = new Date();
    const eventDate = new Date(event.date);
    
    const matchesFilter = filterType === 'all' ||
                         (filterType === 'upcoming' && eventDate >= now && event.status === 'scheduled') ||
                         (filterType === 'completed' && event.status === 'completed') ||
                         (filterType === 'cancelled' && event.status === 'cancelled');
    
    return matchesSearch && matchesFilter;
  });


  const getStatusColor = (status: InterviewEvent['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'rescheduled':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: InterviewEvent['status']) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'rescheduled':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };


  const upcomingEvents = filteredEvents.filter(event => {
    const eventDate = new Date(event.date);
    const now = new Date();
    return eventDate >= now && event.status === 'scheduled';
  });

  const pastEvents = filteredEvents.filter(event => {
    const eventDate = new Date(event.date);
    const now = new Date();
    return eventDate < now || event.status !== 'scheduled';
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-blue-600" />
            Interview Schedule
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              {upcomingEvents.length} upcoming
            </div>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search interviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'upcoming' | 'completed' | 'cancelled')}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Events</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex justify-center items-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          </div>
        </div>
      ) : (
        <>
          {/* Events List */}
          {filteredEvents.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews scheduled</h3>
              <p className="text-gray-500">
                {searchTerm || filterType !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Your scheduled interviews will appear here'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Upcoming Events */}
              {upcomingEvents.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
                    <h3 className="text-lg font-semibold text-gray-900">Upcoming Interviews</h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <h4 className="text-lg font-semibold text-gray-900 mr-3">{event.title}</h4>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
                                {getStatusIcon(event.status)}
                                <span className="ml-1">{event.status}</span>
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                              <div className="flex items-center text-sm text-gray-600">
                                <Building className="w-4 h-4 mr-2" />
                                <span>{event.company.name}</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <User className="w-4 h-4 mr-2" />
                                <span>{event.jobTitle}</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <Calendar className="w-4 h-4 mr-2" />
                                <span>{formatDate(event.date)}</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <Clock className="w-4 h-4 mr-2" />
                                <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                              </div>
                            </div>
                            
                            {event.interviewer && (
                              <div className="flex items-center text-sm text-gray-600 mb-3">
                                <User className="w-4 h-4 mr-2" />
                                <span>Interviewer: {event.interviewer.name} ({event.interviewer.role})</span>
                              </div>
                            )}
                            
                            {event.meetingLink && (
                              <div className="flex items-center text-sm text-blue-600 mb-3">
                                <Video className="w-4 h-4 mr-2" />
                                <a 
                                  href={event.meetingLink} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="hover:underline"
                                >
                                  Join Meeting
                                </a>
                              </div>
                            )}
                            
                            {event.notes && (
                              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                <p className="text-sm text-gray-700">{event.notes}</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            {event.meetingLink && (
                              <button
                                onClick={() => window.open(event.meetingLink, '_blank')}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Join meeting"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Edit event"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(event.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete event"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Past Events */}
              {pastEvents.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-900">Past Interviews</h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {pastEvents.map((event) => (
                      <div key={event.id} className="p-6 hover:bg-gray-50 transition-colors opacity-75">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <h4 className="text-lg font-medium text-gray-900 mr-3">{event.title}</h4>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
                                {getStatusIcon(event.status)}
                                <span className="ml-1">{event.status}</span>
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                              <div className="flex items-center text-sm text-gray-600">
                                <Building className="w-4 h-4 mr-2" />
                                <span>{event.company.name}</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <User className="w-4 h-4 mr-2" />
                                <span>{event.jobTitle}</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <Calendar className="w-4 h-4 mr-2" />
                                <span>{formatDate(event.date)}</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <Clock className="w-4 h-4 mr-2" />
                                <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                              title="View details"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Schedule;