import fs from 'fs';
let code = fs.readFileSync('src/components/motivation/MotivationView.tsx', 'utf8');

// Remove the customize journey button
const buttonRegex = /<button[\s\S]*?onClick=\{\(\) => setIsEditJourneyOpen\(true\)\}[\s\S]*?<\/button>/m;
code = code.replace(buttonRegex, '');

// Remove the modal
const modalRegex = /\{\/\* Modal: Edit My Journey Roadmap \*\/\}[\s\S]*?<\/Modal>/m;
code = code.replace(modalRegex, '');

fs.writeFileSync('src/components/motivation/MotivationView.tsx', code);
console.log('Removed customize journey button and modal');
