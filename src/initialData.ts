import { 
  ExamConfig, MockTest, SectionalTest, Note, PdfItem, 
  ReadingItem, VocabWord, Formula, Goal, Habit, Achievement, 
  VaultItem, DailyStudyLog, TimerSession, AppNotification, UserProfile
} from './types';

export const initialExamConfig: ExamConfig = {
  examName: 'MBA CET 2026',
  examDate: '2026-03-22',
  targetScore: 165,
  targetPercentile: 99.85,
  dailyStudyGoalHours: 8,
  dailyQuestionsGoal: 120,
  streakResetDate: '2026-06-06',
  currentStreakDays: 47,
};

export const initialMockTests: MockTest[] = [
  {
    id: 'mock-1',
    name: 'MBA CET Mock Test 9',
    date: '2026-05-25',
    time: '09:00 AM',
    varcScore: 38,
    lrdiScore: 52,
    arScore: 41,
    quantScore: 39,
    totalScore: 170,
    maxScore: 200,
    percentile: 96.2,
    timeTakenMinutes: 145,
    accuracy: 82.4,
    remarks: 'Strong performance in LR/DI. Need to work on Quant speed.',
    status: 'Upcoming',
  },
  {
    id: 'mock-2',
    name: 'MBA CET Mock Test 10',
    date: '2026-05-28',
    time: '09:00 AM',
    varcScore: 0,
    lrdiScore: 0,
    arScore: 0,
    quantScore: 0,
    totalScore: 0,
    maxScore: 200,
    percentile: 0,
    timeTakenMinutes: 150,
    accuracy: 0,
    remarks: 'Scheduled full length mock.',
    status: 'Upcoming',
  },
  {
    id: 'mock-3',
    name: 'MBA CET Mock Test 11',
    date: '2026-06-01',
    time: '09:00 AM',
    varcScore: 0,
    lrdiScore: 0,
    arScore: 0,
    quantScore: 0,
    totalScore: 0,
    maxScore: 200,
    percentile: 0,
    timeTakenMinutes: 150,
    accuracy: 0,
    remarks: 'Scheduled full length mock.',
    status: 'Upcoming',
  },
  {
    id: 'mock-4',
    name: 'MBA CET Mock Test 8',
    date: '2026-05-22',
    time: '10:00 AM',
    varcScore: 36,
    lrdiScore: 48,
    arScore: 38,
    quantScore: 34,
    totalScore: 156,
    maxScore: 200,
    percentile: 91.5,
    timeTakenMinutes: 150,
    accuracy: 78.5,
    remarks: 'Good progress in Abstract Reasoning. Silly errors in Arithmetic.',
    status: 'Completed',
  },
  {
    id: 'mock-5',
    name: 'MBA CET Mock Test 7',
    date: '2026-05-15',
    time: '10:00 AM',
    varcScore: 39,
    lrdiScore: 54,
    arScore: 42,
    quantScore: 37,
    totalScore: 172,
    maxScore: 200,
    percentile: 97.1,
    timeTakenMinutes: 148,
    accuracy: 84.1,
    remarks: 'All-time best score! Speed in LRDI puzzle selection was key.',
    status: 'Completed',
  },
  {
    id: 'mock-6',
    name: 'MBA CET Mock Test 6',
    date: '2026-05-08',
    time: '10:00 AM',
    varcScore: 33,
    lrdiScore: 44,
    arScore: 35,
    quantScore: 33,
    totalScore: 145,
    maxScore: 200,
    percentile: 85.2,
    timeTakenMinutes: 150,
    accuracy: 74.0,
    remarks: 'Tough RC passages. Time ran out before finishing last 15 Quant Qs.',
    status: 'Completed',
  },
  {
    id: 'mock-7',
    name: 'MBA CET Mock Test 5',
    date: '2026-05-01',
    time: '10:00 AM',
    varcScore: 31,
    lrdiScore: 40,
    arScore: 33,
    quantScore: 28,
    totalScore: 132,
    maxScore: 200,
    percentile: 76.8,
    timeTakenMinutes: 150,
    accuracy: 71.2,
    remarks: 'Baseline test after completing 50% syllabus.',
    status: 'Completed',
  },
];

