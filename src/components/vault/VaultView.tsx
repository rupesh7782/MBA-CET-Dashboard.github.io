import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Lock, Unlock, Key, Plus, Trash2, Eye, EyeOff, ShieldCheck, 
  UploadCloud, FileText, ExternalLink, Download, Copy, Check, Pencil, X, FileCheck
} from 'lucide-react';
import { VaultCategory, VaultItem } from '../../types';
import { Modal } from '../common/Modal';
import { toast } from 'react-hot-toast';

export const VaultView: React.FC = () => {
  const { 
    vaultItems, 
    addVaultItem, 
    updateVaultItem,
    deleteVaultItem, 
    isVaultUnlocked, 
    unlockVaultWithPin, 
    lockVault, 
    setVaultPin, 
    vaultPin 
  } = useApp();

  const [inputPin, setInputPin] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isChangePinOpen, setIsChangePinOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<VaultItem | null>(null);

  // New / Edit Vault Item States
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<VaultCategory>('Certificates');
  const [secretContent, setSecretContent] = useState('');
  const [attachedFile, setAttachedFile] = useState<{
    dataUrl: string;
    name: string;
    size: string;
    type: string;
  } | null>(null);

  // Visibility toggle for individual items (id -> boolean)
  const [visibleSecrets, setVisibleSecrets] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pin state for setting
  const [newPin, setNewPin] = useState('');

  const filteredItems = vaultItems.filter(v => selectedCategory === 'All' || v.category === selectedCategory);

  const toggleSecretVisibility = (id: string) => {
    setVisibleSecrets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopySecret = (id: string, text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Credentials copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (unlockVaultWithPin(inputPin)) {
      setInputPin('');
    }
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setTitle('');
    setCategory('Certificates');
    setSecretContent('');
    setAttachedFile(null);
    setIsAddOpen(true);
  };

  const handleOpenEditModal = (item: VaultItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setCategory(item.category);
    setSecretContent(item.secretContent || '');
    if (item.fileDataUrl) {
      setAttachedFile({
        dataUrl: item.fileDataUrl,
        name: item.fileName || 'Attached Document',
        size: item.fileSize || 'File',
        type: item.fileType || 'application/octet-stream',
      });
    } else {
      setAttachedFile(null);
    }
    setIsAddOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const mbSize = (file.size / (1024 * 1024)).toFixed(2);
    const sizeStr = file.size > 1024 * 1024 ? `${mbSize} MB` : `${Math.round(file.size / 1024)} KB`;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setAttachedFile({
        dataUrl,
        name: file.name,
        size: sizeStr,
        type: file.type || 'application/octet-stream',
      });

      // Auto fill title if empty
      if (!title.trim()) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '');
        setTitle(cleanName);
      }
      toast.success(`Attached file: ${file.name}`);
    };
    reader.onerror = () => {
      toast.error('Failed to read selected file');
    };
    reader.readAsDataURL(file);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const mbSize = (file.size / (1024 * 1024)).toFixed(2);
    const sizeStr = file.size > 1024 * 1024 ? `${mbSize} MB` : `${Math.round(file.size / 1024)} KB`;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setAttachedFile({
        dataUrl,
        name: file.name,
        size: sizeStr,
        type: file.type || 'application/octet-stream',
      });

      if (!title.trim()) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '');
        setTitle(cleanName);
      }
      toast.success(`Attached file: ${file.name}`);
    };
    reader.readAsDataURL(file);
  };

  const handleOpenFile = (dataUrl?: string, fileName?: string) => {
    if (!dataUrl) {
      toast.error('No attached file to open');
      return;
    }
    try {
      if (dataUrl.startsWith('data:')) {
        const arr = dataUrl.split(',');
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
        }
      } else {
        window.open(dataUrl, '_blank');
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to open file');
    }
  };

  const handleDownloadFile = (dataUrl?: string, fileName?: string) => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = fileName || 'vault_document';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('Downloading document...');
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (editingItem) {
      updateVaultItem(editingItem.id, {
        title: title.trim(),
        category,
        secretContent: secretContent.trim(),
        fileDataUrl: attachedFile?.dataUrl,
        fileName: attachedFile?.name,
        fileSize: attachedFile?.size,
        fileType: attachedFile?.type,
        urlOrFilename: attachedFile?.name,
      });
      setIsAddOpen(false);
      setEditingItem(null);
      return;
    }

    addVaultItem({
      title: title.trim(),
      category,
      secretContent: secretContent.trim(),
      fileDataUrl: attachedFile?.dataUrl,
      fileName: attachedFile?.name,
      fileSize: attachedFile?.size,
      fileType: attachedFile?.type,
      urlOrFilename: attachedFile?.name,
    });

    setIsAddOpen(false);
    setTitle('');
    setSecretContent('');
    setAttachedFile(null);
  };

  const handleChangePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length < 4) return;
    setVaultPin(newPin);
    setIsChangePinOpen(false);
    setNewPin('');
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-[22px] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-[#FF7A00]" />
            <span>Secure Vault & B-School Credentials</span>
          </h2>
          <p className="text-xs text-[#A9A9A9] mt-1">
            PIN-protected encrypted storage for admit cards, certificates, resume, PDFs, and portal passwords
          </p>
        </div>

        {isVaultUnlocked ? (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsChangePinOpen(true)}
              className="px-3.5 py-2 bg-[#141414] hover:bg-white/10 text-white rounded-[14px] text-xs font-semibold cursor-pointer transition-colors"
            >
              Change PIN
            </button>
            <button
              onClick={lockVault}
              className="px-4 py-2 bg-[#FF5A5A]/20 text-[#FF5A5A] border border-[#FF5A5A]/40 hover:bg-[#FF5A5A]/30 rounded-[14px] text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Vault</span>
            </button>
          </div>
        ) : null}
      </div>

      {/* Vault Locked Screen */}
      {!isVaultUnlocked ? (
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[22px] p-12 text-center max-w-md mx-auto space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 text-[#FF7A00] flex items-center justify-center mx-auto shadow-xl">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white">Vault is Locked</h3>
            <p className="text-xs text-[#A9A9A9] mt-1">Enter your 4-digit security PIN to access documents</p>
          </div>

          <form onSubmit={handleUnlockSubmit} className="space-y-4">
            <input
              type="password"
              maxLength={6}
              autoFocus
              value={inputPin}
              onChange={(e) => setInputPin(e.target.value)}
              placeholder="Enter PIN (Default: 1234)"
              className="w-full bg-[#111111] border border-white/10 rounded-[18px] p-3 text-center text-lg font-mono font-bold text-white tracking-widest focus:outline-none focus:border-[#FF7A00]"
              id="vault-pin-input"
            />

            <button
              type="submit"
              className="w-full py-3 bg-[#FF7A00] text-black font-bold text-xs rounded-[16px] hover:bg-[#FFB547] shadow-lg shadow-[#FF7A00]/20 cursor-pointer"
              id="vault-unlock-btn"
            >
              Unlock Vault 🔓
            </button>
          </form>
        </div>
      ) : (
        /* Vault Unlocked Screen */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
              {['All', 'Certificates', 'Resume', 'Important PDFs', 'Passwords', 'Private Notes'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors flex-shrink-0 cursor-pointer ${
                    selectedCategory === cat 
                      ? 'bg-[#FF7A00] text-black' 
                      : 'bg-[#0a0a0a] text-[#A9A9A9] border border-white/5 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2 bg-[#FF7A00] text-black font-bold rounded-[14px] text-xs flex items-center space-x-1.5 cursor-pointer hover:bg-[#FFB547] shadow-lg shadow-[#FF7A00]/20 transition-colors"
              id="vault-add-btn"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Secure Item</span>
            </button>
          </div>

          {filteredItems.length === 0 ? (
            <div className="bg-[#0a0a0a] border border-white/5 rounded-[22px] p-12 text-center space-y-3">
              <FileText className="w-10 h-10 text-gray-600 mx-auto" />
              <h4 className="text-white font-bold text-sm">No items in this category</h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Store admit cards, scorecards, resume files, IDs, or portal passwords securely in your vault.
              </p>
              <button
                onClick={handleOpenAddModal}
                className="mt-2 px-4 py-2 bg-[#FF7A00] text-black text-xs font-bold rounded-xl hover:bg-[#FFB547] cursor-pointer inline-flex items-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map(item => {
                const isSecretVisible = !!visibleSecrets[item.id];
                const hasFile = !!item.fileDataUrl;
                const hasSecret = !!item.secretContent && item.secretContent.trim().length > 0;

                return (
                  <div key={item.id} className="bg-[#0a0a0a] border border-white/5 rounded-[22px] p-5 flex flex-col justify-between space-y-4 hover:border-white/10 transition-colors">
                    <div>
                      {/* Top Badges & Actions */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FF7A00]/10 text-[#FF7A00] border border-[#FF7A00]/20">
                          {item.category}
                        </span>

                        <div className="flex items-center space-x-1">
                          <button 
                            onClick={() => handleOpenEditModal(item)} 
                            className="p-1.5 text-[#707070] hover:text-[#FF7A00] hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                            title="Edit Item"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => deleteVaultItem(item.id)} 
                            className="p-1.5 text-[#707070] hover:text-[#FF5A5A] hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-sm font-bold text-white mt-3 flex items-center space-x-2">
                        <span>{item.title}</span>
                      </h3>

                      {/* Attached File Preview Card */}
                      {hasFile && (
                        <div className="mt-3 p-3 bg-[#111111] border border-emerald-500/20 rounded-2xl flex items-center justify-between gap-2">
                          <div className="flex items-center space-x-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                              <FileCheck className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-white truncate">
                                {item.fileName || 'Attached Document'}
                              </p>
                              <span className="text-[10px] text-gray-500">{item.fileSize || 'Uploaded File'}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1 shrink-0">
                            <button
                              onClick={() => handleOpenFile(item.fileDataUrl, item.fileName)}
                              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[10px] font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                              title="Open file in new window"
                            >
                              <ExternalLink className="w-3 h-3 text-[#FF7A00]" />
                              <span>Open</span>
                            </button>
                            <button
                              onClick={() => handleDownloadFile(item.fileDataUrl, item.fileName)}
                              className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                              title="Download file"
                            >
                              <Download className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Secret Content / Credentials Box */}
                      {hasSecret && (
                        <div className="mt-3 relative">
                          <div className="p-3.5 bg-[#111111] border border-white/10 rounded-2xl font-mono text-xs text-[#A9A9A9] leading-relaxed select-all pr-16 whitespace-pre-wrap break-words">
                            {isSecretVisible ? item.secretContent : '••••••••••••••••••••••••'}
                          </div>

                          <div className="absolute right-2 top-2 flex items-center space-x-1">
                            <button
                              onClick={() => toggleSecretVisibility(item.id)}
                              className="p-1.5 text-gray-500 hover:text-white bg-[#1a1a1a] rounded-lg cursor-pointer"
                              title={isSecretVisible ? "Hide Secret" : "Show Secret"}
                            >
                              {isSecretVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-[#FF7A00]" />}
                            </button>
                            <button
                              onClick={() => handleCopySecret(item.id, item.secretContent)}
                              className="p-1.5 text-gray-500 hover:text-[#FF7A00] bg-[#1a1a1a] rounded-lg cursor-pointer"
                              title="Copy to Clipboard"
                            >
                              {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-[#707070]">
                      <span>Updated: {item.updatedAt}</span>
                      {hasFile && <span className="text-emerald-400 font-semibold flex items-center space-x-1"><span>Document Attached</span></span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title={editingItem ? "Edit Secure Item" : "Add Secure Item to Vault"}
        subtitle="Information and attachments are stored securely in your encrypted browser storage"
      >
        <form onSubmit={handleSaveSubmit} className="space-y-4 text-xs">
          {/* File Upload Zone - Click to Upload & Drag and Drop */}
          <div>
            <label className="block text-[#A9A9A9] mb-1 font-medium">Attach File / Document (Optional)</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt,.csv"
              className="hidden"
            />

            {attachedFile ? (
              <div className="p-3 bg-[#111111] border border-emerald-500/40 rounded-2xl flex items-center justify-between">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-bold text-xs truncate">{attachedFile.name}</p>
                    <span className="text-[10px] text-gray-400">{attachedFile.size}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[10px] font-semibold cursor-pointer"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttachedFile(null)}
                    className="p-1.5 text-gray-500 hover:text-red-400 bg-white/5 rounded-lg cursor-pointer"
                    title="Remove attached file"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                className="border-2 border-dashed border-white/15 hover:border-[#FF7A00] rounded-2xl p-4 text-center cursor-pointer transition-all bg-[#111111]/60 hover:bg-[#111111] group"
              >
                <UploadCloud className="w-7 h-7 text-gray-500 group-hover:text-[#FF7A00] mx-auto mb-1.5 transition-colors" />
                <div className="text-white font-bold text-xs">
                  <span className="text-[#FF7A00] hover:underline">Click to Upload</span> or drag & drop
                </div>
                <p className="text-[10px] text-gray-500 mt-1">
                  Supports PDF documents, Certificates, Resumes, Admit Cards, or Images (PNG/JPG)
                </p>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-[#A9A9A9] mb-1 font-medium">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. JBIMS B-School Portal Password, CAT Admit Card"
              className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF7A00]"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-[#A9A9A9] mb-1 font-medium">Category</label>
            <select
              value={category}
              onChange={(e: any) => setCategory(e.target.value)}
              className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2 text-white focus:outline-none focus:border-[#FF7A00]"
            >
              <option value="Certificates">Certificates</option>
              <option value="Resume">Resume</option>
              <option value="Important PDFs">Important PDFs</option>
              <option value="Passwords">Passwords</option>
              <option value="Private Notes">Private Notes</option>
            </select>
          </div>

          {/* Secret Content / Notes */}
          <div>
            <label className="block text-[#A9A9A9] mb-1 font-medium">
              Secret Content / Credentials / Notes {attachedFile ? '(Optional)' : ''}
            </label>
            <textarea
              rows={3}
              value={secretContent}
              onChange={(e) => setSecretContent(e.target.value)}
              placeholder="Store passwords, login IDs, registration keys, or confidential notes here..."
              className="w-full bg-[#111111] border border-white/10 rounded-[16px] p-3 text-white font-mono placeholder-gray-500 focus:outline-none focus:border-[#FF7A00]"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-white/5">
            <button 
              type="button" 
              onClick={() => setIsAddOpen(false)} 
              className="px-4 py-2 text-[#A9A9A9] hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-5 py-2 bg-[#FF7A00] hover:bg-[#FFB547] text-black font-bold rounded-[14px] cursor-pointer transition-colors shadow-lg shadow-[#FF7A00]/20"
            >
              {editingItem ? 'Update Vault Item' : 'Save to Vault'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Change PIN Modal */}
      <Modal
        isOpen={isChangePinOpen}
        onClose={() => setIsChangePinOpen(false)}
        title="Change Security PIN"
        subtitle="Set a new passcode for your vault"
      >
        <form onSubmit={handleChangePinSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#A9A9A9] mb-1 font-medium">New 4-Digit PIN</label>
            <input
              type="password"
              required
              maxLength={6}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              placeholder="Enter new 4-digit PIN"
              className="w-full bg-[#111111] border border-white/10 rounded-[16px] p-3 text-center text-lg font-mono font-bold text-white focus:outline-none focus:border-[#FF7A00]"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-white/5">
            <button 
              type="button" 
              onClick={() => setIsChangePinOpen(false)} 
              className="px-4 py-2 text-[#A9A9A9] hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-5 py-2 bg-[#FF7A00] hover:bg-[#FFB547] text-black font-bold rounded-[14px] cursor-pointer transition-colors"
            >
              Update PIN
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

