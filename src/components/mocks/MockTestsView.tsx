import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileSpreadsheet, Plus, Trophy, Clock, Target, Trash2, Edit3 } from 'lucide-react';
import { MockTest } from '../../types';
import { Modal } from '../common/Modal';

export const MockTestsView: React.FC = () => {
  const { mockTests, addMockTest, updateMockTest, deleteMockTest } = useApp();

  const [selectedMock, setSelectedMock] = useState<MockTest | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [date, setDate] = useState('2026-05-28');
  const [time, setTime] = useState('09:00 AM');
  const [varc, setVarc] = useState<number>(38);
  const [lrdi, setLrdi] = useState<number>(50);
  const [ar, setAr] = useState<number>(40);
  const [quant, setQuant] = useState<number>(36);
  const [timeTaken, setTimeTaken] = useState<number>(150);
  const [status, setStatus] = useState<'Completed' | 'Upcoming' | 'Scheduled'>('Completed');
  const [remarks, setRemarks] = useState('');

  const openAddModal = () => {
    setName(`MBA CET Mock Test ${mockTests.length + 1}`);
    setDate(new Date().toISOString().split('T')[0]);
    setVarc(38);
    setLrdi(50);
    setAr(40);
    setQuant(36);
    setTimeTaken(150);
    setStatus('Completed');
    setRemarks('');
    setIsAddOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const total = varc + lrdi + ar + quant;
    const accuracy = 82;
    const estPercentile = Math.min(99.9, Math.max(10, Number((total / 200 * 110).toFixed(1))));

    addMockTest({
      name,
      date,
      time,
      varcScore: varc,
      lrdiScore: lrdi,
      arScore: ar,
      quantScore: quant,
      totalScore: total,
      maxScore: 200,
      percentile: estPercentile,
      timeTakenMinutes: timeTaken,
      accuracy,
      remarks: remarks || 'Mock test completed',
      status,
    });

    setIsAddOpen(false);
  };

  const openEditModal = (m: MockTest) => {
    setSelectedMock(m);
    setName(m.name);
    setDate(m.date);
    setVarc(m.varcScore);
    setLrdi(m.lrdiScore);
    setAr(m.arScore);
    setQuant(m.quantScore);
    setTimeTaken(m.timeTakenMinutes);
    setStatus(m.status);
    setRemarks(m.remarks);
    setIsEditOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMock) return;

    const total = varc + lrdi + ar + quant;
    const estPercentile = Math.min(99.9, Math.max(10, Number((total / 200 * 110).toFixed(1))));

    updateMockTest(selectedMock.id, {
      name,
      date,
      varcScore: varc,
      lrdiScore: lrdi,
      arScore: ar,
      quantScore: quant,
      totalScore: total,
      percentile: estPercentile,
      timeTakenMinutes: timeTaken,
      status,
      remarks,
    });

    setIsEditOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-[22px] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-[#FF7A00]" />
            <span>Full Length Mock Tests Tracker</span>
          </h2>
          <p className="text-xs text-[#A9A9A9] mt-1">
            200 Questions • 150 Minutes • Sectional Performance Analysis
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-[#FF7A00] text-black font-bold rounded-[14px] hover:bg-[#FFB547] text-xs flex items-center space-x-2 shadow-lg shadow-[#FF7A00]/20"
          id="mock-add-btn"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Mock Test</span>
        </button>
      </div>

      {/* Mocks Table */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-[22px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#111111] text-[#707070] border-b border-white/5 uppercase text-[10px] font-bold tracking-wider">
                <th className="p-4">Mock Name</th>
                <th className="p-4">Date</th>
                <th className="p-4">VARC (50)</th>
                <th className="p-4">LRDI (75)</th>
                <th className="p-4">AR (25)</th>
                <th className="p-4">QUANT (50)</th>
                <th className="p-4">Total Score</th>
                <th className="p-4">Percentile</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockTests.map(m => (
                <tr key={m.id} className="hover:bg-[#141414]/50 transition-colors">
                  <td className="p-4 font-bold text-white flex items-center space-x-2">
                    <FileSpreadsheet className="w-4 h-4 text-[#FF7A00]" />
                    <span>{m.name}</span>
                  </td>
                  <td className="p-4 text-[#A9A9A9]">{m.date}</td>
                  <td className="p-4 font-semibold text-[#FF7A00]">{m.status === 'Completed' ? m.varcScore : '-'}</td>
                  <td className="p-4 font-semibold text-[#FFB547]">{m.status === 'Completed' ? m.lrdiScore : '-'}</td>
                  <td className="p-4 font-semibold text-[#F4B400]">{m.status === 'Completed' ? m.arScore : '-'}</td>
                  <td className="p-4 font-semibold text-[#38E27A]">{m.status === 'Completed' ? m.quantScore : '-'}</td>
                  <td className="p-4 font-bold text-white">{m.status === 'Completed' ? `${m.totalScore}/200` : '-'}</td>
                  <td className="p-4 font-black text-[#FF7A00]">
                    {m.status === 'Completed' ? `${m.percentile}%ile` : '-'}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      m.status === 'Completed' ? 'bg-[#38E27A]/20 text-[#38E27A]' : 'bg-[#FF7A00]/20 text-[#FF7A00]'
                    }`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => openEditModal(m)}
                        className="p-1.5 text-[#707070] hover:text-white rounded-lg hover:bg-white/5"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteMockTest(m.id)}
                        className="p-1.5 text-[#707070] hover:text-[#FF5A5A] rounded-lg hover:bg-white/5"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Mock Test"
        subtitle="Record your full length mock performance"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#A9A9A9] mb-1 font-medium">Mock Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2.5 text-white focus:outline-none focus:border-[#FF7A00]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#A9A9A9] mb-1 font-medium">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-[#A9A9A9] mb-1 font-medium">Status</label>
              <select
                value={status}
                onChange={(e: any) => setStatus(e.target.value)}
                className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2 text-white"
              >
                <option value="Completed">Completed</option>
                <option value="Upcoming">Upcoming</option>
              </select>
            </div>
          </div>

          {status === 'Completed' && (
            <div className="grid grid-cols-4 gap-2 bg-[#111111] p-3 rounded-2xl border border-white/5">
              <div>
                <label className="block text-[#FF7A00] font-bold">VARC (50)</label>
                <input
                  type="number"
                  max={50}
                  value={varc}
                  onChange={(e) => setVarc(Number(e.target.value))}
                  className="w-full bg-[#0a0a0a] p-2 text-center rounded-xl text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-[#FFB547] font-bold">LRDI (75)</label>
                <input
                  type="number"
                  max={75}
                  value={lrdi}
                  onChange={(e) => setLrdi(Number(e.target.value))}
                  className="w-full bg-[#0a0a0a] p-2 text-center rounded-xl text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-[#F4B400] font-bold">AR (25)</label>
                <input
                  type="number"
                  max={25}
                  value={ar}
                  onChange={(e) => setAr(Number(e.target.value))}
                  className="w-full bg-[#0a0a0a] p-2 text-center rounded-xl text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-[#38E27A] font-bold">QUANT (50)</label>
                <input
                  type="number"
                  max={50}
                  value={quant}
                  onChange={(e) => setQuant(Number(e.target.value))}
                  className="w-full bg-[#0a0a0a] p-2 text-center rounded-xl text-white font-bold"
                />
              </div>
            </div>
          )}

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
            <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 text-[#A9A9A9]">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-[#FF7A00] text-black font-bold rounded-[14px]">Save Mock</button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      {selectedMock && (
        <Modal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          title="Edit Mock Test"
          subtitle={`Editing ${selectedMock.name}`}
        >
          <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#A9A9A9] mb-1 font-medium">Mock Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2.5 text-white"
              />
            </div>

            <div className="grid grid-cols-4 gap-2 bg-[#111111] p-3 rounded-2xl border border-white/5">
              <div>
                <label className="block text-[#FF7A00] font-bold">VARC</label>
                <input
                  type="number"
                  value={varc}
                  onChange={(e) => setVarc(Number(e.target.value))}
                  className="w-full bg-[#0a0a0a] p-2 text-center rounded-xl text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-[#FFB547] font-bold">LRDI</label>
                <input
                  type="number"
                  value={lrdi}
                  onChange={(e) => setLrdi(Number(e.target.value))}
                  className="w-full bg-[#0a0a0a] p-2 text-center rounded-xl text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-[#F4B400] font-bold">AR</label>
                <input
                  type="number"
                  value={ar}
                  onChange={(e) => setAr(Number(e.target.value))}
                  className="w-full bg-[#0a0a0a] p-2 text-center rounded-xl text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-[#38E27A] font-bold">QUANT</label>
                <input
                  type="number"
                  value={quant}
                  onChange={(e) => setQuant(Number(e.target.value))}
                  className="w-full bg-[#0a0a0a] p-2 text-center rounded-xl text-white font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-white/5">
              <button type="button" onClick={() => setIsEditOpen(false)} className="px-4 py-2 text-[#A9A9A9]">Cancel</button>
              <button type="submit" className="px-5 py-2 bg-[#FF7A00] text-black font-bold rounded-[14px]">Update Mock</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
