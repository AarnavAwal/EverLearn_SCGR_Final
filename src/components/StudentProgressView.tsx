import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  Flame,
  CheckCircle2,
  Calendar,
  Sparkles,
  Brain,
  Lightbulb,
  AlertTriangle,
  RotateCw,
  BookOpen,
} from 'lucide-react';
import { StudentProgressGraph } from './StudentProgressGraph';
import { StudentAIPerformanceReport } from '../types';

export const StudentProgressView: React.FC = () => {
  const { currentStudent, fetchStudentAISummary, setStudentTab } = useApp();

  const [aiReport, setAiReport] = useState<StudentAIPerformanceReport | null>(
    currentStudent.aiStudentReport || null
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!aiReport) {
      handleFetchSummary();
    }
  }, [currentStudent.id]);

  const handleFetchSummary = async () => {
    setIsLoading(true);
    try {
      const summary = await fetchStudentAISummary(currentStudent.id);
      setAiReport(summary);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const topicList = [
    { name: 'Geometry', mastery: currentStudent.geometryMastery || 92, target: '90%' },
    { name: 'Algebra', mastery: currentStudent.algebraMastery || 84, target: '85%' },
    { name: 'Statistics', mastery: currentStudent.statisticsMastery || 88, target: '80%' },
    { name: 'Fractions', mastery: currentStudent.fractionsMastery || 42, target: '80%' },
  ];

  return (
    <div id="student-progress-view" className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-950/70 border border-indigo-800/60 text-indigo-300 flex items-center justify-center font-bold text-sm">
              📈
            </span>
            <span>AI Progress & Performance Report</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Holistic AI evaluation of mastery trajectories, topic proficiencies, and action plans
          </p>
        </div>

        <button
          id="regenerate-student-summary-btn"
          onClick={handleFetchSummary}
          disabled={isLoading}
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-xs font-semibold text-white shadow-sm flex items-center space-x-1.5 cursor-pointer self-start sm:self-auto"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Generating AI Summary...' : 'Update AI Summary'}</span>
        </button>
      </div>

      {/* 3 Core Metric Highlights */}
      <div className="grid grid-cols-3 gap-3.5">
        <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Overall Mastery</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="my-1">
            <div className="text-2xl font-extrabold text-indigo-400">{currentStudent.progressPct}%</div>
            <div className="text-[11px] text-emerald-400 font-medium">
              {currentStudent.recentImprovement >= 0 ? `+${currentStudent.recentImprovement}% recent change` : `${currentStudent.recentImprovement}%`}
            </div>
          </div>
          <div className="text-[10px] text-slate-500">Benchmark: 80%</div>
        </div>

        <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Practice Streak</span>
            <span className="text-sm">🔥</span>
          </div>
          <div className="my-1">
            <div className="text-2xl font-extrabold text-orange-400">{currentStudent.streakDays} Days</div>
            <div className="text-[11px] text-emerald-400 font-medium">Consistent Learner</div>
          </div>
          <div className="text-[10px] text-slate-500">+5 pts daily streak bonus</div>
        </div>

        <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Skill Points</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="my-1">
            <div className="text-2xl font-extrabold text-amber-400">{currentStudent.points}</div>
            <div className="text-[11px] text-slate-400 font-medium">Completed Drills</div>
          </div>
          <div className="text-[10px] text-slate-500">Earned via correct answers</div>
        </div>
      </div>

      {/* AI Performance Evaluation Dossier */}
      <div
        id="full-ai-student-report"
        className="p-6 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 rounded-2xl border border-indigo-800/60 shadow-xl space-y-4"
      >
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">AI Student Performance Summary Report</h2>
              <p className="text-xs text-slate-400">
                Generated by Gemini model • Updated {aiReport?.generatedAt || 'recently'}
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            {aiReport ? `Mastery: ${aiReport.masteryScore}%` : 'Evaluating...'}
          </span>
        </div>

        {isLoading ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-300">Synthesizing holistic performance report...</p>
          </div>
        ) : aiReport ? (
          <div className="space-y-4 text-xs">
            {/* Executive Summary Quote */}
            <div className="p-4 rounded-xl bg-indigo-900/30 border border-indigo-700/50 text-slate-200 leading-relaxed font-medium">
              <div className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider mb-1">
                AI Diagnostic Summary
              </div>
              <p className="text-sm text-slate-100 leading-relaxed">
                "{aiReport.overallVerdict}"
              </p>
            </div>

            {/* Strengths and Focus 2-Column */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2.5">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Demonstrated Strengths</span>
                </div>
                <ul className="space-y-2 text-slate-300">
                  {aiReport.keyStrengths?.map((str, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-emerald-400 font-bold text-sm leading-none">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2.5">
                <div className="flex items-center space-x-2 text-rose-400 font-bold uppercase tracking-wider text-[11px]">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Struggling Concepts & Remediation Target</span>
                </div>
                <ul className="space-y-2 text-slate-300">
                  {aiReport.focusAreas?.map((area, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-rose-400 font-bold text-sm leading-none">•</span>
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* AI Tailored Action Plan */}
            {aiReport.actionableTips && (
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-2">
                <div className="flex items-center space-x-2 text-amber-300 font-bold uppercase tracking-wider text-[11px]">
                  <Lightbulb className="w-4 h-4" />
                  <span>Recommended Action Plan for Mastery</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  {aiReport.actionableTips.map((tip, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-800/70 border border-slate-700/60 text-slate-300 space-y-1"
                    >
                      <span className="text-[10px] font-bold text-amber-400 uppercase">Step {idx + 1}</span>
                      <p className="text-xs leading-snug">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {aiReport.encouragement && (
              <div className="text-center pt-1 text-xs text-indigo-300 italic font-medium">
                ⭐ {aiReport.encouragement}
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Interactive Growth Graph */}
      <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-sm">
        <StudentProgressGraph />
      </div>

      {/* Topic Competency Breakdown */}
      <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Topic Competency Status
          </h2>
          <button
            onClick={() => setStudentTab('practice')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
          >
            Practice Struggling Topics →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {topicList.map((t) => (
            <div
              key={t.name}
              className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2"
            >
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-200">{t.name}</span>
                <span
                  className={`font-bold ${
                    t.mastery >= 80 ? 'text-emerald-400' : t.mastery >= 60 ? 'text-indigo-400' : 'text-rose-400'
                  }`}
                >
                  {t.mastery}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
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

      {/* Point Activity History Log */}
      <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-sm space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Point History & Activity Log
        </h2>

        <div className="divide-y divide-slate-800">
          {currentStudent.pointHistory.map((item: any) => (
            <div key={item.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-100">{item.reason}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{item.timestamp || item.date || 'Recently'}</div>
              </div>
              <span className="text-xs font-bold text-amber-300 bg-amber-950/70 px-2.5 py-1 rounded-full border border-amber-800/60">
                +{item.points} pts
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
