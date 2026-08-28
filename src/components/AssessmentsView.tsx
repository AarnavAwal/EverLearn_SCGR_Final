import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileCheck2,
  Plus,
  BookOpen,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { CreateQuizModal } from './CreateQuizModal';

export const AssessmentsView: React.FC = () => {
  const { assessments, role, setActiveQuizPlayer, setIsCreateQuizModalOpen } = useApp();

  return (
    <div id="assessments-view" className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-950/70 border border-indigo-800/60 text-indigo-300 flex items-center justify-center font-bold text-sm">
              📝
            </span>
            <span>Assessments & Quizzes</span>
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Diagnostic checks, mid-terms, and topic mastery evaluations
          </p>
        </div>

        {role === 'teacher' && (
          <button
            id="create-new-quiz-btn"
            onClick={() => setIsCreateQuizModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Quiz</span>
          </button>
        )}
      </div>

      {/* Assessments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assessments.map((assessment) => {
          const hasCompleted = assessment.completedByStudentIds.includes('s1');

          return (
            <div
              key={assessment.id}
              id={`assessment-card-${assessment.id}`}
              className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      assessment.status === 'active'
                        ? 'bg-amber-950/70 text-amber-300 border border-amber-800/60'
                        : 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60'
                    }`}
                  >
                    {assessment.status}
                  </span>
                  <span className="text-xs text-slate-400 font-medium flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Due: {assessment.dueDate}
                  </span>
                </div>

                <h3 className="font-bold text-slate-100 text-base">{assessment.title}</h3>
                <p className="text-xs text-slate-400">
                  Topic: <strong className="text-slate-200 font-medium">{assessment.topic}</strong> • {assessment.totalQuestions} Questions
                </p>
              </div>

              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-750 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Class Avg Score</span>
                  <span className="font-bold text-slate-100 text-sm">{assessment.avgScore}%</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Submissions</span>
                  <span className="font-bold text-indigo-400">{assessment.completedByStudentIds.length} Students</span>
                </div>
              </div>

              {/* Action Button */}
              {role === 'student' ? (
                <button
                  id={`take-quiz-action-${assessment.id}`}
                  onClick={() => setActiveQuizPlayer(assessment)}
                  className={`w-full py-2.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 ${
                    hasCompleted
                      ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/60'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  {hasCompleted ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Completed (Retake Quiz)</span>
                    </>
                  ) : (
                    <>
                      <span>Take Quiz</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => setActiveQuizPlayer(assessment)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 rounded-lg text-xs font-semibold transition-colors text-center"
                >
                  Preview Questions ({assessment.questions.length})
                </button>
              )}
            </div>
          );
        })}
      </div>

      <CreateQuizModal />
    </div>
  );
};
