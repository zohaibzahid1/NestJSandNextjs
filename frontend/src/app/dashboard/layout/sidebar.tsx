export const revalidate = false; // Server Side Generation // no need to revalidate the page
export const dynamic = 'force-static'; // SSG layout
import React from 'react';
import Link from 'next/link';


const Sidebar = () => {
  const navItems = [
    { href: '/dashboard', label: 'Home', icon: '🏠' },
    { href: '/dashboard/panels/users', label: 'Users Panel', icon: '👥' },
    { href: '/dashboard/panels/courses', label: 'Courses Panel', icon: '📚' },
    { href: '/dashboard/panels/enrollments', label: 'Enrollments Panel', icon: '📝' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 z-10">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-700 mb-8">Dashboard</h1>
        
        <nav className="space-y-2">
          {navItems.map((item) => {
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 bg-blue-100 text-blue-700 border-l-4 border-blue-700`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
