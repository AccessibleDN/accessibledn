'use client';

import { BiErrorCircle } from 'react-icons/bi';
import { IoRefreshOutline } from 'react-icons/io5';

interface ErrorProps {
  title?: string;
  message?: string;
  retry?: () => void;
}

export default function Error({ 
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again later.",
  retry
}: ErrorProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-red-100/10 flex items-center justify-center">
              <BiErrorCircle className="w-12 h-12 text-red-400" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Error Content */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-100">
            {title}
          </h3>
          <p className="text-gray-400">
            {message}
          </p>
        </div>

        {/* Retry Button */}
        {retry && (
          <button
            onClick={retry}
            className="inline-flex items-center px-4 py-2 border border-transparent 
                     rounded-md shadow-sm text-sm font-medium text-white 
                     bg-primary hover:bg-primary/90 focus:outline-none 
                     focus:ring-2 focus:ring-offset-2 focus:ring-primary 
                     transition-colors duration-200"
          >
            <IoRefreshOutline className="w-4 h-4 mr-2" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

