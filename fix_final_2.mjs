import fs from 'fs';
let code = fs.readFileSync('src/components/reading/ReadingMaterialView.tsx', 'utf8');

const oldStr = `                <div className="flex items-center space-x-3 text-[11px] text-[#707070]">
                  {item.source !== 'Uploaded Document' && (
                    <>
                      <span>{item.source}</span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{item.readTimeMinutes} min</span>
                      </span>
                    </>
                  )}
                  {item.url && (
                    <button
                      onClick={() => setActiveArticle(item)}
                      className="flex items-center space-x-1 text-xs px-2.5 py-1 rounded-xl font-semibold bg-[#FF7A00]/10 text-[#FF7A00] transition-colors cursor-pointer hover:bg-[#FF7A00]/20"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View PDF</span>
                    </button>
                  )}
                </div>`;

const newStr = `                <div className="flex items-center space-x-3 text-[11px] text-[#707070]">
                  {item.source !== 'Uploaded Document' && item.source && (
                    <span className="text-[#A9A9A9]">{item.source}</span>
                  )}
                  {item.url && (
                    <button
                      onClick={() => setActiveArticle(item)}
                      className="flex items-center space-x-1 text-xs px-2.5 py-1 rounded-xl font-semibold bg-[#FF7A00]/10 text-[#FF7A00] transition-colors cursor-pointer hover:bg-[#FF7A00]/20"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View PDF</span>
                    </button>
                  )}
                </div>`;

code = code.replace(oldStr, newStr);

fs.writeFileSync('src/components/reading/ReadingMaterialView.tsx', code);
console.log('updated bottom bar 2');
