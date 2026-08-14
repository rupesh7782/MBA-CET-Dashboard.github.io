import fs from 'fs';
let code = fs.readFileSync('src/components/motivation/MotivationView.tsx', 'utf8');

if (!code.includes('import { MyJourneyWidget }')) {
  code = code.replace(
    "import { Modal } from '../common/Modal';",
    "import { Modal } from '../common/Modal';\nimport { MyJourneyWidget } from '../dashboard/MyJourneyWidget';"
  );
  fs.writeFileSync('src/components/motivation/MotivationView.tsx', code);
  console.log('Added import');
}
