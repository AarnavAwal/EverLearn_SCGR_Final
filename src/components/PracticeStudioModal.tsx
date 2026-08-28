import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PracticeSet, PracticeQuestion } from '../types';
import {
  X,
  Target,
  Sparkles,
  Edit2,
  Check,
  Plus,
  Send,
  HelpCircle,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

export const PracticeStudioModal: React.FC = () => {
  const {
    practiceStudioModal,
    setPracticeStudioModal,
    saveEditedPractice,
    assignPracticeToSection,
    generateTargetedPractice,
  } = useApp();

  const { isOpen, gap, practice } = practiceStudioModal;

  const [editingPractice, setEditingPractice] = useState<PracticeSet | null>(practice);
  const [editingQuestionIdx, setEditingQuestionIdx] = useState<number | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Sync state when modal opens
  React.useEffect(() => {
    if (practice) {
      setEditingPractice(practice);
    }
  }, [practice]);

  if (!isOpen || !gap || !editingPractice) return null;

  const handleOptionChange = (qIdx: number, optIdx: number, value: string) => {
    const updatedQuestions = [...editingPractice.questions];
    updatedQuestions[qIdx].options[optIdx] = value;
    setEditingPractice({ ...editingPractice, questions: updatedQuestions });
  };

  const handleQuestionTextChange = (qIdx: number, text: string) => {
    const updatedQuestions = [...editingPractice.questions];
    updatedQuestions[qIdx].question = text;
    setEditingPractice({ ...editingPractice, questions: updatedQuestions });
  };

  const handleExplanationChange = (qIdx: number, text: string) => {
    const updatedQuestions = [...editingPractice.questions];
    updatedQuestions[qIdx].explanation = text;
    setEditingPractice({ ...editingPractice, questions: updatedQuestions });
  };

  const handleCorrectIndexChange = (qIdx: number, correctIdx: number) => {
    const updatedQuestions = [...editingPractice.questions];
    updatedQuestions[qIdx].correctIndex = correctIdx;
    setEditingPractice({ ...editingPractice, questions: updatedQuestions });
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    const newSet = await generateTargetedPractice(gap.id);
    setEditingPractice(newSet);
    setIsRegenerating(false);
  };

  const handleSave = () => {
    saveEditedPractice(editingPractice);
    setEditingQuestionIdx(null);
  };

  const handleAssign = () => {
    saveEditedPractice(editingPractice);
    assignPracticeToSection(editingPractice.id, 'Section A');
    setPracticeStudioModal({ isOpen: false, gap: null, practice: null });
  };

  return (
    <div id="practice-studio-modal" className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-950/70 border border-indigo-800/60 text-indigo-300 flex items-center justify-center font-bold text-sm">
              🎯
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-100">Targeted Practice Studio</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-950/70 text-indigo-300 font-bold border border-indigo-800/60">
                  5 Questions Remediation
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Focus: {gap.topic} • {gap.commonGapTitle}
              </p>
            </div>
          </div>
          <button
            onClick={() => setPracticeStudioModal({ isOpen: false, gap: null, practice: null })}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Question List */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          <div className="p-3.5 bg-slate-800/60 border border-slate-750 rounded-xl text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2 text-slate-300 font-medium">
              <span className="text-indigo-400 font-bold">✨</span>
              <span>Targeted AI Remediation: Questions specifically isolate denominator confusion.</span>
            </div>
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center space-x-1 shrink-0 ml-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
              <span>{isRegenerating ? 'Regenerating...' : 'Regenerate'}</span>
            </button>
          </div>

          <div className="space-y-4">
            {editingPractice.questions.map((q, qIdx) => {
              const isEditingThis = editingQuestionIdx === qIdx;

              return (
                <div
                  key={q.id || qIdx}
                  className={`p-4 rounded-xl border transition-all ${
                    isEditingThis
                      ? 'border-indigo-500 bg-indigo-950/30 shadow-xs'
                      : 'border-slate-800 bg-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center space-x-2 w-full">
                      <span className="w-6 h-6 rounded-md bg-indigo-950/80 border border-indigo-800/60 text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0">
                        {qIdx + 1}
                      </span>
                      {isEditingThis ? (
                        <input
                          type="text"
                          value={q.question}
                          onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                          className="font-bold text-sm text-slate-100 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 w-full focus:outline-indigo-500"
                        />
                      ) : (
                        <h4 className="font-bold text-sm text-slate-100">{q.question}</h4>
                      )}
                    </div>

                    <button
                      onClick={() => setEditingQuestionIdx(isEditingThis ? null : qIdx)}
                      className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors shrink-0"
                      title={isEditingThis ? 'Done editing' : 'Edit question'}
                    >
                      {isEditingThis ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Edit2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-2.5">
                    {q.options.map((opt, optIdx) => {
                      const isCorrect = q.correctIndex === optIdx;
                      return (
                        <div
                          key={optIdx}
                          onClick={() => isEditingThis && handleCorrectIndexChange(qIdx, optIdx)}
                          className={`p-2 rounded-lg text-xs flex items-center justify-between border cursor-pointer ${
                            isCorrect
                              ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300 font-bold'
                              : 'bg-slate-800/70 border-slate-750 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center space-x-2 flex-1">
                            <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            {isEditingThis ? (
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                                className="bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5 text-xs w-full text-slate-100"
                              />
                            ) : (
                              <span>{opt}</span>
                            )}
                          </div>
                          {isCorrect && (
                            <span className="text-[10px] text-emerald-300 bg-emerald-900/60 border border-emerald-700/60 px-1.5 py-0.5 rounded font-bold">
                              Correct
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation Note */}
                  <div className="mt-2 text-[11px] text-slate-400 bg-slate-800/40 p-2 rounded-lg border border-slate-750">
                    <span className="font-semibold text-slate-300">Explanation:</span> {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-850 flex items-center justify-between">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs font-semibold text-slate-200 hover:bg-slate-750 transition-colors"
          >
            Save Draft
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPracticeStudioModal({ isOpen: false, gap: null, practice: null })}
              className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              id="assign-practice-to-section-btn"
              onClick={handleAssign}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center space-x-2 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Assign to Section A ({gap.strugglingCount} Students)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