export const initialSectionalTests: SectionalTest[] = [
  {
    id: 'sec-1',
    name: 'LRDI Matrix & Arrangement Speed Drill',
    subject: 'LRDI',
    date: '2026-05-24',
    score: 42,
    maxScore: 50,
    timeTakenMinutes: 40,
    accuracy: 88,
    percentile: 98.2,
    remarks: 'Aced circular arrangement sets.',
  },
  {
    id: 'sec-2',
    name: 'VARC Reading Comprehension Booster',
    subject: 'VARC',
    date: '2026-05-23',
    score: 38,
    maxScore: 50,
    timeTakenMinutes: 40,
    accuracy: 82,
    percentile: 94.5,
    remarks: 'Improved tone & inference accuracy.',
  },
  {
    id: 'sec-3',
    name: 'Quant Arithmetic Mastery',
    subject: 'QUANT',
    date: '2026-05-21',
    score: 35,
    maxScore: 50,
    timeTakenMinutes: 45,
    accuracy: 76,
    percentile: 89.0,
    remarks: 'Time-Speed-Distance questions need faster shortcut applications.',
  },
  {
    id: 'sec-4',
    name: 'Abstract Reasoning Visual Patterns',
    subject: 'AR',
    date: '2026-05-20',
    score: 22,
    maxScore: 25,
    timeTakenMinutes: 20,
    accuracy: 91,
    percentile: 97.8,
    remarks: 'Very high speed on mirror image and clock rotations.',
  }
];

export const initialNotes: Note[] = [
  {
    id: 'note-1',
    title: 'LRDI Important Formulas & Shortcuts',
    content: `# LR/DI Shortcuts & Tricks

## 1. Circular Arrangements
- For $N$ people facing inwards:
  - Left = Clockwise
  - Right = Anti-Clockwise
- If people face outwards, direction reverses!

## 2. Syllogisms - Venn Rules
- **Some A are B**: Overlapping circles.
- **No A is B**: Completely separate circles.
- **All A are B**: Circle A inside Circle B.

## 3. Data Interpretation Speed Math
- $1/7 = 14.28\\%$
- $1/8 = 12.5\\%$
- $1/9 = 11.11\\%$
- $1/11 = 9.09\\%$
- $1/12 = 8.33\\%$
- Growth rate formula: $\\frac{\\text{New} - \\text{Old}}{\\text{Old}} \\times 100\\%$
`,
    subject: 'LRDI',
    date: 'Today, 10:30 AM',
    updatedAt: '2026-05-25T10:30:00Z',
    isPinned: true,
    tags: ['Shortcuts', 'Puzzles', 'DI Math'],
    folder: 'LRDI',
  },
  {
    id: 'note-2',
    title: 'VARC RC Strategies & Elimination Rules',
    content: `# Reading Comprehension Master Rules

### Elimination Technique
1. **Out of Scope (OOS):** Mentions facts not present in passage.
2. **Extreme Tone:** Words like *always, never, impossible, only, completely*.
3. **Opposite Meaning:** Direct contradiction of paragraph 2.
4. **Half True:** First part is correct, second half is fabricated.

### Main Idea Questions
- Read first & last sentence of each paragraph.
- Ask: What is the author trying to convince the reader about?
`,
    subject: 'VARC',
    date: 'Yesterday, 09:15 PM',
    updatedAt: '2026-05-24T21:15:00Z',
    isPinned: true,
    tags: ['RC', 'Elimination', 'Vocabulary'],
    folder: 'VARC',
  },
  {
    id: 'note-3',
    title: 'Quadratic Equations & Roots Properties',
    content: `# Quadratic Equations

General Equation: $ax^2 + bx + c = 0$

- **Sum of roots** $(\\alpha + \\beta) = -b/a$
- **Product of roots** $(\\alpha \\beta) = c/a$
- **Discriminant** $D = b^2 - 4ac$
  - If $D > 0$: Real & Distinct roots
  - If $D = 0$: Real & Equal roots
  - If $D < 0$: Imaginary roots
`,
    subject: 'QUANT',
    date: '21 May 2026, 08:40 PM',
    updatedAt: '2026-05-21T20:40:00Z',
    isPinned: false,
    tags: ['Algebra', 'Equations'],
    folder: 'QUANT',
  },
  {
    id: 'note-4',
    title: 'Geometry Theorems & Circles Shortcuts',
    content: `# Circle Theorems for CET

1. Angle subtended by an arc at the center is double the angle subtended by it at any point on the circumference.
2. Angles in the same segment of a circle are equal.
3. Tangent-Secant Theorem: $PT^2 = PA \\cdot PB$
`,
    subject: 'AR',
    date: '20 May 2026, 07:20 PM',
    updatedAt: '2026-05-20T19:20:00Z',
    isPinned: false,
    tags: ['Geometry', 'Theorems'],
    folder: 'AR',
  },
];

