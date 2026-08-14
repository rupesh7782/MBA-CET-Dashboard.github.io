import fs from 'fs';
let code = fs.readFileSync('src/components/pdf/PdfLibraryView.tsx', 'utf8');

const oldOpenRegex = /<a[\s\S]*?>[\s\S]*?<span>Open in Full Screen \/ New Tab<\/span>[\s\S]*?<\/a>/;

const newOpen = `<button 
                    onClick={() => {
                      if (!activePdf.url) return;
                      if (activePdf.url.startsWith('data:')) {
                        try {
                          const base64Data = activePdf.url.split(',')[1];
                          const byteCharacters = atob(base64Data);
                          const byteNumbers = new Array(byteCharacters.length);
                          for (let i = 0; i < byteCharacters.length; i++) {
                            byteNumbers[i] = byteCharacters.charCodeAt(i);
                          }
                          const byteArray = new Uint8Array(byteNumbers);
                          const blob = new Blob([byteArray], {type: 'application/pdf'});
                          const blobUrl = URL.createObjectURL(blob);
                          window.open(blobUrl, '_blank');
                        } catch (e) {
                          console.error(e);
                        }
                      } else {
                        window.open(activePdf.url, '_blank');
                      }
                    }}
                    className="px-3.5 py-1.5 bg-[#FF7A00]/20 text-[#FF7A00] border border-[#FF7A00]/30 rounded-xl text-xs font-bold flex items-center space-x-1.5 hover:bg-[#FF7A00] hover:text-black transition-all cursor-pointer"
                  >
                    <span>Open in Full Screen / New Tab</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>`;

code = code.replace(oldOpenRegex, newOpen);
fs.writeFileSync('src/components/pdf/PdfLibraryView.tsx', code);
console.log('updated open in new tab');
