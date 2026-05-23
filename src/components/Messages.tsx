import React from 'react';
import { MessageSquare } from 'lucide-react';

const Messages: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
    <MessageSquare className="w-14 h-14 text-gray-300 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-gray-700 mb-2">Messages</h3>
    <p className="text-gray-500">Messaging feature coming soon.</p>
  </div>
);

export default Messages;
