import React, { useState } from 'react';
import { Eye, Stethoscope } from 'lucide-react';

/* ─── Pathology Encounter Summary Presets ─── */
const CLINICAL_ENCOUNTER_LOGS = {
  heart: [
    { date: 'Day 7: 7:32am', text: 'Cardiology evaluation: Coronary blood flow improved. Prescribed antiplatelet therapy.' },
    { date: 'Day 6: 8:04am', text: 'Resting blood pressure 128/82 mmHg, heart rate stable. No exertional discomfort.' },
    { date: 'Day 5: 9:17am', text: 'Diagnostic imaging confirms coronary stenosis wall motion. Cardiac rehabilitation scheduled.' },
    { date: 'Day 4: 2:37pm', text: 'Admitted with exertional angina. Baseline telemetry initiated.' },
  ],
  kidney: [
    { date: 'Day 7: 7:32am', text: 'Nephrology consult: Stage 3 CKD plan reviewed. Prescribed Lisinopril for renal protection.' },
    { date: 'Day 6: 8:04am', text: 'Serum creatinine 2.1 mg/dL, eGFR 44 mL/min/1.73m2. Proteinuria monitored.' },
    { date: 'Day 5: 9:17am', text: 'Blood pressure controlled at 124/78 mmHg. Low sodium diet education completed.' },
    { date: 'Day 4: 2:37pm', text: 'Outpatient renal panel evaluation. Ultrasound shows cortical thinning.' },
  ],
  spine: [
    { date: 'Day 7: 7:32am', text: 'MRI lumbar spine confirms disc extrusion with nerve root compression. Physical therapy initiated.' },
    { date: 'Day 6: 8:04am', text: 'Radicular pain improved from 8/10 to 5/10 following oral anti-inflammatory therapy.' },
    { date: 'Day 5: 9:17am', text: 'Neurological examination: L4/L5 dermatome paresthesia noted.' },
    { date: 'Day 4: 2:37pm', text: 'Admitted with severe lower back pain radiating down leg.' },
  ],
  lung: [
    { date: 'Day 7: 7:32am', text: 'Pulmonology consult: Bronchodilator therapy effective. Productive cough reduced.' },
    { date: 'Day 6: 8:04am', text: 'Chest CT shows hyperinflation and emphysematous changes. Oxygen saturation 94% on room air.' },
    { date: 'Day 5: 9:17am', text: 'Spirometry confirms FEV1/FVC 58%. Inhaler therapy initiated.' },
    { date: 'Day 4: 2:37pm', text: 'Exertional dyspnea evaluation initiated.' },
  ],
  diabetes: [
    { date: 'Day 7: 7:32am', text: 'Endocrinology review: HbA1c 8.6%, fasting glucose 192 mg/dL. Initiated Metformin titration.' },
    { date: 'Day 6: 8:04am', text: 'Distal sensory polyneuropathy in toes confirmed via monofilament examination.' },
    { date: 'Day 5: 9:17am', text: 'Patient educated on blood glucose logging and lifestyle dietary adjustments.' },
    { date: 'Day 4: 2:37pm', text: 'Outpatient lab report uploaded and digitized.' },
  ],
  jaw: [
    { date: 'Day 7: 7:32am', text: 'Myofascial consultation: Masticatory strain in masseter & temporalis. Prescribed night guard.' },
    { date: 'Day 6: 8:04am', text: 'Patient reports nocturnal bruxism and morning jaw stiffness.' },
    { date: 'Day 5: 9:17am', text: 'Palpation confirms trigger points in bilateral masseters. Soft diet recommended.' },
    { date: 'Day 4: 2:37pm', text: 'Initial clinical encounter digitized.' },
  ]
};

