import fs from 'fs';
let code = fs.readFileSync('src/components/reading/ReadingMaterialView.tsx', 'utf8');

const oldPreview = `            <div>
              <label className="block text-[#A9A9A9] mb-1 font-medium">PDF Preview</label>
              <div className="w-full h-[300px] overflow-auto rounded-[16px] bg-[#111111] border border-white/10 flex justify-center custom-scrollbar">
                <Document
                  file={fileUrl}
                  loading={<div className="p-8 text-[#A9A9A9]">Loading PDF preview...</div>}
                  className="max-w-full"
                >
                  <Page
                    pageNumber={1}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    className="max-w-full bg-white"
                    width={400}
                  />
                </Document>
              </div>
            </div>`;

const newPreview = `            <div>
              <label className="block text-[#A9A9A9] mb-1 font-medium">PDF Preview</label>
              <div className="w-full h-[300px] overflow-auto rounded-[16px] bg-[#111111] border border-white/10 flex justify-center custom-scrollbar">
                {fileUrl ? (
                  <Document
                    file={fileUrl}
                    loading={<div className="p-8 text-[#A9A9A9]">Loading PDF preview...</div>}
                    className="max-w-full"
                  >
                    <Page
                      pageNumber={1}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      className="max-w-full bg-white"
                      width={400}
                    />
                  </Document>
                ) : (
                  <div className="p-8 text-[#A9A9A9] flex items-center h-full">PDF file loaded. Preview not available for this item.</div>
                )}
              </div>
            </div>`;

code = code.replace(oldPreview, newPreview);
fs.writeFileSync('src/components/reading/ReadingMaterialView.tsx', code);
console.log('updated pdf preview in modal');