export const initialPdfs: PdfItem[] = [
  {
    id: 'pdf-1',
    title: 'MBA CET Previous Year Papers 2021-2025 Solved.pdf',
    folder: 'QUANT',
    uploadDate: '2026-05-10',
    fileSize: '14.2 MB',
    isBookmarked: true,
    pageCount: 180,
    lastPageRead: 42,
  },
  {
    id: 'pdf-2',
    title: 'LRDI 500 High Level Puzzles Booklet.pdf',
    folder: 'LRDI',
    uploadDate: '2026-05-12',
    fileSize: '8.6 MB',
    isBookmarked: true,
    pageCount: 120,
    lastPageRead: 28,
  },
  {
    id: 'pdf-3',
    title: 'VARC Verbal Ability Grammar & Parajumbles.pdf',
    folder: 'VARC',
    uploadDate: '2026-05-14',
    fileSize: '5.1 MB',
    isBookmarked: false,
    pageCount: 95,
    lastPageRead: 15,
  },
  {
    id: 'pdf-4',
    title: 'Abstract Reasoning 1000 Series & Analogies.pdf',
    folder: 'AR',
    uploadDate: '2026-05-18',
    fileSize: '11.8 MB',
    isBookmarked: false,
    pageCount: 210,
    lastPageRead: 60,
  }
];

export const initialReadingItems: ReadingItem[] = [
  {
    id: 'read-1',
    title: 'The Economic Implications of Generative AI in Banking & Finance',
    category: 'Editorials',
    source: 'The Financial Express',
    content: `Financial institutions around the world are rapidly adopting generative artificial intelligence models to streamline credit scoring, risk modeling, and personalized wealth management. As algorithms process millions of transaction data points per second, regulatory authorities emphasize the necessity of algorithmic transparency and data privacy compliance...`,
    date: 'Today, 08:00 AM',
    readTimeMinutes: 6,
    isBookmarked: true,
    isRead: true,
  },
  {
    id: 'read-2',
    title: 'Global Supply Chain Realignment in Post-Pandemic Economies',
    category: 'Articles',
    source: 'Harvard Business Review',
    content: `Nearshoring and multi-sourcing have transformed global logistics networks over the past three years. Companies are shifting away from single-source manufacturing hubs towards resilient regional clusters to hedge against geopolitical shocks and transportation bottlenecks...`,
    date: 'Yesterday',
    readTimeMinutes: 8,
    isBookmarked: false,
    isRead: false,
  },
  {
    id: 'read-3',
    title: 'Monetary Policy Committee Decisions: Repo Rate Stability Analysis',
    category: 'Current Affairs',
    source: 'Economic Times',
    content: `The Reserve Bank of India maintained the repo rate at current benchmarks while emphasizing persistent food inflation management. Sectoral analysts project steady credit growth in retail and infrastructure lending over the coming quarters...`,
    date: '22 May 2026',
    readTimeMinutes: 5,
    isBookmarked: true,
    isRead: true,
  },
  {
    id: 'read-4',
    title: 'How-Countries-Go-Broke',
    category: 'Books',
    source: 'Ray Dalio',
    content: `Essential VARC preparation book summary...`,
    date: 'Today',
    readTimeMinutes: 45,
    isBookmarked: false,
    isRead: false,
    imageUrl: 'https://m.media-amazon.com/images/I/41-q1D1qWNL.jpg' // Approximate cover image of "How Countries Go Broke" or similar
  },
];

