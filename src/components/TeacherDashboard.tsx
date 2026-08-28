import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Target,
  Brain,
  Lightbulb,
  BookOpen,
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const {
    currentClass,
    selectedClassId,
    selectedSectionId,
    setSelectedSectionId,
    gaps,
    setTeacherTab,
    setViewStudentsGapModal,
    setPracticeStudioModal,
    generateTargetedPractice,
    students,
    setSelectedStudentModal,
    generateAIQuestionsForStrugglingTopic,
  } = useApp();

  const [activeRemediatingTopic, setActiveRemediatingTopic] = useState<string | null>(null);

  // Use selectedSectionId directly from context so Navbar and Dashboard are 100% synchronized
  const activeSectionView = selectedSectionId;

  // Filter students and section info based on activeSectionView
  const currentSectionData = currentClass.sections.find((s) => s.id === activeSectionView);

  const displayedStudents = (
    activeSectionView === 'all'
      ? students.filter((s) => s.classId === selectedClassId)
      : students.filter((s) => s.sectionId === activeSectionView)
  ).sort((a, b) => a.progressPct - b.progressPct); // Priority: lowest mastery first for teacher intervention

  const fractionsGap = gaps.find((g) => g.id === 'gap-fractions') || gaps[0];
  const algebraGap = gaps.find((g) => g.id === 'gap-algebra') || gaps[1] || gaps[0];

  const isFractionsResolved = fractionsGap.status === 'resolved' || (fractionsGap.afterMastery && fractionsGap.afterMastery > 70);
  const isAlgebraResolved = algebraGap.status === 'resolved' || (algebraGap.afterMastery && algebraGap.afterMastery > 70);

  const handleCreatePracticeDirect = async (gapId: string) => {
    const targetGap = gaps.find((g) => g.id === gapId) || fractionsGap;
    const practice = await generateTargetedPractice(targetGap.id);
    setPracticeStudioModal({
      isOpen: true,
      gap: targetGap,
      practice,
    });
  };

  const handleViewStudentsDirect = (gapId: string) => {
    const targetGap = gaps.find((g) => g.id === gapId) || fractionsGap;
    setViewStudentsGapModal(targetGap);
  };

  const handleCreateAIQuestionsDirect = async (topic: string, concept: string) => {
    setActiveRemediatingTopic(topic);
    try {
      const practice = await generateAIQuestionsForStrugglingTopic(topic, concept, 5);
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
      setActiveRemediatingTopic(null);
    }
  };

  // Section metrics calculations
  const totalStudentsCount = activeSectionView === 'all' 
    ? currentClass.totalStudents 
    : (currentSectionData?.studentCount || 16);

  const sectionAvgMastery = activeSectionView === 'all'
    ? currentClass.avgMastery
    : (currentSectionData?.avgMastery || 74);

  const effectiveAvgMastery = isFractionsResolved && (activeSectionView === 'sec-9a' || activeSectionView === 'all')
    ? sectionAvgMastery + 6
    : sectionAvgMastery;

  const criticalGapsCount = activeSectionView === 'sec-9a'
    ? (isFractionsResolved ? 0 : 1)
    : activeSectionView === 'sec-9b'
    ? (isAlgebraResolved ? 0 : 1)
    : (isFractionsResolved && isAlgebraResolved ? 0 : isFractionsResolved || isAlgebraResolved ? 1 : 2);

  const supportCount = activeSectionView === 'sec-9a'
    ? (isFractionsResolved ? 1 : 5)
    : activeSectionView === 'sec-9b'
    ? (isAlgebraResolved ? 1 : 4)
    : (isFractionsResolved ? 4 : currentClass.needSupportCount);

  return (
    <div id="teacher-dashboard-view" className="space-y-6">
      {/* Header section with Section Switcher */}
      <header className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-slate-100 tracking-tight">
              {activeSectionView === 'all'
                ? `${currentClass.name} (All Sections) Overview`
                : `${currentClass.name} - ${currentSectionData?.name || 'Section'} Overview`}
            </h1>
          </div>
          <p className="text-slate-400 mt-1 text-sm">
            School &gt; {currentClass.name} &gt; {activeSectionView === 'all' ? 'All Sections' : currentSectionData?.name || 'Section'} • Real-time mastery analytics
          </p>
        </div>

        {/* Section View Pills & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800 shadow-xs">
            <button
              id="section-tab-all"
              onClick={() => setSelectedSectionId('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSectionView === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Sections
            </button>
            {currentClass.sections.map((sec) => (
              <button
                key={sec.id}
                id={`section-tab-${sec.id}`}
                onClick={() => setSelectedSectionId(sec.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeSectionView === sec.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sec.name} ({sec.studentCount})
              </button>
            ))}
          </div>

          <button
            id="compare-sections-btn"
            onClick={() => setTeacherTab('classes')}
            className="px-3.5 py-2 bg-slate-900 border border-slate-750 rounded-lg text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-colors shadow-xs cursor-pointer"
          >
            Compare Grid
          </button>
          <button
            id="view-learning-gaps-action-btn"
            onClick={() => setTeacherTab('gaps')}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Target className="w-4 h-4" />
            <span>Remediate Gaps ({gaps.filter((g) => g.status === 'active').length})</span>
          </button>
        </div>
      </header>

      {/* 4 Stat Cards in Dark Mode */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div id="metric-students-card" className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-sm">
          <p className="text-slate-400 text-sm font-medium">Total Students</p>
          <h2 className="text-3xl font-bold mt-1 text-slate-100">{totalStudentsCount}</h2>
          <p className="text-xs text-slate-500 mt-1">
            {activeSectionView === 'sec-9a'
              ? '16 Active in Section A'
              : activeSectionView === 'sec-9b'
              ? '14 Active in Section B'
              : '16 in Sec A • 14 in Sec B'}
          </p>
        </div>

        <div id="metric-mastery-card" className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-sm">
          <p className="text-slate-400 text-sm font-medium">Avg. Mastery</p>
          <h2 className="text-3xl font-bold mt-1 text-emerald-400">
            {effectiveAvgMastery}%
          </h2>
          <p className="text-xs text-emerald-400 font-medium mt-1 flex items-center">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            {isFractionsResolved && activeSectionView === 'sec-9a'
              ? '+6% from remediation'
              : activeSectionView === 'sec-9b'
              ? '+4% this month'
              : '+3% this month'}
          </p>
        </div>

        <div id="metric-gaps-card" className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-sm">
          <p className="text-slate-400 text-sm font-medium">Critical Gaps</p>
          <h2 className="text-3xl font-bold mt-1 text-rose-400">
            {criticalGapsCount}
          </h2>
          <p className="text-xs text-rose-400 font-medium mt-1">
            {activeSectionView === 'sec-9a'
              ? (isFractionsResolved ? '0 critical • 1 minor' : 'Fractions (42% mastery)')
              : activeSectionView === 'sec-9b'
              ? (isAlgebraResolved ? '0 critical • 1 minor' : 'Algebra: Sign flip (48%)')
              : 'Fractions (Sec A) & Algebra (Sec B)'}
          </p>
        </div>

        <div id="metric-support-card" className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-sm">
          <p className="text-slate-400 text-sm font-medium">Needs Support</p>
          <h2 className="text-3xl font-bold mt-1 text-amber-400">
            {supportCount}
          </h2>
          <p className="text-xs text-slate-500 mt-1">Below 60% threshold</p>
        </div>
      </section>

      {/* Main Grid: TOP LEARNING GAPS (Left 7 Cols) + AI STUDENT DIAGNOSTIC DOSSIER HUB (Right 5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Top Learning Gaps + AI Insight (col-span-7) */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          <div id="top-learning-gaps-container" className="bg-slate-900/80 rounded-2xl border border-slate-800 shadow-sm p-6 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-bold text-lg text-slate-100">
                    {activeSectionView === 'sec-9a'
                      ? 'Section A: Topic Mastery & Gaps'
                      : activeSectionView === 'sec-9b'
                      ? 'Section B: Topic Mastery & Gaps'
                      : 'Class 9: Comparative Mastery & Gaps'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {activeSectionView === 'sec-9a'
                      ? 'Strengths: Geometry & Stats • Weakness: Fractions'
                      : activeSectionView === 'sec-9b'
                      ? 'Strengths: Fractions & Geometry • Weakness: Algebra Signs'
                      : 'Distinct topic distributions across Section A & B'}
                  </p>
                </div>
                <button
                  id="view-all-gaps-link"
                  onClick={() => setTeacherTab('gaps')}
                  className="text-indigo-400 hover:text-indigo-300 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>All Details</span>
                  <span>→</span>
                </button>
              </div>

              <div className="space-y-6">
                {/* SECTION A TOPIC BREAKDOWN OR COMBINED */}
                {activeSectionView === 'sec-9a' && (
                  <>
                    {/* Fractions Item */}
                    <div id="gap-item-fractions" className="flex items-center justify-between">
                      <div className="flex-1 max-w-[150px]">
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-slate-200">Fractions</p>
                          {isFractionsResolved && (
                            <span className="text-[9px] bg-emerald-950/80 border border-emerald-800 text-emerald-300 font-bold px-1.5 py-0.5 rounded">
                              Fixed
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">Adding unlike terms</p>
                      </div>
                      <div className="flex-1 h-2 bg-slate-800 rounded-full mx-4 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isFractionsResolved ? 'bg-emerald-400 w-[81%]' : 'bg-rose-500 w-[42%]'
                          }`}
                        ></div>
                      </div>
                      <span
                        className={`text-sm font-bold w-12 text-right ${
                          isFractionsResolved ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {isFractionsResolved ? '81%' : '42%'}
                      </span>
                      <button
                        onClick={() => setTeacherTab('gaps')}
                        className="ml-4 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-bold text-slate-300 hover:bg-slate-750 hover:text-white transition-colors cursor-pointer"
                      >
                        {isFractionsResolved ? 'Review' : 'Intervene'}
                      </button>
                    </div>

                    {/* Algebra Item */}
                    <div id="gap-item-algebra" className="flex items-center justify-between">
                      <div className="flex-1 max-w-[150px]">
                        <p className="font-semibold text-slate-200">Algebra</p>
                        <p className="text-xs text-slate-500">Linear equations</p>
                      </div>
                      <div className="flex-1 h-2 bg-slate-800 rounded-full mx-4 overflow-hidden">
                        <div className="h-full bg-amber-400 w-[76%] rounded-full"></div>
                      </div>
                      <span className="text-sm font-bold text-amber-400 w-12 text-right">76%</span>
                      <button
                        onClick={() => setTeacherTab('assessments')}
                        className="ml-4 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-bold text-slate-300 hover:bg-slate-750 hover:text-white transition-colors cursor-pointer"
                      >
                        Quiz
                      </button>
                    </div>

                    {/* Geometry Item */}
                    <div id="gap-item-geometry" className="flex items-center justify-between">
                      <div className="flex-1 max-w-[150px]">
                        <p className="font-semibold text-slate-200">Geometry</p>
                        <p className="text-xs text-slate-500">Theorems & Angles</p>
                      </div>
                      <div className="flex-1 h-2 bg-slate-800 rounded-full mx-4 overflow-hidden">
                        <div className="h-full bg-emerald-400 w-[88%] rounded-full"></div>
                      </div>
                      <span className="text-sm font-bold text-emerald-400 w-12 text-right">88%</span>
                      <button
                        onClick={() => setTeacherTab('assessments')}
                        className="ml-4 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-bold text-slate-300 hover:bg-slate-750 hover:text-white transition-colors cursor-pointer"
                      >
                        Mastered
                      </button>
                    </div>
                  </>
                )}

                {/* SECTION B TOPIC BREAKDOWN */}
                {activeSectionView === 'sec-9b' && (
                  <>
                    <div id="gap-item-algebra-b" className="flex items-center justify-between">
                      <div className="flex-1 max-w-[150px]">
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-slate-200">Algebra</p>
                          {isAlgebraResolved && (
                            <span className="text-[9px] bg-emerald-950/80 border border-emerald-800 text-emerald-300 font-bold px-1.5 py-0.5 rounded">
                              Fixed
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">Sign flips: -3(2x-5)</p>
                      </div>
                      <div className="flex-1 h-2 bg-slate-800 rounded-full mx-4 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isAlgebraResolved ? 'bg-emerald-400 w-[85%]' : 'bg-rose-500 w-[48%]'
                          }`}
                        ></div>
                      </div>
                      <span
                        className={`text-sm font-bold w-12 text-right ${
                          isAlgebraResolved ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {isAlgebraResolved ? '85%' : '48%'}
                      </span>
                      <button
                        onClick={() => setTeacherTab('gaps')}
                        className="ml-4 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-bold text-slate-300 hover:bg-slate-750 hover:text-white transition-colors cursor-pointer"
                      >
                        {isAlgebraResolved ? 'Review' : 'Intervene'}
                      </button>
                    </div>

                    <div id="gap-item-fractions-b" className="flex items-center justify-between">
                      <div className="flex-1 max-w-[150px]">
                        <p className="font-semibold text-slate-200">Fractions</p>
                        <p className="text-xs text-slate-500">Operations & LCD</p>
                      </div>
                      <div className="flex-1 h-2 bg-slate-800 rounded-full mx-4 overflow-hidden">
                        <div className="h-full bg-emerald-400 w-[84%] rounded-full"></div>
                      </div>
                      <span className="text-sm font-bold text-emerald-400 w-12 text-right">84%</span>
                      <button
                        onClick={() => setTeacherTab('assessments')}
                        className="ml-4 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-bold text-slate-300 hover:bg-slate-750 hover:text-white transition-colors cursor-pointer"
                      >
                        Mastered
                      </button>
                    </div>
                  </>
                )}

                {/* ALL SECTIONS COMPARISON */}
                {activeSectionView === 'all' && (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 max-w-[150px]">
                        <p className="font-semibold text-slate-200">Fractions</p>
                        <p className="text-xs text-slate-500">Sec A: 42% | Sec B: 84%</p>
                      </div>
                      <div className="flex-1 h-2 bg-slate-800 rounded-full mx-4 overflow-hidden">
                        <div className="h-full bg-amber-400 w-[63%] rounded-full"></div>
                      </div>
                      <span className="text-sm font-bold text-amber-400 w-12 text-right">63%</span>
                      <button
                        onClick={() => setTeacherTab('gaps')}
                        className="ml-4 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-bold text-slate-300 hover:bg-slate-750 hover:text-white transition-colors cursor-pointer"
                      >
                        Details
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1 max-w-[150px]">
                        <p className="font-semibold text-slate-200">Algebra</p>
                        <p className="text-xs text-slate-500">Sec A: 76% | Sec B: 48%</p>
                      </div>
                      <div className="flex-1 h-2 bg-slate-800 rounded-full mx-4 overflow-hidden">
                        <div className="h-full bg-amber-400 w-[62%] rounded-full"></div>
                      </div>
                      <span className="text-sm font-bold text-amber-400 w-12 text-right">62%</span>
                      <button
                        onClick={() => setTeacherTab('gaps')}
                        className="ml-4 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-bold text-slate-300 hover:bg-slate-750 hover:text-white transition-colors cursor-pointer"
                      >
                        Details
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* AI Insight Box styled in dark theme */}
            <div className="mt-8 p-4 bg-indigo-950/40 rounded-xl border border-indigo-800/50 relative overflow-hidden">
              <div className="flex items-start gap-3">
                <div className="text-indigo-400 font-bold text-xs uppercase tracking-wider mt-0.5 shrink-0 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Insight</span>
                </div>
                <div className="flex-1">
                  {activeSectionView === 'sec-9a' ? (
                    isFractionsResolved ? (
                      <p className="text-sm text-indigo-200 leading-relaxed font-medium">
                        Fractions remediation succeeded for Section A! Average mastery jumped from <strong>42% → 81% (+39% improvement)</strong>.
                      </p>
                    ) : (
                      <>
                        <p className="text-sm text-indigo-200 leading-relaxed">
                          <strong>Section A Misconception:</strong> 6 students are adding numerators and denominators directly (e.g. 1/2 + 1/3 = 2/5). Recommend targeted LCM practice.
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <button
                            id="ai-insight-create-practice-btn"
                            onClick={() => handleCreatePracticeDirect('gap-fractions')}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md transition-colors cursor-pointer"
                          >
                            Create Practice Set
                          </button>
                          <button
                            onClick={() => handleViewStudentsDirect('gap-fractions')}
                            className="bg-slate-800 border border-indigo-700/60 hover:bg-slate-750 text-indigo-300 px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            View 6 Students
                          </button>
                        </div>
                      </>
                    )
                  ) : activeSectionView === 'sec-9b' ? (
                    isAlgebraResolved ? (
                      <p className="text-sm text-indigo-200 leading-relaxed font-medium">
                        Algebra bracket expansion remediation succeeded for Section B! Mastery reached 85%.
                      </p>
                    ) : (
                      <>
                        <p className="text-sm text-indigo-200 leading-relaxed">
                          <strong>Section B Misconception:</strong> 7 students miss sign flips when expanding negative brackets (e.g., -3(2x - 5) written as -6x - 15 instead of +15).
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <button
                            id="ai-insight-create-practice-algebra-btn"
                            onClick={() => handleCreatePracticeDirect('gap-algebra')}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md transition-colors cursor-pointer"
                          >
                            Create Algebra Practice
                          </button>
                          <button
                            onClick={() => handleViewStudentsDirect('gap-algebra')}
                            className="bg-slate-800 border border-indigo-700/60 hover:bg-slate-750 text-indigo-300 px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            View 7 Students
                          </button>
                        </div>
                      </>
                    )
                  ) : (
                    <p className="text-sm text-indigo-200 leading-relaxed">
                      <strong>Cross-Section Finding:</strong> Section A excels in Geometry (88%) but needs Fractions help (42%). Section B excels in Fractions (84%) but needs Algebra sign expansion help (48%).
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Student Performance Dossiers & Quick Remediation (col-span-5) */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          {/* AI Student Performance Diagnostic Hub */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 shadow-sm p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-indigo-400" />
                  <span>Student Diagnostic Dossiers</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Click any student to view full AI performance summary & remediation plan
                </p>
              </div>
              <button
                onClick={() => setTeacherTab('students')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-bold cursor-pointer"
              >
                All {displayedStudents.length} →
              </button>
            </div>

            {/* Student List with Mastery & Quick AI Dossier Trigger */}
            <div className="space-y-2.5">
              {displayedStudents.slice(0, 6).map((student) => {
                const needsAttention = student.progressPct < 70;
                return (
                  <div
                    key={student.id}
                    onClick={() => setSelectedStudentModal(student)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                      needsAttention
                        ? 'bg-rose-950/20 border-rose-900/40 hover:bg-rose-950/30'
                        : 'bg-slate-800/40 border-slate-750 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm shrink-0">
                        {student.avatar}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-bold text-slate-200 truncate">{student.name}</span>
                          {needsAttention && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800">
                              Needs Help
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          Weak: {student.weakTopics.join(', ') || 'None identified'}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`text-xs font-extrabold ${
                          student.progressPct >= 80
                            ? 'text-emerald-400'
                            : student.progressPct >= 60
                            ? 'text-indigo-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {student.progressPct}%
                      </span>
                      <span className="text-[10px] text-slate-500 block">Mastery</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick AI Question Generator Trigger for struggling topic */}
            <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center space-x-1.5 text-indigo-300 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>AI Adaptive Practice Engine</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Generate questions automatically targeted at student struggling concepts with instant feedback.
              </p>
              <button
                onClick={() =>
                  handleCreateAIQuestionsDirect(
                    activeSectionView === 'sec-9b' ? 'Algebra' : 'Fractions',
                    activeSectionView === 'sec-9b'
                      ? 'Expanding negative brackets and distributing minus sign'
                      : 'Adding unlike fractions and finding least common denominators'
                  )
                }
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Adaptive AI Practice</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
