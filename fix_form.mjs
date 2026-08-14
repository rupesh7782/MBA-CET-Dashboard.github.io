import fs from 'fs';
let code = fs.readFileSync('src/components/reading/ReadingMaterialView.tsx', 'utf8');

code = code.replace(/if \(!title\.trim\(\) \|\| !content\.trim\(\)\) return;/g, "if (!title.trim()) return;");

const oldFormFields = `          <div className={(fileUrl?.startsWith('data:application/pdf') || content.startsWith('[PDF Document:')) ? "block" : "grid grid-cols-2 gap-3"}>
            <div>
              <label className="block text-[#A9A9A9] mb-1 font-medium">Category</label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2 text-white focus:outline-none focus:border-[#FF7A00]"
              >
                <option value="Editorials">Editorials</option>
                <option value="Articles">Articles</option>
                <option value="Books">Books</option>
                <option value="Newspapers">Newspapers</option>
                <option value="Current Affairs">Current Affairs</option>
                <option value="Journals">Journals</option>
              </select>
            </div>

            {!(fileUrl?.startsWith('data:application/pdf') || content.startsWith('[PDF Document:')) && (
              <div>
                <label className="block text-[#A9A9A9] mb-1 font-medium">Source</label>
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2 text-white focus:outline-none focus:border-[#FF7A00]"
                />
              </div>
            )}
          </div>

          {!(fileUrl?.startsWith('data:application/pdf') || content.startsWith('[PDF Document:')) ? (
            <div>
              <label className="block text-[#A9A9A9] mb-1 font-medium">Article Text Content</label>
              <textarea
                rows={6}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste article paragraphs here..."
                className="w-full bg-[#111111] border border-white/10 rounded-[16px] p-3 text-white focus:outline-none focus:border-[#FF7A00]"
              />
            </div>
          ) : (
            <div>
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
            </div>
          )}`;

const newFormFields = `          <div>
            <label className="block text-[#A9A9A9] mb-1 font-medium">Category</label>
            <select
              value={category}
              onChange={(e: any) => setCategory(e.target.value)}
              className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2 text-white focus:outline-none focus:border-[#FF7A00]"
            >
              <option value="Editorials">Editorials</option>
              <option value="Articles">Articles</option>
              <option value="Books">Books</option>
              <option value="Newspapers">Newspapers</option>
              <option value="Current Affairs">Current Affairs</option>
              <option value="Journals">Journals</option>
            </select>
          </div>

          {(fileUrl?.startsWith('data:application/pdf') || content.startsWith('[PDF Document:')) && (
            <div>
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
            </div>
          )}`;

code = code.replace(oldFormFields, newFormFields);

fs.writeFileSync('src/components/reading/ReadingMaterialView.tsx', code);
console.log('updated form fields');
