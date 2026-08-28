import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Target,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Brain,
  Plus,
  Loader2,
  BookOpen,
  HelpCircle,
} from 'lucide-react';

export const StudentPracticeView: React.FC = () => {
  const {
    practices,
    currentStudent,
    setActivePracticePlayer,
    generateAIQuestionsForStrugglingTopic,
  } = useApp();

  const [customTopic, setCustomTopic] = useState('Fractions');
  const [customConcept, setCustomConcept] = useState('Adding fractions with unlike denominators and finding least common multiples');
  const [questionCount, setQuestionCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);

  const quickStrugglingPresets = [
    {
      topic: 'Fractions',
      concept: 'Adding and subtracting fractions with different denominators',
      icon: '➗',
    },
    {
      topic: 'Algebra',
      concept: 'Solving two-step linear equations with brackets',
      icon: '📐',
    },
    {
      topic: 'Geometry',
      concept: 'Finding interior and exterior angles of polygons',
      icon: '📏',
    },
    {
      topic: 'Negative Numbers',
      concept: 'Rules for multiplying and dividing negative integers',
      icon: '➖',
    },
  ];

  const handleGenerateCustomDrill = async (topicToUse?: string, conceptToUse?: string) => {
    const finalTopic = topicToUse || customTopic || 'Mathematics';
    const finalConcept = conceptToUse || customConcept || 'Core conceptual understanding';

    setIsGenerating(true);
    try {
      const newPractice = await generateAIQuestionsForStrugglingTopic(
        finalTopic,
        finalConcept,
        questionCount
      );
      if (newPractice) {
        setActivePracticePlayer(newPractice);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div id="student-practice-view" className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-950/70 border border-indigo-800/60 text-indigo-300 flex items-center justify-center font-bold text-sm">
              🎯
            </span>
            <span>AI Practice & Remediation Hub</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Generate custom AI practice drills tailored specifically to topics you're struggling with
          </p>
        </div>
      </div>

      {/* AI Custom Drill Generator Box */}
      <div
        id="ai-drill-generator-box"
        className="p-5 rounded-2xl bg-slate-900 border border-indigo-800/70 shadow-lg space-y-4"
      >
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-slate-100">AI Question Generator for Struggling Topics</h3>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-400/30">
                Adaptive AI
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Pick a topic or write any math concept you find difficult — Gemini AI will generate step-by-step diagnostic questions.
            </p>
          </div>
        </div>

        {/* Quick presets */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Quick Struggling Topic Presets:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {quickStrugglingPresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCustomTopic(preset.topic);
                  setCustomConcept(preset.concept);
                }}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center space-x-2.5 cursor-pointer ${
                  customTopic === preset.topic && customConcept === preset.concept
                    ? 'bg-indigo-950/70 border-indigo-500 text-indigo-200'
                    : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-slate-100'
                }`}
              >
                <span className="text-base shrink-0">{preset.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-slate-200">{preset.topic}</div>
                  <div className="text-[11px] text-slate-400 truncate">{preset.concept}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input Form */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
              Topic Name
            </label>
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="e.g. Fractions, Algebra"
              className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
              Specific Concept / What's confusing you?
            </label>
            <input
              type="text"
              value={customConcept}
              onChange={(e) => setCustomConcept(e.target.value)}
              placeholder="e.g. Finding common denominator when denominators are 3 and 7"
              className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span>Questions:</span>
            {[3, 5, 8].map((num) => (
              <button
                key={num}
                onClick={() => setQuestionCount(num)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  questionCount === num
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          <button
            id="generate-ai-struggling-drill-btn"
            onClick={() => handleGenerateCustomDrill()}
            disabled={isGenerating || !customTopic}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center space-x-2 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating AI Questions...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate & Start Practice</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Practice Sets List */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Your Practice Library
        </h3>

        <div className="space-y-3">
          {practices.map((practice) => {
            const isCompleted =
              currentStudent.completedPracticeIds.includes(practice.id) ||
              (practice.topic === 'Fractions' && (currentStudent.fractionsMastery || 42) >= 75);

            return (
              <div
                key={practice.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isCompleted
                    ? 'bg-emerald-950/20 border-emerald-800/50'
                    : 'bg-slate-900/90 border-slate-800 shadow-sm'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isCompleted
                            ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60'
                            : 'bg-indigo-950/70 text-indigo-300 border border-indigo-800/60'
                        }`}
                      >
                        {isCompleted ? 'Completed ✓' : 'Available Practice'}
                      </span>
                      <span className="text-xs text-slate-400">• {practice.questions.length} Questions</span>
                      <span className="text-xs text-indigo-300 font-semibold">• {practice.topic}</span>
                    </div>

                    <h3 className="font-bold text-slate-100 text-sm">{practice.title}</h3>
                    <p className="text-xs text-slate-400 max-w-lg">
                      Target: {practice.targetMisconception}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <button
                      onClick={() => setActivePracticePlayer(practice)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 shadow-sm cursor-pointer ${
                        isCompleted
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      }`}
                    >
                      <span>{isCompleted ? 'Practice Again' : 'Start Drill'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
