import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ListCheck, Plus, Trash2, Edit3, Clock, Target } from 'lucide-react';
import { SectionalTest, Subject } from '../../types';
import { Modal } from '../common/Modal';

export const SectionalTestsView: React.FC = () => {
  const { sectionalTests, addSectionalTest, updateSectionalTest, deleteSectionalTest } = useApp();

  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<SectionalTest | null>(null);

  // Form (Add)
  const [name, setName] = useState('');
  const [subject, setSubject] = useState<Subject>('LRDI');
  const [score, setScore] = useState<number>(40);
  const [attempted, setAttempted] = useState<number>(45);
  const [maxScore, setMaxScore] = useState<number>(50);
  const [timeTaken, setTimeTaken] = useState<number>(35);
  const [remarks, setRemarks] = useState('');

  // Form (Edit)
  const [editName, setEditName] = useState('');
  const [editSubject, setEditSubject] = useState<Subject>('LRDI');
  const [editScore, setEditScore] = useState<number>(40);
  const [editAttempted, setEditAttempted] = useState<number>(45);
  const [editMaxScore, setEditMaxScore] = useState<number>(50);
  const [editTimeTaken, setEditTimeTaken] = useState<number>(35);
  const [editRemarks, setEditRemarks] = useState('');
  const [editDate, setEditDate] = useState('');

  const filteredTests = sectionalTests.filter(s => selectedSubject === 'All' || s.subject === selectedSubject);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const effectiveAttempted = attempted || score;
    const acc = effectiveAttempted > 0 ? Number(((score / effectiveAttempted) * 100).toFixed(1)) : 0;
    const estPercentile = Math.min(99.9, Math.max(40, Number(((score / (maxScore || 50)) * 105).toFixed(1))));

    addSectionalTest({
      name,
      subject,
      date: new Date().toISOString().split('T')[0],
      score,
      attempted: effectiveAttempted,
      maxScore,
      timeTakenMinutes: timeTaken,
      accuracy: acc,
      percentile: estPercentile,
      remarks,
    });

    setIsAddOpen(false);
    setName('');
    setRemarks('');
  };

  const openEditModal = (test: SectionalTest) => {
    setEditingTest(test);
    setEditName(test.name);
    setEditSubject(test.subject);
    setEditScore(test.score);
    setEditAttempted(test.attempted ?? test.score);
    setEditMaxScore(test.maxScore);
    setEditTimeTaken(test.timeTakenMinutes);
    setEditRemarks(test.remarks || '');
    setEditDate(test.date || new Date().toISOString().split('T')[0]);
    setIsEditOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTest || !editName.trim()) return;

    const effectiveAttempted = editAttempted || editScore;
    const acc = effectiveAttempted > 0 ? Number(((editScore / effectiveAttempted) * 100).toFixed(1)) : 0;
    const estPercentile = Math.min(99.9, Math.max(40, Number(((editScore / (editMaxScore || 50)) * 105).toFixed(1))));

    updateSectionalTest(editingTest.id, {
      name: editName,
      subject: editSubject,
      date: editDate,
      score: editScore,
      attempted: effectiveAttempted,
      maxScore: editMaxScore,
      timeTakenMinutes: editTimeTaken,
      accuracy: acc,
      percentile: estPercentile,
      remarks: editRemarks,
    });

    setIsEditOpen(false);
    setEditingTest(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-[22px] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
            <ListCheck className="w-5 h-5 text-[#FF7A00]" />
            <span>Sectional Tests & Speed Drills</span>
          </h2>
          <p className="text-xs text-[#A9A9A9] mt-1">
            Subject-specific speed tests for VARC, LRDI, AR, and Quant
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-5 py-2.5 bg-[#FF7A00] text-black font-bold rounded-[14px] hover:bg-[#FFB547] text-xs flex items-center space-x-2 shadow-lg shadow-[#FF7A00]/20 cursor-pointer"
          id="sec-add-btn"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Log Sectional Test</span>
        </button>
      </div>

      {/* Subject Filter */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
        {['All', 'VARC', 'LRDI', 'AR', 'QUANT'].map(sub => (
          <button
            key={sub}
            onClick={() => setSelectedSubject(sub)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex-shrink-0 cursor-pointer ${
              selectedSubject === sub 
                ? 'bg-[#FF7A00] text-black' 
                : 'bg-[#0a0a0a] text-[#A9A9A9] border border-white/5 hover:text-white'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTests.map(test => (
          <div
            key={test.id}
            className="bg-[#0a0a0a] border border-white/5 hover:border-[#FF7A00]/40 rounded-[22px] p-5 flex flex-col justify-between transition-all group"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  test.subject === 'LRDI' ? 'bg-[#FF7A00]/20 text-[#FF7A00]' :
                  test.subject === 'VARC' ? 'bg-[#38E27A]/20 text-[#38E27A]' :
                  test.subject === 'AR' ? 'bg-[#F4B400]/20 text-[#F4B400]' :
                  'bg-[#FFB547]/20 text-[#FFB547]'
                }`}>
                  {test.subject}
                </span>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => openEditModal(test)}
                    className="p-1 text-[#707070] hover:text-[#FFB547] transition-colors cursor-pointer"
                    title="Edit Sectional Test"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteSectionalTest(test.id)}
                    className="p-1 text-[#707070] hover:text-[#FF5A5A] transition-colors cursor-pointer"
                    title="Delete Sectional Test"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-sm font-bold text-white mt-3">{test.name}</h3>
              <div className="flex items-center space-x-3 text-[10px] text-[#A9A9A9] mt-0.5">
                <span>{test.date}</span>
                {test.timeTakenMinutes && (
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-[#707070]" />
                    <span>{test.timeTakenMinutes} mins</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-4 gap-1.5 mt-4 pt-3 border-t border-white/5 text-center">
                <div className="bg-[#111111] p-2 rounded-xl">
                  <p className="text-[10px] text-[#707070]">Score</p>
                  <p className="text-sm font-bold text-white font-mono">{test.score}/{test.maxScore}</p>
                </div>
                <div className="bg-[#111111] p-2 rounded-xl">
                  <p className="text-[10px] text-[#707070]">Attempted</p>
                  <p className="text-sm font-bold text-cyan-400 font-mono">{test.attempted ?? test.score}</p>
                </div>
                <div className="bg-[#111111] p-2 rounded-xl">
                  <p className="text-[10px] text-[#707070]">Accuracy</p>
                  <p className="text-sm font-bold text-[#38E27A] font-mono">{test.accuracy}%</p>
                </div>
                <div className="bg-[#111111] p-2 rounded-xl">
                  <p className="text-[10px] text-[#707070]">Percentile</p>
                  <p className="text-sm font-bold text-[#FF7A00] font-mono">{test.percentile}%</p>
                </div>
              </div>

              {test.remarks && (
                <p className="text-[11px] text-[#A9A9A9] mt-3 italic line-clamp-2 bg-[#111111]/60 p-2 rounded-xl border border-white/5">
                  "{test.remarks}"
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Log Sectional Test"
        subtitle="Record subject-specific speed drills"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#A9A9A9] mb-1 font-medium">Test Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Circular Arrangement Speed Test"
              className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2.5 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#A9A9A9] mb-1 font-medium">Subject</label>
              <select
                value={subject}
                onChange={(e: any) => setSubject(e.target.value)}
                className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2 text-white"
              >
                <option value="VARC">VARC</option>
                <option value="LRDI">LRDI</option>
                <option value="AR">Abstract Reasoning (AR)</option>
                <option value="QUANT">Quant</option>
              </select>
            </div>

            <div>
              <label className="block text-[#A9A9A9] mb-1 font-medium">Time Taken (Mins)</label>
              <input
                type="number"
                value={timeTaken}
                onChange={(e) => setTimeTaken(Number(e.target.value))}
                className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 bg-[#111111] p-3 rounded-2xl border border-white/5">
            <div>
              <label className="block text-[#FF7A00] font-bold">Score Obtained</label>
              <input
                type="number"
                min={0}
                max={attempted || maxScore || 100}
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="w-full bg-[#0a0a0a] p-2 text-center rounded-xl text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-cyan-400 font-bold">Attempted</label>
              <input
                type="number"
                min={0}
                max={maxScore || 100}
                value={attempted}
                onChange={(e) => setAttempted(Number(e.target.value))}
                className="w-full bg-[#0a0a0a] p-2 text-center rounded-xl text-cyan-400 font-bold"
              />
            </div>

            <div>
              <label className="block text-[#A9A9A9] font-bold">Max Score</label>
              <input
                type="number"
                min={1}
                value={maxScore}
                onChange={(e) => setMaxScore(Number(e.target.value))}
                className="w-full bg-[#0a0a0a] p-2 text-center rounded-xl text-white font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#A9A9A9] mb-1 font-medium">Remarks</label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full bg-[#111111] border border-white/10 rounded-[16px] p-3 text-white"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-white/5">
            <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 text-[#A9A9A9] cursor-pointer">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-[#FF7A00] text-black font-bold rounded-[14px] cursor-pointer hover:bg-[#FFB547]">Save Sectional</button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Sectional Test"
        subtitle="Update test score, timing, or remarks"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#A9A9A9] mb-1 font-medium">Test Name</label>
            <input
              type="text"
              required
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2.5 text-white"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[#A9A9A9] mb-1 font-medium">Subject</label>
              <select
                value={editSubject}
                onChange={(e: any) => setEditSubject(e.target.value)}
                className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2 text-white"
              >
                <option value="VARC">VARC</option>
                <option value="LRDI">LRDI</option>
                <option value="AR">Abstract Reasoning (AR)</option>
                <option value="QUANT">Quant</option>
              </select>
            </div>

            <div>
              <label className="block text-[#A9A9A9] mb-1 font-medium">Date</label>
              <input
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-[#A9A9A9] mb-1 font-medium">Time Taken (Mins)</label>
              <input
                type="number"
                value={editTimeTaken}
                onChange={(e) => setEditTimeTaken(Number(e.target.value))}
                className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 bg-[#111111] p-3 rounded-2xl border border-white/5">
            <div>
              <label className="block text-[#FF7A00] font-bold">Score Obtained</label>
              <input
                type="number"
                min={0}
                max={editAttempted || editMaxScore || 100}
                value={editScore}
                onChange={(e) => setEditScore(Number(e.target.value))}
                className="w-full bg-[#0a0a0a] p-2 text-center rounded-xl text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-cyan-400 font-bold">Attempted</label>
              <input
                type="number"
                min={0}
                max={editMaxScore || 100}
                value={editAttempted}
                onChange={(e) => setEditAttempted(Number(e.target.value))}
                className="w-full bg-[#0a0a0a] p-2 text-center rounded-xl text-cyan-400 font-bold"
              />
            </div>

            <div>
              <label className="block text-[#A9A9A9] font-bold">Max Score</label>
              <input
                type="number"
                min={1}
                value={editMaxScore}
                onChange={(e) => setEditMaxScore(Number(e.target.value))}
                className="w-full bg-[#0a0a0a] p-2 text-center rounded-xl text-white font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#A9A9A9] mb-1 font-medium">Remarks</label>
            <textarea
              rows={2}
              value={editRemarks}
              onChange={(e) => setEditRemarks(e.target.value)}
              className="w-full bg-[#111111] border border-white/10 rounded-[16px] p-3 text-white"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-white/5">
            <button type="button" onClick={() => setIsEditOpen(false)} className="px-4 py-2 text-[#A9A9A9] cursor-pointer">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-[#FF7A00] text-black font-bold rounded-[14px] cursor-pointer hover:bg-[#FFB547]">Update Sectional</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
