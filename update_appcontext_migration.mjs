import fs from 'fs';
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

const regex1 = /const \[dailyLogs, setDailyLogsState\] = useState<DailyStudyLog\[\]>\(\(\) => \{[\s\S]*?return stored;\n  \}\);/;

const replacement1 = `const [dailyLogs, setDailyLogsState] = useState<DailyStudyLog[]>(() => {
    const stored = getStored('dailyLogs', initialDailyLogs);
    // Migration for old hardcoded dates: if we see 2026-05-19 anywhere, replace the old mock data
    if (stored.some(l => l.date === '2026-05-19' || l.date === '2026-05-25')) {
      // Keep any logs that are from today or very recent, but just returning initialDailyLogs is safer for fixing the demo
      const today = new Date().toISOString().split('T')[0];
      const recentLogs = stored.filter(l => l.date === today);
      if (recentLogs.length > 0) {
        return [...initialDailyLogs.slice(0, -1), recentLogs[0]];
      }
      return initialDailyLogs;
    }
    return stored;
  });`;

code = code.replace(regex1, replacement1);

const regex2 = /const \[timerSessions, setTimerSessionsState\] = useState<TimerSession\[\]>\(\(\) => \{[\s\S]*?return stored;\n  \}\);/;

const replacement2 = `const [timerSessions, setTimerSessionsState] = useState<TimerSession[]>(() => {
    const stored = getStored('timerSessions', initialTimerSessions);
    // Migration for old hardcoded dates
    if (stored.some(s => s.timestamp.startsWith('2026-05-25'))) {
      const today = new Date().toISOString().split('T')[0];
      const recentSessions = stored.filter(s => s.timestamp.startsWith(today));
      return [...initialTimerSessions, ...recentSessions];
    }
    return stored;
  });`;

code = code.replace(regex2, replacement2);

fs.writeFileSync('src/context/AppContext.tsx', code);
console.log('updated AppContext migrations');
