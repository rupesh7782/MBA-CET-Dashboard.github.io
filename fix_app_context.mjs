import fs from 'fs';
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

if (!code.includes('import localforage')) {
  code = code.replace(/import React, { createContext, useContext, useState, useEffect } from 'react';/, "import React, { createContext, useContext, useState, useEffect } from 'react';\nimport localforage from 'localforage';");
}

code = code.replace(/const \[pdfs, setPdfsState\] = useState<PdfItem\[\]>\(\(\) => \{[\s\S]*?\}\);/, "const [pdfs, setPdfsState] = useState<PdfItem[]>(initialPdfs);");
code = code.replace(/const \[readingItems, setReadingItemsState\] = useState<ReadingItem\[\]>\(\(\) => \{[\s\S]*?\}\);/, "const [readingItems, setReadingItemsState] = useState<ReadingItem[]>(initialReadingItems);");

code = code.replace(/useEffect\(\(\) => setStored\('pdfs', pdfs\), \[pdfs\]\);/, "useEffect(() => { localforage.setItem('mba_cet_prep_v1_pdfs', pdfs).catch(console.error); }, [pdfs]);");
code = code.replace(/useEffect\(\(\) => setStored\('readingItems', readingItems\), \[readingItems\]\);/, "useEffect(() => { localforage.setItem('mba_cet_prep_v1_readingItems', readingItems).catch(console.error); }, [readingItems]);");

const effectToAdd = `  useEffect(() => {
    async function loadData() {
      try {
        const storedPdfs = await localforage.getItem<PdfItem[]>('mba_cet_prep_v1_pdfs');
        if (storedPdfs) {
          setPdfsState(storedPdfs);
        } else {
          // migrate from localstorage if possible, or use initial
          const lsPdfs = getStored('pdfs', initialPdfs);
          if (lsPdfs !== initialPdfs) {
             setPdfsState(lsPdfs);
             localforage.setItem('mba_cet_prep_v1_pdfs', lsPdfs);
          }
        }
        
        const storedReading = await localforage.getItem<ReadingItem[]>('mba_cet_prep_v1_readingItems');
        if (storedReading) {
          setReadingItemsState(storedReading);
        } else {
          const lsReading = getStored('readingItems', initialReadingItems);
          if (lsReading !== initialReadingItems) {
            setReadingItemsState(lsReading);
            localforage.setItem('mba_cet_prep_v1_readingItems', lsReading);
          }
        }
      } catch (e) {
        console.error('Error loading from localforage', e);
      }
    }
    loadData();
  }, []);

  // Sync state changes to Local Storage
`;

code = code.replace(/\/\/ Sync state changes to Local Storage\n/, effectToAdd);

fs.writeFileSync('src/context/AppContext.tsx', code);
console.log('updated AppContext');
