import fs from 'fs';

let code = fs.readFileSync('src/initialData.ts', 'utf8');

const regexLogs = /export const initialDailyLogs: DailyStudyLog\[\] = \[\s*\{ date: '2026-05-19'[\s\S]*?\];/;

const replacementLogs = `const today = new Date();
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
];`;

code = code.replace(regexLogs, replacementLogs);

const regexSessions = /export const initialTimerSessions: TimerSession\[\] = \[\s*\{ id: 'ts-1', timestamp: '2026-05-25[\s\S]*?\];/;

const replacementSessions = `export const initialTimerSessions: TimerSession[] = [
  { id: 'ts-1', timestamp: \`\${getRelativeDate(0)}T09:00:00Z\`, durationMinutes: 50, mode: 'Focus', subject: 'QUANT' },
  { id: 'ts-2', timestamp: \`\${getRelativeDate(0)}T10:00:00Z\`, durationMinutes: 50, mode: 'Focus', subject: 'LRDI' },
  { id: 'ts-3', timestamp: \`\${getRelativeDate(0)}T11:30:00Z\`, durationMinutes: 25, mode: 'Pomodoro', subject: 'VARC' },
  { id: 'ts-4', timestamp: \`\${getRelativeDate(0)}T14:00:00Z\`, durationMinutes: 50, mode: 'Focus', subject: 'AR' },
];`;

code = code.replace(regexSessions, replacementSessions);

fs.writeFileSync('src/initialData.ts', code);
console.log('updated initialData.ts');
