"use client";

import React from "react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p className="text-lg text-gray-600">
          Welcome to the AI Asset Intelligence dashboard.
        </p>
        <div className="mt-6 flex justify-center space-x-4">
          <Link to="/inventory" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80">
            Asset Inventory
          </Link>
          <Link to="/reconciliation" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80">
            Reconciliation
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;