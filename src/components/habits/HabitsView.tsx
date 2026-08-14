import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CalendarCheck, Flame, Plus, Check, Trash2, Sparkles, Activity, BookOpen, Calculator } from 'lucide-react';
import { Modal } from '../common/Modal';

export const HabitsView: React.FC = () => {
  const { habits, addHabit, toggleHabitForDate, deleteHabit } = useApp();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Study');

  // Past 7 Days dates
  const past7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      dateStr: d.toISOString().split('T')[0],
      dayLabel: d.toLocaleString('en-US', { weekday: 'short' }),
      dayNum: d.getDate(),
      isToday: i === 6,
    };
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addHabit({
      title,
      iconName: 'Sparkles',
      category,
    });

    setIsAddOpen(false);
    setTitle('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-[22px] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
            <CalendarCheck className="w-5 h-5 text-[#FF7A00]" />
            <span>Daily Aspirant Habit Tracker</span>
          </h2>
          <p className="text-xs text-[#A9A9A9] mt-1">
            Build disciplined daily study routines to maintain high momentum
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-5 py-2.5 bg-[#FF7A00] text-black font-bold rounded-[14px] hover:bg-[#FFB547] text-xs flex items-center space-x-2 shadow-lg shadow-[#FF7A00]/20"
          id="habits-add-btn"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Habit</span>
        </button>
      </div>

      {/* Habits Matrix Card */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-[22px] p-6 overflow-x-auto">
        <table className="w-full border-collapse text-xs text-left min-w-[600px]">
          <thead>
            <tr className="border-b border-white/5 text-[#707070] uppercase text-[10px] font-bold">
              <th className="py-3 px-4">Habit</th>
              <th className="py-3 px-2 text-center">Streak</th>
              {past7Days.map(d => (
                <th key={d.dateStr} className={`py-3 px-2 text-center ${d.isToday ? 'text-[#FF7A00] font-bold' : ''}`}>
                  <span>{d.dayLabel}</span>
                  <span className="block text-[9px] opacity-70">{d.dayNum}</span>
                </th>
              ))}
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {habits.map(habit => (
              <tr key={habit.id} className="hover:bg-[#141414]/40 transition-colors">
                <td className="py-4 px-4 font-bold text-white">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-[#FF7A00]/10 text-[#FF7A00] flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{habit.title}</p>
                      <p className="text-[10px] text-[#707070]">{habit.category}</p>
                    </div>
                  </div>
                </td>

                <td className="py-4 px-2 text-center">
                  <span className="inline-flex items-center space-x-1 font-bold text-[#FF7A00]">
                    <span>{habit.currentStreak}d</span>
                    <Flame className="w-3.5 h-3.5 fill-[#FF7A00]" />
                  </span>
                </td>

                {past7Days.map(d => {
                  const isDone = !!habit.completionHistory[d.dateStr];
                  return (
                    <td key={d.dateStr} className="py-4 px-2 text-center">
                      <button
                        onClick={() => toggleHabitForDate(habit.id, d.dateStr)}
                        className={`w-7 h-7 rounded-xl border flex items-center justify-center mx-auto transition-all ${
                          isDone 
                            ? 'bg-[#38E27A] border-[#38E27A] text-black font-bold scale-105' 
                            : 'bg-[#111111] border-white/10 hover:border-white/30 text-transparent'
                        }`}
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </button>
                    </td>
                  );
                })}

                <td className="py-4 px-4 text-right">
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="p-1.5 text-[#707070] hover:text-[#FF5A5A]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Habit Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Track New Habit"
        subtitle="Build consistency across study & health"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#A9A9A9] mb-1 font-medium">Habit Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Solve 30 Quant Questions Daily"
              className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2.5 text-white"
            />
          </div>

          <div>
            <label className="block text-[#A9A9A9] mb-1 font-medium">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2 text-white"
            >
              <option value="Study">Study</option>
              <option value="Reading">Reading</option>
              <option value="Vocabulary">Vocabulary</option>
              <option value="Exercise">Exercise</option>
              <option value="Sleep">Sleep</option>
              <option value="Water">Water</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-white/5">
            <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 text-[#A9A9A9]">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-[#FF7A00] text-black font-bold rounded-[14px]">Create Habit</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
