import fs from 'fs';
let code = fs.readFileSync('src/components/formula/FormulaBookView.tsx', 'utf8');

const regex = /\{viewingPdfFormula\.pdfUrl\.startsWith\('blob:'\) \|\| viewingPdfFormula\.pdfUrl\.startsWith\('data:'\) \? \([\s\S]*?<\/iframe>\s*\)\}/;

const replacement = `
            <div className="w-full h-[550px] overflow-auto bg-[#111] border border-white/10 rounded-[18px] flex justify-center custom-scrollbar">
              <Document
                file={viewingPdfFormula.pdfUrl}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                loading={<div className="p-8 text-[#A9A9A9]">Loading PDF...</div>}
                className="max-w-full"
              >
                {Array.from(new Array(numPages || 1), (el, index) => (
                  <Page 
                    key={\`page_\${index + 1}\`}
                    pageNumber={index + 1} 
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    className="max-w-full bg-white mb-4"
                    width={800}
                  />
                ))}
              </Document>
            </div>
`;

code = code.replace(regex, replacement.trim());
fs.writeFileSync('src/components/formula/FormulaBookView.tsx', code);
