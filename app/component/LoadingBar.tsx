import React from 'react';

interface LoadingBarProps {
  title?: string;
  duration?: number; // in seconds
  fullScreen?: boolean;
}

const LoadingBar: React.FC<LoadingBarProps> = ({
  title = "Loading...",
  duration = 4,
  fullScreen = true
}) => {
  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md">
          <div className="text-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-500 h-4 rounded-full"
              style={{
                animation: `loading ${duration}s ease-in-out`,
              }}
            ></div>
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">Please wait...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="text-center mb-2">
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
      </div>
      <div className="w-full max-w-xs bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full"
          style={{
            animation: `loading ${duration}s ease-in-out`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default LoadingBar;
