import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Search,
  Filter,
  Flame,
  Award,
  ChevronRight,
  TrendingUp,
  Target,
  AlertCircle,
  ClipboardCheck,
  Shield,
} from 'lucide-react';

export const StudentsView: React.FC = () => {
  const { students, setSelectedStudentModal, assessments } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [sectionFilter, setSectionFilter] = useState<'all' | 'sec-9a' | 'sec-9b'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'needs_support' | 'mastered'>('all');

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSection = sectionFilter === 'all' || student.sectionId === sectionFilter;
    let matchesStatus = true;
    if (statusFilter === 'needs_support') {
      matchesStatus = student.progressPct < 75 || student.fractionsMastery < 60;
    } else if (statusFilter === 'mastered') {
      matchesStatus = student.progressPct >= 85;
    }
    return matchesSearch && matchesSection && matchesStatus;
  });

  return (
    <div id="students-directory-view" className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-950/70 border border-indigo-800/60 text-indigo-300 flex items-center justify-center font-bold text-sm">
              👥
            </span>
            <span>Students Directory & Diagnostic Dossiers</span>
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Class 9 • {students.length} Total Enrolled Students • Click any student to review diagnostic deficiencies and assessment counts
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="student-search-input"
            type="text"
            placeholder="Search student name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder-slate-400 focus:outline-indigo-500 font-medium"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            id="student-section-filter"
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 focus:outline-indigo-500 cursor-pointer"
          >
            <option value="all">All Sections</option>
            <option value="sec-9a">Section A</option>
            <option value="sec-9b">Section B</option>
          </select>

          <select
            id="student-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 focus:outline-indigo-500 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="needs_support">Needs Support (&lt;75%)</option>
            <option value="mastered">High Mastery (≥85%)</option>
          </select>
        </div>
      </div>

      {/* Students List */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 shadow-sm overflow-hidden divide-y divide-slate-800">
        <div className="p-3.5 bg-slate-850 text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between border-b border-slate-800">
          <span>Student & Gaps Identified</span>
          <div className="flex items-center space-x-8 pr-4">
            <span className="hidden md:inline">Assessments Done</span>
            <span className="hidden sm:inline">Streak</span>
            <span>Mastery</span>
            <span>Points</span>
          </div>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No students found matching your filter criteria.
          </div>
        ) : (
          filteredStudents.map((student) => {
            const isYou = student.id === 's1';
            const completedAssessments =
              student.assessmentSubmissions?.length ||
              assessments.filter((a) => a.completedByStudentIds.includes(student.id)).length;
            const defCount = student.deficiencies?.length || (student.fractionsMastery < 70 ? 2 : 0);

            return (
              <div
                key={student.id}
                id={`student-list-item-${student.id}`}
                onClick={() => setSelectedStudentModal(student)}
                className={`p-3.5 flex items-center justify-between hover:bg-slate-800/60 transition-colors cursor-pointer ${
                  isYou ? 'bg-amber-950/20 border-l-4 border-l-amber-500' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-base border border-slate-700 shrink-0">
                    {student.avatar}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-slate-100">{student.name}</span>
                      {isYou && (
                        <span className="text-[10px] bg-amber-900/60 text-amber-300 font-bold px-1.5 py-0.5 rounded-md border border-amber-700/60">
                          YOU
                        </span>
                      )}
                      {defCount > 0 && (
                        <span className="text-[10px] bg-rose-950/80 text-rose-300 font-bold px-1.5 py-0.5 rounded-md border border-rose-800/70 flex items-center space-x-0.5">
                          <AlertCircle className="w-2.5 h-2.5" />
                          <span>{defCount} {defCount === 1 ? 'Gap' : 'Gaps'}</span>
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center space-x-2 mt-0.5">
                      <span>{student.sectionName}</span>
                      <span>•</span>
                      <span>Rank #{student.rankInClass}</span>
                      {student.weakTopics.length > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-rose-400 font-medium truncate max-w-xs">
                            Lacks: {student.weakTopics.join(', ')}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6 pr-2">
                  <div className="hidden md:flex items-center space-x-1.5 text-xs text-slate-300 bg-slate-800/60 px-2.5 py-1 rounded-lg border border-slate-750">
                    <ClipboardCheck className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{completedAssessments}/{assessments.length} Done</span>
                  </div>

                  <div className="hidden sm:flex items-center text-xs font-semibold text-orange-400">
                    <Flame className="w-3.5 h-3.5 mr-1 fill-orange-500" />
                    <span>{student.streakDays}d</span>
                  </div>

                  <div className="w-16 text-right">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        student.progressPct >= 85
                          ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60'
                          : student.progressPct >= 70
                          ? 'bg-indigo-950/70 text-indigo-300 border border-indigo-800/60'
                          : 'bg-rose-950/70 text-rose-300 border border-rose-800/60'
                      }`}
                    >
                      {student.progressPct}%
                    </span>
                  </div>

                  <div className="text-right w-14">
                    <span className="text-sm font-bold text-slate-100">{student.points}</span>
                    <span className="text-[10px] text-slate-500 block">pts</span>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
