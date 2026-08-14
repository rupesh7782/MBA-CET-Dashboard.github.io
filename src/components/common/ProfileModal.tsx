import React, { useState } from 'react';
import { Camera, Upload, Link as LinkIcon, Check, X, User, Sparkles } from 'lucide-react';
import { Modal } from './Modal';
import { useApp } from '../../context/AppContext';
import toast from 'react-hot-toast';

const PRESET_AVATARS = [
  {
    id: 'male-1',
    label: 'Default Professional',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'male-2',
    label: 'Focus Scholar',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'male-3',
    label: 'Executive',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'male-4',
    label: 'Leader',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'female-1',
    label: 'Achiever',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'female-2',
    label: 'Top Ranker',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'academic-1',
    label: 'Creative Mind',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'minimal-1',
    label: 'Minimalist',
    url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80'
  }
];

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { userProfile, updateUserProfile } = useApp();

  const [name, setName] = useState(userProfile.name);
  const [avatarUrl, setAvatarUrl] = useState(userProfile.avatarUrl);
  const [tagline, setTagline] = useState(userProfile.tagline);
  const [activeTab, setActiveTab] = useState<'presets' | 'upload' | 'url'>('presets');
  const [customUrlInput, setCustomUrlInput] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 256;
          const MAX_HEIGHT = 256;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            setAvatarUrl(dataUrl);
            toast.success('New image loaded successfully!');
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyCustomUrl = () => {
    if (!customUrlInput.trim()) {
      toast.error('Please enter a valid image URL');
      return;
    }
    setAvatarUrl(customUrlInput.trim());
    toast.success('Image URL applied!');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: name.trim() || 'Rupesh Chavan',
      avatarUrl: avatarUrl,
      tagline: tagline.trim() || 'Focus • Consistency • Success',
    });
    toast.success('Profile picture and details saved!');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile & Avatar">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Current Avatar Preview */}
        <div className="flex flex-col items-center justify-center p-4 bg-[#111] border border-white/10 rounded-2xl">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full border-4 border-[#EAB308] p-0.5 overflow-hidden shadow-xl shadow-amber-500/10">
              <img
                src={avatarUrl}
                alt={name}
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <label 
              htmlFor="avatar-file-input" 
              className="absolute bottom-0 right-0 bg-[#EAB308] hover:bg-[#f59e0b] text-black p-2 rounded-full cursor-pointer shadow-lg transition-transform hover:scale-105"
              title="Upload new profile picture"
            >
              <Camera className="w-4 h-4" />
            </label>
            <input
              id="avatar-file-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2 font-medium">Click camera icon or choose below to change photo</p>
        </div>

        {/* Change Photo Methods Tabs */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-[#EAB308]" />
            <span>Select Profile Picture Method</span>
          </label>

          <div className="grid grid-cols-3 gap-2 p-1 bg-[#121212] rounded-xl border border-white/5">
            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className={`py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'presets'
                  ? 'bg-[#222] text-[#EAB308] border border-[#EAB308]/30 shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Preset Avatars
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'upload'
                  ? 'bg-[#222] text-[#EAB308] border border-[#EAB308]/30 shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Upload Device
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'url'
                  ? 'bg-[#222] text-[#EAB308] border border-[#EAB308]/30 shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Image Link
            </button>
          </div>

          {/* Preset Avatars Grid */}
          {activeTab === 'presets' && (
            <div className="grid grid-cols-4 gap-3 p-3 bg-[#0d0d0d] rounded-xl border border-white/5 max-h-48 overflow-y-auto">
              {PRESET_AVATARS.map((preset) => {
                const isSelected = avatarUrl === preset.url;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setAvatarUrl(preset.url)}
                    className={`relative group rounded-xl p-1 border transition-all flex flex-col items-center ${
                      isSelected
                        ? 'border-[#EAB308] bg-[#EAB308]/10 shadow-md'
                        : 'border-white/10 hover:border-white/30 bg-[#161616]'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden mb-1 relative">
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Check className="w-5 h-5 text-[#EAB308]" />
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-300 font-medium truncate w-full text-center">
                      {preset.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Upload File Tab */}
          {activeTab === 'upload' && (
            <div className="p-4 bg-[#0d0d0d] rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center text-center space-y-3">
              <Upload className="w-8 h-8 text-[#EAB308]" />
              <div>
                <p className="text-xs font-medium text-white">Choose an image file from your computer or phone</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Supports PNG, JPG, WEBP (Max 5MB)</p>
              </div>
              <label
                htmlFor="avatar-file-input-tab"
                className="px-4 py-2 bg-[#EAB308] hover:bg-[#f59e0b] text-black text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-md"
              >
                Browse Image File
              </label>
              <input
                id="avatar-file-input-tab"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          )}

          {/* URL Input Tab */}
          {activeTab === 'url' && (
            <div className="p-3 bg-[#0d0d0d] rounded-xl border border-white/5 space-y-3">
              <div className="flex space-x-2">
                <input
                  type="url"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  placeholder="Paste direct image URL (e.g. https://...)"
                  className="flex-1 bg-black border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#EAB308]"
                />
                <button
                  type="button"
                  onClick={handleApplyCustomUrl}
                  className="px-3 py-2 bg-[#EAB308] hover:bg-[#f59e0b] text-black text-xs font-bold rounded-lg transition-colors flex items-center space-x-1"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Apply</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Fields */}
        <div className="space-y-4 pt-2 border-t border-white/10">
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-black border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#EAB308]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
              Tagline / Status Quote
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#EAB308]"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-gray-300 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-[#EAB308] hover:bg-[#f59e0b] text-black text-xs font-bold rounded-xl transition-colors shadow-lg shadow-amber-500/20"
          >
            Save Profile
          </button>
        </div>

      </form>
    </Modal>
  );
};
