import fs from 'fs';

let code = fs.readFileSync('src/components/reading/ReadingMaterialView.tsx', 'utf8');

const regex = /\{filteredItems\.map\(item => \([\s\S]*?className=\{`flex items-center space-x-1 text-xs px-2\.5 py-1 rounded-xl font-semibold transition-colors cursor-pointer \$\{[\s\S]*?item\.isRead \? 'Completed' : 'Mark Read'\}<\/span>\n\s*<\/button>\n\s*<\/div>\n\s*<\/div>\n\s*\)\)\}/m;

const replacement = `{filteredItems.map(item => (
          <div
            key={item.id}
            className={\`bg-[#0a0a0a] border rounded-[22px] p-5 flex flex-col justify-between transition-all group \${
              item.isRead ? 'border-white/5 opacity-80' : 'border-white/10 hover:border-[#FF7A00]/40'
            }\`}
          >
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FF7A00]/10 text-[#FF7A00]">
                  {item.category}
                </span>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => toggleBookmarkReading(item.id)}
                    className={\`p-1.5 rounded-lg transition-colors cursor-pointer \${
                      item.isBookmarked ? 'text-[#FF7A00]' : 'text-[#707070] hover:text-white'
                    }\`}
                    title="Bookmark"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 text-[#707070] hover:text-[#FFB547] cursor-pointer"
                    title="Edit article"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteReadingItem(item.id)}
                    className="p-1.5 text-[#707070] hover:text-[#FF5A5A] cursor-pointer"
                    title="Delete article"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 
                onClick={() => setActiveArticle(item)}
                className="text-[16px] font-bold text-white mt-4 cursor-pointer group-hover:text-[#FF7A00] transition-colors leading-snug"
              >
                {item.title}
              </h3>

              {item.imageUrl ? (
                <div className="mt-4 flex-1 flex justify-center items-center">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-auto object-contain rounded-sm" style={{ maxHeight: '200px' }} />
                </div>
              ) : (
                <p className="text-xs text-[#A9A9A9] mt-2 line-clamp-3 leading-relaxed flex-1">
                  {item.content}
                </p>
              )}
            </div>

            {!item.imageUrl && (
              <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center space-x-3 text-[11px] text-[#707070]">
                  <span>{item.source}</span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{item.readTimeMinutes} min</span>
                  </span>
                </div>

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
            )}
          </div>
        ))}`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/components/reading/ReadingMaterialView.tsx', code);
console.log('updated reading material view map');
