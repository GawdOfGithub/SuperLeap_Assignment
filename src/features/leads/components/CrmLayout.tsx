import React from 'react';
import { Outlet } from 'react-router';
import { CrmNavbar } from './CrmNavbar';

export function CrmLayout() {
  return (
    <div className="min-h-full bg-gray-50">
      <CrmNavbar />
      <main className="pt-14">
        <Outlet />
      </main>
    </div>
  );
}
