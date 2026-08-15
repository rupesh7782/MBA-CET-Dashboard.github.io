import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Play, Pause, RotateCcw,
  Flame, Target, Crown, Camera
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentStreak, 
    userProfile, 
    setIsProfileModalOpen
  } = useApp();

  // Timer State (live timer) with localStorage persistence
  const [timerSeconds, setTimerSeconds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('mba_cet_study_timer_secs');
      return saved !== null ? Number(saved) : 13512;
    } catch (e) {
      return 13512;
    }
  });
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('mba_cet_study_timer_running');
      return saved !== null ? JSON.parse(saved) : false;
    } catch (e) {
      return false;
    }
  });
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    try {
      localStorage.setItem('mba_cet_study_timer_secs', timerSeconds.toString());
      localStorage.setItem('mba_cet_study_timer_running', JSON.stringify(isTimerRunning));
    } catch (e) {}
  }, [timerSeconds, isTimerRunning]);

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(0);
  };

  // Live Time clock
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // Live Timer increment
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600).toString().padStart(2, '0');
    const mins = Math.floor((totalSecs % 3600) / 60).toString().padStart(2, '0');
    const secs = (totalSecs % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <header className="px-4 lg:px-6 py-1.5 bg-black border-b border-[#EAB308]/20 sticky top-0 z-20 shadow-xl">
      <div className="flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
        
        {/* Left Section: JBIMS 2027 Title */}
        <div className="flex items-center space-x-3 sm:space-x-4 flex-shrink-0">
          <div>
            <h1 className="text-xl lg:text-2xl font-black text-[#EAB308] tracking-wider uppercase leading-tight">
              MISSION <span className="text-white">JBIMS 2027</span>
            </h1>
            <p className="text-xs text-gray-300 font-medium mt-0.5">
              The Journey from <span className="text-[#EAB308] font-bold">68</span> → <span className="text-[#EAB308] font-bold">91.23</span> → <span className="text-[#EAB308] font-bold">99.99</span> Percentile
            </p>
          </div>
        </div>

        {/* Center / Middle Badges: Target + Streak + Timer + Cloud Sync */}
        <div className="flex items-center space-x-2.5 lg:space-x-4 flex-shrink-0">
          
          {/* Target Card */}
          <div className="flex items-center space-x-2.5 bg-[#0a0a0a] border border-[#EAB308]/50 px-3 py-1.5 rounded-xl shadow-inner">
            <div className="flex items-center space-x-1 text-[#EAB308] text-[10px] font-black uppercase tracking-widest">
              <Target className="w-3.5 h-3.5 text-[#EAB308]" />
              <span>TARGET</span>
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="text-lg lg:text-xl font-black text-[#EAB308] leading-none">99.99</span>
              <span className="text-xs font-bold text-[#EAB308]/90">Percentile</span>
            </div>
          </div>

          {/* Current Streak */}
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-[10px] text-gray-400 font-medium leading-none">Current Streak</span>
            <div className="flex items-center space-x-1 mt-0.5">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span className="text-xs font-extrabold text-white">{currentStreak} {currentStreak === 1 ? 'Day' : 'Days'}</span>
            </div>
          </div>

          <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />

          {/* Study Timer */}
          <div className="hidden sm:flex items-center space-x-2">
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-gray-400 font-medium leading-none">Study Timer</span>
              <span className="text-xs font-mono font-bold text-white mt-0.5">
                {formatTimer(timerSeconds)}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsTimerRunning(prev => !prev)}
                className="p-1.5 rounded-full bg-[#EAB308]/20 text-[#EAB308] hover:bg-[#EAB308] hover:text-black transition-all cursor-pointer border border-[#EAB308]/30"
                title={isTimerRunning ? "Pause Timer" : "Start Study Timer"}
              >
                {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              </button>
              <button
                onClick={resetTimer}
                className="p-1.5 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer border border-white/10"
                title="Reset Study Timer to 00:00:00"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="h-6 w-[1px] bg-white/10 hidden xl:block" />

          {/* Date & Time Display */}
          <div className="hidden xl:flex flex-col text-right text-xs leading-tight">
            <span className="font-bold text-white">
              {currentTime.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
            <div className="flex items-center justify-end space-x-1 text-[10px] text-gray-400">
              <span>{currentTime.toLocaleDateString('en-GB', { weekday: 'long' })}</span>
              <span>•</span>
              <span className="font-mono text-gray-200">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

        </div>

        {/* Right Section: User Profile */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          
          {/* User Profile Card */}
          <button 
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center space-x-2.5 p-1.5 rounded-xl hover:bg-white/5 transition-all group cursor-pointer text-left"
            title="Click to change profile picture & details"
          >
            {/* Avatar with Crown Badge & Camera Hover Overlay */}
            <div className="relative w-9 h-9 rounded-full border-2 border-[#EAB308] overflow-visible flex-shrink-0">
              <img 
                src={userProfile.avatarUrl} 
                alt={userProfile.name} 
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Camera className="w-4 h-4 text-[#EAB308]" />
              </div>
              <div className="absolute -top-2 -right-1 bg-[#EAB308] text-black p-0.5 rounded-full shadow-md">
                <Crown className="w-3 h-3 fill-current" />
              </div>
            </div>

            <div className="hidden xl:flex flex-col text-left leading-tight">
              <span className="font-bold text-white text-xs group-hover:text-[#EAB308] transition-colors">{userProfile.name}</span>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className="text-[9px] text-gray-400">Mission Status</span>
                <span className="bg-emerald-950 text-emerald-400 border border-emerald-500/40 px-1.5 py-0.2 rounded text-[8px] font-extrabold uppercase">
                  IN PROGRESS
                </span>
              </div>
            </div>
          </button>

        </div>

      </div>
    </header>
  );
};
