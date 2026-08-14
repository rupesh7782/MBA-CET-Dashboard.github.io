import fs from 'fs';
let code = fs.readFileSync('src/components/reading/ReadingMaterialView.tsx', 'utf8');

const regex = /\} else if \(file\.type === 'application\/pdf' \|\| file\.name\.endsWith\('\.pdf'\)\) \{[\s\S]*?toast\.success\(\`Loaded PDF: \$\{file\.name\}\`\);\n    \}/m;

const newHandle = `} else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setTitle(file.name.replace(/\\.[^/.]+$/, ''));
        setSource('Uploaded Document');
        setContent(\`[PDF Document: \${file.name}]\`);
        setFileUrl(base64String);
        setReadTimeMinutes(5); // Default for PDF
        toast.success(\`Loaded PDF: \${file.name}\`);
      };
      reader.onerror = () => {
        toast.error('Failed to read PDF file');
      };
      reader.readAsDataURL(file);
    }`;

code = code.replace(regex, newHandle);
fs.writeFileSync('src/components/reading/ReadingMaterialView.tsx', code);
console.log('updated reading material view');
