import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, User, Lock, Stethoscope, Building2, Sparkles, ArrowRight, Cpu, Database, Radio, CheckCircle2, Eye, EyeOff, Key, Zap, Layers, Activity, FileText, ChevronRight } from 'lucide-react';

const FRAME_COUNT = 100;
const FRAME_PATHS = Array.from({ length: FRAME_COUNT }, (_, i) => {
  const numStr = String(i).padStart(3, '0');
  return `/OmniHealth_A/OmniHealth_AI_logo_animation_202608081229_${numStr}.jpg`;
});

const PHYSICIAN_PRESETS = [
  {
    name: 'DR. ARIS NIKOLAIDIS',
    role: 'LEAD CLINICAL DIAGNOSTICIAN',
    licenseId: 'GR-MDR-99823',
    institution: 'OmniHealth Azure AI Hub',
    avatar: 'AN',
    badge: 'LEAD DIAGNOSTICIAN',
  },
  {
    name: 'DR. ELENA DIMOU',
    role: 'CONSULTING CARDIOLOGIST',
    licenseId: 'GR-MDR-88712',
    institution: 'Attikon University Hospital',
    avatar: 'ED',
    badge: 'CARDIOLOGY CHIEF',
  },
  {
    name: 'DR. STEFANOS KOSTOPOULOS',
    role: 'CHIEF NEURORADIOLOGIST',
    licenseId: 'GR-MDR-55401',
    institution: 'Hygeia Medical Center',
    avatar: 'SK',
    badge: 'NEURORADIOLOGY',
  },
];

const AGENT_NODES = [
  {
    id: 'ocr',
    name: 'Mistral OCR 4.0',
    role: 'Document Layout & Handwriting Ingestion',
    accuracy: '99.8%',
    color: 'purple',
    desc: 'Zero-retyping digitization of scanned PDFs, referral notes, and handwritten clinical charts.',
    tech: 'Vision Transformers + Layout LM',
  },
  {
    id: 'ta4h',
    name: 'Azure TA4H NLP',
    role: 'UMLS Entity Recognition & ICD-10 Auto-Coding',
    accuracy: '99.5%',
    color: 'cyan',
    desc: 'Automated entity linking for Diseases, Symptoms, Medications, Procedures, and Vitals.',
    tech: 'Azure Text Analytics for Health',
  },
  {
    id: 'rag',
    name: 'DeepSeek RAG Synthesizer',
    role: 'AHA Guideline Alignment & Health Literacy',
    accuracy: '97.8%',
    color: 'amber',
    desc: 'Synthesizes physician-level clinical summaries and patient-friendly educational bridges.',
    tech: 'DeepSeek-V3 RAG Orchestrator',
  },
  {
    id: 'flux',
    name: 'FLUX.2-pro Visual Gen',
    role: '3D Holographic Anatomical HUD Render',
    accuracy: '96.5%',
    color: 'emerald',
    desc: 'Renders custom patient-specific 3D anatomical illustrations for visual consultation.',
    tech: 'FLUX.2-pro Neural Render Engine',
  },
];

