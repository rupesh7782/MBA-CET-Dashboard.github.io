import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, Unlock, Key, Plus, Trash2, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { VaultCategory, VaultItem } from '../../types';
import { Modal } from '../common/Modal';

export const VaultView: React.FC = () => {
  const { 
    vaultItems, 
    addVaultItem, 
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

  // New Vault Item
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<VaultCategory>('Passwords');
  const [secretContent, setSecretContent] = useState('');

  // Pin state for setting
  const [newPin, setNewPin] = useState('');

  const filteredItems = vaultItems.filter(v => selectedCategory === 'All' || v.category === selectedCategory);

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (unlockVaultWithPin(inputPin)) {
      setInputPin('');
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !secretContent.trim()) return;

    addVaultItem({
      title,
      category,
      secretContent,
    });

    setIsAddOpen(false);
    setTitle('');
    setSecretContent('');
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
            PIN-protected encrypted storage for admit cards, certificates, resume, and portal passwords
          </p>
        </div>

        {isVaultUnlocked ? (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsChangePinOpen(true)}
              className="px-3.5 py-2 bg-[#141414] hover:bg-white/10 text-white rounded-[14px] text-xs font-semibold"
            >
              Change PIN
            </button>
            <button
              onClick={lockVault}
              className="px-4 py-2 bg-[#FF5A5A]/20 text-[#FF5A5A] border border-[#FF5A5A]/40 hover:bg-[#FF5A5A]/30 rounded-[14px] text-xs font-bold flex items-center space-x-1.5"
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
              className="w-full py-3 bg-[#FF7A00] text-black font-bold text-xs rounded-[16px] hover:bg-[#FFB547] shadow-lg shadow-[#FF7A00]/20"
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
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors flex-shrink-0 ${
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
              onClick={() => setIsAddOpen(true)}
              className="px-4 py-2 bg-[#FF7A00] text-black font-bold rounded-[14px] text-xs flex items-center space-x-1.5"
              id="vault-add-btn"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Secure Item</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map(item => (
              <div key={item.id} className="bg-[#0a0a0a] border border-white/5 rounded-[22px] p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-[#FF7A00]/10 text-[#FF7A00]">
                      {item.category}
                    </span>
                    <button onClick={() => deleteVaultItem(item.id)} className="p-1 text-[#707070] hover:text-[#FF5A5A]">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-white mt-3">{item.title}</h3>
                  <div className="mt-3 p-3.5 bg-[#111111] border border-white/10 rounded-2xl font-mono text-xs text-[#A9A9A9] leading-relaxed select-all">
                    {item.secretContent}
                  </div>
                </div>

                <p className="text-[10px] text-[#707070] mt-4 pt-2 border-t border-white/5">
                  Updated: {item.updatedAt}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Secure Item to Vault"
        subtitle="Information is stored securely in your encrypted browser storage"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#A9A9A9] mb-1 font-medium">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. JBIMS B-School Portal Password"
              className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2.5 text-white"
            />
          </div>

          <div>
            <label className="block text-[#A9A9A9] mb-1 font-medium">Category</label>
            <select
              value={category}
              onChange={(e: any) => setCategory(e.target.value)}
              className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2 text-white"
            >
              <option value="Certificates">Certificates</option>
              <option value="Resume">Resume</option>
              <option value="Important PDFs">Important PDFs</option>
              <option value="Passwords">Passwords</option>
              <option value="Private Notes">Private Notes</option>
            </select>
          </div>

          <div>
            <label className="block text-[#A9A9A9] mb-1 font-medium">Secret Content / Credentials</label>
            <textarea
              rows={4}
              required
              value={secretContent}
              onChange={(e) => setSecretContent(e.target.value)}
              placeholder="Store passwords, IDs, or confidential notes here..."
              className="w-full bg-[#111111] border border-white/10 rounded-[16px] p-3 text-white font-mono"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-white/5">
            <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 text-[#A9A9A9]">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-[#FF7A00] text-black font-bold rounded-[14px]">Save to Vault</button>
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
              className="w-full bg-[#111111] border border-white/10 rounded-[16px] p-3 text-center text-lg font-mono font-bold text-white"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-white/5">
            <button type="button" onClick={() => setIsChangePinOpen(false)} className="px-4 py-2 text-[#A9A9A9]">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-[#FF7A00] text-black font-bold rounded-[14px]">Update PIN</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
