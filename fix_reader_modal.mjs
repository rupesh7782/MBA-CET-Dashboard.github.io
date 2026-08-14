import fs from 'fs';
let code = fs.readFileSync('src/components/reading/ReadingMaterialView.tsx', 'utf8');

const oldModalContent = `            {activeArticle.url ? (
              <div className="w-full h-[550px] overflow-auto rounded-[18px] bg-[#111] border border-white/10 flex justify-center custom-scrollbar relative">
                <Document
                  file={activeArticle.url}
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
                      width={700}
                    />
                  ))}
                </Document>
              </div>
            ) : (
              <div className="prose prose-invert max-w-none text-sm leading-relaxed p-2 whitespace-pre-wrap">
                {activeArticle.content}
              </div>
            )}`;

const newModalContent = `            {activeArticle.url ? (
              <div className="w-full h-[550px] overflow-auto rounded-[18px] bg-[#111] border border-white/10 flex justify-center custom-scrollbar relative">
                <Document
                  file={activeArticle.url}
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
                      width={700}
                    />
                  ))}
                </Document>
              </div>
            ) : (
              <div className="prose prose-invert max-w-none text-sm leading-relaxed p-2 whitespace-pre-wrap">
                {activeArticle.content.startsWith('[PDF Document:') 
                  ? "PDF file loaded. Preview not available because the file data was not preserved. Please re-upload the PDF to view it." 
                  : activeArticle.content}
              </div>
            )}`;

code = code.replace(oldModalContent, newModalContent);
fs.writeFileSync('src/components/reading/ReadingMaterialView.tsx', code);
console.log('updated reader modal');
