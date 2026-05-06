import React from 'react';
import { Outlet } from 'react-router';
import { HomeNavbar } from './HomeNavbar';
import { HomeFooter } from './HomeFooter';

export default function HomeLayout() {
  return (
    <div className="h-full bg-slate-100">
      <HomeNavbar />
      <main className="pt-40 pb-20 bg-slate-100"><Outlet /></main>
      <HomeFooter />
    </div>
  );
}
