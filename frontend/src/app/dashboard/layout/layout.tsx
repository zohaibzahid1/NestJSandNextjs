export const dynamic = 'force-static'; // SSG layout

import React from 'react';
import Sidebar from './sidebar';
import AnnouncementBar from './announcmentbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <>
      <AnnouncementBar />
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          {children}
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;
