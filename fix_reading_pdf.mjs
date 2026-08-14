import fs from 'fs';
let code = fs.readFileSync('src/components/reading/ReadingMaterialView.tsx', 'utf8');

const oldContentSection = `              {item.imageUrl ? (
                <div className="mt-4 flex-1 flex justify-center items-center">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-auto object-cover rounded-sm shadow-md" style={{ maxHeight: '280px' }} />
                </div>
              ) : (
                <p className="text-xs text-[#A9A9A9] mt-2 line-clamp-3 leading-relaxed flex-1">
                  {item.content}
                </p>
              )}`;

const newContentSection = `              {item.imageUrl ? (
                <div className="mt-4 flex-1 flex justify-center items-center">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-auto object-cover rounded-sm shadow-md" style={{ maxHeight: '280px' }} />
                </div>
              ) : item.url && item.url.startsWith('data:application/pdf') ? (
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

code = code.replace(oldContentSection, newContentSection);

const oldMetaSection = `                <div className="flex items-center space-x-3 text-[11px] text-[#707070]">
                  <span>{item.source}</span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{item.readTimeMinutes} min</span>
                  </span>
                </div>`;

const newMetaSection = `                <div className="flex items-center space-x-3 text-[11px] text-[#707070]">
                  {item.source !== 'Uploaded Document' && (
                    <>
                      <span>{item.source}</span>
                      <span>•</span>
                    </>
                  )}
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{item.readTimeMinutes} min</span>
                  </span>
                </div>`;

code = code.replace(oldMetaSection, newMetaSection);

fs.writeFileSync('src/components/reading/ReadingMaterialView.tsx', code);
console.log('updated pdf preview');
