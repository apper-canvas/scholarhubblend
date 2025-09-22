import React from "react";

const Loading = ({ variant = "default" }) => {
  if (variant === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2 mb-3"></div>
              <div className="h-8 bg-gradient-to-r from-primary/20 to-primary/30 rounded-lg mb-4"></div>
              <div className="flex justify-between items-center">
                <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                <div className="h-6 bg-accent/20 rounded-full w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-2/3 mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-6 bg-accent/20 rounded-full w-16"></div>
                  <div className="h-8 bg-primary/20 rounded w-20"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "dashboard") {
    return (
      <div className="animate-pulse space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="h-6 bg-gradient-to-r from-primary/20 to-primary/30 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-3/4"></div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-6 bg-accent/20 rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
            <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  // Default spinner
  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-slate-200"></div>
        <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    </div>
  );
};

export default Loading;