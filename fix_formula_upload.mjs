import fs from 'fs';
let code = fs.readFileSync('src/components/formula/FormulaBookView.tsx', 'utf8');

const regex = /const handlePdfUpload = \(e: React\.ChangeEvent<HTMLInputElement>\) => \{([\s\S]*?)\};\n\n  const handleSubmit/m;

const newHandle = `const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      toast.error('Please upload a valid PDF document');
      return;
    }

    // Convert file to base64 for local storage persistence
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setPdfUrl(base64String);
      setPdfFileName(file.name);
      if (!title.trim()) setTitle(file.name.replace(/\\.[^/.]+$/, ''));
      if (!formulaText.trim()) setFormulaText(\`Formula Sheet PDF: \${file.name}\`);
      toast.success(\`Attached PDF "\${file.name}"\`);
    };
    reader.onerror = () => {
      toast.error('Failed to read PDF file');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit`;

code = code.replace(regex, newHandle);
fs.writeFileSync('src/components/formula/FormulaBookView.tsx', code);
console.log('updated formula book');
