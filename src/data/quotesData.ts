export interface Quote {
  id: number;
  quote: string;
  author: string;
  category: 'JBIMS Mindset' | 'Discipline' | 'Mock Grit' | 'Focus & Drive' | 'Belief';
  bgPreset?: 'mountain' | 'gold' | 'neon' | 'dark' | 'minimal';
  isFavorite?: boolean;
}

export const INITIAL_QUOTES: Quote[] = [
  {
    id: 1,
    quote: "Discipline today, success tomorrow. Keep showing up for yourself.",
    author: "FocusOS",
    category: "Discipline",
    bgPreset: "mountain"
  },
  {
    id: 2,
    quote: "No backup plan. Only JBIMS. 99.99 Percentile.",
    author: "Churchgate Dream",
    category: "JBIMS Mindset",
    bgPreset: "gold"
  },
  {
    id: 3,
    quote: "The distance between your dreams and reality is called action.",
    author: "FocusOS",
    category: "Focus & Drive",
    bgPreset: "neon"
  },
  {
    id: 4,
    quote: "Mocks do not define your final score; they refine your strategy.",
    author: "CET Topper Mindset",
    category: "Mock Grit",
    bgPreset: "mountain"
  },
  {
    id: 5,
    quote: "Don't count the days, make the days count.",
    author: "Muhammad Ali",
    category: "Discipline",
    bgPreset: "dark"
  },
  {
    id: 6,
    quote: "JBIMS Churchgate is not built for those who surrender when mocks get tough.",
    author: "JBIMS Aspirant",
    category: "JBIMS Mindset",
    bgPreset: "gold"
  },
  {
    id: 7,
    quote: "Success is the sum of small efforts, repeated day in and day out.",
    author: "Robert Collier",
    category: "Discipline",
    bgPreset: "minimal"
  },
  {
    id: 8,
    quote: "When speed meets accuracy, 99.99 percentile becomes inevitable.",
    author: "MBA CET Mentor",
    category: "Mock Grit",
    bgPreset: "neon"
  },
  {
    id: 9,
    quote: "Work hard in silence, let your 99.99 percentile make the noise.",
    author: "FocusOS",
    category: "Focus & Drive",
    bgPreset: "mountain"
  },
  {
    id: 10,
    quote: "There are no shortcuts to Churchgate. Every puzzle solved counts.",
    author: "JBIMS Dreamer",
    category: "JBIMS Mindset",
    bgPreset: "gold"
  },
  {
    id: 11,
    quote: "You don't have to be extreme, just consistent.",
    author: "FocusOS",
    category: "Discipline",
    bgPreset: "minimal"
  },
  {
    id: 12,
    quote: "Analyze every mistake in your mock test. That is where 10 extra marks hide.",
    author: "CET Analyst",
    category: "Mock Grit",
    bgPreset: "dark"
  },
  {
    id: 13,
    quote: "Push yourself, because no one else is going to do it for you.",
    author: "FocusOS",
    category: "Focus & Drive",
    bgPreset: "mountain"
  },
  {
    id: 14,
    quote: "Great things never came from comfort zones.",
    author: "Anonymous",
    category: "Belief",
    bgPreset: "neon"
  },
  {
    id: 15,
    quote: "Dream big, execute relentless, land JBIMS.",
    author: "JBIMS Aspirant",
    category: "JBIMS Mindset",
    bgPreset: "gold"
  },
  {
    id: 16,
    quote: "Small daily improvements over time lead to stunning results.",
    author: "Robin Sharma",
    category: "Discipline",
    bgPreset: "minimal"
  },
  {
    id: 17,
    quote: "Speed in Quant is born from conceptual clarity, not rushed calculations.",
    author: "Quant Guru",
    category: "Mock Grit",
    bgPreset: "dark"
  },
  {
    id: 18,
    quote: "Your only competition is the person you were yesterday.",
    author: "FocusOS",
    category: "Belief",
    bgPreset: "mountain"
  },
  {
    id: 19,
    quote: "It always seems impossible until it's done.",
    author: "Nelson Mandela",
    category: "Belief",
    bgPreset: "neon"
  },
  {
    id: 20,
    quote: "JBIMS isn't just a college; it's the CEO Factory of Mumbai.",
    author: "Churchgate Pride",
    category: "JBIMS Mindset",
    bgPreset: "gold"
  },
  {
    id: 21,
    quote: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    category: "Belief",
    bgPreset: "minimal"
  },
  {
    id: 22,
    quote: "Accuracy is your foundation. Speed is your accelerator.",
    author: "MBA CET Mentor",
    category: "Mock Grit",
    bgPreset: "dark"
  },
  {
    id: 23,
    quote: "Focus on the process, the result will take care of itself.",
    author: "M.S. Dhoni Mindset",
    category: "Focus & Drive",
    bgPreset: "mountain"
  },
  {
    id: 24,
    quote: "Start where you are. Use what you have. Do what you can.",
    author: "Arthur Ashe",
    category: "Discipline",
    bgPreset: "neon"
  },
  {
    id: 25,
    quote: "JBIMS batch size is tiny, but the ambition is infinite.",
    author: "JBIMS Topper",
    category: "JBIMS Mindset",
    bgPreset: "gold"
  },
  {
    id: 26,
    quote: "A year from now you may wish you had started today.",
    author: "Karen Lamb",
    category: "Focus & Drive",
    bgPreset: "minimal"
  },
  {
    id: 27,
    quote: "Master the Abstract Reasoning speed; score easy marks fast.",
    author: "AR Specialist",
    category: "Mock Grit",
    bgPreset: "dark"
  },
  {
    id: 28,
    quote: "Wake up with determination, go to bed with satisfaction.",
    author: "FocusOS",
    category: "Discipline",
    bgPreset: "mountain"
  },
  {
    id: 29,
    quote: "Hard work beats talent when talent doesn't work hard.",
    author: "Tim Notke",
    category: "Belief",
    bgPreset: "neon"
  },
  {
    id: 30,
    quote: "Only 120 seats at JBIMS. Every mark in CET is a battle worth winning.",
    author: "JBIMS War Room",
    category: "JBIMS Mindset",
    bgPreset: "gold"
  },
  {
    id: 31,
    quote: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
    category: "Focus & Drive",
    bgPreset: "minimal"
  },
  {
    id: 32,
    quote: "When LRDI arrangements feel impossible, stay calm and decode one clue at a time.",
    author: "LRDI Master",
    category: "Mock Grit",
    bgPreset: "dark"
  },
  {
    id: 33,
    quote: "Action is the foundational key to all success.",
    author: "Pablo Picasso",
    category: "Discipline",
    bgPreset: "mountain"
  },
  {
    id: 34,
    quote: "You miss 100% of the shots you don't take.",
    author: "Wayne Gretzky",
    category: "Belief",
    bgPreset: "neon"
  },
  {
    id: 35,
    quote: "No Plan B. Target JBIMS. 99.99 Percentile or Nothing.",
    author: "FocusOS",
    category: "JBIMS Mindset",
    bgPreset: "gold"
  },
  {
    id: 36,
    quote: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
    category: "Discipline",
    bgPreset: "minimal"
  },
  {
    id: 37,
    quote: "VARC speed improves with daily Hindu editorial reading without fail.",
    author: "VARC Mentor",
    category: "Mock Grit",
    bgPreset: "dark"
  },
  {
    id: 38,
    quote: "Small habits create huge momentum over 180 days.",
    author: "Atomic Habits Principle",
    category: "Focus & Drive",
    bgPreset: "mountain"
  },
  {
    id: 39,
    quote: "Your mindset determines your percentile.",
    author: "FocusOS",
    category: "Belief",
    bgPreset: "neon"
  },
  {
    id: 40,
    quote: "JBIMS Churchgate Campus is calling. Answer with your relentless dedication.",
    author: "Churchgate Calling",
    category: "JBIMS Mindset",
    bgPreset: "gold"
  },
  {
    id: 41,
    quote: "Everything you've ever wanted is on the other side of fear.",
    author: "George Addair",
    category: "Belief",
    bgPreset: "minimal"
  },
  {
    id: 42,
    quote: "Time management in CET is 50% strategy and 50% nerve control.",
    author: "CET Veteran",
    category: "Mock Grit",
    bgPreset: "dark"
  },
  {
    id: 43,
    quote: "Opportunities don't happen. You create them.",
    author: "Chris Grosser",
    category: "Focus & Drive",
    bgPreset: "mountain"
  },
  {
    id: 44,
    quote: "Success doesn't just find you. You have to go out and get it.",
    author: "FocusOS",
    category: "Discipline",
    bgPreset: "neon"
  },
  {
    id: 45,
    quote: "99.99 percentile is not a goal; it's a daily ritual.",
    author: "JBIMS Creed",
    category: "JBIMS Mindset",
    bgPreset: "gold"
  },
  {
    id: 46,
    quote: "Try again. Fail again. Fail better.",
    author: "Samuel Beckett",
    category: "Belief",
    bgPreset: "minimal"
  },
  {
    id: 47,
    quote: "One wrong question in mock is a lesson learned before the real exam.",
    author: "Mock Analyst",
    category: "Mock Grit",
    bgPreset: "dark"
  },
  {
    id: 48,
    quote: "Motivation gets you going, but discipline keeps you growing.",
    author: "John C. Maxwell",
    category: "Discipline",
    bgPreset: "mountain"
  },
  {
    id: 49,
    quote: "Be so good they can't ignore you.",
    author: "Steve Martin",
    category: "Focus & Drive",
    bgPreset: "neon"
  },
  {
    id: 50,
    quote: "When Mumbai shines at night, JBIMS aspirants study until dawn.",
    author: "Mumbai Dream",
    category: "JBIMS Mindset",
    bgPreset: "gold"
  },
  {
    id: 51,
    quote: "Doubt kills more dreams than failure ever will.",
    author: "Suzy Kassem",
    category: "Belief",
    bgPreset: "minimal"
  },
  {
    id: 52,
    quote: "Never linger on a stuck question in CET. Skip, mark, and conquer.",
    author: "CET Strategy Rule #1",
    category: "Mock Grit",
    bgPreset: "dark"
  },
  {
    id: 53,
    quote: "You don't need a new year to start fresh. You just need a new morning.",
    author: "FocusOS",
    category: "Discipline",
    bgPreset: "mountain"
  },
  {
    id: 54,
    quote: "Focus on being productive instead of busy.",
    author: "Tim Ferriss",
    category: "Focus & Drive",
    bgPreset: "neon"
  },
  {
    id: 55,
    quote: "JBIMS Alumni lead corporate giants. You are next in line.",
    author: "JBIMS Heritage",
    category: "JBIMS Mindset",
    bgPreset: "gold"
  },
  {
    id: 56,
    quote: "Quality is not an act, it is a habit.",
    author: "Aristotle",
    category: "Discipline",
    bgPreset: "minimal"
  },
  {
    id: 57,
    quote: "Arithmetic & Algebra are 60% of CET Quant. Master them completely.",
    author: "Quant Guru",
    category: "Mock Grit",
    bgPreset: "dark"
  },
  {
    id: 58,
    quote: "Pain is temporary. Quitting lasts forever.",
    author: "Lance Armstrong",
    category: "Belief",
    bgPreset: "mountain"
  },
  {
    id: 59,
    quote: "Your passion is waiting for your courage to catch up.",
    author: "Isabelle Lafleche",
    category: "Focus & Drive",
    bgPreset: "neon"
  },
  {
    id: 60,
    quote: "NO BACKUP PLAN. ONLY JBIMS. 99.99 PERCENTILE.",
    author: "JBIMS Wall of Fame",
    category: "JBIMS Mindset",
    bgPreset: "gold"
  },
  {
    id: 61,
    quote: "Success is what happens after you have survived all your mistakes.",
    author: "FocusOS",
    category: "Belief",
    bgPreset: "minimal"
  },
  {
    id: 62,
    quote: "Track your time per question. Seconds saved build percentile margins.",
    author: "CET Speed Analyst",
    category: "Mock Grit",
    bgPreset: "dark"
  },
  {
    id: 63,
    quote: "If you get tired, learn to rest, not to quit.",
    author: "Banksy",
    category: "Discipline",
    bgPreset: "mountain"
  },
  {
    id: 64,
    quote: "Dream big and dare to fail.",
    author: "Norman Vaughan",
    category: "Focus & Drive",
    bgPreset: "neon"
  },
  {
    id: 65,
    quote: "Every late-night practice set brings Churchgate station 1 step closer.",
    author: "Mumbai Aspirant",
    category: "JBIMS Mindset",
    bgPreset: "gold"
  },
  {
    id: 66,
    quote: "Consistency is what transforms average into excellence.",
    author: "FocusOS",
    category: "Discipline",
    bgPreset: "minimal"
  },
  {
    id: 67,
    quote: "In Syllogisms and Input-Output, speed comes from pattern recognition.",
    author: "Reasoning Expert",
    category: "Mock Grit",
    bgPreset: "dark"
  },
  {
    id: 68,
    quote: "Believe in your preparation when the mock test timer starts tick-tock.",
    author: "FocusOS",
    category: "Belief",
    bgPreset: "mountain"
  },
  {
    id: 69,
    quote: "Don't stop when you're tired. Stop when you're done.",
    author: "Marilyn Monroe",
    category: "Focus & Drive",
    bgPreset: "neon"
  },
  {
    id: 70,
    quote: "JBIMS 99.99%ile is achieved by those who refuse to negotiate with laziness.",
    author: "JBIMS Topper Motto",
    category: "JBIMS Mindset",
    bgPreset: "gold"
  },
  {
    id: 71,
    quote: "Do something today that your future self will thank you for.",
    author: "FocusOS",
    category: "Discipline",
    bgPreset: "minimal"
  },
  {
    id: 72,
    quote: "Sectional mocks isolate weaknesses so final mocks shine with strength.",
    author: "Test Series Coach",
    category: "Mock Grit",
    bgPreset: "dark"
  },
  {
    id: 73,
    quote: "It's not about perfect. It's about effort.",
    author: "Jillian Michaels",
    category: "Belief",
    bgPreset: "mountain"
  },
  {
    id: 74,
    quote: "Stay hungry, stay foolish.",
    author: "Steve Jobs",
    category: "Focus & Drive",
    bgPreset: "neon"
  },
  {
    id: 75,
    quote: "From 200,000 CET takers to the top 100 at JBIMS: You belong there.",
    author: "JBIMS Belief",
    category: "JBIMS Mindset",
    bgPreset: "gold"
  },
  {
    id: 76,
    quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "Belief",
    bgPreset: "minimal"
  },
  {
    id: 77,
    quote: "Solve 150 questions daily; accuracy will turn into muscle memory.",
    author: "Daily Drill Rule",
    category: "Mock Grit",
    bgPreset: "dark"
  },
  {
    id: 78,
    quote: "Energy flows where attention goes.",
    author: "Tony Robbins",
    category: "Focus & Drive",
    bgPreset: "mountain"
  },
  {
    id: 79,
    quote: "You are stronger than you think, more capable than you ever dreamed.",
    author: "FocusOS",
    category: "Belief",
    bgPreset: "neon"
  },
  {
    id: 80,
    quote: "NO BACKUP PLAN. ONLY JBIMS.",
    author: "JBIMS Aspirant Anthem",
    category: "JBIMS Mindset",
    bgPreset: "gold"
  },
  {
    id: 81,
    quote: "Small deeds done are better than great deeds planned.",
    author: "Peter Marshall",
    category: "Discipline",
    bgPreset: "minimal"
  },
  {
    id: 82,
    quote: "Visualizing JBIMS auditorium during mock fatigue revives instant focus.",
    author: "Mindset Visualizer",
    category: "Mock Grit",
    bgPreset: "dark"
  },
  {
    id: 83,
    quote: "Focus on the goal, not the obstacles.",
    author: "FocusOS",
    category: "Focus & Drive",
    bgPreset: "mountain"
  },
  {
    id: 84,
    quote: "What you do today can improve all your tomorrows.",
    author: "Ralph Marston",
    category: "Discipline",
    bgPreset: "neon"
  },
  {
    id: 85,
    quote: "Churchgate is not just a location, it's the destination of excellence.",
    author: "JBIMS Pride",
    category: "JBIMS Mindset",
    bgPreset: "gold"
  },
  {
    id: 86,
    quote: "The best way to predict the future is to create it.",
    author: "Abraham Lincoln",
    category: "Belief",
    bgPreset: "minimal"
  },
  {
    id: 87,
    quote: "Accuracy on easy questions guarantees your baseline percentile.",
    author: "CET Expert",
    category: "Mock Grit",
    bgPreset: "dark"
  },
  {
    id: 88,
    quote: "Fall seven times, stand up eight.",
    author: "Japanese Proverb",
    category: "Belief",
    bgPreset: "mountain"
  },
  {
    id: 89,
    quote: "Clear mind, steady hand, high percentile.",
    author: "FocusOS",
    category: "Focus & Drive",
    bgPreset: "neon"
  },
  {
    id: 90,
    quote: "JBIMS 99.99 PERCENTILE — EARNED, NEVER GIVEN.",
    author: "JBIMS Motto",
    category: "JBIMS Mindset",
    bgPreset: "gold"
  },
  {
    id: 91,
    quote: "Be disciplined even when no one is watching.",
    author: "FocusOS",
    category: "Discipline",
    bgPreset: "minimal"
  },
  {
    id: 92,
    quote: "A mock test without post-analysis is half the value wasted.",
    author: "CET Analyst",
    category: "Mock Grit",
    bgPreset: "dark"
  },
  {
    id: 93,
    quote: "Greatness takes time, dedication, and zero excuses.",
    author: "FocusOS",
    category: "Focus & Drive",
    bgPreset: "mountain"
  },
  {
    id: 94,
    quote: "Your determination is your ultimate superpower.",
    author: "FocusOS",
    category: "Belief",
    bgPreset: "neon"
  },
  {
    id: 95,
    quote: "JBIMS Mumbai — Where dreams convert into top corporate leadership.",
    author: "JBIMS Aspirant",
    category: "JBIMS Mindset",
    bgPreset: "gold"
  },
  {
    id: 96,
    quote: "Show up every day with 100% effort, even when energy is low.",
    author: "Discipline Oath",
    category: "Discipline",
    bgPreset: "minimal"
  },
  {
    id: 97,
    quote: "Speed in Reading Comprehension comes from active mental mapping.",
    author: "VARC Guide",
    category: "Mock Grit",
    bgPreset: "dark"
  },
  {
    id: 98,
    quote: "Believe in the process and embrace the grind.",
    author: "FocusOS",
    category: "Focus & Drive",
    bgPreset: "mountain"
  },
  {
    id: 99,
    quote: "You are one mock test closer to your JBIMS goal.",
    author: "FocusOS",
    category: "Belief",
    bgPreset: "neon"
  },
  {
    id: 100,
    quote: "NO BACKUP PLAN. ONLY JBIMS. 99.99 PERCENTILE.",
    author: "JBIMS Hall of Legends",
    category: "JBIMS Mindset",
    bgPreset: "gold"
  },
  {
    id: 101,
    quote: "Champions train when no one is watching and perform when everyone is.",
    author: "FocusOS",
    category: "Discipline",
    bgPreset: "mountain"
  },
  {
    id: 102,
    quote: "Master the 200 questions in 150 minutes with calm laser precision.",
    author: "CET Master Plan",
    category: "Mock Grit",
    bgPreset: "dark"
  },
  {
    id: 103,
    quote: "Keep your eyes on the prize and your feet on the ground.",
    author: "FocusOS",
    category: "Focus & Drive",
    bgPreset: "minimal"
  },
  {
    id: 104,
    quote: "Your commitment to JBIMS will inspire everyone around you.",
    author: "JBIMS Aspirant",
    category: "JBIMS Mindset",
    bgPreset: "gold"
  },
  {
    id: 105,
    quote: "Consistency turns ordinary efforts into extraordinary results.",
    author: "FocusOS",
    category: "Discipline",
    bgPreset: "neon"
  }
];
