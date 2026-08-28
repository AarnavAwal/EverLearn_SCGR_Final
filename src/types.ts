export type Role = 'teacher' | 'student';

export type TeacherTab = 'dashboard' | 'classes' | 'students' | 'assessments' | 'gaps';
export type StudentTab = 'home' | 'practice' | 'assessments' | 'progress';

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar: string;
  classId: string;
  className: string;
  sectionId: string;
  sectionName: string;
  bio?: string;
  createdAt: string;
}

export interface StudentDeficiency {
  id: string;
  topic: string;
  concept: string;
  severity: 'critical' | 'moderate' | 'minor';
  errorPattern: string;
  errorFrequency: string; // e.g. "65% of fraction questions"
  misconceptionDetail: string;
  recommendedRemediation: string;
}

export interface StudentAssessmentSubmission {
  assessmentId: string;
  title: string;
  topic: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedDate: string;
  timeSpentMinutes: number;
  status: 'passed' | 'needs_remediation' | 'excellent';
  identifiedGaps: string[];
}

export interface WeeklyProgressPoint {
  day: string;
  masteryPct: number;
  pointsEarned: number;
  questionsSolved: number;
}

export interface StudentAIPerformanceReport {
  greeting: string;
  overallVerdict: string;
  masteryScore: number;
  keyStrengths: string[];
  focusAreas: string[];
  actionableTips: string[];
  encouragement: string;
  generatedAt?: string;
}

export interface TeacherAIPerformanceDossier {
  executiveSummary: string;
  strengths?: string[];
  criticalGaps?: string[];
  cognitiveMisconceptions?: string | string[];
  formativeAnalysis?: string;
  pedagogicalInterventions?: string[];
  recommendedInterventions?: string[];
  recommendedPacing?: string;
  readinessStatus?: string;
  nextMilestone?: string;
  generatedAt?: string;
}

export type TeacherAIStudentDossier = TeacherAIPerformanceDossier;

export interface Student {
  id: string;
  name: string;
  avatar: string;
  classId: string;
  className: string;
  sectionId: string;
  sectionName: string;
  points: number;
  rankInClass?: number;
  rankInSection?: number;
  streakDays: number;
  progressPct: number;
  strongTopics: string[];
  weakTopics: string[];
  fractionsMastery: number; // For demo before/after tracking
  algebraMastery: number;
  geometryMastery: number;
  statisticsMastery?: number;
  recentImprovement: number; // e.g. +12%
  assignedPracticeIds: string[];
  completedPracticeIds: string[];
  pointHistory: {
    id: string;
    reason: string;
    points: number;
    timestamp: string;
  }[];
  deficiencies?: StudentDeficiency[];
  assessmentSubmissions?: StudentAssessmentSubmission[];
  weeklyProgress?: WeeklyProgressPoint[];
  teacherPrivateNote?: string;
  aiStudentReport?: StudentAIPerformanceReport;
  aiTeacherDossier?: TeacherAIPerformanceDossier;
}

export interface TopicMastery {
  topic: string;
  mastery: number; // 0-100
  status: 'needs_support' | 'developing' | 'mastered';
  studentCount: number;
  gapSummary?: string;
}

export interface SectionData {
  id: string;
  name: string;
  classId: string;
  studentCount: number;
  avgMastery: number;
  gapsCount: number;
  needSupportCount: number;
  topics: TopicMastery[];
}

export interface ClassData {
  id: string;
  name: string; // e.g. "Class 9"
  sections: SectionData[];
  totalStudents: number;
  avgMastery: number;
  gapsCount: number;
  needSupportCount: number;
  topics: TopicMastery[];
}

export interface LearningGap {
  id: string;
  topic: string;
  classId: string;
  sectionId: string;
  mastery: number;
  strugglingCount: number;
  commonGapTitle: string;
  aiDetection: string;
  recommendedAction: string;
  status: 'active' | 'in_remediation' | 'resolved';
  beforeMastery: number;
  afterMastery?: number;
  improvementPct?: number;
  affectedStudentIds: string[];
  practiceGenerated?: boolean;
  practiceAssigned?: boolean;
}

export interface PracticeQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
}

export interface PracticeSet {
  id: string;
  gapId: string;
  topic: string;
  title: string;
  targetMisconception: string;
  questions: PracticeQuestion[];
  assignedSection: string;
  assignedStudentIds: string[];
  createdAt: string;
  isCompletedByAarav: boolean;
  scoreBefore: number;
  scoreAfter?: number;
}

export interface Assessment {
  id: string;
  title: string;
  topic: string;
  classId: string;
  sectionId: string;
  totalQuestions: number;
  avgScore: number;
  dueDate: string;
  status: 'active' | 'completed' | 'upcoming';
  questions: PracticeQuestion[];
  completedByStudentIds: string[];
}
