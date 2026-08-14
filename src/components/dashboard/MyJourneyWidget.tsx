import React, { useState } from 'react';
import { Castle } from 'lucide-react';

export const MyJourneyWidget: React.FC = () => {
  const [customImage] = useState<string | null>(() => {
    try {
      return localStorage.getItem('my_journey_custom_image');
    } catch (e) {
      return null;
    }
  });

  return (
    <div className="relative w-full rounded-[24px] overflow-hidden border border-amber-500/30 shadow-2xl mb-6 bg-black group">
      {/* CUSTOM UPLOADED IMAGE MODE */}
      {customImage ? (
        <div className="relative w-full overflow-hidden rounded-[24px]">
          <img
            src={customImage}
            alt="My Journey"
            className="w-full h-auto object-contain max-h-[700px] mx-auto rounded-[24px]"
          />
        </div>
      ) : (
        /* DEFAULT HIGH-FIDELITY DESIGN MODE */
        <div className="relative">
          {/* Background Image */}
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-700"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=1920")',
              filter: 'brightness(0.38) contrast(1.25) saturate(1.1)'
            }}
          />
          
          {/* Dark gradient vignettes */}
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/40 to-black/85" />
          <div className="absolute inset-0 z-0 bg-radial from-transparent via-black/40 to-black/90 pointer-events-none" />

          {/* Content Container */}
          <div className="relative z-10 p-6 md:p-8 flex flex-col min-h-[520px] justify-between">
            
            {/* Header */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Castle className="w-5 h-5 stroke-[2.5]" />
              </div>
              <h2 className="text-lg font-black text-white tracking-widest uppercase">My Journey</h2>
            </div>

            {/* Timeline Layout */}
            <div className="relative flex flex-col md:flex-row items-center md:items-start justify-between w-full pt-2">
              
              {/* Connector Arrows Overlay (Desktop SVG) */}
              <svg className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible" viewBox="0 0 1000 400">
                <defs>
                  <linearGradient id="blueToCyan" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0088ff" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#00f2ff" stopOpacity="0.9" />
                  </linearGradient>
                  <linearGradient id="greenToGold" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00e640" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#ffc800" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#ffe600" stopOpacity="1" />
                  </linearGradient>
                  <filter id="glowBlue" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <filter id="glowGold" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Line 1: Node 1 to Node 2 */}
                <line 
                  x1="220" y1="125" 
                  x2="420" y2="125" 
                  stroke="url(#blueToCyan)" 
                  strokeWidth="3.5" 
                  filter="url(#glowBlue)" 
                />
                <path 
                  d="M 412 118 L 428 125 L 412 132 Z" 
                  fill="#00f2ff" 
                  filter="url(#glowBlue)" 
                />

                {/* Line 2: Node 2 to Node 3 (Golden Diagonal Arrow) */}
                <line 
                  x1="570" y1="210" 
                  x2="950" y2="25" 
                  stroke="url(#greenToGold)" 
                  strokeWidth="5" 
                  filter="url(#glowGold)" 
                />
                <path 
                  d="M 920 20 L 960 18 L 948 55" 
                  stroke="#ffe600" 
                  strokeWidth="5" 
                  fill="none" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  filter="url(#glowGold)" 
                />
                <circle cx="960" cy="18" r="8" fill="#ffffff" filter="url(#glowGold)" />
              </svg>
              
              {/* STEP 1: 2025 ATTEMPT 1 */}
              <div className="flex flex-col items-center z-10 w-full md:w-1/3 mb-10 md:mb-0 relative group">
                <div className="text-center mb-3">
                  <h3 className="text-xl font-black text-white tracking-wide">2025</h3>
                  <p className="text-xs text-slate-300 font-semibold tracking-wide">Attempt 1</p>
                </div>
                
                <div className="w-32 h-32 rounded-full border-[3px] border-[#0088ff] shadow-[0_0_30px_rgba(0,136,255,0.7),inset_0_0_15px_rgba(0,136,255,0.3)] flex flex-col items-center justify-center bg-black/70 backdrop-blur-md mb-5 transition-transform duration-300 group-hover:scale-105">
                  <span className="text-4xl font-black text-white leading-none">68</span>
                  <span className="text-[11px] text-gray-200 font-medium mt-1">Percentile</span>
                </div>
                
                <div className="w-20 h-[1px] bg-[#0088ff]/40 mb-4" />

                <ul className="text-xs sm:text-sm text-slate-100 space-y-1.5 text-left font-medium pl-6 md:pl-0 list-disc marker:text-[#0088ff]">
                  <li>No Strategy</li>
                  <li>Low Practice</li>
                  <li>Weak QA</li>
                  <li>Poor Time Mgmt.</li>
                  <li>English Slow</li>
                </ul>
              </div>

              {/* STEP 2: 2026 ATTEMPT 2 */}
              <div className="flex flex-col items-center z-10 w-full md:w-1/3 mb-10 md:mb-0 relative group">
                <div className="text-center mb-3">
                  <h3 className="text-xl font-black text-white tracking-wide">2026</h3>
                  <p className="text-xs text-slate-300 font-semibold tracking-wide">Attempt 2</p>
                </div>
                
                <div className="w-36 h-36 rounded-full border-[3px] border-[#00e640] shadow-[0_0_35px_rgba(0,230,64,0.8),inset_0_0_20px_rgba(0,230,64,0.3)] flex flex-col items-center justify-center bg-black/70 backdrop-blur-md mb-5 transition-transform duration-300 group-hover:scale-105">
                  <span className="text-[42px] font-black text-white leading-none tracking-tight">91.23</span>
                  <span className="text-[11px] text-gray-200 font-medium mt-1">Percentile</span>
                </div>

                <div className="w-20 h-[1px] bg-[#00e640]/40 mb-4" />
                
                <ul className="text-xs sm:text-sm text-slate-100 space-y-1.5 text-left font-medium pl-6 md:pl-0 list-disc marker:text-[#00e640]">
                  <li>Better Accuracy</li>
                  <li>More Practice</li>
                  <li>Good LR</li>
                  <li className="leading-snug">
                    Still Weak in<br/>
                    <span className="text-slate-200">Arithmetic</span><br/>
                    <span className="text-slate-200">Geometry</span><br/>
                    <span className="text-slate-200">Time Pressure</span>
                  </li>
                </ul>
              </div>

              {/* STEP 3: 2027 MISSION */}
              <div className="flex flex-col items-center z-10 w-full md:w-1/3 relative group">
                <div className="text-center mb-3">
                  <h3 className="text-xl font-black text-white tracking-wide">2027</h3>
                  <p className="text-xs text-[#ffc800] font-black tracking-widest uppercase drop-shadow-[0_0_10px_rgba(255,200,0,0.8)]">
                    MISSION
                  </p>
                </div>
                
                <div className="relative">
                  <div className="w-40 h-40 rounded-full border-[4px] border-[#ffc800] shadow-[0_0_45px_rgba(255,200,0,0.95),0_0_80px_rgba(255,200,0,0.4),inset_0_0_25px_rgba(255,200,0,0.4)] flex flex-col items-center justify-center bg-[#ffc800]/10 backdrop-blur-md mb-4 transition-transform duration-300 group-hover:scale-105">
                    <span className="text-5xl font-black text-white leading-none tracking-tight">99.99</span>
                    <span className="text-xs text-[#ffc800] font-bold mt-1">Percentile</span>
                  </div>
                </div>
                
                <div className="text-center mt-3">
                  <p className="text-xs text-slate-300 font-semibold uppercase tracking-wider">Status</p>
                  <p className="text-lg text-[#ffc800] font-black tracking-widest mt-0.5 drop-shadow-[0_0_12px_rgba(255,200,0,0.8)]">
                    PREPARING...
                  </p>
                </div>
              </div>
              
            </div>

            {/* Footer Tagline */}
            <div className="mt-10 text-center border-t border-amber-500/20 pt-5">
              <p className="text-xl sm:text-2xl font-black text-[#ffc800] tracking-wide" style={{ textShadow: '0 2px 14px rgba(0,0,0,0.9), 0 0 10px rgba(255,200,0,0.4)' }}>
                One Attempt. One Dream. One College.
              </p>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
};


