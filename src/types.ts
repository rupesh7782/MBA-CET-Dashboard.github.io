export type Subject = 'VARC' | 'LRDI' | 'AR' | 'QUANT';

export type GoalPeriod = 'Daily' | 'Weekly' | 'Monthly';

export type FormulaCategory = 
  | 'Arithmetic' 
  | 'Algebra' 
  | 'Geometry' 
  | 'Modern Maths' 
  | 'Data Interpretation' 
  | 'Shortcuts';

export type ReadingCategory = 
  | 'Newspapers' 
  | 'Current Affairs' 
  | 'Articles' 
  | 'Editorials' 
  | 'Journals'
  | 'Books';

export type VaultCategory = 
  | 'Certificates' 
  | 'Resume' 
  | 'Important PDFs' 
  | 'Passwords' 
  | 'Private Notes';

export interface ExamConfig {
  examName: string;
  examDate: string; // YYYY-MM-DD
  targetScore: number;
  targetPercentile: number;
  dailyStudyGoalHours: number;
  dailyQuestionsGoal: number;
  streakResetDate?: string; // YYYY-MM-DD
  currentStreakDays?: number;
}

export interface MockTest {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  time?: string;
  varcScore: number;
  varcAttempted?: number;
  lrdiScore: number;
  lrdiAttempted?: number;
  arScore: number;
  arAttempted?: number;
  quantScore: number;
  quantAttempted?: number;
  totalScore: number;
  totalAttempted?: number;
  maxScore: number;
  percentile: number;
  timeTakenMinutes: number;
  accuracy: number;
  remarks: string;
  status: 'Completed' | 'Upcoming' | 'Scheduled';
}

export interface SectionalTest {
  id: string;
  name: string;
  subject: Subject;
  date: string;
  score: number;
  attempted?: number;
  maxScore: number;
  timeTakenMinutes: number;
  accuracy: number;
  percentile: number;
  remarks: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  url?: string;
  subject: Subject | 'General';
  date: string; // e.g. "Today, 10:30 AM" or ISO
  updatedAt: string;
  isPinned: boolean;
  tags: string[];
  folder: string;
}

export interface PdfItem {
  id: string;
  title: string;
  folder: Subject | 'General';
  uploadDate: string;
  fileSize: string;
  url?: string;
  isBookmarked: boolean;
  pageCount: number;
  lastPageRead: number;
}

export interface ReadingItem {
  id: string;
  title: string;
  category: ReadingCategory;
  source: string;
  content: string;
  url?: string;
  date: string;
  readTimeMinutes: number;
  isBookmarked: boolean;
  isRead: boolean;
  fileUrl?: string;
  imageUrl?: string;
}

export interface VocabWord {
  id: string;
  word: string;
  pronunciation?: string;
  meaning: string;
  synonyms: string[];
  antonyms: string[];
  example: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  revisionDate: string;
  masteryLevel: number; // 0 to 5
}

export interface Formula {
  id: string;
  title: string;
  category: FormulaCategory;
  formula: string;
  explanation: string;
  examples: string;
  isBookmarked: boolean;
  pdfUrl?: string;
  pdfFileName?: string;
}

export interface Goal {
  id: string;
  text: string;
  period: GoalPeriod;
  category: string;
  isCompleted: boolean;
  targetDate?: string;
}

export interface Habit {
  id: string;
  title: string;
  iconName: string;
  category: string;
  currentStreak: number;
  bestStreak: number;
  completionHistory: Record<string, boolean>; // YYYY-MM-DD -> true
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlockedAt: string | null;
  progress: number;
  target: number;
  category: string;
}

export interface VaultItem {
  id: string;
  title: string;
  category: VaultCategory;
  secretContent: string;
  urlOrFilename?: string;
  updatedAt: string;
}

export interface DailyStudyLog {
  date: string; // YYYY-MM-DD
  hoursStudied: number;
  questionsSolved: number;
  accuracy: number;
  notes?: string;
}

export interface TimerSession {
  id: string;
  timestamp: string;
  durationMinutes: number;
  mode: 'Pomodoro' | 'Short Break' | 'Long Break' | 'Focus';
  subject: Subject | 'General';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'info' | 'success' | 'warning';
}

export interface UserProfile {
  name: string;
  avatarUrl: string;
  tagline: string;
  targetExam: string;
}
