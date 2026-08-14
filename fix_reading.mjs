import fs from 'fs';
let code = fs.readFileSync('src/components/reading/ReadingMaterialView.tsx', 'utf8');

const targetStr = `
                <button
                  onClick={() => toggleReadReading(item.id)}
                  className={\`flex items-center space-x-1 text-xs px-2.5 py-1 rounded-xl font-semibold transition-colors cursor-pointer \${
                    item.isRead ? 'bg-[#38E27A]/20 text-[#38E27A]' : 'bg-white/5 text-[#A9A9A9] hover:text-white'
                  }\`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{item.isRead ? 'Completed' : 'Mark Read'}</span>
                </button>
              </div>`;

const newStr = `
                <div className="flex items-center space-x-2">
                  {item.url && (
                    <button
                      onClick={() => setActiveArticle(item)}
                      className="flex items-center space-x-1 text-xs px-2.5 py-1 rounded-xl font-semibold bg-[#FF7A00]/10 text-[#FF7A00] transition-colors cursor-pointer hover:bg-[#FF7A00]/20"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View PDF</span>
                    </button>
                  )}
                  <button
                    onClick={() => toggleReadReading(item.id)}
                    className={\`flex items-center space-x-1 text-xs px-2.5 py-1 rounded-xl font-semibold transition-colors cursor-pointer \${
                      item.isRead ? 'bg-[#38E27A]/20 text-[#38E27A]' : 'bg-white/5 text-[#A9A9A9] hover:text-white'
                    }\`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{item.isRead ? 'Completed' : 'Mark Read'}</span>
                  </button>
                </div>
              </div>`;

code = code.replace(targetStr, newStr);

fs.writeFileSync('src/components/reading/ReadingMaterialView.tsx', code);
console.log('updated reading view');
