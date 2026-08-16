import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, FileText, Calculator, Type, FileSpreadsheet, GraduationCap, X, ArrowRight } from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const { 
    isCommandPaletteOpen, 
    setIsCommandPaletteOpen, 
    notes, 
    formulas, 
    vocabWords, 
    mockTests, 
    pyqItems,
    setActiveTab 
  } = useApp();

  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
      if (e.key === 'Escape') setIsCommandPaletteOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const filteredNotes = notes.filter(n => n.title.toLowerCase().includes(query.toLowerCase()) || n.tags.some(t => t.toLowerCase().includes(query.toLowerCase())));
  const filteredPyqs = pyqItems.filter(p => p.title.toLowerCase().includes(query.toLowerCase()) || (p.notes && p.notes.toLowerCase().includes(query.toLowerCase())) || (p.tags && p.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))));
  const filteredFormulas = formulas.filter(f => f.title.toLowerCase().includes(query.toLowerCase()) || f.category.toLowerCase().includes(query.toLowerCase()));
  const filteredVocab = vocabWords.filter(v => v.word.toLowerCase().includes(query.toLowerCase()) || v.meaning.toLowerCase().includes(query.toLowerCase()));
  const filteredMocks = mockTests.filter(m => m.name.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (tab: string) => {
    setActiveTab(tab);
    setIsCommandPaletteOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[70vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 bg-black">
          <Search className="w-5 h-5 text-[#EAB308] mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes, formulas, vocabulary, mock tests..."
            className="w-full bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none"
            id="command-palette-input"
          />
          <button onClick={() => setIsCommandPaletteOpen(false)} className="text-gray-500 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-3 overflow-y-auto space-y-4 custom-scrollbar flex-1 bg-[#0a0a0a]">
          {/* Notes Section */}
          {filteredNotes.length > 0 && (
            <div>
              <p className="px-3 text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1.5">Notes</p>
              {filteredNotes.slice(0, 3).map(n => (
                <div
                  key={n.id}
                  onClick={() => handleSelect('Notes')}
                  className="px-3 py-2.5 rounded-xl hover:bg-[#141414] flex items-center justify-between cursor-pointer group text-xs transition-colors border border-transparent hover:border-white/10"
                >
                  <div className="flex items-center space-x-2.5">
                    <FileText className="w-4 h-4 text-[#38bdf8]" />
                    <span className="text-white font-medium">{n.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-lg bg-[#141414] text-gray-300">{n.subject}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-white transition-colors" />
                </div>
              ))}
            </div>
          )}

          {/* PYQ Papers Section */}
          {filteredPyqs.length > 0 && (
            <div>
              <p className="px-3 text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1.5">PYQ & Imp Topics</p>
              {filteredPyqs.slice(0, 3).map(p => (
                <div
                  key={p.id}
                  onClick={() => handleSelect('PYQ')}
                  className="px-3 py-2.5 rounded-xl hover:bg-[#141414] flex items-center justify-between cursor-pointer group text-xs transition-colors border border-transparent hover:border-white/10"
                >
                  <div className="flex items-center space-x-2.5">
                    <GraduationCap className="w-4 h-4 text-[#EAB308]" />
                    <span className="text-white font-medium">{p.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-lg bg-[#EAB308]/15 text-[#EAB308] border border-[#EAB308]/30">{p.category}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-white transition-colors" />
                </div>
              ))}
            </div>
          )}

          {/* Formulas Section */}
          {filteredFormulas.length > 0 && (
            <div>
              <p className="px-3 text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1.5">Formulas</p>
              {filteredFormulas.slice(0, 3).map(f => (
                <div
                  key={f.id}
                  onClick={() => handleSelect('Formula Book')}
                  className="px-3 py-2.5 rounded-xl hover:bg-[#141414] flex items-center justify-between cursor-pointer group text-xs transition-colors border border-transparent hover:border-white/10"
                >
                  <div className="flex items-center space-x-2.5">
                    <Calculator className="w-4 h-4 text-[#818cf8]" />
                    <span className="text-white font-medium">{f.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-lg bg-[#141414] text-gray-300">{f.category}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-white transition-colors" />
                </div>
              ))}
            </div>
          )}

          {/* Vocabulary Section */}
          {filteredVocab.length > 0 && (
            <div>
              <p className="px-3 text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1.5">Vocabulary</p>
              {filteredVocab.slice(0, 3).map(v => (
                <div
                  key={v.id}
                  onClick={() => handleSelect('Vocabulary')}
                  className="px-3 py-2.5 rounded-xl hover:bg-[#141414] flex items-center justify-between cursor-pointer group text-xs transition-colors border border-transparent hover:border-white/10"
                >
                  <div className="flex items-center space-x-2.5">
                    <Type className="w-4 h-4 text-[#22c55e]" />
                    <span className="text-white font-semibold">{v.word}</span>
                    <span className="text-gray-400 text-[11px] truncate max-w-xs">{v.meaning}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-white transition-colors" />
                </div>
              ))}
            </div>
          )}

          {/* Mock Tests Section */}
          {filteredMocks.length > 0 && (
            <div>
              <p className="px-3 text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1.5">Mock Tests</p>
              {filteredMocks.slice(0, 3).map(m => (
                <div
                  key={m.id}
                  onClick={() => handleSelect('Mock Tests')}
                  className="px-3 py-2.5 rounded-xl hover:bg-[#141414] flex items-center justify-between cursor-pointer group text-xs transition-colors border border-transparent hover:border-white/10"
                >
                  <div className="flex items-center space-x-2.5">
                    <FileSpreadsheet className="w-4 h-4 text-[#f43f5e]" />
                    <span className="text-white font-medium">{m.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-lg bg-[#141414] text-gray-300">{m.date}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-white transition-colors" />
                </div>
              ))}
            </div>
          )}

          {filteredNotes.length === 0 && filteredFormulas.length === 0 && filteredVocab.length === 0 && filteredMocks.length === 0 && (
            <p className="text-center py-8 text-xs text-gray-500">No matching results found for "{query}"</p>
          )}
        </div>
      </div>
    </div>
  );
};
