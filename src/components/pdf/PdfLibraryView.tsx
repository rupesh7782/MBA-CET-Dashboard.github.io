import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FolderArchive, UploadCloud, Search, Bookmark, 
  Trash2, BookOpen, ChevronLeft, ChevronRight, FileText, ExternalLink, FileCheck
} from 'lucide-react';
import { Subject, PdfItem } from '../../types';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

import { Modal } from '../common/Modal';
import toast from 'react-hot-toast';

export const PdfLibraryView: React.FC = () => {
  const { pdfs, addPdfItem, deletePdfItem, toggleBookmarkPdf, updatePdfProgress, updatePdfItem } = useApp();

  const [selectedFolder, setSelectedFolder] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePdf, setActivePdf] = useState<PdfItem | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPdfError(null);
    if (activePdf && activePdf.pageCount !== numPages) {
      updatePdfItem(activePdf.id, { pageCount: numPages });
      setActivePdf({ ...activePdf, pageCount: numPages });
    }
  }

  function onDocumentLoadError(error: Error) {
    setPdfError(error.message);
  }


  // File upload state
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadFolder, setUploadFolder] = useState<Subject>('QUANT');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredPdfs = pdfs.filter(p => {
    const matchesFolder = selectedFolder === 'All' || p.folder === selectedFolder;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const handleFileSelect = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      toast.error('Please select a valid PDF document (.pdf)');
      return;
    }
    setSelectedFile(file);
    if (!uploadTitle.trim()) {
      setUploadTitle(file.name);
    }
    toast.success(`Attached "${file.name}"`);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const title = uploadTitle.trim() || (selectedFile ? selectedFile.name : 'Untitled Document.pdf');

    if (selectedFile) {
      const mbSize = (selectedFile.size / (1024 * 1024)).toFixed(1);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        addPdfItem({
          title: title.endsWith('.pdf') ? title : `${title}.pdf`,
          folder: uploadFolder,
          fileSize: `${mbSize} MB`,
          url: base64String,
          isBookmarked: false,
          pageCount: Math.max(10, Math.floor(selectedFile.size / 100000)),
          lastPageRead: 1,
        });
        
        setIsUploadOpen(false);
        setUploadTitle('');
        setSelectedFile(null);
        toast.success(`Added PDF "${title}"`);
      };
      reader.onerror = () => {
        toast.error('Failed to read PDF file');
      };
      reader.readAsDataURL(selectedFile);
    } else {
      addPdfItem({
        title: title.endsWith('.pdf') ? title : `${title}.pdf`,
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
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileInputChange} 
        accept="application/pdf,.pdf" 
        className="hidden" 
      />

      {/* Header & Drag-Drop Upload Banner */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-[22px] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
            <FolderArchive className="w-5 h-5 text-[#FF7A00]" />
            <span>PDF Library & Solved Books</span>
          </h2>
          <p className="text-xs text-[#A9A9A9] mt-1">
            Store, read, and bookmark CET question banks, pyqs, and booklets
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="px-5 py-2.5 bg-[#FF7A00] text-black font-bold rounded-[14px] hover:bg-[#FFB547] transition-all flex items-center space-x-2 text-xs shadow-lg shadow-[#FF7A00]/20 cursor-pointer"
          id="pdf-upload-btn"
        >
          <UploadCloud className="w-4 h-4 stroke-[2.5]" />
          <span>Upload PDF Document</span>
        </button>
      </div>

      {/* Filter Folders & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Subject Folders */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
          {['All', 'VARC', 'LRDI', 'AR', 'QUANT'].map(folder => (
            <button
              key={folder}
              onClick={() => setSelectedFolder(folder)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex-shrink-0 ${
                selectedFolder === folder
                  ? 'bg-[#FF7A00] text-black'
                  : 'bg-[#0a0a0a] text-[#A9A9A9] border border-white/5 hover:text-white'
              }`}
            >
              {folder} Folders
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#707070] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search PDF books..."
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#707070] focus:outline-none focus:border-[#FF7A00]"
          />
        </div>
      </div>

      {/* PDF Grid */}
      <div className="flex flex-wrap gap-4">
        {filteredPdfs.map(pdf => (
          <div
            key={pdf.id}
            className="bg-[#0a0a0a] border border-white/5 hover:border-[#FF7A00]/30 rounded-[20px] p-3 flex flex-col justify-between transition-all group w-[201px] h-[224px] overflow-hidden"
          >
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-1.5 truncate max-w-[120px]">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FF7A00]/10 text-[#FF7A00] truncate">
                    {pdf.folder}
                  </span>
                  <span className="text-[9px] text-[#707070] shrink-0">{pdf.fileSize}</span>
                </div>
                
                <div className="flex items-center space-x-0.5 shrink-0">
                  <button
                    onClick={() => toggleBookmarkPdf(pdf.id)}
                    className={`p-1 rounded-lg transition-colors cursor-pointer ${
                      pdf.isBookmarked ? 'text-[#FF7A00]' : 'text-[#707070] hover:text-white'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deletePdfItem(pdf.id)}
                    className="p-1 text-[#707070] hover:text-[#FF5A5A] rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 
                onClick={() => setActivePdf(pdf)}
                className="text-xs font-bold text-white mt-1.5 cursor-pointer group-hover:text-[#FF7A00] transition-colors leading-snug truncate shrink-0"
                title={pdf.title}
              >
                {pdf.title}
              </h3>

              {pdf.url ? (
                <div className="mt-1.5 w-full h-[105px] shrink-0 flex justify-center items-start overflow-hidden rounded-lg border border-white/10 bg-[#111]" style={{ cursor: 'pointer' }} onClick={() => setActivePdf(pdf)}>
                  <Document 
                    file={pdf.url} 
                    loading={<div className="text-[10px] text-[#A9A9A9] p-1">Loading...</div>}
                    onLoadSuccess={({numPages}) => {
                      if (pdf.pageCount !== numPages) {
                        updatePdfItem(pdf.id, { pageCount: numPages });
                      }
                    }}
                    className="w-full h-full flex justify-center items-start overflow-hidden"
                  >
                    <Page pageNumber={1} width={280} renderTextLayer={false} renderAnnotationLayer={false} className="w-full h-full [&_.react-pdf\_\_Page]:!w-full [&_.react-pdf\_\_Page]:!h-full [&_.react-pdf\_\_Page\_\_canvas]:!w-full [&_.react-pdf\_\_Page\_\_canvas]:!h-full [&_.react-pdf\_\_Page\_\_canvas]:!object-cover [&_.react-pdf\_\_Page\_\_canvas]:!object-top" />
                  </Document>
                </div>
              ) : (
                <div className="mt-1.5 w-full h-[105px] shrink-0 flex flex-col items-center justify-center rounded-lg border border-white/10 bg-[#111]">
                  <div className="w-7 h-7 rounded-lg bg-[#FF5A5A]/10 text-[#FF5A5A] flex items-center justify-center font-bold text-[10px]">
                    PDF
                  </div>
                </div>
              )}
            </div>

            <div className="mt-1.5 pt-1.5 border-t border-white/5 flex items-center justify-between gap-1 shrink-0">
              <span className="text-[10px] text-[#A9A9A9] whitespace-nowrap">
                Pg {pdf.lastPageRead} of {pdf.pageCount}
              </span>

              <button
                onClick={() => setActivePdf(pdf)}
                className="flex items-center space-x-1 text-[11px] px-2 py-0.5 rounded-lg font-semibold bg-[#FF7A00]/10 text-[#FF7A00] hover:bg-[#FF7A00] hover:text-black transition-colors cursor-pointer whitespace-nowrap"
              >
                <FileText className="w-3 h-3" />
                <span>View PDF</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Reader Modal */}
      {activePdf && (
        <Modal
          isOpen={!!activePdf}
          onClose={() => setActivePdf(null)}
          title={activePdf.title}
          subtitle={`Folder: ${activePdf.folder} • Page ${activePdf.lastPageRead} of ${activePdf.pageCount}`}
          maxWidth="max-w-5xl"
        >
          <div className="space-y-4">
            {activePdf.url ? (
              <div className="space-y-3">
                <div className="flex justify-end">
                  <button 
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
                  </button>
                </div>
                
                {pdfError ? (
                  <div className="w-full h-[550px] rounded-[18px] bg-[#090909] border border-white/10 flex flex-col items-center justify-center p-6 text-center">
                    <FileText className="w-16 h-16 text-[#FF7A00] mb-4 stroke-1" />
                    <p className="text-red-400 font-bold mb-2">Could not load PDF</p>
                    <p className="text-xs text-[#A9A9A9] max-w-md">
                      The file might have been moved or deleted after a page reload. 
                      Try opening in a new tab or re-uploading the document.
                    </p>
                  </div>
                ) : (
                  <div className="w-full h-[550px] overflow-auto rounded-[18px] bg-[#111] border border-white/10 flex justify-center custom-scrollbar relative">
                    <Document
                      file={activePdf.url}
                      onLoadSuccess={onDocumentLoadSuccess}
                      onLoadError={onDocumentLoadError}
                      loading={<div className="p-8 text-[#A9A9A9]">Loading PDF...</div>}
                      className="max-w-full"
                    >
                      <Page 
                        pageNumber={activePdf.lastPageRead} 
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                        className="max-w-full bg-white"
                        width={800}
                      />
                    </Document>
                  </div>
                )}

              </div>
            ) : (
              <div className="h-96 bg-[#090909] border border-white/10 rounded-[18px] p-6 flex flex-col items-center justify-center text-center">
                <FileText className="w-16 h-16 text-[#FF7A00] mb-4 stroke-1" />
                <h4 className="text-lg font-bold text-white max-w-lg">{activePdf.title}</h4>
                <p className="text-xs text-[#A9A9A9] mt-2">
                  [PDF Document Reader View • Page {activePdf.lastPageRead} / {activePdf.pageCount}]
                </p>

                <div className="mt-6 p-4 bg-[#0a0a0a] border border-white/10 rounded-xl text-left max-w-xl text-xs text-[#A9A9A9] leading-relaxed">
                  <p className="font-semibold text-white mb-1">Page {activePdf.lastPageRead} Practice Notes:</p>
                  Solve practice questions on Page {activePdf.lastPageRead}. Apply time-saving shortcuts for VARC, Quant equations, and LR sets.
                </div>
              </div>
            )}

            <div className="flex items-center justify-between bg-[#111111] p-3 rounded-2xl border border-white/5">
              <button
                disabled={activePdf.lastPageRead <= 1}
                onClick={() => {
                  const newPage = Math.max(1, activePdf.lastPageRead - 1);
                  updatePdfProgress(activePdf.id, newPage);
                  setActivePdf({ ...activePdf, lastPageRead: newPage });
                }}
                className="px-4 py-2 bg-[#141414] hover:bg-white/10 disabled:opacity-40 text-white text-xs font-semibold rounded-xl flex items-center space-x-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Page</span>
              </button>

              <span className="text-xs text-white font-bold">
                Page {activePdf.lastPageRead} / {activePdf.pageCount}
              </span>

              <button
                disabled={activePdf.lastPageRead >= activePdf.pageCount}
                onClick={() => {
                  const newPage = Math.min(activePdf.pageCount, activePdf.lastPageRead + 1);
                  updatePdfProgress(activePdf.id, newPage);
                  setActivePdf({ ...activePdf, lastPageRead: newPage });
                }}
                className="px-4 py-2 bg-[#FF7A00] text-black font-bold text-xs rounded-xl flex items-center space-x-1 hover:bg-[#FFB547] cursor-pointer"
              >
                <span>Next Page</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Upload PDF Document"
        subtitle="Add pyq papers or study material to your library"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#A9A9A9] mb-1 font-medium">Document Title</label>
            <input
              type="text"
              required
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              placeholder="e.g. MBA CET 2025 Solved PYQ Paper.pdf"
              className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2.5 text-white focus:outline-none focus:border-[#FF7A00]"
            />
          </div>

          <div>
            <label className="block text-[#A9A9A9] mb-1 font-medium">Subject Folder</label>
            <select
              value={uploadFolder}
              onChange={(e: any) => setUploadFolder(e.target.value)}
              className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2 text-white focus:outline-none focus:border-[#FF7A00]"
            >
              <option value="VARC">VARC</option>
              <option value="LRDI">LRDI</option>
              <option value="AR">Abstract Reasoning (AR)</option>
              <option value="QUANT">Quant</option>
            </select>
          </div>

          {/* Drag & Drop File Select Zone */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`p-6 border-2 border-dashed rounded-[20px] text-center transition-all cursor-pointer ${
              isDragging 
                ? 'border-[#FF7A00] bg-[#FF7A00]/10' 
                : selectedFile
                ? 'border-[#38E27A] bg-[#38E27A]/10'
                : 'border-white/10 hover:border-[#FF7A00] bg-[#111111]/50'
            }`}
          >
            {selectedFile ? (
              <div className="flex flex-col items-center">
                <FileCheck className="w-8 h-8 text-[#38E27A] mb-2" />
                <p className="font-bold text-white">{selectedFile.name}</p>
                <p className="text-[10px] text-[#38E27A] mt-1 font-mono">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to Upload
                </p>
                <span className="mt-2 text-[10px] text-[#A9A9A9] underline">Click to choose a different PDF file</span>
              </div>
            ) : (
              <div>
                <UploadCloud className="w-8 h-8 text-[#FF7A00] mx-auto mb-2" />
                <p className="font-semibold text-white">Click or drag & drop PDF file here</p>
                <p className="text-[10px] text-[#707070] mt-1">Supports PDF files up to 50MB</p>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-white/5">
            <button
              type="button"
              onClick={() => setIsUploadOpen(false)}
              className="px-4 py-2 text-[#A9A9A9] hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#FF7A00] text-black font-bold rounded-[14px] hover:bg-[#FFB547] cursor-pointer"
            >
              Upload to Library
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
