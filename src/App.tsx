import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { TeacherDashboard } from './components/TeacherDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { LearningGapsView } from './components/LearningGapsView';
import { ClassesView } from './components/ClassesView';
import { StudentsView } from './components/StudentsView';
import { AssessmentsView } from './components/AssessmentsView';
import { StudentPracticeView } from './components/StudentPracticeView';
import { StudentProgressView } from './components/StudentProgressView';
import { PracticeStudioModal } from './components/PracticeStudioModal';
import { ViewStudentsModal } from './components/ViewStudentsModal';
import { PracticePlayerModal } from './components/PracticePlayerModal';
import { QuizPlayerModal } from './components/QuizPlayerModal';
import { StudentProfileModal } from './components/StudentProfileModal';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';

const MainContent: React.FC = () => {
  const { role, teacherTab, studentTab } = useApp();

  const renderContent = () => {
    if (role === 'teacher') {
      switch (teacherTab) {
        case 'dashboard':
          return <TeacherDashboard />;
        case 'classes':
          return <ClassesView />;
        case 'gaps':
          return <LearningGapsView />;
        case 'assessments':
          return <AssessmentsView />;
        case 'students':
          return <StudentsView />;
        default:
          return <TeacherDashboard />;
      }
    } else {
      switch (studentTab) {
        case 'home':
          return <StudentDashboard />;
        case 'practice':
          return <StudentPracticeView />;
        case 'assessments':
          return <AssessmentsView />;
        case 'progress':
          return <StudentProgressView />;
        default:
          return <StudentDashboard />;
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100 antialiased selection:bg-indigo-600 selection:text-white">
      <Navbar />

      <div className="flex-1 flex w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar />

        <main className="flex-1 min-w-0">
          <div className="min-h-[calc(100vh-140px)]">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Global Modals */}
      <PracticeStudioModal />
      <ViewStudentsModal />
      <PracticePlayerModal />
      <QuizPlayerModal />
      <StudentProfileModal />
      <AuthModal />
      <UserProfileModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-600 selection:text-white">
        <MainContent />
      </div>
    </AppProvider>
  );
}

export default App;
