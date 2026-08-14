cat src/context/AppContext.tsx | sed 's/logTodayStudy: (hours: number, questions: number, accuracy: number) => void;/logTodayStudy: (hours: number, questions: number, accuracy: number) => void;\n  updateTodayLog: (hours: number, questions: number, accuracy: number) => void;/g' > temp.tsx
mv temp.tsx src/context/AppContext.tsx

cat src/context/AppContext.tsx | awk '/const logTodayStudy = /{print "  const updateTodayLog = (hours: number, questions: number, accuracy: number) => {"; print "    const today = new Date().toISOString().split('\''T'\'')[0];"; print "    setDailyLogsState(prev => {"; print "      const existing = prev.find(l => l.date === today);"; print "      if (existing) {"; print "        return prev.map(l => l.date === today ? { ...l, hoursStudied: hours, questionsSolved: questions, accuracy } : l);"; print "      } else {"; print "        return [...prev, { date: today, hoursStudied: hours, questionsSolved: questions, accuracy }];"; print "      }"; print "    });"; print "  };\n"} {print}' > temp.tsx
mv temp.tsx src/context/AppContext.tsx

cat src/context/AppContext.tsx | sed 's/dailyLogs, logTodayStudy,/dailyLogs, logTodayStudy, updateTodayLog,/g' > temp.tsx
mv temp.tsx src/context/AppContext.tsx
