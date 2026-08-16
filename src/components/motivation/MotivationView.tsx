import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, Sparkles, Quote as QuoteIcon, RefreshCw, Bookmark, BookmarkCheck, 
  Copy, Download, Share2, Plus, Search, Filter, Play, Pause, Volume2, VolumeX,
  Maximize2, Zap, Trophy, ShieldCheck, Check, ChevronRight, Eye, Star, TrendingUp,
  MapPin, Edit3, ArrowUpRight, Target, Upload, Camera, Building2, BookOpen, Flag
} from 'lucide-react';
import { INITIAL_QUOTES, Quote } from '../../data/quotesData';
import { Modal } from '../common/Modal';
import { MyJourneyWidget } from '../dashboard/MyJourneyWidget';
import { DailyMotivationWidget } from '../dashboard/DailyMotivationWidget';
import toast from 'react-hot-toast';

export const MotivationView: React.FC = () => {
  const DEFAULT_POSTER = `${import.meta.env.BASE_URL}jbims-poster.svg`;

  // Quotes state initialized with INITIAL_QUOTES + any saved custom quotes
  const [allQuotes, setAllQuotes] = useState<Quote[]>(() => {
    try {
      const savedCustom = localStorage.getItem('mba_cet_custom_quotes');
      const customQuotes: Quote[] = savedCustom ? JSON.parse(savedCustom) : [];
      const savedFavs = localStorage.getItem('mba_cet_favorite_quote_ids');
      const favIds: number[] = savedFavs ? JSON.parse(savedFavs) : [];

      const merged = [...customQuotes, ...INITIAL_QUOTES].map(q => ({
        ...q,
        isFavorite: favIds.includes(q.id) || q.isFavorite || false
      }));
      return merged;
    } catch (e) {
      return INITIAL_QUOTES;
    }
  });

  // Daily Quote state
  const [dailyQuote, setDailyQuote] = useState<Quote | null>(() => {
    return INITIAL_QUOTES.find(q => q.id === 20) || INITIAL_QUOTES[0] || null;
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // View mode for JBIMS Poster (Classic vs Enhanced 4K HD vs Gold OLED)
  const [posterTheme, setPosterTheme] = useState<'classic' | '4k' | 'gold_oled'>('4k');
  
  // JBIMS Campus Image state
  const [jbimsImage, setJbimsImage] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('mba_cet_jbims_poster_image');
      if (saved) return saved;
    } catch (e) {}
    return DEFAULT_POSTER;
  });

  const posterFileInputRef = useRef<HTMLInputElement>(null);

  // Compressed image handler to prevent localStorage QuotaExceededError
  const handlePosterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setJbimsImage(compressedDataUrl);
          try {
            localStorage.setItem('mba_cet_jbims_poster_image', compressedDataUrl);
            toast.success('Poster image updated successfully!');
          } catch (err) {
            console.warn('Could not save to localStorage:', err);
            toast.success('Poster updated for this session!');
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleResetPoster = (e: React.MouseEvent) => {
    e.stopPropagation();
    setJbimsImage(DEFAULT_POSTER);
    try {
      localStorage.removeItem('mba_cet_jbims_poster_image');
    } catch (err) {}
    toast.success('Reset to default JBIMS Master Poster');
  };
  
  // Modal for adding new quote
  const [isAddQuoteOpen, setIsAddQuoteOpen] = useState(false);
  const [newQuoteText, setNewQuoteText] = useState('');
  const [newQuoteAuthor, setNewQuoteAuthor] = useState('');
  const [newQuoteCategory, setNewQuoteCategory] = useState<Quote['category']>('JBIMS Mindset');

  // Journey Poster State
  const [journeyData] = useState({
    attempt1Year: '2025',
    attempt1Title: 'Attempt 1',
    attempt1Score: '68',
    attempt1Bullets: ['No Strategy', 'Low Practice', 'Weak QA', 'Poor Time Mgmt.', 'English Slow'],
    attempt2Year: '2026',
    attempt2Title: 'Attempt 2',
    attempt2Score: '91.23',
    attempt2Bullets: ['Better Accuracy', 'More Practice', 'Good LR', 'Still Weak in Arithmetic Geometry Time Pressure'],
    targetYear: '2027',
    targetTitle: 'MISSION',
    targetScore: '99.99',
    targetStatus: 'PREPARING...',
    tagline: 'One Attempt. One Dream. One College.'
  });

  // Time remaining until quote changes
  const [timeUntilTomorrow, setTimeUntilTomorrow] = useState<string>('');

  // Fetch Quotes from Backend Server if available, else keep local store
  useEffect(() => {
    fetchDailyAndAllQuotes();

    // Calculate time until next midnight quote rotation
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diffMs = midnight.getTime() - now.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
      setTimeUntilTomorrow(`${hours.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchDailyAndAllQuotes = async () => {
    try {
      // Try to fetch from backend API if available
      const dailyRes = await fetch('/api/quotes/daily');
      if (dailyRes.ok) {
        const dailyData = await dailyRes.json();
        if (dailyData.dailyQuote) {
          setDailyQuote(dailyData.dailyQuote);
        }
      }

      const allRes = await fetch('/api/quotes');
      if (allRes.ok) {
        const allData = await allRes.json();
        if (allData.data && Array.isArray(allData.data) && allData.data.length > 0) {
          setAllQuotes(allData.data);
        }
      }
    } catch (err) {
      // Backend not running (e.g. GitHub Pages static host), safely rely on INITIAL_QUOTES
      console.log('Using local quotes repository (static host mode)');
    }
  };

  // Toggle Favorite with Local Storage Persistence
  const handleToggleFavorite = async (id: number) => {
    setAllQuotes(prev => {
      const updated = prev.map(q => {
        if (q.id === id) {
          const nextFav = !q.isFavorite;
          toast.success(nextFav ? 'Saved to Favorites!' : 'Removed from Favorites');
          return { ...q, isFavorite: nextFav };
        }
        return q;
      });

      // Save favorite IDs to localStorage
      try {
        const favIds = updated.filter(q => q.isFavorite).map(q => q.id);
        localStorage.setItem('mba_cet_favorite_quote_ids', JSON.stringify(favIds));
      } catch (e) {}

      return updated;
    });

    if (dailyQuote && dailyQuote.id === id) {
      setDailyQuote(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    }

    // Try background backend sync
    try {
      fetch(`/api/quotes/${id}/favorite`, { method: 'POST' }).catch(() => {});
    } catch (e) {}
  };

  // Copy Quote to Clipboard
  const handleCopyQuote = (text: string, author: string) => {
    navigator.clipboard.writeText(`"${text}" — ${author}`);
    toast.success('Quote copied to clipboard!');
  };

  // Shuffle / Next Random Quote for Daily Card preview
  const handleRandomizeDaily = () => {
    if (allQuotes.length === 0) return;
    const randomIndex = Math.floor(Math.random() * allQuotes.length);
    setDailyQuote(allQuotes[randomIndex]);
    toast.success('Loaded random motivational quote!');
  };

  // Submit New Custom Quote
  const handleAddCustomQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuoteText.trim()) return;

    const newQuote: Quote = {
      id: Date.now(),
      quote: newQuoteText.trim(),
      author: newQuoteAuthor.trim() || 'FocusOS',
      category: newQuoteCategory,
      bgPreset: 'gold',
      isFavorite: false
    };

    // Save to state
    setAllQuotes(prev => [newQuote, ...prev]);

    // Save to localStorage
    try {
      const savedCustom = localStorage.getItem('mba_cet_custom_quotes');
      const customList: Quote[] = savedCustom ? JSON.parse(savedCustom) : [];
      localStorage.setItem('mba_cet_custom_quotes', JSON.stringify([newQuote, ...customList]));
    } catch (err) {}

    toast.success('New motivation quote added successfully!');
    setIsAddQuoteOpen(false);
    setNewQuoteText('');
    setNewQuoteAuthor('');

    // Background API call if server is running
    try {
      fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQuote)
      }).catch(() => {});
    } catch (e) {}
  };

  // Filter Quotes
  const filteredQuotes = allQuotes.filter(q => {
    const matchesCategory = selectedCategory === 'All' 
      ? true 
      : selectedCategory === 'Favorites' 
      ? q.isFavorite 
      : q.category === selectedCategory;

    const matchesSearch = q.quote.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          q.author.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Export Poster Canvas as 4K PNG Download
  const downloadPosterPNG = (type: 'jbims' | 'journey') => {
    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (type === 'journey') {
      // Dark gold luxury journey canvas background
      const bgGrad = ctx.createRadialGradient(960, 540, 100, 960, 540, 1000);
      bgGrad.addColorStop(0, '#1a1610');
      bgGrad.addColorStop(0.6, '#0a0a0a');
      bgGrad.addColorStop(1, '#050508');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1920, 1080);

      // Frame
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 8;
      ctx.strokeRect(40, 40, 1840, 1000);

      // Header: MY JOURNEY
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 48px system-ui, sans-serif';
      ctx.fillText('🏆  MY JOURNEY', 100, 120);

      // Node 1: 2025
      ctx.beginPath();
      ctx.arc(320, 420, 110, 0, Math.PI * 2);
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 8;
      ctx.stroke();

      ctx.fillStyle = '#3b82f6';
      ctx.font = 'bold 32px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(`${journeyData.attempt1Year} ${journeyData.attempt1Title}`, 320, 270);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 68px system-ui';
      ctx.fillText(journeyData.attempt1Score, 320, 430);
      ctx.font = '24px system-ui';
      ctx.fillStyle = '#93c5fd';
      ctx.fillText('Percentile', 320, 470);

      // Bullets 1
      ctx.textAlign = 'left';
      ctx.font = '24px system-ui';
      ctx.fillStyle = '#cbd5e1';
      journeyData.attempt1Bullets.forEach((b, i) => {
        ctx.fillText(`• ${b}`, 210, 600 + (i * 38));
      });

      // Arrow 1 to 2
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(450, 420);
      ctx.lineTo(680, 420);
      ctx.stroke();

      // Node 2: 2026
      ctx.beginPath();
      ctx.arc(800, 420, 110, 0, Math.PI * 2);
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 8;
      ctx.stroke();

      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 32px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(`${journeyData.attempt2Year} ${journeyData.attempt2Title}`, 800, 270);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 64px system-ui';
      ctx.fillText(journeyData.attempt2Score, 800, 430);
      ctx.font = '24px system-ui';
      ctx.fillStyle = '#86efac';
      ctx.fillText('Percentile', 800, 470);

      // Bullets 2
      ctx.textAlign = 'left';
      ctx.font = '22px system-ui';
      ctx.fillStyle = '#cbd5e1';
      journeyData.attempt2Bullets.forEach((b, i) => {
        ctx.fillText(`• ${b}`, 680, 600 + (i * 38));
      });

      // Upward Diagonal Glowing Arrow to Node 3
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 10;
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.moveTo(930, 420);
      ctx.lineTo(1380, 280);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Node 3: 2027 MISSION
      ctx.beginPath();
      ctx.arc(1500, 450, 130, 0, Math.PI * 2);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 10;
      ctx.stroke();

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 36px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(`${journeyData.targetYear} ${journeyData.targetTitle}`, 1500, 270);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 76px system-ui';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 20;
      ctx.fillText(journeyData.targetScore, 1500, 460);
      ctx.shadowBlur = 0;
      ctx.font = '26px system-ui';
      ctx.fillStyle = '#fde047';
      ctx.fillText('Percentile', 1500, 505);

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 28px system-ui';
      ctx.fillText(`Status: ${journeyData.targetStatus}`, 1500, 640);

      // Bottom Banner Text
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 42px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(journeyData.tagline, 960, 1000);

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'My_JBIMS_Journey_Roadmap_4K.png';
      link.href = dataUrl;
      link.click();

      toast.success('My Journey 4K PNG downloaded!');
      return;
    }

    // Default square canvas for 4K wallpaper
    canvas.width = 1920;
    canvas.height = 1920;

    // Dark luxury gold gradient background
    const bgGrad = ctx.createRadialGradient(960, 960, 100, 960, 960, 1200);
    bgGrad.addColorStop(0, '#1c180a');
    bgGrad.addColorStop(0.5, '#0d0d14');
    bgGrad.addColorStop(1, '#050508');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1920, 1920);

    // Gold Outer Frame
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 12;
    ctx.strokeRect(80, 80, 1760, 1760);

    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.lineWidth = 4;
    ctx.strokeRect(105, 105, 1710, 1710);

    if (type === 'jbims') {
      // Top Text: NO BACKUP PLAN
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 52px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '6px';
      ctx.fillText('NO BACKUP PLAN', 960, 300);

      // Middle Text: ONLY JBIMS
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 130px system-ui, sans-serif';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 30;
      ctx.fillText('ONLY JBIMS', 960, 480);

      // Subtitle: 99.99 PERCENTILE
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 70px system-ui, sans-serif';
      ctx.shadowBlur = 15;
      ctx.fillText('99.99 PERCENTILE', 960, 640);

      ctx.shadowBlur = 0;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        // Draw gold frame & photo
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 10;
        ctx.strokeRect(480, 720, 960, 720);
        ctx.drawImage(img, 485, 725, 950, 710);

        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 36px system-ui, sans-serif';
        ctx.fillText('JAMNALAL BAJAJ INSTITUTE OF MANAGEMENT STUDIES', 960, 1530);
        ctx.font = '28px system-ui, sans-serif';
        ctx.fillText('CHURCHGATE CAMPUS • MUMBAI', 960, 1680);

        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'JBIMS_99.99_4K_Poster.png';
        link.href = dataUrl;
        link.click();
        toast.success('High Resolution 4K PNG downloaded!');
      };
      img.onerror = () => {
        ctx.fillStyle = '#f59e0b';
        ctx.font = '32px system-ui, sans-serif';
        ctx.fillText('CHURCHGATE CAMPUS • MUMBAI', 960, 1680);
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'JBIMS_99.99_4K_Poster.png';
        link.href = dataUrl;
        link.click();
        toast.success('High Resolution 4K PNG downloaded!');
      };
      img.src = jbimsImage;
      return;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-[#0a0a0a] via-[#1a162b] to-[#0a0a0a] border border-[#222222] rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-[#a855f7]/10 via-amber-500/5 to-transparent pointer-events-none" />
        
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-xs font-bold">
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
            <span>Target: JBIMS 99.99 Percentile</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Motivation & Daily Inspiration
          </h2>
          <p className="text-xs sm:text-sm text-[#9494ad] max-w-2xl leading-relaxed">
            Fuel your MBA CET preparation with daily quote rotations, custom journey roadmaps, high-definition 4K posters, and unbreakable mindset drills.
          </p>
        </div>

        <div className="flex items-center space-x-3 z-10">
          

          <button
            onClick={() => setIsAddQuoteOpen(true)}
            className="px-4 py-2.5 bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs font-bold rounded-xl flex items-center space-x-2 transition-all shadow-lg shadow-[#a855f7]/25"
          >
            <Plus className="w-4 h-4" />
            <span>Add Quote</span>
          </button>
        </div>
      </div>

      
      {/* MY JOURNEY EXACT MATCH */}
      <MyJourneyWidget />

      {/* Row 1: The Two Hero Poster Cards (Exact side-by-side as requested) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CARD 1: JBIMS MASTER POSTER */}
        <div>
          {/* Poster Frame - Clean Image with Single Border */}
          <div className="relative w-full rounded-3xl overflow-hidden border border-amber-500/60 shadow-2xl bg-black">
            <img 
              src={jbimsImage} 
              alt="JBIMS Master Poster" 
              className="w-full h-full object-cover rounded-3xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>


        {/* CARD 2: DAILY MOTIVATION CARD */}
        <div>
          <DailyMotivationWidget instanceKey="motivation" title="MOTIVATION SPOTLIGHT" defaultQuoteId={20} />
        </div>

      </div>

      {/* Row 2: 100+ Quotes Database Explorer Section */}
      <div className="bg-[#0a0a0a] border border-[#222222] rounded-3xl p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#222222] pb-5">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-[#a855f7]" />
              <span>Quotes</span>
            </h3>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#707085] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search quotes or authors..."
              className="w-full bg-[#0a0a0a] border border-[#222222] rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#a855f7]"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 custom-scrollbar">
          {['All', 'JBIMS Mindset', 'Discipline', 'Mock Grit', 'Focus & Drive', 'Belief', 'Favorites'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat 
                  ? 'bg-[#a855f7] text-white shadow-md shadow-[#a855f7]/20' 
                  : 'bg-[#0a0a0a] text-[#707085] hover:text-white border border-[#222222]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Quotes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuotes.map(q => (
            <div 
              key={q.id}
              className="bg-[#0a0a0a] border border-[#222222] hover:border-[#a855f7]/40 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#1a1a1a] text-amber-400 border border-amber-500/20">
                    {q.category}
                  </span>
                  <button
                    onClick={() => handleToggleFavorite(q.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      q.isFavorite ? 'text-amber-400' : 'text-[#707085] group-hover:text-white'
                    }`}
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                  "{q.quote}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#222222] flex items-center justify-between text-xs">
                <span className="text-[#707085] font-bold">— {q.author}</span>
                
                <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleCopyQuote(q.quote, q.author)}
                    className="p-1.5 rounded-lg text-[#707085] hover:text-white hover:bg-[#141414]"
                    title="Copy Quote"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>


                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      



      {/* Modal: Add Custom Quote to Backend */}
      <Modal
        isOpen={isAddQuoteOpen}
        onClose={() => setIsAddQuoteOpen(false)}
        title="Add Motivation Quote to Backend"
      >
        <form onSubmit={handleAddCustomQuote} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#707085] mb-1 font-medium">Quote Text</label>
            <textarea
              required
              rows={3}
              value={newQuoteText}
              onChange={(e) => setNewQuoteText(e.target.value)}
              placeholder="e.g. JBIMS Churchgate is won in the quiet hours of relentless practice."
              className="w-full bg-[#0a0a0a] border border-[#222222] rounded-xl p-3 text-white focus:outline-none focus:border-[#a855f7]"
            />
          </div>

          <div>
            <label className="block text-[#707085] mb-1 font-medium">Author / Tag</label>
            <input
              type="text"
              value={newQuoteAuthor}
              onChange={(e) => setNewQuoteAuthor(e.target.value)}
              placeholder="e.g. Churchgate Legend or FocusOS"
              className="w-full bg-[#0a0a0a] border border-[#222222] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#a855f7]"
            />
          </div>

          <div>
            <label className="block text-[#707085] mb-1 font-medium">Category</label>
            <select
              value={newQuoteCategory}
              onChange={(e: any) => setNewQuoteCategory(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#222222] rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#a855f7]"
            >
              <option value="JBIMS Mindset">JBIMS Mindset</option>
              <option value="Discipline">Discipline</option>
              <option value="Mock Grit">Mock Grit</option>
              <option value="Focus & Drive">Focus & Drive</option>
              <option value="Belief">Belief</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-[#222222]">
            <button
              type="button"
              onClick={() => setIsAddQuoteOpen(false)}
              className="px-4 py-2 text-[#707085] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#a855f7] text-white font-bold rounded-xl hover:bg-[#9333ea] transition-colors"
            >
              Save Quote to Backend
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

