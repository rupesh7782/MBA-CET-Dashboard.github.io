import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Target, CheckSquare, Square, Plus, Trash2, Pencil } from 'lucide-react';
import { GoalPeriod, Goal } from '../../types';
import { Modal } from '../common/Modal';

export const GoalsView: React.FC = () => {
  const { goals, addGoal, updateGoal, toggleGoal, deleteGoal } = useApp();

  const [selectedPeriod, setSelectedPeriod] = useState<GoalPeriod>('Daily');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  // Form (Add)
  const [text, setText] = useState('');
  const [period, setPeriod] = useState<GoalPeriod>('Daily');
  const [category, setCategory] = useState('Practice');

  // Form (Edit)
  const [editText, setEditText] = useState('');
  const [editPeriod, setEditPeriod] = useState<GoalPeriod>('Daily');
  const [editCategory, setEditCategory] = useState('Practice');

  const filteredGoals = goals.filter(g => g.period === selectedPeriod);
  const completedCount = filteredGoals.filter(g => g.isCompleted).length;
  const completionPct = filteredGoals.length > 0 ? Math.round((completedCount / filteredGoals.length) * 100) : 0;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    addGoal({
      text,
      period,
      category,
      isCompleted: false,
    });

    setIsAddOpen(false);
    setText('');
  };

  const handleStartEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setEditText(goal.text);
    setEditPeriod(goal.period);
    setEditCategory(goal.category || 'Practice');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGoal || !editText.trim()) return;

    updateGoal(editingGoal.id, {
      text: editText,
      period: editPeriod,
      category: editCategory,
    });

    setEditingGoal(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-[22px] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
            <Target className="w-5 h-5 text-[#FF7A00]" />
            <span>CET Preparation Targets & Goals</span>
          </h2>
          <p className="text-xs text-[#A9A9A9] mt-1">
            Track daily tasks, weekly syllabus milestones, and monthly targets
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-5 py-2.5 bg-[#FF7A00] text-black font-bold rounded-[14px] hover:bg-[#FFB547] text-xs flex items-center space-x-2 shadow-lg shadow-[#FF7A00]/20"
          id="goals-add-btn"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Tabs & Progress */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          {(['Daily', 'Weekly', 'Monthly'] as const).map(p => (
            <button
              key={p}
              onClick={() => setSelectedPeriod(p)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                selectedPeriod === p 
                  ? 'bg-[#FF7A00] text-black' 
                  : 'bg-[#0a0a0a] text-[#A9A9A9] border border-white/5 hover:text-white'
              }`}
            >
              {p} Goals
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div className="w-full sm:w-64 bg-[#0a0a0a] border border-white/5 p-3 rounded-2xl flex items-center space-x-3">
          <div className="flex-1 bg-[#262626] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#38E27A] h-full transition-all duration-500"
              style={{ width: `${completionPct}%` }}
            />
          </div>
          <span className="text-xs font-bold text-[#38E27A] whitespace-nowrap">
            {completionPct}% Complete
          </span>
        </div>
      </div>

      {/* Goals List */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-[22px] p-6 space-y-3">
        {filteredGoals.length === 0 ? (
          <p className="text-xs text-[#707070] text-center py-8">No goals set for {selectedPeriod} period.</p>
        ) : (
          filteredGoals.map(goal => (
            <div
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className={`p-4 rounded-[16px] border flex items-center justify-between cursor-pointer transition-all ${
                goal.isCompleted 
                  ? 'bg-[#141414]/50 border-white/5 text-[#707070] line-through' 
                  : 'bg-[#111111] border-white/10 hover:border-[#FF7A00]/40 text-white font-medium'
              }`}
            >
              <div className="flex items-center space-x-3">
                {goal.isCompleted ? (
                  <CheckSquare className="w-5 h-5 text-[#38E27A] flex-shrink-0" />
                ) : (
                  <Square className="w-5 h-5 text-[#707070] flex-shrink-0" />
                )}
                <span className="text-xs leading-relaxed">{goal.text}</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-[#A9A9A9]">
                  {goal.category}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartEdit(goal);
                  }}
                  title="Edit Goal"
                  className="p-1 text-[#707070] hover:text-[#FF7A00] transition-colors cursor-pointer"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteGoal(goal.id);
                  }}
                  title="Delete Goal"
                  className="p-1 text-[#707070] hover:text-[#FF5A5A] transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add New Target Goal"
        subtitle="Set clear targets to stay focused"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#A9A9A9] mb-1 font-medium">Goal Description</label>
            <input
              type="text"
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. Solve 100 Circular Arrangement Questions"
              className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2.5 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#A9A9A9] mb-1 font-medium">Period</label>
              <select
                value={period}
                onChange={(e: any) => setPeriod(e.target.value)}
                className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2 text-white"
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
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
            <button type="submit" className="px-5 py-2 bg-[#FF7A00] text-black font-bold rounded-[14px]">Add Goal</button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      {editingGoal && (
        <Modal
          isOpen={!!editingGoal}
          onClose={() => setEditingGoal(null)}
          title="Edit Target Goal"
          subtitle="Update goal details"
        >
          <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#A9A9A9] mb-1 font-medium">Goal Description</label>
              <input
                type="text"
                required
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                placeholder="e.g. Solve 100 Circular Arrangement Questions"
                className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2.5 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#A9A9A9] mb-1 font-medium">Period</label>
                <select
                  value={editPeriod}
                  onChange={(e: any) => setEditPeriod(e.target.value)}
                  className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2 text-white"
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
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
              <button type="button" onClick={() => setEditingGoal(null)} className="px-4 py-2 text-[#A9A9A9]">Cancel</button>
              <button type="submit" className="px-5 py-2 bg-[#FF7A00] text-black font-bold rounded-[14px]">Save Changes</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
