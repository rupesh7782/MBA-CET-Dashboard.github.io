import fs from 'fs';
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

const regex = /const \[vaultItems, setVaultItemsState\] = useState<VaultItem\[\]>\(\(\) => getStored\('vaultItems', initialVaultItems\)\);/;
const replacement = `const [vaultItems, setVaultItemsState] = useState<VaultItem[]>(() => getStored('vaultItems', initialVaultItems));
  const [vaultPin, setVaultPin] = useState<string>(() => getStored('vaultPin', ''));
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false);`;

if (!code.includes('const [vaultPin')) {
  code = code.replace(regex, replacement);
  fs.writeFileSync('src/context/AppContext.tsx', code);
  console.log('fixed vaultPin');
} else {
  console.log('vaultPin already defined');
}
