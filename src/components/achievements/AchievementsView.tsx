import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Award, Trophy, Flame, Clock, CheckCircle2, Zap, Plus, Trash2, Pencil } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Achievement } from '../../types';

export const AchievementsView: React.FC = () => {
  const { achievements, unlockAchievement, addCustomAchievement, updateAchievement, deleteAchievement } = useApp();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingAch, setEditingAch] = useState<Achievement | null>(null);

  // Form (Add)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [target, setTarget] = useState<number>(10);
  const [category, setCategory] = useState('Custom');

  // Form (Edit)
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTarget, setEditTarget] = useState<number>(10);
  const [editProgress, setEditProgress] = useState<number>(0);
  const [editCategory, setEditCategory] = useState('Custom');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addCustomAchievement({
      title,
      description,
      iconName: 'Award',
      progress: 0,
      target,
      category,
    });

    setIsAddOpen(false);
    setTitle('');
    setDescription('');
  };

  const handleStartEdit = (ach: Achievement) => {
    setEditingAch(ach);
    setEditTitle(ach.title);
    setEditDescription(ach.description);
    setEditTarget(ach.target);
    setEditProgress(ach.progress);
    setEditCategory(ach.category || 'Custom');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAch || !editTitle.trim()) return;

    updateAchievement(editingAch.id, {
      title: editTitle,
      description: editDescription,
      target: editTarget,
      progress: editProgress,
      category: editCategory,
    });

    setEditingAch(null);
  };

  const handleDelete = (id: string) => {
    deleteAchievement(id);
    setDeletingId(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-[22px] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
            <Award className="w-5 h-5 text-[#FF7A00]" />
            <span>Preparation Milestones & Achievements</span>
          </h2>
          <p className="text-xs text-[#A9A9A9] mt-1">
            Unlock badges as you hit study streaks, question targets, and top mock percentiles
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-5 py-2.5 bg-[#FF7A00] text-black font-bold rounded-[14px] hover:bg-[#FFB547] text-xs flex items-center space-x-2 shadow-lg shadow-[#FF7A00]/20 cursor-pointer"
          id="ach-add-btn"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Custom Milestone</span>
        </button>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map(ach => {
          const isUnlocked = !!ach.unlockedAt;
          const pct = Math.min(100, Math.round((ach.progress / ach.target) * 100));

          return (
            <div
              key={ach.id}
              className={`bg-[#0a0a0a] border rounded-[22px] p-6 flex flex-col justify-between transition-all relative overflow-hidden group ${
                isUnlocked 
                  ? 'border-[#FF7A00]/40 shadow-xl shadow-[#FF7A00]/5' 
                  : 'border-white/5 opacity-85 hover:opacity-100'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    isUnlocked ? 'bg-[#FF7A00] text-black' : 'bg-white/5 text-[#707070]'
                  }`}>
                    {ach.iconName === 'Flame' ? <Flame className="w-6 h-6 fill-current" /> :
                     ach.iconName === 'Clock' ? <Clock className="w-6 h-6" /> :
                     ach.iconName === 'CheckCircle2' ? <CheckCircle2 className="w-6 h-6" /> :
                     ach.iconName === 'Zap' ? <Zap className="w-6 h-6" /> :
                     <Trophy className="w-6 h-6" />}
                  </div>

                  <div className="flex items-center space-x-2">
                    {isUnlocked ? (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#38E27A]/20 text-[#38E27A]">
                        Unlocked {ach.unlockedAt}
                      </span>
                    ) : (
                      <button
                        onClick={() => unlockAchievement(ach.id)}
                        className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/5 text-[#A9A9A9] hover:text-white border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                      >
                        Unlock Now
                      </button>
                    )}

                    <button
                      onClick={() => handleStartEdit(ach)}
                      title="Edit Milestone"
                      className="p-1.5 text-white/30 hover:text-[#FF7A00] hover:bg-[#FF7A00]/10 rounded-lg transition-all cursor-pointer"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setDeletingId(ach.id)}
                      title="Delete Milestone"
                      className="p-1.5 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mt-4">{ach.title}</h3>
                <p className="text-xs text-[#A9A9A9] mt-1 leading-relaxed">{ach.description}</p>
              </div>

              <div className="mt-6 pt-3 border-t border-white/5">
                <div className="flex justify-between text-[11px] mb-1 font-semibold">
                  <span className="text-[#707070]">Progress</span>
                  <span className={isUnlocked ? 'text-[#38E27A]' : 'text-white'}>
                    {ach.progress} / {ach.target}
                  </span>
                </div>
                <div className="w-full bg-[#262626] h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${isUnlocked ? 'bg-[#38E27A]' : 'bg-[#FF7A00]'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <Modal
          isOpen={!!deletingId}
          onClose={() => setDeletingId(null)}
          title="Delete Milestone"
          subtitle="Are you sure you want to remove this milestone?"
        >
          <div className="space-y-4 pt-2">
            <p className="text-xs text-[#A9A9A9]">
              This will permanently delete this milestone from your achievements. This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3 pt-3 border-t border-white/5">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 text-xs font-semibold text-[#A9A9A9] hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                className="px-5 py-2 text-xs font-bold bg-red-500 hover:bg-red-600 text-white rounded-[14px] cursor-pointer"
              >
                Delete Milestone
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Custom Achievement Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Custom Milestone"
        subtitle="Set personal achievement goals"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#A9A9A9] mb-1 font-medium">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Master 200 Vocab Words"
              className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2.5 text-white"
            />
          </div>

          <div>
            <label className="block text-[#A9A9A9] mb-1 font-medium">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Target milestone details..."
              className="w-full bg-[#111111] border border-white/10 rounded-[16px] p-3 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#A9A9A9] mb-1 font-medium">Target Count</label>
              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-[#A9A9A9] mb-1 font-medium">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2 text-white"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-white/5">
            <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 text-[#A9A9A9]">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-[#FF7A00] text-black font-bold rounded-[14px]">Create Milestone</button>
          </div>
        </form>
      </Modal>

      {/* Edit Milestone Modal */}
      {editingAch && (
        <Modal
          isOpen={!!editingAch}
          onClose={() => setEditingAch(null)}
          title="Edit Milestone"
          subtitle="Update milestone details and progress"
        >
          <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#A9A9A9] mb-1 font-medium">Title</label>
              <input
                type="text"
                required
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="e.g. Master 200 Vocab Words"
                className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2.5 text-white"
              />
            </div>

            <div>
              <label className="block text-[#A9A9A9] mb-1 font-medium">Description</label>
              <textarea
                rows={2}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Target milestone details..."
                className="w-full bg-[#111111] border border-white/10 rounded-[16px] p-3 text-white"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[#A9A9A9] mb-1 font-medium">Progress</label>
                <input
                  type="number"
                  min="0"
                  value={editProgress}
                  onChange={(e) => setEditProgress(Number(e.target.value))}
                  className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-[#A9A9A9] mb-1 font-medium">Target Count</label>
                <input
                  type="number"
                  min="1"
                  value={editTarget}
                  onChange={(e) => setEditTarget(Number(e.target.value))}
                  className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-[#A9A9A9] mb-1 font-medium">Category</label>
                <input
                  type="text"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-white/5">
              <button type="button" onClick={() => setEditingAch(null)} className="px-4 py-2 text-[#A9A9A9]">Cancel</button>
              <button type="submit" className="px-5 py-2 bg-[#FF7A00] text-black font-bold rounded-[14px]">Save Changes</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
