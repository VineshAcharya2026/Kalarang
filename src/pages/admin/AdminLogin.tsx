import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, AlertTriangle, ArrowLeft } from 'lucide-react';
import { ADMIN_EMAIL, isAdminUser, loginAdmin, getAuthErrorMessage } from '../../auth';
import { useAuthStore } from '../../store/authStore';

export default function AdminLogin() {
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { user, loading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAdminUser(user)) {
      navigate('/admin/dashboard');
    }
  }, [user, loading, navigate]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      await loginAdmin(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Authentication error:', err);
      setErrorMsg(getAuthErrorMessage(err, 'Access denied. Verify your credentials.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      id="admin-login-view"
      className="min-h-screen bg-[#1C1008] flex flex-col justify-center items-center p-4 sm:p-6 relative font-sans text-xs sm:text-sm"
    >
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#B8860B_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-[#FDF8F2]/75 hover:text-[#B8860B] transition-colors text-xs font-bold tracking-widest uppercase cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> &larr; Return to Store
        </button>
      </div>

      <div className="max-w-md w-full bg-[#FDF8F2] border-2 border-[#B8860B] rounded-lg p-6 sm:p-8 shadow-2xl relative z-10">
        <div className="text-center mb-8 flex flex-col gap-1.5">
          <span className="font-serif text-3xl font-bold tracking-[0.1em] text-[#1C1008] uppercase">
            KALARANG
          </span>
          <span className="font-sans text-[10px] tracking-[0.2em] text-[#B8860B] uppercase font-bold">
            Studio Controller Gate
          </span>
          <div className="h-0.5 w-12 bg-[#B8860B] mx-auto mt-2" />
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-700 p-3.5 my-4 rounded flex flex-col gap-2 text-xs">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#1C1008] uppercase tracking-wider flex items-center gap-1">
              <Mail className="h-3.5 w-3.5 text-[#B8860B]" /> Email Address
            </label>
            <input
              type="email"
              required
              placeholder={ADMIN_EMAIL}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#FDF8F2] border border-[#B8860B]/25 rounded px-3.5 py-2.5 text-sm text-[#1C1008] focus:border-[#7A1C2E] focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#1C1008] uppercase tracking-wider flex items-center gap-1">
              <Lock className="h-3.5 w-3.5 text-[#B8860B]" /> Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#FDF8F2] border border-[#B8860B]/25 rounded px-3.5 py-2.5 text-sm text-[#1C1008] focus:border-[#7A1C2E] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || loading}
            className="w-full bg-[#7A1C2E] hover:bg-[#1C1008] text-white py-3.5 rounded text-xs tracking-wider uppercase font-extrabold flex items-center justify-center gap-2 mt-2 transition-colors cursor-pointer shadow hover:shadow-lg disabled:opacity-60"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                Signing in...
              </>
            ) : (
              'Enter Admin Dashboard'
            )}
          </button>

          <span className="text-[10px] text-center text-gray-500 italic mt-3 block">
            Sign in with {ADMIN_EMAIL} or vineshjm@gmail.com
          </span>
        </form>
      </div>
    </div>
  );
}
