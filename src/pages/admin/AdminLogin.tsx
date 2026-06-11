import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Lock, Mail, AlertTriangle, ArrowLeft } from 'lucide-react';
import { auth } from '../../firebase/config';
import { useAuthStore } from '../../store/authStore';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // If already logged in, redirect directly to admin panel dashboard
  useEffect(() => {
    if (user && user.email === 'vineshjm@gmail.com') {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both administrative email and password credentials.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      // Double check that the user logging in corresponds to the verified admin email
      if (userCredential.user.email !== 'vineshjm@gmail.com') {
        setErrorMsg('Unauthorized access attempts. Only vineshjm@gmail.com is permitted.');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      console.error('Authentication gate error:', err);
      if (
        err.code === 'auth/configuration-not-found' ||
        err.message?.includes('CONFIGURATION_NOT_FOUND')
      ) {
        setErrorMsg(
          'Firebase Authentication is not enabled for this project yet. Open the Firebase Console → Authentication → Get started → enable Email/Password, then run "npm run seed" locally to create the admin account.'
        );
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setErrorMsg('Invalid credentials entered. Use vineshjm@gmail.com and the password set via npm run seed.');
      } else if (err.code === 'auth/too-many-requests') {
        setErrorMsg('Too many failed attempts. Please wait a few minutes and try again.');
      } else {
        setErrorMsg(err.message || 'Access gate failed. Verify credentials.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div 
      id="admin-login-view"
      className="min-h-screen bg-[#1C1008] flex flex-col justify-center items-center p-4 sm:p-6 relative font-sans text-xs sm:text-sm"
    >
      {/* Background graphic frame */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#B8860B_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Return Home Option */}
      <div className="absolute top-6 left-6 z-10">
        <button 
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-[#FDF8F2]/75 hover:text-[#B8860B] transition-colors text-xs font-bold tracking-widest uppercase cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> &larr; Return to Store
        </button>
      </div>

      <div className="max-w-md w-full bg-[#FDF8F2] border-2 border-[#B8860B] rounded-lg p-6 sm:p-8 shadow-2xl relative z-10">
        
        {/* Card Header Brand Logo */}
        <div className="text-center mb-8 flex flex-col gap-1.5">
          <span className="font-serif text-3xl font-bold tracking-[0.1em] text-[#1C1008] uppercase">
            KALARANG
          </span>
          <span className="font-sans text-[10px] tracking-[0.2em] text-[#B8860B] uppercase font-bold">
            Studio Controller Gate
          </span>
          <div className="h-0.5 w-12 bg-[#B8860B] mx-auto mt-2" />
        </div>

        {/* Error Notification Block */}
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-700 p-3.5 my-4 rounded flex flex-col gap-2 text-xs">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
            {errorMsg.includes('Firebase Authentication is not enabled') && (
              <a
                href="https://console.firebase.google.com/project/kalarang-48b04/authentication/providers"
                target="_blank"
                rel="noreferrer"
                className="ml-6 text-maroon font-bold underline hover:text-gold"
              >
                Open Firebase Authentication Setup →
              </a>
            )}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
          
          {/* Email parameter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#1C1008] uppercase tracking-wider flex items-center gap-1">
              <Mail className="h-3.5 w-3.5 text-[#B8860B]" /> Email Address
            </label>
            <input
              type="email"
              required
              placeholder="e.g. vineshjm@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#FDF8F2] border border-[#B8860B]/25 rounded px-3.5 py-2.5 text-sm text-[#1C1008] focus:border-[#7A1C2E] focus:outline-none"
            />
          </div>

          {/* Password parameter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#1C1008] uppercase tracking-wider flex items-center gap-1">
              <Lock className="h-3.5 w-3.5 text-[#B8860B]" /> Password Code
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

          {/* Submitting Trigger Action */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#7A1C2E] hover:bg-[#1C1008] text-white py-3.5 rounded text-xs tracking-wider uppercase font-extrabold flex items-center justify-center gap-2 mt-2 transition-colors cursor-pointer shadow hover:shadow-lg"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                Validating Entry Key...
              </>
            ) : (
              'Enter Admin Dashboard'
            )}
          </button>

          <span className="text-[10px] text-center text-gray-500 italic mt-3 block">
            Authorized administrative users only. Contact supervisor for access.
          </span>

        </form>

      </div>
    </div>
  );
}
