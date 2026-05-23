import React from 'react';
import { Calendar } from 'lucide-react';

const Schedule: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
    <Calendar className="w-14 h-14 text-gray-300 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-gray-700 mb-2">Interview Schedule</h3>
    <p className="text-gray-500">Interview scheduling feature coming soon.</p>
  </div>
);

export default Schedule;
