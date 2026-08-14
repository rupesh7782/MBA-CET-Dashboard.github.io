cat src/components/motivation/MotivationView.tsx | sed -n '1,507p' > temp.tsx
cat << 'INNER_EOF' >> temp.tsx
      <div 
        className="border border-amber-500/40 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl shadow-amber-500/10 min-h-[600px] flex flex-col justify-between"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
          backgroundColor: 'rgba(0,0,0,0.7)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-[#0a0a14]/80 z-0 pointer-events-none" />
        <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none" />

        {/* Card Header */}
        <div className="relative z-10 flex items-center justify-between mb-12 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/20 rounded-xl border border-amber-500/40 text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white tracking-wider flex items-center space-x-2">
                <span>MY JOURNEY</span>
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsEditJourneyOpen(true)}
              className="px-3 py-1.5 bg-[#121212]/80 backdrop-blur hover:bg-[#222222] text-slate-300 text-xs font-bold rounded-xl border border-[#222222] flex items-center space-x-1.5 transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Milestones</span>
            </button>

            <button
              onClick={() => downloadPosterPNG('journey')}
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-xl flex items-center space-x-1.5 shadow-md shadow-amber-500/20 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Journey 4K</span>
            </button>
          </div>
        </div>

        {/* Main Roadmap Diagram Grid */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-start flex-1">
          
          {/* STEP 1: ATTEMPT 1 */}
          <div className="relative flex flex-col items-center text-center group mt-20 md:mt-32 z-10">
            <div className="text-xl text-white drop-shadow-md mb-2">
              <span className="font-bold">{journeyData.attempt1Year}</span><br/>
              <span className="text-gray-200">{journeyData.attempt1Title}</span>
            </div>

            {/* Blue Percentile Circle */}
            <div className="w-36 h-36 rounded-full border-[3px] border-[#3b82f6] flex flex-col items-center justify-center bg-black/40 shadow-[0_0_30px_rgba(59,130,246,0.3)] backdrop-blur-md relative group-hover:scale-105 transition-transform">
              <span className="text-5xl font-semibold text-white">{journeyData.attempt1Score}</span>
              <span className="text-sm font-medium text-white tracking-wide mt-1">Percentile</span>
            </div>

            {/* Connecting Line 1 */}
            <div className="hidden md:flex absolute top-[135px] left-[75%] w-[50%] h-[2px] bg-gradient-to-r from-[#3b82f6] to-[#22c55e] z-[-1] items-center justify-center">
               <div className="w-2 h-2 bg-[#3b82f6] rotate-45" />
            </div>

            {/* Bullets List */}
            <ul className="text-left text-sm text-gray-200 space-y-2 mt-6 drop-shadow-md font-medium">
              {journeyData.attempt1Bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* STEP 2: ATTEMPT 2 */}
          <div className="relative flex flex-col items-center text-center group mt-20 md:mt-32 z-10">
            <div className="text-xl text-white drop-shadow-md mb-2">
              <span className="font-bold">{journeyData.attempt2Year}</span><br/>
              <span className="text-gray-200">{journeyData.attempt2Title}</span>
            </div>

            {/* Green Percentile Circle */}
            <div className="w-36 h-36 rounded-full border-[3px] border-[#22c55e] flex flex-col items-center justify-center bg-black/40 shadow-[0_0_30px_rgba(34,197,94,0.3)] backdrop-blur-md relative group-hover:scale-105 transition-transform">
              <span className="text-5xl font-semibold text-white">{journeyData.attempt2Score}</span>
              <span className="text-sm font-medium text-white tracking-wide mt-1">Percentile</span>
            </div>

            {/* Connecting Line 2 */}
            <div className="hidden md:block absolute top-[135px] left-[75%] w-[80%] h-[2px] bg-gradient-to-r from-[#22c55e] to-[#fbbf24] origin-left -rotate-12 z-[-1]" />

            {/* Bullets List */}
            <ul className="text-left text-sm text-gray-200 space-y-2 mt-6 drop-shadow-md font-medium">
              {journeyData.attempt2Bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* STEP 3: MISSION */}
          <div className="relative flex flex-col items-center text-center group mt-8 md:mt-4 z-10">
            <div className="text-xl text-[#fef3c7] drop-shadow-[0_0_10px_rgba(251,191,36,0.5)] mb-2">
              <span className="font-bold">{journeyData.targetYear}</span><br/>
              <span className="font-bold">{journeyData.targetTitle}</span>
            </div>

            {/* Glowing Golden Target Circle */}
            <div className="w-44 h-44 rounded-full border-[4px] border-[#fbbf24] flex flex-col items-center justify-center bg-black/40 shadow-[0_0_50px_rgba(251,191,36,0.6)] backdrop-blur-md relative group-hover:scale-105 transition-transform">
              <span className="text-6xl font-black text-white drop-shadow-[0_0_15px_rgba(251,191,36,1)]">
                {journeyData.targetScore}
              </span>
              <span className="text-sm font-semibold text-white mt-1">Percentile</span>
              
              {/* Upward Curve Arrow */}
              <div className="absolute -top-16 -right-16 w-32 h-32 border-r-[4px] border-t-[4px] border-[#fbbf24] rounded-tr-full drop-shadow-[0_0_10px_rgba(251,191,36,0.8)] opacity-90" />
              <div className="absolute -top-20 -right-20">
                <ArrowUpRight className="w-12 h-12 text-[#fbbf24] drop-shadow-[0_0_15px_rgba(251,191,36,1)] stroke-[3]" />
              </div>
            </div>

            <div className="pt-8 text-center">
              <span className="text-lg text-white block font-medium">Status</span>
              <span className="text-[#fbbf24] font-bold text-2xl tracking-widest drop-shadow-md">
                {journeyData.targetStatus}
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Banner Tagline */}
        <div className="relative z-10 mt-12 text-center pb-4">
          <p className="text-xl sm:text-2xl font-bold text-[#fbbf24] tracking-wide drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]">
            {journeyData.tagline}
          </p>
        </div>

      </div>
INNER_EOF
cat src/components/motivation/MotivationView.tsx | sed -n '637,$p' >> temp.tsx
mv temp.tsx src/components/motivation/MotivationView.tsx
