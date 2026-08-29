"use client";

import React from "react";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">403</h1>
        <p className="text-lg text-gray-600 mb-6">You don't have permission to access this resource.</p>
        <a href="/" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default Unauthorized;