import { vocab500Words } from './data/vocab500';

export const initialVocabWords: VocabWord[] = vocab500Words;

export const initialFormulas: Formula[] = [
  {
    id: 'f-1',
    title: 'Time, Speed & Distance - Average Speed Formula',
    category: 'Arithmetic',
    formula: 'Average Speed = (2 * S1 * S2) / (S1 + S2) [for equal distance]',
    explanation: 'When a body travels equal distances at speed S1 and S2, the harmonic mean gives the average speed.',
    examples: 'A man travels from A to B at 60 km/h and returns at 40 km/h. Avg speed = (2*60*40)/(60+40) = 4800/100 = 48 km/h.',
    isBookmarked: true,
  },
  {
    id: 'f-2',
    title: 'Permutations & Combinations - Circular Arrangement',
    category: 'Modern Maths',
    formula: 'Circular Permutation = (N - 1)! [or (N - 1)! / 2 for necklaces/garlands]',
    explanation: 'Since starting position in a circle is relative, one position is fixed.',
    examples: 'Number of ways 6 people can sit around a round dining table = (6 - 1)! = 5! = 120 ways.',
    isBookmarked: true,
  },
  {
    id: 'f-3',
    title: 'Geometry - Apollonius Theorem (Medians)',
    category: 'Geometry',
    formula: 'AB² + AC² = 2 * (AD² + BD²) where AD is median to BC',
    explanation: 'Relates the length of sides of a triangle with the length of its median.',
    examples: 'In triangle ABC with AB=6, AC=8, BC=10, median AD = sqrt((36+64)/2 - 25) = sqrt(25) = 5.',
    isBookmarked: false,
  },
  {
    id: 'f-4',
    title: 'Algebra - Sum of Cubes & Squares',
    category: 'Algebra',
    formula: 'a³ + b³ + c³ - 3abc = (a + b + c)(a² + b² + c² - ab - bc - ca)',
    explanation: 'If a + b + c = 0, then a³ + b³ + c³ = 3abc.',
    examples: 'If x + y + z = 0, then x³ + y³ + z³ = 3xyz.',
    isBookmarked: true,
  },
];

export const initialGoals: Goal[] = [
  { id: 'g-1', text: 'Solve 120 LRDI & Quant practice questions', period: 'Daily', category: 'Practice', isCompleted: true },
  { id: 'g-2', text: 'Read 2 Financial Express editorial articles', period: 'Daily', category: 'VARC', isCompleted: true },
  { id: 'g-3', text: 'Complete 15 Pomodoro study sessions (5 hours total)', period: 'Daily', category: 'Study', isCompleted: false },
  { id: 'g-4', text: 'Revise 50 Vocab flashcards in Hard category', period: 'Daily', category: 'Vocab', isCompleted: true },
  { id: 'g-5', text: 'Attempt Mock Test 9 & complete thorough analysis', period: 'Weekly', category: 'Mocks', isCompleted: false },
  { id: 'g-6', text: 'Master Modern Maths Probability & P&C concepts', period: 'Weekly', category: 'Quant', isCompleted: true },
  { id: 'g-7', text: 'Achieve 165+ average score in 4 full mocks', period: 'Monthly', category: 'Target', isCompleted: false },
];

