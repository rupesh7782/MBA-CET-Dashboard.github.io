import fs from 'fs';
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

if (!code.includes('updatePdfItem: (id: string, item: Partial<PdfItem>) => void;')) {
  code = code.replace(/updatePdfProgress: \(id: string, lastPageRead: number\) => void;/, "updatePdfProgress: (id: string, lastPageRead: number) => void;\n  updatePdfItem: (id: string, item: Partial<PdfItem>) => void;");
}

if (!code.includes('const updatePdfItem = (id: string, item: Partial<PdfItem>) => {')) {
  code = code.replace(/const updatePdfProgress = \(id: string, lastPageRead: number\) => \{\n    setPdfsState\(prev => prev.map\(p => p.id === id \? \{ \.\.\.p, lastPageRead \} : p\)\);\n  \};/, "const updatePdfProgress = (id: string, lastPageRead: number) => {\n    setPdfsState(prev => prev.map(p => p.id === id ? { ...p, lastPageRead } : p));\n  };\n\n  const updatePdfItem = (id: string, item: Partial<PdfItem>) => {\n    setPdfsState(prev => prev.map(p => p.id === id ? { ...p, ...item } : p));\n  };");
}

if (!code.includes('updatePdfProgress, updatePdfItem,')) {
  code = code.replace(/pdfs, addPdfItem, deletePdfItem, toggleBookmarkPdf, updatePdfProgress,/, "pdfs, addPdfItem, deletePdfItem, toggleBookmarkPdf, updatePdfProgress, updatePdfItem,");
}

fs.writeFileSync('src/context/AppContext.tsx', code);
console.log('done');
