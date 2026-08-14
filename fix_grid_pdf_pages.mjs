import fs from 'fs';
let code = fs.readFileSync('src/components/pdf/PdfLibraryView.tsx', 'utf8');

const docStart = `<Document file={pdf.url} loading={<div className="text-[10px] text-[#A9A9A9] p-4">Loading preview...</div>}>`;
const newDocStart = `<Document 
                    file={pdf.url} 
                    loading={<div className="text-[10px] text-[#A9A9A9] p-4">Loading preview...</div>}
                    onLoadSuccess={({numPages}) => {
                      if (pdf.pageCount !== numPages) {
                        updatePdfItem(pdf.id, { pageCount: numPages });
                      }
                    }}
                  >`;

code = code.replace(docStart, newDocStart);
fs.writeFileSync('src/components/pdf/PdfLibraryView.tsx', code);
console.log('updated grid doc load');
