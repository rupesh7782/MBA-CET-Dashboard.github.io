import fs from 'fs';
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

code = code.replace(/const \[pdfs, setPdfsState\] = useState<PdfItem\[\]>\(initialPdfs\);\n  \}\);/, "const [pdfs, setPdfsState] = useState<PdfItem[]>(initialPdfs);");
code = code.replace(/const \[readingItems, setReadingItemsState\] = useState<ReadingItem\[\]>\(initialReadingItems\);\n      return updatedStored;\n    \}\n    return stored;\n  \}\);/, "const [readingItems, setReadingItemsState] = useState<ReadingItem[]>(initialReadingItems);");

fs.writeFileSync('src/context/AppContext.tsx', code);
