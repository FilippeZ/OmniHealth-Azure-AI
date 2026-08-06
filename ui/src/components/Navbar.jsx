import React from 'react';
import { Search, Activity, UserCheck } from 'lucide-react';

export default function Navbar({ searchTerm, setSearchTerm }) {
  return (
    <header class="fixed top-0 left-64 right-0 h-16 glass-nav border-b border-slate-200 z-40 flex items-center justify-between px-8 shadow-sm">
      <div class="flex items-center gap-6 flex-1">
        <div class="relative w-full max-w-md">
          <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="PATIENT ID / DIAGNOSTIC SCAN (e.g. #PX-9928)"
            class="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
          />
        </div>
        <div class="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200/80 rounded-full">
          <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span class="text-[10px] font-mono font-bold tracking-wider text-emerald-700">AZURE MAF OPERATIONAL</span>
        </div>
      </div>

      {/* Doctor Profile Info */}
      <div class="flex items-center gap-4">
        <div class="text-right">
          <div class="text-xs font-mono font-bold text-slate-900">DR. ARIS NIKOLAIDIS</div>
          <div class="text-[10px] text-blue-600 font-mono font-medium">ATTENDING NEURO-SURGEON</div>
        </div>
        <div class="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-mono font-bold text-xs shadow-sm ring-2 ring-slate-100">
          AN
        </div>
      </div>
    </header>
  );
}
