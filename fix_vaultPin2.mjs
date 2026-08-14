import fs from 'fs';
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

code = code.replace(/const \[vaultPin, setVaultPin\] = useState<string>\(\(\) => getStored\('vaultPin', ''\)\);/, 'const [vaultPin, setVaultPinState] = useState<string>(() => getStored(\'vaultPin\', \'\'));');

fs.writeFileSync('src/context/AppContext.tsx', code);
console.log('fixed vaultPin name');
