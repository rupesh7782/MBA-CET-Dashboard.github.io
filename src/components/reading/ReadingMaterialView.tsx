import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Newspaper, Bookmark, CheckCircle2, Plus, Search, 
  Clock, Trash2, Edit3, UploadCloud, FileText 
} from 'lucide-react';
import { ReadingCategory, ReadingItem } from '../../types';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
import { Modal } from '../common/Modal';
import toast from 'react-hot-toast';

export const ReadingMaterialView: React.FC = () => {
  const { 
    readingItems, addReadingItem, updateReadingItem, 
    deleteReadingItem, toggleBookmarkReading, toggleReadReading 
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState<ReadingItem | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ReadingItem | null>(null);

  
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPdfError(null);
  }

  function onDocumentLoadError(error: Error) {
    setPdfError(error.message);
  }

  // New/Edit Article Form

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ReadingCategory>('Editorials');
  const [source, setSource] = useState('Economic Times');
  const [content, setContent] = useState('');
  const [readTimeMinutes, setReadTimeMinutes] = useState(5);
  const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);

  const articleFileInputRef = useRef<HTMLInputElement>(null);

  const filteredItems = readingItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          setContent(text);
          if (!title.trim()) setTitle(file.name.replace(/\.[^/.]+$/, ''));
          const wordCount = text.trim().split(/\s+/).length;
          setReadTimeMinutes(Math.max(1, Math.ceil(wordCount / 200)));
          setFileUrl(undefined);
          toast.success(`Loaded content from ${file.name}`);
        }
      };
      reader.readAsText(file);
    } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
        setSource('Uploaded Document');
        setContent(`[PDF Document: ${file.name}]`);
        setFileUrl(base64String);
        setReadTimeMinutes(5); // Default for PDF
        toast.success(`Loaded PDF: ${file.name}`);
      };
      reader.onerror = () => {
        toast.error('Failed to read PDF file');
      };
      reader.readAsDataURL(file);
    } else {
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
      setSource('Uploaded Document');
      setContent(`[Document: ${file.name}]\n\nImported article file (${(file.size / 1024).toFixed(1)} KB).\n\nKey Reading Objectives:\n- Scan for core thesis and tone indicators.\n- Note vocabulary and transition words.`);
      setFileUrl(undefined);
      toast.success(`Loaded ${file.name}`);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingArticle) {
      updateReadingItem(editingArticle.id, {
        title,
        category,
        source,
        content,
        readTimeMinutes,
        url: fileUrl,
      });
      setEditingArticle(null);
    } else {
      addReadingItem({
        title,
        category,
        source,
        content,
        date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        readTimeMinutes,
        isBookmarked: false,
        isRead: false,
        url: fileUrl,
      });
    }

    setIsAddOpen(false);
    resetForm();
  };

  const openEditModal = (item: ReadingItem) => {
    setEditingArticle(item);
    setTitle(item.title);
    setCategory(item.category);
    setSource(item.source);
    setContent(item.content);
    setReadTimeMinutes(item.readTimeMinutes);
    setFileUrl(item.url);
    setIsAddOpen(true);
  };

  const resetForm = () => {
    setTitle('');
    setCategory('Editorials');
    setSource('Economic Times');
    setContent('');
    setReadTimeMinutes(5);
    setFileUrl(undefined);
    setEditingArticle(null);
  };

  return (
    <div className="space-y-6 pb-12">
      <input 
        type="file" 
        ref={articleFileInputRef} 
        onChange={handleFileUpload} 
        accept=".txt,.md,.pdf,.doc,.docx" 
        className="hidden" 
      />

      {/* Top Banner */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-[22px] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
            <Newspaper className="w-5 h-5 text-[#FF7A00]" />
            <span>Reading Comprehension & Editorials</span>
          </h2>
          <p className="text-xs text-[#A9A9A9] mt-1">
            Build reading speed, vocabulary, and RC comprehension for MBA CET VARC
          </p>
        </div>

        <button
          onClick={() => { resetForm(); setIsAddOpen(true); }}
          className="px-5 py-2.5 bg-[#FF7A00] text-black font-bold rounded-[14px] hover:bg-[#FFB547] transition-all flex items-center space-x-2 text-xs cursor-pointer"
          id="reading-add-btn"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Article / Editorial</span>
        </button>
      </div>

      {/* Category Filter & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
          {['All', 'Editorials', 'Articles', 'Books', 'Newspapers', 'Current Affairs', 'Journals'].map(cat => (
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
            placeholder="Search editorials..."
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#707070] focus:outline-none focus:border-[#FF7A00]"
          />
        </div>
      </div>

      {/* Articles Grid */}
      <div className="flex flex-wrap gap-4">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className={`bg-[#0a0a0a] border rounded-[20px] p-2.5 flex flex-col justify-between transition-all group w-[201px] h-[224px] overflow-hidden ${
              item.isRead ? 'border-white/5 opacity-80' : 'border-white/10 hover:border-[#FF7A00]/40'
            }`}
          >
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between shrink-0">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FF7A00]/10 text-[#FF7A00] truncate max-w-[120px]">
                  {item.category}
                </span>

                <div className="flex items-center space-x-0.5 shrink-0">
                  <button
                    onClick={() => toggleBookmarkReading(item.id)}
                    className={`p-1 rounded-lg transition-colors cursor-pointer ${
                      item.isBookmarked ? 'text-[#FF7A00]' : 'text-[#707070] hover:text-white'
                    }`}
                    title="Bookmark"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1 text-[#707070] hover:text-[#FFB547] cursor-pointer"
                    title="Edit article"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteReadingItem(item.id)}
                    className="p-1 text-[#707070] hover:text-[#FF5A5A] cursor-pointer"
                    title="Delete article"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 
                onClick={() => setActiveArticle(item)}
                className="text-xs font-bold text-white mt-1 cursor-pointer group-hover:text-[#FF7A00] transition-colors leading-snug truncate shrink-0"
                title={item.title}
              >
                {item.title}
              </h3>

              {item.imageUrl ? (
                <div className="mt-1 w-full h-[110px] shrink-0 flex justify-center items-center overflow-hidden rounded-lg bg-[#111] border border-white/10" style={{ cursor: 'pointer' }} onClick={() => setActiveArticle(item)}>
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover object-top rounded-md" />
                </div>
              ) : (item.url?.startsWith('data:application/pdf') || item.content.startsWith('[PDF Document:')) ? (
                <div className="mt-1 w-full h-[110px] shrink-0 flex justify-center items-start overflow-hidden rounded-lg border border-white/10 bg-[#111]" style={{ cursor: 'pointer' }} onClick={() => setActiveArticle(item)}>
                  {item.url ? (
                    <Document file={item.url} loading={<div className="text-[10px] text-[#A9A9A9] p-2">Loading PDF...</div>} className="w-full h-full flex justify-center items-start overflow-hidden">
                      <Page pageNumber={1} width={280} renderTextLayer={false} renderAnnotationLayer={false} className="w-full h-full [&_.react-pdf\_\_Page]:!w-full [&_.react-pdf\_\_Page]:!h-full [&_.react-pdf\_\_Page\_\_canvas]:!w-full [&_.react-pdf\_\_Page\_\_canvas]:!h-full [&_.react-pdf\_\_Page\_\_canvas]:!object-cover [&_.react-pdf\_\_Page\_\_canvas]:!object-top" />
                    </Document>
                  ) : (
                    <div className="text-xs text-[#A9A9A9] p-2 flex flex-col items-center">
                      <FileText className="w-5 h-5 mb-0.5 opacity-50" />
                      <span className="text-[10px]">PDF Document</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-[#A9A9A9] mt-1.5 line-clamp-3 leading-relaxed flex-1">
                  {item.content}
                </p>
              )}
            </div>

            <div className="mt-1.5 pt-1.5 border-t border-white/5 flex items-center justify-between gap-1 shrink-0">
              <button
                onClick={() => setActiveArticle(item)}
                className="flex items-center space-x-1 text-[10px] px-2 py-0.5 rounded-lg font-bold bg-[#FF7A00]/10 text-[#FF7A00] transition-colors cursor-pointer hover:bg-[#FF7A00] hover:text-black whitespace-nowrap shrink-0"
              >
                <FileText className="w-3 h-3 shrink-0" />
                <span>{item.url ? 'View PDF' : 'Read Article'}</span>
              </button>

              <button
                onClick={() => toggleReadReading(item.id)}
                className={`flex items-center space-x-1 text-[10px] px-2 py-0.5 rounded-lg font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  item.isRead ? 'bg-[#38E27A]/20 text-[#38E27A]' : 'bg-white/5 text-[#A9A9A9] hover:text-white'
                }`}
              >
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span>{item.isRead ? 'Completed' : 'Mark Read'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Reader Modal */}
      {activeArticle && (
        <Modal
          isOpen={!!activeArticle}
          onClose={() => setActiveArticle(null)}
          title={activeArticle.title}
          subtitle={`Source: ${activeArticle.source} • ${activeArticle.category} • ${activeArticle.readTimeMinutes} min read`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-4 text-xs text-white leading-relaxed">
            <div className="p-4 bg-[#111111] rounded-2xl border border-white/5 text-[#A9A9A9] flex items-center justify-between">
              <div>
                <p className="font-semibold text-white mb-1">VARC Reading Speed Goal:</p>
                Aim for 250-300 words per minute while retaining main idea and tone keywords.
              </div>
              <button
                onClick={() => {
                  const articleToEdit = activeArticle;
                  setActiveArticle(null);
                  openEditModal(articleToEdit);
                }}
                className="px-3 py-1.5 bg-[#141414] hover:bg-white/10 text-[#FFB547] rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Article</span>
              </button>
            </div>

            {activeArticle.url ? (
              <div className="w-full h-[550px] overflow-auto rounded-[18px] bg-[#111] border border-white/10 flex justify-center custom-scrollbar relative">
                <Document
                  file={activeArticle.url}
                  onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                  loading={<div className="p-8 text-[#A9A9A9]">Loading PDF...</div>}
                  className="max-w-full"
                >
                  {Array.from(new Array(numPages || 1), (el, index) => (
                    <Page 
                      key={`page_${index + 1}`}
                      pageNumber={index + 1} 
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                      className="max-w-full bg-white mb-4"
                      width={700}
                    />
                  ))}
                </Document>
              </div>
            ) : (
              <div className="prose prose-invert max-w-none text-sm leading-relaxed p-2 whitespace-pre-wrap">
                {activeArticle.content.startsWith('[PDF Document:') 
                  ? "PDF file loaded. Preview not available because the file data was not preserved. Please re-upload the PDF to view it." 
                  : activeArticle.content}
              </div>
            )}

            <div className="pt-4 border-t border-white/5 flex justify-between items-center">
              <button
                onClick={() => {
                  toggleReadReading(activeArticle.id);
                  setActiveArticle({ ...activeArticle, isRead: !activeArticle.isRead });
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                  activeArticle.isRead ? 'bg-[#38E27A] text-black' : 'bg-[#FF7A00] text-black'
                }`}
              >
                {activeArticle.isRead ? 'Mark as Unread' : 'Mark as Finished'}
              </button>

              <button
                onClick={() => {
                  deleteReadingItem(activeArticle.id);
                  setActiveArticle(null);
                }}
                className="px-4 py-2 bg-[#FF5A5A]/20 text-[#FF5A5A] hover:bg-[#FF5A5A] hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Article</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => { setIsAddOpen(false); resetForm(); }}
        title={editingArticle ? "Edit Article / Editorial" : "Add Article / Editorial"}
        subtitle="Upload file or paste editorial text for reading practice"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
          {/* File Upload Shortcut */}
          {!editingArticle && (
            <div 
              onClick={() => articleFileInputRef.current?.click()}
              className="p-4 border-2 border-dashed border-white/10 hover:border-[#FF7A00] rounded-[18px] bg-[#111111]/50 text-center cursor-pointer transition-all flex items-center justify-center space-x-3"
            >
              <UploadCloud className="w-5 h-5 text-[#FF7A00]" />
              <span className="text-white font-medium">Click to Upload Article File (.txt, .md, .pdf)</span>
            </div>
          )}

          <div>
            <label className="block text-[#A9A9A9] mb-1 font-medium">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Monetary Policy Committee Inflation Outlook"
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
          )}

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
              {editingArticle ? "Update Article" : "Save Article"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
