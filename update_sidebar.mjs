import fs from 'fs';
let code = fs.readFileSync('src/components/layout/Sidebar.tsx', 'utf8');

// Replace navigationItems
code = code.replace(
`  { name: 'PDF Library', icon: FolderArchive, hasSubItems: true, subItems: [
    { name: 'VARC' },
    { name: 'LRDI' },
    { name: 'QUANT' },
    { name: 'AR' }
  ]},`,
`  { name: 'PDF Library', icon: FolderArchive },`
);

// Replace pdfExpanded state
code = code.replace(
`  const [pdfExpanded, setPdfExpanded] = useState(true);`,
``
);

// Replace onClick handler
code = code.replace(
`                onClick={() => {
                  if (item.name === 'PDF Library') {
                    setPdfExpanded(!pdfExpanded);
                  }
                  setActiveTab(item.name);
                }}`,
`                onClick={() => setActiveTab(item.name)}`
);

// Remove chevron logic
code = code.replace(
`                {!isSidebarCollapsed && item.hasSubItems && (
                  <ChevronDown className={\`w-3.5 h-3.5 text-[#707085] transition-transform \${
                    item.name === 'PDF Library' && pdfExpanded ? 'rotate-180' : ''
                  }\`} />
                )}`,
``
);

// Remove sub-items for PDF Library logic
code = code.replace(
`              {/* Sub-items for PDF Library */}
              {!isSidebarCollapsed && item.name === 'PDF Library' && pdfExpanded && item.subItems && (
                <div className="ml-7 pl-2.5 my-1 border-l border-white/10 space-y-1">
                  {item.subItems.map(sub => (
                    <button
                      key={sub.name}
                      onClick={() => setActiveTab('PDF Library')}
                      className="w-full flex items-center space-x-2 py-1.5 px-2 text-[11px] font-medium text-[#9494ad] hover:text-white hover:bg-[#0f0f0f] rounded-lg transition-colors"
                    >
                      <Folder className="w-3.5 h-3.5" style={{ color: sub.color }} />
                      <span>{sub.name}</span>
                    </button>
                  ))}
                </div>
              )}`,
``
);

fs.writeFileSync('src/components/layout/Sidebar.tsx', code);
console.log('Sidebar updated');