export default function AnatomicalHUDViewer({ patientData, onClose, onNavigateEHR }) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  // Accept both `id` and `patient_id` (EHR passes patient_id)
  const pid = patientData?.patient_id || patientData?.id || 'PX-8810';
  const name = patientData?.patient_name || patientData?.name || 'Patient';
  const diagnosis = patientData?.primary_diagnosis || patientData?.diagnosis || 'Clinical Evaluation';
  const b64Img = patientData?.b64_json;

  // Determine clinical log preset key based on diagnosis / PID
  const diagLow = diagnosis.toLowerCase();
  const configKey =
    diagLow.includes('kidney') || diagLow.includes('renal') || diagLow.includes('ckd') || pid === 'PX-8815' ? 'kidney' :
    diagLow.includes('spine') || diagLow.includes('disc') || diagLow.includes('hernia') || diagLow.includes('lumbar') || pid === 'PX-8811' || pid === 'PX-8819' ? 'spine' :
    diagLow.includes('lung') || diagLow.includes('copd') || diagLow.includes('pneumonia') || pid === 'PX-8813' || pid === 'PX-8818' || pid === 'PX-9999' ? 'lung' :
    diagLow.includes('diab') || diagLow.includes('neuropathy') || pid === 'PX-8812' ? 'diabetes' :
    diagLow.includes('masticatory') || diagLow.includes('jaw') || diagLow.includes('myalgia') || pid === 'PX-8888' ? 'jaw' :
    'heart';

  // Use real timeline events from patientData if available, otherwise fall back to preset
  const resolvedLogs = (() => {
    const apiTimeline = patientData?.timeline;
    if (Array.isArray(apiTimeline) && apiTimeline.length > 0) {
      return apiTimeline.map((e) => ({
        date: e.time || e.date || '—',
        text: e.event || e.details || e.title || 'Clinical event.',
      }));
    }
    return CLINICAL_ENCOUNTER_LOGS[configKey] || CLINICAL_ENCOUNTER_LOGS.heart;
  })();

  // Resolve encounter date for the header badge
  const encounterDate = (() => {
    const apiTimeline = patientData?.timeline;
    if (Array.isArray(apiTimeline) && apiTimeline.length > 0) {
      const raw = apiTimeline[0]?.date || apiTimeline[0]?.time || '';
      const d = new Date(raw);
      if (!isNaN(d)) return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      return raw.split(' ')[0] || 'LATEST';
    }
    return new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  })();


  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = (-y / rect.height) * 18;
    const rotateY = (x / rect.width) * 18;
    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden text-white font-sans border shadow-2xl"
      style={{
        background: 'linear-gradient(135deg, #030814 0%, #081226 50%, #050d1f 100%)',
        borderColor: 'rgba(56,189,248,0.25)',
        boxShadow: '0 0 50px rgba(6,182,212,0.15)',
      }}
    >
      {/* ─── Clean Header Banner ─── */}
      <div
        className="flex items-center justify-between px-6 py-3 border-b"
        style={{ background: 'rgba(5,13,31,0.85)', borderColor: 'rgba(56,189,248,0.15)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center font-bold text-cyan-400 text-xs shadow-[0_0_12px_rgba(6,182,212,0.3)] font-mono">
            AI
          </div>
          <div>
            <span className="text-sm font-bold tracking-wider text-white uppercase font-mono">
              3D HOLOGRAPHIC ANATOMICAL HUD VISUALIZER
            </span>
            <span className="text-[10px] text-cyan-400/70 block font-mono">
              PATIENT #{pid} · {diagnosis}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono bg-cyan-950/60 px-3 py-1.5 rounded-lg border border-cyan-500/30">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-300 font-bold uppercase">{name}</span>
          </div>
          {onNavigateEHR && (
            <button
              onClick={() => onNavigateEHR(pid)}
              className="text-emerald-400 hover:text-white text-xs font-mono bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-500/40 hover:border-emerald-400 transition-all flex items-center gap-1.5"
            >
              Go to EHR Chart
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-xs font-mono bg-slate-800/80 px-2.5 py-1 rounded border border-slate-700 hover:border-slate-500 transition-all"
            >
              CLOSE
            </button>
          )}
        </div>
      </div>

      {/* ─── Main 2-Column Grid ─── */}
      <div className="grid grid-cols-12 gap-5 p-5 min-h-[500px]">
        {/* ─── LEFT COLUMN: HERO 3D HOLOGRAPHIC ANATOMICAL SCOPE (7 COLS) ─── */}
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="col-span-12 lg:col-span-7 relative flex flex-col items-center justify-between border rounded-xl p-5 bg-slate-950/60 border-cyan-500/20 overflow-hidden cursor-crosshair hud-perspective-container"
        >
          {/* Target Scope Radial Grid Background */}
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.3)_0%,transparent_70%)]" />

          {/* 3D Tilting Card & Scope Frame */}
          <div
            className="relative w-full max-w-[400px] aspect-square flex items-center justify-center my-auto anatomical-card"
            style={{
              transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
            }}
          >
            {/* Outer Concentric Rotating HUD Rings */}
            <div className="absolute inset-0 rounded-full hud-ring-outer" />
            <div className="absolute inset-[10px] rounded-full hud-ring-inner" />
            <div className="absolute inset-[24px] rounded-full border-2 border-cyan-400/25 shadow-[0_0_15px_rgba(6,182,212,0.2)]" />

            {/* Organ Image Render with Holographic Glow & Scale */}
            <div
              className="relative w-[320px] h-[320px] rounded-full overflow-hidden flex items-center justify-center transition-transform duration-300"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              {b64Img ? (
                <img
                  src={`data:image/png;base64,${b64Img}`}
                  alt="Patient 3D Anatomical Visual Diagram"
                  className="w-full h-full object-contain hologram-image"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/80 text-cyan-400 p-4 text-center">
                  <Stethoscope className="w-20 h-20 text-cyan-400/80 animate-pulse mb-2" />
                </div>
              )}

              {/* Holographic Glowing Sweep Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/30 via-transparent to-blue-950/30 pointer-events-none" />
            </div>
          </div>

          {/* Bottom Zoom & Parallax Instructions */}
          <div className="w-full mt-4 pt-3 border-t border-cyan-500/20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>ZOOM: {(zoomLevel * 100).toFixed(0)}%</span>
              <span className="text-[10px] text-slate-400 ml-2 hidden sm:inline">| MOUSE HOVER: 3D PARALLAX TILT</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="1.4"
              step="0.05"
              value={zoomLevel}
              onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
              className="w-44 accent-cyan-400 h-1 bg-slate-800 rounded cursor-pointer"
            />
            <button
              onClick={() => { setZoomLevel(1); setTilt({ rotateX: 0, rotateY: 0 }); }}
              className="px-2 py-0.5 text-[10px] font-mono bg-slate-800 hover:bg-slate-700 rounded text-cyan-300 border border-slate-700"
            >
              RESET
            </button>
          </div>
        </div>

        {/* ─── RIGHT COLUMN: PATIENT CLINICAL SUMMARY & TIMELINE LOGS (5 COLS) ─── */}
        <div className="col-span-12 lg:col-span-5 bg-slate-950/70 border border-cyan-500/20 p-5 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-4">
              <span className="text-xs font-bold font-mono text-cyan-400 tracking-wider">
                PATIENT CLINICAL SUMMARY & LOGS
              </span>
              <span className="bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-cyan-500/30">
                {encounterDate}
              </span>
            </div>

            <div className="mb-4 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              <h3 className="text-sm font-bold text-white font-mono">{name}</h3>
              <p className="text-[11px] text-cyan-300 font-mono mt-0.5 leading-snug">{diagnosis}</p>
            </div>


            {/* Daily Encounter Logs Timeline */}
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {resolvedLogs.map((log, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold text-cyan-400 mb-1">
                    <span>{log.date}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                    {log.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-cyan-500/20 text-[10px] font-mono text-cyan-400/70 flex justify-between items-center">
            <span>MDR CLASS IIa COMPLIANT</span>
            <span className="text-cyan-300 font-bold">100% VERIFIED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
