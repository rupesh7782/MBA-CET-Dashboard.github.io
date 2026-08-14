import fs from 'fs';

let code = fs.readFileSync('src/components/dashboard/DashboardView.tsx', 'utf8');

// Import
code = code.replace(
  "import { Subject } from '../../types';",
  "import { Subject } from '../../types';\nimport { DailyMotivationWidget } from './DailyMotivationWidget';"
);

// Insert into the right sidebar column, before Widget 1: Today's Tasks
const insertionPoint = "{/* Widget 1: Today's Tasks */}";
const widgetHtml = `<div className="mb-6">\n            <DailyMotivationWidget />\n          </div>\n\n          {/* Widget 1: Today's Tasks */}`;

code = code.replace(insertionPoint, widgetHtml);

fs.writeFileSync('src/components/dashboard/DashboardView.tsx', code);
console.log('updated dashboard view with motivation widget');
