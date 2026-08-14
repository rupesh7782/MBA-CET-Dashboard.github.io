import fs from 'fs';
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

const regex = /const \[dailyLogs, setDailyLogsState\] = useState<DailyStudyLog\[\]>\(\(\) => getStored\('dailyLogs', initialDailyLogs\)\);/;
const replacement = `const [dailyLogs, setDailyLogsState] = useState<DailyStudyLog[]>(() => {
    const stored = getStored('dailyLogs', initialDailyLogs);
    // Migration for old hardcoded dates
    if (stored.length > 0 && stored[0].date === '2026-05-19') {
      return initialDailyLogs;
    }
    return stored;
  });`;

code = code.replace(regex, replacement);

const regex2 = /const \[timerSessions, setTimerSessionsState\] = useState<TimerSession\[\]>\(\(\) => getStored\('timerSessions', initialTimerSessions\)\);/;
const replacement2 = `const [timerSessions, setTimerSessionsState] = useState<TimerSession[]>(() => {
    const stored = getStored('timerSessions', initialTimerSessions);
    // Migration for old hardcoded dates
    if (stored.length > 0 && stored[0].timestamp.startsWith('2026-05-25')) {
      return initialTimerSessions;
    }
    return stored;
  });`;

code = code.replace(regex2, replacement2);

fs.writeFileSync('src/context/AppContext.tsx', code);
console.log('updated AppContext.tsx for migrations');
