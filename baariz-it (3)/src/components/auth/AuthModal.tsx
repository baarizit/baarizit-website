import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Shield,
  ArrowRight,
  KeyRound,
  RotateCcw,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  calculatePasswordStrength,
  validateBdPhone,
  validateEmail,
} from '../../services/authService';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    registerCustomer,
    loginCustomer,
    resetCustomerPassword,
    setActivePage,
    addToast,
  } = useStore();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');

  // Form states
  const [fullName, setFullName] = useState('');
  const [identifier, setIdentifier] = useState(''); // Email or Phone for login / forgot
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const passwordStrength = calculatePasswordStrength(password);
  const phoneValidation = validateBdPhone(phone);
  const emailValidation = validateEmail(email);

  const resetForm = () => {
    setErrorMsg('');
    setPassword('');
    setConfirmPassword('');
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!acceptTerms) {
      setErrorMsg('You must agree to the Terms & Conditions to create an account.');
      return;
    }

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full legal name.');
      return;
    }

    if (!emailValidation.isValid) {
      setErrorMsg(emailValidation.error || 'Please enter a valid email address.');
      return;
    }

    if (!phoneValidation.isValid) {
      setErrorMsg(phoneValidation.error || 'Please enter a valid 11-digit Bangladeshi mobile number.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must contain at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Password and Confirm Password do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await registerCustomer({
        fullName,
        email,
        phone,
        password,
      });

      if (!res.success) {
        setErrorMsg(res.message);
      } else {
        setActivePage('customer-dashboard');
      }
    } catch {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier.trim()) {
      setErrorMsg('Please enter your registered Email or Mobile Number.');
      return;
    }

    if (!password) {
      setErrorMsg('Please enter your account password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await loginCustomer(identifier, password, rememberMe);
      if (!res.success) {
        setErrorMsg(res.message);
      } else {
        setActivePage('customer-dashboard');
      }
    } catch {
      setErrorMsg('Login failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier.trim()) {
      setErrorMsg('Enter your registered Email or Mobile Number to reset password.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('New password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('New passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await resetCustomerPassword(identifier, password);
      if (!res.success) {
        setErrorMsg(res.message);
      } else {
        setMode('login');
        resetForm();
      }
    } catch {
      setErrorMsg('Failed to reset password. Please contact support.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8"
        >
          {/* Close button */}
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-zinc-950 rounded-xl border border-zinc-800/80 mb-6">
            <button
              onClick={() => {
                setMode('login');
                resetForm();
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                mode === 'login'
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('register');
                resetForm();
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                mode === 'register'
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          {/* Header */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-amber-500/20 text-amber-400">
                {mode === 'register' ? (
                  <Sparkles className="w-4 h-4" />
                ) : (
                  <UserCheck className="w-4 h-4" />
                )}
              </div>
              <h3 className="text-xl font-bold text-zinc-100 font-tech">
                {mode === 'register'
                  ? 'Create Customer Account'
                  : mode === 'forgot'
                  ? 'Reset Account Password'
                  : 'Customer Account Login'}
              </h3>
            </div>
            <p className="text-xs text-zinc-400">
              {mode === 'register'
                ? 'Create a secure customer account with your mobile number or email.'
                : mode === 'forgot'
                ? 'Enter your mobile or email to set a new password.'
                : 'Sign in using your Email or Bangladeshi Mobile Number.'}
            </p>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-300"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {/* Registration Form */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Full Name <span className="text-amber-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Tanvir Ahmed"
                    className="w-full bg-zinc-950 text-xs text-zinc-100 rounded-xl pl-9 pr-3 py-2.5 border border-zinc-800 focus:border-amber-500 focus:outline-none"
                  />
                  <User className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Mobile Number (BD) <span className="text-amber-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01622615188 or 017XXXXXXXX"
                    className={`w-full bg-zinc-950 text-xs text-zinc-100 rounded-xl pl-9 pr-3 py-2.5 border focus:outline-none ${
                      phone && !phoneValidation.isValid
                        ? 'border-red-500/60 focus:border-red-500'
                        : phone && phoneValidation.isValid
                        ? 'border-emerald-500/60 focus:border-emerald-500'
                        : 'border-zinc-800 focus:border-amber-500'
                    }`}
                  />
                  <Phone className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                </div>
                {phone && !phoneValidation.isValid && (
                  <p className="text-[11px] text-red-400 mt-1">{phoneValidation.error}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Email Address <span className="text-amber-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="customer@example.com"
                    className={`w-full bg-zinc-950 text-xs text-zinc-100 rounded-xl pl-9 pr-3 py-2.5 border focus:outline-none ${
                      email && !emailValidation.isValid
                        ? 'border-red-500/60 focus:border-red-500'
                        : email && emailValidation.isValid
                        ? 'border-emerald-500/60 focus:border-emerald-500'
                        : 'border-zinc-800 focus:border-amber-500'
                    }`}
                  />
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Password <span className="text-amber-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full bg-zinc-950 text-xs text-zinc-100 rounded-xl pl-9 pr-9 py-2.5 border border-zinc-800 focus:border-amber-500 focus:outline-none"
                  />
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength meter */}
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-400">Strength:</span>
                      <span
                        className={`font-semibold ${
                          passwordStrength.score <= 1
                            ? 'text-red-400'
                            : passwordStrength.score === 2
                            ? 'text-amber-400'
                            : passwordStrength.score === 3
                            ? 'text-blue-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Confirm Password <span className="text-amber-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type password"
                    className={`w-full bg-zinc-950 text-xs text-zinc-100 rounded-xl pl-9 pr-3 py-2.5 border focus:outline-none ${
                      confirmPassword && confirmPassword !== password
                        ? 'border-red-500/60 focus:border-red-500'
                        : confirmPassword && confirmPassword === password
                        ? 'border-emerald-500/60 focus:border-emerald-500'
                        : 'border-zinc-800 focus:border-amber-500'
                    }`}
                  />
                  <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 rounded border-zinc-700 text-amber-500 focus:ring-amber-500"
                />
                <span className="text-[11px] text-zinc-400 leading-snug">
                  I agree to BAARIZ IT's Terms of Service, Warranty Policies, and Privacy Guidelines.
                </span>
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-lg shadow-amber-500/10 transition-all cursor-pointer disabled:opacity-50"
              >
                <span>{isLoading ? 'Creating Account...' : 'Register & Log In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Login Form */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Email or Mobile Number <span className="text-amber-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. 01622615188 or user@gmail.com"
                    className="w-full bg-zinc-950 text-xs text-zinc-100 rounded-xl pl-9 pr-3 py-2.5 border border-zinc-800 focus:border-amber-500 focus:outline-none"
                  />
                  <User className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-zinc-300">
                    Password <span className="text-amber-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      resetForm();
                    }}
                    className="text-[11px] text-amber-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-zinc-950 text-xs text-zinc-100 rounded-xl pl-9 pr-9 py-2.5 border border-zinc-800 focus:border-amber-500 focus:outline-none"
                  />
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-400">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-zinc-700 text-amber-500 focus:ring-amber-500"
                  />
                  <span>Remember Me</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-lg shadow-amber-500/10 transition-all cursor-pointer disabled:opacity-50"
              >
                <span>{isLoading ? 'Signing In...' : 'Log In to Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center space-y-2">
                <p className="text-xs text-zinc-400">
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      resetForm();
                    }}
                    className="text-amber-400 font-semibold hover:underline"
                  >
                    Create one now
                  </button>
                </p>
                <div className="pt-2 border-t border-zinc-800/80">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAuthModalOpen(false);
                      setActivePage('admin-login');
                    }}
                    className="text-[11px] text-zinc-500 hover:text-cyan-400 transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Lock className="w-3 h-3" />
                    <span>Store Administration Login →</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Forgot Password Flow */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Registered Email or Mobile Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. 01622615188 or user@gmail.com"
                    className="w-full bg-zinc-950 text-xs text-zinc-100 rounded-xl pl-9 pr-3 py-2.5 border border-zinc-800 focus:border-amber-500 focus:outline-none"
                  />
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full bg-zinc-950 text-xs text-zinc-100 rounded-xl pl-9 pr-3 py-2.5 border border-zinc-800 focus:border-amber-500 focus:outline-none"
                  />
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type new password"
                    className="w-full bg-zinc-950 text-xs text-zinc-100 rounded-xl pl-9 pr-3 py-2.5 border border-zinc-800 focus:border-amber-500 focus:outline-none"
                  />
                  <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    resetForm();
                  }}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
