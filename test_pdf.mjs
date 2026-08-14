import fs from 'fs';
let code = fs.readFileSync('src/components/reading/ReadingMaterialView.tsx', 'utf8');

const isPdfRegex = /fileUrl\?\.startsWith\('data:application\/pdf'\)/g;

code = code.replace(isPdfRegex, "(fileUrl?.startsWith('data:application/pdf') || content.startsWith('[PDF Document:'))");

fs.writeFileSync('src/components/reading/ReadingMaterialView.tsx', code);
console.log('updated modal condition');
