import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  TrendingUp,
  Target,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Shield,
  BookOpen,
  ClipboardCheck,
  FileText,
  Clock,
  AlertTriangle,
  Send,
  Check,
  BarChart2,
  ChevronRight,
  Edit3,
  Save,
  Brain,
  RotateCw,
  Lightbulb,
} from 'lucide-react';
import { StudentDeficiency, TeacherAIStudentDossier } from '../types';

export const StudentProfileModal: React.FC = () => {
  const {
    role,
    selectedStudentModal,
    setSelectedStudentModal,
    generateTargetedPractice,
    setPracticeStudioModal,
    gaps,
    assessments,
    updateStudentTeacherNote,
    assignDirectStudentRemediation,
    fetchTeacherAIDossier,
    generateAIQuestionsForStrugglingTopic,
    setActivePracticePlayer,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'ai_dossier' | 'deficiencies' | 'assessments' | 'mastery' | 'notes'>('ai_dossier');
  const [teacherNoteInput, setTeacherNoteInput] = useState('');
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [aiDossier, setAiDossier] = useState<TeacherAIStudentDossier | null>(null);
  const [isLoadingDossier, setIsLoadingDossier] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);

  // Load Dossier when student changes
  useEffect(() => {
    if (selectedStudentModal) {
      setTeacherNoteInput(
        selectedStudentModal.teacherPrivateNote ||
          `${selectedStudentModal.name} shows high participation. Needs targeted attention on ${selectedStudentModal.weakTopics.join(', ') || 'foundational problem-solving'}.`
      );
      setIsEditingNote(false);

      if (selectedStudentModal.aiTeacherDossier) {
        setAiDossier(selectedStudentModal.aiTeacherDossier);
      } else {
        loadDossier(selectedStudentModal.id);
      }
    }
  }, [selectedStudentModal?.id]);

  const loadDossier = async (studentId: string) => {
    setIsLoadingDossier(true);
    try {
      const res = await fetchTeacherAIDossier(studentId);
      setAiDossier(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingDossier(false);
    }
  };

  if (!selectedStudentModal) return null;

  const isTeacher = role === 'teacher';

  // Derive completed assessments for this student
  const studentAssessmentsList = assessments.map((assessment) => {
    const isCompleted =
      selectedStudentModal.assessmentSubmissions?.some((sub) => sub.assessmentId === assessment.id) ||
      assessment.completedByStudentIds.includes(selectedStudentModal.id);

    const submission = selectedStudentModal.assessmentSubmissions?.find(
      (sub) => sub.assessmentId === assessment.id
    );

    return {
      assessment,
      isCompleted,
      submission,
    };
  });

  const completedAssessmentsCount = studentAssessmentsList.filter((item) => item.isCompleted).length;
  const totalAssessmentsCount = assessments.length;
  const completionRate = Math.round((completedAssessmentsCount / Math.max(1, totalAssessmentsCount)) * 100);

  // Derive dynamic deficiencies if not explicitly set
  const studentDeficiencies: StudentDeficiency[] = selectedStudentModal.deficiencies || [
    ...(selectedStudentModal.fractionsMastery < 70
      ? [
          {
            id: 'def-frac',
            topic: 'Fractions',
            concept: 'Adding Unlike Denominators without LCM/LCD',
            severity: (selectedStudentModal.fractionsMastery < 50 ? 'critical' : 'moderate') as 'critical' | 'moderate',
            errorPattern: 'Directly sums numerators and denominators (e.g. 1/3 + 1/4 = 2/7) skipping denominator alignment.',
            errorFrequency: '62% error rate in fraction diagnostics',
            misconceptionDetail: 'Treats numerators and denominators as independent whole integers during addition and subtraction.',
            recommendedRemediation: '5-question targeted visual fraction bar drill and LCD multiplication practice.',
          },
        ]
      : []),
    ...(selectedStudentModal.algebraMastery < 80
      ? [
          {
            id: 'def-alg',
            topic: 'Algebra',
            concept: 'Negative Sign Distribution over Parentheses',
            severity: 'moderate' as const,
            errorPattern: 'Omits negative sign flip inside brackets: -a(b - c) evaluated as -ab - c instead of -ab + ac.',
            errorFrequency: '35% error rate on complex expansion exercises',
            misconceptionDetail: 'Fails to distribute negative multiplier across all terms inside parentheses.',
            recommendedRemediation: 'Step-by-step bracket sign-flip matching drill.',
          },
        ]
      : []),
  ];

  const handleSaveNote = () => {
    updateStudentTeacherNote(selectedStudentModal.id, teacherNoteInput);
    setIsEditingNote(false);
  };

  const handleGenerateQuestionsForTopic = async (topic: string, concept?: string) => {
    setIsGeneratingQuestions(true);
    try {
      const practice = await generateAIQuestionsForStrugglingTopic(
        topic,
        concept || `Core understanding and misconception repair for ${topic}`,
        5
      );
      if (practice) {
        setPracticeStudioModal({
          isOpen: true,
          gap: gaps[0],
          practice,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  return (
    <div
      id="student-profile-modal"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-100">
        {/* Header with Role Status */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-3xl shadow-inner shrink-0">
              {selectedStudentModal.avatar}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-slate-100">{selectedStudentModal.name}</h3>
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-700/60 text-[10px] font-bold">
                  <Brain className="w-3 h-3 text-indigo-400" />
                  <span>AI Performance Dossier</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedStudentModal.className || 'Class 9'} • {selectedStudentModal.sectionName || 'Section A'} • Student ID: #{selectedStudentModal.id}
              </p>
            </div>
          </div>
          <button
            id="close-student-profile-modal-btn"
            onClick={() => setSelectedStudentModal(null)}
            className="p-2 text-slate-400 hover:text-slate-200 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Stats Banner */}
        <div className="px-6 py-3 bg-slate-850/90 border-b border-slate-800 grid grid-cols-4 gap-3 text-center text-xs">
          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Overall Mastery</span>
            <span className="text-sm font-extrabold text-emerald-400">
              {selectedStudentModal.progressPct}%
            </span>
            <span className="text-[10px] text-emerald-300 block mt-0.5">+{selectedStudentModal.recentImprovement}% wk</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Identified Gaps</span>
            <span className={`text-sm font-extrabold ${studentDeficiencies.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {studentDeficiencies.length}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {studentDeficiencies.filter((d) => d.severity === 'critical').length} critical
            </span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Points Earned</span>
            <span className="text-sm font-extrabold text-amber-400">
              {selectedStudentModal.points} pts
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">{selectedStudentModal.streakDays}d streak 🔥</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Assessments</span>
            <span className="text-sm font-extrabold text-indigo-300">
              {completedAssessmentsCount}/{totalAssessmentsCount}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">({completionRate}%)</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 flex items-center space-x-1 border-b border-slate-800 bg-slate-900 text-xs font-semibold overflow-x-auto">
          <button
            id="tab-student-ai-dossier"
            onClick={() => setActiveTab('ai_dossier')}
            className={`px-3.5 py-2.5 border-b-2 flex items-center space-x-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'ai_dossier'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>AI Teacher Dossier</span>
          </button>
          <button
            id="tab-student-deficiencies"
            onClick={() => setActiveTab('deficiencies')}
            className={`px-3.5 py-2.5 border-b-2 flex items-center space-x-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'deficiencies'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Learning Gaps ({studentDeficiencies.length})</span>
          </button>
          <button
            id="tab-student-mastery"
            onClick={() => setActiveTab('mastery')}
            className={`px-3.5 py-2.5 border-b-2 flex items-center space-x-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'mastery'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Subject Competency</span>
          </button>
          <button
            id="tab-student-assessments"
            onClick={() => setActiveTab('assessments')}
            className={`px-3.5 py-2.5 border-b-2 flex items-center space-x-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'assessments'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span>Assessments</span>
          </button>
          <button
            id="tab-student-notes"
            onClick={() => setActiveTab('notes')}
            className={`px-3.5 py-2.5 border-b-2 flex items-center space-x-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'notes'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Teacher Notes</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* TAB 0: AI TEACHER DOSSIER */}
          {activeTab === 'ai_dossier' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                    <span>Teacher AI Diagnostic Performance Dossier</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Gemini AI pedagogical synthesis for 1-on-1 intervention planning
                  </p>
                </div>

                <button
                  onClick={() => loadDossier(selectedStudentModal.id)}
                  disabled={isLoadingDossier}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-1 cursor-pointer disabled:opacity-50"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isLoadingDossier ? 'animate-spin' : ''}`} />
                  <span>{isLoadingDossier ? 'Analyzing...' : 'Refresh AI'}</span>
                </button>
              </div>

              {isLoadingDossier ? (
                <div className="p-8 text-center space-y-2">
                  <div className="w-7 h-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-slate-400">Gemini model is summarizing student diagnostic records...</p>
                </div>
              ) : aiDossier ? (
                <div className="space-y-3.5 text-xs">
                  {/* Executive Summary */}
                  <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/60 text-slate-200 space-y-1.5">
                    <div className="flex items-center space-x-2 text-indigo-300 font-bold uppercase tracking-wider text-[11px]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Executive Teacher Summary</span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-200">
                      {aiDossier.executiveSummary}
                    </p>
                  </div>

                  {/* Strengths & Weaknesses 2-Col */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                      <div className="flex items-center space-x-1.5 text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Demonstrated Strengths</span>
                      </div>
                      <ul className="space-y-1 text-slate-300">
                        {aiDossier.strengths?.map((s, idx) => (
                          <li key={idx} className="flex items-start space-x-1.5">
                            <span className="text-emerald-400 font-bold">•</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                      <div className="flex items-center space-x-1.5 text-rose-400 font-bold uppercase tracking-wider text-[10px]">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Core Learning Deficiencies</span>
                      </div>
                      <ul className="space-y-1 text-slate-300">
                        {aiDossier.criticalGaps?.map((g, idx) => (
                          <li key={idx} className="flex items-start space-x-1.5">
                            <span className="text-rose-400 font-bold">•</span>
                            <span>{g}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Cognitive Misconception Insight */}
                  {aiDossier.cognitiveMisconceptions && (
                    <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-800/40 text-slate-300 space-y-1">
                      <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                        Root Cognitive Misconception:
                      </span>
                      <p className="text-xs">{aiDossier.cognitiveMisconceptions}</p>
                    </div>
                  )}

                  {/* Teacher Action Plan */}
                  <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 text-amber-300 font-bold uppercase tracking-wider text-[10px]">
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>Recommended Pedagogical Action Plan</span>
                      </div>
                      <span className="text-[10px] font-bold text-indigo-400">
                        Pace: {aiDossier.recommendedPacing || 'Normal'}
                      </span>
                    </div>

                    <ul className="space-y-1 text-slate-300">
                      {aiDossier.pedagogicalInterventions?.map((action, idx) => (
                        <li key={idx} className="flex items-start space-x-1.5">
                          <span className="text-amber-400 font-bold">→</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Quick AI Question Generator Trigger */}
                  <div className="p-3.5 rounded-xl bg-indigo-900/20 border border-indigo-700/40 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold text-indigo-200">
                        Generate Custom AI Practice for {selectedStudentModal.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Targets {selectedStudentModal.weakTopics[0] || 'Fractions'} with step-by-step diagnostic questions
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        handleGenerateQuestionsForTopic(
                          selectedStudentModal.weakTopics[0] || 'Fractions',
                          aiDossier.cognitiveMisconceptions
                        )
                      }
                      disabled={isGeneratingQuestions}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-colors shrink-0 flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isGeneratingQuestions ? 'Generating...' : 'Generate AI Drill'}</span>
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* TAB 1: DEFICIENCIES */}
          {activeTab === 'deficiencies' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-100">
                    Targeted Learning Deficiencies & Root-Cause Misconceptions
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Specific cognitive barriers identified from student quiz attempts
                  </p>
                </div>
              </div>

              {studentDeficiencies.length === 0 ? (
                <div className="p-6 text-center bg-slate-800/40 rounded-2xl border border-slate-800 text-xs text-slate-400">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="font-bold text-slate-200">No critical learning deficiencies detected!</p>
                  <p className="mt-1">This student has demonstrated strong mastery across all active topics.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {studentDeficiencies.map((def) => (
                    <div
                      key={def.id}
                      className="p-4 rounded-2xl bg-slate-800/60 border border-slate-750 space-y-3 hover:border-slate-650 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                                def.severity === 'critical'
                                  ? 'bg-rose-950/80 text-rose-300 border border-rose-800/70'
                                  : 'bg-amber-950/80 text-amber-300 border border-amber-800/70'
                              }`}
                            >
                              {def.severity} Gap
                            </span>
                            <span className="text-xs font-bold text-slate-200">{def.topic}</span>
                          </div>
                          <h5 className="text-sm font-bold text-slate-100 mt-1">{def.concept}</h5>
                        </div>

                        <button
                          onClick={() => handleGenerateQuestionsForTopic(def.topic, def.misconceptionDetail)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors flex items-center space-x-1 shrink-0 shadow-xs cursor-pointer"
                        >
                          <Target className="w-3 h-3" />
                          <span>Generate Drill</span>
                        </button>
                      </div>

                      <div className="space-y-2 text-xs bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                        <div>
                          <span className="font-bold text-rose-300">Observed Error Pattern: </span>
                          <span className="text-slate-300">{def.errorPattern}</span>
                        </div>
                        <div>
                          <span className="font-bold text-amber-300">Underlying Misconception: </span>
                          <span className="text-slate-300">{def.misconceptionDetail}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SUBJECT COMPETENCY */}
          {activeTab === 'mastery' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-100">Subject Topic Competency Breakdown</h4>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-300">Fractions & Decimals</span>
                    <span className={selectedStudentModal.fractionsMastery < 60 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                      {selectedStudentModal.fractionsMastery}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        selectedStudentModal.fractionsMastery < 60 ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${selectedStudentModal.fractionsMastery}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-300">Algebra & Linear Expressions</span>
                    <span className="text-indigo-400 font-bold">{selectedStudentModal.algebraMastery}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 transition-all duration-500"
                      style={{ width: `${selectedStudentModal.algebraMastery}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-300">Geometry & Angle Properties</span>
                    <span className="text-emerald-400 font-bold">{selectedStudentModal.geometryMastery}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${selectedStudentModal.geometryMastery}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-300">Statistics & Probability</span>
                    <span className="text-cyan-400 font-bold">{selectedStudentModal.statisticsMastery || 88}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 transition-all duration-500"
                      style={{ width: `${selectedStudentModal.statisticsMastery || 88}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ASSESSMENTS */}
          {activeTab === 'assessments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-100">
                    Assessment Submissions & Completion History
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Record of quizzes and diagnostic assessments attempted
                  </p>
                </div>
                <div className="px-3 py-1 bg-indigo-950/70 border border-indigo-800/60 rounded-xl text-xs font-bold text-indigo-300">
                  {completedAssessmentsCount} of {totalAssessmentsCount} Completed
                </div>
              </div>

              <div className="space-y-2.5">
                {studentAssessmentsList.map(({ assessment, isCompleted, submission }) => (
                  <div
                    key={assessment.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isCompleted
                        ? 'bg-slate-800/60 border-slate-750'
                        : 'bg-slate-900/60 border-slate-800/80 opacity-75'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-slate-200">{assessment.title}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                            {assessment.topic}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-1">
                          <span>{assessment.totalQuestions} Questions</span>
                          <span>•</span>
                          <span>Due: {assessment.dueDate}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        {isCompleted ? (
                          <span className="px-2 py-1 rounded bg-emerald-950/80 text-emerald-300 text-xs font-bold border border-emerald-800/60">
                            Completed ✓
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded bg-slate-800 text-slate-400 text-xs font-semibold border border-slate-700">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: TEACHER NOTES */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-100 flex items-center space-x-1.5">
                    <Shield className="w-4 h-4 text-amber-400" />
                    <span>Teacher Confidential Notes</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Private teacher log for 1-on-1 observations
                  </p>
                </div>
                {!isEditingNote ? (
                  <button
                    onClick={() => setIsEditingNote(true)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Note</span>
                  </button>
                ) : (
                  <button
                    onClick={handleSaveNote}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Note</span>
                  </button>
                )}
              </div>

              {isEditingNote ? (
                <div className="space-y-2">
                  <textarea
                    value={teacherNoteInput}
                    onChange={(e) => setTeacherNoteInput(e.target.value)}
                    rows={5}
                    className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
                    placeholder="Type private notes regarding student comprehension..."
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setIsEditingNote(false)}
                      className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveNote}
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed italic">
                  "{selectedStudentModal.teacherPrivateNote || teacherNoteInput}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            id="modal-footer-close-btn"
            onClick={() => setSelectedStudentModal(null)}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
