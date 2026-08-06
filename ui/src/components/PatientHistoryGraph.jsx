import React from 'react';
import { History, ArrowRight } from 'lucide-react';

export default function PatientHistoryGraph({ patientId }) {
  const timelineEvents = [
    {
      date: '2026-08-05 18:05',
      title: 'Scanned Discharge PDF & Multi-Agent Synthesis',
      status: 'APPROVED',
      details: 'Digitized Coronary Artery Disease (85% LAD Stenosis - I25.10). FLUX.2-pro visual anatomical diagram generated for patient consultation.',
      umls: 'UMLS C0010054 (Coronary Artery Disease)'
    },
    {
      date: '2026-05-14 11:00',
      title: 'Inpatient Coronary Angiography (Scanned Record)',
      status: 'COMPLETED',
      details: 'Paper record: 85% proximal LAD occlusion. Prescribed dual antiplatelet therapy (Aspirin + Clopidogrel).',
      umls: 'UMLS C0265060 (LAD Stenosis)'
    },
    {
      date: '2025-10-10 09:30',
      title: 'Handwritten Outpatient Referral Note',
      status: 'COMPLETED',
      details: 'Exertional angina and mild dyspnea on stair climbing.',
      umls: 'UMLS C0002962 (Angina Pectoris)'
    }
  ];

  return (
    <div class="space-y-6 max-w-4xl mx-auto">
      <div class="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <div class="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div class="p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
            <History class="w-6 h-6" />
          </div>
          <div>
            <h2 class="text-sm font-mono font-bold text-slate-900 uppercase tracking-wider">
              PATIENT HISTORY & MEDICAL ENTITY GRAPH (LEGACY SYNTHESIS KNOWLEDGE GRAPH)
            </h2>
            <p class="text-xs text-slate-500 font-mono">Patient #{patientId}</p>
          </div>
        </div>

        {/* Knowledge Graph Card */}
        <div class="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
          <h3 class="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
            UMLS MEDICAL ENTITY & PATIENT ILLUSTRATION PIPELINE
          </h3>
          <div class="flex flex-wrap items-center justify-center gap-4 py-6 font-mono text-xs">
            <div class="p-4 rounded-xl bg-white border border-purple-200 shadow-sm text-purple-900 font-bold flex flex-col items-center">
              <span>Legacy Intake</span>
              <span class="text-[11px] text-slate-500 font-medium">Scanned PDF / Handwriting</span>
            </div>
            <ArrowRight class="w-4 h-4 text-slate-400" />
            <div class="p-4 rounded-xl bg-white border border-emerald-200 shadow-sm text-emerald-900 font-bold flex flex-col items-center">
              <span>Mistral OCR 4.0</span>
              <span class="text-[11px] text-slate-500 font-medium">Extracted Clinical Data</span>
            </div>
            <ArrowRight class="w-4 h-4 text-slate-400" />
            <div class="p-4 rounded-xl bg-white border border-blue-200 shadow-sm text-blue-900 font-bold flex flex-col items-center">
              <span>UMLS C0010054</span>
              <span class="text-[11px] text-slate-500 font-medium">ICD-10 I25.10 (CAD)</span>
            </div>
            <ArrowRight class="w-4 h-4 text-slate-400" />
            <div class="p-4 rounded-xl bg-white border border-rose-200 shadow-sm text-rose-900 font-bold flex flex-col items-center">
              <span>FLUX.2-pro Render</span>
              <span class="text-[11px] text-slate-500 font-medium">Patient Education Graphic</span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div class="space-y-4">
          <h3 class="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
            ΧΡΟΝΟΛΟΓΙΚΟ ΙΣΤΟΡΙΚΟ ΕΞΕΤΑΣΕΩΝ
          </h3>
          <div class="space-y-4 font-mono">
            {timelineEvents.map((item, idx) => (
              <div key={idx} class="flex gap-4 p-5 rounded-xl bg-slate-50 border border-slate-200">
                <div class="flex flex-col items-center">
                  <div class="w-3.5 h-3.5 rounded-full bg-blue-600 my-1 ring-4 ring-blue-100"></div>
                  {idx !== timelineEvents.length - 1 && <div class="w-0.5 flex-1 bg-slate-300"></div>}
                </div>
                <div class="space-y-1.5 flex-1">
                  <div class="flex items-center justify-between text-xs">
                    <span class="font-bold text-slate-900">{item.title}</span>
                    <span class="text-[11px] text-slate-500 font-medium">{item.date}</span>
                  </div>
                  <p class="text-xs font-sans text-slate-600 font-medium">{item.details}</p>
                  <span class="inline-block text-[10px] font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded border border-blue-200">
                    {item.umls}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
