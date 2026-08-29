"use client";

import React from "react";

type BreadcrumbProps = {
  items: { name: string; href?: string }[];
};

export const Breadcrumbs: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav aria-label="breadcrumb" className="mb-4">
      <ol className="flex flex-col sm:flex-row text-sm text-gray-600">
        {items.map((item, index) => (
          <li key={index} className="mr-2">
            {index === items.length - 1 ? (
              <span>{item.name}</span>
            ) : (
              <a href={item.href ?? "#"}>
                {item.name}
                <span className="ml-1 text-gray-400 hover:text-gray-500">&#x2F;</span>
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;