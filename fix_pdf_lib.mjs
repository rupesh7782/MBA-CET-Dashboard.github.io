import fs from 'fs';
let code = fs.readFileSync('src/components/pdf/PdfLibraryView.tsx', 'utf8');

const oldStr = `            <div>
              <div className="flex items-start w-full">
                {pdf.url ? (
                  <div className="w-full flex justify-center items-start overflow-hidden rounded-md border border-white/10 bg-[#111]" style={{ maxHeight: '160px', cursor: 'pointer' }} onClick={() => setActivePdf(pdf)}>
                    <Document file={pdf.url} loading={<div className="text-[10px] text-[#A9A9A9] p-4">Loading preview...</div>}>
                      <Page pageNumber={1} width={300} renderTextLayer={false} renderAnnotationLayer={false} className="max-w-full h-auto" />
                    </Document>
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-[#FF5A5A]/10 text-[#FF5A5A] flex items-center justify-center font-bold text-xs">
                    PDF
                  </div>
                )}
              </div>

              <h3 
                onClick={() => setActivePdf(pdf)}
                className="text-sm font-bold text-white mt-4 line-clamp-2 cursor-pointer group-hover:text-[#FF7A00] transition-colors"
              >
                {pdf.title}
              </h3>

              <div className="flex items-center space-x-2 mt-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-[#FFB547]">
                  {pdf.folder}
                </span>
                <span className="text-[10px] text-[#707070]">{pdf.fileSize}</span>
              </div>
            </div>`;

const newStr = `            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FF7A00]/10 text-[#FF7A00]">
                    {pdf.folder}
                  </span>
                  <span className="text-[10px] text-[#707070]">{pdf.fileSize}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => toggleBookmarkPdf(pdf.id)}
                    className={\`p-1.5 rounded-lg transition-colors cursor-pointer \${
                      pdf.isBookmarked ? 'text-[#FF7A00]' : 'text-[#707070] hover:text-white'
                    }\`}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deletePdfItem(pdf.id)}
                    className="p-1.5 text-[#707070] hover:text-[#FF5A5A] rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 
                onClick={() => setActivePdf(pdf)}
                className="text-[16px] font-bold text-white mt-4 cursor-pointer group-hover:text-[#FF7A00] transition-colors leading-snug"
              >
                {pdf.title}
              </h3>

              {pdf.url ? (
                <div className="mt-4 w-full flex justify-center items-start overflow-hidden rounded-md border border-white/10 bg-[#111]" style={{ height: '220px', cursor: 'pointer' }} onClick={() => setActivePdf(pdf)}>
                  <Document file={pdf.url} loading={<div className="text-[10px] text-[#A9A9A9] p-4">Loading preview...</div>}>
                    <Page pageNumber={1} width={340} renderTextLayer={false} renderAnnotationLayer={false} className="max-w-full h-auto" />
                  </Document>
                </div>
              ) : (
                <div className="mt-4 flex-1 flex flex-col items-center justify-center min-h-[120px] rounded-md border border-white/10 bg-[#111]">
                  <div className="w-10 h-10 rounded-xl bg-[#FF5A5A]/10 text-[#FF5A5A] flex items-center justify-center font-bold text-xs mb-2">
                    PDF
                  </div>
                </div>
              )}
            </div>`;

const oldBottom = `            <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] text-[#A9A9A9]">
                Pg {pdf.lastPageRead} of {pdf.pageCount}
              </span>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => toggleBookmarkPdf(pdf.id)}
                  className={\`p-1.5 rounded-lg transition-colors cursor-pointer \${
                    pdf.isBookmarked ? 'bg-[#FF7A00]/20 text-[#FF7A00]' : 'text-[#707070] hover:text-white hover:bg-white/5'
                  }\`}
                >
                  <Bookmark className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActivePdf(pdf)}
                  className="px-3 py-1.5 bg-[#141414] hover:bg-[#FF7A00] hover:text-black text-white rounded-xl text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Read</span>
                </button>
                <button
                  onClick={() => deletePdfItem(pdf.id)}
                  className="p-1.5 text-[#707070] hover:text-[#FF5A5A] hover:bg-white/5 rounded-lg cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>`;

const newBottom = `            <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] text-[#A9A9A9]">
                Pg {pdf.lastPageRead} of {pdf.pageCount}
              </span>

              <button
                onClick={() => setActivePdf(pdf)}
                className="px-4 py-1.5 bg-[#141414] hover:bg-[#FF7A00] hover:text-black text-white rounded-xl text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Read Document</span>
              </button>
            </div>`;

code = code.replace(oldStr, newStr);
code = code.replace(oldBottom, newBottom);

fs.writeFileSync('src/components/pdf/PdfLibraryView.tsx', code);
console.log('updated pdf library list UI');
