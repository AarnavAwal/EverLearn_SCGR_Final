import React from 'react';
import { useApp } from '../context/AppContext';
import { TeacherTab, StudentTab } from '../types';
import {
  LayoutDashboard,
  School,
  Users,
  FileCheck2,
  AlertCircle,
  Home,
  BookOpen,
  Target,
  LineChart,
  Flame,
  Sparkles,
} from 'lucide-react';

interface TeacherNavItem {
  id: TeacherTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface StudentNavItem {
  id: StudentTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const Sidebar: React.FC = () => {
  const {
    role,
    teacherTab,
    setTeacherTab,
    studentTab,
    setStudentTab,
    currentStudent,
    currentUser,
    setIsUserProfileModalOpen,
    gaps,
  } = useApp();

  const activeGapsCount = gaps.filter((g) => g.status === 'active').length;

  if (role === 'teacher') {
    const teacherNavItems: TeacherNavItem[] = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'classes', label: 'Classes', icon: School },
      { id: 'students', label: 'Students', icon: Users },
      { id: 'assessments', label: 'Assessments', icon: FileCheck2 },
      {
        id: 'gaps',
        label: 'Learning Gaps',
        icon: AlertCircle,
        badge: activeGapsCount > 0 ? `${activeGapsCount}` : undefined,
      },
    ];

    return (
      <aside id="teacher-sidebar" className="w-full md:w-64 shrink-0 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
        <div className="space-y-2">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Teacher Portal
          </div>
          <nav className="space-y-1">
            {teacherNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = teacherTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`teacher-nav-${item.id}`}
                  onClick={() => setTeacherTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        isActive ? 'bg-white text-indigo-700' : 'bg-rose-950/70 border border-rose-800/60 text-rose-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Profile / Class Quick Status Widget */}
        <div className="mt-8 pt-4 border-t border-slate-800">
          <button
            onClick={() => setIsUserProfileModalOpen(true)}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 transition-colors text-left cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-indigo-950/70 border border-indigo-800/60 flex items-center justify-center text-indigo-300 text-sm shrink-0">
              {currentUser?.avatar || '👩‍🏫'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-200 truncate">{currentUser?.name || 'Mrs. Anita Sharma'}</p>
              <p className="text-[11px] text-slate-400 truncate">{currentUser?.email || 'teacher@greenwood.edu'}</p>
            </div>
          </button>
        </div>
      </aside>
    );
  }

  // Student Navigation
  const studentNavItems: StudentNavItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'practice', label: 'Practice & AI Drill', icon: Target },
    { id: 'assessments', label: 'Quizzes', icon: BookOpen },
    { id: 'progress', label: 'AI Progress & Summary', icon: LineChart },
  ];

  return (
    <aside id="student-sidebar" className="w-full md:w-64 shrink-0 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
      <div className="space-y-2">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Student Portal
        </div>
        <nav className="space-y-1">
          {studentNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = studentTab === item.id;
            return (
              <button
                key={item.id}
                id={`student-nav-${item.id}`}
                onClick={() => setStudentTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Student Profile & Mini Stats */}
      <div className="mt-8 pt-4 border-t border-slate-800 space-y-3">
        <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Mastery</span>
              <span className="text-xs font-extrabold text-emerald-400">{currentStudent.progressPct}%</span>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Streak</span>
              <span className="text-xs font-extrabold text-orange-400">{currentStudent.streakDays}d 🔥</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/60">
            <span className="text-slate-400">Total Points</span>
            <span className="font-bold text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> {currentStudent.points} pts
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsUserProfileModalOpen(true)}
          className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/60 transition-colors text-left cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-indigo-950/70 border border-indigo-800/60 text-indigo-300 flex items-center justify-center font-bold text-base shrink-0">
            {currentUser?.avatar || currentStudent.avatar || '👦'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-200 truncate">{currentUser?.name || currentStudent.name}</p>
            <p className="text-[11px] text-slate-400 truncate">{currentUser?.email || 'Student Account'}</p>
          </div>
        </button>
      </div>
    </aside>
  );
};
