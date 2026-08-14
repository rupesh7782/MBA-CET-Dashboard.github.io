import fs from 'fs';

let code = fs.readFileSync('src/components/reading/ReadingMaterialView.tsx', 'utf8');

code = code.replace(
  '<img src={item.imageUrl} alt={item.title} className="w-full h-auto object-contain rounded-sm" style={{ maxHeight: \'200px\' }} />',
  '<img src={item.imageUrl} alt={item.title} className="w-full h-auto object-cover rounded-sm shadow-md" style={{ maxHeight: \'280px\' }} />'
);

fs.writeFileSync('src/components/reading/ReadingMaterialView.tsx', code);
console.log('updated reading material image styles');
