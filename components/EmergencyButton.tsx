
import React from 'react';

const EmergencyButton: React.FC = () => {
  return (
    <a
      href="tel:1402"
      className="fixed bottom-6 right-6 bg-red-600 text-white px-5 py-4 rounded-full shadow-lg hover:bg-red-700 transition-transform hover:scale-105 z-50 flex items-center space-x-3"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="font-bold">Emergencia 1402</span>
    </a>
  );
};

export default EmergencyButton;
