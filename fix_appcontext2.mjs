import fs from 'fs';
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

const regex = /const \[readingItems, setReadingItemsState\] = useState<ReadingItem\[\]>\(\(\) => \{[\s\S]*?return stored;\n  \}\);/;

const replacement = `const [readingItems, setReadingItemsState] = useState<ReadingItem[]>(() => {
    const stored = getStored('readingItems', initialReadingItems);
    // Merge new image URLs into existing local storage
    if (stored.length > 0) {
      const updatedStored = stored.map(s => {
        const initial = initialReadingItems.find(i => i.id === s.id);
        if (initial && initial.imageUrl && !s.imageUrl) {
          return { ...s, imageUrl: initial.imageUrl, title: initial.title };
        }
        return s;
      });
      return updatedStored;
    }
    return stored;
  });`;

code = code.replace(regex, replacement);

fs.writeFileSync('src/context/AppContext.tsx', code);
console.log('updated AppContext readingItems migration');
