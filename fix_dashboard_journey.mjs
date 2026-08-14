import fs from 'fs';
let code = fs.readFileSync('src/components/dashboard/DashboardView.tsx', 'utf8');

code = code.replace(/<MyJourneyWidget \/>/g, '');
code = code.replace(/import \{ MyJourneyWidget \} from '\.\/MyJourneyWidget';/g, '');

fs.writeFileSync('src/components/dashboard/DashboardView.tsx', code);
console.log('Removed from dashboard');
