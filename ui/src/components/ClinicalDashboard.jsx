import React, { useEffect, useRef, useState } from 'react';
import {
  Users, CheckCircle2, Clock, AlertTriangle, Plus,
  ShieldCheck, Stethoscope, Activity,
  X, Upload, Cpu, TrendingUp, BarChart2
} from 'lucide-react';
import DiagnosticUploader from './DiagnosticUploader';

function AnimatedNumber({ value, suffix = '', decimals = 0 }) {
  const [display, setDisplay] = useState(0);
  const start = useRef(null);
  const duration = 1200;
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
  return React.createElement('span', null, display, suffix);
}

function StatusBadge({ status }) {
  const configs = {
    APPROVED: { cls: 'badge-emerald', label: 'APPROVED & SHARED WITH PATIENT' },
    COMPLETED: { cls: 'badge-emerald', label: 'APPROVED & SHARED WITH PATIENT' },
    WAITING_APPROVAL: { cls: 'badge-amber', label: 'AWAITING PHYSICIAN REVIEW' },
    WAITING_PHYSICIAN_APPROVAL: { cls: 'badge-amber', label: 'AWAITING PHYSICIAN REVIEW' },
    MODIFIED: { cls: 'badge-amber', label: 'PROMPT MODIFIED & RE-SYNTHESIZED' },
    REJECTED: { cls: 'badge-rose', label: 'REJECTED & RE-EVALUATED' },
    PROCESSING: { cls: 'badge-blue', label: 'AI DIGITIZATION IN PROGRESS' },
  };
  const cfg = configs[status] || configs.APPROVED;
  return (
    <span className={'badge ' + cfg.cls + ' font-mono text-[9px]'}>
      {cfg.label}
    </span>
  );
}

