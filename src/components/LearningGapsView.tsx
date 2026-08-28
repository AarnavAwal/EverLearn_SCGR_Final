import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  AlertCircle,
  Users,
  Target,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  FileCheck,
  BrainCircuit,
  Lightbulb,
} from 'lucide-react';

export const LearningGapsView: React.FC = () => {
  const {
    gaps,
    setViewStudentsGapModal,
    setPracticeStudioModal,
    generateTargetedPractice,
    practices,
    setRole,
    setStudentTab,
    setActivePracticePlayer,
  } = useApp();

  const [loadingGapId, setLoadingGapId] = useState<string | null>(null);

  const fractionsGap = gaps.find((g) => g.topic === 'Fractions') || gaps[0];
  const isFractionsResolved = fractionsGap.status === 'resolved' || (fractionsGap.afterMastery && fractionsGap.afterMastery > 70);

  const handleCreatePractice = async (gapId: string) => {
    setLoadingGapId(gapId);
    const targetGap = gaps.find((g) => g.id === gapId) || fractionsGap;
    const practice = await generateTargetedPractice(targetGap.id);
    setLoadingGapId(null);
    setPracticeStudioModal({
      isOpen: true,
      gap: targetGap,
      practice,
    });
  };

  const handleViewStudents = (gap: typeof fractionsGap) => {
    setViewStudentsGapModal(gap);
  };

  const handleTestAsStudent = () => {
    setRole('student');
    setStudentTab('home');
    const fracPractice = practices.find((p) => p.topic === 'Fractions') || practices[0];
    setActivePracticePlayer(fracPractice);
  };

  return (
    <div id="learning-gaps-view" className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-rose-950/70 border border-rose-800/60 text-rose-300 flex items-center justify-center font-bold text-sm">
              ⚠️
            </span>
            <span>Learning Gaps & Remediation</span>
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Diagnostic misconceptions detected from recent quiz analysis
          </p>
        </div>
      </div>

      {/* Main Focus Card: FRACTIONS */}
      <div
        id="main-gap-focus-fractions"
        className={`p-6 rounded-2xl border transition-all ${
          isFractionsResolved
            ? 'bg-slate-900/90 border-emerald-800/80 shadow-sm'
            : 'bg-slate-900/80 border-slate-800 shadow-sm'
        }`}
      >
        {/* Top bar with Topic Name, Mastery Badge, and Struggle Count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg ${
                isFractionsResolved ? 'bg-emerald-950/80 border border-emerald-800/60 text-emerald-300' : 'bg-rose-950/80 border border-rose-800/60 text-rose-300'
              }`}
            >
              ➗
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-slate-100 tracking-tight">Fractions: Adding Unlike Terms</h2>
                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium border border-slate-700">
                  Class 9A
                </span>
                {isFractionsResolved && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Resolved (+39% Improvement)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Unit 3 diagnostic assessment gap</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-[11px] font-medium text-slate-400 uppercase">Mastery</div>
              <div
                className={`text-2xl font-bold ${
                  isFractionsResolved ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {isFractionsResolved ? `${fractionsGap.afterMastery || 81}%` : '42%'}
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-right">
              <div className="text-[11px] font-medium text-slate-400 uppercase">Impact</div>
              <div className="text-sm font-bold text-slate-200 flex items-center justify-end space-x-1">
                <Users className="w-4 h-4 text-slate-400" />
                <span>{isFractionsResolved ? '0 struggling' : '12 struggling'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Gap Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5">
          {/* COMMON GAP */}
          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-750 text-xs space-y-1">
            <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">COMMON GAP</div>
            <div className="text-sm font-semibold text-slate-200">Adding unlike fractions</div>
            <div className="text-slate-400">Confusion between numerator addition and denominator matching.</div>
          </div>

          {/* AI DETECTION */}
          <div className="p-4 bg-indigo-950/40 rounded-xl border border-indigo-800/50 text-xs space-y-1">
            <div className="font-bold text-indigo-400 uppercase tracking-wider text-[10px] flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI INSIGHT</span>
            </div>
            <div className="text-indigo-200 font-medium leading-relaxed">
              "Many students are adding numerators and denominators directly (e.g. 1/2 + 1/3 = 2/5)."
            </div>
          </div>

          {/* RECOMMENDED ACTION */}
          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-750 text-xs space-y-1">
            <div className="font-bold text-emerald-400 uppercase tracking-wider text-[10px] flex items-center space-x-1">
              <Lightbulb className="w-3.5 h-3.5 text-emerald-400" />
              <span>RECOMMENDED ACTION</span>
            </div>
            <div className="text-slate-300 font-medium leading-relaxed">
              Review common denominators and LCM equivalence with 5 targeted practice questions.
            </div>
          </div>
        </div>

        {/* Before vs After Impact State */}
        {isFractionsResolved && (
          <div className="p-4 mb-4 bg-emerald-950/40 rounded-xl border border-emerald-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-4">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">BEFORE</div>
                <div className="text-lg font-bold text-slate-500 line-through">42%</div>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-[10px] text-emerald-400 uppercase font-bold">AFTER</div>
                <div className="text-2xl font-bold text-emerald-300">81%</div>
              </div>
              <div className="px-3 py-1 bg-emerald-900/60 border border-emerald-700/60 text-emerald-300 rounded-full text-xs font-bold">
                +39% improvement 🎉
              </div>
            </div>
            <span className="text-xs text-emerald-300/80 font-medium">
              Completed by Section A students
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            id="create-practice-fractions-btn"
            onClick={() => handleCreatePractice(fractionsGap.id)}
            disabled={loadingGapId === fractionsGap.id}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors flex items-center space-x-2"
          >
            <Target className="w-4 h-4" />
            <span>{loadingGapId === fractionsGap.id ? 'Generating Practice...' : 'Create Targeted Practice'}</span>
          </button>

          <button
            id="view-students-fractions-btn"
            onClick={() => handleViewStudents(fractionsGap)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-750 text-slate-200 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-2"
          >
            <Users className="w-4 h-4 text-slate-400" />
            <span>View 12 Students</span>
          </button>

          {!isFractionsResolved && (
            <button
              id="quick-demo-test-practice-btn"
              onClick={handleTestAsStudent}
              className="px-4 py-2 bg-slate-800/80 hover:bg-slate-800 text-indigo-300 border border-indigo-800/50 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-1.5 ml-auto"
            >
              <span>Test Practice as Student (Aarav)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Secondary Learning Gaps (Algebra & Statistics) */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Other Active Gaps</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gaps
            .filter((g) => g.id !== 'gap-fractions')
            .map((gap) => (
              <div
                key={gap.id}
                className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <h4 className="font-bold text-slate-100 text-base">{gap.topic}</h4>
                  </div>
                  <span className="text-sm font-extrabold text-amber-400">{gap.mastery}% 🟡</span>
                </div>

                <div className="text-xs text-slate-400">
                  <strong className="text-slate-300">Gap:</strong> {gap.commonGapTitle} ({gap.strugglingCount} students)
                </div>

                <div className="p-2.5 bg-slate-800/50 rounded-xl text-[11px] text-slate-300 border border-slate-750">
                  <span className="font-semibold text-slate-200">AI Note:</span> {gap.aiDetection}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => handleCreatePractice(gap.id)}
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors text-center"
                  >
                    Create Practice
                  </button>
                  <button
                    onClick={() => handleViewStudents(gap)}
                    className="py-2 px-3 bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold transition-colors"
                  >
                    View Students
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
