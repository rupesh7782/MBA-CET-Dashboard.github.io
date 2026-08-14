import fs from 'fs';
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf8');
if (!code.includes('import localforage')) {
  code = "import localforage from 'localforage';\n" + code;
  fs.writeFileSync('src/context/AppContext.tsx', code);
  console.log('Added localforage import');
}
