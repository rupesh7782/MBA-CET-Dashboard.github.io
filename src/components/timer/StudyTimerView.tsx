import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Play, Pause, RotateCcw, Flame, Sparkles, CheckCircle2, Calendar } from 'lucide-react';
import { Subject } from '../../types';

export const StudyTimerView: React.FC = () => {
  const { addTimerSession, timerSessions, habits, currentStreak } = useApp();

  const [mode, setMode] = useState<'Pomodoro' | 'Short Break' | 'Long Break' | 'Focus'>('Pomodoro');
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'General'>('QUANT');
  
  // Timer settings in seconds
  const modeDurations = {
    'Pomodoro': 25 * 60,
    'Short Break': 5 * 60,
    'Long Break': 15 * 60,
    'Focus': 50 * 60,
  };

  const [timeLeft, setTimeLeft] = useState<number>(modeDurations['Pomodoro']);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isFocusModeActive, setIsFocusModeActive] = useState<boolean>(false);

  useEffect(() => {
    setTimeLeft(modeDurations[mode]);
    setIsActive(false);
  }, [mode]);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      const durationMins = Math.round(modeDurations[mode] / 60);
      addTimerSession({
        durationMinutes: durationMins,
        mode: mode,
        subject: selectedSubject,
      });
      // Play alert chime
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      } catch (e) {
        console.log('Audio chime played');
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, selectedSubject, addTimerSession]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(modeDurations[mode]);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Compute daily & weekly totals
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySessions = timerSessions.filter(s => s.timestamp.startsWith(todayStr));
  const todayMinutes = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  // Calendar Heatmap generation for current month
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay(); 
  
  const heatmapDays: Array<{date: string, dayNum: number, minutes: number} | null> = [];
  for (let i = 0; i < firstDay; i++) {
    heatmapDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i);
    const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const totalMinForDay = timerSessions
      .filter(s => s.timestamp.startsWith(ds))
      .reduce((acc, s) => acc + s.durationMinutes, 0);
    heatmapDays.push({ date: ds, dayNum: i, minutes: totalMinForDay });
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Timer Card */}
      <div className={`relative bg-[#0a0a0a] border border-white/5 rounded-[22px] p-8 text-center shadow-2xl transition-all duration-300 ${
        isFocusModeActive ? 'fixed inset-0 z-50 rounded-none bg-[#090909] flex flex-col items-center justify-center' : ''
      }`}>
        {/* Top Focus Mode & Subject Pills */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-2 bg-[#111111] p-1.5 rounded-full border border-white/5">
            {(['Pomodoro', 'Short Break', 'Long Break', 'Focus'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  mode === m 
                    ? 'bg-[#FF7A00] text-black shadow-lg shadow-[#FF7A00]/20' 
                    : 'text-[#A9A9A9] hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={selectedSubject}
              onChange={(e: any) => setSelectedSubject(e.target.value)}
              className="bg-[#111111] text-xs text-white border border-white/10 rounded-xl px-3 py-1.5 focus:outline-none"
            >
              <option value="QUANT">Quant</option>
              <option value="LRDI">LRDI</option>
              <option value="VARC">VARC</option>
              <option value="AR">Abstract Reasoning</option>
              <option value="General">General Study</option>
            </select>

            <button
              onClick={() => setIsFocusModeActive(!isFocusModeActive)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 border transition-colors ${
                isFocusModeActive 
                  ? 'bg-[#FF5A5A]/20 border-[#FF5A5A] text-[#FF5A5A]' 
                  : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isFocusModeActive ? 'Exit Focus' : 'Focus Mode'}</span>
            </button>
          </div>
        </div>

        {/* Large Timer Display */}
        <div className="my-8">
          <div className="text-7xl sm:text-8xl font-black text-white tracking-widest font-mono">
            {formatTime(timeLeft)}
          </div>
          <p className="text-xs text-[#A9A9A9] mt-3 uppercase tracking-wider font-semibold">
            {mode} • {selectedSubject} Session
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4 mt-6">
          <button
            onClick={toggleTimer}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl transition-all transform hover:scale-105 active:scale-95 ${
              isActive 
                ? 'bg-[#FF5A5A] text-white shadow-[#FF5A5A]/30' 
                : 'bg-[#FF7A00] text-black shadow-[#FF7A00]/30'
            }`}
            id="timer-start-btn"
          >
            {isActive ? <Pause className="w-7 h-7 fill-white" /> : <Play className="w-7 h-7 fill-black ml-1" />}
          </button>

          <button
            onClick={resetTimer}
            className="w-12 h-12 bg-[#141414] hover:bg-white/10 border border-white/10 text-[#A9A9A9] hover:text-white rounded-2xl flex items-center justify-center transition-colors"
            title="Reset timer"
            id="timer-reset-btn"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Grid: Study Stats & Session Logs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily & Weekly Totals */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[22px] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white tracking-tight">Focus Summary</h3>
            <span className="text-xs text-[#FF7A00] bg-[#FF7A00]/10 px-2.5 py-0.5 rounded-full font-semibold">
              Today: {Math.floor(todayMinutes / 60)}h {todayMinutes % 60}m
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-[#141414]/70 rounded-[18px] border border-white/5">
              <p className="text-xs text-[#A9A9A9]">Completed Sessions</p>
              <p className="text-2xl font-bold text-white mt-1">{todaySessions.length}</p>
              <p className="text-[10px] text-[#38E27A] mt-1 font-medium">Goal: 8 sessions</p>
            </div>

            <div className="p-4 bg-[#141414]/70 rounded-[18px] border border-white/5">
              <p className="text-xs text-[#A9A9A9]">Current Streak</p>
              <p className="text-2xl font-bold text-[#FF7A00] mt-1 flex items-center space-x-1">
                <span>{currentStreak}d</span>
                <Flame className="w-5 h-5 fill-[#FF7A00]" />
              </p>
              <p className="text-[10px] text-[#A9A9A9] mt-1 font-medium">Best: 24 days</p>
            </div>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[22px] p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-[#FF7A00]" />
              <span>This Month's Study Heatmap</span>
            </h3>
            <span className="text-[11px] text-[#A9A9A9]">Less → More</span>
          </div>
          
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-2 pt-2 mb-2 text-center text-[10px] text-[#707085] font-medium">
            <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {heatmapDays.map((hd, idx) => {
              if (!hd) {
                return <div key={`empty-${idx}`} className="h-8 rounded-lg" />;
              }
              const intensity = hd.minutes === 0 
                ? 'bg-[#141414]' 
                : hd.minutes < 60 
                ? 'bg-[#FF7A00]/30 border border-[#FF7A00]/40' 
                : hd.minutes < 180 
                ? 'bg-[#FF7A00]/60 border border-[#FF7A00]/70' 
                : 'bg-[#FF7A00] text-black font-bold';

              return (
                <div
                  key={hd.date}
                  className={`h-8 rounded-lg flex flex-col items-center justify-center text-[10px] transition-transform hover:scale-110 cursor-pointer ${intensity}`}
                  title={`${hd.date}: ${hd.minutes} minutes studied`}
                >
                  <span className={hd.minutes >= 180 ? 'text-black' : 'text-[#A9A9A9]'}>{hd.dayNum}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
