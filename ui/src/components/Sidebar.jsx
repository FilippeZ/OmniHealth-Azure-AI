import React from 'react';
import { LayoutDashboard, Upload, FileText, History, ShieldCheck, Activity, ChevronRight } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'CLINICAL DASHBOARD', subLabel: 'Overview & Active Metrics', icon: LayoutDashboard },
    { id: 'upload', label: 'DIAGNOSTIC UPLOAD', subLabel: 'OCR Intake & Presets', icon: Upload },
    { id: 'agent-feed', label: 'AGENT FEEDS', subLabel: 'MAF Live Reasoning Stream', icon: FileText },
    { id: 'hitl', label: 'SUPERVISORY HITL', subLabel: 'Physician Review & Approval', icon: ShieldCheck },
    { id: 'patient-history', label: 'PATIENT HISTORY', subLabel: 'UMLS & Education Graph', icon: History },
  ];

  return (
    <aside class="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 z-50 flex flex-col shadow-sm">
      {/* Brand Header */}
      <div class="h-16 flex items-center px-6 border-b border-slate-200 gap-3">
        <div class="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
          <Activity class="w-5 h-5" />
        </div>
        <div>
          <h1 class="font-bold text-base tracking-tight text-slate-900">OmniHealth AI</h1>
          <p class="text-[10px] font-mono font-semibold text-blue-600 uppercase tracking-wide">AZURE MAF CLINICAL</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav class="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              class={`w-full flex items-center justify-between px-3.5 py-3 transition-all rounded-lg text-left group ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm border border-blue-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div class="flex items-center gap-3">
                <Icon class={`w-4 h-4 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                <div class="flex flex-col">
                  <span class="text-[11px] font-mono tracking-wider font-bold">{item.label}</span>
                  <span class="text-[10px] font-sans font-medium text-slate-500">{item.subLabel}</span>
                </div>
              </div>
              {isActive && <ChevronRight class="w-4 h-4 text-blue-600" />}
            </button>
          );
        })}
      </nav>

      {/* Compliance Footer */}
      <div class="p-4 border-t border-slate-200 bg-slate-50/50">
        <div class="p-3.5 rounded-lg bg-white border border-slate-200 shadow-sm flex flex-col gap-2">
          <div class="flex items-center justify-between text-[11px] font-mono">
            <span class="text-slate-500 font-medium">EU AI ACT</span>
            <span class="px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
              CLASS IIa
            </span>
          </div>
          <div class="flex items-center justify-between text-[11px] font-mono">
            <span class="text-slate-500 font-medium">MDR AUDIT</span>
            <span class="px-2 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 border border-blue-200 font-bold">
              ACTIVE
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
