import React from 'react';
import { Button } from '@/ui/button';
import { Link } from 'react-router';
import { Users } from 'lucide-react';

export function HomeNavbar() {
  return (
    <div className="fixed top-0 w-full h-14 px-4 border-b shadow-sm bg-white flex items-center">
      <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-gray-900 hover:opacity-75 transition-opacity">
          <Users className="h-5 w-5 text-indigo-600" />
          <span>LeadFlow</span>
          <span className="text-xs font-normal text-gray-400 ml-1">CRM</span>
        </Link>
        <div className="space-x-4 flex items-center">
          <Button size="sm" className="bg-indigo-600 text-white hover:bg-indigo-700" asChild>
            <Link to="/leads">Get Started Free</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
