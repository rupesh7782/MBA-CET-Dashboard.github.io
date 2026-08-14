import fs from 'fs';
let code = fs.readFileSync('src/components/pdf/PdfLibraryView.tsx', 'utf8');

const regex = /const handleUploadSubmit = \(e: React\.FormEvent\) => \{[\s\S]*?setSelectedFile\(null\);\n    \}\n  \};/m;

const newHandle = `const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const title = uploadTitle.trim() || (selectedFile ? selectedFile.name : 'Untitled Document.pdf');

    if (selectedFile) {
      const mbSize = (selectedFile.size / (1024 * 1024)).toFixed(1);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        addPdfItem({
          title: title.endsWith('.pdf') ? title : \`\${title}.pdf\`,
          folder: uploadFolder,
          fileSize: \`\${mbSize} MB\`,
          url: base64String,
          isBookmarked: false,
          pageCount: Math.max(10, Math.floor(selectedFile.size / 100000)),
          lastPageRead: 1,
        });
        
        setIsUploadOpen(false);
        setUploadTitle('');
        setSelectedFile(null);
        toast.success(\`Added PDF "\${title}"\`);
      };
      reader.onerror = () => {
        toast.error('Failed to read PDF file');
      };
      reader.readAsDataURL(selectedFile);
    } else {
      addPdfItem({
        title: title.endsWith('.pdf') ? title : \`\${title}.pdf\`,
        folder: uploadFolder,
        fileSize: '5.2 MB',
        url: undefined,
        isBookmarked: false,
        pageCount: 100,
        lastPageRead: 1,
      });
      setIsUploadOpen(false);
      setUploadTitle('');
      setSelectedFile(null);
    }
  };`;

code = code.replace(regex, newHandle);
fs.writeFileSync('src/components/pdf/PdfLibraryView.tsx', code);
console.log('updated pdf library upload');