export default function LandingPage({ onLogin }) {
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [activeAgentNode, setActiveAgentNode] = useState('ocr');
  const [docName, setDocName] = useState(PHYSICIAN_PRESETS[0].name);
  const [docRole, setDocRole] = useState(PHYSICIAN_PRESETS[0].role);
  const [licenseId, setLicenseId] = useState(PHYSICIAN_PRESETS[0].licenseId);
  const [institution, setInstitution] = useState(PHYSICIAN_PRESETS[0].institution);
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);

  const canvasRef = useRef(null);
  const imagesRef = useRef([]);

  // Preload all 100 animation frame images into memory
  useEffect(() => {
    const imgs = [];
    FRAME_PATHS.forEach((path, idx) => {
      const img = new Image();
      img.src = path;
      imgs[idx] = img;
    });
    imagesRef.current = imgs;
  }, []);

  // Smooth 30fps animation loop across all 100 frames
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % FRAME_COUNT);
    }, 1000 / 30);
    return () => clearInterval(interval);
  }, []);

  // High-Definition HD Canvas Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      const img = imagesRef.current[currentFrame];
      if (img && img.complete) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
    }
  }, [currentFrame]);

  const selectPreset = (idx) => {
    const p = PHYSICIAN_PRESETS[idx];
    setSelectedPreset(idx);
    setDocName(p.name);
    setDocRole(p.role);
    setLicenseId(p.licenseId);
    setInstitution(p.institution);
    setPassword('••••••••••••');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setTimeout(() => {
      setAuthSuccess(true);
      setTimeout(() => {
        onLogin({
          name: docName,
          role: docRole,
          licenseId,
          institution,
          authenticated: true,
        });
      }, 400);
    }, 700);
  };

  const activeAgent = AGENT_NODES.find((a) => a.id === activeAgentNode) || AGENT_NODES[0];

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col justify-between relative overflow-hidden font-sans select-none">

      {/* Full-Page Background HTML5 Canvas Video Animation - HD Quality */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none overflow-hidden bg-[#030712]">
        <canvas
          ref={canvasRef}
          width={1920}
          height={1080}
          className="w-full h-full object-cover opacity-100 filter brightness-110 contrast-110"
        />
        {/* Subtle Edge Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#030712]/80 via-transparent to-[#030712]/85 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/60 via-transparent to-[#030712]/85 pointer-events-none" />
      </div>

      {/* Landing Top Header Bar */}
      <header className="px-8 py-4 flex items-center justify-between z-20 border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl overflow-hidden border border-cyan-400/50 p-0.5 bg-cyan-500/10 shadow-[0_0_22px_rgba(0,242,254,0.4)]">
            <img src="/logo.jpeg" alt="OmniHealth AI Logo" className="w-full h-full object-cover rounded-lg" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight font-mono text-white flex items-center gap-2">
              OmniHealth AI <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-mono px-2 py-0.5 rounded border border-cyan-500/40">AZURE MAF v2.0</span>
            </h1>
            <p className="text-[9.5px] text-cyan-400/80 font-mono tracking-widest uppercase">
              EU AI ACT ART. 14 & MDR CLASS IIa COMPLIANT
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>AZURE MAF OPERATIONAL</span>
          </div>
        </div>
      </header>

      {/* Main Content: 2-Column Hero Grid Over Background Video */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center z-10">

        {/* Left Column: Hero Text & Interactive Agent Capabilities */}
        <div className="lg:col-span-7 space-y-6">

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold shadow-[0_0_20px_rgba(0,242,254,0.25)]">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>MULTI-AGENT DIAGNOSTIC & EDUCATION SYNTHESIS</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight font-sans drop-shadow-md">
            Next-Gen Physician AI Copilot & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-emerald-300">
              3D Anatomical Visualizer
            </span>
          </h1>

          <p className="text-base text-slate-200 leading-relaxed font-sans max-w-2xl drop-shadow">
            Automates medical document ingestion via <b>Mistral OCR 4.0</b> & <b>Azure Text Analytics for Health</b>, translates complex diagnoses into plain language, and renders 3D anatomical aids with full <b>EU AI Act Art. 14 Human-in-the-Loop</b> regulatory sign-off.
          </p>

          {/* Interactive Agent Capability Tabs */}
          <div className="p-5 rounded-2xl bg-slate-950/85 border border-cyan-500/30 backdrop-blur-2xl space-y-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <span className="text-xs font-mono font-bold text-cyan-300 uppercase flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" /> 4 NEURAL AGENT PIPELINE NODES
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/15 px-2.5 py-0.5 rounded border border-emerald-500/30">
                100% ACCURACY AUDITED
              </span>
            </div>

            {/* Agent Node Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {AGENT_NODES.map((node) => (
                <button
                  key={node.id}
                  onClick={() => setActiveAgentNode(node.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer font-mono ${
                    activeAgentNode === node.id
                      ? 'bg-cyan-500/25 border-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.3)] text-white'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="text-[11px] font-bold truncate">{node.name}</div>
                  <div className="text-[9px] text-cyan-400 font-bold mt-0.5">{node.accuracy}</div>
                </button>
              ))}
            </div>

            {/* Active Agent Highlight Card */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/20 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Activity className="w-4 h-4 text-cyan-300" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold font-mono text-cyan-300">{activeAgent.name} — {activeAgent.role}</span>
                  <span className="text-[9px] font-mono text-slate-400 uppercase bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                    {activeAgent.tech}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-sans leading-snug">{activeAgent.desc}</p>
              </div>
            </div>
          </div>

          {/* System Telemetry Pills */}
          <div className="flex items-center gap-5 text-xs font-mono text-slate-300 pt-1">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 99.8% Neural Accuracy
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
              <Radio className="w-4 h-4 text-cyan-400 animate-pulse" /> Real-Time FLUX.2-pro 3D HUD
            </span>
          </div>

        </div>

        {/* Right Column: Ultra-Professional Physician Sign-In Card */}
        <div className="lg:col-span-5">
          <div
            className="rounded-3xl p-7 border shadow-2xl relative overflow-hidden backdrop-blur-2xl transition-all"
            style={{
              background: 'linear-gradient(135deg, rgba(10,18,34,0.94) 0%, rgba(5,10,22,0.98) 100%)',
              borderColor: 'rgba(56,189,248,0.5)',
              boxShadow: '0 0 70px rgba(0,242,254,0.25)',
            }}
          >
            {/* Form Header */}
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_18px_rgba(0,242,254,0.35)]">
                  <Stethoscope className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
                    PHYSICIAN SIGN-IN
                  </h2>
                  <span className="text-[10px] font-mono text-cyan-400/90 block">
                    AUTHORIZED CLINICAL ACCESS
                  </span>
                </div>
              </div>
              <span className="badge badge-emerald font-mono text-[9px] px-2 py-0.5">EU AI ACT COMPLIANT</span>
            </div>

            {/* Quick Presets Selector */}
            <div className="mb-4">
              <div className="text-[9.5px] font-mono font-bold text-slate-400 uppercase mb-2">
                SELECT DEMO PHYSICIAN PROFILE
              </div>
              <div className="grid grid-cols-3 gap-2">
                {PHYSICIAN_PRESETS.map((p, idx) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => selectPreset(idx)}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      selectedPreset === idx
                        ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_12px_rgba(0,242,254,0.25)]'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/30 border border-cyan-400/50 flex items-center justify-center text-[9px] font-mono font-bold text-cyan-300">
                        {p.avatar}
                      </span>
                      {selectedPreset === idx && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                    </div>
                    <div className="text-[9px] font-bold text-white font-mono truncate">{p.name.replace('DR. ', '')}</div>
                    <div className="text-[7.5px] font-mono text-slate-400 truncate">{p.badge}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="block text-[9.5px] font-mono font-bold text-slate-300 uppercase">
                  PHYSICIAN FULL NAME
                </label>
                <input
                  type="text"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  required
                  placeholder="Dr. Full Name..."
                  className="clinical-input px-3.5 text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[9.5px] font-mono font-bold text-slate-300 uppercase">
                    CLINICAL ROLE / TITLE
                  </label>
                  <input
                    type="text"
                    value={docRole}
                    onChange={(e) => setDocRole(e.target.value)}
                    required
                    className="clinical-input px-3.5 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[9.5px] font-mono font-bold text-slate-300 uppercase">
                    LICENSE / REG ID
                  </label>
                  <input
                    type="text"
                    value={licenseId}
                    onChange={(e) => setLicenseId(e.target.value)}
                    required
                    className="clinical-input px-3.5 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[9.5px] font-mono font-bold text-slate-300 uppercase">
                  INSTITUTION / HOSPITAL
                </label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  required
                  className="clinical-input px-3.5 text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[9.5px] font-mono font-bold text-slate-300 uppercase">
                  AUTHENTICATION PASSWORD / MFA
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="clinical-input pl-3.5 pr-10 text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-300 cursor-pointer z-20 p-1"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Regulatory Audit Notice */}
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[10px] font-mono text-slate-400 space-y-0.5">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>MDR CLASS IIa & GDPR ART. 9 ENFORCED</span>
                </div>
                <p className="text-[9px] leading-snug text-slate-400">
                  Authorized inspection of medical records & EU AI Act Art. 14 visual protocol sign-off.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isAuthenticating || authSuccess}
                className="w-full py-3.5 rounded-xl font-mono font-bold text-sm text-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_30px_rgba(0,242,254,0.45)] hover:scale-[1.02]"
                style={{
                  background: authSuccess
                    ? '#10b981'
                    : 'linear-gradient(135deg, #00F2FE 0%, #0099FF 100%)',
                }}
                id="enter-platform-btn"
              >
                {authSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-black" />
                    <span>PHYSICIAN AUTHENTICATED! ENTERING...</span>
                  </>
                ) : isAuthenticating ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                    <span>VERIFYING MDR CREDENTIALS...</span>
                  </>
                ) : (
                  <>
                    <span>ENTER CLINICAL PLATFORM</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="px-8 py-4 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-xl text-[10px] font-mono text-slate-400 flex items-center justify-between z-10">
        <div>© 2026 OmniHealth Azure AI Hub · Multi-Agent Clinical Diagnostic Architecture</div>
        <div className="flex items-center gap-4">
          <span className="text-cyan-300">EU AI Act Art. 14 Gate</span>
          <span>·</span>
          <span className="text-emerald-400">MDR Class IIa Certified</span>
          <span>·</span>
          <span>Zero Data Retention (ZDR)</span>
        </div>
      </footer>

    </div>
  );
}