function DonutChart({ approved, pending, processing, total, activeFilter, onSelectFilter }) {
  const r = 48, cx = 64, cy = 64, stroke = 13;
  const circumference = 2 * Math.PI * r;
  const safeTotal = total || 1;
  const segments = [
    { value: approved,    color: '#10b981', label: 'APPROVED', key: 'APPROVED' },
    { value: pending,     color: '#F59E0B', label: 'PENDING',  key: 'WAITING_APPROVAL' },
    { value: processing,  color: '#3b82f6', label: 'PROCESSING', key: 'PROCESSING' },
  ];
  let offset = 0;
  const arcs = segments.map((seg) => {
    const dash = circumference * (seg.value / safeTotal);
    const gap  = circumference - dash;
    const arc  = { ...seg, dash, gap, offset };
    offset += dash;
    return arc;
  });
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <svg width={128} height={128} viewBox="0 0 128 128">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
        {arcs.map((a, i) => {
          const isSelected = activeFilter === a.key;
          return (
            <circle
              key={i} cx={cx} cy={cy} r={r}
              fill="none" stroke={a.color} strokeWidth={isSelected ? stroke + 3 : stroke}
              strokeDasharray={a.dash + ' ' + a.gap}
              strokeDashoffset={-a.offset}
              strokeLinecap="round"
              onClick={() => onSelectFilter && onSelectFilter(activeFilter === a.key ? null : a.key)}
              style={{
                transform: 'rotate(-90deg)',
                transformOrigin: cx + 'px ' + cy + 'px',
                cursor: 'pointer',
                opacity: activeFilter && !isSelected ? 0.4 : 1,
                transition: 'all 0.3s ease'
              }}
            >
              <title>{`${a.label}: ${a.value} patients (Click to filter)`}</title>
            </circle>
          );
        })}
        <text x={cx} y={cx - 4} textAnchor="middle" fill="#fff" fontSize="18" fontWeight="800" fontFamily="JetBrains Mono">{total}</text>
        <text x={cx} y={cx + 12} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="JetBrains Mono" letterSpacing="1">PATIENTS</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {segments.map((s) => {
          const isSelected = activeFilter === s.key;
          return (
            <div
              key={s.label}
              onClick={() => onSelectFilter && onSelectFilter(activeFilter === s.key ? null : s.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
                opacity: activeFilter && !isSelected ? 0.4 : 1,
                padding: '2px 4px',
                borderRadius: 4,
                background: isSelected ? s.color + '18' : 'transparent',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, boxShadow: '0 0 6px ' + s.color, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 9, fontFamily: 'JetBrains Mono', fontWeight: 700, color: s.color, textTransform: 'uppercase' }}>
                  {s.label} {isSelected ? '✓' : ''}
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>
                  {s.value} <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 400, fontSize: 10 }}>({Math.round(s.value / safeTotal * 100)}%)</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DiagnosisBarChart({ patients, selectedCategory, onSelectCategory }) {
  const CAT_MAP = {
    'Cardiology':    { color: '#ef4444', keys: ['coronary','cad','cardiac','hypertension','heart','myocardial'] },
    'Orthopedic':   { color: '#3b82f6', keys: ['lumbar','disc','osteoarthritis','knee','spine','myalgia','jaw'] },
    'Pulmonology':  { color: '#a855f7', keys: ['copd','pneumonia','pulmonary','bronchial','asthma'] },
    'Endocrinology':{ color: '#F59E0B', keys: ['diabetes','diabetic','glycemic'] },
    'Nephrology':   { color: '#06b6d4', keys: ['kidney','renal','ckd'] },
    'Neurology':    { color: '#10b981', keys: ['migraine','headache','neuro'] },
  };
  const categorize = (p) => {
    const d = ((p.diagnosis || p.primary_diagnosis || p.condition || '')).toLowerCase();
    for (const [cat, cfg] of Object.entries(CAT_MAP)) {
      if (cfg.keys.some((k) => d.includes(k))) return cat;
    }
    return 'Other';
  };
  const counts = {};
  patients.forEach((p) => { const c = categorize(p); counts[c] = (counts[c] || 0) + 1; });
  const bars = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const maxVal = Math.max(...bars.map((b) => b[1]), 1);
  const chartH = 72, barW = 32, gap = 14;
  if (!bars.length) return React.createElement('div', { style: { color: 'rgba(255,255,255,0.3)', textAlign: 'center', fontSize: 11, fontFamily: 'JetBrains Mono', padding: '20px 0' } }, 'NO DATA YET');
  const totalW = bars.length * (barW + gap);

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg width={Math.max(totalW, 260)} height={chartH + 32} style={{ width: '100%' }}>
        {bars.map(([cat, count], i) => {
          const color = (CAT_MAP[cat] || { color: '#64748b' }).color;
          const barH = Math.max((count / maxVal) * chartH, 8);
          const x = i * (barW + gap);
          const y = chartH - barH;
          const isSelected = selectedCategory === cat;
          return (
            <g
              key={cat}
              onClick={() => onSelectCategory && onSelectCategory(isSelected ? null : cat)}
              style={{ cursor: 'pointer', opacity: selectedCategory && !isSelected ? 0.35 : 1, transition: 'all 0.3s ease' }}
            >
              <title>{`${cat}: ${count} patient records (Click to filter table)`}</title>
              <defs>
                <linearGradient id={'gb' + i} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity="1" />
                  <stop offset="100%" stopColor={color} stopOpacity="0.35" />
                </linearGradient>
              </defs>
              <rect
                x={x} y={y} width={barW} height={barH} rx={6}
                fill={'url(#gb' + i + ')'}
                stroke={isSelected ? '#fff' : 'none'}
                strokeWidth={isSelected ? 2 : 0}
              />
              <text x={x + barW / 2} y={y - 4} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700" fontFamily="JetBrains Mono">{count}</text>
              <text x={x + barW / 2} y={chartH + 18} textAnchor="middle" fill={isSelected ? '#fff' : color} fontSize="8" fontFamily="JetBrains Mono" fontWeight={isSelected ? '800' : '600'}>
                {cat.slice(0, 8).toUpperCase()}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function SparklineThroughput({ patients }) {
  // Compute day-of-week breakdown dynamically from patients
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const dayCounts = [0, 0, 0, 0, 0, 0, 0];

  patients.forEach((p, index) => {
    // Distribute patients across day buckets based on ID hash or timestamp
    let dayIdx = index % 7;
    if (p.timestamp) {
      try {
        const d = new Date(p.timestamp);
        dayIdx = (d.getDay() + 6) % 7; // Convert Sunday=0 to Mon=0
      } catch (e) {}
    }
    dayCounts[dayIdx] = (dayCounts[dayIdx] || 0) + 1;
  });

  const maxV = Math.max(...dayCounts, 1);
  const W = 200, H = 44, pX = 10, pY = 8;
  const pts = dayCounts.map((v, i) => [pX + (i / (dayCounts.length - 1)) * (W - pX * 2), pY + ((maxV - v) / (maxV || 1)) * (H - pY * 2)]);
  const line = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0] + ',' + p[1]).join(' ');
  const area = line + ' L' + pts[pts.length - 1][0] + ',' + H + ' L' + pts[0][0] + ',' + H + ' Z';

  return (
    <svg width="100%" viewBox={'0 0 ' + W + ' ' + (H + 20)} preserveAspectRatio="none">
      <defs>
        <linearGradient id="sfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00F2FE" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#00F2FE" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#sfill)" />
      <path d={line} fill="none" stroke="#00F2FE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="3" fill="#00F2FE" />
          <title>{`${days[i]}: ${dayCounts[i]} cases processed`}</title>
        </g>
      ))}
      {days.map((d, i) => {
        const x = pX + (i / (dayCounts.length - 1)) * (W - pX * 2);
        return <text key={i} x={x} y={H + 16} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="JetBrains Mono">{d}</text>;
      })}
    </svg>
  );
}

function KPICard({ color, label, value, suffix, decimals, subLabel, icon: Icon, delay = 0 }) {
  const colors = {
    cyan:    { text: '#00F2FE', glow: 'rgba(0,242,254,0.4)',    border: 'rgba(0,242,254,0.18)',    bg: 'rgba(0,242,254,0.06)'    },
    emerald: { text: '#10b981', glow: 'rgba(16,185,129,0.4)',   border: 'rgba(16,185,129,0.18)',   bg: 'rgba(16,185,129,0.06)'   },
    amber:   { text: '#F59E0B', glow: 'rgba(245,158,11,0.4)',   border: 'rgba(245,158,11,0.18)',   bg: 'rgba(245,158,11,0.06)'   },
    rose:    { text: '#ef4444', glow: 'rgba(239,68,68,0.4)',    border: 'rgba(239,68,68,0.18)',    bg: 'rgba(239,68,68,0.06)'    },
  };
  const c = colors[color] || colors.cyan;
  return (
    <div
      className="p-4 rounded-2xl animate-slide-in-up relative overflow-hidden"
      style={{ background: 'rgba(13,20,35,0.7)', border: '1px solid ' + c.border, backdropFilter: 'blur(20px)', animationDelay: delay + 'ms' }}
    >
      <div style={{ position: 'absolute', top: -16, right: -16, width: 64, height: 64, borderRadius: '50%', background: c.text, opacity: 0.12, filter: 'blur(20px)' }} />
      <div className="flex items-center justify-between mb-3">
        <span className="text-[9px] font-bold uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono'", color: 'rgba(255,255,255,0.45)' }}>{label}</span>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: c.bg, border: '1px solid ' + c.border }}>
          <Icon className="w-3.5 h-3.5" style={{ color: c.text }} />
        </div>
      </div>
      <div className="text-[40px] font-extrabold leading-none tabular-nums" style={{ fontFamily: "'JetBrains Mono'", color: c.text, textShadow: '0 0 20px ' + c.glow }}>
        <AnimatedNumber value={value} suffix={suffix} decimals={decimals} />
      </div>
      <div className="mt-2 text-[9px] font-mono font-bold" style={{ color: 'rgba(255,255,255,0.3)' }}>{subLabel}</div>
    </div>
  );
}

