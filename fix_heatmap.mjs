import fs from 'fs';

let code = fs.readFileSync('src/components/timer/StudyTimerView.tsx', 'utf8');

const regex1 = /\/\/ Calendar Heatmap generation for last 28 days[\s\S]*?const heatmapDays = Array\.from\(\{ length: 28 \}, \(_, i\) => \{[\s\S]*?return \{ date: ds, dayNum: d\.getDate\(\), minutes: totalMinForDay \};\n  \}\);/m;

const replacement1 = `// Calendar Heatmap generation for current month
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay(); 
  
  const heatmapDays: Array<{date: string, dayNum: number, minutes: number} | null> = [];
  for (let i = 0; i < firstDay; i++) {
    heatmapDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i);
    const ds = \`\${d.getFullYear()}-\${String(d.getMonth() + 1).padStart(2, '0')}-\${String(d.getDate()).padStart(2, '0')}\`;
    const totalMinForDay = timerSessions
      .filter(s => s.timestamp.startsWith(ds))
      .reduce((acc, s) => acc + s.durationMinutes, 0);
    heatmapDays.push({ date: ds, dayNum: i, minutes: totalMinForDay });
  }`;

code = code.replace(regex1, replacement1);

const regex2 = /<span>28-Day Study Heatmap<\/span>[\s\S]*?<\/div>\n\s*<div className="grid grid-cols-7 gap-2 pt-2">\n\s*\{heatmapDays\.map\(\(hd\) => \{/m;

const replacement2 = `<span>This Month's Study Heatmap</span>
            </h3>
            <span className="text-[11px] text-[#A9A9A9]">Less → More</span>
          </div>
          
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-2 pt-2 mb-2 text-center text-[10px] text-[#707085] font-medium">
            <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {heatmapDays.map((hd, idx) => {
              if (!hd) {
                return <div key={\`empty-\${idx}\`} className="h-8 rounded-lg" />;
              }`;

code = code.replace(regex2, replacement2);

// We also need to change heatmapDays.map((hd) => { to heatmapDays.map((hd, idx) => { ...
// But I already did that in regex2.
// We must make sure there are no other places where `hd` is assumed non-null without check.
fs.writeFileSync('src/components/timer/StudyTimerView.tsx', code);
console.log('Modified StudyTimerView.tsx');
