import fs from 'fs';
let code = fs.readFileSync('src/components/motivation/MotivationView.tsx', 'utf8');

code = code.replace(/const \[isEditJourneyOpen, setIsEditJourneyOpen\] = useState\(false\);/, '');

fs.writeFileSync('src/components/motivation/MotivationView.tsx', code);
console.log('Removed isEditJourneyOpen state');
