import fs from 'fs';
let code = fs.readFileSync('src/components/reading/ReadingMaterialView.tsx', 'utf8');

const oldListPdf = `              ) : item.url && item.url.startsWith('data:application/pdf') ? (
                <div className="mt-4 flex-1 flex justify-center items-center overflow-hidden rounded-md border border-white/10" style={{ maxHeight: '200px', cursor: 'pointer' }} onClick={() => setActiveArticle(item)}>
                  <Document file={item.url} loading={<div className="text-xs text-[#A9A9A9]">Loading PDF preview...</div>}>
                    <Page pageNumber={1} width={300} renderTextLayer={false} renderAnnotationLayer={false} className="max-w-full h-auto" />
                  </Document>
                </div>
              ) : (
                <p className="text-xs text-[#A9A9A9] mt-2 line-clamp-3 leading-relaxed flex-1">
                  {item.content.startsWith('[PDF Document:') ? '' : item.content}
                </p>
              )}`;

const newListPdf = `              ) : (item.url?.startsWith('data:application/pdf') || item.content.startsWith('[PDF Document:')) ? (
                <div className="mt-4 flex-1 flex justify-center items-center overflow-hidden rounded-md border border-white/10 bg-[#111]" style={{ maxHeight: '200px', cursor: 'pointer' }} onClick={() => setActiveArticle(item)}>
                  {item.url ? (
                    <Document file={item.url} loading={<div className="text-xs text-[#A9A9A9]">Loading PDF preview...</div>}>
                      <Page pageNumber={1} width={300} renderTextLayer={false} renderAnnotationLayer={false} className="max-w-full h-auto" />
                    </Document>
                  ) : (
                    <div className="text-xs text-[#A9A9A9] p-4 flex flex-col items-center">
                      <FileText className="w-8 h-8 mb-2 opacity-50" />
                      <span>PDF Document</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-[#A9A9A9] mt-2 line-clamp-3 leading-relaxed flex-1">
                  {item.content}
                </p>
              )}`;

code = code.replace(oldListPdf, newListPdf);
fs.writeFileSync('src/components/reading/ReadingMaterialView.tsx', code);
console.log('updated pdf in list');
