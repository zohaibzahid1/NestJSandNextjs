import React from 'react';
import DashboardLayout from './layout/layout';

const DashboardPage = () => {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Dashboard</h1>
          <p className="text-gray-600">Manage your users and courses from here</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Users Card */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">👥</span>
              <h3 className="text-xl font-semibold text-gray-900">Users</h3>
            </div>
            <p className="text-gray-600 mb-4">Manage user accounts and profiles</p>
            <a 
              href="/dashboard/panels/users" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              View Users →
            </a>
          </div>

          {/* Courses Card */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">📚</span>
              <h3 className="text-xl font-semibold text-gray-900">Courses</h3>
            </div>
            <p className="text-gray-600 mb-4">Manage course offerings and content</p>
            <a 
              href="/dashboard/panels/courses" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              View Courses →
            </a>
          </div>

          {/* Enrollments Card */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">📝</span>
              <h3 className="text-xl font-semibold text-gray-900">Enrollments</h3>
            </div>
            <p className="text-gray-600 mb-4">Manage student enrollments and grades</p>
            <a 
              href="/dashboard/panels/enrollments" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              View Enrollments →
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage; 