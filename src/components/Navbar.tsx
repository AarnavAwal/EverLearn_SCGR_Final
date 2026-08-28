import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  UserCheck,
  Sparkles,
  RotateCcw,
  Compass,
  ChevronDown,
  ArrowRight,
  X,
  CheckCircle2,
  User,
  LogIn,
  UserPlus,
  LogOut,
  Shield,
  Settings,
  Mail,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    role,
    setRole,
    selectedClassId,
    setSelectedClassId,
    selectedSectionId,
    setSelectedSectionId,
    classes,
    currentClass,
    currentStudent,
    currentUser,
    userAccounts,
    loginAsAccount,
    setIsAuthModalOpen,
    setAuthModalMode,
    setIsUserProfileModalOpen,
    logout,
    resetDemoData,
    setTeacherTab,
    setStudentTab,
    setViewStudentsGapModal,
    setPracticeStudioModal,
    generateTargetedPractice,
    gaps,
    setActivePracticePlayer,
    practices,
  } = useApp();

  const [showDemoGuide, setShowDemoGuide] = useState(true);
  const [demoStep, setDemoStep] = useState(1);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDemoStep = async (step: number) => {
    setDemoStep(step);
    if (step === 1) {
      setRole('teacher');
      setTeacherTab('dashboard');
    } else if (step === 2) {
      setRole('teacher');
      setTeacherTab('gaps');
    } else if (step === 3) {
      setRole('teacher');
      const fracGap = gaps.find((g) => g.topic === 'Fractions') || gaps[0];
      setViewStudentsGapModal(fracGap);
    } else if (step === 4) {
      setRole('teacher');
      setViewStudentsGapModal(null);
      const fracGap = gaps.find((g) => g.topic === 'Fractions') || gaps[0];
      const practice = await generateTargetedPractice(fracGap.id);
      setPracticeStudioModal({ isOpen: true, gap: fracGap, practice });
    } else if (step === 5) {
      setPracticeStudioModal({ isOpen: false, gap: null, practice: null });
      setRole('student');
      setStudentTab('home');
      const fracPractice = practices.find((p) => p.topic === 'Fractions') || practices[0];
      setActivePracticePlayer(fracPractice);
    } else if (step === 6) {
      setRole('student');
      setStudentTab('progress');
    }
  };

  return (
    <header id="main-header" className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 shadow-sm">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xl shadow-md ring-1 ring-indigo-500/30 group-hover:scale-105 transition-transform">
              E
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xl text-slate-100 tracking-tight group-hover:text-indigo-300 transition-colors">Everlearn</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium border border-slate-700">
                  Greenwood High
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Learning analytics & growth platform</p>
            </div>
          </div>

          {/* Center Class & Section Switcher */}
          <div className="flex items-center space-x-2 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700 text-xs shadow-xs">
            <span className="text-slate-400 font-medium hidden sm:inline">Class:</span>
            <select
              id="class-selector"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="bg-transparent font-bold text-slate-100 focus:outline-none cursor-pointer"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900 text-slate-200">
                  {c.name}
                </option>
              ))}
            </select>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400 font-medium hidden sm:inline">Section:</span>
            <select
              id="section-selector"
              value={selectedSectionId}
              onChange={(e) => setSelectedSectionId(e.target.value)}
              className="bg-transparent font-bold text-indigo-300 focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-slate-200">
                All Sections ({currentClass.totalStudents})
              </option>
              {currentClass.sections.map((s) => (
                <option key={s.id} value={s.id} className="bg-slate-900 text-slate-200">
                  {s.name} ({s.studentCount})
                </option>
              ))}
            </select>
          </div>

          {/* Right Controls & Role Switcher */}
          <div className="flex items-center space-x-3">
            {/* Quick Demo Walkthrough Toggle */}
            <button
              id="demo-tour-toggle-btn"
              onClick={() => setShowDemoGuide(!showDemoGuide)}
              className="hidden xl:inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-amber-950/40 text-amber-300 border border-amber-800/50 text-xs font-semibold hover:bg-amber-900/40 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Demo Flow</span>
            </button>

            {/* Role Switcher Pill */}
            <div className="flex items-center p-0.5 bg-slate-800/90 rounded-xl border border-slate-700">
              <button
                id="role-teacher-btn"
                onClick={() => {
                  setRole('teacher');
                  setTeacherTab('dashboard');
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  role === 'teacher'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Teacher</span>
              </button>
              <button
                id="role-student-btn"
                onClick={() => {
                  setRole('student');
                  setStudentTab('home');
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  role === 'student'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>Student</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </button>
            </div>

            {/* User Account Menu Pill */}
            <div className="relative" ref={menuRef}>
              <button
                id="user-account-menu-btn"
                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                className="flex items-center space-x-2 pl-2 pr-2.5 py-1 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-full bg-slate-750 border border-slate-650 flex items-center justify-center text-base shrink-0">
                  {currentUser ? currentUser.avatar : role === 'teacher' ? '👩‍🏫' : '👦'}
                </div>
                <div className="hidden sm:block text-left max-w-[120px]">
                  <div className="text-xs font-bold text-slate-200 leading-tight truncate">
                    {currentUser ? currentUser.name : role === 'teacher' ? 'Mrs. Sharma' : currentStudent.name}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {currentUser ? currentUser.email.split('@')[0] : 'Profile'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Account Dropdown Popover */}
              {isAccountMenuOpen && (
                <div
                  id="user-account-dropdown"
                  className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                >
                  {/* Active Profile Info */}
                  <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-750 mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-xl">
                        {currentUser?.avatar || '👦'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-100 truncate">
                          {currentUser?.name || 'Aarav Sharma'}
                        </div>
                        <div className="text-[11px] text-indigo-300 font-mono truncate">
                          {currentUser?.email || 'aarav.sharma@greenwood.edu'}
                        </div>
                        <span className="inline-block text-[10px] uppercase font-bold text-slate-400 mt-0.5">
                          {currentUser?.role === 'teacher' ? 'Teacher' : `${currentUser?.sectionName || 'Section A'} Student`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs font-medium">
                    <button
                      id="menu-view-profile-btn"
                      onClick={() => {
                        setIsAccountMenuOpen(false);
                        setIsUserProfileModalOpen(true);
                      }}
                      className="w-full px-3 py-2 text-left rounded-lg text-slate-200 hover:bg-slate-800 flex items-center space-x-2 transition-colors"
                    >
                      <User className="w-4 h-4 text-indigo-400" />
                      <span>View & Edit Profile</span>
                    </button>

                    <button
                      id="menu-create-profile-btn"
                      onClick={() => {
                        setIsAccountMenuOpen(false);
                        setAuthModalMode('signup');
                        setIsAuthModalOpen(true);
                      }}
                      className="w-full px-3 py-2 text-left rounded-lg text-slate-200 hover:bg-slate-800 flex items-center space-x-2 transition-colors"
                    >
                      <UserPlus className="w-4 h-4 text-emerald-400" />
                      <span>Create New Profile</span>
                    </button>

                    <button
                      id="menu-sign-in-btn"
                      onClick={() => {
                        setIsAccountMenuOpen(false);
                        setAuthModalMode('login');
                        setIsAuthModalOpen(true);
                      }}
                      className="w-full px-3 py-2 text-left rounded-lg text-slate-200 hover:bg-slate-800 flex items-center space-x-2 transition-colors"
                    >
                      <LogIn className="w-4 h-4 text-amber-400" />
                      <span>Sign In with Email</span>
                    </button>
                  </div>

                  {/* Switch Account Quick List */}
                  <div className="pt-2 mt-2 border-t border-slate-800">
                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Switch Profiles:
                    </div>
                    <div className="space-y-1 mt-1">
                      {userAccounts.map((acc) => (
                        <button
                          key={acc.id}
                          onClick={() => {
                            loginAsAccount(acc);
                            setIsAccountMenuOpen(false);
                          }}
                          className={`w-full px-3 py-1.5 text-left rounded-lg flex items-center justify-between text-xs transition-colors ${
                            currentUser?.id === acc.id
                              ? 'bg-indigo-950/70 text-indigo-300 font-bold'
                              : 'text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center space-x-2 truncate">
                            <span>{acc.avatar}</span>
                            <span className="truncate">{acc.name}</span>
                          </div>
                          {currentUser?.id === acc.id && (
                            <span className="text-[10px] text-indigo-400 font-bold">Active</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Log Out */}
                  <div className="pt-2 mt-2 border-t border-slate-800">
                    <button
                      id="menu-logout-btn"
                      onClick={() => {
                        setIsAccountMenuOpen(false);
                        logout();
                      }}
                      className="w-full px-3 py-2 text-left rounded-lg text-rose-400 hover:bg-rose-950/40 flex items-center space-x-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Reset Demo State Button */}
            <button
              id="reset-demo-btn"
              title="Reset Demo Data"
              onClick={resetDemoData}
              className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Guided Hackathon Demo Bar */}
      {showDemoGuide && (
        <div id="demo-guide-banner" className="bg-slate-950 text-white px-4 py-2 border-t border-slate-800 text-xs">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30 text-[10px]">
                DEMO FLOW
              </span>
              <span className="text-slate-400 font-medium hidden md:inline">
                Click steps to test the full problem → AI solution → measurable improvement cycle:
              </span>
            </div>

            <div className="flex items-center space-x-1.5 overflow-x-auto py-0.5">
              {[
                { s: 1, label: '1. Dashboard (42%)' },
                { s: 2, label: '2. Learning Gaps' },
                { s: 3, label: '3. View Students' },
                { s: 4, label: '4. Create Practice' },
                { s: 5, label: '5. Student Takes Practice' },
                { s: 6, label: '6. AI Summary & Mastery' },
              ].map((step) => (
                <button
                  key={step.s}
                  onClick={() => handleDemoStep(step.s)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    demoStep === step.s
                      ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
                      : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {step.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowDemoGuide(false)}
              className="text-slate-400 hover:text-white p-1"
              title="Close guide"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

