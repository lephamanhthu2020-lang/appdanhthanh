export type GradeLevel = 1 | 2 | 3 | 4 | 5;
export type SubjectType = 'math' | 'vietnamese';

export type CognitiveLevel = 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng nâng cao';

export type QuestionFormat = 
  | 'multiple_choice' 
  | 'fill_blank' 
  | 'matching' 
  | 'step_order' 
  | 'word_problem';

export interface QuestionErrorPattern {
  pattern: string; // e.g., "7" when 3*4, indicates adding instead of multiplying
  category: string; // "Nhầm phép nhân thành phép cộng"
  explanation: string;
  hint: string;
}

export interface QuestionItem {
  id: string;
  grade: GradeLevel;
  subject: SubjectType;
  topicId: string;
  prompt: string;
  format: QuestionFormat;
  options?: string[]; // for multiple choice
  correctAnswer: string;
  solutionExplanation: string;
  visualAid?: string; // emoji or visual illustration
  cognitiveLevel: CognitiveLevel;
  commonErrors?: QuestionErrorPattern[];
  // For matching type questions:
  matchingPairs?: { left: string; right: string }[];
  // For step ordering questions:
  steps?: string[];
  correctStepOrder?: number[];
  // Localized tag:
  isAnGiangContext?: boolean;
}

export interface LessonTopic {
  id: string;
  grade: GradeLevel;
  subject: SubjectType;
  title: string;
  weekRange: string;
  description: string;
  iconName: string;
  badgeColor: string;
  learningGoals: string[];
  questions: QuestionItem[];
  readingPassage?: {
    title: string;
    content: string;
    authorOrOrigin?: string;
    vocabularyNotes?: { word: string; meaning: string }[];
  };
  anGiangNote?: string;
}

export interface ErrorDiagnosis {
  errorCategory: string;
  explanation: string;
  pedagogicalHint: string;
  similarPracticeQuestion?: string;
  source: 'gemini' | 'rule_engine' | 'offline_heuristic';
}

export interface StudentProfile {
  id: string;
  displayName: string;
  grade: GradeLevel;
  school: string;
  avatarSeed: string;
  stars: number;
  streakDays: number;
  completedQuestionIds: string[];
  answeredRecords: {
    questionId: string;
    subject: SubjectType;
    topicId: string;
    isCorrect: boolean;
    timestamp: number;
    errorType?: string;
  }[];
}

export interface MasteryLevel {
  score: number; // 0 - 100
  label: 'Cần hỗ trợ thêm' | 'Đang hình thành' | 'Đạt mục tiêu luyện tập' | 'Vững vàng';
  color: string;
  bgLight: string;
}

export interface TopicCompetency {
  topicId: string;
  topicTitle: string;
  subject: SubjectType;
  grade: GradeLevel;
  totalAttempts: number;
  correctAnswers: number;
  masteryPercentage: number;
  masteryLevel: MasteryLevel;
  topError?: string;
  aiRecommendation: string;
}

export interface GeneratedWorksheet {
  id: string;
  title: string;
  grade: GradeLevel;
  subject: SubjectType;
  topic: string;
  difficulty: CognitiveLevel;
  createdAt: string;
  questions: {
    id: number;
    type: string;
    prompt: string;
    options?: string[];
    correctAnswer: string;
    explanation: string;
    commonErrorNote?: string;
  }[];
}

export interface SurveyClassData {
  id: string;
  className: string;
  grade: GradeLevel;
  studentCount: number;
  preTestAvg: number; // 0-10
  postTestAvg: number; // 0-10
  completionRate: number; // %
  topWeakness: string;
  teacherName: string;
}

export interface CompetitionEvidenceData {
  academicYear: string;
  schoolName: string;
  author: string;
  province: string;
  classesCount: number;
  totalStudents: number;
  totalPracticeSessions: number;
  preInterventionAvg: number; // e.g. 5.82
  postInterventionAvg: number; // e.g. 8.14
  completionRate: number; // e.g. 94.6%
  teacherPrepTimeSavedMinutes: number; // e.g. 45 min/day
  satisfactionRate: number; // e.g. 96.8%
  sampleClasses: SurveyClassData[];
  isDemoData: boolean;
}
