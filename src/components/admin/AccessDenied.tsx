import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldAlert, ArrowLeft, User, Lock, Home } from 'lucide-react';
import { motion } from 'motion/react';

export const AccessDenied: React.FC<{ serverError?: string }> = ({ serverError }) => {
  const { currentUser, setActivePage, logoutUser } = useStore();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-slate-100 relative overflow-hidden">
      {/* Red ambient warning flare */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-slate-900/90 backdrop-blur-xl border border-red-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-red-950/40 relative z-10"
      >
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold uppercase tracking-wider">
          403 Forbidden
        </span>

        <h1 className="text-2xl sm:text-3xl font-bold font-tech text-white mt-3">
          Access Denied
        </h1>

        <p className="text-slate-400 text-sm mt-3 leading-relaxed">
          {serverError ||
            'You do not have permission to access the BAARIZ IT Admin Management Console. This portal is strictly restricted to authorized store administration.'}
        </p>

        {currentUser && (
          <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 flex items-center justify-center gap-2">
            <User className="w-4 h-4 text-amber-400" />
            <span>
              Signed in as <strong className="text-slate-200">{currentUser.fullName}</strong> (Role: <strong className="text-amber-400 uppercase">{currentUser.role}</strong>)
            </span>
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => setActivePage('home')}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            <Home className="w-4 h-4" />
            <span>Return to Store Homepage</span>
          </button>

          {currentUser?.role === 'customer' && (
            <button
              onClick={() => setActivePage('customer-dashboard')}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-slate-700"
            >
              <User className="w-4 h-4 text-amber-400" />
              <span>Customer Account</span>
            </button>
          )}

          <button
            onClick={() => {
              logoutUser();
              setActivePage('admin-login');
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-white font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-slate-800"
          >
            <Lock className="w-4 h-4" />
            <span>Admin Sign In</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
