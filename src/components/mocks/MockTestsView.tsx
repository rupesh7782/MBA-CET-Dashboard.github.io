import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileSpreadsheet, Plus, Trophy, Clock, Target, Trash2, Edit3, CheckCircle2, TrendingUp, Sparkles, Percent } from 'lucide-react';
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
  
  // Sectional Scores & Attempts
  const [varcScore, setVarcScore] = useState<number>(38);
  const [varcAttempted, setVarcAttempted] = useState<number>(44);
  
  const [lrdiScore, setLrdiScore] = useState<number>(52);
  const [lrdiAttempted, setLrdiAttempted] = useState<number>(60);
  
  const [arScore, setArScore] = useState<number>(41);
  const [arAttempted, setArAttempted] = useState<number>(46);
  
  const [quantScore, setQuantScore] = useState<number>(39);
  const [quantAttempted, setQuantAttempted] = useState<number>(44);
  
  const [timeTaken, setTimeTaken] = useState<number>(150);
  const [status, setStatus] = useState<'Completed' | 'Upcoming' | 'Scheduled'>('Completed');
  const [remarks, setRemarks] = useState('');

  // Auto-calculated form values
  const currentTotalAttempted = varcAttempted + lrdiAttempted + arAttempted + quantAttempted;
  const currentTotalScore = varcScore + lrdiScore + arScore + quantScore;
  const currentAccuracy = currentTotalAttempted > 0 
    ? Number(((currentTotalScore / currentTotalAttempted) * 100).toFixed(1)) 
    : 0;
  const currentEstPercentile = Math.min(99.99, Math.max(10, Number(((currentTotalScore / 200) * 112).toFixed(1))));

  const openAddModal = () => {
    setName(`MBA CET Mock Test ${mockTests.length + 1}`);
    setDate(new Date().toISOString().split('T')[0]);
    setTime('09:00 AM');
    setVarcScore(38);
    setVarcAttempted(44);
    setLrdiScore(52);
    setLrdiAttempted(60);
    setArScore(40);
    setArAttempted(45);
    setQuantScore(36);
    setQuantAttempted(42);
    setTimeTaken(150);
    setStatus('Completed');
    setRemarks('');
    setIsAddOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isCompleted = status === 'Completed';
    const totalScore = isCompleted ? varcScore + lrdiScore + arScore + quantScore : 0;
    const totalAttempted = isCompleted ? varcAttempted + lrdiAttempted + arAttempted + quantAttempted : 0;
    const accuracy = isCompleted && totalAttempted > 0 ? Number(((totalScore / totalAttempted) * 100).toFixed(1)) : 0;
    const estPercentile = isCompleted ? Math.min(99.99, Math.max(10, Number(((totalScore / 200) * 112).toFixed(1)))) : 0;

    addMockTest({
      name,
      date,
      time,
      varcScore: isCompleted ? varcScore : 0,
      varcAttempted: isCompleted ? varcAttempted : 0,
      lrdiScore: isCompleted ? lrdiScore : 0,
      lrdiAttempted: isCompleted ? lrdiAttempted : 0,
      arScore: isCompleted ? arScore : 0,
      arAttempted: isCompleted ? arAttempted : 0,
      quantScore: isCompleted ? quantScore : 0,
      quantAttempted: isCompleted ? quantAttempted : 0,
      totalScore,
      totalAttempted,
      maxScore: 200,
      percentile: estPercentile,
      timeTakenMinutes: isCompleted ? timeTaken : 150,
      accuracy,
      remarks: remarks || (isCompleted ? 'Mock test completed' : 'Scheduled mock test'),
      status,
    });

    setIsAddOpen(false);
  };

  const openEditModal = (m: MockTest) => {
    setSelectedMock(m);
    setName(m.name);
    setDate(m.date);
    setTime(m.time || '09:00 AM');
    setVarcScore(m.varcScore ?? 0);
    setVarcAttempted(m.varcAttempted ?? m.varcScore ?? 0);
    setLrdiScore(m.lrdiScore ?? 0);
    setLrdiAttempted(m.lrdiAttempted ?? m.lrdiScore ?? 0);
    setArScore(m.arScore ?? 0);
    setArAttempted(m.arAttempted ?? m.arScore ?? 0);
    setQuantScore(m.quantScore ?? 0);
    setQuantAttempted(m.quantAttempted ?? m.quantScore ?? 0);
    setTimeTaken(m.timeTakenMinutes ?? 150);
    setStatus(m.status);
    setRemarks(m.remarks || '');
    setIsEditOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMock) return;

    const isCompleted = status === 'Completed';
    const totalScore = isCompleted ? varcScore + lrdiScore + arScore + quantScore : 0;
    const totalAttempted = isCompleted ? varcAttempted + lrdiAttempted + arAttempted + quantAttempted : 0;
    const accuracy = isCompleted && totalAttempted > 0 ? Number(((totalScore / totalAttempted) * 100).toFixed(1)) : 0;
    const estPercentile = isCompleted ? Math.min(99.99, Math.max(10, Number(((totalScore / 200) * 112).toFixed(1)))) : 0;

    updateMockTest(selectedMock.id, {
      name,
      date,
      time,
      varcScore: isCompleted ? varcScore : 0,
      varcAttempted: isCompleted ? varcAttempted : 0,
      lrdiScore: isCompleted ? lrdiScore : 0,
      lrdiAttempted: isCompleted ? lrdiAttempted : 0,
      arScore: isCompleted ? arScore : 0,
      arAttempted: isCompleted ? arAttempted : 0,
      quantScore: isCompleted ? quantScore : 0,
      quantAttempted: isCompleted ? quantAttempted : 0,
      totalScore,
      totalAttempted,
      percentile: estPercentile,
      timeTakenMinutes: isCompleted ? timeTaken : 150,
      accuracy,
      status,
      remarks,
    });

    setIsEditOpen(false);
  };

  // Completed mocks for summary metrics
  const completedMocks = mockTests.filter(m => m.status === 'Completed');
  const avgAttempted = completedMocks.length > 0
    ? Math.round(completedMocks.reduce((acc, m) => acc + (m.totalAttempted ?? m.totalScore ?? 0), 0) / completedMocks.length)
    : 0;
  const avgScore = completedMocks.length > 0
    ? (completedMocks.reduce((acc, m) => acc + m.totalScore, 0) / completedMocks.length).toFixed(1)
    : '0';
  const avgAccuracy = completedMocks.length > 0
    ? (completedMocks.reduce((acc, m) => acc + (m.accuracy || (m.totalAttempted ? (m.totalScore / m.totalAttempted) * 100 : 80)), 0) / completedMocks.length).toFixed(1)
    : '0';
  const bestScore = completedMocks.length > 0
    ? Math.max(...completedMocks.map(m => m.totalScore))
    : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-[22px] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-[#FF7A00]" />
            <span>Full Length Mock Tests Tracker</span>
          </h2>
          <p className="text-xs text-[#A9A9A9] mt-1">
            200 Questions • 150 Minutes • Track Questions Attempted, Total Score & Sectional Accuracy
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-gradient-to-r from-[#FF7A00] to-[#FF9E2C] text-black font-bold rounded-[14px] hover:brightness-110 text-xs flex items-center space-x-2 shadow-lg shadow-[#FF7A00]/20 active:scale-95 transition-all cursor-pointer"
          id="mock-add-btn"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Mock Test</span>
        </button>
      </div>

      {/* Summary KPI Cards: Attempted vs Score vs Accuracy */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#707070] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Completed Mocks</span>
            <Trophy className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-black text-white font-mono">{completedMocks.length}</span>
            <span className="text-xs text-gray-500 font-medium">/ {mockTests.length} tests</span>
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#707070] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Avg Attempted</span>
            <Target className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-black text-cyan-400 font-mono">{avgAttempted}</span>
            <span className="text-xs text-gray-500 font-mono">/ 200 Qs</span>
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#707070] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Avg Score</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-black text-emerald-400 font-mono">{avgScore}</span>
            <span className="text-xs text-gray-500 font-mono">/ 200 Marks</span>
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#707070] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Avg Accuracy</span>
            <Percent className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-black text-amber-400 font-mono">{avgAccuracy}%</span>
            <span className="text-[10px] text-gray-400 font-mono">(Best: {bestScore})</span>
          </div>
        </div>
      </div>

      {/* Mocks Table with Attempted & Score */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#111111] text-[#707070] border-b border-white/5 uppercase text-[10px] font-bold tracking-wider">
                <th className="py-2.5 px-3">Mock Name</th>
                <th className="py-2.5 px-2 text-center">Date</th>
                <th className="py-2.5 px-2 text-center text-[#FF7A00]/80">VARC <span className="text-[9px] font-normal text-gray-500">(50)</span></th>
                <th className="py-2.5 px-2 text-center text-[#FFB547]/80">LRDI <span className="text-[9px] font-normal text-gray-500">(75)</span></th>
                <th className="py-2.5 px-2 text-center text-[#F4B400]/80">AR <span className="text-[9px] font-normal text-gray-500">(25)</span></th>
                <th className="py-2.5 px-2 text-center text-[#38E27A]/80">QA <span className="text-[9px] font-normal text-gray-500">(50)</span></th>
                <th className="py-2.5 px-2 text-center text-cyan-400/80">Att.</th>
                <th className="py-2.5 px-2 text-center text-emerald-400/80">Score</th>
                <th className="py-2.5 px-2 text-center">Acc.</th>
                <th className="py-2.5 px-2 text-center text-[#FF7A00]">Percentile</th>
                <th className="py-2.5 px-2 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockTests.map(m => {
                const totalAtt = m.totalAttempted ?? (m.status === 'Completed' ? (m.varcAttempted ?? m.varcScore) + (m.lrdiAttempted ?? m.lrdiScore) + (m.arAttempted ?? m.arScore) + (m.quantAttempted ?? m.quantScore) : 0);
                const accuracy = m.accuracy || (totalAtt > 0 ? Number(((m.totalScore / totalAtt) * 100).toFixed(1)) : 0);

                return (
                  <tr key={m.id} className="hover:bg-[#141414]/70 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-white">
                      <div className="flex items-center space-x-2">
                        <FileSpreadsheet className="w-3.5 h-3.5 text-[#FF7A00] shrink-0" />
                        <span className="truncate max-w-[140px] sm:max-w-[180px] font-medium">{m.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-center text-[#A9A9A9] text-[11px] whitespace-nowrap font-mono">{m.date}</td>
                    
                    {/* VARC */}
                    <td className="py-2.5 px-2 text-center whitespace-nowrap">
                      {m.status === 'Completed' ? (
                        <div className="inline-flex items-baseline space-x-0.5 font-mono text-xs">
                          <span className="font-bold text-[#FF7A00]">{m.varcScore}</span>
                          <span className="text-[10px] text-gray-500">/{m.varcAttempted ?? m.varcScore}</span>
                        </div>
                      ) : <span className="text-gray-600">-</span>}
                    </td>

                    {/* LRDI */}
                    <td className="py-2.5 px-2 text-center whitespace-nowrap">
                      {m.status === 'Completed' ? (
                        <div className="inline-flex items-baseline space-x-0.5 font-mono text-xs">
                          <span className="font-bold text-[#FFB547]">{m.lrdiScore}</span>
                          <span className="text-[10px] text-gray-500">/{m.lrdiAttempted ?? m.lrdiScore}</span>
                        </div>
                      ) : <span className="text-gray-600">-</span>}
                    </td>

                    {/* AR */}
                    <td className="py-2.5 px-2 text-center whitespace-nowrap">
                      {m.status === 'Completed' ? (
                        <div className="inline-flex items-baseline space-x-0.5 font-mono text-xs">
                          <span className="font-bold text-[#F4B400]">{m.arScore}</span>
                          <span className="text-[10px] text-gray-500">/{m.arAttempted ?? m.arScore}</span>
                        </div>
                      ) : <span className="text-gray-600">-</span>}
                    </td>

                    {/* QUANT */}
                    <td className="py-2.5 px-2 text-center whitespace-nowrap">
                      {m.status === 'Completed' ? (
                        <div className="inline-flex items-baseline space-x-0.5 font-mono text-xs">
                          <span className="font-bold text-[#38E27A]">{m.quantScore}</span>
                          <span className="text-[10px] text-gray-500">/{m.quantAttempted ?? m.quantScore}</span>
                        </div>
                      ) : <span className="text-gray-600">-</span>}
                    </td>

                    {/* Total Attempted */}
                    <td className="py-2.5 px-2 text-center whitespace-nowrap">
                      {m.status === 'Completed' ? (
                        <span className="font-bold text-cyan-400 font-mono text-xs">{totalAtt}</span>
                      ) : <span className="text-gray-600">-</span>}
                    </td>

                    {/* Total Score */}
                    <td className="py-2.5 px-2 text-center whitespace-nowrap">
                      {m.status === 'Completed' ? (
                        <span className="font-black text-emerald-400 font-mono text-xs">{m.totalScore}</span>
                      ) : <span className="text-gray-600">-</span>}
                    </td>

                    {/* Accuracy */}
                    <td className="py-2.5 px-2 text-center whitespace-nowrap font-mono">
                      {m.status === 'Completed' ? (
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          accuracy >= 85 ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' :
                          accuracy >= 75 ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' :
                          'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                        }`}>
                          {accuracy}%
                        </span>
                      ) : <span className="text-gray-600">-</span>}
                    </td>

                    {/* Percentile */}
                    <td className="py-2.5 px-2 text-center whitespace-nowrap font-black font-mono text-[#FF7A00] text-xs">
                      {m.status === 'Completed' ? `${m.percentile}%` : <span className="text-gray-600 font-normal">-</span>}
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-2 text-center whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                        m.status === 'Completed' ? 'bg-[#38E27A]/15 text-[#38E27A] border border-[#38E27A]/30' : 'bg-[#FF7A00]/15 text-[#FF7A00] border border-[#FF7A00]/30'
                      }`}>
                        {m.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => openEditModal(m)}
                          className="p-1 text-[#707070] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                          title="Edit Mock Test"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteMockTest(m.id)}
                          className="p-1 text-[#707070] hover:text-[#FF5A5A] rounded-lg hover:bg-white/5 transition-colors"
                          title="Delete Mock Test"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Mock Test"
        subtitle="Record your full length mock attempts and marks"
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
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] text-gray-400 font-semibold px-1">
                <span>Sectional Performance (Attempted vs Score)</span>
                <span className="text-[#FF7A00]">Max: 200 Qs</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-[#111111] p-3.5 rounded-2xl border border-white/5">
                {/* VARC */}
                <div className="space-y-1.5 p-2 rounded-xl bg-black/40 border border-white/5">
                  <span className="block text-[#FF7A00] font-bold text-[11px]">VARC (Max 50)</span>
                  <div>
                    <label className="block text-gray-400 text-[10px]">Attempted</label>
                    <input
                      type="number"
                      min={0}
                      max={50}
                      value={varcAttempted}
                      onChange={(e) => setVarcAttempted(Math.min(50, Math.max(0, Number(e.target.value))))}
                      className="w-full bg-[#0a0a0a] p-1.5 text-center rounded-lg text-cyan-400 font-mono font-bold text-xs border border-white/5"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-[10px]">Score / Marks</label>
                    <input
                      type="number"
                      min={0}
                      max={varcAttempted || 50}
                      value={varcScore}
                      onChange={(e) => setVarcScore(Math.min(50, Math.max(0, Number(e.target.value))))}
                      className="w-full bg-[#0a0a0a] p-1.5 text-center rounded-lg text-white font-mono font-bold text-xs border border-white/5"
                    />
                  </div>
                </div>

                {/* LRDI */}
                <div className="space-y-1.5 p-2 rounded-xl bg-black/40 border border-white/5">
                  <span className="block text-[#FFB547] font-bold text-[11px]">LRDI (Max 75)</span>
                  <div>
                    <label className="block text-gray-400 text-[10px]">Attempted</label>
                    <input
                      type="number"
                      min={0}
                      max={75}
                      value={lrdiAttempted}
                      onChange={(e) => setLrdiAttempted(Math.min(75, Math.max(0, Number(e.target.value))))}
                      className="w-full bg-[#0a0a0a] p-1.5 text-center rounded-lg text-cyan-400 font-mono font-bold text-xs border border-white/5"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-[10px]">Score / Marks</label>
                    <input
                      type="number"
                      min={0}
                      max={lrdiAttempted || 75}
                      value={lrdiScore}
                      onChange={(e) => setLrdiScore(Math.min(75, Math.max(0, Number(e.target.value))))}
                      className="w-full bg-[#0a0a0a] p-1.5 text-center rounded-lg text-white font-mono font-bold text-xs border border-white/5"
                    />
                  </div>
                </div>

                {/* AR */}
                <div className="space-y-1.5 p-2 rounded-xl bg-black/40 border border-white/5">
                  <span className="block text-[#F4B400] font-bold text-[11px]">AR (Max 25)</span>
                  <div>
                    <label className="block text-gray-400 text-[10px]">Attempted</label>
                    <input
                      type="number"
                      min={0}
                      max={25}
                      value={arAttempted}
                      onChange={(e) => setArAttempted(Math.min(25, Math.max(0, Number(e.target.value))))}
                      className="w-full bg-[#0a0a0a] p-1.5 text-center rounded-lg text-cyan-400 font-mono font-bold text-xs border border-white/5"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-[10px]">Score / Marks</label>
                    <input
                      type="number"
                      min={0}
                      max={arAttempted || 25}
                      value={arScore}
                      onChange={(e) => setArScore(Math.min(25, Math.max(0, Number(e.target.value))))}
                      className="w-full bg-[#0a0a0a] p-1.5 text-center rounded-lg text-white font-mono font-bold text-xs border border-white/5"
                    />
                  </div>
                </div>

                {/* QUANT */}
                <div className="space-y-1.5 p-2 rounded-xl bg-black/40 border border-white/5">
                  <span className="block text-[#38E27A] font-bold text-[11px]">QUANT (Max 50)</span>
                  <div>
                    <label className="block text-gray-400 text-[10px]">Attempted</label>
                    <input
                      type="number"
                      min={0}
                      max={50}
                      value={quantAttempted}
                      onChange={(e) => setQuantAttempted(Math.min(50, Math.max(0, Number(e.target.value))))}
                      className="w-full bg-[#0a0a0a] p-1.5 text-center rounded-lg text-cyan-400 font-mono font-bold text-xs border border-white/5"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-[10px]">Score / Marks</label>
                    <input
                      type="number"
                      min={0}
                      max={quantAttempted || 50}
                      value={quantScore}
                      onChange={(e) => setQuantScore(Math.min(50, Math.max(0, Number(e.target.value))))}
                      className="w-full bg-[#0a0a0a] p-1.5 text-center rounded-lg text-white font-mono font-bold text-xs border border-white/5"
                    />
                  </div>
                </div>
              </div>

              {/* Real-time Summary Card inside modal */}
              <div className="p-3 bg-[#0a0a0a] border border-cyan-500/20 rounded-xl grid grid-cols-4 gap-2 text-center">
                <div>
                  <span className="text-[10px] text-gray-400 block font-medium">Attempted</span>
                  <span className="text-sm font-bold text-cyan-400 font-mono">{currentTotalAttempted}/200</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block font-medium">Total Score</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">{currentTotalScore}/200</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block font-medium">Accuracy</span>
                  <span className="text-sm font-bold text-amber-400 font-mono">{currentAccuracy}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block font-medium">Est. %ile</span>
                  <span className="text-sm font-bold text-[#FF7A00] font-mono">{currentEstPercentile}%</span>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-[#A9A9A9] mb-1 font-medium">Remarks / Key Learnings</label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Strong in puzzles, missed 15 quant questions due to time..."
              className="w-full bg-[#111111] border border-white/10 rounded-[16px] p-3 text-white focus:outline-none focus:border-[#FF7A00]"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-white/5">
            <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 text-[#A9A9A9] hover:text-white">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-[#FF7A00] text-black font-bold rounded-[14px] hover:bg-[#FFB547] transition-all">Save Mock</button>
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
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] text-gray-400 font-semibold px-1">
                  <span>Sectional Performance (Attempted vs Score)</span>
                  <span className="text-[#FF7A00]">Max: 200 Qs</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-[#111111] p-3.5 rounded-2xl border border-white/5">
                  {/* VARC */}
                  <div className="space-y-1.5 p-2 rounded-xl bg-black/40 border border-white/5">
                    <span className="block text-[#FF7A00] font-bold text-[11px]">VARC (Max 50)</span>
                    <div>
                      <label className="block text-gray-400 text-[10px]">Attempted</label>
                      <input
                        type="number"
                        min={0}
                        max={50}
                        value={varcAttempted}
                        onChange={(e) => setVarcAttempted(Math.min(50, Math.max(0, Number(e.target.value))))}
                        className="w-full bg-[#0a0a0a] p-1.5 text-center rounded-lg text-cyan-400 font-mono font-bold text-xs border border-white/5"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-[10px]">Score / Marks</label>
                      <input
                        type="number"
                        min={0}
                        max={varcAttempted || 50}
                        value={varcScore}
                        onChange={(e) => setVarcScore(Math.min(50, Math.max(0, Number(e.target.value))))}
                        className="w-full bg-[#0a0a0a] p-1.5 text-center rounded-lg text-white font-mono font-bold text-xs border border-white/5"
                      />
                    </div>
                  </div>

                  {/* LRDI */}
                  <div className="space-y-1.5 p-2 rounded-xl bg-black/40 border border-white/5">
                    <span className="block text-[#FFB547] font-bold text-[11px]">LRDI (Max 75)</span>
                    <div>
                      <label className="block text-gray-400 text-[10px]">Attempted</label>
                      <input
                        type="number"
                        min={0}
                        max={75}
                        value={lrdiAttempted}
                        onChange={(e) => setLrdiAttempted(Math.min(75, Math.max(0, Number(e.target.value))))}
                        className="w-full bg-[#0a0a0a] p-1.5 text-center rounded-lg text-cyan-400 font-mono font-bold text-xs border border-white/5"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-[10px]">Score / Marks</label>
                      <input
                        type="number"
                        min={0}
                        max={lrdiAttempted || 75}
                        value={lrdiScore}
                        onChange={(e) => setLrdiScore(Math.min(75, Math.max(0, Number(e.target.value))))}
                        className="w-full bg-[#0a0a0a] p-1.5 text-center rounded-lg text-white font-mono font-bold text-xs border border-white/5"
                      />
                    </div>
                  </div>

                  {/* AR */}
                  <div className="space-y-1.5 p-2 rounded-xl bg-black/40 border border-white/5">
                    <span className="block text-[#F4B400] font-bold text-[11px]">AR (Max 25)</span>
                    <div>
                      <label className="block text-gray-400 text-[10px]">Attempted</label>
                      <input
                        type="number"
                        min={0}
                        max={25}
                        value={arAttempted}
                        onChange={(e) => setArAttempted(Math.min(25, Math.max(0, Number(e.target.value))))}
                        className="w-full bg-[#0a0a0a] p-1.5 text-center rounded-lg text-cyan-400 font-mono font-bold text-xs border border-white/5"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-[10px]">Score / Marks</label>
                      <input
                        type="number"
                        min={0}
                        max={arAttempted || 25}
                        value={arScore}
                        onChange={(e) => setArScore(Math.min(25, Math.max(0, Number(e.target.value))))}
                        className="w-full bg-[#0a0a0a] p-1.5 text-center rounded-lg text-white font-mono font-bold text-xs border border-white/5"
                      />
                    </div>
                  </div>

                  {/* QUANT */}
                  <div className="space-y-1.5 p-2 rounded-xl bg-black/40 border border-white/5">
                    <span className="block text-[#38E27A] font-bold text-[11px]">QUANT (Max 50)</span>
                    <div>
                      <label className="block text-gray-400 text-[10px]">Attempted</label>
                      <input
                        type="number"
                        min={0}
                        max={50}
                        value={quantAttempted}
                        onChange={(e) => setQuantAttempted(Math.min(50, Math.max(0, Number(e.target.value))))}
                        className="w-full bg-[#0a0a0a] p-1.5 text-center rounded-lg text-cyan-400 font-mono font-bold text-xs border border-white/5"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-[10px]">Score / Marks</label>
                      <input
                        type="number"
                        min={0}
                        max={quantAttempted || 50}
                        value={quantScore}
                        onChange={(e) => setQuantScore(Math.min(50, Math.max(0, Number(e.target.value))))}
                        className="w-full bg-[#0a0a0a] p-1.5 text-center rounded-lg text-white font-mono font-bold text-xs border border-white/5"
                      />
                    </div>
                  </div>
                </div>

                {/* Real-time Summary Card inside modal */}
                <div className="p-3 bg-[#0a0a0a] border border-cyan-500/20 rounded-xl grid grid-cols-4 gap-2 text-center">
                  <div>
                    <span className="text-[10px] text-gray-400 block font-medium">Attempted</span>
                    <span className="text-sm font-bold text-cyan-400 font-mono">{currentTotalAttempted}/200</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block font-medium">Total Score</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono">{currentTotalScore}/200</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block font-medium">Accuracy</span>
                    <span className="text-sm font-bold text-amber-400 font-mono">{currentAccuracy}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block font-medium">Est. %ile</span>
                    <span className="text-sm font-bold text-[#FF7A00] font-mono">{currentEstPercentile}%</span>
                  </div>
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
              <button type="button" onClick={() => setIsEditOpen(false)} className="px-4 py-2 text-[#A9A9A9] hover:text-white">Cancel</button>
              <button type="submit" className="px-5 py-2 bg-[#FF7A00] text-black font-bold rounded-[14px] hover:bg-[#FFB547]">Update Mock</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

