import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  MessageSquare,
  Search,
  Send,
  User,
  Filter,
  Trash2,
  Archive,
  Star,
  Loader2,
  X
} from 'lucide-react';

// Define message types
interface Message {
  id: string;
  subject: string;
  content: string;
  sender: {
    id: string;
    name: string;
    type: 'company' | 'system';
    avatar?: string;
    company?: string;
  };
  recipient: {
    id: string;
    name: string;
  };
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  isArchived: boolean;
  threadId?: string;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    size: number;
  }>;
}

const Messages: React.FC = () => {
  const { token, user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'starred' | 'archived'>('all');
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, [token]);

  const fetchMessages = async () => {
    if (!token) {
      setError('Authentication token not found');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      // TODO: Replace with actual API call when messages endpoint is available
      // For now, we'll simulate with mock data
      const mockMessages: Message[] = [
        {
          id: '1',
          subject: 'Application Status Update - Senior Frontend Developer',
          content: 'Thank you for your interest in the Senior Frontend Developer position at Tech Corp. We have reviewed your application and would like to schedule an interview for next week. Please let us know your availability.',
          sender: {
            id: 'company1',
            name: 'Sarah Johnson',
            type: 'company',
            company: 'Tech Corp'
          },
          recipient: {
            id: user?.id || '',
            name: user?.name || 'User'
          },
          timestamp: '2023-12-05T10:30:00Z',
          isRead: false,
          isStarred: true,
          isArchived: false,
          threadId: 'thread1'
        },
        {
          id: '2',
          subject: 'Interview Confirmation',
          content: 'This is to confirm your interview scheduled for December 10, 2023 at 2:00 PM EST. The interview will be conducted via video call. We will send the meeting link 24 hours before the scheduled time.',
          sender: {
            id: 'company1',
            name: 'Sarah Johnson',
            type: 'company',
            company: 'Tech Corp'
          },
          recipient: {
            id: user?.id || '',
            name: user?.name || 'User'
          },
          timestamp: '2023-12-06T14:15:00Z',
          isRead: true,
          isStarred: false,
          isArchived: false,
          threadId: 'thread1'
        },
        {
          id: '3',
          subject: 'New Job Matching Your Profile',
          content: 'We found a new job opportunity that matches your profile: Full Stack Developer at StartupXYZ. The role requires experience with React and Node.js, which aligns with your skills. Click here to view the job details.',
          sender: {
            id: 'system',
            name: 'Job Portal',
            type: 'system'
          },
          recipient: {
            id: user?.id || '',
            name: user?.name || 'User'
          },
          timestamp: '2023-12-07T09:00:00Z',
          isRead: true,
          isStarred: false,
          isArchived: false
        }
      ];
      setMessages(mockMessages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      // TODO: Replace with actual API call
      // await messageService.markAsRead(messageId, token);
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, isRead: true } : msg
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark message as read');
    }
  };

  const handleToggleStar = async (messageId: string) => {
    try {
      // TODO: Replace with actual API call
      // await messageService.toggleStar(messageId, token);
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, isStarred: !msg.isStarred } : msg
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update star status');
    }
  };

  const handleArchive = async (messageId: string) => {
    try {
      // TODO: Replace with actual API call
      // await messageService.archive(messageId, token);
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, isArchived: !msg.isArchived } : msg
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to archive message');
    }
  };

  const handleDelete = async (messageId: string) => {
    try {
      // TODO: Replace with actual API call
      // await messageService.delete(messageId, token);
      setMessages(messages.filter(msg => msg.id !== messageId));
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete message');
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedMessage || !token) return;

    try {
      setIsSending(true);
      // TODO: Replace with actual API call
      // await messageService.sendReply(selectedMessage.threadId || selectedMessage.id, replyText, token);
      
      // Add the reply to the messages list (optimistic update)
      const newReply: Message = {
        id: `reply_${Date.now()}`,
        subject: `Re: ${selectedMessage.subject}`,
        content: replyText,
        sender: {
          id: user?.id || '',
          name: user?.name || 'User',
          type: 'company' // Using company type for user messages
        },
        recipient: selectedMessage.sender,
        timestamp: new Date().toISOString(),
        isRead: true,
        isStarred: false,
        isArchived: false,
        threadId: selectedMessage.threadId || selectedMessage.id
      };
      
      setMessages([newReply, ...messages]);
      setReplyText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reply');
    } finally {
      setIsSending(false);
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.sender.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' ||
                         (filterType === 'unread' && !message.isRead) ||
                         (filterType === 'starred' && message.isStarred) ||
                         (filterType === 'archived' && message.isArchived);
    
    return matchesSearch && matchesFilter && !message.isArchived;
  });

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <MessageSquare className="w-6 h-6 mr-2 text-blue-600" />
            Messages
          </h2>
          <div className="text-sm text-gray-500">
            {filteredMessages.filter(m => !m.isRead).length} unread
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'unread' | 'starred' | 'archived')}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Messages</option>
              <option value="unread">Unread</option>
              <option value="starred">Starred</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <X className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Messages List */}
      <div className="flex-1 flex gap-6">
        {/* Message List */}
        <div className="w-full lg:w-2/5 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 p-8 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No messages</h3>
              <p className="text-gray-500">
                {searchTerm || filterType !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Your messages will appear here'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => {
                    setSelectedMessage(message);
                    if (!message.isRead) {
                      handleMarkAsRead(message.id);
                    }
                  }}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedMessage?.id === message.id ? 'bg-blue-50' : ''
                  } ${!message.isRead ? 'bg-blue-50/30' : ''}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center min-w-0">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                        {message.sender.type === 'system' ? (
                          <MessageSquare className="w-5 h-5 text-gray-600" />
                        ) : (
                          <User className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center">
                          <p className={`text-sm ${!message.isRead ? 'font-semibold' : 'font-medium'} text-gray-900 truncate`}>
                            {message.sender.name}
                          </p>
                          {message.sender.company && (
                            <span className="ml-2 text-xs text-gray-500">
                              at {message.sender.company}
                            </span>
                          )}
                        </div>
                        <p className={`text-sm ${!message.isRead ? 'font-medium' : ''} text-gray-900 truncate`}>
                          {message.subject}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end ml-2">
                      <span className="text-xs text-gray-500 mb-1">
                        {formatTimestamp(message.timestamp)}
                      </span>
                      <div className="flex items-center space-x-1">
                        {message.isStarred && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                        {!message.isRead && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 ml-13">
                    {message.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div className="hidden lg:block lg:w-3/5 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {selectedMessage ? (
            <div className="h-full flex flex-col">
              {/* Message Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                      {selectedMessage.sender.type === 'system' ? (
                        <MessageSquare className="w-6 h-6 text-gray-600" />
                      ) : (
                        <User className="w-6 h-6 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <p className="font-semibold text-gray-900">{selectedMessage.sender.name}</p>
                        {selectedMessage.sender.company && (
                          <span className="ml-2 text-sm text-gray-500">
                            at {selectedMessage.sender.company}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {formatTimestamp(selectedMessage.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleStar(selectedMessage.id)}
                      className="p-2 text-gray-400 hover:text-yellow-500 rounded-lg transition-colors"
                      title="Star message"
                    >
                      <Star className={`w-4 h-4 ${selectedMessage.isStarred ? 'text-yellow-500 fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleArchive(selectedMessage.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                      title="Archive message"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(selectedMessage.id)}
                      className="p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                      title="Delete message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedMessage.subject}</h3>
              </div>

              {/* Message Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.content}</p>
                </div>
              </div>

              {/* Reply Section */}
              {selectedMessage.sender.type !== 'system' && (
                <div className="p-6 border-t border-gray-200">
                  <div className="flex items-start space-x-3">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply..."
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={3}
                    />
                    <button
                      onClick={handleSendReply}
                      disabled={!replyText.trim() || isSending}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center"
                    >
                      {isSending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a message</h3>
              <p className="text-gray-500">Choose a message from the list to view its contents</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;