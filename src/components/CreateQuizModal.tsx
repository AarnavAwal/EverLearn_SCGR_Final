import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Plus, BookOpen, Send, Target } from 'lucide-react';
import { INITIAL_PRACTICE_QUESTIONS } from '../data/initialData';

export const CreateQuizModal: React.FC = () => {
  const { isCreateQuizModalOpen, setIsCreateQuizModalOpen, createQuiz } = useApp();

  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('Fractions');
  const [dueDate, setDueDate] = useState('Next Monday');
  const [questionCount, setQuestionCount] = useState(5);

  if (!isCreateQuizModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createQuiz({
      title,
      topic,
      classId: 'c9',
      sectionId: 'sec-9a',
      totalQuestions: questionCount,
      avgScore: 75,
      dueDate,
      status: 'active',
      questions: INITIAL_PRACTICE_QUESTIONS.slice(0, questionCount),
    });

    setIsCreateQuizModalOpen(false);
    setTitle('');
  };

  return (
    <div id="create-quiz-modal" className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
              📝
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Create Class Assessment</h3>
              <p className="text-[11px] text-slate-400">Schedule a quiz for Class 9</p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateQuizModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Quiz Title</label>
            <input
              id="quiz-title-input"
              type="text"
              required
              placeholder="e.g. Fractions Mastery Quick Check"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-indigo-500 font-medium bg-slate-50/50 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Topic</label>
              <select
                id="quiz-topic-select"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-indigo-500 font-medium bg-slate-50/50 focus:bg-white"
              >
                <option value="Fractions">Fractions</option>
                <option value="Algebra">Algebra</option>
                <option value="Geometry">Geometry</option>
                <option value="Statistics">Statistics</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Due Date</label>
              <input
                id="quiz-due-date-input"
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-indigo-500 font-medium bg-slate-50/50 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Number of Questions</label>
            <input
              type="number"
              min={3}
              max={15}
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value) || 5)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-indigo-500 font-medium bg-slate-50/50 focus:bg-white"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsCreateQuizModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              id="save-created-quiz-btn"
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-sm flex items-center space-x-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish & Assign</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
