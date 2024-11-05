import React from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and main navigation */}
          <div className="flex items-center gap-8">
            <Link to="/" className="font-semibold text-xl">
              Research Automation
            </Link>
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm"
              >
                Dashboard
              </Link>
              <Link
                to="/projects/create"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm"
              >
                New Project
              </Link>
            </div>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="search"
                placeholder="Search projects..."
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;