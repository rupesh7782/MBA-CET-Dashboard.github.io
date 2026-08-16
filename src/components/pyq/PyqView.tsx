import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  GraduationCap, UploadCloud, Search, Bookmark, 
  Trash2, BookOpen, ChevronLeft, ChevronRight, FileText, 
  ExternalLink, CheckCircle2, Clock, AlertCircle, Sparkles, 
  Filter, Tag, Eye, Download, ZoomIn, ZoomOut, RotateCcw, 
  Layers, Star, ArrowUpDown, X, Plus, BookCheck, Pencil
} from 'lucide-react';
import { Subject, PyqItem, PyqCategory } from '../../types';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

import { Modal } from '../common/Modal';
import toast from 'react-hot-toast';

export const PyqView: React.FC = () => {
  const { 
    pyqItems, 
    addPyqItem, 
    updatePyqItem, 
    deletePyqItem, 
    toggleBookmarkPyq, 
    updatePyqProgress, 
    toggleSolvedPyq 
  } = useApp();

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'year' | 'title' | 'status'>('latest');

  // Active Reading State
  const [activePyq, setActivePyq] = useState<PyqItem | null>(null);
  const [activePage, setActivePage] = useState<number>(1);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [zoomScale, setZoomScale] = useState<number>(1.0);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // Upload & Edit Modal State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editingPyq, setEditingPyq] = useState<PyqItem | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState<PyqCategory>('MBA CET');
  const [uploadYear, setUploadYear] = useState('2024');
  const [uploadSubject, setUploadSubject] = useState<Subject | 'General' | 'Full Length' | 'Imp Topics'>('Full Length');
  const [uploadWeightage, setUploadWeightage] = useState<'Must Solve' | 'High Weightage' | 'Medium Weightage' | 'Standard'>('Must Solve');
  const [uploadSolvedStatus, setUploadSolvedStatus] = useState<'Not Started' | 'In Progress' | 'Solved'>('Not Started');
  const [uploadTags, setUploadTags] = useState('');
  const [uploadNotes, setUploadNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Open upload modal fresh
  const handleOpenUpload = () => {
    setEditingPyq(null);
    setUploadTitle('');
    setUploadCategory('MBA CET');
    setUploadYear('2024');
    setUploadSubject('Full Length');
    setUploadWeightage('Must Solve');
    setUploadSolvedStatus('Not Started');
    setUploadTags('CET 2024, Solved Paper, Official');
    setUploadNotes('');
    setSelectedFile(null);
    setIsUploadOpen(true);
  };

  // Open edit modal
  const handleOpenEdit = (item: PyqItem) => {
    setEditingPyq(item);
    setUploadTitle(item.title);
    setUploadCategory(item.category);
    setUploadYear(item.year || '2024');
    setUploadSubject(item.subject);
    setUploadWeightage(item.weightage || 'Must Solve');
    setUploadSolvedStatus(item.solvedStatus || 'Not Started');
    setUploadTags((item.tags || []).join(', '));
    setUploadNotes(item.notes || '');
    setSelectedFile(null);
    setIsUploadOpen(true);
  };

  // File Select Handler
  const handleFileSelect = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      toast.error('Please select a valid PDF document (.pdf)');
      return;
    }
    setSelectedFile(file);
    if (!uploadTitle.trim()) {
      setUploadTitle(file.name.replace(/\.[^/.]+$/, ''));
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

  // Handle Form Submit
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = uploadTitle.trim() || (selectedFile ? selectedFile.name : 'Untitled Paper');
    const formattedTitle = cleanTitle.endsWith('.pdf') ? cleanTitle : `${cleanTitle}.pdf`;
    const parsedTags = uploadTags.split(',').map(t => t.trim()).filter(Boolean);

    if (editingPyq) {
      // Update existing
      updatePyqItem(editingPyq.id, {
        title: formattedTitle,
        category: uploadCategory,
        year: uploadYear,
        subject: uploadSubject,
        weightage: uploadWeightage,
        solvedStatus: uploadSolvedStatus,
        tags: parsedTags,
        notes: uploadNotes.trim(),
      });
      setIsUploadOpen(false);
      return;
    }

    if (selectedFile) {
      const mbSize = (selectedFile.size / (1024 * 1024)).toFixed(1);
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        addPyqItem({
          title: formattedTitle,
          category: uploadCategory,
          year: uploadYear,
          subject: uploadSubject,
          fileSize: `${mbSize} MB`,
          url: base64String,
          isBookmarked: false,
          pageCount: Math.max(10, Math.floor(selectedFile.size / 90000)),
          lastPageRead: 1,
          weightage: uploadWeightage,
          solvedStatus: uploadSolvedStatus,
          tags: parsedTags.length > 0 ? parsedTags : [uploadCategory, uploadYear],
          notes: uploadNotes.trim()
        });
        
        setIsUploadOpen(false);
        setUploadTitle('');
        setSelectedFile(null);
      };
      reader.onerror = () => {
        toast.error('Failed to process PDF file');
      };
      reader.readAsDataURL(selectedFile);
    } else {
      // Added without local file upload
      addPyqItem({
        title: formattedTitle,
        category: uploadCategory,
        year: uploadYear,
        subject: uploadSubject,
        fileSize: '7.8 MB',
        url: undefined,
        isBookmarked: false,
        pageCount: 50,
        lastPageRead: 1,
        weightage: uploadWeightage,
        solvedStatus: uploadSolvedStatus,
        tags: parsedTags.length > 0 ? parsedTags : [uploadCategory, uploadYear],
        notes: uploadNotes.trim()
      });
      setIsUploadOpen(false);
      setUploadTitle('');
      setSelectedFile(null);
    }
  };

  // Open PDF Viewer
  const handleOpenPdfReader = (item: PyqItem) => {
    setActivePyq(item);
    setActivePage(item.lastPageRead || 1);
    setZoomScale(1.0);
    setPdfError(null);
  };

  const handlePageChange = (newPage: number) => {
    if (!activePyq || !numPages) return;
    const bounded = Math.max(1, Math.min(newPage, numPages));
    setActivePage(bounded);
    updatePyqProgress(activePyq.id, bounded);
    setActivePyq({ ...activePyq, lastPageRead: bounded });
  };

  // Open PDF in new screen / tab
  const handleOpenInNewScreen = (url?: string) => {
    if (!url) {
      toast.error('No PDF file data found to open. Upload or re-attach the document via Edit.');
      return;
    }
    try {
      if (url.startsWith('data:')) {
        const arr = url.split(',');
        const mimeMatch = arr[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : 'application/pdf';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], { type: mime });
        const blobUrl = URL.createObjectURL(blob);
        const newWin = window.open(blobUrl, '_blank');
        if (!newWin) {
          toast.error('Pop-up blocked. Please allow pop-ups for this site.');
        } else {
          toast.success('Opening PDF in new screen');
        }
      } else {
        const newWin = window.open(url, '_blank');
        if (!newWin) {
          toast.error('Pop-up blocked. Please allow pop-ups for this site.');
        } else {
          toast.success('Opening PDF in new screen');
        }
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to open PDF in new screen');
    }
  };

  // Filter & Sort Logic
  const filteredPyqs = pyqItems.filter(item => {
    // Category match
    let matchesCategory = true;
    if (selectedCategory === 'MBA CET') matchesCategory = item.category === 'MBA CET';
    else if (selectedCategory === 'Important Topics') matchesCategory = item.category === 'Important Topics';
    else if (selectedCategory === 'CAT / XAT / SNAP') matchesCategory = ['CAT', 'XAT', 'SNAP', 'NMAT'].includes(item.category);
    else if (selectedCategory === 'Must Solve') matchesCategory = item.weightage === 'Must Solve';
    else if (selectedCategory === 'Bookmarked') matchesCategory = item.isBookmarked;
    else if (selectedCategory === 'Solved') matchesCategory = item.solvedStatus === 'Solved';

    // Subject match
    const matchesSubject = selectedSubject === 'All' || item.subject === selectedSubject;

    // Year match
    const matchesYear = selectedYear === 'All' || item.year === selectedYear;

    // Search query
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.year && item.year.toLowerCase().includes(q)) ||
      (item.notes && item.notes.toLowerCase().includes(q)) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(q)));

    return matchesCategory && matchesSubject && matchesYear && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'latest') return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
    if (sortBy === 'year') return (b.year || '').localeCompare(a.year || '');
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'status') {
      const rank = { 'Solved': 3, 'In Progress': 2, 'Not Started': 1 };
      return (rank[b.solvedStatus || 'Not Started'] || 0) - (rank[a.solvedStatus || 'Not Started'] || 0);
    }
    return 0;
  });

  // Calculate Metrics
  const totalPapers = pyqItems.length;
  const impTopicsCount = pyqItems.filter(p => p.category === 'Important Topics').length;
  const solvedCount = pyqItems.filter(p => p.solvedStatus === 'Solved').length;
  const mustSolveCount = pyqItems.filter(p => p.weightage === 'Must Solve').length;

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

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0a0a0a] via-[#111111] to-[#0a0a0a] border border-[#EAB308]/20 rounded-[24px] p-6 shadow-xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#EAB308]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="p-2.5 bg-[#EAB308]/10 rounded-xl border border-[#EAB308]/30">
                <GraduationCap className="w-6 h-6 text-[#EAB308]" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase">
                  Previous Year Questions & <span className="text-[#EAB308]">Important Topics</span>
                </h1>
                <p className="text-xs text-gray-400 mt-0.5">
                  Official solved CET slot papers, CAT/XAT benchmarks, and high-yield topic master booklets for JBIMS 99.99 percentile.
                </p>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <div className="bg-black/50 border border-white/10 rounded-xl p-2.5 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-semibold block">Total Papers</span>
                  <span className="text-sm font-black text-white">{totalPapers} Resources</span>
                </div>
              </div>

              <div className="bg-black/50 border border-white/10 rounded-xl p-2.5 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-semibold block">Imp Topics</span>
                  <span className="text-sm font-black text-amber-400">{impTopicsCount} Booklets</span>
                </div>
              </div>

              <div className="bg-black/50 border border-white/10 rounded-xl p-2.5 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center font-bold text-xs">
                  <Star className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-semibold block">Must Solve</span>
                  <span className="text-sm font-black text-red-400">{mustSolveCount} Critical</span>
                </div>
              </div>

              <div className="bg-black/50 border border-white/10 rounded-xl p-2.5 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-semibold block">Solved / Practiced</span>
                  <span className="text-sm font-black text-emerald-400">{solvedCount} Completed</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={handleOpenUpload}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#EAB308] hover:bg-[#ca8a04] text-black font-black rounded-xl transition-all flex items-center justify-center space-x-2 text-xs shadow-lg shadow-[#EAB308]/20 cursor-pointer"
              id="upload-pyq-btn"
            >
              <UploadCloud className="w-4 h-4 stroke-[2.5]" />
              <span>Upload PYQ / Imp Topic PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-3.5 space-y-3">
        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'All', label: 'All Resources' },
            { id: 'MBA CET', label: 'MBA CET PYQs' },
            { id: 'Important Topics', label: 'Important Topics' },
            { id: 'CAT / XAT / SNAP', label: 'CAT / XAT / SNAP' },
            { id: 'Must Solve', label: '⭐ Must Solve' },
            { id: 'Solved', label: '✅ Solved' },
            { id: 'Bookmarked', label: '🔖 Bookmarked' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 cursor-pointer ${
                selectedCategory === tab.id
                  ? 'bg-[#EAB308] text-black shadow-md shadow-[#EAB308]/20'
                  : 'bg-[#141414] text-gray-400 hover:text-white hover:bg-[#1a1a1a] border border-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Secondary Filters & Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-1">
          {/* Search Box */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by paper title, year, topic, or tag..."
              className="w-full bg-[#111111] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#EAB308]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-gray-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Subject Filter */}
          <div className="sm:col-span-2">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-[#111111] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#EAB308]"
            >
              <option value="All">All Subjects</option>
              <option value="Full Length">Full Length (200 Qs)</option>
              <option value="LRDI">LRDI (75 Qs)</option>
              <option value="AR">AR / Visual (25 Qs)</option>
              <option value="QUANT">Quant (50 Qs)</option>
              <option value="VARC">VARC (50 Qs)</option>
            </select>
          </div>

          {/* Year Filter */}
          <div className="sm:col-span-2">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-[#111111] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#EAB308]"
            >
              <option value="All">All Exam Years</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
              <option value="All-Time">All-Time Imp</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="sm:col-span-2">
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full bg-[#111111] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#EAB308]"
            >
              <option value="latest">Sort: Latest Added</option>
              <option value="year">Sort: Exam Year (Newest)</option>
              <option value="status">Sort: Solved Status</option>
              <option value="title">Sort: Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* PYQ Papers Grid */}
      {filteredPyqs.length === 0 ? (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#EAB308]/10 text-[#EAB308] flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No PYQ Papers Found</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
            {searchQuery || selectedCategory !== 'All' 
              ? 'Try clearing your active search filters or selecting another category.'
              : 'Start by uploading your first Previous Year Question Paper or Important Topics Booklet.'}
          </p>
          <button
            onClick={handleOpenUpload}
            className="mt-4 px-4 py-2 bg-[#EAB308] text-black font-bold text-xs rounded-xl hover:bg-[#ca8a04] transition-colors"
          >
            Upload PDF Document
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPyqs.map(item => {
            const isSolved = item.solvedStatus === 'Solved';
            const isInProgress = item.solvedStatus === 'In Progress';

            return (
              <div
                key={item.id}
                className={`bg-[#0a0a0a] border rounded-[22px] p-4 flex flex-col justify-between transition-all group relative overflow-hidden ${
                  item.weightage === 'Must Solve' 
                    ? 'border-[#EAB308]/30 hover:border-[#EAB308]/70 shadow-lg shadow-[#EAB308]/5' 
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                {/* Top Header info */}
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2.5">
                    <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#EAB308]/15 text-[#EAB308] border border-[#EAB308]/30">
                        {item.category} {item.year ? `'${item.year.slice(-2)}` : ''}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white/5 text-gray-300">
                        {item.subject}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1 text-gray-400 hover:text-[#EAB308] hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                        title="Edit Paper Details"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => toggleBookmarkPyq(item.id)}
                        className={`p-1 rounded-lg transition-colors cursor-pointer ${
                          item.isBookmarked ? 'text-[#EAB308]' : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                        title={item.isBookmarked ? 'Unpin / Remove Bookmark' : 'Pin / Bookmark Paper'}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${item.isBookmarked ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => deletePyqItem(item.id)}
                        className="p-1 text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                        title="Delete Paper"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 
                    onClick={() => handleOpenPdfReader(item)}
                    className="text-xs sm:text-sm font-bold text-white group-hover:text-[#EAB308] transition-colors leading-snug cursor-pointer line-clamp-2"
                    title={item.title}
                  >
                    {item.title.replace(/\.pdf$/i, '')}
                  </h3>

                  {/* PDF Document Visual Thumbnail */}
                  <div 
                    onClick={() => handleOpenPdfReader(item)}
                    className="my-3 w-full h-[115px] rounded-xl border border-white/10 bg-[#121212] overflow-hidden flex flex-col items-center justify-center cursor-pointer relative group-hover:border-[#EAB308]/40 transition-colors"
                  >
                    {item.url ? (
                      <Document 
                        file={item.url} 
                        loading={<div className="text-[10px] text-gray-400 p-2">Loading preview...</div>}
                        onLoadSuccess={({ numPages }) => {
                          if (item.pageCount !== numPages) {
                            updatePyqItem(item.id, { pageCount: numPages });
                          }
                        }}
                        className="w-full h-full flex justify-center items-start overflow-hidden pointer-events-none"
                      >
                        <Page 
                          pageNumber={1} 
                          width={260} 
                          renderTextLayer={false} 
                          renderAnnotationLayer={false} 
                          className="w-full h-full [&_.react-pdf\_\_Page]:!w-full [&_.react-pdf\_\_Page]:!h-full [&_.react-pdf\_\_Page\_\_canvas]:!w-full [&_.react-pdf\_\_Page\_\_canvas]:!h-full [&_.react-pdf\_\_Page\_\_canvas]:!object-cover [&_.react-pdf\_\_Page\_\_canvas]:!object-top" 
                        />
                      </Document>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-3 text-center">
                        <div className="w-9 h-9 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center font-bold text-xs mb-1">
                          PDF
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium">Click to Read Paper</span>
                        <span className="text-[9px] text-gray-600 font-mono mt-0.5">{item.fileSize}</span>
                      </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                      <span className="px-3 py-1.5 bg-[#EAB308] text-black font-bold text-xs rounded-lg flex items-center space-x-1.5 shadow-lg">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Open & Solve</span>
                      </span>
                    </div>
                  </div>

                  {/* Notes Snippet */}
                  {item.notes && (
                    <p className="text-[11px] text-gray-400 line-clamp-2 mb-2 italic">
                      "{item.notes}"
                    </p>
                  )}

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex items-center flex-wrap gap-1 mb-3">
                      {item.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Footer Actions */}
                <div className="pt-2 border-t border-white/5 space-y-2">
                  {/* Reading Progress */}
                  <div className="flex items-center justify-between text-[10px] text-gray-400">
                    <span>Read Progress:</span>
                    <span className="font-mono text-white font-bold">
                      Page {item.lastPageRead || 1} / {item.pageCount || 50}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#EAB308] rounded-full transition-all"
                      style={{ 
                        width: `${Math.min(100, Math.max(5, ((item.lastPageRead || 1) / (item.pageCount || 50)) * 100))}%` 
                      }}
                    />
                  </div>

                  {/* Solved Status Button & Weightage Badge */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => toggleSolvedPyq(item.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center space-x-1 transition-colors cursor-pointer ${
                        isSolved 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30' 
                          : isInProgress 
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30'
                            : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white'
                      }`}
                      title="Click to toggle status (Not Started → Solved → In Progress)"
                    >
                      {isSolved ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Solved</span>
                        </>
                      ) : isInProgress ? (
                        <>
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>In Progress</span>
                        </>
                      ) : (
                        <>
                          <BookCheck className="w-3 h-3 text-gray-400" />
                          <span>Mark Solved</span>
                        </>
                      )}
                    </button>

                    {item.weightage === 'Must Solve' && (
                      <span className="text-[9px] font-black uppercase tracking-wider text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                        Must Solve
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload & Edit PYQ Modal */}
      <Modal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title={editingPyq ? "Edit PYQ Paper Details" : "Upload Previous Year Paper / Imp Topic PDF"}
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
          {/* File Upload Dropzone (Only for new uploads) */}
          {!editingPyq && (
            <div>
              <label className="block text-gray-300 font-semibold mb-1.5">
                Select PDF Document
              </label>
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  isDragging 
                    ? 'border-[#EAB308] bg-[#EAB308]/10' 
                    : selectedFile 
                      ? 'border-emerald-500/50 bg-emerald-500/5' 
                      : 'border-white/10 hover:border-[#EAB308]/50 bg-black/40'
                }`}
              >
                {selectedFile ? (
                  <div className="flex flex-col items-center">
                    <FileText className="w-8 h-8 text-emerald-400 mb-2" />
                    <span className="text-white font-bold text-sm truncate max-w-xs">{selectedFile.name}</span>
                    <span className="text-gray-400 text-[11px] mt-0.5">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload
                    </span>
                    <span className="text-[#EAB308] text-[10px] mt-2 font-medium">Click to choose another file</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <UploadCloud className="w-8 h-8 text-[#EAB308] mb-2" />
                    <span className="text-white font-bold">Drag and drop your PDF here, or browse</span>
                    <span className="text-gray-400 text-[10px] mt-1">Supports MBA CET slot papers, question banks, topic PDFs</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Paper Title */}
          <div>
            <label className="block text-gray-300 font-semibold mb-1">
              Resource Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              placeholder="e.g. MBA CET 2024 Day 1 Slot 1 Official Solved Paper"
              className="w-full bg-[#111111] border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#EAB308]"
            />
          </div>

          {/* Category, Year, and Subject */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Exam / Category</label>
              <select
                value={uploadCategory}
                onChange={(e: any) => setUploadCategory(e.target.value)}
                className="w-full bg-[#111111] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#EAB308]"
              >
                <option value="MBA CET">MBA CET</option>
                <option value="Important Topics">Important Topics</option>
                <option value="CAT">CAT</option>
                <option value="XAT">XAT</option>
                <option value="SNAP">SNAP</option>
                <option value="NMAT">NMAT</option>
                <option value="Formula & Shortcuts">Formula & Shortcuts</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">Exam Year</label>
              <input
                type="text"
                value={uploadYear}
                onChange={(e) => setUploadYear(e.target.value)}
                placeholder="2026, 2025, 2024, All-Time"
                className="w-full bg-[#111111] border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#EAB308]"
              >
              </input>
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">Subject / Section</label>
              <select
                value={uploadSubject}
                onChange={(e: any) => setUploadSubject(e.target.value)}
                className="w-full bg-[#111111] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#EAB308]"
              >
                <option value="Full Length">Full Length (200 Qs)</option>
                <option value="LRDI">LRDI</option>
                <option value="AR">AR / Visual</option>
                <option value="QUANT">Quant</option>
                <option value="VARC">VARC</option>
                <option value="General">General / Strategy</option>
              </select>
            </div>
          </div>

          {/* Weightage & Solved Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Priority Weightage</label>
              <select
                value={uploadWeightage}
                onChange={(e: any) => setUploadWeightage(e.target.value)}
                className="w-full bg-[#111111] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#EAB308]"
              >
                <option value="Must Solve">⭐ Must Solve (Highest Priority)</option>
                <option value="High Weightage">🔥 High Weightage Topic</option>
                <option value="Medium Weightage">⚡ Medium Weightage</option>
                <option value="Standard">Standard Practice</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">Initial Solved Status</label>
              <select
                value={uploadSolvedStatus}
                onChange={(e: any) => setUploadSolvedStatus(e.target.value)}
                className="w-full bg-[#111111] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#EAB308]"
              >
                <option value="Not Started">⚪ Not Started</option>
                <option value="In Progress">🟡 In Progress</option>
                <option value="Solved">🟢 Solved / Completed</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-gray-300 font-semibold mb-1">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              value={uploadTags}
              onChange={(e) => setUploadTags(e.target.value)}
              placeholder="e.g. Slot 1, Puzzles, High Weightage, Official Solutions"
              className="w-full bg-[#111111] border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#EAB308]"
            />
          </div>

          {/* Key Strategy Notes */}
          <div>
            <label className="block text-gray-300 font-semibold mb-1">
              Key Insights & Exam Strategy Notes
            </label>
            <textarea
              rows={3}
              value={uploadNotes}
              onChange={(e) => setUploadNotes(e.target.value)}
              placeholder="e.g. Focus on floor arrangement puzzle shortcuts, 25 visual analogies in AR section..."
              className="w-full bg-[#111111] border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#EAB308]"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsUploadOpen(false)}
              className="px-4 py-2 bg-[#1a1a1a] text-gray-300 font-bold rounded-xl hover:bg-[#252525] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#EAB308] text-black font-black rounded-xl hover:bg-[#ca8a04] transition-colors shadow-lg shadow-[#EAB308]/20"
            >
              {editingPyq ? 'Save Changes' : 'Upload & Save'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Embedded In-App PDF Reader Modal */}
      {activePyq && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col">
          {/* Top Control Bar */}
          <div className="h-14 bg-[#0a0a0a] border-b border-white/10 px-4 sm:px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3 truncate max-w-md sm:max-w-xl">
              <button
                onClick={() => setActivePyq(null)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
                title="Close Reader"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="truncate">
                <h2 className="text-xs sm:text-sm font-bold text-white truncate" title={activePyq.title}>
                  {activePyq.title}
                </h2>
                <p className="text-[10px] text-gray-400">
                  {activePyq.category} • {activePyq.year || 'All-Time'} • {activePyq.subject}
                </p>
              </div>
            </div>

            {/* Middle Page Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(activePage - 1)}
                disabled={activePage <= 1}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center space-x-1 text-xs font-mono">
                <input
                  type="number"
                  min={1}
                  max={numPages || activePyq.pageCount || 100}
                  value={activePage}
                  onChange={(e) => handlePageChange(Number(e.target.value))}
                  className="w-12 bg-black border border-white/20 rounded px-1.5 py-0.5 text-center text-white font-bold"
                />
                <span className="text-gray-400">/ {numPages || activePyq.pageCount || '...'}</span>
              </div>

              <button
                onClick={() => handlePageChange(activePage + 1)}
                disabled={numPages ? activePage >= numPages : false}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white cursor-pointer"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right Zoom & Status Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setZoomScale(prev => Math.max(0.6, prev - 0.15))}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomScale(1.0)}
                className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-mono text-gray-300"
                title="Reset Zoom"
              >
                {Math.round(zoomScale * 100)}%
              </button>
              <button
                onClick={() => setZoomScale(prev => Math.min(2.0, prev + 0.15))}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <div className="h-4 w-px bg-white/10 mx-1" />

              {/* Open in New Screen / Tab Option */}
              <button
                onClick={() => handleOpenInNewScreen(activePyq.url)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white flex items-center space-x-1.5 border border-white/15 hover:border-white/30 transition-all cursor-pointer shadow-sm"
                title="Open PDF in new screen / browser tab"
                id="open-pdf-new-screen-btn"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#EAB308]" />
                <span className="hidden sm:inline">Open in New Screen</span>
                <span className="sm:hidden">New Screen</span>
              </button>

              <button
                onClick={() => {
                  toggleSolvedPyq(activePyq.id);
                  setActivePyq(prev => prev ? {
                    ...prev,
                    solvedStatus: prev.solvedStatus === 'Solved' ? 'In Progress' : 'Solved'
                  } : null);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 ${
                  activePyq.solvedStatus === 'Solved'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-[#EAB308] text-black hover:bg-[#ca8a04]'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{activePyq.solvedStatus === 'Solved' ? 'Solved ✅' : 'Mark Solved'}</span>
              </button>

              <button
                onClick={() => setActivePyq(null)}
                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer ml-2"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Reader Main Content Area */}
          <div className="flex-1 overflow-auto bg-[#181818] p-4 flex justify-center items-start custom-scrollbar">
            {activePyq.url ? (
              <div 
                className="shadow-2xl rounded-lg overflow-hidden border border-white/10 bg-white"
                style={{ transform: `scale(${zoomScale})`, transformOrigin: 'top center', transition: 'transform 0.15s ease-out' }}
              >
                <Document
                  file={activePyq.url}
                  onLoadSuccess={({ numPages }) => {
                    setNumPages(numPages);
                    setPdfError(null);
                    if (activePyq.pageCount !== numPages) {
                      updatePyqItem(activePyq.id, { pageCount: numPages });
                    }
                  }}
                  onLoadError={(err) => setPdfError(err.message)}
                  loading={
                    <div className="p-12 text-center text-gray-500">
                      <BookOpen className="w-8 h-8 mx-auto animate-bounce text-[#EAB308] mb-2" />
                      <span>Loading PDF Document...</span>
                    </div>
                  }
                >
                  <Page
                    pageNumber={activePage}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    width={Math.min(900, window.innerWidth - 60)}
                  />
                </Document>
              </div>
            ) : (
              <div className="max-w-2xl w-full bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 text-center my-auto">
                <div className="w-16 h-16 rounded-2xl bg-[#EAB308]/10 text-[#EAB308] flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">{activePyq.title}</h3>
                <p className="text-xs text-gray-400 mt-2">
                  This curated question bank resource is pre-cataloged for your study plan. You can attach your local copy of this PDF using the "Edit Details" option or upload your custom questions booklet.
                </p>

                {activePyq.notes && (
                  <div className="mt-4 p-4 rounded-xl bg-black/60 border border-white/10 text-left">
                    <span className="text-[10px] uppercase font-bold text-[#EAB308] block mb-1">
                      Key Exam Strategy Notes:
                    </span>
                    <p className="text-xs text-gray-300 leading-relaxed">{activePyq.notes}</p>
                  </div>
                )}

                <div className="flex items-center justify-center space-x-3 mt-6">
                  <button
                    onClick={() => {
                      const id = activePyq.id;
                      setActivePyq(null);
                      const target = pyqItems.find(p => p.id === id);
                      if (target) handleOpenEdit(target);
                    }}
                    className="px-4 py-2 bg-[#EAB308] text-black font-bold text-xs rounded-xl hover:bg-[#ca8a04] transition-colors"
                  >
                    Upload Actual PDF File
                  </button>
                  <button
                    onClick={() => setActivePyq(null)}
                    className="px-4 py-2 bg-white/10 text-white font-bold text-xs rounded-xl hover:bg-white/20 transition-colors"
                  >
                    Close Reader
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
