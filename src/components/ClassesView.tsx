import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  School,
  Users,
  Award,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Target,
  BarChart3,
} from 'lucide-react';

export const ClassesView: React.FC = () => {
  const { classes, selectedClassId, setSelectedClassId, setTeacherTab, setViewStudentsGapModal, gaps } = useApp();
  const [activeClassTab, setActiveClassTab] = useState<string>(selectedClassId);

  const selectedClass = classes.find((c) => c.id === activeClassTab) || classes[0];

  const handleRemediateGap = (topic: string) => {
    const targetGap = gaps.find((g) => g.topic === topic) || gaps[0];
    setTeacherTab('gaps');
  };

  return (
    <div id="classes-view" className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-950/70 border border-indigo-800/60 text-indigo-300 flex items-center justify-center font-bold text-sm">
              🏫
            </span>
            <span>Class & Section Organization</span>
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Compare performance, topic mastery and learning gaps across sections
          </p>
        </div>

        {/* Class switcher tabs */}
        <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800">
          {classes.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setActiveClassTab(c.id);
                setSelectedClassId(c.id);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeClassTab === c.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Class Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase">Total Enrollment</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">{selectedClass.totalStudents} Students</div>
          <div className="text-xs text-slate-500 mt-1">2 Sections Active</div>
        </div>

        <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase">Average Mastery</div>
          <div className="text-2xl font-bold text-indigo-400 mt-1">{selectedClass.avgMastery}%</div>
          <div className="text-xs text-emerald-400 font-medium mt-1 flex items-center">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            Benchmark: 70%
          </div>
        </div>

        <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase">Active Learning Gaps</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">{selectedClass.gapsCount} Gaps</div>
          <div className="text-xs text-amber-300/80 font-medium mt-1">{selectedClass.needSupportCount} students need support</div>
        </div>
      </div>

      {/* Section Comparison Grid */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Section Performance Breakdown
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedClass.sections.map((section) => (
            <div
              key={section.id}
              className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-slate-100 text-base">{section.name}</h3>
                  <p className="text-xs text-slate-400">{section.studentCount} Enrolled Students</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-indigo-400">{section.avgMastery}%</span>
                  <div className="text-[10px] text-slate-500">Avg Mastery</div>
                </div>
              </div>

              {/* Topic Mastery Bars for this section */}
              <div className="space-y-2.5">
                <div className="text-xs font-bold text-slate-300">Topic Mastery:</div>
                {section.topics.map((t) => {
                  let barColor = 'bg-emerald-500';
                  let textColor = 'text-emerald-400';
                  if (t.mastery < 60) {
                    barColor = 'bg-rose-500';
                    textColor = 'text-rose-400';
                  } else if (t.mastery < 80) {
                    barColor = 'bg-amber-500';
                    textColor = 'text-amber-400';
                  }

                  return (
                    <div key={t.topic} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-300">{t.topic}</span>
                        <span className={`font-semibold ${textColor}`}>{t.mastery}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${barColor} rounded-full transition-all`}
                          style={{ width: `${t.mastery}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                <span className="text-xs text-amber-400 font-medium">
                  {section.needSupportCount} students need support
                </span>
                <button
                  onClick={() => setTeacherTab('students')}
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
                >
                  <span>View Section Students</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Class Topic Comparison Matrix */}
      <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-sm space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Curriculum Topic Mastery Matrix
        </h2>

        <div className="divide-y divide-slate-800">
          {selectedClass.topics.map((topic) => (
            <div key={topic.topic} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-slate-100 text-sm">{topic.topic}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      topic.mastery >= 80
                        ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60'
                        : topic.mastery >= 60
                        ? 'bg-amber-950/70 text-amber-300 border border-amber-800/60'
                        : 'bg-rose-950/70 text-rose-300 border border-rose-800/60'
                    }`}
                  >
                    {topic.mastery >= 80 ? 'Mastered' : topic.mastery >= 60 ? 'Developing' : 'Needs Support'}
                  </span>
                </div>
                {topic.gapSummary && (
                  <p className="text-xs text-slate-400">Common gap: {topic.gapSummary}</p>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-base font-bold text-slate-100">{topic.mastery}%</span>
                {topic.mastery < 60 ? (
                  <button
                    onClick={() => handleRemediateGap(topic.topic)}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    Remediate Gap
                  </button>
                ) : (
                  <button
                    onClick={() => setTeacherTab('assessments')}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 rounded-lg text-xs font-medium transition-colors"
                  >
                    Schedule Quiz
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
