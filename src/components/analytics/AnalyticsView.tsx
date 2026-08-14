import React from 'react';
import { useApp } from '../../context/AppContext';
import { LineChart as ReLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { LineChart, Sparkles, TrendingUp, AlertTriangle, CheckCircle2, Target } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { mockTests, sectionalTests } = useApp();

  const completedMocks = mockTests.filter(m => m.status === 'Completed');

  // Compute average scores per subject across completed mocks
  const avgVarc = completedMocks.length > 0 
    ? Math.round(completedMocks.reduce((acc, m) => acc + m.varcScore, 0) / completedMocks.length) 
    : 38;
  const avgLrdi = completedMocks.length > 0 
    ? Math.round(completedMocks.reduce((acc, m) => acc + m.lrdiScore, 0) / completedMocks.length) 
    : 50;
  const avgAr = completedMocks.length > 0 
    ? Math.round(completedMocks.reduce((acc, m) => acc + m.arScore, 0) / completedMocks.length) 
    : 40;
  const avgQuant = completedMocks.length > 0 
    ? Math.round(completedMocks.reduce((acc, m) => acc + m.quantScore, 0) / completedMocks.length) 
    : 35;

  const subjectStrengths = [
    { subject: 'LRDI', max: 75, avg: avgLrdi, pct: Math.round((avgLrdi / 75) * 100), status: 'Strong' },
    { subject: 'Abstract Reasoning (AR)', max: 25, avg: avgAr, pct: Math.round((avgAr / 25) * 100), status: 'Strong' },
    { subject: 'VARC', max: 50, avg: avgVarc, pct: Math.round((avgVarc / 50) * 100), status: 'Moderate' },
    { subject: 'Quant', max: 50, avg: avgQuant, pct: Math.round((avgQuant / 50) * 100), status: 'Weak' },
  ];

  // Chart Data
  const trendData = completedMocks.map(m => ({
    name: m.name.replace('MBA CET Mock Test ', 'M'),
    score: m.totalScore,
    percentile: m.percentile,
    accuracy: m.accuracy,
  })).reverse();

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-[22px] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
            <LineChart className="w-5 h-5 text-[#FF7A00]" />
            <span>AI CET Analytics & Performance Trends</span>
          </h2>
          <p className="text-xs text-[#A9A9A9] mt-1">
            Real-time score trajectory, weak areas, and targeted improvement suggestions
          </p>
        </div>

        <span className="text-xs font-bold text-[#38E27A] bg-[#38E27A]/10 px-3 py-1.5 rounded-full border border-[#38E27A]/20">
          Target Percentile: 99.85%ile
        </span>
      </div>

      {/* Weak vs Strong Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {subjectStrengths.map(s => (
          <div key={s.subject} className="bg-[#0a0a0a] border border-white/5 rounded-[22px] p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">{s.subject}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                s.status === 'Strong' ? 'bg-[#38E27A]/20 text-[#38E27A]' :
                s.status === 'Moderate' ? 'bg-[#F4B400]/20 text-[#F4B400]' :
                'bg-[#FF5A5A]/20 text-[#FF5A5A]'
              }`}>
                {s.status}
              </span>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-extrabold text-white">{s.avg}</span>
              <span className="text-xs text-[#707070]">/{s.max} Avg Score</span>
            </div>
            <div className="w-full bg-[#262626] h-2 rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ${
                  s.status === 'Strong' ? 'bg-[#38E27A]' : s.status === 'Moderate' ? 'bg-[#F4B400]' : 'bg-[#FF5A5A]'
                }`}
                style={{ width: `${s.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Percentile Trajectory Graph */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-[22px] p-6">
        <h3 className="text-base font-bold text-white mb-4">Mock Percentile Trajectory</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorPercentile" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF7A00" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#FF7A00" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="name" stroke="#707070" fontSize={11} />
              <YAxis stroke="#707070" fontSize={11} domain={[50, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#111111', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }} />
              <Area type="monotone" dataKey="percentile" stroke="#FF7A00" strokeWidth={3} fillOpacity={1} fill="url(#colorPercentile)" name="Percentile" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Smart CET Action Plan Suggestions */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-[22px] p-6">
        <h3 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-[#FF7A00]" />
          <span>AI CET Improvement Action Items</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-[#141414]/70 rounded-[18px] border border-white/5">
            <div className="flex items-center space-x-2 text-[#FF5A5A] font-bold mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span>Quant Speed Bottleneck</span>
            </div>
            <p className="text-[#A9A9A9] leading-relaxed">
              Your average Quant score is 35/50. Dedicate 45 minutes daily to Time-Speed-Distance and Modern Maths formulas.
            </p>
          </div>

          <div className="p-4 bg-[#141414]/70 rounded-[18px] border border-white/5">
            <div className="flex items-center space-x-2 text-[#38E27A] font-bold mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>LRDI Matrix Mastery</span>
            </div>
            <p className="text-[#A9A9A9] leading-relaxed">
              You excel in circular arrangements with 88% accuracy. Keep attempting 3 high-level puzzle sets daily.
            </p>
          </div>

          <div className="p-4 bg-[#141414]/70 rounded-[18px] border border-white/5">
            <div className="flex items-center space-x-2 text-[#FFB547] font-bold mb-1">
              <Target className="w-4 h-4" />
              <span>VARC Tone Accuracy</span>
            </div>
            <p className="text-[#A9A9A9] leading-relaxed">
              Eliminate extreme tone options in RC passages to boost accuracy from 78% to 85%+.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
