import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowRight,
  Zap,
  BookOpen,
  Sparkles,
  Target,
  Brain,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  RotateCw,
  TrendingUp,
} from 'lucide-react';
import { StudentProgressGraph } from './StudentProgressGraph';
import { StudentAIPerformanceReport } from '../types';

export const StudentDashboard: React.FC = () => {
  const {
    currentStudent,
    practices,
    setActivePracticePlayer,
    setStudentTab,
    assessments,
    setActiveQuizPlayer,
    fetchStudentAISummary,
  } = useApp();

  const [aiReport, setAiReport] = useState<StudentAIPerformanceReport | null>(
    currentStudent.aiStudentReport || null
  );
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  useEffect(() => {
    if (!aiReport) {
      loadAISummary();
    }
  }, [currentStudent.id]);

  const loadAISummary = async () => {
    setIsLoadingSummary(true);
    try {
      const summary = await fetchStudentAISummary(currentStudent.id);
      setAiReport(summary);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const fractionsPractice = practices.find((p) => p.topic === 'Fractions') || practices[0];
  const algebraPractice = practices.find((p) => p.topic === 'Algebra') || practices[1] || practices[0];
  const hasCompletedFractions = currentStudent.completedPracticeIds.includes(fractionsPractice?.id || '') || currentStudent.fractionsMastery > 70;

  const handleStartPractice = () => {
    if (fractionsPractice) {
      setActivePracticePlayer(fractionsPractice);
    }
  };

  const handleStartAlgebraPractice = () => {
    if (algebraPractice) {
      setActivePracticePlayer(algebraPractice);
    }
  };

  const handleStartQuiz = () => {
    if (assessments.length > 0) {
      setActiveQuizPlayer(assessments[0]);
    }
  };

  const topicList = [
    { name: 'Geometry', mastery: currentStudent.geometryMastery || 92, status: 'Mastered', color: 'text-emerald-400' },
    { name: 'Algebra', mastery: currentStudent.algebraMastery || 84, status: 'Strong', color: 'text-indigo-400' },
    { name: 'Statistics', mastery: currentStudent.statisticsMastery || 88, status: 'Strong', color: 'text-cyan-400' },
    { 
      name: 'Fractions', 
      mastery: currentStudent.fractionsMastery || 42, 
      status: (currentStudent.fractionsMastery || 42) >= 75 ? 'Mastered' : 'Needs Practice', 
      color: (currentStudent.fractionsMastery || 42) >= 75 ? 'text-emerald-400' : 'text-rose-400' 
    },
  ];

  return (
    <div id="student-dashboard-view" className="space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <span>Welcome back, {currentStudent.name.replace(' (You)', '')}</span>
            <span>👋</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {currentStudent.className || 'Class 9'} • {currentStudent.sectionName || 'Section A'} • Greenwood High
          </p>
        </div>
        <button
          id="student-view-progress-btn"
          onClick={() => setStudentTab('progress')}
          className="px-3.5 py-1.5 rounded-lg bg-indigo-950/70 border border-indigo-800/60 text-xs font-semibold text-indigo-300 hover:bg-indigo-900/60 transition-colors flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Detailed AI Analytics</span>
        </button>
      </div>

      {/* 3 Clean Key Metrics */}
      <div className="grid grid-cols-3 gap-3.5">
        <div
          id="student-mastery-card"
          onClick={() => setStudentTab('progress')}
          className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-sm hover:border-emerald-500/40 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Overall Mastery</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-100 mt-1">{currentStudent.progressPct}%</div>
          <p className="text-[11px] text-emerald-400 font-medium mt-0.5">
            {currentStudent.recentImprovement >= 0 ? `+${currentStudent.recentImprovement}% this week` : `${currentStudent.recentImprovement}%`}
          </p>
        </div>

        <div
          id="student-streak-card"
          className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Learning Streak</span>
            <span className="text-base">🔥</span>
          </div>
          <div className="text-2xl font-extrabold text-orange-400 mt-1">{currentStudent.streakDays} Days</div>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">Daily practice active</p>
        </div>

        <div
          id="student-points-card"
          onClick={() => setStudentTab('progress')}
          className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-sm hover:border-indigo-500/40 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Points</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-100 mt-1">{currentStudent.points}</div>
          <p className="text-[11px] text-indigo-300 font-medium mt-0.5">⭐ Skill Points</p>
        </div>
      </div>

      {/* AI Performance Summary Card */}
      <div
        id="ai-student-performance-summary"
        className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-800/60 shadow-lg space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-slate-100">AI Student Performance Summary</h3>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-400/30">
                  Gemini Flash AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Personalized pedagogical summary of your strengths and learning focus
              </p>
            </div>
          </div>

          <button
            id="refresh-ai-summary-btn"
            onClick={loadAISummary}
            disabled={isLoadingSummary}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh AI Analysis"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoadingSummary ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isLoadingSummary ? 'Analyzing...' : 'Refresh'}</span>
          </button>
        </div>

        {isLoadingSummary ? (
          <div className="p-6 text-center space-y-2">
            <div className="w-7 h-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Gemini AI is reviewing your recent submissions and mastery data...</p>
          </div>
        ) : aiReport ? (
          <div className="space-y-3.5 pt-1 text-xs">
            {/* Overall Verdict */}
            <div className="p-3 rounded-xl bg-indigo-900/30 border border-indigo-700/40 text-slate-200 leading-relaxed font-medium">
              ✨ <strong className="text-indigo-300">{aiReport.greeting || 'Hello!'}</strong> {aiReport.overallVerdict}
            </div>

            {/* Strengths & Focus Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Strengths */}
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                <div className="flex items-center space-x-1.5 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Key Strengths</span>
                </div>
                <ul className="space-y-1.5 text-slate-300">
                  {aiReport.keyStrengths?.map((str, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Focus Areas */}
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                <div className="flex items-center space-x-1.5 text-rose-400 font-bold text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Topics Needing Practice</span>
                </div>
                <ul className="space-y-1.5 text-slate-300">
                  {aiReport.focusAreas?.map((f, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-rose-400 font-bold">•</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actionable Tips */}
            {aiReport.actionableTips && aiReport.actionableTips.length > 0 && (
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-amber-300 font-bold uppercase tracking-wider text-[11px]">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>AI Study Tips For You</span>
                </div>
                <ul className="space-y-1 text-slate-300">
                  {aiReport.actionableTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-amber-400 font-bold">→</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Encouragement footer */}
            {aiReport.encouragement && (
              <p className="text-[11px] text-indigo-300/90 italic text-center pt-0.5">
                "{aiReport.encouragement}"
              </p>
            )}
          </div>
        ) : null}
      </div>

      {/* Main Focus: Assigned Drill / Action Banner */}
      {!hasCompletedFractions ? (
        <div
          id="assigned-practice-card"
          className="p-5 rounded-2xl bg-indigo-950/60 border border-indigo-800/60 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-bold border border-indigo-400/30">
              <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
              <span>Recommended Practice</span>
            </div>
            <h3 className="text-base font-bold text-slate-100">Targeted Practice: Adding Fractions</h3>
            <p className="text-xs text-slate-300">
              Complete 5 quick questions to master common denominators and earn skill points.
            </p>
          </div>
          <button
            id="start-assigned-practice-btn"
            onClick={handleStartPractice}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition-colors flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
          >
            <span>Start Practice (5 min)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          id="completed-practice-banner"
          className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-900/60 text-emerald-300 flex items-center justify-center font-bold text-base">
              🎉
            </div>
            <div>
              <div className="font-bold text-emerald-200 text-sm">
                Fractions Practice Completed!
              </div>
              <div className="text-xs text-emerald-300/80">
                Fractions mastery is now {currentStudent.fractionsMastery}%. Keep it up!
              </div>
            </div>
          </div>
          <button
            id="start-algebra-practice-btn"
            onClick={handleStartAlgebraPractice}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors shrink-0 flex items-center space-x-1.5 cursor-pointer"
          >
            <span>Try Algebra Practice</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Progress & Upcoming Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Weekly Growth Chart */}
        <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-sm">
          <StudentProgressGraph />
        </div>

        {/* Topics Summary & Next Quiz */}
        <div className="space-y-4 flex flex-col justify-between">
          {/* Topics Mastery Overview */}
          <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Topic Competencies</span>
              <button
                onClick={() => setStudentTab('practice')}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                + AI Drill
              </button>
            </div>
            <div className="space-y-2.5">
              {topicList.map((t) => (
                <div key={t.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-300">{t.name}</span>
                    <span className={`font-bold ${t.color}`}>{t.mastery}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        t.mastery >= 80 ? 'bg-emerald-500' : t.mastery >= 60 ? 'bg-indigo-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${t.mastery}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Quiz Card */}
          <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-sm flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center text-indigo-400 shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-200">Unit 3: Mid-Term Math Check</div>
                <div className="text-[11px] text-slate-400">15 Questions • Available Now</div>
              </div>
            </div>
            <button
              id="take-active-quiz-btn"
              onClick={handleStartQuiz}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer"
            >
              Take Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
