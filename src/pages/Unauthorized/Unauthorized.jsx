import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

export default function Unauthorized() {
  const [countdown, setCountdown] = useState(10); // Starting countdown at 10 seconds
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (countdown === 0) {
      setRedirecting(true);
    } else {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  if (redirecting) {
    window.location.href = '/'; // Redirects to homepage
    return null; // Prevents rendering the rest of the component while redirecting
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 text-center py-12 px-6">
      <div className="mb-6">
        <Star size={48} color="#FF6347" />
      </div>
      <h1 className="text-4xl font-extrabold text-red-600 mb-4">
        Unauthorized Access
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        You don't have permission to view this page. You will be redirected to the homepage in{' '}
        <span className="font-semibold text-red-500">{countdown} seconds</span>.
      </p>
      
      <div className="inline-grid grid-cols-2 gap-4 mb-6">
        <div className="status status-error animate-ping w-16 h-16 rounded-full bg-red-500"></div>
        <div className="status status-error w-16 h-16 rounded-full bg-red-500"></div>
      </div>

      <Link
        to="/"
        className="bg-blue-600 text-white py-2 px-6 rounded-full text-lg font-medium hover:bg-blue-500"
      >
        Go Back to Homepage
      </Link>
    </div>
  );
}
