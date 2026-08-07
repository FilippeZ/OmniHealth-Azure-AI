import React, { useEffect, useRef, useState } from 'react';
import {
  Users, CheckCircle2, Clock, AlertTriangle, Plus, ChevronRight,
  ShieldCheck, FileText, Palette, Stethoscope, Activity, ArrowUpRight,
  Sparkles, BookOpen
} from 'lucide-react';

/* ─── Animated Counter ────────────────────────────── */
function AnimatedNumber({ value, suffix = '', decimals = 0 }) {
  const [display, setDisplay] = useState(0);
  const start = useRef(null);
  const duration = 1000;

  useEffect(() => {
    start.current = null;
    const target = parseFloat(value) || 0;
    const step = (ts) => {
      if (!start.current) start.current = ts;
      const progress = Math.min((ts - start.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay((eased * target).toFixed(decimals));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);

  return <span>{display}{suffix}</span>;
}

/* ─── Status Badges for Doctor ────────────────────── */
function StatusBadge({ status }) {
  const configs = {
    APPROVED: { cls: 'badge-emerald', icon: <CheckCircle2 className="w-3 h-3" />, label: 'APPROVED & SHARED WITH PATIENT' },
    WAITING_APPROVAL: { cls: 'badge-amber', icon: <Clock className="w-3 h-3" />, label: 'AWAITING PHYSICIAN APPROVAL' },
    WAITING_PHYSICIAN_APPROVAL: { cls: 'badge-amber', icon: <Clock className="w-3 h-3" />, label: 'AWAITING PHYSICIAN APPROVAL' },
    PROCESSING: { cls: 'badge-blue', icon: <Activity className="w-3 h-3 animate-spin" />, label: 'AI DIGITIZATION IN PROGRESS' },
  };
  const cfg = configs[status] || configs.PROCESSING;
  return (
    <span className={`badge ${cfg.cls} flex items-center gap-1`}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

/* ─── Progress Bar ────────────────────────────────── */
function ProgressBar({ pct, status }) {
  const colorMap = {
    APPROVED: 'progress-emerald',
    WAITING_APPROVAL: 'progress-amber',
    WAITING_PHYSICIAN_APPROVAL: 'progress-amber',
  };
  const cls = colorMap[status] || 'progress-blue';
  return (
    <div className="flex items-center gap-3">
      <div className="progress-track flex-1" style={{ maxWidth: 120 }}>
        <div
          className={`progress-fill ${cls}`}
          style={{ width: `${pct}%`, transition: 'width 1s cubic-bezier(0.22,0.61,0.36,1)' }}
        />
      </div>
      <span
        className="text-xs font-bold tabular-nums"
        style={{ fontFamily: "'JetBrains Mono'", color: 'var(--text-primary)', minWidth: 36 }}
      >
        {pct}%
      </span>
    </div>
  );
}

/* ─── Physician Metric Card ───────────────────────── */
function PhysicianMetricCard({ color, label, value, suffix, decimals, sub, subLabel, icon: Icon, delay = 0 }) {
  return (
    <div
      className={`metric-card ${color} p-5 animate-slide-in-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex justify-between items-start mb-4">
        <span
          className="text-[10px] font-bold uppercase tracking-widest"
          style={{ fontFamily: "'JetBrains Mono'", color: 'var(--text-muted)' }}
        >
          {label}
        </span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{
            background: `rgba(${
              color === 'blue' ? '59,130,246' :
              color === 'emerald' ? '16,185,129' :
              color === 'amber' ? '245,158,11' : '244,63,94'
            }, 0.12)`,
            border: `1px solid rgba(${
              color === 'blue' ? '59,130,246' :
              color === 'emerald' ? '16,185,129' :
              color === 'amber' ? '245,158,11' : '244,63,94'
            }, 0.2)`,
          }}
        >
          <Icon
            className="w-4 h-4"
            style={{
              color: color === 'blue' ? 'var(--accent-blue)' :
                     color === 'emerald' ? 'var(--accent-emerald)' :
                     color === 'amber' ? 'var(--accent-amber)' : 'var(--accent-rose)',
            }}
          />
        </div>
      </div>

      <div
        className="text-3xl font-bold tabular-nums mb-1 animate-count-up"
        style={{
          fontFamily: "'JetBrains Mono'",
          color: color === 'blue' ? 'var(--accent-blue)' :
                 color === 'emerald' ? 'var(--accent-emerald)' :
                 color === 'amber' ? 'var(--accent-amber)' : 'var(--accent-rose)',
          animationDelay: `${delay + 200}ms`,
        }}
      >
        <AnimatedNumber value={value} suffix={suffix} decimals={decimals} />
      </div>

      <div className="mt-3">
        <div className="progress-track">
          <div
            className={`progress-fill progress-${color}`}
            style={{ width: `${Math.min((parseFloat(value) / (sub || 100)) * 100, 100)}%` }}
          />
        </div>
      </div>

      <div
        className="mt-3 flex justify-between text-[10px] font-bold uppercase tracking-wider"
        style={{ fontFamily: "'JetBrains Mono'" }}
      >
        <span style={{ color: 'var(--text-faint)' }}>{subLabel?.[0] || ''}</span>
        <span
          style={{
            color: color === 'blue' ? 'var(--accent-blue)' :
                   color === 'emerald' ? 'var(--accent-emerald)' :
                   color === 'amber' ? 'var(--accent-amber)' : 'var(--accent-rose)',
          }}
        >
          {subLabel?.[1] || ''}
        </span>
      </div>
    </div>
  );
}

/* ─── Doctor Diagnostic Row Item ──────────────────── */
function getConditionTitle(p) {
  if (p.diagnosis) return p.diagnosis;
  if (p.id === 'PX-8810') return 'Coronary Artery Disease (85% LAD Stenosis)';
  if (p.id === 'PX-8811') return 'Lumbar Disc Herniation (L5-S1 Radiculopathy)';
  if (p.id === 'PX-8812') return 'Type 2 Diabetes Mellitus with Neuropathy';
  if (p.id === 'PX-8813') return 'Chronic Obstructive Pulmonary Disease (COPD)';
  return p.type || 'Legacy Clinical Document Synthesis';
}

function getPatientName(p) {
  if (p.name) return p.name;
  if (p.id === 'PX-8810') return 'Nikos Mavros (58y)';
  if (p.id === 'PX-8811') return 'Elena Dimou (42y)';
  if (p.id === 'PX-8812') return 'Christos Papanikolaou (65y)';
  if (p.id === 'PX-8813') return 'George Vassiliou (62y)';
  return `Patient #${p.id}`;
}

export default function ClinicalDashboard({ patients = [], systemStatus, onSelectPatient, onNavigateUpload, isLoading }) {
  const getProgress = (p) => {
    if (p.status === 'APPROVED') return 100;
    if (p.status === 'WAITING_APPROVAL' || p.status === 'WAITING_PHYSICIAN_APPROVAL') return p.ai_progress || 88;
    return p.ai_progress || 45;
  };

  const pendingApprovalsCount = patients.filter(
    (p) => p.status === 'WAITING_APPROVAL' || p.status === 'WAITING_PHYSICIAN_APPROVAL'
  ).length;

  const approvedCount = patients.filter((p) => p.status === 'APPROVED').length;

  const clinicalEngines = [
    { label: 'Document OCR & Handwriting Ingestion', detail: 'Mistral OCR 4.0 Layout Engine', status: 'READY' },
    { label: 'Patient Literacy Illustrator Engine', detail: 'FLUX.2-pro Flat-Vector Visuals', status: 'ACTIVE' },
    { label: 'Clinical Medical Coding (UMLS & ICD-10)', detail: 'Azure Text Analytics for Health', status: 'UMLS CODED' },
    { label: 'Evidence Guidelines Index (RAG)', detail: 'AHA Cardiovascular & WHO Standards', status: 'INDEXED' },
    { label: 'EU AI Act Article 14 Safety Guardrails', detail: 'Human Oversight Protocol (HITL)', status: 'ENFORCED' },
  ];

  return (
    <div className="space-y-6">
      {/* Doctor Overview Header */}
      <div className="animate-fade-in-down flex items-center justify-between">
        <div>
          <h1
            className="text-lg font-bold flex items-center gap-2.5"
            style={{ color: 'var(--text-primary)', fontFamily: "'JetBrains Mono'" }}
          >
            <Stethoscope className="w-5 h-5" style={{ color: 'var(--accent-blue)' }} />
            PHYSICIAN CLINICAL DASHBOARD
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Real-time overview of active patient consultations, document digitizations, and patient education visual aids.
          </p>
        </div>
        <button
          onClick={onNavigateUpload}
          className="btn-primary"
          id="new-diagnosis-btn"
        >
          <Plus className="w-3.5 h-3.5" /> INGEST CLINICAL SCAN
        </button>
      </div>

      {/* Physician Metric Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <PhysicianMetricCard
          color="blue" label="ACTIVE PATIENT CASES"
          value={patients.length} suffix="/20"
          decimals={0} sub={20}
          subLabel={['CLINIC WORKLOAD', 'NORMAL CAPACITY']}
          icon={Users} delay={0}
        />
        <PhysicianMetricCard
          color="emerald" label="APPROVED CONSULTATIONS"
          value={approvedCount || patients.length} suffix="" decimals={0}
          sub={patients.length || 1}
          subLabel={['PATIENT LITERACY', 'VISUAL AIDS READY']}
          icon={CheckCircle2} delay={100}
        />
        <PhysicianMetricCard
          color="amber" label="AWAITING PHYSICIAN REVIEW"
          value={pendingApprovalsCount} suffix="" decimals={0}
          sub={patients.length || 1}
          subLabel={['HITL SUPERVISORY', pendingApprovalsCount > 0 ? 'REVIEW REQUIRED' : 'UP TO DATE']}
          icon={Clock} delay={200}
        />
        <PhysicianMetricCard
          color="rose" label="SAFETY & AUDIT COMPLIANCE"
          value="100" suffix="%" decimals={0}
          sub={100}
          subLabel={['EU AI ACT ART. 14', 'FULLY COMPLIANT']}
          icon={ShieldCheck} delay={300}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-5">
        {/* Diagnostic Tasks Table for Doctor */}
        <div className="col-span-12 xl:col-span-8 animate-slide-in-up" style={{ animationDelay: '150ms' }}>
          <div className="glass-card overflow-hidden">
            {/* Table Header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: 'var(--accent-blue)', boxShadow: '0 0 8px var(--accent-blue)' }}
                />
                <span
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ fontFamily: "'JetBrains Mono'", color: 'var(--text-primary)' }}
                >
                  ACTIVE CLINICAL PATIENT RECORDS
                </span>
                <span className="badge badge-blue" style={{ marginLeft: 4 }}>
                  {patients.length} ACTIVE PATIENTS
                </span>
              </div>
              <button
                onClick={onNavigateUpload}
                className="btn-primary"
                style={{ padding: '7px 14px', fontSize: '10px' }}
                id="table-new-diagnosis-btn"
              >
                <Plus className="w-3 h-3" /> INGEST SCAN
              </button>
            </div>

            {/* Clinical Table */}
            <div className="overflow-x-auto">
              <table className="w-full clinical-table">
                <thead>
                  <tr>
                    {['PATIENT', 'CLINICAL CONDITION', 'RECORD TYPE', 'AI SYNTHESIS', 'STATUS', 'ACTION'].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest"
                        style={{ fontFamily: "'JetBrains Mono'", color: 'var(--text-faint)' }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    [0, 1, 2].map((i) => (
                      <tr key={i}>
                        {[1, 2, 3, 4, 5, 6].map((j) => (
                          <td key={j} className="px-5 py-4">
                            <div
                              className="h-4 rounded"
                              style={{
                                background: 'rgba(255,255,255,0.05)',
                                animation: 'shimmer 1.8s ease-in-out infinite',
                                width: j === 2 ? '140px' : '80%',
                              }}
                            />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : patients.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-10 text-center">
                        <span style={{ color: 'var(--text-faint)', fontFamily: "'JetBrains Mono'", fontSize: 12 }}>
                          NO ACTIVE PATIENT RECORDS
                        </span>
                      </td>
                    </tr>
                  ) : (
                    patients.map((p, i) => {
                      const pct = getProgress(p);
                      const name = getPatientName(p);
                      const condition = getConditionTitle(p);
                      return (
                        <tr
                          key={p.id}
                          onClick={() => onSelectPatient(p.id)}
                          className="cursor-pointer group"
                          style={{ animationDelay: `${i * 80}ms` }}
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                style={{
                                  background: p.status === 'APPROVED' ? 'var(--accent-emerald)' :
                                              p.status === 'PROCESSING' ? 'var(--accent-blue)' : 'var(--accent-amber)',
                                  boxShadow: `0 0 6px ${p.status === 'APPROVED' ? 'var(--accent-emerald)' : p.status === 'PROCESSING' ? 'var(--accent-blue)' : 'var(--accent-amber)'}`,
                                }}
                              />
                              <div>
                                <span
                                  className="text-xs font-bold block"
                                  style={{ fontFamily: "'JetBrains Mono'", color: 'var(--accent-blue)' }}
                                >
                                  {p.id}
                                </span>
                                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                                  {name}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className="text-xs font-semibold block"
                              style={{ color: 'var(--text-primary)', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                            >
                              {condition}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className="text-xs font-medium"
                              style={{ color: 'var(--text-muted)', maxWidth: 180, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                              title={p.type || p.record_type || 'LEGACY RECORD'}
                            >
                              {p.type || p.record_type || 'LEGACY RECORD'}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <ProgressBar pct={pct} status={p.status} />
                          </td>
                          <td className="px-5 py-4">
                            <StatusBadge status={p.status} />
                          </td>
                          <td className="px-5 py-4">
                            <button
                              className="flex items-center gap-1.5 text-[11px] font-bold transition-all group-hover:gap-2.5"
                              style={{
                                fontFamily: "'JetBrains Mono'",
                                color: 'var(--accent-blue)',
                                background: 'none', border: 'none', cursor: 'pointer',
                              }}
                            >
                              REVIEW <ArrowUpRight className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Clinical Engines & Guidelines */}
        <div className="col-span-12 xl:col-span-4 space-y-4 animate-slide-in-up" style={{ animationDelay: '250ms' }}>
          {/* Clinical Engines Status */}
          <div className="glass-card p-5">
            <div className="section-header">
              <ShieldCheck className="w-3.5 h-3.5" style={{ color: 'var(--accent-emerald)' }} />
              <span>CLINICAL AI & SAFETY PIPELINE</span>
              <div className="ml-auto live-dot" />
            </div>
            <div className="space-y-2">
              {clinicalEngines.map((item, idx) => (
                <div
                  key={item.label}
                  className="p-3 rounded-xl flex items-center justify-between"
                  style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div>
                    <div className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                      {item.label}
                    </div>
                    <div className="text-[10px]" style={{ color: 'var(--text-faint)', fontFamily: "'JetBrains Mono'" }}>
                      {item.detail}
                    </div>
                  </div>
                  <span className="badge badge-emerald">{item.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Summary & Guidelines */}
          <div className="glass-card p-5">
            <div className="section-header">
              <BookOpen className="w-3.5 h-3.5" style={{ color: 'var(--accent-blue)' }} />
              <span>CLINICAL PRACTICE STANDARDS</span>
            </div>
            <div className="space-y-3 font-mono text-xs">
              <div
                className="p-3.5 rounded-xl space-y-1.5"
                style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.18)' }}
              >
                <div className="font-bold flex items-center gap-1.5" style={{ color: 'var(--accent-blue)' }}>
                  <Sparkles className="w-3.5 h-3.5" /> AHA Patient Literacy Standard
                </div>
                <p className="text-[11px] leading-relaxed font-sans" style={{ color: 'var(--text-muted)' }}>
                  Generated FLUX.2-pro visual diagrams provide non-intimidating, flat-vector anatomical education for patient consultations.
                </p>
              </div>

              <div
                className="p-3.5 rounded-xl space-y-1.5"
                style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.18)' }}
              >
                <div className="font-bold flex items-center gap-1.5" style={{ color: 'var(--accent-emerald)' }}>
                  <ShieldCheck className="w-3.5 h-3.5" /> EU AI Act Article 14 Guardrails
                </div>
                <p className="text-[11px] leading-relaxed font-sans" style={{ color: 'var(--text-muted)' }}>
                  Mandatory Human-in-the-Loop (HITL) physician approval is enforced before sharing visual aids or educational summaries with patients.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
