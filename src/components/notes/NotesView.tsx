import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import ReactMarkdown from 'react-markdown';
import { 
  FileText, Plus, Search, Pin, Trash2, Edit3, 
  ArrowLeft, Check, Table, Image as ImageIcon, Sparkles
} from 'lucide-react';
import { Note, Subject } from '../../types';

export const NotesView: React.FC = () => {
  const { notes, addNote, updateNote, deleteNote, togglePinNote } = useApp();

  const [selectedFolder, setSelectedFolder] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Selected Note Object
  const selectedNote = notes.find(n => n.id === selectedNoteId);

  // Note Draft State for editing
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editSubject, setEditSubject] = useState<Subject | 'General'>('LRDI');

  const startEditing = (note: Note) => {
    setSelectedNoteId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditSubject(note.subject);
    setIsEditing(true);
  };

  const handleSaveNote = () => {
    if (!selectedNoteId) return;
    updateNote(selectedNoteId, {
      title: editTitle,
      content: editContent,
      subject: editSubject,
      folder: editSubject,
    });
    setIsEditing(false);
  };

  const handleCreateNew = () => {
    const newId = 'note-' + Date.now();
    const newNote: Omit<Note, 'id' | 'updatedAt'> = {
      title: 'Untitled Study Note',
      content: '# New Study Note\n\nStart typing here using Markdown...',
      subject: 'LRDI',
      date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isPinned: false,
      tags: ['New'],
      folder: 'LRDI',
    };
    addNote(newNote);
    setSelectedNoteId(newId);
    setEditTitle('Untitled Study Note');
    setEditContent('# New Study Note\n\nStart typing here using Markdown...');
    setEditSubject('LRDI');
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    deleteNote(id);
    if (selectedNoteId === id) {
      setSelectedNoteId(null);
      setIsEditing(false);
    }
  };

  // Filter notes
  const filteredNotes = notes.filter(n => {
    const matchesFolder = selectedFolder === 'All' || n.folder === selectedFolder;
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          n.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  // Table markdown helper insertion
  const insertTableHelper = () => {
    setEditContent(prev => prev + '\n\n| Concept | Formula | Shortcut |\n|---|---|---|\n| Percentages | Base Value | x/y * 100 |\n| Speed Math | Cubes | N^3 |\n');
  };

  // Image markdown helper
  const insertImageHelper = () => {
    setEditContent(prev => prev + '\n\n![Diagram Title](https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=60)\n');
  };

  // If a specific note is selected, show the full Note View / Editor screen
  if (selectedNoteId && selectedNote) {
    return (
      <div className="space-y-4 pb-12">
        {/* Top Header / Actions Bar */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[22px] p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setSelectedNoteId(null);
                setIsEditing(false);
              }}
              className="px-3 py-1.5 bg-[#141414] hover:bg-white/10 border border-white/10 text-[#A9A9A9] hover:text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Notes Vault</span>
            </button>

            <span className="text-xs font-bold text-[#FF7A00] bg-[#FF7A00]/10 px-2.5 py-1 rounded-lg">
              {isEditing ? editSubject : selectedNote.subject}
            </span>
            <span className="text-xs text-[#707070] hidden sm:inline">{selectedNote.date}</span>
          </div>

          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={insertTableHelper}
                  className="p-2 bg-[#141414] hover:bg-white/10 text-[#A9A9A9] hover:text-white rounded-xl text-xs flex items-center space-x-1 cursor-pointer"
                  title="Insert Table"
                >
                  <Table className="w-4 h-4" />
                </button>
                <button
                  onClick={insertImageHelper}
                  className="p-2 bg-[#141414] hover:bg-white/10 text-[#A9A9A9] hover:text-white rounded-xl text-xs flex items-center space-x-1 cursor-pointer"
                  title="Insert Image Markdown"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={handleSaveNote}
                  className="px-4 py-2 bg-[#38E27A] text-black font-bold rounded-xl text-xs flex items-center space-x-1 hover:bg-[#38E27A]/90 transition-colors cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => togglePinNote(selectedNote.id)}
                  className={`p-2 rounded-xl border border-white/10 cursor-pointer ${
                    selectedNote.isPinned ? 'bg-[#FF7A00]/20 text-[#FF7A00]' : 'text-[#707070] hover:text-white'
                  }`}
                  title={selectedNote.isPinned ? 'Unpin Note' : 'Pin Note'}
                >
                  <Pin className="w-4 h-4" />
                </button>
                <button
                  onClick={() => startEditing(selectedNote)}
                  className="px-4 py-2 bg-[#141414] hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
                  id="notes-edit-btn"
                >
                  <Edit3 className="w-4 h-4 text-[#FF7A00]" />
                  <span>Edit Note</span>
                </button>
                <button
                  onClick={() => handleDelete(selectedNote.id)}
                  className="p-2 text-[#707070] hover:text-[#FF5A5A] hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                  title="Delete Note"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Note Content / Editor Canvas */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[22px] p-6 sm:p-8 min-h-[500px]">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-[#A9A9A9] mb-1 font-medium">Subject Category</label>
                <select
                  value={editSubject}
                  onChange={(e: any) => setEditSubject(e.target.value)}
                  className="bg-[#111111] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FF7A00]"
                >
                  <option value="VARC">VARC</option>
                  <option value="LRDI">LRDI</option>
                  <option value="AR">AR</option>
                  <option value="QUANT">Quant</option>
                  <option value="General">General</option>
                </select>
              </div>

              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Note Title"
                className="w-full bg-transparent text-2xl font-bold text-white border-b border-white/10 pb-3 focus:outline-none focus:border-[#FF7A00]"
              />

              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={16}
                className="w-full bg-[#111111] border border-white/10 rounded-[18px] p-4 text-white font-mono text-xs focus:outline-none focus:border-[#FF7A00] leading-relaxed"
                placeholder="Type your notes using Markdown..."
              />
            </div>
          ) : (
            <div className="space-y-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-white border-b border-white/10 pb-4">
                {selectedNote.title}
              </h1>
              <div className="prose prose-invert max-w-none text-sm text-white leading-relaxed markdown-body">
                <ReactMarkdown>{selectedNote.content}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // BIG NOTES VAULT SCREEN (Default View when clicking Notes)
  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-[22px] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
            <FileText className="w-5 h-5 text-[#FF7A00]" />
            <span>Notes Vault</span>
          </h2>
          <p className="text-xs text-[#A9A9A9] mt-1">
            Store, search, and organize markdown study notes and shortcuts
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-5 py-2.5 bg-[#FF7A00] text-black font-bold rounded-[14px] hover:bg-[#FFB547] text-xs flex items-center space-x-2 shadow-lg shadow-[#FF7A00]/20 cursor-pointer"
          id="notes-create-btn"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Create New Note</span>
        </button>
      </div>

      {/* Search & Subject Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#707070] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes by title or content..."
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-[16px] pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#707070] focus:outline-none focus:border-[#FF7A00]"
          />
        </div>

        {/* Subject Folder Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
          {['All', 'VARC', 'LRDI', 'AR', 'QUANT', 'General'].map(folder => (
            <button
              key={folder}
              onClick={() => setSelectedFolder(folder)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex-shrink-0 cursor-pointer ${
                selectedFolder === folder 
                  ? 'bg-[#FF7A00] text-black' 
                  : 'bg-[#0a0a0a] text-[#A9A9A9] border border-white/5 hover:text-white'
              }`}
            >
              {folder}
            </button>
          ))}
        </div>
      </div>

      {/* Big Grid of Notes Cards */}
      {filteredNotes.length === 0 ? (
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[22px] p-12 text-center space-y-3">
          <FileText className="w-10 h-10 text-[#707070] mx-auto stroke-1" />
          <p className="text-sm font-semibold text-white">No notes found</p>
          <p className="text-xs text-[#A9A9A9]">Try searching for something else or create a new study note.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredNotes.map(n => (
            <div
              key={n.id}
              onClick={() => {
                setSelectedNoteId(n.id);
                setIsEditing(false);
              }}
              className="bg-[#0a0a0a] border border-white/5 hover:border-[#FF7A00]/40 rounded-[22px] p-5 flex flex-col justify-between transition-all cursor-pointer group hover:bg-[#0f0f0f]"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    n.subject === 'LRDI' ? 'bg-[#FF7A00]/20 text-[#FF7A00]' :
                    n.subject === 'VARC' ? 'bg-[#38E27A]/20 text-[#38E27A]' :
                    n.subject === 'AR' ? 'bg-[#F4B400]/20 text-[#F4B400]' :
                    n.subject === 'QUANT' ? 'bg-[#FFB547]/20 text-[#FFB547]' :
                    'bg-white/10 text-white'
                  }`}>
                    {n.subject}
                  </span>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePinNote(n.id);
                      }}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        n.isPinned ? 'text-[#FF7A00]' : 'text-[#707070] opacity-0 group-hover:opacity-100 hover:text-white'
                      }`}
                      title={n.isPinned ? 'Unpin Note' : 'Pin Note'}
                    >
                      <Pin className={`w-3.5 h-3.5 ${n.isPinned ? 'fill-[#FF7A00]' : ''}`} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(n.id);
                      }}
                      className="p-1.5 text-[#707070] opacity-0 group-hover:opacity-100 hover:text-[#FF5A5A] transition-colors cursor-pointer"
                      title="Delete Note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white mt-3 group-hover:text-[#FF7A00] transition-colors line-clamp-1">
                  {n.title}
                </h3>

                <p className="text-xs text-[#A9A9A9] mt-2 line-clamp-3 leading-relaxed">
                  {n.content.replace(/[#*`|]/g, '')}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-[#707070]">
                <span>{n.date}</span>
                <span className="text-[#FF7A00] font-semibold group-hover:underline flex items-center space-x-1">
                  <span>Read Note</span>
                  <span>→</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

