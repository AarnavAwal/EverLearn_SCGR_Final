import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Trophy,
} from 'lucide-react';

export const QuizPlayerModal: React.FC = () => {
  const { activeQuizPlayer, setActiveQuizPlayer, completeQuiz, setStudentTab } = useApp();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  if (!activeQuizPlayer) return null;

  const questions = activeQuizPlayer.questions;
  const currentQuestion = questions[currentIdx];
  const selectedOption = selectedAnswers[currentIdx];

  const handleSelectOption = (optIdx: number) => {
    if (isSubmitted) return;
    const next = [...selectedAnswers];
    next[currentIdx] = optIdx;
    setSelectedAnswers(next);
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      let correct = 0;
      questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctIndex) {
          correct++;
        }
      });
      const scorePct = Math.round((correct / questions.length) * 100);
      setFinalScore(scorePct);
      completeQuiz(activeQuizPlayer.id, scorePct);
      setIsSubmitted(true);
    }
  };

  const handleClose = () => {
    setActiveQuizPlayer(null);
    setCurrentIdx(0);
    setSelectedAnswers([]);
    setIsSubmitted(false);
  };

  return (
    <div id="quiz-player-modal" className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-2.5">
            <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold">
              <BookOpen className="w-4 h-4 text-indigo-600" />
            </span>
            <div>
              <div className="text-xs font-bold text-slate-900">{activeQuizPlayer.title}</div>
              <div className="text-[10px] text-slate-400">
                {activeQuizPlayer.topic} • {questions.length} Questions
              </div>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Question or Results */}
        <div className="p-6 overflow-y-auto flex-1">
          {!isSubmitted ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
                <span>QUESTION {currentIdx + 1} OF {questions.length}</span>
                <span>{Math.round(((currentIdx + 1) / questions.length) * 100)}%</span>
              </div>

              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <h3 className="text-base font-bold text-slate-900">
                  {currentQuestion.question}
                </h3>
              </div>

              <div className="space-y-2.5">
                {currentQuestion.options.map((opt, optIdx) => {
                  const isSelected = selectedOption === optIdx;
                  return (
                    <button
                      key={optIdx}
                      id={`quiz-option-${optIdx}`}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full p-3 rounded-xl text-left border text-xs font-semibold flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-indigo-50/50 border-indigo-600 text-indigo-950 ring-1 ring-indigo-500/20 shadow-xs'
                          : 'bg-white border-slate-100 text-slate-700 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span
                          className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                            isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="text-sm font-medium">{opt}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto text-2xl font-bold border border-indigo-100">
                🏆
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Quiz Completed!</h3>
                <p className="text-xs text-slate-400 mt-1">Your responses have been recorded</p>
              </div>

              <div className="p-5 rounded-2xl bg-indigo-50/40 border border-indigo-100">
                <div className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Final Score</div>
                <div className="text-4xl font-bold text-indigo-600 mt-1">{finalScore}%</div>
                <div className="text-xs text-indigo-700 font-semibold mt-2">
                  +{Math.round(finalScore / 5)} Points Added to Leaderboard!
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
          {!isSubmitted ? (
            <>
              <button
                onClick={handleClose}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Quit
              </button>
              <button
                id="submit-quiz-question-btn"
                onClick={handleNext}
                disabled={selectedOption === undefined}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg shadow-sm flex items-center space-x-1.5 transition-colors"
              >
                <span>{currentIdx < questions.length - 1 ? 'Next Question' : 'Submit Quiz'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Done
              </button>
              <button
                onClick={() => {
                  handleClose();
                  setStudentTab('leaderboard');
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center space-x-1.5"
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>View Leaderboard</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