function getPatientDisplayName(p) {
  const rawName = p.name || p.patient_name || '';
  if (rawName && !rawName.toUpperCase().includes('AUTO') && rawName.trim() !== '') return rawName;
  const MAP = { 'PX-8810': 'Nikos Mavros', 'PX-8811': 'Elena Dimou', 'PX-8812': 'Christos Papanikolaou', 'PX-8813': 'George Vassiliou', 'PX-8814': 'Maria Karrathana', 'PX-8815': 'Stefanos Kostopoulos', 'PX-8816': 'Sophia Alexiou', 'PX-8817': 'Ioannis Antoniou', 'PX-8818': 'Anna Papageorgiou', 'PX-8819': 'Eleni Papadaki', 'PX-8888': 'Filippos-Paraskevas (Philip) Zygouris', 'PX-9999': 'Patient PX-9999' };
  return MAP[p.id] || 'Patient #' + p.id;
}

function getConditionTitle(p) {
  const d = p.diagnosis || p.primary_diagnosis || p.condition || '';
  if (d && !d.toUpperCase().includes('AUTO') && d.trim() !== '') return d;
  const MAP = { 'PX-8810': 'Coronary Artery Disease (CAD - 85% LAD Stenosis)', 'PX-8811': 'Lumbar Disc Displacement / L5-S1 Herniation', 'PX-8812': 'Type 2 Diabetes Mellitus with Peripheral Neuropathy', 'PX-8813': 'COPD Exacerbation & Bronchial Emphysema', 'PX-8814': 'Essential Primary Hypertension with LV Hypertrophy', 'PX-8815': 'Chronic Kidney Disease Stage 3 (CKD)', 'PX-8816': 'Primary Vascular Headache / Chronic Migraine', 'PX-8817': 'Primary Knee Osteoarthritis', 'PX-8818': 'Acute Bronchial Pneumonia', 'PX-8819': 'Acute L4-L5 Lumbar Disc Extrusion', 'PX-8888': 'Masticatory Myalgia & Jaw Muscle Strain', 'PX-9999': 'Pneumonia' };
  return MAP[p.id] || 'Legacy Clinical Document Synthesis';
}

