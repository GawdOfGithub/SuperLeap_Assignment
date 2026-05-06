import React from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { Users, LayoutList, Columns3 } from 'lucide-react';

export function CrmNavbar() {
  const { pathname }    = useLocation();
  const [searchParams]  = useSearchParams();

  const qs     = searchParams.toString();
  const suffix = qs ? `?${qs}` : '';

  const isLeads = pathname === '/leads/list';
  const isBoard = pathname === '/leads/board';
  const showViewToggle = isLeads || isBoard;

  return (
    <nav className="fixed top-0 w-full h-14 border-b shadow-sm bg-white z-50 flex items-center px-6 gap-6">
      <Link to="/" className="flex items-center gap-2 font-bold text-gray-900 hover:opacity-75 transition-opacity shrink-0">
        <Users className="h-5 w-5 text-indigo-600" />
        <span>LeadFlow</span>
        <span className="text-xs font-normal text-gray-400 ml-0.5">CRM</span>
      </Link>

      <div className="flex items-center gap-1">
        <Link
          to={`/leads/list${suffix}`}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            isLeads || isBoard ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Leads
        </Link>
      </div>

      {showViewToggle && (
        <div className="flex items-center bg-gray-100 rounded-lg p-0.5 ml-auto">
          <Link
            to={`/leads/list${suffix}`}
            title="List view"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              isLeads
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <LayoutList className="h-4 w-4" />
            List
          </Link>
          <Link
            to={`/leads/board${suffix}`}
            title="Board view"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              isBoard
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Columns3 className="h-4 w-4" />
            Board
          </Link>
        </div>
      )}
    </nav>
  );
}
