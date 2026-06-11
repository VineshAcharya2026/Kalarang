import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAdminUser } from '../../auth';
import { useAuthStore } from '../../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div
        id="admin-protection-loader"
        className="min-h-screen bg-[#FDF8F2] flex flex-col items-center justify-center font-sans text-sm text-gray-500"
      >
        <div className="w-10 h-10 border-4 border-[#B8860B] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-serif italic text-base text-[#1C1008]">Verifying admin session...</p>
      </div>
    );
  }

  if (!isAdminUser(user)) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
