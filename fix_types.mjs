import fs from 'fs';
let code = fs.readFileSync('src/types.ts', 'utf8');

if (!code.includes('imageUrl?: string;')) {
  code = code.replace(
    'fileUrl?: string;',
    'fileUrl?: string;\n  imageUrl?: string;'
  );
  fs.writeFileSync('src/types.ts', code);
  console.log('updated types');
} else {
  console.log('types already updated');
}
