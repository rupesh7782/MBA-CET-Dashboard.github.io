import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Bookmark, Copy, Camera, Image as ImageIcon } from 'lucide-react';
import { INITIAL_QUOTES, Quote } from '../../data/quotesData';
import toast from 'react-hot-toast';

const DEFAULT_JBIMS_POSTER = '/jbims-poster.svg';

const MOTIVATION_BACKGROUNDS = [
  DEFAULT_JBIMS_POSTER,
  'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1434394354979-a235cd36269d?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1511497584788-876761c11969?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1476514525535-ce74f45814d0?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1510784722466-be2aa9c52ffa?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&q=80&w=1200',
];

interface DailyMotivationWidgetProps {
  instanceKey?: string;
  title?: string;
  defaultQuoteId?: number;
}

export const DailyMotivationWidget: React.FC<DailyMotivationWidgetProps> = ({
  instanceKey = 'dashboard',
  title = 'DAILY MOTIVATION',
  defaultQuoteId = 89
}) => {
  const bgFileInputRef = useRef<HTMLInputElement>(null);

  const defaultQuote: Quote = {
    id: 999,
    quote: "Discipline today,\n\nsuccess tomorrow.\n\nKeep showing up for yourself.",
    author: "FocusOS",
    category: "Discipline",
    isFavorite: false
  };

  const [quote, setQuote] = useState<Quote>(() => {
    try {
      const saved = localStorage.getItem(`motivation_quote_${instanceKey}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_QUOTES.find(q => q.id === defaultQuoteId) || defaultQuote;
  });

  const [allQuotes, setAllQuotes] = useState<Quote[]>([defaultQuote, ...INITIAL_QUOTES]);

  const [isBookmarked, setIsBookmarked] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(`motivation_bookmark_${instanceKey}`);
      if (saved !== null) return JSON.parse(saved);
    } catch (e) {}
    return quote.isFavorite || false;
  });

  const [bgImage, setBgImage] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(`motivation_bg_${instanceKey}`);
      if (saved) return saved;
      const customPoster = localStorage.getItem('mba_cet_jbims_poster_image');
      if (customPoster) return customPoster;
    } catch (e) {}
    return DEFAULT_JBIMS_POSTER;
  });

  const [timeUntilTomorrow, setTimeUntilTomorrow] = useState<string>('');

  // Persist state changes per instanceKey
  useEffect(() => {
    try {
      localStorage.setItem(`motivation_quote_${instanceKey}`, JSON.stringify(quote));
    } catch (e) {}
  }, [quote, instanceKey]);

  useEffect(() => {
    try {
      localStorage.setItem(`motivation_bookmark_${instanceKey}`, JSON.stringify(isBookmarked));
    } catch (e) {}
  }, [isBookmarked, instanceKey]);

  useEffect(() => {
    try {
      localStorage.setItem(`motivation_bg_${instanceKey}`, bgImage);
    } catch (e) {}
  }, [bgImage, instanceKey]);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const res = await fetch('/api/quotes');
        if (res.ok) {
          const data = await res.json();
          if (data?.data?.length > 0) {
            setAllQuotes([defaultQuote, ...data.data]);
          }
        }
      } catch (err) {
        // Fallback
      }
    };
    fetchQuotes();
  }, []);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diffMs = midnight.getTime() - now.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
      setTimeUntilTomorrow(
        `${hours.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleShuffle = () => {
    if (allQuotes.length === 0) return;
    const randomIndex = Math.floor(Math.random() * allQuotes.length);
    const selected = allQuotes[randomIndex];
    setQuote(selected);
    setIsBookmarked(!!selected.isFavorite);

    const availableBgs = MOTIVATION_BACKGROUNDS.filter(bg => bg !== bgImage);
    const randomBgIndex = Math.floor(Math.random() * availableBgs.length);
    setBgImage(availableBgs[randomBgIndex] || DEFAULT_JBIMS_POSTER);

    toast.success('New daily motivation loaded!');
  };

  const handleBookmark = () => {
    setIsBookmarked(prev => !prev);
    toast.success(isBookmarked ? 'Removed from bookmarks' : 'Bookmarked quote!');
  };

  const handleCopy = () => {
    const fullText = `"${quote.quote.replace(/\n\n/g, ' ')}" — ${quote.author}`;
    navigator.clipboard.writeText(fullText);
    toast.success('Quote copied to clipboard!');
  };

  const handleUseJbimsPoster = () => {
    const savedPoster = localStorage.getItem('mba_cet_jbims_poster_image') || DEFAULT_JBIMS_POSTER;
    setBgImage(savedPoster);
    toast.success('Set background to JBIMS Master Poster!');
  };

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          setBgImage(compressedDataUrl);
          try {
            localStorage.setItem(`motivation_bg_${instanceKey}`, compressedDataUrl);
            toast.success('Background image updated!');
          } catch (err) {
            toast.success('Background updated for this session!');
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full">
      <input 
        type="file" 
        ref={bgFileInputRef} 
        onChange={handleBgUpload} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Main Motivation Image Card */}
      <div className="relative w-full rounded-[24px] overflow-hidden border border-[#22222c] bg-black shadow-2xl p-6 sm:p-8 flex flex-col justify-between min-h-[420px]">
        
        {/* Background Photo */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-700"
          style={{
            backgroundImage: `url("${bgImage}")`,
            filter: 'brightness(0.45) contrast(1.15)'
          }}
        />
        
        {/* Dark Vignette Overlay for Crisp Legibility */}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/40 to-black/70 pointer-events-none" />

        {/* Card Content Top */}
        <div className="relative z-10">
          <span className="text-[11px] font-black tracking-[0.25em] text-white uppercase block">
            {title}
          </span>

          <div className="text-[#ffc800] text-5xl sm:text-6xl font-serif font-black mt-4 leading-none select-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            “
          </div>

          <div className="mt-3 max-w-lg font-sans">
            {quote.quote.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-5 flex items-center space-x-2">
            <span className="text-[#ffc800] font-bold text-sm sm:text-base">—</span>
            <span className="text-[#ffc800] font-bold text-sm sm:text-base tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">{quote.author}</span>
          </div>
        </div>

        {/* Card Actions Bottom */}
        <div className="relative z-10 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 pt-5 border-t border-white/10 mt-6">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleShuffle}
              className="px-3 py-2 bg-black/60 hover:bg-black text-white rounded-xl border border-white/15 backdrop-blur-md transition-all cursor-pointer hover:border-amber-400 flex items-center space-x-1.5 text-xs font-semibold whitespace-nowrap shrink-0"
              title="Shuffle Quote & Background"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="whitespace-nowrap">Shuffle Quote</span>
            </button>

            <button
              onClick={handleBookmark}
              className={`p-2 rounded-xl border backdrop-blur-md transition-all cursor-pointer text-xs font-semibold flex items-center justify-center shrink-0 ${
                isBookmarked 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' 
                  : 'bg-black/60 hover:bg-black text-white border-white/15 hover:border-amber-400'
              }`}
              title="Bookmark Quote"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>

            <button
              onClick={handleCopy}
              className="p-2 bg-black/60 hover:bg-black text-white rounded-xl border border-white/15 backdrop-blur-md transition-all cursor-pointer hover:border-amber-400 text-xs font-semibold shrink-0"
              title="Copy Quote"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] text-gray-400 block font-medium whitespace-nowrap">Next Quote In</span>
            <span className="text-xs font-mono font-bold text-amber-300 whitespace-nowrap">{timeUntilTomorrow || '24h 00m'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};




