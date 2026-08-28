import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Users,
  AlertCircle,
  Target,
  Send,
  ArrowRight,
  TrendingDown,
} from 'lucide-react';

export const ViewStudentsModal: React.FC = () => {
  const {
    viewStudentsGapModal,
    setViewStudentsGapModal,
    students,
    setSelectedStudentModal,
    setPracticeStudioModal,
    generateTargetedPractice,
  } = useApp();

  if (!viewStudentsGapModal) return null;

  const affectedStudents = students.filter((s) =>
    viewStudentsGapModal.affectedStudentIds.includes(s.id) ||
    (viewStudentsGapModal.topic === 'Fractions' && s.fractionsMastery < 60)
  );

  const handleCreateAndAssign = async () => {
    const practice = await generateTargetedPractice(viewStudentsGapModal.id);
    setViewStudentsGapModal(null);
    setPracticeStudioModal({
      isOpen: true,
      gap: viewStudentsGapModal,
      practice,
    });
  };

  return (
    <div id="view-students-modal" className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-rose-950/70 border border-rose-800/60 text-rose-300 flex items-center justify-center font-bold text-sm">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-100">
                  {viewStudentsGapModal.topic} • Struggling Students
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-950/70 text-rose-300 font-bold border border-rose-800/60">
                  {affectedStudents.length} Students
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Identified in {viewStudentsGapModal.commonGapTitle}
              </p>
            </div>
          </div>
          <button
            onClick={() => setViewStudentsGapModal(null)}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student List */}
        <div className="p-5 overflow-y-auto space-y-2.5 flex-1">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider pb-1 flex items-center justify-between">
            <span>Student & Section</span>
            <span>Mastery & Error Pattern</span>
          </div>

          <div className="divide-y divide-slate-800">
            {affectedStudents.map((student) => {
              const isAarav = student.id === 's1';
              const topicMastery =
                viewStudentsGapModal.topic === 'Fractions'
                  ? student.fractionsMastery
                  : viewStudentsGapModal.topic === 'Algebra'
                  ? student.algebraMastery
                  : 45;

              return (
                <div
                  key={student.id}
                  id={`affected-student-row-${student.id}`}
                  onClick={() => {
                    setViewStudentsGapModal(null);
                    setSelectedStudentModal(student);
                  }}
                  className={`py-2.5 px-3 rounded-xl flex items-center justify-between hover:bg-slate-800/60 transition-colors cursor-pointer ${
                    isAarav ? 'bg-amber-950/20 border border-amber-800/60' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm border border-slate-700">
                      {student.avatar}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-100 flex items-center space-x-1.5">
                        <span>{student.name}</span>
                        {isAarav && (
                          <span className="text-[9px] px-1 bg-amber-900/60 text-amber-300 rounded font-bold border border-amber-700/60">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">{student.sectionName}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-rose-400 flex items-center justify-end space-x-1">
                      <TrendingDown className="w-3 h-3 text-rose-400" />
                      <span>{topicMastery}%</span>
                    </div>
                    <div className="text-[10px] text-slate-400">Added numerators directly</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-850 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Recommended: 5-Question targeted practice
          </span>
          <button
            id="modal-create-targeted-practice-btn"
            onClick={handleCreateAndAssign}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center space-x-2 transition-colors"
          >
            <Target className="w-3.5 h-3.5" />
            <span>Generate Practice for All {affectedStudents.length}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