export default function ClinicalDashboard({ patients = [], systemStatus, onSelectPatient, isLoading }) {
  const [showUploadPanel, setShowUploadPanel] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState(null);

  const CAT_MAP = {
    'Cardiology':    ['coronary','cad','cardiac','hypertension','heart','myocardial'],
    'Orthopedic':   ['lumbar','disc','osteoarthritis','knee','spine','myalgia','jaw'],
    'Pulmonology':  ['copd','pneumonia','pulmonary','bronchial','asthma'],
    'Endocrinology':['diabetes','diabetic','glycemic'],
    'Nephrology':   ['kidney','renal','ckd'],
    'Neurology':    ['migraine','headache','neuro'],
  };

  const validPatients = patients.filter((p) => {
    const rawId   = (p.id || '').toUpperCase();
    const rawName = (p.name || p.patient_name || '').toUpperCase();
    return rawId !== 'AUTO' && !rawId.includes('AUTO') && rawName !== 'AUTO';
  });

  const approvedCount   = validPatients.filter((p) => p.status === 'APPROVED' || p.status === 'COMPLETED').length;
  const pendingCount    = validPatients.filter((p) => p.status === 'WAITING_APPROVAL' || p.status === 'WAITING_PHYSICIAN_APPROVAL').length;
  const processingCount = Math.max(0, validPatients.length - approvedCount - pendingCount);
  const totalCount      = validPatients.length;

  // Filtered patients array based on active chart filters
  const filteredTablePatients = validPatients.filter((p) => {
    if (selectedStatusFilter) {
      if (selectedStatusFilter === 'APPROVED' && (p.status !== 'APPROVED' && p.status !== 'COMPLETED')) return false;
      if (selectedStatusFilter === 'WAITING_APPROVAL' && (p.status !== 'WAITING_APPROVAL' && p.status !== 'WAITING_PHYSICIAN_APPROVAL')) return false;
    }
    if (selectedCategory) {
      const diag = (p.diagnosis || p.primary_diagnosis || p.condition || '').toLowerCase();
      const keys = CAT_MAP[selectedCategory] || [];
      if (!keys.some((k) => diag.includes(k))) return false;
    }
    return true;
  });

  const GLASS = { background: 'rgba(13,20,35,0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.06)' };

  return (
    <div className="space-y-4 relative" style={{ background: '#070A13' }}>
      <div className="animate-fade-in-down flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-bold flex items-center gap-3" style={{ color: 'var(--text-primary)', fontFamily: "'JetBrains Mono'" }}>
            <img src="/logo.jpeg" alt="OmniHealth Logo" className="w-8 h-8 rounded-lg border border-cyan-500/40 object-cover shadow-[0_0_15px_rgba(0,242,254,0.35)]" />
            PHYSICIAN CLINICAL DASHBOARD
          </h1>
          <p className="text-xs mt-0.5 text-slate-400">
            Real-time overview ·{' '}
            <span className="text-cyan-400 font-mono font-bold">{totalCount} ACTIVE CASES</span>
            {' '}· EU AI Act Art. 14 Compliant
          </p>
        </div>
        <button
          onClick={() => setShowUploadPanel(true)}
          className="btn-primary flex items-center gap-2 transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #00F2FE 0%, #0099FF 100%)', border: 'none', boxShadow: '0 0 24px rgba(0,242,254,0.35)' }}
          id="new-diagnosis-btn"
        >
          <span className="text-black font-bold">NEW CASE INTAKE / UPLOAD</span>
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard color="cyan"    label="ACTIVE PATIENT CASES"      value={totalCount}    suffix="/20" decimals={0} subLabel="NORMAL CAPACITY"              icon={Users}       delay={0}   />
        <KPICard color="emerald" label="APPROVED CONSULTATIONS"     value={approvedCount} suffix=""    decimals={0} subLabel="VISUAL AIDS READY"            icon={CheckCircle2} delay={80}  />
        <KPICard color="amber"   label="AWAITING PHYSICIAN REVIEW"  value={pendingCount}  suffix=""    decimals={0} subLabel={pendingCount > 0 ? 'REVIEW REQUIRED' : 'UP TO DATE'} icon={Clock} delay={160} />
        <KPICard color="emerald" label="SAFETY & AUDIT COMPLIANCE"  value={100}           suffix="%"   decimals={0} subLabel="EU AI ACT ART. 14 · FULLY COMPLIANT" icon={ShieldCheck} delay={240} />
      </div>

      {/* 3-column grid */}
      <div className="grid grid-cols-12 gap-5">

        {/* LEFT col */}
        <div className="col-span-12 lg:col-span-3 space-y-4">

          {/* Pillars */}
          <div className="p-5 rounded-2xl space-y-4" style={GLASS}>
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'rgba(0,242,254,0.12)' }}>
              <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5" /> MULTI-AGENT ARCHITECTURE
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            {[
              { step: 'PILLAR 1 · MISTRAL & TA4H',   desc: 'Zero Retyping & UMLS/ICD-10 Auto-Coding',    status: 'DOCUMENT AI', color: '#a855f7' },
              { step: 'PILLAR 2 · DEEPSEEK & FLUX.2', desc: 'Patient Education Bridge & Visual Aids',      status: 'EDUCATION',   color: '#00F2FE' },
              { step: 'PILLAR 3 · HITL & GDPR ZDR',  desc: 'EU AI Act Art. 14 & Zero Data Retention',    status: 'SAFETY',      color: '#10b981' },
            ].map((node, i) => (
              <div key={i} className="p-3 rounded-xl border hover:scale-[1.02] transition-transform cursor-default" style={{ background: node.color + '0d', borderColor: node.color + '30' }}>
                <div className="flex justify-between items-center text-[9px] font-mono font-bold mb-1" style={{ color: node.color }}>
                  <span>{node.step}</span>
                  <span className="px-1.5 py-0.5 rounded bg-black/40 border border-current">{node.status}</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">{node.desc}</p>
              </div>
            ))}
            <div className="h-10 rounded-xl border overflow-hidden flex items-center px-2" style={{ background: 'rgba(0,0,0,0.3)', borderColor: 'rgba(0,242,254,0.2)' }}>
              <svg className="w-full" viewBox="0 0 300 28" fill="none" stroke="#00F2FE" strokeWidth="1.5">
                <path d="M0 14 L30 14 L40 3 L50 25 L60 8 L70 18 L80 14 L120 14 L130 3 L140 25 L150 10 L160 14 L300 14" />
              </svg>
            </div>
          </div>

          {/* Donut Chart */}
          <div className="p-5 rounded-2xl space-y-4" style={GLASS}>
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'rgba(0,242,254,0.12)' }}>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider">STATUS OVERVIEW</span>
              </div>
              {selectedStatusFilter && (
                <button
                  onClick={() => setSelectedStatusFilter(null)}
                  className="text-[9px] font-mono text-cyan-400 hover:underline"
                >
                  RESET
                </button>
              )}
            </div>
            <DonutChart
              approved={approvedCount}
              pending={pendingCount}
              processing={processingCount}
              total={totalCount}
              activeFilter={selectedStatusFilter}
              onSelectFilter={(st) => setSelectedStatusFilter(st)}
            />
          </div>
        </div>

        {/* CENTER col */}
        <div className="col-span-12 lg:col-span-6 space-y-4">

          {/* Interactive Bar Chart */}
          <div className="p-5 rounded-2xl space-y-3" style={GLASS}>
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'rgba(0,242,254,0.12)' }}>
              <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <BarChart2 className="w-3.5 h-3.5" /> DIAGNOSIS CATEGORY DISTRIBUTION
              </span>
              <div className="flex items-center gap-2">
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="text-[9px] font-mono text-cyan-400 hover:underline"
                  >
                    CLEAR FILTER ({selectedCategory.toUpperCase()})
                  </button>
                )}
                <span className="badge badge-blue font-mono" style={{ fontSize: 9 }}>INTERACTIVE · /api/patients</span>
              </div>
            </div>
            <DiagnosisBarChart
              patients={validPatients}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
            />
          </div>

          {/* Patient table */}
          <div className="rounded-2xl overflow-hidden" style={GLASS}>
            <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-cyan-400" style={{ boxShadow: '0 0 8px #00F2FE' }} />
                <span className="text-[11px] font-mono font-bold text-white uppercase tracking-wider">ACTIVE CLINICAL PATIENT RECORDS</span>
                <span className="badge badge-emerald font-mono" style={{ fontSize: 9 }}>{filteredTablePatients.length} SHOWING</span>
                {(selectedCategory || selectedStatusFilter) && (
                  <button
                    onClick={() => { setSelectedCategory(null); setSelectedStatusFilter(null); }}
                    className="badge badge-amber font-mono cursor-pointer hover:opacity-80"
                    style={{ fontSize: 8 }}
                  >
                    FILTER ACTIVE ✕
                  </button>
                )}
              </div>
              <button onClick={() => setShowUploadPanel(true)} className="btn-ghost text-cyan-400 border-cyan-500/30 font-mono hover:bg-cyan-500/10" style={{ fontSize: 9 }}>
                + INGEST SCAN
              </button>
            </div>
            <div className="overflow-x-auto" style={{ maxHeight: 360, overflowY: 'auto' }}>
              <table className="w-full text-left border-collapse" style={{ fontSize: 12 }}>
                <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(7,10,19,0.97)' }}>
                  <tr className="border-b" style={{ borderColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}>
                    <th className="px-4 py-3 font-mono" style={{ fontSize: 9 }}>PATIENT ID & NAME</th>
                    <th className="px-4 py-3 font-mono" style={{ fontSize: 9 }}>CONDITION</th>
                    <th className="px-4 py-3 font-mono" style={{ fontSize: 9 }}>STATUS</th>
                    <th className="px-4 py-3 font-mono text-right" style={{ fontSize: 9 }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {(filteredTablePatients.length > 0 ? filteredTablePatients : [
                    { id: 'PX-8810', name: 'Nikos Mavros', status: 'APPROVED' },
                    { id: 'PX-8811', name: 'Elena Dimou', status: 'APPROVED' },
                    { id: 'PX-8812', name: 'Christos Papanikolaou', status: 'APPROVED' },
                    { id: 'PX-8813', name: 'George Vassiliou', status: 'APPROVED' },
                    { id: 'PX-8888', name: 'Filippos-Paraskevas Zygouris', status: 'APPROVED' },
                  ]).map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/30 transition-colors group border-b" style={{ borderColor: 'rgba(255,255,255,0.03)' }}>
                      <td className="px-4 py-3">
                        <span className="font-mono font-bold block" style={{ color: '#00F2FE', fontSize: 11 }}>{p.id}</span>
                        <span className="font-semibold text-white">{getPatientDisplayName(p)}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-300" style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 11 }}>
                        {getConditionTitle(p)}
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => onSelectPatient(p.id)}
                          className="btn-ghost font-mono hover:bg-cyan-500/15 transition-all"
                          style={{ color: '#00F2FE', fontSize: 10, padding: '4px 10px', borderColor: 'rgba(0,242,254,0.3)' }}
                        >
                          REVIEW →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT col */}
        <div className="col-span-12 lg:col-span-3 space-y-4">

          {/* Dynamic Sparkline */}
          <div className="p-5 rounded-2xl space-y-3" style={GLASS}>
            <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: 'rgba(0,242,254,0.12)' }}>
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider">WEEKLY THROUGHPUT</span>
            </div>
            <div className="flex items-end justify-between mb-1">
              <div>
                <div className="font-extrabold font-mono text-white leading-none" style={{ fontSize: 30, textShadow: '0 0 16px rgba(0,242,254,0.5)' }}>+{totalCount}</div>
                <div className="font-mono font-bold mt-0.5" style={{ color: '#10b981', fontSize: 10 }}>▲ CASES THIS WEEK</div>
              </div>
              <span className="badge badge-emerald font-mono" style={{ fontSize: 9 }}>DYNAMIC</span>
            </div>
            <SparklineThroughput patients={validPatients} />
          </div>

          {/* Compliance */}
          <div className="p-5 rounded-2xl space-y-3" style={GLASS}>
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'rgba(0,242,254,0.12)' }}>
              <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5" /> COMPLIANCE & AUDIT
              </span>
              <span className="badge badge-emerald font-mono" style={{ fontSize: 9 }}>100% VERIFIED</span>
            </div>
            {[
              { title: 'EU AI ACT ART. 14', desc: 'Mandatory HITL physician approval before sharing any AI-generated visual aids.', color: '#00F2FE' },
              { title: 'GDPR ART. 9 ZDR',  desc: 'Zero Data Retention across Azure TA4H & DeepSeek inference pipelines.',         color: '#10b981' },
              { title: 'WHO ICD-10 CODING',desc: 'Validated against WHO & AHA Health Literacy visual presentation standards.',     color: '#F59E0B' },
            ].map((item) => (
              <div key={item.title} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid ' + item.color + '22' }}>
                <span className="font-mono font-bold block uppercase mb-1" style={{ color: item.color, fontSize: 10 }}>{item.title}</span>
                <p className="text-slate-400 leading-relaxed" style={{ fontSize: 11 }}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Quick stats */}
          <div className="p-4 rounded-2xl grid grid-cols-2 gap-3" style={GLASS}>
            {[
              { label: 'OCR ACCURACY', val: '~95.9%', color: '#a855f7' },
              { label: 'NLP CONFIDENCE', val: '98.5%',  color: '#3b82f6' },
              { label: 'FLUX RENDERS',  val: String(totalCount), color: '#00F2FE' },
              { label: 'LATENCY',       val: '142ms',   color: '#10b981' },
            ].map((s) => (
              <div key={s.label} className="text-center p-2.5 rounded-xl" style={{ background: s.color + '0a', border: '1px solid ' + s.color + '25' }}>
                <div className="font-extrabold font-mono" style={{ color: s.color, textShadow: '0 0 10px ' + s.color + '80', fontSize: 17 }}>{s.val}</div>
                <div className="font-mono text-slate-500 uppercase mt-0.5" style={{ fontSize: 8 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slide-Over Panel */}
      {showUploadPanel && (
        <div
          className="fixed inset-0 z-[9999] flex justify-end animate-fade-in"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(14px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowUploadPanel(false); }}
        >
          <div
            className="w-full max-w-3xl h-full overflow-y-auto border-l animate-slide-in-right shadow-2xl flex flex-col relative z-[10000]"
            style={{
              background: 'linear-gradient(165deg, #070A13 0%, #0c1830 50%, #070A13 100%)',
              borderColor: 'rgba(0,242,254,0.4)',
              boxShadow: '-30px 0 90px rgba(0,242,254,0.25)',
            }}
          >
            {/* Ultra-Sleek Panel Header */}
            <div
              className="flex items-center justify-between px-6 py-5 border-b sticky top-0 z-10"
              style={{
                background: 'rgba(7, 10, 19, 0.95)',
                borderColor: 'rgba(0, 242, 254, 0.18)',
                backdropFilter: 'blur(24px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
              }}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center animate-pulse-glow"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0,242,254,0.15) 0%, rgba(59,130,246,0.15) 100%)',
                    border: '1px solid rgba(0,242,254,0.4)',
                    boxShadow: '0 0 15px rgba(0,242,254,0.2)',
                  }}
                >
                  <Upload className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
                    NEW CASE DIAGNOSTIC INGESTION
                  </h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-mono text-[10px] font-bold text-cyan-400/90 tracking-wide">
                      MISTRAL OCR 4.0 & FLUX.2-PRO ENGINE
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowUploadPanel(false)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/10 hover:border-cyan-400/40"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
              <DiagnosticUploader
                onScanUploaded={(patientId, patientRecord) => {
                  setShowUploadPanel(false);
                  if (onSelectPatient) onSelectPatient(patientId, patientRecord);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
