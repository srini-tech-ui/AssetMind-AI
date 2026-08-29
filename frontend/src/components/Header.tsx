"use client";

import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/lib/auth";

export const Header: React.FC = () => {
  const { user } = useAuthStore.getState();

  // Placeholder user data
  const placeholderUser = {
    name: "John Doe",
    avatar: "/images/avatar.jpg",
    roles: ["user"],
  };

  const currentUser = user || placeholderUser;

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-xl font-semibold text-gray-800 dark:text-gray-100">AI Asset Intelligence</span>
          </div>
          <div className="hidden sm:ml-6 flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              {currentUser.roles?.map((role, index) => (
                <span key={index} className={`px-2 py-0.5 text-xs font-semibold bg-primary/10 text-primary rounded-full`}>
                  {role}
                </span>
              ))}
            </div>
            <Avatar className="w-8 h-8 rounded-full">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;