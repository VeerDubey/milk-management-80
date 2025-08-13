import React from 'react';

const TestComponent = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-8">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-white mb-4">VMC Pro</h1>
        <p className="text-white/80 mb-6">Milk Center Management System</p>
        <div className="space-y-2 text-white/60">
          <p>✅ System Loaded Successfully</p>
          <p>✅ React Components Working</p>
          <p>✅ Tailwind CSS Active</p>
        </div>
      </div>
    </div>
  );
};

export default TestComponent;