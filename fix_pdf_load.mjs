import fs from 'fs';
let code = fs.readFileSync('src/components/pdf/PdfLibraryView.tsx', 'utf8');

code = code.replace(
  "const { pdfs, addPdfItem, deletePdfItem, toggleBookmarkPdf, updatePdfProgress } = useApp();",
  "const { pdfs, addPdfItem, deletePdfItem, toggleBookmarkPdf, updatePdfProgress, updatePdfItem } = useApp();"
);

const oldLoad = `  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPdfError(null);
  }`;

const newLoad = `  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPdfError(null);
    if (activePdf && activePdf.pageCount !== numPages) {
      updatePdfItem(activePdf.id, { pageCount: numPages });
      setActivePdf({ ...activePdf, pageCount: numPages });
    }
  }`;

code = code.replace(oldLoad, newLoad);
fs.writeFileSync('src/components/pdf/PdfLibraryView.tsx', code);
console.log('updated load success');
