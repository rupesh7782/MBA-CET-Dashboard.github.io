import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calculator, Search, Bookmark, Plus, Copy, Trash2, 
  Check, Edit3, UploadCloud, FileText, ExternalLink, Eye,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { FormulaCategory, Formula } from '../../types';
import { Modal } from '../common/Modal';
import toast from 'react-hot-toast';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;


export const FormulaBookView: React.FC = () => {
  const { formulas, addFormula, updateFormula, deleteFormula, toggleBookmarkFormula } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingFormula, setEditingFormula] = useState<Formula | null>(null);
  const [viewingPdfFormula, setViewingPdfFormula] = useState<Formula | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pdfPageNumber, setPdfPageNumber] = useState<number>(1);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<FormulaCategory>('Arithmetic');
  const [formulaText, setFormulaText] = useState('');
  const [explanation, setExplanation] = useState('');
  const [examples, setExamples] = useState('');
  const [pdfUrl, setPdfUrl] = useState<string | undefined>(undefined);
  const [pdfFileName, setPdfFileName] = useState<string>('');

  const formulaFileInputRef = useRef<HTMLInputElement>(null);

  const openPdfModal = (f: Formula) => {
    setViewingPdfFormula(f);
    setPdfPageNumber(1);
    setNumPages(null);
  };

  const handleOpenInNewTab = (url: string) => {
    if (!url) return;
    if (url.startsWith('data:')) {
      try {
        const base64Data = url.split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
      } catch (e) {
        console.error('Error opening PDF:', e);
        window.open(url, '_blank');
      }
    } else {
      window.open(url, '_blank');
    }
  };

  const filteredFormulas = formulas.filter(f => {
    const matchesCategory = selectedCategory === 'All' || f.category === selectedCategory;
    const matchesSearch = f.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          f.formula.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.explanation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Formula copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      if (!title.trim()) setTitle(file.name.replace(/\.[^/.]+$/, ''));
      if (!formulaText.trim()) setFormulaText(`Formula Sheet PDF: ${file.name}`);
      toast.success(`Attached PDF "${file.name}"`);
    };
    reader.onerror = () => {
      toast.error('Failed to read PDF file');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingFormula) {
      updateFormula(editingFormula.id, {
        title,
        category,
        formula: formulaText || 'See attached PDF formula sheet',
        explanation,
        examples,
        pdfUrl: pdfUrl || editingFormula.pdfUrl,
      });
      toast.success('Formula updated successfully!');
    } else {
      addFormula({
        title,
        category,
        formula: formulaText || 'See attached PDF formula sheet',
        explanation,
        examples,
        pdfUrl,
        isBookmarked: false,
      });
    }

    setIsAddOpen(false);
    resetForm();
  };

  const openEditModal = (f: Formula) => {
    setEditingFormula(f);
    setTitle(f.title);
    setCategory(f.category);
    setFormulaText(f.formula);
    setExplanation(f.explanation);
    setExamples(f.examples || '');
    setPdfUrl(f.pdfUrl);
    setPdfFileName(f.pdfUrl ? 'Attached Formula PDF' : '');
    setIsAddOpen(true);
  };

  const resetForm = () => {
    setTitle('');
    setCategory('Arithmetic');
    setFormulaText('');
    setExplanation('');
    setExamples('');
    setPdfUrl(undefined);
    setPdfFileName('');
    setEditingFormula(null);
  };

  return (
    <div className="space-y-6 pb-12">
      <input 
        type="file" 
        ref={formulaFileInputRef} 
        onChange={handlePdfUpload} 
        accept="application/pdf,.pdf" 
        className="hidden" 
      />

      {/* Banner */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-[22px] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-[#FF7A00]" />
            <span>MBA CET Quant & LR Shortcuts Formula Book</span>
          </h2>
          <p className="text-xs text-[#A9A9A9] mt-1">
            Essential arithmetic, algebra, geometry formulas and downloadable formula PDFs
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => { resetForm(); setIsAddOpen(true); }}
            className="px-5 py-2.5 bg-[#FF7A00] text-black font-bold rounded-[14px] hover:bg-[#FFB547] transition-all flex items-center space-x-2 text-xs shadow-lg shadow-[#FF7A00]/20 cursor-pointer"
            id="formula-add-btn"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Formula / PDF Sheet</span>
          </button>
        </div>
      </div>

      {/* Categories & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
          {['All', 'Quant', 'Arithmetic', 'Algebra', 'Geometry', 'Modern Maths', 'Data Interpretation', 'Shortcuts'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex-shrink-0 cursor-pointer ${
                selectedCategory === cat 
                  ? 'bg-[#FF7A00] text-black' 
                  : 'bg-[#0a0a0a] text-[#A9A9A9] border border-white/5 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#707070] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search formulas or sheets..."
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#707070] focus:outline-none focus:border-[#FF7A00]"
          />
        </div>
      </div>

      {/* Formula Cards */}
      <div className="flex flex-wrap gap-4">
        {filteredFormulas.map(f => (
          <div
            key={f.id}
            className="bg-[#0a0a0a] border border-white/5 hover:border-[#FF7A00]/40 rounded-[20px] p-3 flex flex-col justify-between transition-all group w-[201px] h-[224px] overflow-hidden"
          >
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between shrink-0">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FF7A00]/10 text-[#FF7A00] truncate max-w-[120px]">
                  {f.category}
                </span>

                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    onClick={() => handleCopy(f.id, f.formula)}
                    className="p-1 text-[#707070] hover:text-white rounded-lg hover:bg-white/5 cursor-pointer"
                    title="Copy formula"
                  >
                    {copiedId === f.id ? <Check className="w-3.5 h-3.5 text-[#38E27A]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => toggleBookmarkFormula(f.id)}
                    className={`p-1 rounded-lg transition-colors cursor-pointer ${
                      f.isBookmarked ? 'text-[#FF7A00]' : 'text-[#707070] hover:text-white'
                    }`}
                    title="Bookmark"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => openEditModal(f)}
                    className="p-1 text-[#707070] hover:text-[#FFB547] cursor-pointer"
                    title="Edit formula"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteFormula(f.id)}
                    className="p-1 text-[#707070] hover:text-[#FF5A5A] cursor-pointer"
                    title="Delete formula"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-xs font-bold text-white mt-1.5 truncate shrink-0">{f.title}</h3>

              {/* PDF Preview Image below text */}
              {f.pdfUrl ? (
                <div 
                  className="mt-1.5 w-full h-[110px] shrink-0 flex justify-center items-start overflow-hidden rounded-lg border border-white/10 bg-[#111]" 
                  style={{ cursor: 'pointer' }} 
                  onClick={() => openPdfModal(f)}
                >
                  <Document 
                    file={f.pdfUrl} 
                    loading={<div className="text-[10px] text-[#A9A9A9] p-2">Loading PDF...</div>}
                    className="w-full h-full flex justify-center items-start overflow-hidden"
                  >
                    <Page 
                      pageNumber={1} 
                      width={280} 
                      renderTextLayer={false} 
                      renderAnnotationLayer={false} 
                      className="w-full h-full [&_.react-pdf\_\_Page]:!w-full [&_.react-pdf\_\_Page]:!h-full [&_.react-pdf\_\_Page\_\_canvas]:!w-full [&_.react-pdf\_\_Page\_\_canvas]:!h-full [&_.react-pdf\_\_Page\_\_canvas]:!object-cover [&_.react-pdf\_\_Page\_\_canvas]:!object-top" 
                    />
                  </Document>
                </div>
              ) : (
                f.formula && (
                  <div className="mt-1.5 p-2 bg-[#111111] border border-white/10 rounded-xl font-mono text-[11px] font-bold text-[#FFB547] leading-tight select-all line-clamp-2 shrink-0">
                    {f.formula}
                  </div>
                )
              )}

              {f.explanation && !f.pdfUrl && (
                <p className="text-[11px] text-[#A9A9A9] mt-1.5 leading-snug line-clamp-2 overflow-hidden">{f.explanation}</p>
              )}

              {f.examples && !f.pdfUrl && (
                <div className="mt-1.5 p-1.5 bg-[#141414]/70 rounded-lg border border-white/5 text-[10px] text-[#A9A9A9] line-clamp-1 truncate">
                  <span className="font-bold text-white mr-1">Ex:</span>
                  {f.examples}
                </div>
              )}
            </div>

            {/* PDF Badge / View PDF button */}
            {f.pdfUrl && (
              <div className="mt-1.5 pt-1.5 border-t border-white/5 flex items-center justify-between shrink-0">
                <span className="text-[10px] font-bold text-[#38E27A] flex items-center space-x-1 truncate">
                  <FileText className="w-3 h-3 shrink-0" />
                  <span className="truncate">Formula PDF</span>
                </span>
                <button
                  onClick={() => openPdfModal(f)}
                  className="px-2 py-0.5 bg-[#FF7A00]/20 text-[#FF7A00] hover:bg-[#FF7A00] hover:text-black rounded-lg text-[10px] font-bold transition-all flex items-center space-x-1 cursor-pointer whitespace-nowrap"
                >
                  <Eye className="w-3 h-3" />
                  <span>View</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* PDF Viewing Modal */}
      {viewingPdfFormula && viewingPdfFormula.pdfUrl && (
        <Modal
          isOpen={!!viewingPdfFormula}
          onClose={() => setViewingPdfFormula(null)}
          title={viewingPdfFormula.title}
          subtitle={`Category: ${viewingPdfFormula.category} • Formula PDF Document`}
          maxWidth="max-w-5xl"
        >
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={() => viewingPdfFormula.pdfUrl && handleOpenInNewTab(viewingPdfFormula.pdfUrl)}
                className="px-4 py-2 bg-[#FF7A00] text-black rounded-xl text-xs font-bold flex items-center space-x-1.5 hover:bg-[#FFB547] transition-all cursor-pointer"
              >
                <span>Open PDF in New Tab</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
            {viewingPdfFormula.pdfUrl.startsWith('blob:') || viewingPdfFormula.pdfUrl.startsWith('data:') ? (
              <div className="w-full h-[550px] overflow-auto bg-[#111] border border-white/10 rounded-[18px] flex justify-center custom-scrollbar">
                <Document
                  file={viewingPdfFormula.pdfUrl}
                  onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                  loading={<div className="p-8 text-[#A9A9A9]">Loading PDF...</div>}
                  className="max-w-full"
                >
                  <Page 
                    pageNumber={pdfPageNumber} 
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    className="max-w-full bg-white"
                    width={800}
                  />
                </Document>
              </div>
            ) : (
              <iframe
                src={viewingPdfFormula.pdfUrl}
                title={viewingPdfFormula.title}
                className="w-full h-[550px] bg-black border border-white/10 rounded-[18px]"
              />
            )}

            {/* Page Navigation Controls */}
            <div className="flex items-center justify-between bg-[#111111] p-3 rounded-2xl border border-white/5">
              <button
                disabled={pdfPageNumber <= 1}
                onClick={() => setPdfPageNumber(prev => Math.max(1, prev - 1))}
                className="px-4 py-2 bg-[#141414] hover:bg-white/10 disabled:opacity-40 text-white text-xs font-semibold rounded-xl flex items-center space-x-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Page</span>
              </button>

              <span className="text-xs text-white font-bold">
                Page {pdfPageNumber} / {numPages || 1}
              </span>

              <button
                disabled={numPages ? pdfPageNumber >= numPages : false}
                onClick={() => setPdfPageNumber(prev => Math.min(numPages || 1, prev + 1))}
                className="px-4 py-2 bg-[#FF7A00] text-black font-bold text-xs rounded-xl flex items-center space-x-1 hover:bg-[#FFB547] cursor-pointer"
              >
                <span>Next Page</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add / Edit Formula Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => { setIsAddOpen(false); resetForm(); }}
        title={editingFormula ? "Edit Formula / PDF Sheet" : "Add Formula to Reference Book"}
        subtitle="Store shortcut formulas, rules, or attach PDF sheets"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Formula PDF Upload Button */}
          <div 
            onClick={() => formulaFileInputRef.current?.click()}
            className={`p-4 border-2 border-dashed rounded-[18px] text-center cursor-pointer transition-all flex items-center justify-center space-x-3 ${
              pdfFileName 
                ? 'border-[#38E27A] bg-[#38E27A]/10 text-[#38E27A]' 
                : 'border-white/10 hover:border-[#FF7A00] bg-[#111111]/50 text-white'
            }`}
          >
            <UploadCloud className="w-5 h-5 text-[#FF7A00]" />
            <span className="font-medium">
              {pdfFileName ? `Attached: ${pdfFileName}` : "Click to Upload Formula PDF Sheet (.pdf)"}
            </span>
          </div>

          <div>
            <label className="block text-[#A9A9A9] mb-1 font-medium">Formula Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Remainder Theorem Shortcut"
              className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2.5 text-white focus:outline-none focus:border-[#FF7A00]"
            />
          </div>

          <div>
            <label className="block text-[#A9A9A9] mb-1 font-medium">Category</label>
            <select
              value={category}
              onChange={(e: any) => setCategory(e.target.value)}
              className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2 text-white focus:outline-none focus:border-[#FF7A00]"
            >
              <option value="Quant">Quant</option>
              <option value="Arithmetic">Arithmetic</option>
              <option value="Algebra">Algebra</option>
              <option value="Geometry">Geometry</option>
              <option value="Modern Maths">Modern Maths</option>
              <option value="Data Interpretation">Data Interpretation</option>
              <option value="Shortcuts">Shortcuts</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-white/5">
            <button
              type="button"
              onClick={() => { setIsAddOpen(false); resetForm(); }}
              className="px-4 py-2 text-[#A9A9A9] hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#FF7A00] text-black font-bold rounded-[14px] hover:bg-[#FFB547] cursor-pointer"
            >
              {editingFormula ? "Update Formula" : "Save Formula"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
