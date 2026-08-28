import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Mail,
  Lock,
  User,
  School,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Shield,
  GraduationCap,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { Role } from '../types';

const AVATAR_OPTIONS = ['👦', '👧', '👨‍🎓', '👩‍🎓', '🧑‍💻', '🚀', '🌟', '🦁', '🐯', '👩‍🏫', '👨‍🏫', '🦊'];

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    loginWithEmail,
    loginAsAccount,
    createProfile,
    userAccounts,
    classes,
  } = useApp();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup / Profile Creation state
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState<Role>('student');
  const [signupClassId, setSignupClassId] = useState<string>('c9');
  const [signupSectionId, setSignupSectionId] = useState<string>('sec-9a');
  const [signupAvatar, setSignupAvatar] = useState<string>('👦');
  const [signupBio, setSignupBio] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!loginEmail.trim()) {
      setErrorMessage('Please enter your email address');
      return;
    }
    const success = loginWithEmail(loginEmail.trim(), loginPassword);
    if (success) {
      setIsAuthModalOpen(false);
      setLoginEmail('');
      setLoginPassword('');
    } else {
      setErrorMessage('Account not found with this email. You can create a new profile below in 1 click!');
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!fullName.trim()) {
      setErrorMessage('Please enter your name');
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address (e.g. user@gmail.com)');
      return;
    }

    try {
      createProfile({
        name: fullName.trim(),
        email: signupEmail.trim(),
        role: signupRole,
        classId: signupClassId,
        sectionId: signupSectionId,
        avatar: signupAvatar,
        bio: signupBio.trim() || `${signupRole === 'teacher' ? 'Faculty Member' : 'Student'} at Greenwood High`,
      });
      setIsAuthModalOpen(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create profile');
    }
  };

  const selectedSignupClass = classes.find((c) => c.id === signupClassId) || classes[0];

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        id="auth-modal-container"
        className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-600/30">
              E
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">
                {authModalMode === 'login' ? 'Log In to Everlearn' : 'Create Your Profile'}
              </h2>
              <p className="text-xs text-slate-400">
                {authModalMode === 'login'
                  ? 'Sign in with your email or select a demo account'
                  : 'Set up your student or teacher account'}
              </p>
            </div>
          </div>
          <button
            id="close-auth-modal-btn"
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 p-1">
          <button
            id="auth-tab-login"
            onClick={() => {
              setAuthModalMode('login');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              authModalMode === 'login'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            id="auth-tab-signup"
            onClick={() => {
              setAuthModalMode('signup');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              authModalMode === 'signup'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create New Profile</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-center space-x-2">
              <span className="shrink-0 font-bold">⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {authModalMode === 'login' ? (
            <div className="space-y-5">
              {/* Quick Demo Accounts */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Quick One-Click Sign In:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {userAccounts.map((acc) => (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => {
                        loginAsAccount(acc);
                        setIsAuthModalOpen(false);
                      }}
                      className="p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-750 hover:border-indigo-500/60 rounded-xl text-left transition-all flex items-center space-x-3 group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-slate-700/80 flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform">
                        {acc.avatar}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-200 truncate group-hover:text-indigo-300">
                          {acc.name}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {acc.role === 'teacher' ? 'Teacher' : `${acc.sectionName} Student`}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-slate-500">
                  Or Log In with Email
                </span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>

              {/* Email Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="login-email-input"
                      type="email"
                      required
                      placeholder="e.g. your.email@gmail.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Password (Optional for Demo)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="login-password-input"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-medium"
                    />
                  </div>
                </div>

                <button
                  id="submit-email-login-btn"
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Log In with Email</span>
                </button>
              </form>

              <div className="pt-2 text-center">
                <p className="text-xs text-slate-400">
                  New to EduPulse?{' '}
                  <button
                    onClick={() => {
                      setAuthModalMode('signup');
                      setErrorMessage(null);
                    }}
                    className="text-indigo-400 font-bold hover:underline"
                  >
                    Create a new profile
                  </button>
                </p>
              </div>
            </div>
          ) : (
            /* Signup / Create Profile Form */
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSignupRole('student');
                      setSignupAvatar('👦');
                    }}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                      signupRole === 'student'
                        ? 'bg-indigo-950/70 border-indigo-500 text-indigo-200 ring-1 ring-indigo-500'
                        : 'bg-slate-800/60 border-slate-750 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Student Profile</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSignupRole('teacher');
                      setSignupAvatar('👩‍🏫');
                    }}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                      signupRole === 'teacher'
                        ? 'bg-indigo-950/70 border-indigo-500 text-indigo-200 ring-1 ring-indigo-500'
                        : 'bg-slate-800/60 border-slate-750 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    <span>Teacher Profile</span>
                  </button>
                </div>
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Choose Avatar Emoji
                </label>
                <div className="flex flex-wrap gap-2 p-2 bg-slate-950/50 rounded-xl border border-slate-800">
                  {AVATAR_OPTIONS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setSignupAvatar(av)}
                      className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all ${
                        signupAvatar === av
                          ? 'bg-indigo-600 scale-110 shadow-md ring-2 ring-indigo-400'
                          : 'bg-slate-800 hover:bg-slate-700'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="signup-name-input"
                    type="text"
                    required
                    placeholder={signupRole === 'teacher' ? 'e.g. Mr. Rajesh Varma' : 'e.g. Kabir Singh'}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="signup-email-input"
                    type="email"
                    required
                    placeholder="e.g. blueskygaming420@gmail.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>
              </div>

              {/* Class & Section Selection */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Class / Grade
                  </label>
                  <select
                    id="signup-class-select"
                    value={signupClassId}
                    onChange={(e) => {
                      const newClassId = e.target.value;
                      setSignupClassId(newClassId);
                      const targetClass = classes.find((c) => c.id === newClassId);
                      if (targetClass && targetClass.sections.length > 0) {
                        setSignupSectionId(targetClass.sections[0].id);
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-medium text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Section
                  </label>
                  <select
                    id="signup-section-select"
                    value={signupSectionId}
                    onChange={(e) => setSignupSectionId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-medium text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    {selectedSignupClass.sections.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Bio / Description */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Bio / Interests (Optional)
                </label>
                <input
                  id="signup-bio-input"
                  type="text"
                  placeholder="e.g. Passionate about Mathematics & Science"
                  value={signupBio}
                  onChange={(e) => setSignupBio(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <button
                id="submit-create-profile-btn"
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center space-x-1.5 cursor-pointer mt-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Create Profile & Log In</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
