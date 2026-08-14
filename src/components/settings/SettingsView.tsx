import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, User, Download, Upload, RefreshCw, Save, Flame, RotateCcw, Cloud, ShieldCheck, Database } from 'lucide-react';
import toast from 'react-hot-toast';

export const SettingsView: React.FC = () => {
  const { 
    examConfig, 
    updateExamConfig, 
    currentStreak, 
    resetStreak, 
    resetAllData, 
    exportData, 
    importData,
    currentUser,
    isCloudSyncing,
    lastSyncedAt,
    setIsSyncModalOpen,
    syncToCloudNow
  } = useApp();

  const [name, setName] = useState(examConfig.examName);
  const [targetPercentile, setTargetPercentile] = useState(examConfig.targetPercentile);
  const [examDate, setExamDate] = useState(examConfig.examDate);
  const [dailyGoalHours, setDailyGoalHours] = useState(examConfig.dailyStudyGoalHours);

  // Streak State
  const todayStr = new Date().toISOString().split('T')[0];
  const [streakResetDate, setStreakResetDate] = useState(examConfig.streakResetDate || todayStr);
  const [newStreakCount, setNewStreakCount] = useState<number>(currentStreak);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateExamConfig({
      examName: name,
      targetPercentile,
      examDate,
      dailyStudyGoalHours: dailyGoalHours,
    });
    toast.success('Profile settings updated successfully!');
  };

  const handleStreakSave = (e: React.FormEvent) => {
    e.preventDefault();
    resetStreak(streakResetDate, newStreakCount);
  };

  const handleQuickResetToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setStreakResetDate(today);
    setNewStreakCount(0);
    resetStreak(today, 0);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonStr = event.target?.result as string;
        importData(jsonStr);
      } catch (err) {
        toast.error('Invalid backup JSON file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Banner */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-[22px] p-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
            <Settings className="w-5 h-5 text-[#FF7A00]" />
            <span>System Settings & Cloud Database</span>
          </h2>
          <p className="text-xs text-[#A9A9A9] mt-1">
            Configure online Firestore synchronization, target exam settings, and backups
          </p>
        </div>
      </div>

      {/* Cloud Firestore Online Database Section */}
      <div className="bg-[#0a0a0a] border border-amber-500/30 rounded-[22px] p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Firebase Cloud Database Sync</span>
                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                  currentUser 
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                    : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                }`}>
                  {currentUser ? 'Active Cloud Link' : 'Offline / Standalone'}
                </span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Automatically pushes all mock tests, notes, formulas, and study sessions to Firestore online.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSyncModalOpen(true)}
            className="px-4 py-2 bg-amber-500 text-black hover:bg-amber-400 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-lg shadow-amber-500/10 self-start sm:self-auto"
          >
            <Cloud className="w-4 h-4" />
            <span>{currentUser ? 'Manage Cloud Account' : 'Connect Cloud Database'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
          <div className="bg-[#111111] p-3.5 rounded-xl border border-white/5 flex flex-col justify-between">
            <span className="text-gray-400">Account Status:</span>
            <span className="text-white font-semibold mt-1">
              {currentUser 
                ? (currentUser.displayName || (currentUser.isAnonymous ? 'Guest User (Cloud Synced)' : currentUser.email)) 
                : 'Not signed in (Local Storage only)'}
            </span>
          </div>

          <div className="bg-[#111111] p-3.5 rounded-xl border border-white/5 flex flex-col justify-between">
            <span className="text-gray-400">Last Real-time Firestore Sync:</span>
            <span className="text-emerald-400 font-mono font-semibold mt-1">
              {lastSyncedAt ? new Date(lastSyncedAt).toLocaleString() : 'Never synced'}
            </span>
          </div>
        </div>

        {currentUser && (
          <div className="flex justify-end pt-2">
            <button
              onClick={syncToCloudNow}
              disabled={isCloudSyncing}
              className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl text-xs flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCloudSyncing ? 'animate-spin' : ''}`} />
              <span>{isCloudSyncing ? 'Syncing to Cloud...' : 'Force Sync to Firestore Now'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Profile Form */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-[22px] p-6">
        <h3 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
          <User className="w-4 h-4 text-[#FF7A00]" />
          <span>Aspirant Profile Parameters</span>
        </h3>

        <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#A9A9A9] mb-1 font-medium">Aspirant Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2.5 text-white"
              />
            </div>

            <div>
              <label className="block text-[#A9A9A9] mb-1 font-medium">Target B-School</label>
              <input
                type="text"
                required
                value="JBIMS Mumbai / SIMSREE"
                readOnly
                className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2.5 text-white/70 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-[#A9A9A9] mb-1 font-medium">Target Percentile (%ile)</label>
              <input
                type="number"
                step="0.01"
                required
                value={targetPercentile}
                onChange={(e) => setTargetPercentile(Number(e.target.value))}
                className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2.5 text-white"
              />
            </div>

            <div>
              <label className="block text-[#A9A9A9] mb-1 font-medium">Exam Target Date</label>
              <input
                type="date"
                required
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2.5 text-white"
              />
            </div>

            <div>
              <label className="block text-[#A9A9A9] mb-1 font-medium">Daily Study Hours Goal</label>
              <input
                type="number"
                required
                value={dailyGoalHours}
                onChange={(e) => setDailyGoalHours(Number(e.target.value))}
                className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2.5 text-white"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#FF7A00] text-black font-bold rounded-[14px] text-xs hover:bg-[#FFB547] flex items-center space-x-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* Streak Reset & Management Section */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-[22px] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
              <span>Current Study Streak Management</span>
            </h3>
            <p className="text-xs text-[#A9A9A9] mt-0.5">
              Reset or adjust your active study streak counter and choose a reset/start date
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-orange-500/10 border border-orange-500/30 px-3.5 py-1.5 rounded-full self-start sm:self-auto">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span className="text-xs font-black text-orange-400">
              Active Streak: {currentStreak} {currentStreak === 1 ? 'Day' : 'Days'}
            </span>
          </div>
        </div>

        <form onSubmit={handleStreakSave} className="space-y-4 text-xs pt-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#A9A9A9] mb-1 font-medium flex items-center justify-between">
                <span>Streak Reset / Start Date</span>
                <span className="text-[10px] text-orange-400 font-normal">Date Picker</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={streakResetDate}
                  onChange={(e) => setStreakResetDate(e.target.value)}
                  className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2.5 text-white focus:border-orange-500 focus:outline-none"
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">
                Select the date from which your current study streak is calculated or reset.
              </p>
            </div>

            <div>
              <label className="block text-[#A9A9A9] mb-1 font-medium flex items-center justify-between">
                <span>New Streak Count (Days)</span>
                <span className="text-[10px] text-orange-400 font-normal">Count</span>
              </label>
              <input
                type="number"
                min="0"
                max="999"
                required
                value={newStreakCount}
                onChange={(e) => setNewStreakCount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2.5 text-white focus:border-orange-500 focus:outline-none"
              />
              <p className="text-[10px] text-gray-400 mt-1">
                Enter 0 to completely reset current streak, or enter a custom day count.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleQuickResetToday}
              className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-[14px] text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Streak to 0 Today</span>
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold rounded-[14px] text-xs hover:from-orange-400 hover:to-amber-400 flex items-center space-x-1.5 cursor-pointer shadow-lg transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Streak & Date</span>
            </button>
          </div>
        </form>
      </div>

      {/* JSON Export / Import */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-[22px] p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <Download className="w-4 h-4 text-[#FF7A00]" />
          <span>Manual Offline JSON Backup & Export</span>
        </h3>

        <p className="text-xs text-[#A9A9A9]">
          Export all your study logs, mock scores, flashcards, notes, and habits to a JSON backup file or restore from a previous file.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={exportData}
            className="px-4 py-2.5 bg-[#141414] hover:bg-white/10 border border-white/10 text-white rounded-[14px] text-xs font-bold flex items-center space-x-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#FF7A00]" />
            <span>Export JSON Backup</span>
          </button>

          <label className="px-4 py-2.5 bg-[#141414] hover:bg-white/10 border border-white/10 text-white rounded-[14px] text-xs font-bold flex items-center space-x-2 cursor-pointer">
            <Upload className="w-4 h-4 text-[#38E27A]" />
            <span>Import JSON Backup</span>
            <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
          </label>
        </div>
      </div>

      {/* Reset Data Danger Zone */}
      <div className="bg-[#0a0a0a] border border-[#FF5A5A]/30 rounded-[22px] p-6 space-y-4">
        <h3 className="text-base font-bold text-[#FF5A5A] flex items-center space-x-2">
          <RefreshCw className="w-4 h-4" />
          <span>Danger Zone: Reset System Data</span>
        </h3>

        <p className="text-xs text-[#A9A9A9]">
          Clears all local storage and restores the default seed data. This action cannot be undone.
        </p>

        <button
          onClick={() => {
            if (confirm('Are you sure you want to reset all data to default seed state?')) {
              resetAllData();
            }
          }}
          className="px-4 py-2.5 bg-[#FF5A5A]/20 hover:bg-[#FF5A5A]/30 border border-[#FF5A5A]/40 text-[#FF5A5A] rounded-[14px] text-xs font-bold cursor-pointer"
        >
          Reset All Data to Defaults
        </button>
      </div>
    </div>
  );
};