export const initialHabits: Habit[] = [
  {
    id: 'h-1',
    title: 'Daily Quant Practice (30 Qs)',
    iconName: 'Calculator',
    category: 'Quant',
    currentStreak: 12,
    bestStreak: 24,
    completionHistory: {
      '2026-05-19': true, '2026-05-20': true, '2026-05-21': true,
      '2026-05-22': true, '2026-05-23': true, '2026-05-24': true, '2026-05-25': true,
    }
  },
  {
    id: 'h-2',
    title: 'Editorial Reading (30 mins)',
    iconName: 'BookOpen',
    category: 'VARC',
    currentStreak: 8,
    bestStreak: 19,
    completionHistory: {
      '2026-05-19': true, '2026-05-20': true, '2026-05-21': true,
      '2026-05-22': true, '2026-05-23': true, '2026-05-24': true, '2026-05-25': true,
    }
  },
  {
    id: 'h-3',
    title: 'Vocabulary Revision (20 Words)',
    iconName: 'Sparkles',
    category: 'Vocab',
    currentStreak: 15,
    bestStreak: 28,
    completionHistory: {
      '2026-05-19': true, '2026-05-20': true, '2026-05-21': true,
      '2026-05-22': true, '2026-05-23': true, '2026-05-24': true, '2026-05-25': true,
    }
  },
  {
    id: 'h-4',
    title: 'LRDI Matrix Sets (3 Puzzles)',
    iconName: 'Grid',
    category: 'LRDI',
    currentStreak: 5,
    bestStreak: 14,
    completionHistory: {
      '2026-05-21': true, '2026-05-22': true, '2026-05-23': true, '2026-05-24': true, '2026-05-25': true
    }
  },
  {
    id: 'h-5',
    title: 'Hydration & Workout (30 mins)',
    iconName: 'Activity',
    category: 'Health',
    currentStreak: 6,
    bestStreak: 12,
    completionHistory: {
      '2026-05-20': true, '2026-05-21': true, '2026-05-22': true, '2026-05-23': true, '2026-05-24': true, '2026-05-25': true
    }
  }
];

export const initialAchievements: Achievement[] = [
  {
    id: 'ach-1',
    title: '12 Day Study Streak',
    description: 'Maintained consistent study sessions for 12 consecutive days.',
    iconName: 'Flame',
    unlockedAt: '2026-05-25',
    progress: 12,
    target: 12,
    category: 'Consistency',
  },
  {
    id: 'ach-2',
    title: '100 Hours Club',
    description: 'Completed 100 total hours of deep focused study.',
    iconName: 'Clock',
    unlockedAt: '2026-05-20',
    progress: 100,
    target: 100,
    category: 'Timer',
  },
  {
    id: 'ach-3',
    title: '500 Questions Solved',
    description: 'Solved over 500 questions across VARC, LRDI, AR, and QUANT.',
    iconName: 'CheckCircle2',
    unlockedAt: '2026-05-18',
    progress: 580,
    target: 500,
    category: 'Practice',
  },
  {
    id: 'ach-4',
    title: '10 Mock Tests Attempted',
    description: 'Attempted 10 full length MBA CET Mock Tests.',
    iconName: 'Award',
    unlockedAt: null,
    progress: 8,
    target: 10,
    category: 'Mocks',
  },
  {
    id: 'ach-5',
    title: 'Quant Wizard (95%+ accuracy)',
    description: 'Achieve 95%+ accuracy in 3 consecutive Quant sectional tests.',
    iconName: 'Zap',
    unlockedAt: null,
    progress: 2,
    target: 3,
    category: 'Mastery',
  },
  {
    id: 'ach-6',
    title: '99+ Percentile Club',
    description: 'Score 99+ percentile in any full length mock test.',
    iconName: 'Trophy',
    unlockedAt: null,
    progress: 97.1,
    target: 99.0,
    category: 'Excellence',
  }
];

