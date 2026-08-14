import fs from 'fs';
let code = fs.readFileSync('src/components/dashboard/DashboardView.tsx', 'utf8');

if (!code.includes('MyJourneyWidget')) {
  // Add import
  code = code.replace(
    "import { DailyMotivationWidget } from './DailyMotivationWidget';",
    "import { DailyMotivationWidget } from './DailyMotivationWidget';\nimport { MyJourneyWidget } from './MyJourneyWidget';"
  );

  // Add widget below greeting header
  const target = `{/* Row 1: Top 5 Statistic Cards */}`;
  code = code.replace(target, `<MyJourneyWidget />\n\n      {/* Row 1: Top 5 Statistic Cards */}`);
  
  fs.writeFileSync('src/components/dashboard/DashboardView.tsx', code);
  console.log('added MyJourneyWidget to dashboard');
} else {
  console.log('MyJourneyWidget already added');
}
