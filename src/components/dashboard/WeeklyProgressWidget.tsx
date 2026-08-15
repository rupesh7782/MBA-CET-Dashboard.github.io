import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  TrendingUp, Calendar, CheckCircle2, Clock, 
  BookOpen, Target, FileText, Trophy, Pencil, 
  Flame, Star, Edit2, X, Plus, Sparkles, Trash2, RotateCcw 
} from 'lucide-react';
import toast from 'react-hot-toast';

export const WeeklyProgressWidget: React.FC = () => {
  const { dailyLogs, updateDailyLogDate, deleteDailyLogDate, currentStreak, mockTests } = useApp();

  // State for editing a specific day's metrics modal
  const [editingDayDate, setEditingDayDate] = useState<string | null>(null);
  const [editingDayName, setEditingDayName] = useState<string>('');
  const [editHoursInput, setEditHoursInput] = useState<string>('');
  const [editQuestionsInput, setEditQuestionsInput] = useState<string>('');
  const [editAccuracyInput, setEditAccuracyInput] = useState<string>('');
  const [editMocksInput, setEditMocksInput] = useState<string>('');

  // Local storage override map for custom mock test counts per date
  const [customMockCounts, setCustomMockCounts] = useState<Record<string, number>>(() => {
    try {
      const stored = localStorage.getItem('mba_cet_weekly_mock_counts');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Helper to format local date as YYYY-MM-DD
  const formatLocalDate = (d: Date = new Date()): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get current week's Monday to Sunday dates mathematically cleanly
  const getCurrentWeekDays = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 is Sun, 1 is Mon, ..., 6 is Sat
    const distanceToMonday = (dayOfWeek + 6) % 7; // Mon=0, Tue=1, ..., Sun=6

    const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - distanceToMonday);
    monday.setHours(0, 0, 0, 0);

    const weekDays = [];
    const dayLabels = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    const fullDayNames: Record<string, string> = {
      MON: 'MONDAY',
      TUE: 'TUESDAY',
      WED: 'WEDNESDAY',
      THU: 'THURSDAY',
      FRI: 'FRIDAY',
      SAT: 'SATURDAY',
      SUN: 'SUNDAY',
    };

    const todayStr = formatLocalDate(now);

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
      const dateStr = formatLocalDate(d);
      
      const dayName = dayLabels[i];
      const monthShort = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
      const dateNum = String(d.getDate()).padStart(2, '0');
      const formattedDateLabel = `${dateNum} ${monthShort}`;

      weekDays.push({
        dateObj: d,
        dateStr,
        dayName,
        dayNameFull: fullDayNames[dayName] || dayName,
        dateLabel: formattedDateLabel,
        isWeekend: i >= 5,
        isToday: dateStr === todayStr
      });
    }
    return { monday, weekDays };
  };

  const { monday, weekDays } = getCurrentWeekDays();

  // Week number of the year calculation
  const getWeekNumber = (d: Date) => {
    const target = new Date(d.valueOf());
    const dayNr = (d.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
    }
    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  };

  const weekNum = getWeekNumber(monday);
  
  const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6);
  
  const formatDateRange = () => {
    const startNum = String(monday.getDate()).padStart(2, '0');
    const startMonth = monday.toLocaleString('en-US', { month: 'short' });
    const endNum = String(sunday.getDate()).padStart(2, '0');
    const endMonth = sunday.toLocaleString('en-US', { month: 'short' });
    const year = monday.getFullYear();
    return `${startNum} ${startMonth} – ${endNum} ${endMonth} ${year}`;
  };

  // Process days with real-time data from App Context
  const processedDays = weekDays.map((day) => {
    const log = dailyLogs.find(l => l.date === day.dateStr);
    
    // Count mock tests on this date from context + custom overrides
    const actualMocksCount = mockTests.filter(m => m.date === day.dateStr).length;
    const customCount = customMockCounts[day.dateStr];

    const hours = log ? log.hoursStudied : 0;
    const questions = log ? log.questionsSolved : 0;
    const accuracy = log ? log.accuracy : 0;
    const mocks = customCount !== undefined ? customCount : actualMocksCount;

    const isStudied = hours > 0 || questions > 0;

    // Helper format hours to "6h 45m"
    const formatHoursMinutes = (hVal: number) => {
      if (!hVal || hVal <= 0) return '0h 00m';
      const hrs = Math.floor(hVal);
      const mins = Math.round((hVal - hrs) * 60);
      if (mins === 0) return `${hrs}h 00m`;
      return `${hrs}h ${String(mins).padStart(2, '0')}m`;
    };

    return {
      ...day,
      hours,
      formattedHours: formatHoursMinutes(hours),
      questions,
      accuracy,
      mocks,
      isStudied
    };
  });

  // Calculate Aggregates dynamically
  const totalHoursVal = processedDays.reduce((acc, d) => acc + d.hours, 0);
  const totalQuestionsVal = processedDays.reduce((acc, d) => acc + d.questions, 0);
  const studiedDaysList = processedDays.filter(d => d.isStudied);
  const avgAccuracyVal = studiedDaysList.length > 0 
    ? (studiedDaysList.reduce((acc, d) => acc + d.accuracy, 0) / studiedDaysList.length).toFixed(1)
    : '0.0';

  const formatTotalHours = (hVal: number) => {
    if (!hVal || hVal <= 0) return '0h 00m';
    const hrs = Math.floor(hVal);
    const mins = Math.round((hVal - hrs) * 60);
    return `${hrs}h ${String(mins).padStart(2, '0')}m`;
  };

  // Find Best Day (day with highest performance score among studied days)
  const bestDayObj = studiedDaysList.length > 0
    ? [...studiedDaysList].sort((a, b) => (b.questions * b.accuracy + b.hours * 100) - (a.questions * a.accuracy + a.hours * 100))[0]
    : null;

  const handleOpenEditModal = (day: typeof processedDays[0]) => {
    setEditingDayDate(day.dateStr);
    setEditingDayName(`${day.dayNameFull} (${day.dateLabel})`);
    setEditHoursInput(day.hours > 0 ? String(day.hours) : '0');
    setEditQuestionsInput(day.questions > 0 ? String(day.questions) : '0');
    setEditAccuracyInput(day.accuracy > 0 ? String(day.accuracy) : '0');
    setEditMocksInput(String(day.mocks));
  };

  const handleSaveDayLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDayDate) return;

    const hrs = Math.max(0, parseFloat(editHoursInput) || 0);
    const qs = Math.max(0, parseInt(editQuestionsInput, 10) || 0);
    const acc = Math.min(100, Math.max(0, parseFloat(editAccuracyInput) || 0));
    const mocks = Math.max(0, parseInt(editMocksInput, 10) || 0);

    // If all are zero, delete log cleanly
    if (hrs === 0 && qs === 0 && acc === 0) {
      deleteDailyLogDate(editingDayDate);
    } else {
      updateDailyLogDate(editingDayDate, hrs, qs, acc);
    }

    // Save mock count override
    const updatedMocks = { ...customMockCounts, [editingDayDate]: mocks };
    setCustomMockCounts(updatedMocks);
    try {
      localStorage.setItem('mba_cet_weekly_mock_counts', JSON.stringify(updatedMocks));
    } catch {}

    toast.success(`Saved metrics for ${editingDayName}! ✨`);
    setEditingDayDate(null);
  };

  const handleDeleteDayLog = (dateStr: string) => {
    deleteDailyLogDate(dateStr);
    
    // Clear mock override
    const updatedMocks = { ...customMockCounts };
    delete updatedMocks[dateStr];
    setCustomMockCounts(updatedMocks);
    try {
      localStorage.setItem('mba_cet_weekly_mock_counts', JSON.stringify(updatedMocks));
    } catch {}

    toast.success(`Deleted progress data for ${editingDayName || dateStr}`);
    setEditingDayDate(null);
  };

  const handleQuickAdd = (type: 'hours' | 'questions' | 'accuracy', amount: number) => {
    if (type === 'hours') {
      const current = parseFloat(editHoursInput) || 0;
      setEditHoursInput((current + amount).toFixed(2));
    } else if (type === 'questions') {
      const current = parseInt(editQuestionsInput, 10) || 0;
      setEditQuestionsInput(String(current + amount));
    } else if (type === 'accuracy') {
      setEditAccuracyInput(String(amount));
    }
  };

  return (
    <div className="w-full bg-[#060608] border border-amber-500/20 rounded-3xl p-4 sm:p-5 text-white shadow-2xl relative overflow-hidden mt-6">
      
      {/* Background Accent Glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        
        {/* Left Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
            <TrendingUp className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-white uppercase flex items-center gap-1.5">
              <span>WEEKLY</span>
              <span className="text-amber-400">PROGRESS</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-400 font-medium mt-0.5">
              Consistency today, <span className="text-amber-400 font-bold">success</span> tomorrow.
            </p>
          </div>
        </div>

        {/* Right Week Badge */}
        <div className="flex items-center space-x-2">
          <div className="bg-[#0f0f13] border border-amber-500/30 rounded-xl px-3 py-1.5 flex items-center space-x-2.5 shadow-lg">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <div className="text-[11px] font-black tracking-wider text-amber-400 uppercase">
                WEEK {weekNum}
              </div>
              <div className="text-[10px] text-amber-200/90 font-medium">
                {formatDateRange()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WEEKLY MATRIX TABLE CONTAINER - Responsive Fit, Zero Unnecessary Scroll */}
      <div className="mt-4 overflow-hidden">
        <div className="w-full bg-[#030304] border border-[#1d1d24] rounded-2xl overflow-hidden shadow-inner">
          
          {/* DAY HEADERS ROW */}
          <div className="grid grid-cols-[130px_repeat(7,1fr)] border-b border-[#1d1d24] bg-[#0a0a0d]">
            <div className="p-2 text-[10px] font-bold text-gray-500 uppercase flex items-center justify-center border-r border-[#1d1d24]">
              {/* Top left blank header cell */}
            </div>
            {processedDays.map((d) => (
              <div 
                key={d.dayName} 
                className={`py-2 px-1 text-center border-r border-[#1d1d24] last:border-r-0 relative group transition-colors ${
                  d.isToday ? 'bg-amber-500/15 border-amber-500/40' : d.isWeekend ? 'bg-amber-500/5' : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-center space-x-0.5">
                  <button 
                    onClick={() => handleOpenEditModal(d)}
                    className="text-[11px] font-black tracking-wider block transition-colors"
                  >
                    <span className={d.isWeekend ? 'text-amber-400' : d.isToday ? 'text-amber-300' : 'text-gray-200'}>
                      {d.dayName}
                    </span>
                  </button>
                  <button 
                    onClick={() => handleOpenEditModal(d)}
                    title="Edit metrics" 
                    className="p-0.5 text-gray-400 hover:text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Pencil className="w-2.5 h-2.5" />
                  </button>
                  {(d.isStudied || d.mocks > 0) && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDayLog(d.dateStr);
                      }}
                      title={`Delete data for ${d.dayName}`} 
                      className="p-0.5 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
                <span className={`text-[9px] font-bold block mt-0.5 ${
                  d.isWeekend ? 'text-amber-400' : d.isToday ? 'text-amber-300' : 'text-gray-400'
                }`}>
                  {d.dateLabel}
                </span>
              </div>
            ))}
          </div>

          {/* ROW 1: STUDY DAYS */}
          <div className="grid grid-cols-[130px_repeat(7,1fr)] border-b border-[#1d1d24] items-center">
            <div className="p-2.5 flex items-center space-x-2 border-r border-[#1d1d24] bg-[#070709]">
              <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span className="text-[10px] font-extrabold text-gray-300 uppercase tracking-wider whitespace-nowrap truncate">
                STUDY DAYS
              </span>
            </div>
            {processedDays.map((d) => (
              <button 
                key={d.dayName} 
                onClick={() => handleOpenEditModal(d)}
                className="p-2 flex items-center justify-center border-r border-[#1d1d24] last:border-r-0 hover:bg-white/5 transition-colors group"
              >
                {d.isStudied ? (
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border shadow-lg transition-transform group-hover:scale-110 ${
                    d.isWeekend 
                      ? 'bg-amber-500/20 border-amber-400 text-amber-400 shadow-amber-500/30' 
                      : 'bg-emerald-500/20 border-emerald-400 text-emerald-400 shadow-emerald-500/30'
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                ) : (
                  <span className="text-gray-600 font-bold text-[10px] group-hover:text-amber-400 transition-colors">+ Add</span>
                )}
              </button>
            ))}
          </div>

          {/* ROW 2: STUDY HOURS */}
          <div className="grid grid-cols-[130px_repeat(7,1fr)] border-b border-[#1d1d24] items-center">
            <div className="p-2.5 flex items-center space-x-2 border-r border-[#1d1d24] bg-[#070709]">
              <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span className="text-[10px] font-extrabold text-gray-300 uppercase tracking-wider whitespace-nowrap truncate">
                STUDY HOURS
              </span>
            </div>
            {processedDays.map((d) => (
              <button 
                key={d.dayName} 
                onClick={() => handleOpenEditModal(d)}
                className="p-2 text-center border-r border-[#1d1d24] last:border-r-0 hover:bg-white/5 transition-colors group"
              >
                <span className={`text-[11px] font-bold font-mono tracking-tight group-hover:underline ${
                  d.hours > 0 ? (d.isWeekend ? 'text-amber-400' : 'text-emerald-400') : 'text-gray-600'
                }`}>
                  {d.formattedHours}
                </span>
              </button>
            ))}
          </div>

          {/* ROW 3: QUESTIONS SOLVED */}
          <div className="grid grid-cols-[130px_repeat(7,1fr)] border-b border-[#1d1d24] items-center">
            <div className="p-2.5 flex items-center space-x-2 border-r border-[#1d1d24] bg-[#070709]">
              <BookOpen className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span className="text-[10px] font-extrabold text-gray-300 uppercase tracking-wider whitespace-nowrap truncate">
                QUESTIONS
              </span>
            </div>
            {processedDays.map((d) => (
              <button 
                key={d.dayName} 
                onClick={() => handleOpenEditModal(d)}
                className="p-2 text-center border-r border-[#1d1d24] last:border-r-0 hover:bg-white/5 transition-colors group"
              >
                <span className={`text-xs font-bold font-mono tracking-tight group-hover:underline ${
                  d.questions > 0 ? (d.isWeekend ? 'text-amber-400' : 'text-emerald-400') : 'text-gray-600'
                }`}>
                  {d.questions}
                </span>
              </button>
            ))}
          </div>

          {/* ROW 4: ACCURACY */}
          <div className="grid grid-cols-[130px_repeat(7,1fr)] border-b border-[#1d1d24] items-center">
            <div className="p-2.5 flex items-center space-x-2 border-r border-[#1d1d24] bg-[#070709]">
              <Target className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span className="text-[10px] font-extrabold text-gray-300 uppercase tracking-wider whitespace-nowrap truncate">
                ACCURACY
              </span>
            </div>
            {processedDays.map((d) => (
              <button 
                key={d.dayName} 
                onClick={() => handleOpenEditModal(d)}
                className="p-2 text-center border-r border-[#1d1d24] last:border-r-0 hover:bg-white/5 transition-colors group"
              >
                <span className={`text-[11px] font-bold font-mono tracking-tight group-hover:underline ${
                  d.accuracy > 0
                    ? d.accuracy >= 90 ? (d.isWeekend ? 'text-amber-400' : 'text-emerald-400') : 'text-amber-400'
                    : 'text-gray-600'
                }`}>
                  {d.accuracy > 0 ? `${d.accuracy}%` : '0%'}
                </span>
              </button>
            ))}
          </div>

          {/* ROW 5: MOCK TESTS */}
          <div className="grid grid-cols-[130px_repeat(7,1fr)] items-center">
            <div className="p-2.5 flex items-center space-x-2 border-r border-[#1d1d24] bg-[#070709]">
              <FileText className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span className="text-[10px] font-extrabold text-gray-300 uppercase tracking-wider whitespace-nowrap truncate">
                MOCK TESTS
              </span>
            </div>
            {processedDays.map((d) => (
              <button 
                key={d.dayName} 
                onClick={() => handleOpenEditModal(d)}
                className="p-2 text-center border-r border-[#1d1d24] last:border-r-0 hover:bg-white/5 transition-colors group"
              >
                {d.mocks > 0 ? (
                  <span className={`text-xs font-bold font-mono group-hover:underline ${
                    d.isWeekend ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {d.mocks}
                  </span>
                ) : (
                  <span className="text-gray-600 font-bold text-[11px] group-hover:text-amber-400 transition-colors">—</span>
                )}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* 4 KPI SUMMARY CARDS ROW - Perfectly fitted 4 column grid without horizontal scroll */}
      <div className="mt-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          
          {/* CARD 1: BEST DAY */}
          <div className="bg-[#0b0b0f] border border-amber-500/30 rounded-xl p-2.5 flex items-center space-x-2 shadow-lg relative overflow-hidden group hover:border-amber-500/60 transition-all">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Trophy className="w-3.5 h-3.5 stroke-[2]" />
            </div>
            <div className="min-w-0 flex-1 overflow-hidden">
              <span className="text-[9px] font-black tracking-wider text-amber-400 uppercase block truncate leading-tight">
                BEST DAY
              </span>
              <span className="text-xs font-black text-white block uppercase tracking-tight truncate leading-tight mt-0.5">
                {bestDayObj ? bestDayObj.dayNameFull : 'NO DATA'}
              </span>
              <span className="text-[9px] font-bold text-emerald-400 font-mono block mt-0.5 truncate leading-tight">
                {bestDayObj 
                  ? `${bestDayObj.formattedHours} • ${bestDayObj.questions} Qs` 
                  : 'Log study to see'}
              </span>
            </div>
          </div>

          {/* CARD 2: TOTAL STUDY HOURS */}
          <div className="bg-[#0b0b0f] border border-[#1f1f28] rounded-xl p-2.5 flex items-center space-x-2 shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition-all">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-emerald-400 flex items-center justify-center p-0.5">
                <div className="w-1 h-1 rounded-full bg-emerald-400" />
              </div>
            </div>
            <div className="min-w-0 flex-1 overflow-hidden">
              <span className="text-[9px] font-black tracking-wider text-gray-400 uppercase block truncate leading-tight">
                TOTAL STUDY HOURS
              </span>
              <span className="text-xs font-black text-white block font-mono tracking-tight truncate leading-tight mt-0.5">
                {formatTotalHours(totalHoursVal)}
              </span>
              <span className="text-[9px] font-bold text-emerald-400 block mt-0.5 truncate leading-tight">
                ▲ Real-time total
              </span>
            </div>
          </div>

          {/* CARD 3: TOTAL QUESTIONS */}
          <div className="bg-[#0b0b0f] border border-[#1f1f28] rounded-xl p-2.5 flex items-center space-x-2 shadow-lg relative overflow-hidden group hover:border-amber-500/40 transition-all">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Pencil className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1 overflow-hidden">
              <span className="text-[9px] font-black tracking-wider text-amber-400 uppercase block truncate leading-tight">
                TOTAL QUESTIONS
              </span>
              <span className="text-xs font-black text-white block font-mono tracking-tight truncate leading-tight mt-0.5">
                {totalQuestionsVal.toLocaleString()}
              </span>
              <span className="text-[9px] font-bold text-emerald-400 block mt-0.5 truncate leading-tight">
                ▲ Real-time total
              </span>
            </div>
          </div>

          {/* CARD 4: AVERAGE ACCURACY */}
          <div className="bg-[#0b0b0f] border border-[#1f1f28] rounded-xl p-2.5 flex items-center space-x-2 shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition-all">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <TrendingUp className="w-3.5 h-3.5 stroke-[2]" />
            </div>
            <div className="min-w-0 flex-1 overflow-hidden">
              <span className="text-[9px] font-black tracking-wider text-gray-400 uppercase block truncate leading-tight">
                AVERAGE ACCURACY
              </span>
              <span className="text-xs font-black text-white block font-mono tracking-tight truncate leading-tight mt-0.5">
                {avgAccuracyVal}%
              </span>
              <span className="text-[9px] font-bold text-emerald-400 block mt-0.5 truncate leading-tight">
                ▲ Real-time avg
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* FOOTER SLOGAN BANNER */}
      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-center space-x-2 text-center">
        <Star className="w-4 h-4 fill-amber-400 text-amber-400 flex-shrink-0" />
        <p className="text-xs sm:text-sm font-medium italic text-gray-300">
          Discipline today, <span className="text-amber-400 font-bold not-italic">success</span> tomorrow.
        </p>
      </div>

      {/* MODAL FOR EDITING OR DELETING ANY DAY'S METRICS */}
      {editingDayDate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121218] border border-amber-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
            <button 
              onClick={() => setEditingDayDate(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 mb-1">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                <Edit2 className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                <span>EDIT</span>
                <span className="text-amber-400">{editingDayName}</span>
              </h3>
            </div>
            <p className="text-xs text-gray-400 mb-5">
              Modify or delete study hours, questions solved, accuracy %, or mock tests for this day.
            </p>

            <form onSubmit={handleSaveDayLog} className="space-y-4">
              
              {/* Study Hours Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-300 uppercase flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Study Hours</span>
                  </label>
                  <div className="flex space-x-1">
                    <button
                      type="button"
                      onClick={() => handleQuickAdd('hours', 1)}
                      className="px-2 py-0.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-bold rounded-md border border-amber-500/30"
                    >
                      +1h
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickAdd('hours', 2)}
                      className="px-2 py-0.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-bold rounded-md border border-amber-500/30"
                    >
                      +2h
                    </button>
                  </div>
                </div>
                <input 
                  type="number" 
                  step="0.1" 
                  min="0"
                  max="24"
                  value={editHoursInput} 
                  onChange={(e) => setEditHoursInput(e.target.value)}
                  className="w-full bg-[#08080a] border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              {/* Questions Solved Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-300 uppercase flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>Questions Solved</span>
                  </label>
                  <div className="flex space-x-1">
                    <button
                      type="button"
                      onClick={() => handleQuickAdd('questions', 50)}
                      className="px-2 py-0.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-bold rounded-md border border-emerald-500/30"
                    >
                      +50
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickAdd('questions', 100)}
                      className="px-2 py-0.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-bold rounded-md border border-emerald-500/30"
                    >
                      +100
                    </button>
                  </div>
                </div>
                <input 
                  type="number" 
                  min="0"
                  value={editQuestionsInput} 
                  onChange={(e) => setEditQuestionsInput(e.target.value)}
                  className="w-full bg-[#08080a] border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              {/* Accuracy Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-300 uppercase flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-amber-400" />
                    <span>Accuracy %</span>
                  </label>
                  <div className="flex space-x-1">
                    <button
                      type="button"
                      onClick={() => handleQuickAdd('accuracy', 90)}
                      className="px-2 py-0.5 bg-white/10 hover:bg-white/20 text-gray-300 text-[10px] font-bold rounded-md"
                    >
                      90%
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickAdd('accuracy', 95)}
                      className="px-2 py-0.5 bg-white/10 hover:bg-white/20 text-gray-300 text-[10px] font-bold rounded-md"
                    >
                      95%
                    </button>
                  </div>
                </div>
                <input 
                  type="number" 
                  step="0.1" 
                  min="0"
                  max="100" 
                  value={editAccuracyInput} 
                  onChange={(e) => setEditAccuracyInput(e.target.value)}
                  className="w-full bg-[#08080a] border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              {/* Mock Tests Input */}
              <div>
                <label className="text-xs font-bold text-gray-300 uppercase flex items-center gap-1.5 mb-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>Mock Tests Count</span>
                </label>
                <input 
                  type="number" 
                  min="0"
                  max="10"
                  value={editMocksInput} 
                  onChange={(e) => setEditMocksInput(e.target.value)}
                  className="w-full bg-[#08080a] border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => handleDeleteDayLog(editingDayDate)}
                  className="px-3.5 py-2 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 hover:text-red-300 text-xs font-bold transition-all flex items-center space-x-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Day</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditingDayDate(null)}
                    className="px-3.5 py-2 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black uppercase tracking-wider transition-all shadow-lg flex items-center space-x-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 fill-black" />
                    <span>Save Metrics</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