export const initialVaultItems: VaultItem[] = [
  {
    id: 'vlt-1',
    title: 'CAT & MBA CET Official Admit Cards',
    category: 'Important PDFs',
    secretContent: 'Application No: CET2026-8849201 | Roll No: 260911842 | Center: Mumbai Digital Hub',
    updatedAt: '2026-05-10',
  },
  {
    id: 'vlt-2',
    title: 'Bachelor Degree & Academic Transcripts',
    category: 'Certificates',
    secretContent: 'B.Tech CGPA: 8.84/10 | Distinction Certificate Verified | University Transcript ID: 2024-8839',
    updatedAt: '2026-05-02',
  },
  {
    id: 'vlt-3',
    title: 'Executive Resume - Tech & Management PDF',
    category: 'Resume',
    secretContent: 'Resume V4.2 - Tailored for Top B-Schools (JBIMS, SIMSREE, KJSIM, PUMBA). Includes 2 internships & team lead achievements.',
    updatedAt: '2026-05-18',
  },
  {
    id: 'vlt-4',
    title: 'Test Portal & Mock Series Credentials',
    category: 'Passwords',
    secretContent: 'CET Portal: user_rupesh / cet_pass_2026# | IMS Login: ims_9984 / SafePass$99 | TIME Portal: time_mumbai_01',
    updatedAt: '2026-05-12',
  }
];

const today = new Date();
const formatDate = (d) => d.toISOString().split('T')[0];
const getRelativeDate = (daysOffset) => {
  const d = new Date(today);
  d.setDate(today.getDate() - daysOffset);
  return formatDate(d);
};

export const initialDailyLogs: DailyStudyLog[] = [
  { date: getRelativeDate(6), hoursStudied: 4.3, questionsSolved: 65, accuracy: 74 },
  { date: getRelativeDate(5), hoursStudied: 6.25, questionsSolved: 90, accuracy: 79 },
  { date: getRelativeDate(4), hoursStudied: 5.66, questionsSolved: 80, accuracy: 76 },
  { date: getRelativeDate(3), hoursStudied: 3.5, questionsSolved: 50, accuracy: 82 },
  { date: getRelativeDate(2), hoursStudied: 7.16, questionsSolved: 110, accuracy: 81 },
  { date: getRelativeDate(1), hoursStudied: 6.08, questionsSolved: 95, accuracy: 80 },
  { date: getRelativeDate(0), hoursStudied: 5.7, questionsSolved: 86, accuracy: 78.4 },
];

export const initialTimerSessions: TimerSession[] = [
  { id: 'ts-1', timestamp: `${getRelativeDate(0)}T09:00:00Z`, durationMinutes: 50, mode: 'Focus', subject: 'QUANT' },
  { id: 'ts-2', timestamp: `${getRelativeDate(0)}T10:00:00Z`, durationMinutes: 50, mode: 'Focus', subject: 'LRDI' },
  { id: 'ts-3', timestamp: `${getRelativeDate(0)}T11:30:00Z`, durationMinutes: 25, mode: 'Pomodoro', subject: 'VARC' },
  { id: 'ts-4', timestamp: `${getRelativeDate(0)}T14:00:00Z`, durationMinutes: 50, mode: 'Focus', subject: 'AR' },
];

export const initialNotifications: AppNotification[] = [
  {
    id: 'n-1',
    title: 'Upcoming Mock Test Alert',
    message: 'MBA CET Mock Test 9 is scheduled in 2 days (25 May 2026 at 09:00 AM).',
    timestamp: '10 mins ago',
    isRead: false,
    type: 'warning',
  },
  {
    id: 'n-2',
    title: 'Streak Milestone Reached!',
    message: 'Awesome! You hit a 12-Day Study Streak. Keep pushing forward!',
    timestamp: '2 hours ago',
    isRead: false,
    type: 'success',
  },
  {
    id: 'n-3',
    title: 'New Formulas Added',
    message: '4 geometry & modern maths shortcuts added to your Formula Book.',
    timestamp: 'Yesterday',
    isRead: true,
    type: 'info',
  }
];

export const initialUserProfile: UserProfile = {
  name: 'Rupesh Chavan',
  avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
  tagline: 'Focus • Consistency • Success',
  targetExam: 'JBIMS 2027',
};
