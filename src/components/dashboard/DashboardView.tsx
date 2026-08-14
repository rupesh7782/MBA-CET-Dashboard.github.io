import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CircularProgress } from '../common/CircularProgress';
import { Modal } from '../common/Modal';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart as ReLineChart, Line, CartesianGrid 
} from 'recharts';
import { 
  Clock, CheckCircle2, Target, Trophy, Flame, 
  FileText, Plus, ArrowRight, Trash2, Pin, Sparkles, Edit3, 
  Play, Pause, RotateCcw, Settings, FileEdit, Upload, 
  LineChart as LineChartIcon, Timer as TimerIcon, Calendar
} from 'lucide-react';
import { Subject } from '../../types';
import { DailyMotivationWidget } from './DailyMotivationWidget';
import { WeeklyProgressWidget } from './WeeklyProgressWidget';


export const DashboardView: React.FC = () => {
  const { 
    mockTests, 
    addMockTest, 
    notes, 
    addNote, 
    deleteNote, 
    togglePinNote, 
    habits, 
    dailyLogs,
    updateTodayLog, 
    examConfig, 
    setActiveTab,
    currentStreak,
    userProfile,
    setIsProfileModalOpen
  } = useApp();

  // State for Add Mock Modal & New Note Modal
  const [isAddMockOpen, setIsAddMockOpen] = useState(false);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  // State for Edit Metrics Modal
  const [isEditMetricsOpen, setIsEditMetricsOpen] = useState(false);
  const [editHours, setEditHours] = useState("");
  const [editQuestions, setEditQuestions] = useState("");
  const [editAccuracy, setEditAccuracy] = useState("");

  // Today's Tasks interactive state with localStorage persistence
  const [tasks, setTasks] = useState<{ id: number; text: string; completed: boolean }[]>(() => {
    try {
      const saved = localStorage.getItem('mba_cet_prep_v1_dashboard_tasks');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { id: 1, text: 'Complete VARC RC Practice', completed: true },
      { id: 2, text: 'LRDI Set Practice – 2 Sets', completed: true },
      { id: 3, text: 'Read Editorial – The Hindu', completed: true },
      { id: 4, text: 'Complete Quant Quiz', completed: true },
      { id: 5, text: 'Revise Formulas – Algebra', completed: false },
      { id: 6, text: 'Give 1 Sectional Test', completed: false },
    ];
  });

  const [countdowns, setCountdowns] = useState<{ id: number; examName: string; examDate: string; color: string }[]>(() => {
    try {
      const saved = localStorage.getItem('mba_cet_prep_v1_dashboard_countdowns');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { id: 1, examName: 'MBA CET 2027', examDate: '2027-03-15', color: '#4ade80' },
      { id: 2, examName: 'SNAP 2026', examDate: '2026-12-10', color: '#c084fc' },
      { id: 3, examName: 'CAT 2026', examDate: '2026-11-29', color: '#38bdf8' },
      { id: 4, examName: 'CMAT 2026', examDate: '2026-05-04', color: '#a3e635' },
      { id: 5, examName: 'NMAT 2026', examDate: '2026-10-10', color: '#facc15' },
    ];
  });
  const [showEditCountdownsModal, setShowEditCountdownsModal] = useState(false);
  const [editingCountdowns, setEditingCountdowns] = useState<{ id: number; examName: string; examDate: string; color: string }[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem('mba_cet_prep_v1_dashboard_countdowns', JSON.stringify(countdowns));
    } catch (e) {}
  }, [countdowns]);

  const getDaysRemaining = (targetDateStr: string) => {
    const target = new Date(targetDateStr);
    const today = new Date();
    target.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const [newTaskInput, setNewTaskInput] = useState('');
  const [showAddTaskInput, setShowAddTaskInput] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editTaskInput, setEditTaskInput] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('mba_cet_prep_v1_dashboard_tasks', JSON.stringify(tasks));
    } catch (e) {
      console.error(e);
    }
  }, [tasks]);

  const completedTasksCount = tasks.filter(t => t.completed).length;

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    setTasks(prev => [...prev, { id: Date.now(), text: newTaskInput.trim(), completed: false }]);
    setNewTaskInput('');
    setShowAddTaskInput(false);
  };

  const startEditTask = (task: { id: number; text: string; completed: boolean }, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTaskId(task.id);
    setEditTaskInput(task.text);
  };

  const saveEditTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTaskInput.trim() || editingTaskId === null) {
      setEditingTaskId(null);
      return;
    }
    setTasks(prev => prev.map(t => t.id === editingTaskId ? { ...t, text: editTaskInput.trim() } : t));
    setEditingTaskId(null);
    setEditTaskInput('');
  };

  const deleteTask = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Right sidebar timer state with localStorage persistence
  const [timerSeconds, setTimerSeconds] = useState(() => {
    try {
      const saved = localStorage.getItem('mba_cet_prep_v1_dashboard_timerSecs');
      if (saved) return Number(saved);
    } catch (e) {}
    return 25 * 60;
  });

  const [isTimerRunning, setIsTimerRunning] = useState(() => {
    try {
      const saved = localStorage.getItem('mba_cet_prep_v1_dashboard_timerRunning');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return false;
  });

  useEffect(() => {
    try {
      localStorage.setItem('mba_cet_prep_v1_dashboard_timerSecs', timerSeconds.toString());
      localStorage.setItem('mba_cet_prep_v1_dashboard_timerRunning', JSON.stringify(isTimerRunning));
    } catch (e) {}
  }, [timerSeconds, isTimerRunning]);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds(s => s - 1), 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const formatTimerTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // New Mock Form State
  const [newMockName, setNewMockName] = useState('');
  const [newMockDate, setNewMockDate] = useState('2026-05-28');
  const [newMockTime, setNewMockTime] = useState('09:00 AM');
  const [newMockVarc, setNewMockVarc] = useState<number>(35);
  const [newMockLrdi, setNewMockLrdi] = useState<number>(45);
  const [newMockAr, setNewMockAr] = useState<number>(38);
  const [newMockQuant, setNewMockQuant] = useState<number>(34);
  const [newMockStatus, setNewMockStatus] = useState<'Upcoming' | 'Completed'>('Completed');
  const [newMockRemarks, setNewMockRemarks] = useState('');

  // New Note Form State
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteSubject, setNewNoteSubject] = useState<Subject | 'General'>('LRDI');
  const [newNoteContent, setNewNoteContent] = useState('');

  // Computations
  const completedMocks = mockTests.filter(m => m.status === 'Completed').sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const upcomingMocks = mockTests.filter(m => m.status === 'Upcoming').sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 3);
  const totalMocksCount = completedMocks.length;

  const avgMockScoreNum = totalMocksCount > 0 ? (completedMocks.reduce((acc, m) => acc + (m.percentile || 0), 0) / totalMocksCount) : 0;
  const avgMockScore = avgMockScoreNum.toFixed(1);
  
  const highestScore = totalMocksCount > 0 ? Math.max(...completedMocks.map(m => m.percentile || 0)).toFixed(1) : '0';
  const highestAccuracy = totalMocksCount > 0 ? Math.max(...completedMocks.map(m => m.accuracy || 0)).toFixed(1) : '0';
  const avgAccuracyNum = totalMocksCount > 0 ? (completedMocks.reduce((acc, m) => acc + (m.accuracy || 0), 0) / totalMocksCount) : 0;
  const avgAccuracy = avgAccuracyNum.toFixed(1);

  const todayLog = dailyLogs[dailyLogs.length - 1] || { hoursStudied: 0, questionsSolved: 0, accuracy: 0 };
  
  const todayStudyHoursStr = Math.floor(todayLog.hoursStudied).toString().padStart(2, '0') + 'h ' + Math.round((todayLog.hoursStudied % 1) * 60).toString().padStart(2, '0') + 'm';
  const studyGoal = 8;
  const studyProgressPct = Math.min(100, (todayLog.hoursStudied / studyGoal) * 100);

  const questionsGoal = 150;
  const questionsProgressPct = Math.min(100, (todayLog.questionsSolved / questionsGoal) * 100);

  const accuracyProgressPct = todayLog.accuracy || 0;

  const openEditMetricsModal = () => {
    setEditHours(todayLog.hoursStudied.toString());
    setEditQuestions(todayLog.questionsSolved.toString());
    setEditAccuracy(todayLog.accuracy.toString());
    setIsEditMetricsOpen(true);
  };

  const handleSaveMetrics = (e: React.FormEvent) => {
    e.preventDefault();
    updateTodayLog(Number(editHours), Number(editQuestions), Number(editAccuracy));
    setIsEditMetricsOpen(false);
  };

  // Chart Data: Weekly Study Time (Last 7 Days from logs)
  const last7Logs = dailyLogs.slice(-7);
  const weeklyStudyData = last7Logs.map(log => {
    const d = new Date(log.date);
    return {
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      hours: Number(log.hoursStudied.toFixed(2)),
      label: `${Math.floor(log.hoursStudied)}h ${Math.round((log.hoursStudied % 1) * 60)}m`
    };
  });
  
  // If no logs, fallback to empty array but keep UI intact
  if (weeklyStudyData.length === 0) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    days.forEach(d => weeklyStudyData.push({ day: d, hours: 0, label: '0h 0m' }));
  }

  // Subject Doughnut Data (Calculated from mocks or static fallback)
  const avgVarc = totalMocksCount > 0 ? (completedMocks.reduce((acc, m) => acc + m.varcScore, 0) / totalMocksCount) : 0;
  const avgLrdi = totalMocksCount > 0 ? (completedMocks.reduce((acc, m) => acc + m.lrdiScore, 0) / totalMocksCount) : 0;
  const avgAr = totalMocksCount > 0 ? (completedMocks.reduce((acc, m) => acc + m.arScore, 0) / totalMocksCount) : 0;
  const avgQuant = totalMocksCount > 0 ? (completedMocks.reduce((acc, m) => acc + m.quantScore, 0) / totalMocksCount) : 0;
  
  const totalAvg = avgVarc + avgLrdi + avgAr + avgQuant || 1; // avoid division by zero
  
  const subjectProgressData = [
    { name: 'VARC', value: totalMocksCount > 0 ? Math.round((avgVarc / totalAvg) * 100) : 25, color: '#a855f7' },
    { name: 'LRDI', value: totalMocksCount > 0 ? Math.round((avgLrdi / totalAvg) * 100) : 25, color: '#f97316' },
    { name: 'AR', value: totalMocksCount > 0 ? Math.round((avgAr / totalAvg) * 100) : 25, color: '#eab308' },
    { name: 'QUANT', value: totalMocksCount > 0 ? Math.round((avgQuant / totalAvg) * 100) : 25, color: '#22c55e' },
  ];
  
  const overallProgress = avgMockScoreNum;

  // Performance Trends Data
  let performanceTrendsData = completedMocks.slice(-10).map(m => ({
    date: new Date(m.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
    score: m.percentile || 0,
    accuracy: m.accuracy || 0,
  }));
  
  if (performanceTrendsData.length === 0) {
    performanceTrendsData = [
      { date: 'No Data', score: 0, accuracy: 0 }
    ];
  }

  // Handle Create Mock
  const handleCreateMock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMockName.trim()) return;

    const total = newMockVarc + newMockLrdi + newMockAr + newMockQuant;
    const estPercentile = Math.min(99.9, Math.max(10, Number((total / 200 * 110).toFixed(1))));

    addMockTest({
      name: newMockName,
      date: newMockDate,
      time: newMockTime,
      varcScore: newMockVarc,
      lrdiScore: newMockLrdi,
      arScore: newMockAr,
      quantScore: newMockQuant,
      totalScore: total,
      maxScore: 200,
      percentile: estPercentile,
      timeTakenMinutes: 150,
      accuracy: 80,
      remarks: newMockRemarks || 'Manual mock test entry',
      status: newMockStatus,
    });

    setIsAddMockOpen(false);
    setNewMockName('');
    setNewMockRemarks('');
  };

  // Handle Create Note
  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;

    addNote({
      title: newNoteTitle,
      content: newNoteContent || `# ${newNoteTitle}\n\nAdd your detailed notes here...`,
      subject: newNoteSubject,
      date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isPinned: false,
      tags: [newNoteSubject, 'CET'],
      folder: newNoteSubject,
    });

    setIsAddNoteOpen(false);
    setNewNoteTitle('');
    setNewNoteContent('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Greeting Header */}
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2">
          <span>Hello, {userProfile.name.split(' ')[0] || userProfile.name}!</span>
          <span>👋</span>
        </h2>
        <p className="text-xs text-[#707085] mt-1 font-medium">
          Let's make today productive and closer to your MBA dream.
        </p>
      </div>

      {/* Row 1: Top 5 Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Study Time Today */}
        <div 
          className="bg-[#0a0a0a] border border-[#222222] hover:border-[#a855f7]/40 rounded-2xl p-4 flex items-center justify-between transition-all duration-300 cursor-pointer"
          onClick={openEditMetricsModal}
          title="Click to edit metrics"
        >
          <div>
            <div className="flex items-center space-x-2 text-[#707085] text-xs font-medium">
              <div className="w-5 h-5 rounded-md bg-[#a855f7]/15 flex items-center justify-center text-[#a855f7]">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <span>Study Time Today</span>
            </div>
            <div className="mt-2.5">
              <span className="text-2xl font-bold text-white tracking-tight">{todayStudyHoursStr}</span>
            </div>
            <p className="text-[11px] text-[#707085] mt-1 font-medium">Goal: {studyGoal}h 00m</p>
          </div>
          <CircularProgress percentage={studyProgressPct} strokeColor="#a855f7" trackColor="#222222" size={54} />
        </div>

        {/* Card 2: Questions Solved */}
        <div 
          className="bg-[#0a0a0a] border border-[#222222] hover:border-[#f97316]/40 rounded-2xl p-4 flex items-center justify-between transition-all duration-300 cursor-pointer"
          onClick={openEditMetricsModal}
          title="Click to edit metrics"
        >
          <div>
            <div className="flex items-center space-x-2 text-[#707085] text-xs font-medium">
              <div className="w-5 h-5 rounded-md bg-[#f97316]/15 flex items-center justify-center text-[#f97316]">
                <FileEdit className="w-3.5 h-3.5" />
              </div>
              <span>Questions Solved</span>
            </div>
            <div className="mt-2.5">
              <span className="text-2xl font-bold text-white tracking-tight">{todayLog.questionsSolved}</span>
            </div>
            <p className="text-[11px] text-[#707085] mt-1 font-medium">Goal: {questionsGoal}</p>
          </div>
          <CircularProgress percentage={questionsProgressPct} strokeColor="#f97316" trackColor="#222222" size={54} />
        </div>

        {/* Card 3: Accuracy */}
        <div 
          className="bg-[#0a0a0a] border border-[#222222] hover:border-[#22c55e]/40 rounded-2xl p-4 flex items-center justify-between transition-all duration-300 cursor-pointer"
          onClick={openEditMetricsModal}
          title="Click to edit metrics"
        >
          <div>
            <div className="flex items-center space-x-2 text-[#707085] text-xs font-medium">
              <div className="w-5 h-5 rounded-md bg-[#22c55e]/15 flex items-center justify-center text-[#22c55e]">
                <Target className="w-3.5 h-3.5" />
              </div>
              <span>Accuracy</span>
            </div>
            <div className="mt-2.5">
              <span className="text-2xl font-bold text-white tracking-tight">{todayLog.accuracy.toFixed(1)}%</span>
            </div>
            <p className="text-[11px] text-[#707085] mt-1 font-medium">Goal: 85%</p>
          </div>
          <CircularProgress percentage={accuracyProgressPct} strokeColor="#22c55e" trackColor="#222222" size={54} />
        </div>

        {/* Card 4: Avg. Mock Score */}
        <div className="bg-[#0a0a0a] border border-[#222222] hover:border-[#eab308]/40 rounded-2xl p-4 flex items-center justify-between transition-all duration-300">
          <div>
            <div className="flex items-center space-x-2 text-[#707085] text-xs font-medium">
              <div className="w-5 h-5 rounded-md bg-[#eab308]/15 flex items-center justify-center text-[#eab308]">
                <LineChartIcon className="w-3.5 h-3.5" />
              </div>
              <span>Avg. Mock Score</span>
            </div>
            <div className="mt-2.5">
              <span className="text-2xl font-bold text-white tracking-tight">{avgMockScore}%ile</span>
            </div>
            <p className="text-[11px] text-[#707085] mt-1 font-medium">Total Mocks: {totalMocksCount}</p>
          </div>
          <CircularProgress percentage={avgMockScoreNum} strokeColor="#eab308" trackColor="#222222" size={54} />
        </div>

        {/* Card 5: Current Streak */}
        <div className="bg-[#0a0a0a] border border-[#222222] hover:border-[#f97316]/40 rounded-2xl p-4 flex items-center justify-between transition-all duration-300">
          <div>
            <div className="flex items-center space-x-2 text-[#707085] text-xs font-medium">
              <div className="w-5 h-5 rounded-md bg-[#f97316]/15 flex items-center justify-center text-[#f97316]">
                <Flame className="w-3.5 h-3.5 fill-[#f97316]" />
              </div>
              <span>Current Streak</span>
            </div>
            <div className="mt-2.5">
              <span className="text-2xl font-bold text-white tracking-tight">{currentStreak} Days</span>
            </div>
            <p className="text-[11px] text-[#707085] mt-1 font-medium">Keep it up!</p>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-[#f97316] flex items-center justify-center text-[#f97316] font-extrabold text-sm bg-[#f97316]/10">
            {currentStreak}
          </div>
        </div>
      </div>

      {/* Main Grid: Left 2-Column Section + Right 1-Column Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT / CENTER COLUMN (2/3 Width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Row 2: Study Time This Week Bar Chart & Subject Wise Progress */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Study Time This Week Bar Chart */}
            <div className="bg-[#0a0a0a] border border-[#222222] rounded-2xl p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white tracking-tight">Study Time This Week</h3>
                <select className="bg-[#0a0a0a] text-[11px] text-white border border-[#222222] rounded-lg px-2.5 py-1 focus:outline-none">
                  <option>This Week</option>
                  <option>Last Week</option>
                </select>
              </div>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyStudyData} margin={{ top: 25, right: 0, left: -25, bottom: 0 }}>
                    <XAxis dataKey="day" stroke="#707085" fontSize={11} tickLine={false} axisLine={{ stroke: '#222222' }} />
                    <YAxis stroke="#707085" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}h`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#222222', borderRadius: '12px', fontSize: '11px' }}
                      cursor={{ fill: 'rgba(168,85,247,0.05)' }}
                      formatter={(val: any) => [`${val} hours`, 'Studied']}
                    />
                    <Bar dataKey="hours" radius={[6, 6, 0, 0]} fill="#a855f7">
                      {weeklyStudyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === weeklyStudyData.length - 1 ? '#a855f7' : '#2d2342'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Subject Wise Progress Doughnut */}
            <div className="bg-[#0a0a0a] border border-[#222222] rounded-2xl p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-white tracking-tight">Subject Wise Progress</h3>
                <select className="bg-[#0a0a0a] text-[11px] text-white border border-[#222222] rounded-lg px-2 py-0.5 focus:outline-none">
                  <option>Overall</option>
                </select>
              </div>

              <div className="flex items-center space-x-4 my-2">
                <div className="relative w-36 h-36 flex items-center justify-center flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={subjectProgressData}
                        cx="50%"
                        cy="50%"
                        innerRadius={44}
                        outerRadius={62}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {subjectProgressData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] text-[#707085]">Overall</span>
                    <span className="text-xl font-extrabold text-white">{avgMockScore}</span>
                    <span className="text-[9px] text-[#22c55e]">Score</span>
                  </div>
                </div>

                {/* Legend List */}
                <div className="space-y-2 flex-1 text-xs">
                  {subjectProgressData.map((sub) => (
                    <div key={sub.name} className="flex items-center justify-between text-[#9494ad]">
                      <div className="flex items-center space-x-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sub.color }} />
                        <span className="font-semibold text-white">{sub.name}</span>
                      </div>
                      <span className="font-medium text-white">{sub.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-[11px] text-[#707085] mt-1 pt-2 border-t border-[#222222]">
                Keep going! You're doing great.
              </p>
            </div>
          </div>

          {/* Row 3: Recent Notes & Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Recent Notes */}
            <div className="bg-[#0a0a0a] border border-[#222222] rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white tracking-tight">Recent Notes</h3>
                  <button 
                    onClick={() => setActiveTab('Notes')}
                    className="text-xs text-[#f97316] font-semibold hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-2.5">
                  {notes.slice(0, 4).map((note) => (
                    <div 
                      key={note.id} 
                      className="p-2.5 bg-[#0a0a0a] border border-[#222222] rounded-xl flex items-center justify-between hover:border-[#a855f7]/30 transition-colors group"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          note.subject === 'LRDI' ? 'bg-[#f97316]/15 text-[#f97316]' :
                          note.subject === 'VARC' ? 'bg-[#a855f7]/15 text-[#a855f7]' :
                          note.subject === 'QUANT' ? 'bg-[#22c55e]/15 text-[#22c55e]' :
                          'bg-[#eab308]/15 text-[#eab308]'
                        }`}>
                          <FileText className="w-4 h-4" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-xs font-bold text-white truncate">{note.title}</h4>
                            <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded uppercase ${
                              note.subject === 'LRDI' ? 'bg-[#f97316]/20 text-[#f97316]' :
                              note.subject === 'VARC' ? 'bg-[#a855f7]/20 text-[#a855f7]' :
                              note.subject === 'QUANT' ? 'bg-[#22c55e]/20 text-[#22c55e]' :
                              'bg-[#eab308]/20 text-[#eab308]'
                            }`}>
                              {note.subject}
                            </span>
                          </div>
                          <p className="text-[10px] text-[#707085] mt-0.5">{note.date}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1">
                        <button 
                          onClick={() => togglePinNote(note.id)} 
                          className={`p-1 rounded ${note.isPinned ? 'text-[#f97316]' : 'text-[#707085]'}`}
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setIsAddNoteOpen(true)}
                className="w-full mt-3 py-2 border border-[#a855f7]/40 text-[#a855f7] hover:bg-[#a855f7]/10 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New Note</span>
              </button>
            </div>

            {/* Performance Overview Line Chart */}
            <div className="bg-[#0a0a0a] border border-[#222222] rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-white tracking-tight">Performance Overview</h3>
                  <select className="bg-[#0a0a0a] text-[11px] text-white border border-[#222222] rounded-lg px-2 py-0.5 focus:outline-none">
                    <option>This Month</option>
                  </select>
                </div>

                <div className="flex items-center space-x-4 text-[11px] text-[#707085] my-1">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#a855f7]" />
                    <span>Score (%ile)</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <div className="w-2.5 h-[2px] bg-[#707085] border-dashed border-b" />
                    <span>Accuracy (%)</span>
                  </div>
                </div>

                <div className="h-36 w-full my-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReLineChart data={performanceTrendsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222222" />
                      <XAxis dataKey="date" stroke="#707085" fontSize={10} tickLine={false} />
                      <YAxis stroke="#707085" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                      <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#222222', borderRadius: '10px', fontSize: '11px' }} />
                      <Line type="monotone" dataKey="score" stroke="#a855f7" strokeWidth={2.5} dot={{ fill: '#a855f7', r: 3 }} name="Score" />
                      <Line type="monotone" dataKey="accuracy" stroke="#707085" strokeWidth={1.5} strokeDasharray="4 4" dot={{ fill: '#707085', r: 2 }} name="Accuracy" />
                    </ReLineChart>
                  </ResponsiveContainer>
                </div>

                {/* 4 Bottom Metric Blocks */}
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="p-2 bg-[#0a0a0a] rounded-xl border border-[#222222] flex items-center space-x-2">
                    <Trophy className="w-4 h-4 text-[#a855f7]" />
                    <div>
                      <p className="text-[9px] text-[#707085]">Highest Score</p>
                      <p className="text-xs font-bold text-white mt-0.5">{highestScore} <span className="text-[9px] font-normal text-[#707085]">%ile</span></p>
                    </div>
                  </div>

                  <div className="p-2 bg-[#0a0a0a] rounded-xl border border-[#222222] flex items-center space-x-2">
                    <LineChartIcon className="w-4 h-4 text-[#f97316]" />
                    <div>
                      <p className="text-[9px] text-[#707085]">Avg. Score</p>
                      <p className="text-xs font-bold text-white mt-0.5">{avgMockScore} <span className="text-[9px] font-normal text-[#707085]">%ile</span></p>
                    </div>
                  </div>

                  <div className="p-2 bg-[#0a0a0a] rounded-xl border border-[#222222] flex items-center space-x-2">
                    <Target className="w-4 h-4 text-[#22c55e]" />
                    <div>
                      <p className="text-[9px] text-[#707085]">Highest Accuracy</p>
                      <p className="text-xs font-bold text-white mt-0.5">{highestAccuracy} <span className="text-[9px] font-normal text-[#707085]">%</span></p>
                    </div>
                  </div>

                  <div className="p-2 bg-[#0a0a0a] rounded-xl border border-[#222222] flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-[#eab308]" />
                    <div>
                      <p className="text-[9px] text-[#707085]">Avg. Accuracy</p>
                      <p className="text-xs font-bold text-white mt-0.5">{avgAccuracy} <span className="text-[9px] font-normal text-[#707085]">%</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Quick Actions Row */}
          <div className="bg-[#0a0a0a] border border-[#222222] rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-bold text-white">Quick Actions</span>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <button 
                onClick={() => setActiveTab('Study Timer')}
                className="px-3.5 py-1.5 rounded-xl border border-[#a855f7] bg-[#a855f7]/10 text-white font-semibold flex items-center space-x-2 hover:bg-[#a855f7]/20 transition-colors"
              >
                <TimerIcon className="w-3.5 h-3.5 text-[#a855f7]" />
                <span>Start Study Timer</span>
              </button>

              <button 
                onClick={() => setIsAddNoteOpen(true)}
                className="px-3.5 py-1.5 rounded-xl border border-[#222222] bg-[#0a0a0a] text-white hover:border-[#a855f7]/40 flex items-center space-x-2 transition-colors"
              >
                <FileEdit className="w-3.5 h-3.5 text-[#a855f7]" />
                <span>Add Note</span>
              </button>

              <button 
                onClick={() => setActiveTab('PDF Library')}
                className="px-3.5 py-1.5 rounded-xl border border-[#222222] bg-[#0a0a0a] text-white hover:border-[#f97316]/40 flex items-center space-x-2 transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-[#f97316]" />
                <span>Upload PDF</span>
              </button>

              <button 
                onClick={() => setIsAddMockOpen(true)}
                className="px-3.5 py-1.5 rounded-xl border border-[#222222] bg-[#0a0a0a] text-white hover:border-[#eab308]/40 flex items-center space-x-2 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-[#eab308]" />
                <span>Add Mock Test</span>
              </button>

              <button 
                onClick={() => setActiveTab('Analytics')}
                className="px-3.5 py-1.5 rounded-xl border border-[#222222] bg-[#0a0a0a] text-white hover:border-[#22c55e]/40 flex items-center space-x-2 transition-colors"
              >
                <LineChartIcon className="w-3.5 h-3.5 text-[#22c55e]" />
                <span>View Analytics</span>
              </button>
            </div>
          </div>

          {/* WEEKLY PROGRESS WIDGET */}
          <WeeklyProgressWidget />

        </div>

        {/* RIGHT SIDEBAR COLUMN (1/3 Width) */}
        <div className="space-y-6">
          
          {/* Widget 0: Exam Countdown */}
          <div className="bg-[#0a0a0a] border border-[#222222] rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
              <h3 className="text-[13px] font-bold text-white tracking-widest uppercase">Exam Countdown</h3>
              <button
                onClick={() => {
                  setEditingCountdowns([...countdowns]);
                  setShowEditCountdownsModal(true);
                }}
                className="text-[#707085] hover:text-white transition-colors"
                title="Edit Countdowns"
              >
                <Calendar className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-0 text-xs">
              {countdowns.map(c => {
                const days = getDaysRemaining(c.examDate);
                return (
                  <div key={c.id} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0 last:pb-0">
                    <span className="font-bold text-[#e5e5e5]">{c.examName}</span>
                    <div className="text-right flex items-end space-x-1">
                      <span className="text-sm font-black tracking-tight" style={{ color: c.color }}>
                        D- {days > 0 ? days : 0}
                      </span>
                      <span className="text-[10px] text-[#707085] leading-loose">Days</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-6">
            <DailyMotivationWidget instanceKey="dashboard" title="DAILY MOTIVATION" defaultQuoteId={89} />
          </div>

          {/* Widget 1: Today's Tasks */}
          <div className="bg-[#0a0a0a] border border-[#222222] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white tracking-tight">Today's Tasks</h3>
              <span className="text-[11px] text-[#707085] font-medium">{completedTasksCount} / {tasks.length} Completed</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#0a0a0a] h-1.5 rounded-full overflow-hidden mb-4 border border-[#222222]">
              <div 
                className="bg-[#a855f7] h-full transition-all duration-300"
                style={{ width: `${(completedTasksCount / tasks.length) * 100}%` }}
              />
            </div>

            {/* Tasks List */}
            <div className="space-y-2.5">
              {tasks.map(t => (
                <div 
                  key={t.id}
                  onClick={() => { if (editingTaskId !== t.id) toggleTask(t.id); }}
                  className="flex items-center justify-between cursor-pointer group"
                >
                  {editingTaskId === t.id ? (
                    <form onSubmit={saveEditTask} className="flex items-center space-x-2 w-full">
                      <input
                        type="text"
                        value={editTaskInput}
                        onChange={(e) => setEditTaskInput(e.target.value)}
                        className="flex-1 bg-[#121212] border border-white/10 rounded-xl px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#a855f7]"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                        onBlur={saveEditTask}
                      />
                    </form>
                  ) : (
                    <>
                      <div className="flex items-center space-x-3 min-w-0 pr-2">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${
                          t.completed 
                            ? 'bg-[#a855f7] border-[#a855f7] text-black' 
                            : 'border-[#222222] group-hover:border-[#a855f7]'
                        }`}>
                          {t.completed && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <span className={`text-xs truncate ${
                          t.completed ? 'line-through text-[#707085]' : 'text-white'
                        }`}>
                          {t.text}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={(e) => startEditTask(t, e)}
                          className="opacity-0 group-hover:opacity-100 text-[#707085] hover:text-[#a855f7] p-1 transition-opacity"
                          title="Edit task"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => deleteTask(t.id, e)}
                          className="opacity-0 group-hover:opacity-100 text-[#707085] hover:text-red-400 p-1 transition-opacity"
                          title="Delete task"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Add Task Form / Button */}
            {showAddTaskInput ? (
              <form onSubmit={addTask} className="mt-3 flex items-center space-x-2">
                <input
                  type="text"
                  value={newTaskInput}
                  onChange={(e) => setNewTaskInput(e.target.value)}
                  placeholder="New task title..."
                  className="flex-1 bg-[#121212] border border-white/10 rounded-xl px-2.5 py-1 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#a855f7]"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 bg-[#a855f7] text-white font-bold rounded-xl text-xs hover:bg-[#9333ea]"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddTaskInput(false)}
                  className="px-2 py-1 text-gray-400 hover:text-white text-xs"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button
                onClick={() => setShowAddTaskInput(true)}
                className="mt-3.5 w-full py-1.5 border border-dashed border-white/10 hover:border-[#a855f7]/40 rounded-xl text-[11px] text-gray-400 hover:text-white flex items-center justify-center space-x-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-[#a855f7]" />
                <span>Add Task</span>
              </button>
            )}
          </div>


          {/* Widget 3: Upcoming Tests */}
          <div className="bg-[#0a0a0a] border border-[#222222] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white tracking-tight">Upcoming Tests</h3>
              <button 
                onClick={() => setActiveTab('Mock Tests')}
                className="text-xs text-[#f97316] font-semibold hover:underline"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {upcomingMocks.length > 0 ? upcomingMocks.map(mock => {
                const mockDate = new Date(mock.date);
                const month = mockDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
                const day = mockDate.toLocaleDateString('en-US', { day: '2-digit' });
                
                const diffTime = Math.abs(mockDate.getTime() - new Date().getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                const daysText = mockDate > new Date() ? `In ${diffDays} days` : 'Past due';

                return (
                  <div key={mock.id} className="p-3 bg-[#0a0a0a] border border-[#222222] rounded-xl flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#0a0a0a] border border-[#222222] rounded-xl flex flex-col items-center justify-center">
                        <span className="text-[8px] font-extrabold text-[#f97316]">{month}</span>
                        <span className="text-sm font-bold text-white leading-none">{day}</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{mock.name}</h4>
                        <p className="text-[10px] text-[#707085] mt-0.5">{mock.maxScore} Questions • {mock.timeTakenMinutes} Minutes</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-[#f97316] block">{daysText}</span>
                      <span className="text-[9px] text-[#707085]">{mock.time || '09:00 AM'}</span>
                    </div>
                  </div>
                );
              }) : (
                <p className="text-xs text-[#707085] text-center py-4">No upcoming tests scheduled.</p>
              )}
            </div>
          <button
              onClick={() => setIsAddMockOpen(true)}
              className="w-full mt-3 py-2 border border-[#f97316]/40 text-[#f97316] hover:bg-[#f97316]/10 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Mock Test</span>
            </button>
          </div>

        </div>

      </div>

      {/* Add Mock Test Modal */}
      <Modal
        isOpen={isAddMockOpen}
        onClose={() => setIsAddMockOpen(false)}
        title="Record Mock Test Result"
      >
        <form onSubmit={handleCreateMock} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#707085] mb-1 font-medium">Mock Test Name</label>
            <input
              type="text"
              required
              value={newMockName}
              onChange={(e) => setNewMockName(e.target.value)}
              placeholder="e.g. MBA CET Mock Test 12"
              className="w-full bg-[#0a0a0a] border border-[#222222] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#a855f7]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#707085] mb-1 font-medium">Date</label>
              <input
                type="date"
                required
                value={newMockDate}
                onChange={(e) => setNewMockDate(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#222222] rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#a855f7]"
              />
            </div>

            <div>
              <label className="block text-[#707085] mb-1 font-medium">Status</label>
              <select
                value={newMockStatus}
                onChange={(e: any) => setNewMockStatus(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#222222] rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#a855f7]"
              >
                <option value="Completed">Completed</option>
                <option value="Upcoming">Upcoming</option>
              </select>
            </div>
          </div>

          {newMockStatus === 'Completed' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 bg-[#0a0a0a] rounded-xl border border-[#222222]">
              <div>
                <label className="block text-[#a855f7] font-bold mb-1">VARC (50)</label>
                <input
                  type="number"
                  max={50}
                  min={0}
                  value={newMockVarc}
                  onChange={(e) => setNewMockVarc(Number(e.target.value))}
                  className="w-full bg-[#0a0a0a] border border-[#222222] rounded-lg p-2 text-white text-center font-bold"
                />
              </div>

              <div>
                <label className="block text-[#f97316] font-bold mb-1">LRDI (75)</label>
                <input
                  type="number"
                  max={75}
                  min={0}
                  value={newMockLrdi}
                  onChange={(e) => setNewMockLrdi(Number(e.target.value))}
                  className="w-full bg-[#0a0a0a] border border-[#222222] rounded-lg p-2 text-white text-center font-bold"
                />
              </div>

              <div>
                <label className="block text-[#eab308] font-bold mb-1">AR (25)</label>
                <input
                  type="number"
                  max={25}
                  min={0}
                  value={newMockAr}
                  onChange={(e) => setNewMockAr(Number(e.target.value))}
                  className="w-full bg-[#0a0a0a] border border-[#222222] rounded-lg p-2 text-white text-center font-bold"
                />
              </div>

              <div>
                <label className="block text-[#22c55e] font-bold mb-1">QUANT (50)</label>
                <input
                  type="number"
                  max={50}
                  min={0}
                  value={newMockQuant}
                  onChange={(e) => setNewMockQuant(Number(e.target.value))}
                  className="w-full bg-[#0a0a0a] border border-[#222222] rounded-lg p-2 text-white text-center font-bold"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[#707085] mb-1 font-medium">Remarks & Analysis</label>
            <textarea
              rows={2}
              value={newMockRemarks}
              onChange={(e) => setNewMockRemarks(e.target.value)}
              placeholder="e.g. Need more practice on Circular Arrangement puzzles..."
              className="w-full bg-[#0a0a0a] border border-[#222222] rounded-xl p-3 text-white focus:outline-none focus:border-[#a855f7]"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-[#222222]">
            <button
              type="button"
              onClick={() => setIsAddMockOpen(false)}
              className="px-4 py-2 text-[#707085] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#a855f7] text-white font-bold rounded-xl hover:bg-[#9333ea] transition-colors"
            >
              Save Mock Test
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Note Modal */}
      <Modal
        isOpen={isAddNoteOpen}
        onClose={() => setIsAddNoteOpen(false)}
        title="Create Study Note"
      >
        <form onSubmit={handleCreateNote} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#707085] mb-1 font-medium">Note Title</label>
            <input
              type="text"
              required
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              placeholder="e.g. Parajumble Solving Rules"
              className="w-full bg-[#0a0a0a] border border-[#222222] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#a855f7]"
            />
          </div>

          <div>
            <label className="block text-[#707085] mb-1 font-medium">Subject Tag</label>
            <select
              value={newNoteSubject}
              onChange={(e: any) => setNewNoteSubject(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#222222] rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#a855f7]"
            >
              <option value="VARC">VARC</option>
              <option value="LRDI">LRDI</option>
              <option value="AR">AR</option>
              <option value="QUANT">QUANT</option>
              <option value="General">General</option>
            </select>
          </div>

          <div>
            <label className="block text-[#707085] mb-1 font-medium">Content (Markdown Supported)</label>
            <textarea
              rows={5}
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="Write your study notes here..."
              className="w-full bg-[#0a0a0a] border border-[#222222] rounded-xl p-3 text-white focus:outline-none focus:border-[#a855f7] font-mono text-xs"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-[#222222]">
            <button
              type="button"
              onClick={() => setIsAddNoteOpen(false)}
              className="px-4 py-2 text-[#707085] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#a855f7] text-white font-bold rounded-xl hover:bg-[#9333ea] transition-colors"
            >
              Save Note
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Countdowns Modal */}
      <Modal
        isOpen={showEditCountdownsModal}
        onClose={() => setShowEditCountdownsModal(false)}
        title="Edit Exam Countdowns"
        subtitle="Add, remove, or modify your target exams"
      >
        <div className="space-y-4">
          {editingCountdowns.map((c, i) => (
            <div key={c.id} className="flex items-center space-x-2 bg-[#121212] p-2 rounded-xl border border-white/10">
              <input
                type="text"
                value={c.examName}
                onChange={e => {
                  const newArr = [...editingCountdowns];
                  newArr[i].examName = e.target.value;
                  setEditingCountdowns(newArr);
                }}
                className="flex-1 bg-transparent border-none text-xs text-white focus:outline-none"
                placeholder="Exam Name"
              />
              <input
                type="date"
                value={c.examDate}
                onChange={e => {
                  const newArr = [...editingCountdowns];
                  newArr[i].examDate = e.target.value;
                  setEditingCountdowns(newArr);
                }}
                className="w-32 bg-transparent border-none text-xs text-[#707085] focus:outline-none [color-scheme:dark]"
              />
              <input
                type="color"
                value={c.color}
                onChange={e => {
                  const newArr = [...editingCountdowns];
                  newArr[i].color = e.target.value;
                  setEditingCountdowns(newArr);
                }}
                className="w-6 h-6 p-0 border-none bg-transparent cursor-pointer rounded-full overflow-hidden"
              />
              <button
                onClick={() => {
                  setEditingCountdowns(editingCountdowns.filter(item => item.id !== c.id));
                }}
                className="p-1.5 text-[#707085] hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
          
          <button
            onClick={() => {
              setEditingCountdowns([
                ...editingCountdowns, 
                { id: Date.now(), examName: 'New Exam', examDate: new Date().toISOString().split('T')[0], color: '#ffffff' }
              ]);
            }}
            className="w-full py-2 border border-dashed border-white/20 rounded-xl text-xs text-[#707085] hover:text-white hover:border-white/40 transition-colors flex items-center justify-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Exam</span>
          </button>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => setShowEditCountdownsModal(false)}
              className="flex-1 py-2.5 bg-[#1a1a1a] text-white font-bold rounded-[14px] hover:bg-[#222222] transition-colors text-xs"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setCountdowns(editingCountdowns);
                setShowEditCountdownsModal(false);
              }}
              className="flex-1 py-2.5 bg-[#a855f7] text-white font-bold rounded-[14px] hover:bg-[#9333ea] transition-all text-xs shadow-lg shadow-[#a855f7]/20"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Metrics Modal */}
      <Modal
        isOpen={isEditMetricsOpen}
        onClose={() => setIsEditMetricsOpen(false)}
        title="Edit Today's Metrics"
      >
        <form onSubmit={handleSaveMetrics} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#707085] mb-1 font-medium">Study Hours Today</label>
            <input
              type="number"
              step="0.1"
              required
              value={editHours}
              onChange={(e) => setEditHours(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#222222] rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#a855f7]"
            />
          </div>
          <div>
            <label className="block text-[#707085] mb-1 font-medium">Questions Solved Today</label>
            <input
              type="number"
              required
              value={editQuestions}
              onChange={(e) => setEditQuestions(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#222222] rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#a855f7]"
            />
          </div>
          <div>
            <label className="block text-[#707085] mb-1 font-medium">Accuracy (%) Today</label>
            <input
              type="number"
              step="0.1"
              required
              value={editAccuracy}
              onChange={(e) => setEditAccuracy(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#222222] rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#a855f7]"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-3 border-t border-[#222222]">
            <button
              type="button"
              onClick={() => setIsEditMetricsOpen(false)}
              className="px-4 py-2 text-[#707085] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#a855f7] text-white font-bold rounded-xl hover:bg-[#9333ea] transition-colors"
            >
              Save Metrics
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

