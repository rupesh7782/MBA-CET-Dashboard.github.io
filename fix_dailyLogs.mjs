import fs from 'fs';
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

const target = `  const [timerSessions, setTimerSessionsState] = useState<TimerSession[]>(() => {`;

const missingState = `  const [dailyLogs, setDailyLogsState] = useState<DailyStudyLog[]>(() => getStored('dailyLogs', initialDailyLogs));\n`;

if (!code.includes('const [dailyLogs')) {
  code = code.replace(target, missingState + target);
  fs.writeFileSync('src/context/AppContext.tsx', code);
  console.log('fixed dailyLogs in AppContext');
} else {
  console.log('already there');
}
