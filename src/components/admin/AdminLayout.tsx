import React from 'react';
import { Outlet } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout() {
  return (
    <ProtectedRoute>
      <div id="admin-admin-layout" className="flex flex-col md:flex-row min-h-screen bg-[#FDF8F2]">
        
        {/* Sidebar section */}
        <div className="md:h-screen md:sticky md:top-0">
          <AdminSidebar />
        </div>

        {/* Workspace section panel */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto w-full md:max-w-none">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>

      </div>
    </ProtectedRoute>
  );
}
