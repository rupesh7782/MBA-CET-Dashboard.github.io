import fs from 'fs';
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

const target = `  const [readingItems, setReadingItemsState] = useState<ReadingItem[]>(() => {`;

const missingStates = `  const [vocabWords, setVocabWordsState] = useState<VocabWord[]>(() => getStored('vocabWords', initialVocabWords));
  const [formulas, setFormulasState] = useState<Formula[]>(() => getStored('formulas', initialFormulas));
  const [goals, setGoalsState] = useState<Goal[]>(() => getStored('goals', initialGoals));
  const [habits, setHabitsState] = useState<Habit[]>(() => getStored('habits', initialHabits));
  const [achievements, setAchievementsState] = useState<Achievement[]>(() => getStored('achievements', initialAchievements));
  const [vaultItems, setVaultItemsState] = useState<VaultItem[]>(() => getStored('vaultItems', initialVaultItems));

`;

if (!code.includes('const [vocabWords')) {
  code = code.replace(target, missingStates + target);
  fs.writeFileSync('src/context/AppContext.tsx', code);
  console.log('fixed vocabWords etc in AppContext');
} else {
  console.log('already there');
}
