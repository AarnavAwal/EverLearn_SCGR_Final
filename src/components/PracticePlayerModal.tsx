import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Target,
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Flame,
  TrendingUp,
  TrendingDown,
  RotateCcw,
  BookOpen,
} from 'lucide-react';

export const PracticePlayerModal: React.FC = () => {
  const {
    activePracticePlayer,
    setActivePracticePlayer,
    completePractice,
    setStudentTab,
    setRole,
  } = useApp();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<{
    before: number;
    after: number;
    improvement: number;
    pointsEarned: number;
    correctCount: number;
    totalCount: number;
    scorePct: number;
  } | null>(null);

  if (!activePracticePlayer) return null;

  const questions = activePracticePlayer.questions;
  const currentQuestion = questions[currentIdx];
  const selectedOption = selectedAnswers[currentIdx];

  const handleSelectOption = (optIdx: number) => {
    if (isSubmitted) return;
    const nextAnswers = [...selectedAnswers];
    nextAnswers[currentIdx] = optIdx;
    setSelectedAnswers(nextAnswers);
  };

  const handleNext = () => {
    setShowHint(false);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Calculate real dynamic score based on student's answers
      let correctCount = 0;
      questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctIndex) {
          correctCount++;
        }
      });
      const scorePct = Math.round((correctCount / questions.length) * 100);
      const res = completePractice(
        activePracticePlayer.id,
        scorePct,
        correctCount,
        questions.length
      );
      setResult(res);
      setIsSubmitted(true);
    }
  };

  const handleClose = () => {
    setActivePracticePlayer(null);
    setCurrentIdx(0);
    setSelectedAnswers([]);
    setIsSubmitted(false);
    setResult(null);
  };

  const handleGoToProgress = () => {
    handleClose();
    setRole('student');
    setStudentTab('progress');
  };

  const handleRetry = () => {
    setCurrentIdx(0);
    setSelectedAnswers([]);
    setIsSubmitted(false);
    setResult(null);
  };

  return (
    <div
      id="practice-player-modal"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <span className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-800/60 text-indigo-400 flex items-center justify-center text-xs font-bold">
              {isSubmitted ? '📊' : `${currentIdx + 1}/${questions.length}`}
            </span>
            <div>
              <div className="text-sm font-bold text-slate-100">
                {isSubmitted ? 'Practice Results' : activePracticePlayer.title}
              </div>
              <div className="text-[11px] text-slate-400">
                {activePracticePlayer.topic} • Targeted Remediation
              </div>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Question Content OR Result Screen */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {!isSubmitted ? (
            <div className="space-y-5">
              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <div className="p-5 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                  Question {currentIdx + 1} of {questions.length}
                </span>
                <h3 className="text-base font-semibold text-slate-100 mt-1.5 leading-relaxed">
                  {currentQuestion.question}
                </h3>
              </div>

              {/* Multiple Choice Options */}
              <div className="space-y-2.5">
                {currentQuestion.options.map((opt, optIdx) => {
                  const isSelected = selectedOption === optIdx;
                  return (
                    <button
                      key={optIdx}
                      id={`practice-option-${optIdx}`}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full p-3.5 rounded-xl text-left border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-950/80 border-indigo-500 text-indigo-200 shadow-sm ring-1 ring-indigo-500/50'
                          : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:border-slate-600 hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="text-sm font-medium text-slate-200">{opt}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                    </button>
                  );
                })}
              </div>

              {/* Hint button & toggle */}
              <div className="pt-2">
                <button
                  id="show-practice-hint-btn"
                  onClick={() => setShowHint(!showHint)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1.5"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showHint ? 'Hide teacher hint' : 'Need a hint?'}</span>
                </button>
                {showHint && (
                  <div className="mt-2.5 p-3.5 bg-amber-950/40 rounded-xl border border-amber-800/60 text-xs text-amber-200 leading-relaxed">
                    💡 <strong className="font-bold text-amber-300">Teacher Hint:</strong> {currentQuestion.hint}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Result Screen with ACCURATE DYNAMIC SCORING */
            <div id="practice-result-card" className="space-y-5 py-1 animate-in fade-in zoom-in-95">
              <div className="text-center space-y-2">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold border ${
                    (result?.scorePct || 0) >= 70
                      ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                      : (result?.scorePct || 0) >= 40
                      ? 'bg-amber-950/60 border-amber-800 text-amber-300'
                      : 'bg-rose-950/60 border-rose-800 text-rose-300'
                  }`}
                >
                  {(result?.scorePct || 0) >= 80 ? '🌟' : (result?.scorePct || 0) >= 50 ? '👍' : '🎯'}
                </div>

                <h3 className="text-xl font-bold text-slate-100">
                  {(result?.scorePct || 0) >= 80
                    ? 'Excellent Work!'
                    : (result?.scorePct || 0) >= 50
                    ? 'Good Effort!'
                    : 'Keep Practicing!'}
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  {(result?.scorePct || 0) >= 80
                    ? `You demonstrated solid command of ${activePracticePlayer.topic}.`
                    : (result?.scorePct || 0) >= 50
                    ? `You're developing understanding in ${activePracticePlayer.topic}. Review the missed concepts below.`
                    : `This topic needs more review. Look at the explanations below to understand where to adjust.`}
                </p>
              </div>

              {/* Accurate Mastery Delta Card */}
              <div
                className={`p-4 rounded-2xl border space-y-3 ${
                  (result?.improvement || 0) > 0
                    ? 'bg-emerald-950/40 border-emerald-800/60'
                    : (result?.improvement || 0) < 0
                    ? 'bg-rose-950/40 border-rose-800/60'
                    : 'bg-slate-800/50 border-slate-700/60'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
                  <span>{activePracticePlayer.topic} Mastery Score</span>
                  <span className="text-slate-200">
                    Accuracy: {result?.correctCount}/{result?.totalCount} ({result?.scorePct}%)
                  </span>
                </div>

                <div className="flex items-center justify-center space-x-6 py-1">
                  <div className="text-center">
                    <div className="text-[11px] text-slate-400 font-medium uppercase">Previous</div>
                    <div className="text-xl font-bold text-slate-400">{result?.before}%</div>
                  </div>

                  <ArrowRight
                    className={`w-5 h-5 ${
                      (result?.improvement || 0) > 0
                        ? 'text-emerald-400'
                        : (result?.improvement || 0) < 0
                        ? 'text-rose-400'
                        : 'text-slate-400'
                    }`}
                  />

                  <div className="text-center">
                    <div className="text-[11px] font-bold uppercase text-slate-300">New Mastery</div>
                    <div
                      className={`text-2xl font-extrabold ${
                        (result?.improvement || 0) > 0
                          ? 'text-emerald-400'
                          : (result?.improvement || 0) < 0
                          ? 'text-rose-400'
                          : 'text-slate-200'
                      }`}
                    >
                      {result?.after}%
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <span
                    className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold ${
                      (result?.improvement || 0) > 0
                        ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50'
                        : (result?.improvement || 0) < 0
                        ? 'bg-rose-900/60 text-rose-300 border border-rose-700/50'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {(result?.improvement || 0) > 0 ? (
                      <TrendingUp className="w-3.5 h-3.5 mr-1" />
                    ) : (result?.improvement || 0) < 0 ? (
                      <TrendingDown className="w-3.5 h-3.5 mr-1" />
                    ) : null}
                    <span>
                      {(result?.improvement || 0) > 0
                        ? `+${result?.improvement}% Improvement`
                        : (result?.improvement || 0) < 0
                        ? `${result?.improvement}% (Needs Reinforcement)`
                        : 'Unchanged Mastery'}
                    </span>
                  </span>
                </div>
              </div>

              {/* Rewards Summary */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-center">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Points Earned</div>
                  <div className="text-lg font-bold text-amber-400 mt-0.5">
                    +{result?.pointsEarned || 0} ⭐
                  </div>
                </div>
                <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-center">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Questions Correct</div>
                  <div className="text-lg font-bold text-slate-100 mt-0.5">
                    {result?.correctCount} / {result?.totalCount}
                  </div>
                </div>
              </div>

              {/* Detailed Question Review Breakdown */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Detailed Answer Review
                </h4>
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {questions.map((q, idx) => {
                    const isCorrect = selectedAnswers[idx] === q.correctIndex;
                    const studentAns = selectedAnswers[idx] !== undefined ? q.options[selectedAnswers[idx]] : 'Unanswered';
                    const correctAns = q.options[q.correctIndex];
                    return (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                          isCorrect
                            ? 'bg-emerald-950/20 border-emerald-800/40'
                            : 'bg-rose-950/20 border-rose-800/40'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-semibold text-slate-200">
                            Q{idx + 1}: {q.question}
                          </span>
                          {isCorrect ? (
                            <span className="inline-flex items-center text-[10px] font-bold text-emerald-400 shrink-0">
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Correct
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-[10px] font-bold text-rose-400 shrink-0">
                              <XCircle className="w-3.5 h-3.5 mr-1" /> Incorrect
                            </span>
                          )}
                        </div>

                        {!isCorrect && (
                          <div className="text-[11px] text-slate-400 space-y-0.5 pt-1">
                            <div>
                              Your answer: <span className="text-rose-300 font-semibold">{studentAns}</span>
                            </div>
                            <div>
                              Correct answer: <span className="text-emerald-300 font-semibold">{correctAns}</span>
                            </div>
                          </div>
                        )}

                        <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/60 leading-relaxed">
                          💡 <strong className="text-slate-300">Explanation:</strong> {q.explanation}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          {!isSubmitted ? (
            <>
              <button
                onClick={handleClose}
                className="text-xs font-semibold text-slate-400 hover:text-slate-200 px-3 py-1.5"
              >
                Quit
              </button>
              <button
                id="submit-practice-question-btn"
                onClick={handleNext}
                disabled={selectedOption === undefined}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl shadow-sm flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <span>{currentIdx < questions.length - 1 ? 'Next Question' : 'Submit Practice'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleRetry}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Drill</span>
              </button>
              <div className="flex items-center space-x-2">
                <button
                  id="practice-complete-view-progress-btn"
                  onClick={handleGoToProgress}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-sm flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>View AI Performance Summary</span>
                </button>
                <button
                  onClick={handleClose}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
