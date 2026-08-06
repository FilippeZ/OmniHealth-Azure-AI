import React from 'react';
import { Activity, Zap, Cpu, AlertTriangle, ChevronRight, CheckCircle2, Clock, Plus, ExternalLink } from 'lucide-react';

export default function ClinicalDashboard({ patients, systemStatus, onSelectPatient, onNavigateUpload }) {
  const getProgressBarColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-emerald-500';
      case 'WAITING_APPROVAL':
      case 'WAITING_PHYSICIAN_APPROVAL':
        return 'bg-amber-500';
      default:
        return 'bg-blue-600 animate-pulse';
    }
  };

  const getProgressPercentage = (p) => {
    if (p.status === 'APPROVED') return 100;
    if (p.status === 'WAITING_APPROVAL' || p.status === 'WAITING_PHYSICIAN_APPROVAL') return p.ai_progress || 88;
    return p.ai_progress || 45;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span class="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 w-fit">
            <CheckCircle2 class="w-3.5 h-3.5" /> APPROVED
          </span>
        );
      case 'WAITING_APPROVAL':
      case 'WAITING_PHYSICIAN_APPROVAL':
        return (
          <span class="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5 w-fit animate-pulse">
            <Clock class="w-3.5 h-3.5" /> WAITING PHYSICIAN APPROVAL
          </span>
        );
      default:
        return (
          <span class="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5 w-fit">
            <Activity class="w-3.5 h-3.5 animate-spin" /> PROCESSING
          </span>
        );
    }
  };

  return (
    <div class="space-y-6">
      {/* Metrics Row */}
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Metric 1 */}
        <div class="bg-white p-5 rounded-xl border border-slate-200 border-l-4 border-l-blue-600 shadow-sm hover:shadow-md transition-all">
          <div class="flex justify-between items-start mb-3">
            <span class="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">ACTIVE DIAGNOSES</span>
            <div class="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Activity class="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <div class="font-mono text-3xl font-bold text-slate-900">
            {patients.length}<span class="text-base text-slate-400 font-normal">/20</span>
          </div>
          <div class="mt-3 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div class="h-full bg-blue-600 rounded-full" style={{ width: `${(patients.length / 20) * 100}%` }}></div>
          </div>
          <div class="mt-3 text-[10px] font-mono text-slate-500 flex justify-between">
            <span>SYSTEM LOAD</span>
            <span class="text-blue-600 font-bold">OPTIMAL</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div class="bg-white p-5 rounded-xl border border-slate-200 border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-all">
          <div class="flex justify-between items-start mb-3">
            <span class="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">NEURAL ACCURACY</span>
            <div class="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Cpu class="w-4 h-4" />
            </div>
          </div>
          <div class="font-mono text-3xl font-bold text-emerald-600">
            {systemStatus?.neural_accuracy || 99.8}<span class="text-base font-normal">%</span>
          </div>
          <div class="mt-3 flex gap-1">
            <div class="h-1.5 flex-1 bg-emerald-500 rounded-full"></div>
            <div class="h-1.5 flex-1 bg-emerald-500 rounded-full"></div>
            <div class="h-1.5 flex-1 bg-emerald-500 rounded-full"></div>
            <div class="h-1.5 flex-1 bg-emerald-200 rounded-full"></div>
          </div>
          <div class="mt-3 text-[10px] font-mono text-slate-500 flex justify-between">
            <span>MODEL ERROR</span>
            <span class="text-emerald-600 font-bold">&lt;0.02%</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div class="bg-white p-5 rounded-xl border border-slate-200 border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-all">
          <div class="flex justify-between items-start mb-3">
            <span class="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">RESPONSE TIME</span>
            <div class="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Zap class="w-4 h-4" />
            </div>
          </div>
          <div class="font-mono text-3xl font-bold text-amber-600">
            {systemStatus?.response_latency_ms || 142}<span class="text-base font-normal">ms</span>
          </div>
          <div class="mt-3 flex items-end gap-1 h-2">
            <div class="w-2 bg-amber-200 h-1 rounded-sm"></div>
            <div class="w-2 bg-amber-400 h-1.5 rounded-sm"></div>
            <div class="w-2 bg-amber-500 h-2 rounded-sm"></div>
            <div class="w-2 bg-amber-200 h-1 rounded-sm"></div>
          </div>
          <div class="mt-3 text-[10px] font-mono text-slate-500 flex justify-between">
            <span>LATENCY</span>
            <span class="text-amber-600 font-bold">STABLE</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div class="bg-white p-5 rounded-xl border border-slate-200 border-l-4 border-l-rose-500 shadow-sm hover:shadow-md transition-all">
          <div class="flex justify-between items-start mb-3">
            <span class="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">CRITICAL EVENTS</span>
            <div class="p-2 rounded-lg bg-rose-50 text-rose-600">
              <AlertTriangle class="w-4 h-4" />
            </div>
          </div>
          <div class="font-mono text-3xl font-bold text-rose-600">
            0{systemStatus?.critical_events || 3}
          </div>
          <div class="mt-3 flex gap-2">
            <div class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></div>
            <div class="w-2 h-2 rounded-full bg-rose-500"></div>
            <div class="w-2 h-2 rounded-full bg-rose-200"></div>
          </div>
          <div class="mt-3 text-[10px] font-mono text-slate-500 flex justify-between">
            <span>ACTION REQUIRED</span>
            <span class="text-rose-600 font-bold">HIGH PRIORITY</span>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div class="grid grid-cols-12 gap-6">
        <div class="col-span-12 lg:col-span-8 space-y-6">
          {/* Diagnostic Tasks Table */}
          <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
              <div class="flex items-center gap-3">
                <h2 class="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
                  ACTIVE DIAGNOSTIC TASKS
                </h2>
              </div>
              <button
                onClick={onNavigateUpload}
                class="text-[11px] font-mono font-bold px-3.5 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-all rounded-lg shadow-sm flex items-center gap-1.5"
              >
                <Plus class="w-3.5 h-3.5" /> NEW DIAGNOSIS
              </button>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="border-b border-slate-200 bg-slate-50/80 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    <th class="px-6 py-3.5">PATIENT ID</th>
                    <th class="px-6 py-3.5">RECORD TYPE</th>
                    <th class="px-6 py-3.5">AI PROGRESS</th>
                    <th class="px-6 py-3.5">STATUS</th>
                    <th class="px-6 py-3.5 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody class="font-mono text-xs divide-y divide-slate-100">
                  {patients.map((p) => {
                    const pct = getProgressPercentage(p);
                    const colorClass = getProgressBarColor(p.status);
                    return (
                      <tr
                        key={p.id}
                        onClick={() => onSelectPatient(p.id)}
                        class="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                      >
                        <td class="px-6 py-4 text-blue-600 font-bold">{p.id}</td>
                        <td class="px-6 py-4 text-slate-800 font-medium">{p.type}</td>
                        <td class="px-6 py-4">
                          <div class="flex items-center gap-3">
                            <div class="w-28 h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                              <div
                                class={`h-full rounded-full transition-all duration-700 ease-out ${colorClass}`}
                                style={{ width: `${pct}%` }}
                              ></div>
                            </div>
                            <span class="text-[11px] font-bold text-slate-700">{pct}%</span>
                          </div>
                        </td>
                        <td class="px-6 py-4">{getStatusBadge(p.status)}</td>
                        <td class="px-6 py-4 text-right">
                          <span class="text-blue-600 font-bold inline-flex items-center gap-1 text-[11px] group-hover:translate-x-0.5 transition-transform">
                            VIEW <ChevronRight class="w-3.5 h-3.5" />
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Azure Status Column */}
        <div class="col-span-12 lg:col-span-4 space-y-6">
          <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 class="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 pb-3">
              <span>AZURE AI SERVICES STATUS</span>
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </h3>

            <div class="space-y-2.5 font-mono text-xs">
              <div class="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                <span class="text-slate-700 font-medium">Azure AI Foundry (DeepSeek 3.2)</span>
                <span class="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">CONNECTED</span>
              </div>
              <div class="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                <span class="text-slate-700 font-medium">Mistral OCR 4.0</span>
                <span class="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">READY</span>
              </div>
              <div class="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                <span class="text-slate-700 font-medium">FLUX.2-pro (Text-to-Image)</span>
                <span class="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">ACTIVE</span>
              </div>
              <div class="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                <span class="text-slate-700 font-medium">Text Analytics for Health</span>
                <span class="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">UMLS CODED</span>
              </div>
              <div class="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                <span class="text-slate-700 font-medium">Azure AI Search (AHA RAG)</span>
                <span class="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">INDEXED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
