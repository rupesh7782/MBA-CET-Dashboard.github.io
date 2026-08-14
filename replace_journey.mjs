import fs from 'fs';
let code = fs.readFileSync('src/components/motivation/MotivationView.tsx', 'utf8');

// The section starts at:
// {/* NEW FEATURE: MY JOURNEY PROGRESSION ROADMAP POSTER (Matching Exact Uploaded Image) */}
// and ends just before:
// {/* Row 1: The Two Hero Poster Cards (Exact side-by-side as requested) */}

const startMarker = "{/* NEW FEATURE: MY JOURNEY PROGRESSION ROADMAP POSTER";
const endMarker = "{/* Row 1: The Two Hero Poster Cards";

const startIndex = code.indexOf(startMarker);
const endIndex = code.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `
      {/* MY JOURNEY EXACT MATCH */}
      <MyJourneyWidget />

      `;
  code = code.substring(0, startIndex) + replacement + code.substring(endIndex);
  
  // Also import it
  if (!code.includes("MyJourneyWidget")) {
    code = code.replace(
      "import { Download, Upload, ArrowUpRight, Trophy, Sparkles, Camera, Edit3, Type } from 'lucide-react';",
      "import { Download, Upload, ArrowUpRight, Trophy, Sparkles, Camera, Edit3, Type } from 'lucide-react';\nimport { MyJourneyWidget } from '../dashboard/MyJourneyWidget';"
    );
  }
  
  fs.writeFileSync('src/components/motivation/MotivationView.tsx', code);
  console.log('replaced old journey with MyJourneyWidget');
} else {
  console.log('could not find markers');
}
