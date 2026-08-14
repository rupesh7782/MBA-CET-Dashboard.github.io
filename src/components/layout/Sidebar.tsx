import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, Timer, FileText, FolderArchive, 
  Newspaper, Type, Calculator, FileSpreadsheet, 
  ListCheck, LineChart, Target, CalendarCheck, 
  Award, Lock, Settings, GraduationCap, ChevronLeft, 
  ChevronRight, ChevronDown, Folder, MoreVertical, Flame, Sparkles
} from 'lucide-react';

const AaIcon = ({ className }: { className?: string }) => (
  <span className={`font-bold text-[13px] tracking-tight leading-none flex items-center justify-center font-sans ${className || ''}`}>
    Aa
  </span>
);

export type NavItem = {
  name: string;
  icon: any;
  labelOverride?: string;
  hasSubItems?: boolean;
  subItems?: { name: string; icon?: any }[];
};

export const navigationItems: NavItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'Motivation', icon: Flame },
  { name: 'Study Timer', icon: Timer },
  { name: 'Notes', icon: FileText },
  { name: 'PDF Library', icon: FolderArchive },
  { name: 'Reading Material', icon: Newspaper },
  { name: 'Vocabulary', icon: AaIcon },
  { name: 'Formula Book', icon: Calculator },
  { name: 'Mock Tests', icon: FileSpreadsheet },
  { name: 'Sectional Tests', icon: ListCheck },
  { name: 'Analytics', icon: LineChart },
  { name: 'Goals', icon: Target },
  { name: 'Habits', icon: CalendarCheck },
  { name: 'Achievements', icon: Award },
  { name: 'Vault', icon: Lock },
  { name: 'Settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, isSidebarCollapsed, setIsSidebarCollapsed, userProfile, setIsProfileModalOpen } = useApp();


  return (
    <aside 
      className={`relative h-full overflow-hidden bg-black border-r border-white/10 flex flex-col transition-all duration-300 ease-in-out z-30 select-none ${
        isSidebarCollapsed ? 'w-20' : 'w-[224px]'
      }`}
    >
      {/* Header Logo */}
      <div className="h-[61px] px-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center space-x-3 overflow-hidden">
          {/* Gold JBIMS Heritage Dome Logo */}
          <div className="flex-shrink-0 flex items-center justify-center text-[#f59e0b] drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]">
            <svg 
              className="w-8 h-8" 
              viewBox="0 0 32 32" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Roof / Pediment */}
              <path 
                d="M16 3L3 12H29L16 3Z" 
                fill="#f59e0b" 
                stroke="#fbbf24" 
                strokeWidth="1.5" 
                strokeLinejoin="round" 
              />
              {/* Arch Window inside pediment */}
              <path 
                d="M16 7.5C14.8954 7.5 14 8.39543 14 9.5H18C18 8.39543 17.1046 7.5 16 7.5Z" 
                fill="#000000" 
              />
              {/* Entablature beam */}
              <rect x="4" y="12" width="24" height="2" fill="#f59e0b" />
              {/* 4 Pillars / Columns */}
              <rect x="6" y="15" width="2.5" height="9" rx="0.5" fill="#f59e0b" />
              <rect x="11.5" y="15" width="2.5" height="9" rx="0.5" fill="#f59e0b" />
              <rect x="18" y="15" width="2.5" height="9" rx="0.5" fill="#f59e0b" />
              <rect x="23.5" y="15" width="2.5" height="9" rx="0.5" fill="#f59e0b" />
              {/* Base pedestal steps */}
              <rect x="4" y="24" width="24" height="2" fill="#f59e0b" />
              <rect x="2" y="26.5" width="28" height="2.5" rx="0.5" fill="#fbbf24" />
            </svg>
          </div>

          {!isSidebarCollapsed && (
            <div className="flex flex-col justify-center leading-none select-none">
              <span className="text-[11px] font-black tracking-widest text-[#f59e0b] uppercase">
                MISSION
              </span>
              <span className="text-base font-black tracking-wider text-white mt-0.5">
                JBIMS 2027
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-2 px-2.5 space-y-0.5">
        {navigationItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;

          return (
            <div key={item.name}>
              <button
                onClick={() => setActiveTab(item.name)}
                id={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                className={`w-full flex items-center justify-between ${
                  isSidebarCollapsed ? 'justify-center px-2' : 'px-3'
                } py-2 rounded-xl text-xs font-medium transition-all duration-200 group relative ${
                  isActive 
                    ? 'bg-[#141414] text-white font-semibold border border-white/10' 
                    : 'text-[#9494ad] hover:text-white hover:bg-[#0f0f0f]'
                }`}
              >
                <div className="flex items-center space-x-3 truncate">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 flex-shrink-0 ${
                    isActive ? 'text-[#f97316]' : 'text-[#707085] group-hover:text-white'
                  }`} />

                  {!isSidebarCollapsed && (
                    <span className="truncate">{item.labelOverride || item.name}</span>
                  )}
                </div>



                {/* Active Bar Indicator */}
                {isActive && (
                  <div className="absolute right-0 top-1.5 bottom-1.5 w-1 bg-[#f97316] rounded-l-full shadow-[0_0_8px_#f97316]" />
                )}

                {/* Tooltip on Collapsed */}
                {isSidebarCollapsed && (
                  <div className="absolute left-full ml-2 px-2.5 py-1 bg-[#0a0a0a] text-white text-xs rounded-md shadow-xl border border-white/10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.labelOverride || item.name}
                  </div>
                )}
              </button>


            </div>
          );
        })}
      </div>

      {/* Footer User Profile Badge */}
      <div className="p-3 border-t border-white/10 bg-black">
        {!isSidebarCollapsed ? (
          <div 
            onClick={() => setIsProfileModalOpen(true)}
            className="p-2.5 bg-[#0a0a0a] border border-white/10 rounded-2xl flex items-center justify-between group cursor-pointer hover:border-[#EAB308]/40 transition-colors"
            title="Click to edit profile picture"
          >
            <div className="flex items-center space-x-2.5 min-w-0">
              <img 
                src={userProfile.avatarUrl} 
                alt={userProfile.name} 
                className="w-8 h-8 rounded-full object-cover border border-[#EAB308]/40 flex-shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-white group-hover:text-[#EAB308] transition-colors truncate leading-tight">{userProfile.name}</p>
                <p className="text-[10px] text-[#707085] truncate mt-0.5">{userProfile.tagline}</p>
              </div>
            </div>
            <button className="text-[#707085] group-hover:text-[#EAB308] p-1 rounded-md transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div 
            onClick={() => setIsProfileModalOpen(true)}
            className="flex justify-center p-1 cursor-pointer"
            title="Click to edit profile picture"
          >
            <img 
              src={userProfile.avatarUrl} 
              alt={userProfile.name} 
              className="w-8 h-8 rounded-full object-cover border border-[#EAB308]/40 hover:scale-105 transition-transform"
              referrerPolicy="no-referrer"
            />
          </div>
        )}
      </div>
    </aside>
  );
};

