// Sidebar.tsx
"use client";

import { Menu } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 h-screen fixed left-0 top-0">
      <div className="p-4">
        <h1 className="text-white text-xl font-bold">RED PRODUCT</h1>
      </div>
      <nav className="mt-8">
        <div className="px-4 py-3 text-gray-300 hover:bg-gray-700">
          <a href="/dashboard" className="flex items-center gap-3">
            <Menu size={20} />
            Dashboard
          </a>
          <a href="/hotel" className="flex items-center gap-3">
            <Menu size={20} />
            Liste des hotels
          </a>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
