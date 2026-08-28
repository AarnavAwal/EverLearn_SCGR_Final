import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Role,
  Student,
  ClassData,
  LearningGap,
  PracticeSet,
  Assessment,
  PracticeQuestion,
  UserAccount,
  TeacherTab,
  StudentTab,
  StudentAIPerformanceReport,
  TeacherAIPerformanceDossier,
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_CLASSES,
  INITIAL_GAPS,
  INITIAL_PRACTICES,
  INITIAL_ASSESSMENTS,
  INITIAL_PRACTICE_QUESTIONS,
  INITIAL_ALGEBRA_QUESTIONS,
} from '../data/initialData';

export const INITIAL_USER_ACCOUNTS: UserAccount[] = [
  {
    id: 's1',
    email: 'aarav.sharma@greenwood.edu',
    name: 'Aarav Sharma',
    role: 'student',
    avatar: '👦',
    classId: 'c9',
    className: 'Class 9',
    sectionId: 'sec-9a',
    sectionName: 'Section A',
    bio: 'Grade 9 student passionate about Geometry & Robotics. Working on improving Fractions!',
    createdAt: 'Joined August 2026',
  },
  {
    id: 't1',
    email: 'anita.sharma@greenwood.edu',
    name: 'Mrs. Anita Sharma',
    role: 'teacher',
    avatar: '👩‍🏫',
    classId: 'c9',
    className: 'Class 9',
    sectionId: 'sec-9a',
    sectionName: 'Section A',
    bio: 'Head of Mathematics Department • Greenwood High • Classes 9A, 9B, 8A',
    createdAt: 'Joined July 2024',
  },
  {
    id: 's5',
    email: 'ananya.roy@greenwood.edu',
    name: 'Ananya Roy',
    role: 'student',
    avatar: '👩',
    classId: 'c9',
    className: 'Class 9',
    sectionId: 'sec-9b',
    sectionName: 'Section B',
    bio: 'Grade 9 student in Section B • Top mastery in Fractions, working on Algebra!',
    createdAt: 'Joined August 2026',
  },
];

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  teacherTab: TeacherTab;
  setTeacherTab: (tab: TeacherTab) => void;
  studentTab: StudentTab;
  setStudentTab: (tab: StudentTab) => void;
  
  selectedClassId: string;
  setSelectedClassId: (id: string) => void;
  selectedSectionId: string;
  setSelectedSectionId: (id: string) => void;
  
  // User Profile & Authentication
  currentUser: UserAccount;
  userAccounts: UserAccount[];
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup';
  setAuthModalMode: (mode: 'login' | 'signup') => void;
  isUserProfileModalOpen: boolean;
  setIsUserProfileModalOpen: (open: boolean) => void;
  loginWithEmail: (email: string, password?: string) => boolean;
  loginAsAccount: (account: UserAccount) => void;
  createProfile: (data: {
    name: string;
    email: string;
    role: Role;
    classId: string;
    sectionId: string;
    avatar: string;
    bio?: string;
  }) => UserAccount;
  updateCurrentProfile: (data: Partial<UserAccount>) => void;
  logout: () => void;

  students: Student[];
  currentStudent: Student;
  classes: ClassData[];
  currentClass: ClassData;
  gaps: LearningGap[];
  practices: PracticeSet[];
  assessments: Assessment[];
  
  // Modals & Active flows
  selectedStudentModal: Student | null;
  setSelectedStudentModal: (student: Student | null) => void;
  
  viewStudentsGapModal: LearningGap | null;
  setViewStudentsGapModal: (gap: LearningGap | null) => void;
  
  practiceStudioModal: {
    isOpen: boolean;
    gap: LearningGap | null;
    practice: PracticeSet | null;
  };
  setPracticeStudioModal: (state: { isOpen: boolean; gap: LearningGap | null; practice: PracticeSet | null }) => void;
  
  activePracticePlayer: PracticeSet | null;
  setActivePracticePlayer: (practice: PracticeSet | null) => void;

  activeQuizPlayer: Assessment | null;
  setActiveQuizPlayer: (quiz: Assessment | null) => void;

  isCreateQuizModalOpen: boolean;
  setIsCreateQuizModalOpen: (open: boolean) => void;
  
  toast: { message: string; type: 'success' | 'info' | 'reward' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'reward') => void;

  // Actions
  generateTargetedPractice: (gapId: string) => Promise<PracticeSet>;
  saveEditedPractice: (practice: PracticeSet) => void;
  assignPracticeToSection: (practiceId: string, sectionName: string) => void;
  completePractice: (
    practiceId: string,
    scorePct: number,
    correctCount: number,
    totalCount: number
  ) => {
    before: number;
    after: number;
    improvement: number;
    pointsEarned: number;
    correctCount: number;
    totalCount: number;
    scorePct: number;
  };
  createQuiz: (quiz: Omit<Assessment, 'id' | 'completedByStudentIds'>) => void;
  completeQuiz: (quizId: string, scorePct: number) => void;
  updateStudentTeacherNote: (studentId: string, note: string) => void;
  assignDirectStudentRemediation: (studentId: string, topic: string) => void;
  resetDemoData: () => void;

  // AI Summaries & Question Generation
  fetchStudentAISummary: (studentId?: string) => Promise<StudentAIPerformanceReport>;
  fetchTeacherAIDossier: (studentId: string) => Promise<TeacherAIPerformanceDossier>;
  generateAIQuestionsForStrugglingTopic: (
    topic: string,
    strugglingConcept: string,
    count?: number
  ) => Promise<PracticeSet>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('edupulse_user_accounts');
    return saved ? JSON.parse(saved) : INITIAL_USER_ACCOUNTS;
  });

  const [currentUser, setCurrentUser] = useState<UserAccount>(() => {
    const saved = localStorage.getItem('edupulse_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USER_ACCOUNTS[0]; // Default Aarav Sharma
  });

  const [role, setRoleState] = useState<Role>(currentUser.role || 'student');
  const [teacherTab, setTeacherTab] = useState<TeacherTab>('dashboard');
  const [studentTab, setStudentTab] = useState<StudentTab>('home');

  const [selectedClassId, setSelectedClassIdState] = useState<string>('c9');
  const [selectedSectionId, setSelectedSectionId] = useState<string>('sec-9a');

  // Auth & Profile Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('edupulse_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [classes, setClasses] = useState<ClassData[]>(() => {
    const saved = localStorage.getItem('edupulse_classes');
    return saved ? JSON.parse(saved) : INITIAL_CLASSES;
  });

  const [gaps, setGaps] = useState<LearningGap[]>(() => {
    const saved = localStorage.getItem('edupulse_gaps');
    return saved ? JSON.parse(saved) : INITIAL_GAPS;
  });

  const [practices, setPractices] = useState<PracticeSet[]>(() => {
    const saved = localStorage.getItem('edupulse_practices');
    return saved ? JSON.parse(saved) : INITIAL_PRACTICES;
  });

  const [assessments, setAssessments] = useState<Assessment[]>(() => {
    const saved = localStorage.getItem('edupulse_assessments');
    return saved ? JSON.parse(saved) : INITIAL_ASSESSMENTS;
  });

  const [selectedStudentModal, setSelectedStudentModal] = useState<Student | null>(null);
  const [viewStudentsGapModal, setViewStudentsGapModal] = useState<LearningGap | null>(null);
  const [practiceStudioModal, setPracticeStudioModal] = useState<{
    isOpen: boolean;
    gap: LearningGap | null;
    practice: PracticeSet | null;
  }>({
    isOpen: false,
    gap: null,
    practice: null,
  });

  const [activePracticePlayer, setActivePracticePlayer] = useState<PracticeSet | null>(null);
  const [activeQuizPlayer, setActiveQuizPlayer] = useState<Assessment | null>(null);
  const [isCreateQuizModalOpen, setIsCreateQuizModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'reward' } | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('edupulse_user_accounts', JSON.stringify(userAccounts));
  }, [userAccounts]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('edupulse_current_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('edupulse_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('edupulse_gaps', JSON.stringify(gaps));
  }, [gaps]);

  useEffect(() => {
    localStorage.setItem('edupulse_practices', JSON.stringify(practices));
  }, [practices]);

  useEffect(() => {
    localStorage.setItem('edupulse_classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('edupulse_assessments', JSON.stringify(assessments));
  }, [assessments]);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    if (currentUser && currentUser.role !== newRole) {
      const matchingAccount = userAccounts.find((a) => a.role === newRole);
      if (matchingAccount) {
        setCurrentUser(matchingAccount);
      } else {
        const updated = { ...currentUser, role: newRole };
        setCurrentUser(updated);
      }
    }
  };

  const setSelectedClassId = (newClassId: string) => {
    setSelectedClassIdState(newClassId);
    const targetClass = classes.find((c) => c.id === newClassId);
    if (targetClass && targetClass.sections.length > 0) {
      const hasSection = targetClass.sections.some((s) => s.id === selectedSectionId);
      if (!hasSection && selectedSectionId !== 'all') {
        setSelectedSectionId(targetClass.sections[0].id);
      }
    }
  };

  const showToast = (message: string, type: 'success' | 'info' | 'reward' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  // Auth methods
  const loginAsAccount = (account: UserAccount) => {
    setCurrentUser(account);
    setRoleState(account.role);
    setSelectedClassIdState(account.classId);
    setSelectedSectionId(account.sectionId);
    showToast(`Logged in as ${account.name} (${account.email})`, 'success');
  };

  const loginWithEmail = (email: string, _password?: string): boolean => {
    const existing = userAccounts.find(
      (a) => a.email.toLowerCase() === email.toLowerCase()
    );
    if (existing) {
      loginAsAccount(existing);
      return true;
    }
    const nameFromEmail = email.split('@')[0].replace(/[._-]/g, ' ');
    const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
    const newAcc = createProfile({
      name: formattedName,
      email,
      role: 'student',
      classId: 'c9',
      sectionId: 'sec-9a',
      avatar: '👦',
      bio: `Student at Greenwood High`,
    });
    loginAsAccount(newAcc);
    return true;
  };

  const createProfile = (data: {
    name: string;
    email: string;
    role: Role;
    classId: string;
    sectionId: string;
    avatar: string;
    bio?: string;
  }): UserAccount => {
    const targetClass = classes.find((c) => c.id === data.classId) || classes[0];
    const targetSection =
      targetClass.sections.find((s) => s.id === data.sectionId) || targetClass.sections[0];

    const newId = `user-${Date.now()}`;
    const newAccount: UserAccount = {
      id: newId,
      email: data.email,
      name: data.name,
      role: data.role,
      avatar: data.avatar,
      classId: targetClass.id,
      className: targetClass.name,
      sectionId: targetSection.id,
      sectionName: targetSection.name,
      bio: data.bio || `${data.role === 'teacher' ? 'Teacher' : 'Student'} Profile`,
      createdAt: 'Joined today',
    };

    setUserAccounts((prev) => [newAccount, ...prev.filter((a) => a.email.toLowerCase() !== data.email.toLowerCase())]);
    setCurrentUser(newAccount);
    setRoleState(data.role);
    setSelectedClassIdState(data.classId);
    setSelectedSectionId(data.sectionId);

    if (data.role === 'student') {
      const newStudent: Student = {
        id: newId,
        name: `${data.name} (You)`,
        avatar: data.avatar,
        classId: targetClass.id,
        className: targetClass.name,
        sectionId: targetSection.id,
        sectionName: targetSection.name,
        points: 850,
        streakDays: 5,
        progressPct: 78,
        strongTopics: ['Geometry', 'Statistics'],
        weakTopics: ['Fractions'],
        fractionsMastery: 42,
        algebraMastery: 84,
        geometryMastery: 92,
        recentImprovement: 12,
        assignedPracticeIds: ['prac-fractions-1'],
        completedPracticeIds: [],
        pointHistory: [
          { id: `ph-${Date.now()}`, reason: 'Profile Created & Active', points: 50, timestamp: 'Today' },
        ],
      };
      setStudents((prev) => [newStudent, ...prev.filter((s) => s.id !== newId)]);
    }

    showToast(`Welcome, ${newAccount.name}! Profile created successfully.`, 'reward');
    return newAccount;
  };

  const updateCurrentProfile = (data: Partial<UserAccount>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setUserAccounts((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));

    if (updated.role === 'student') {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === updated.id || s.id === 's1'
            ? {
                ...s,
                name: updated.name.includes('(You)') ? updated.name : `${updated.name} (You)`,
                avatar: updated.avatar,
              }
            : s
        )
      );
    }
    showToast('Profile updated successfully!', 'success');
  };

  const logout = () => {
    setIsUserProfileModalOpen(false);
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
    showToast('Logged out. Please choose an account or sign in.', 'info');
  };

  // Find active student linked to currentUser
  const currentStudent =
    students.find((s) => s.id === currentUser?.id) ||
    students.find((s) => s.name.includes(currentUser?.name || 'Aarav')) ||
    students.find((s) => s.id === 's1') ||
    students[0];

  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];

  // AI Practice Generation action
  const generateTargetedPractice = async (gapId: string): Promise<PracticeSet> => {
    const targetGap = gaps.find((g) => g.id === gapId) || gaps[0];
    
    let generatedQuestions: PracticeQuestion[] = [];
    try {
      const res = await fetch('/api/ai/generate-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: targetGap.topic,
          gap: targetGap.commonGapTitle,
          grade: 'Class 9',
          count: 5,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.questions && data.questions.length > 0) {
          generatedQuestions = data.questions;
        }
      }
    } catch (e) {
      console.warn('API error, using initial practice questions', e);
    }

    if (generatedQuestions.length === 0) {
      generatedQuestions = targetGap.topic === 'Algebra' ? INITIAL_ALGEBRA_QUESTIONS : INITIAL_PRACTICE_QUESTIONS;
    }

    const newPracticeSet: PracticeSet = {
      id: `prac-${targetGap.topic.toLowerCase()}-${Date.now()}`,
      gapId: targetGap.id,
      topic: targetGap.topic,
      title: `Targeted Remediation: ${targetGap.commonGapTitle}`,
      targetMisconception: targetGap.aiDetection,
      questions: generatedQuestions,
      assignedSection: 'Section A',
      assignedStudentIds: targetGap.affectedStudentIds,
      createdAt: 'Just now',
      isCompletedByAarav: false,
      scoreBefore: targetGap.mastery,
    };

    setPractices((prev) => {
      const existing = prev.filter((p) => p.gapId !== targetGap.id);
      return [newPracticeSet, ...existing];
    });

    setGaps((prev) =>
      prev.map((g) =>
        g.id === gapId
          ? { ...g, practiceGenerated: true, status: 'in_remediation' }
          : g
      )
    );

    return newPracticeSet;
  };

  const saveEditedPractice = (updatedPractice: PracticeSet) => {
    setPractices((prev) =>
      prev.map((p) => (p.id === updatedPractice.id ? updatedPractice : p))
    );
    showToast('Practice set updated successfully.', 'info');
  };

  const assignPracticeToSection = (practiceId: string, sectionName: string) => {
    const practice = practices.find((p) => p.id === practiceId);
    if (!practice) return;

    setPractices((prev) =>
      prev.map((p) =>
        p.id === practiceId
          ? { ...p, assignedSection: sectionName }
          : p
      )
    );

    setGaps((prev) =>
      prev.map((g) =>
        g.id === practice.gapId
          ? { ...g, practiceAssigned: true, status: 'in_remediation' }
          : g
      )
    );

    setStudents((prev) =>
      prev.map((s) => {
        if (practice.assignedStudentIds.includes(s.id)) {
          const ids = s.assignedPracticeIds.includes(practiceId)
            ? s.assignedPracticeIds
            : [...s.assignedPracticeIds, practiceId];
          return { ...s, assignedPracticeIds: ids };
        }
        return s;
      })
    );

    showToast(`Targeted practice assigned to ${sectionName} (${practice.assignedStudentIds.length} students)`, 'success');
  };

  // Real Dynamic Practice Scoring System
  const completePractice = (
    practiceId: string,
    scorePct: number,
    correctCount: number,
    totalCount: number
  ) => {
    const practice = practices.find((p) => p.id === practiceId) || practices[0];
    const topicName = practice.topic || 'Fractions';

    // Get current mastery before attempt
    let beforeScore = 42;
    if (topicName.toLowerCase().includes('fraction')) {
      beforeScore = currentStudent.fractionsMastery || 42;
    } else if (topicName.toLowerCase().includes('algebra')) {
      beforeScore = currentStudent.algebraMastery || 84;
    } else if (topicName.toLowerCase().includes('geometry')) {
      beforeScore = currentStudent.geometryMastery || 92;
    } else if (topicName.toLowerCase().includes('statistic')) {
      beforeScore = currentStudent.statisticsMastery || 88;
    } else {
      beforeScore = practice.scoreBefore || 50;
    }

    // Mathematically calculate dynamic afterScore based on actual student performance
    // Weighted formula: 40% prior mastery + 60% session score
    let afterScore: number;
    if (scorePct === 100) {
      afterScore = Math.min(100, Math.round(beforeScore * 0.35 + 100 * 0.65));
    } else if (scorePct === 0) {
      // If student got everything wrong, mastery drops or stays low
      afterScore = Math.max(12, Math.round(beforeScore * 0.65 + 0 * 0.35));
    } else {
      afterScore = Math.max(10, Math.min(100, Math.round(beforeScore * 0.4 + scorePct * 0.6)));
    }

    const improvement = afterScore - beforeScore;
    // Points earned strictly based on correct answers!
    const pointsEarned = correctCount * 10 + (scorePct >= 80 ? 15 : scorePct >= 50 ? 5 : 0);

    // Update Practice
    setPractices((prev) =>
      prev.map((p) =>
        p.id === practiceId
          ? {
              ...p,
              isCompletedByAarav: true,
              scoreAfter: afterScore,
            }
          : p
      )
    );

    // Update Gap in Teacher Dashboard if mastered or progressing
    setGaps((prev) =>
      prev.map((g) =>
        g.id === practice.gapId || g.topic === practice.topic
          ? {
              ...g,
              afterMastery: afterScore,
              mastery: afterScore,
              improvementPct: improvement,
              status: afterScore >= 75 ? 'resolved' : 'in_remediation',
              strugglingCount: afterScore >= 75 ? Math.max(0, g.strugglingCount - 8) : g.strugglingCount,
            }
          : g
      )
    );

    // Update Class Topic Mastery
    setClasses((prev) =>
      prev.map((c) => {
        if (c.id === 'c9') {
          const updatedTopics = c.topics.map((t) =>
            t.topic === practice.topic
              ? {
                  ...t,
                  mastery: afterScore,
                  status: (afterScore >= 80 ? 'mastered' : 'developing') as 'mastered' | 'developing',
                }
              : t
          );
          const totalM = updatedTopics.reduce((acc, t) => acc + t.mastery, 0) / updatedTopics.length;
          return {
            ...c,
            topics: updatedTopics,
            avgMastery: Math.round(totalM),
            gapsCount: afterScore >= 75 ? Math.max(1, c.gapsCount - 1) : c.gapsCount,
            needSupportCount: afterScore >= 75 ? Math.max(2, c.needSupportCount - 4) : c.needSupportCount,
          };
        }
        return c;
      })
    );

    // Update Student State
    setStudents((prev) => {
      return prev.map((s) => {
        if (s.id === currentStudent.id || s.id === 's1') {
          const newPoints = s.points + pointsEarned;
          const newStreak = s.streakDays + (pointsEarned > 0 ? 1 : 0);

          let updatedWeak = [...s.weakTopics];
          let updatedStrong = [...s.strongTopics];

          if (afterScore >= 75) {
            updatedWeak = updatedWeak.filter((w) => w !== practice.topic);
            if (!updatedStrong.includes(practice.topic)) {
              updatedStrong.push(practice.topic);
            }
          } else if (afterScore < 55) {
            if (!updatedWeak.includes(practice.topic)) {
              updatedWeak.push(practice.topic);
            }
            updatedStrong = updatedStrong.filter((st) => st !== practice.topic);
          }

          const pointItem = {
            id: `ph-${Date.now()}`,
            reason: `${practice.topic} Practice: ${correctCount}/${totalCount} (${scorePct}%)`,
            points: pointsEarned,
            timestamp: 'Just now',
          };

          return {
            ...s,
            points: newPoints,
            streakDays: newStreak,
            fractionsMastery: topicName.toLowerCase().includes('fraction') ? afterScore : s.fractionsMastery,
            algebraMastery: topicName.toLowerCase().includes('algebra') ? afterScore : s.algebraMastery,
            geometryMastery: topicName.toLowerCase().includes('geometry') ? afterScore : s.geometryMastery,
            statisticsMastery: topicName.toLowerCase().includes('statistic') ? afterScore : s.statisticsMastery,
            progressPct: Math.max(10, Math.min(98, Math.round((s.progressPct * 3 + afterScore) / 4))),
            recentImprovement: improvement,
            weakTopics: updatedWeak,
            strongTopics: updatedStrong,
            completedPracticeIds: s.completedPracticeIds.includes(practiceId)
              ? s.completedPracticeIds
              : [...s.completedPracticeIds, practiceId],
            pointHistory: pointsEarned > 0 ? [pointItem, ...s.pointHistory] : s.pointHistory,
          };
        }
        return s;
      });
    });

    if (improvement > 0) {
      showToast(`+${pointsEarned} Points! Score: ${correctCount}/${totalCount} (${scorePct}%). Mastery rose to ${afterScore}%.`, 'reward');
    } else if (improvement < 0) {
      showToast(`Score: ${correctCount}/${totalCount} (${scorePct}%). Review explanations to master this concept.`, 'info');
    } else {
      showToast(`Score: ${correctCount}/${totalCount} (${scorePct}%). Practice completed.`, 'info');
    }

    return {
      before: beforeScore,
      after: afterScore,
      improvement,
      pointsEarned,
      correctCount,
      totalCount,
      scorePct,
    };
  };

  const createQuiz = (newQuizData: Omit<Assessment, 'id' | 'completedByStudentIds'>) => {
    const newQuiz: Assessment = {
      ...newQuizData,
      id: `as-${Date.now()}`,
      completedByStudentIds: [],
    };
    setAssessments((prev) => [newQuiz, ...prev]);
    showToast(`Quiz "${newQuiz.title}" created and scheduled.`, 'success');
  };

  const completeQuiz = (quizId: string, scorePct: number) => {
    setAssessments((prev) =>
      prev.map((a) =>
        a.id === quizId
          ? {
              ...a,
              completedByStudentIds: [...a.completedByStudentIds, currentStudent.id],
            }
          : a
      )
    );

    const pointsEarned = Math.round(scorePct / 4);
    setStudents((prev) => {
      return prev.map((s) => {
        if (s.id === currentStudent.id || s.id === 's1') {
          return {
            ...s,
            points: s.points + pointsEarned,
            progressPct: Math.min(98, Math.round((s.progressPct * 2 + scorePct) / 3)),
            pointHistory: [
              {
                id: `ph-${Date.now()}`,
                reason: `Quiz Completed (${scorePct}%)`,
                points: pointsEarned,
                timestamp: 'Just now',
              },
              ...s.pointHistory,
            ],
          };
        }
        return s;
      });
    });

    showToast(`Quiz completed with ${scorePct}%! +${pointsEarned} Points earned.`, 'reward');
  };

  const updateStudentTeacherNote = (studentId: string, note: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, teacherPrivateNote: note } : s))
    );
    if (selectedStudentModal && selectedStudentModal.id === studentId) {
      setSelectedStudentModal((prev) => (prev ? { ...prev, teacherPrivateNote: note } : null));
    }
    showToast('Teacher diagnostic note saved.', 'info');
  };

  const assignDirectStudentRemediation = (studentId: string, topic: string) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    const newPracId = `prac-custom-${Date.now()}`;
    const customPractice: PracticeSet = {
      id: newPracId,
      gapId: 'gap-custom',
      topic,
      title: `1-on-1 Remediation: ${topic} Fundamentals`,
      targetMisconception: `Targeted practice for ${student.name} based on diagnostic deficiency analysis.`,
      questions: topic === 'Algebra' ? INITIAL_ALGEBRA_QUESTIONS : INITIAL_PRACTICE_QUESTIONS,
      assignedSection: student.sectionName,
      assignedStudentIds: [studentId],
      createdAt: 'Just now',
      isCompletedByAarav: false,
      scoreBefore: 45,
    };

    setPractices((prev) => [customPractice, ...prev]);

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const ids = s.assignedPracticeIds.includes(newPracId)
            ? s.assignedPracticeIds
            : [...s.assignedPracticeIds, newPracId];
          return { ...s, assignedPracticeIds: ids };
        }
        return s;
      })
    );

    showToast(`Remediation drill "${customPractice.title}" assigned directly to ${student.name}.`, 'success');
  };

  // AI Performance Summary Generator for Student
  const fetchStudentAISummary = async (studentId?: string): Promise<StudentAIPerformanceReport> => {
    const target = students.find((s) => s.id === (studentId || currentStudent.id)) || currentStudent;
    try {
      const res = await fetch('/api/ai/summarize-performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: target.name.replace(' (You)', ''),
          targetAudience: 'student',
          grade: target.className || 'Class 9',
          section: target.sectionName || 'Section A',
          overallMastery: target.progressPct || 78,
          streakDays: target.streakDays || 5,
          points: target.points || 385,
          strongTopics: target.strongTopics || ['Geometry', 'Algebra'],
          weakTopics: target.weakTopics || ['Fractions'],
          topicMasteries: {
            Geometry: target.geometryMastery || 92,
            Algebra: target.algebraMastery || 84,
            Statistics: target.statisticsMastery || 88,
            Fractions: target.fractionsMastery || 42,
          },
          recentImprovement: target.recentImprovement || 12,
          deficiencies: target.deficiencies || [],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.report) {
          const report: StudentAIPerformanceReport = {
            ...data.report,
            generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          // Cache in student state
          setStudents((prev) =>
            prev.map((s) => (s.id === target.id ? { ...s, aiStudentReport: report } : s))
          );
          return report;
        }
      }
    } catch (e) {
      console.warn('AI summary fetch failed, using fallback', e);
    }

    const fallback: StudentAIPerformanceReport = {
      greeting: `Hey ${target.name.replace(' (You)', '')}! Here is your personalized learning overview 🚀`,
      overallVerdict: `You're demonstrating strong grasp in ${target.strongTopics.join(' and ')}, with a prime opportunity to master ${target.weakTopics[0] || 'Fractions'}.`,
      masteryScore: target.progressPct || 78,
      keyStrengths: [
        `High proficiency in ${target.strongTopics[0] || 'Geometry'} (${target.geometryMastery || 92}% mastery)`,
        `Consistent equation solving in ${target.strongTopics[1] || 'Algebra'} (${target.algebraMastery || 84}% mastery)`,
      ],
      focusAreas: [
        `Adding & subtracting fractions with different denominators (like 1/3 + 1/4)`,
      ],
      actionableTips: [
        'Always find the Least Common Denominator (LCD) before adding tops.',
        'Use visual fraction models when checking sizes.',
        'Complete 5 minutes of practice daily to keep your active learning streak.',
      ],
      encouragement: "Keep going! You're making measurable progress every time you practice.",
      generatedAt: 'Just now',
    };

    return fallback;
  };

  // AI Performance Summary Generator for Teacher
  const fetchTeacherAIDossier = async (studentId: string): Promise<TeacherAIPerformanceDossier> => {
    const target = students.find((s) => s.id === studentId) || students[0];
    try {
      const res = await fetch('/api/ai/summarize-performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: target.name.replace(' (You)', ''),
          targetAudience: 'teacher',
          grade: target.className || 'Class 9',
          section: target.sectionName || 'Section A',
          overallMastery: target.progressPct || 78,
          streakDays: target.streakDays || 5,
          points: target.points || 385,
          strongTopics: target.strongTopics || ['Geometry', 'Algebra'],
          weakTopics: target.weakTopics || ['Fractions'],
          topicMasteries: {
            Geometry: target.geometryMastery || 92,
            Algebra: target.algebraMastery || 84,
            Statistics: target.statisticsMastery || 88,
            Fractions: target.fractionsMastery || 42,
          },
          recentImprovement: target.recentImprovement || 12,
          deficiencies: target.deficiencies || [],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.report) {
          const dossier: TeacherAIPerformanceDossier = {
            ...data.report,
            generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setStudents((prev) =>
            prev.map((s) => (s.id === target.id ? { ...s, aiTeacherDossier: dossier } : s))
          );
          return dossier;
        }
      }
    } catch (e) {
      console.warn('Teacher AI dossier fetch failed, using fallback', e);
    }

    const fallbackDossier: TeacherAIPerformanceDossier = {
      executiveSummary: `${target.name} displays strong spatial intuition and foundational algebraic fluency (${target.geometryMastery || 92}% in Geometry, ${target.algebraMastery || 84}% in Algebra), with a specific procedural learning gap in Fractional operations (${target.fractionsMastery || 42}%).`,
      cognitiveMisconceptions: [
        'Direct summation misconception: adds numerators and denominators straight across without LCM reduction.',
        'Under-utilization of visual fraction bar models during multi-step fractions.',
      ],
      formativeAnalysis: `High accuracy on geometric theorems and algebraic expansions; significant latency and errors on rational fraction addition.`,
      recommendedInterventions: [
        'Deploy 5-minute targeted drills emphasizing common denominator equivalence.',
        'Reinforce fraction strips or area models in small group instruction.',
        'Pair with peer tutoring on rational arithmetic simplification.',
      ],
      readinessStatus: 'Ready for advanced units upon completing targeted fractions remediation.',
      nextMilestone: 'Achieve 80%+ on Fractions Remediation Drill',
      generatedAt: 'Just now',
    };

    return fallbackDossier;
  };

  // AI Question Generator for Any Struggling Topic
  const generateAIQuestionsForStrugglingTopic = async (
    topic: string,
    strugglingConcept: string,
    count: number = 5
  ): Promise<PracticeSet> => {
    let generatedQuestions: PracticeQuestion[] = [];
    try {
      const res = await fetch('/api/ai/generate-struggling-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          strugglingConcepts: strugglingConcept,
          grade: 'Class 9',
          count,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.questions && data.questions.length > 0) {
          generatedQuestions = data.questions;
        }
      }
    } catch (err) {
      console.warn('AI question generator error, fallback to curated questions', err);
    }

    if (generatedQuestions.length === 0) {
      generatedQuestions = topic === 'Algebra' ? INITIAL_ALGEBRA_QUESTIONS : INITIAL_PRACTICE_QUESTIONS;
    }

    const newPractice: PracticeSet = {
      id: `prac-ai-${topic.toLowerCase()}-${Date.now()}`,
      gapId: `gap-${topic.toLowerCase()}`,
      topic,
      title: `AI Targeted Practice: ${topic}`,
      targetMisconception: strugglingConcept || `Custom AI remediation on ${topic}`,
      questions: generatedQuestions,
      assignedSection: currentStudent.sectionName,
      assignedStudentIds: [currentStudent.id],
      createdAt: 'Just now',
      isCompletedByAarav: false,
      scoreBefore: topic === 'Fractions' ? currentStudent.fractionsMastery : 50,
    };

    setPractices((prev) => [newPractice, ...prev]);
    showToast(`✨ Generated ${generatedQuestions.length} custom AI questions for ${topic}!`, 'success');
    return newPractice;
  };

  const resetDemoData = () => {
    localStorage.removeItem('edupulse_students');
    localStorage.removeItem('edupulse_gaps');
    localStorage.removeItem('edupulse_practices');
    localStorage.removeItem('edupulse_classes');
    localStorage.removeItem('edupulse_assessments');
    setStudents(INITIAL_STUDENTS);
    setClasses(INITIAL_CLASSES);
    setGaps(INITIAL_GAPS);
    setPractices(INITIAL_PRACTICES);
    setAssessments(INITIAL_ASSESSMENTS);
    setRole('teacher');
    setTeacherTab('dashboard');
    setStudentTab('home');
    showToast('Demo data reset to initial state.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        teacherTab,
        setTeacherTab,
        studentTab,
        setStudentTab,
        selectedClassId,
        setSelectedClassId,
        selectedSectionId,
        setSelectedSectionId,
        currentUser,
        userAccounts,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        isUserProfileModalOpen,
        setIsUserProfileModalOpen,
        loginWithEmail,
        loginAsAccount,
        createProfile,
        updateCurrentProfile,
        logout,
        students,
        currentStudent,
        classes,
        currentClass,
        gaps,
        practices,
        assessments,
        selectedStudentModal,
        setSelectedStudentModal,
        viewStudentsGapModal,
        setViewStudentsGapModal,
        practiceStudioModal,
        setPracticeStudioModal,
        activePracticePlayer,
        setActivePracticePlayer,
        activeQuizPlayer,
        setActiveQuizPlayer,
        isCreateQuizModalOpen,
        setIsCreateQuizModalOpen,
        toast,
        showToast,
        generateTargetedPractice,
        saveEditedPractice,
        assignPracticeToSection,
        completePractice,
        createQuiz,
        completeQuiz,
        updateStudentTeacherNote,
        assignDirectStudentRemediation,
        resetDemoData,
        fetchStudentAISummary,
        fetchTeacherAIDossier,
        generateAIQuestionsForStrugglingTopic,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
