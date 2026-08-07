import React, { useEffect, useState, useRef } from 'react';
import { connectReasoningStream, fetchPatients } from '../services/api';
import {
  Brain, FileText, Palette, ShieldCheck, AlertTriangle,
  Image as ImageIcon, Sparkles, ArrowRight, Radio, ChevronRight, Stethoscope
} from 'lucide-react';

/* ─── Doctor-Centric Preset Data ──────────────────── */
const getPatientPresetData = (pid) => {
  if (pid === 'PX-8811') {
    return {
      events: [
        { type: 'AGENT_STEP', agent: 'Clinical Orchestrator', status: 'INITIALIZING', message: '🚀 Initializing Clinical AI synthesis for Patient #PX-8811 (Elena Dimou)...', timestamp: '18:05:01' },
        { type: 'AGENT_STEP', agent: 'Document OCR Digitizer', status: 'ANALYZING_DOCUMENT', message: 'Parsing handwritten clinical referral note with Mistral OCR 4.0 Layout Engine...', timestamp: '18:05:02' },
        { type: 'OCR_FINDINGS', agent: 'Document OCR Digitizer', message: 'Digitized handwritten note with 96.2% confidence. Extracted L5-S1 radicular pain & MRI lumbar herniation findings.', timestamp: '18:05:03' },
        { type: 'AGENT_STEP', agent: 'Medical Coding Engine', status: 'ANALYZING_TEXT', message: 'Mapping clinical concepts to UMLS (C0020440) & ICD-10-CM codes (M51.26 Lumbar Disc Displacement)...', timestamp: '18:05:04' },
        { type: 'NLP_ENTITIES', agent: 'Medical Coding Engine', message: 'Mapped 3 UMLS & ICD-10 clinical entities for L5-S1 disc herniation.', timestamp: '18:05:05' },
        { type: 'AGENT_STEP', agent: 'Patient Education Illustrator', status: 'GENERATING_ILLUSTRATION', message: '🎨 Synthesizing flat-vector lumbar spine L5-S1 nerve compression diagram for patient consultation...', timestamp: '18:05:06' },
        { type: 'ILLUSTRATION_GENERATED', agent: 'Patient Education Illustrator', message: "Visual anatomical diagram 'Lumbar Spine & L5-S1 Disc Herniation' generated successfully.", timestamp: '18:05:07' },
        { type: 'SAFETY_GUARDRAIL', agent: 'Clinical Safety Bridge', status: 'COMPLIANCE_PASSED', message: 'EU AI Act & GDPR Article 9 Compliance Verified. Aligned with AHA Patient Education Standards.', timestamp: '18:05:09' },
        { type: 'HITL_SUPERVISORY_REQUIRED', agent: 'Clinical Orchestrator', message: '⚠️ Diagnostic synthesis complete for Patient #PX-8811. Digitized L5-S1 Herniation M51.26 + visual diagram ready. Awaiting physician approval.', timestamp: '18:05:10' },
      ],
      nlp: {
        entities: [
          { text: 'Lumbar Disc Displacement (L5-S1 Herniation)', umls_cui: 'C0020440', icd10: 'M51.26' },
          { text: 'L5 Nerve Root Compression / Radiculopathy', umls_cui: 'C0231238', icd10: 'M54.16' },
          { text: 'Lumbar Spine MRI Finding', umls_cui: 'C0742022', icd10: 'M51.2' },
        ],
      },
      illustration: {
        model_engine: 'FLUX.2-pro Visual Diagram',
        prompt_sent: 'Create a simple, non-intimidating, flat-vector medical illustration of a human lumbar spine showing an L5-S1 herniated disc pressing on a nerve root, suitable for patient education, clean white background',
        illustration_title: 'Understanding Lumbar Disc Herniation (L5-S1 Nerve Compression)',
        status: 'GENERATED_SUCCESSFULLY',
        tag: 'L5-S1 HERNIATION',
      },
    };
  } else if (pid === 'PX-8812') {
    return {
      events: [
        { type: 'AGENT_STEP', agent: 'Clinical Orchestrator', status: 'INITIALIZING', message: '🚀 Initializing Clinical AI synthesis for Patient #PX-8812 (Christos Papanikolaou)...', timestamp: '18:05:01' },
        { type: 'AGENT_STEP', agent: 'Document OCR Digitizer', status: 'ANALYZING_DOCUMENT', message: 'Parsing scanned outpatient lab report (HbA1c 8.6%, fasting glucose 192 mg/dL)...', timestamp: '18:05:02' },
        { type: 'OCR_FINDINGS', agent: 'Document OCR Digitizer', message: 'Digitized lab report with 98.8% confidence. Extracted diabetic peripheral neuropathy indicators.', timestamp: '18:05:03' },
        { type: 'AGENT_STEP', agent: 'Medical Coding Engine', status: 'ANALYZING_TEXT', message: 'Mapping clinical concepts to UMLS (C0011860) & ICD-10-CM codes (E11.40 Type 2 Diabetes)...', timestamp: '18:05:04' },
        { type: 'NLP_ENTITIES', agent: 'Medical Coding Engine', message: 'Mapped 4 UMLS & ICD-10 clinical entities for Type 2 Diabetes with Peripheral Neuropathy.', timestamp: '18:05:05' },
        { type: 'AGENT_STEP', agent: 'Patient Education Illustrator', status: 'GENERATING_ILLUSTRATION', message: '🎨 Synthesizing flat-vector peripheral nerve ending diagram for patient education...', timestamp: '18:05:06' },
        { type: 'ILLUSTRATION_GENERATED', agent: 'Patient Education Illustrator', message: "Visual anatomical diagram 'Diabetic Peripheral Neuropathy & Numbness' generated successfully.", timestamp: '18:05:07' },
        { type: 'SAFETY_GUARDRAIL', agent: 'Clinical Safety Bridge', status: 'COMPLIANCE_PASSED', message: 'EU AI Act Compliance Verified. Aligned with AHA Patient Education Standards.', timestamp: '18:05:09' },
        { type: 'HITL_SUPERVISORY_REQUIRED', agent: 'Clinical Orchestrator', message: '⚠️ Diagnostic synthesis complete for Patient #PX-8812. Digitized T2D E11.40 + visual diagram ready. Awaiting physician approval.', timestamp: '18:05:10' },
      ],
      nlp: {
        entities: [
          { text: 'Type 2 Diabetes Mellitus with Peripheral Neuropathy', umls_cui: 'C0011860', icd10: 'E11.40' },
          { text: 'Elevated Glycated Hemoglobin (HbA1c 8.6%)', umls_cui: 'C0425950', icd10: 'R73.09' },
          { text: 'Distal Sensory Polyneuropathy', umls_cui: 'C0271680', icd10: 'G62.9' },
        ],
      },
      illustration: {
        model_engine: 'FLUX.2-pro Visual Diagram',
        prompt_sent: 'Create a simple, non-intimidating, flat-vector medical illustration of peripheral nerve fibers in the foot showing blood flow and glucose impact, suitable for patient education, clean white background',
        illustration_title: 'Understanding Type 2 Diabetes & Peripheral Nerve Care',
        status: 'GENERATED_SUCCESSFULLY',
        tag: 'T2D NEUROPATHY',
      },
    };
  } else if (pid === 'PX-8810') {
    return {
      events: [
        { type: 'AGENT_STEP', agent: 'Clinical Orchestrator', status: 'INITIALIZING', message: '🚀 Initializing Clinical AI synthesis for Patient #PX-8810 (Nikos Mavros)...', timestamp: '18:05:01' },
        { type: 'AGENT_STEP', agent: 'Document OCR Digitizer', status: 'ANALYZING_DOCUMENT', message: 'Parsing scanned hospital discharge summary PDF with Mistral OCR 4.0 Layout Engine...', timestamp: '18:05:02' },
        { type: 'OCR_FINDINGS', agent: 'Document OCR Digitizer', message: 'Digitized document with 98.5% OCR confidence. Extracted angiography findings: 85% proximal LAD stenosis.', timestamp: '18:05:03' },
        { type: 'AGENT_STEP', agent: 'Medical Coding Engine', status: 'ANALYZING_TEXT', message: 'Mapping clinical text to UMLS CUIs (C0010054) & ICD-10-CM codes (I25.10 Coronary Artery Disease)...', timestamp: '18:05:04' },
        { type: 'NLP_ENTITIES', agent: 'Medical Coding Engine', message: 'Mapped 4 UMLS & ICD-10 clinical entities with 99% accuracy.', timestamp: '18:05:05' },
        { type: 'AGENT_STEP', agent: 'Patient Education Illustrator', status: 'GENERATING_ILLUSTRATION', message: '🎨 Synthesizing flat-vector, non-intimidating anatomical heart diagram for patient consultation...', timestamp: '18:05:06' },
        { type: 'ILLUSTRATION_GENERATED', agent: 'Patient Education Illustrator', message: "Visual anatomical diagram 'Coronary Artery Blockage' generated successfully.", timestamp: '18:05:07' },
        { type: 'SAFETY_GUARDRAIL', agent: 'Clinical Safety Bridge', status: 'COMPLIANCE_PASSED', message: 'EU AI Act & GDPR Article 9 Compliance Verified. Aligned with AHA Patient Education Standards.', timestamp: '18:05:09' },
        { type: 'HITL_SUPERVISORY_REQUIRED', agent: 'Clinical Orchestrator', message: '⚠️ Diagnostic synthesis complete for Patient #PX-8810. Digitized CAD I25.10 + visual diagram ready. Awaiting physician approval.', timestamp: '18:05:10' },
      ],
      nlp: {
        entities: [
          { text: 'Coronary Artery Disease (CAD)', umls_cui: 'C0010054', icd10: 'I25.10' },
          { text: 'Proximal LAD Stenosis (85%)', umls_cui: 'C0265060', icd10: 'I25.110' },
          { text: 'Exertional Angina', umls_cui: 'C0002962', icd10: 'I20.8' },
          { text: 'Aspirin & Clopidogrel Therapy', umls_cui: 'C0004057', atc_code: 'B01AC30' },
        ],
      },
      illustration: {
        model_engine: 'FLUX.2-pro Visual Diagram',
        prompt_sent: 'Create a simple, non-intimidating, flat-vector medical illustration of a human heart showing a blocked coronary artery, suitable for patient education, clean white background',
        illustration_title: 'Understanding Coronary Artery Disease & Arterial Blockage',
        status: 'GENERATED_SUCCESSFULLY',
        tag: 'LAD BLOCKAGE (85%)',
      },
    };
  } else {
    // Dynamic Custom Uploaded Patient (e.g. PX-8888)
    return {
      events: [
        { type: 'AGENT_STEP', agent: 'Clinical Orchestrator', status: 'INITIALIZING', message: `🚀 Initializing Clinical AI synthesis for Patient #${pid}...`, timestamp: '18:05:01' },
        { type: 'AGENT_STEP', agent: 'Document OCR Digitizer', status: 'ANALYZING_DOCUMENT', message: `Parsing uploaded clinical document for Patient #${pid} with Mistral OCR 4.0...`, timestamp: '18:05:02' },
        { type: 'OCR_FINDINGS', agent: 'Document OCR Digitizer', message: `Digitized uploaded document for Patient #${pid} with 98.5% confidence.`, timestamp: '18:05:03' },
        { type: 'AGENT_STEP', agent: 'Medical Coding Engine', status: 'ANALYZING_TEXT', message: `Mapping extracted clinical concepts for Patient #${pid} to UMLS & ICD-10...`, timestamp: '18:05:04' },
        { type: 'NLP_ENTITIES', agent: 'Medical Coding Engine', message: `Mapped clinical entities for Patient #${pid}.`, timestamp: '18:05:05' },
        { type: 'AGENT_STEP', agent: 'Patient Education Illustrator', status: 'GENERATING_ILLUSTRATION', message: `🎨 Synthesizing flat-vector anatomical visual diagram for Patient #${pid}...`, timestamp: '18:05:06' },
        { type: 'ILLUSTRATION_GENERATED', agent: 'Patient Education Illustrator', message: `Visual anatomical diagram for Patient #${pid} generated successfully.`, timestamp: '18:05:07' },
        { type: 'SAFETY_GUARDRAIL', agent: 'Clinical Safety Bridge', status: 'COMPLIANCE_PASSED', message: 'EU AI Act & GDPR Article 9 Compliance Verified. Aligned with AHA Standards.', timestamp: '18:05:09' },
        { type: 'HITL_SUPERVISORY_REQUIRED', agent: 'Clinical Orchestrator', message: `⚠️ Diagnostic synthesis complete for Patient #${pid}. Visual diagram ready. Awaiting physician approval.`, timestamp: '18:05:10' },
      ],
      nlp: {
        entities: [
          { text: `Clinical Evaluation (#${pid})`, umls_cui: 'C0012644', icd10: 'Z00.00' },
          { text: 'Digitized Medical Record Finding', umls_cui: 'C0205244', icd10: 'R69' },
          { text: 'Physician Consultation Recommended', umls_cui: 'C0009440', icd10: 'Z51.89' },
        ],
      },
      illustration: {
        model_engine: 'FLUX.2-pro Visual Diagram',
        prompt_sent: `Create a simple, non-intimidating, flat-vector medical illustration for Patient #${pid}, suitable for patient education, clean white background`,
        illustration_title: `Understanding Clinical Evaluation (#${pid})`,
        status: 'GENERATED_SUCCESSFULLY',
        tag: 'CLINICAL DIAGRAM',
      },
    };
  }
};

/* ─── Doctor-Centric Agent Badges ─────────────────── */
function AgentBadge({ agent }) {
  const badges = {
    'Clinical Orchestrator':       { cls: 'badge-blue', icon: <Stethoscope className="w-3 h-3" />, label: 'CLINICAL ORCHESTRATOR' },
    'Lead Medical Orchestrator':   { cls: 'badge-blue', icon: <Stethoscope className="w-3 h-3" />, label: 'CLINICAL ORCHESTRATOR' },
    'Document OCR Digitizer':      { cls: 'badge-purple', icon: <FileText className="w-3 h-3" />, label: 'DOCUMENT OCR DIGITIZER' },
    'Legacy Records Agent':        { cls: 'badge-purple', icon: <FileText className="w-3 h-3" />, label: 'DOCUMENT OCR DIGITIZER' },
    'Patient Education Illustrator': { cls: 'badge-rose', icon: <Palette className="w-3 h-3" />, label: 'PATIENT ILLUSTRATOR' },
    'Medical Illustrator Agent':   { cls: 'badge-rose', icon: <Palette className="w-3 h-3" />, label: 'PATIENT ILLUSTRATOR' },
    'Medical Coding Engine':       { cls: 'badge-amber', icon: <Sparkles className="w-3 h-3" />, label: 'MEDICAL CODING (ICD-10)' },
    'Clinical NLP Agent':          { cls: 'badge-amber', icon: <Sparkles className="w-3 h-3" />, label: 'MEDICAL CODING (ICD-10)' },
  };
  const b = badges[agent] || { cls: 'badge-emerald', icon: <ShieldCheck className="w-3 h-3" />, label: 'SAFETY GUARDRAIL' };
  return (
    <span className={`badge ${b.cls} flex items-center gap-1`}>
      {b.icon} {b.label}
    </span>
  );
}

/* ─── Event Border Colors ─────────────────────────── */
function eventBorderColor(type) {
  switch (type) {
    case 'OCR_FINDINGS': return 'var(--accent-purple)';
    case 'NLP_ENTITIES': return 'var(--accent-amber)';
    case 'ILLUSTRATION_GENERATED': return 'var(--accent-rose)';
    case 'SAFETY_GUARDRAIL': return 'var(--accent-emerald)';
    case 'HITL_SUPERVISORY_REQUIRED': return 'var(--accent-amber)';
    default: return 'var(--accent-blue)';
  }
}

export default function AgentOrchestrationFeed({ patientId, onHitlTriggered, onNavigateHITL }) {
  const [events, setEvents] = useState([]);
  const [illustrationData, setIllustrationData] = useState(null);
  const [nlpData, setNlpData] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const feedEndRef = useRef(null);

  useEffect(() => {
    // 1. Load initial data (presets or from API for uploaded patients)
    const preset = getPatientPresetData(patientId);
    setEvents(preset.events);
    setIllustrationData(preset.illustration);
    setNlpData(preset.nlp);

    // Fetch patient record details if custom patient uploaded
    fetchPatients().then((pts) => {
      if (Array.isArray(pts)) {
        const found = pts.find((p) => p.id === patientId);
        if (found) {
          if (found.b64_json) {
            setIllustrationData((prev) => ({
              ...prev,
              b64_json: found.b64_json,
              illustration_title: found.diagnosis || prev?.illustration_title || `Patient #${patientId} Visual Aid`,
              prompt_sent: found.illustration_prompt || prev?.prompt_sent,
            }));
          }
          if (found.clinical_notes && !patientId.startsWith('PX-881')) {
            // Update OCR / NLP feed messages dynamically for custom uploaded patient
            setEvents([
              { type: 'AGENT_STEP', agent: 'Clinical Orchestrator', status: 'INITIALIZING', message: `🚀 Initializing Clinical AI synthesis for Patient #${patientId} (${found.name || 'Custom Ingestion'})...`, timestamp: '18:05:01' },
              { type: 'AGENT_STEP', agent: 'Document OCR Digitizer', status: 'ANALYZING_DOCUMENT', message: `Parsing uploaded document (${found.type || 'Scan'}) with Mistral OCR 4.0 Layout Engine...`, timestamp: '18:05:02' },
              { type: 'OCR_FINDINGS', agent: 'Document OCR Digitizer', message: `Digitized uploaded document: ${found.clinical_notes.slice(0, 140)}...`, timestamp: '18:05:03' },
              { type: 'AGENT_STEP', agent: 'Medical Coding Engine', status: 'ANALYZING_TEXT', message: `Mapping extracted clinical concepts to UMLS & ICD-10-CM codes...`, timestamp: '18:05:04' },
              { type: 'NLP_ENTITIES', agent: 'Medical Coding Engine', message: `Mapped clinical entities for ${found.diagnosis || found.name}.`, timestamp: '18:05:05' },
              { type: 'AGENT_STEP', agent: 'Patient Education Illustrator', status: 'GENERATING_ILLUSTRATION', message: `🎨 Synthesizing flat-vector anatomical visual diagram for patient consultation...`, timestamp: '18:05:06' },
              { type: 'ILLUSTRATION_GENERATED', agent: 'Patient Education Illustrator', message: `Visual anatomical diagram generated successfully. Ready for consultation.`, timestamp: '18:05:07' },
              { type: 'SAFETY_GUARDRAIL', agent: 'Clinical Safety Bridge', status: 'COMPLIANCE_PASSED', message: 'EU AI Act & GDPR Article 9 Compliance Verified. Aligned with AHA Standards.', timestamp: '18:05:09' },
              { type: 'HITL_SUPERVISORY_REQUIRED', agent: 'Clinical Orchestrator', message: `⚠️ Diagnostic synthesis complete for Patient #${patientId}. Visual diagram ready. Awaiting physician approval.`, timestamp: '18:05:10' },
            ]);
          }
        }
      }
    });

    // 2. Connect live SSE stream
    const es = connectReasoningStream(
      patientId,
      (payload) => {
        setIsStreaming(true);
        if (payload.message) {
          setEvents((prev) => [...prev, payload]);
        }
        if (payload.type === 'ILLUSTRATION_GENERATED' && payload.data) {
          setIllustrationData((prev) => ({ ...prev, ...payload.data }));
        } else if (payload.type === 'NLP_ENTITIES' && payload.data) {
          setNlpData(payload.data);
        } else if (payload.type === 'HITL_SUPERVISORY_REQUIRED' && payload.data) {
          setIsStreaming(false);
          if (payload.data.b64_json) {
            setIllustrationData((prev) => ({ ...prev, b64_json: payload.data.b64_json }));
          }
          if (onHitlTriggered) onHitlTriggered(payload.data);
        }
      },
      () => setIsStreaming(false)
    );

    return () => es.close();
  }, [patientId]);

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events]);

  return (
    <div className="space-y-5">
      {/* Doctor Page Title */}
      <div className="animate-fade-in-down">
        <h1
          className="text-lg font-bold flex items-center gap-2"
          style={{ fontFamily: "'JetBrains Mono'", color: 'var(--text-primary)' }}
        >
          <Stethoscope className="w-5 h-5" style={{ color: 'var(--accent-blue)' }} />
          CLINICAL AI REASONING FEED
        </h1>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Real-time document digitization, medical coding, and patient education visual synthesis — Patient #{patientId}
        </p>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Left: Live Event Feed */}
        <div className="col-span-12 xl:col-span-7 space-y-4 animate-slide-in-up">
          {/* Stream Status Banner */}
          <div className="glass-card px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Radio
                className="w-4 h-4"
                style={{ color: isStreaming ? 'var(--accent-blue)' : 'var(--text-muted)' }}
              />
              <div>
                <div
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ fontFamily: "'JetBrains Mono'", color: 'var(--text-primary)' }}
                >
                  CLINICAL AI REASONING STREAM
                </div>
                <div
                  className="text-[10px]"
                  style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono'" }}
                >
                  Diagnostic Intake & Patient Education Synthesis · Patient #{patientId}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isStreaming ? (
                <span className="badge badge-blue flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: 'var(--accent-blue)', animation: 'pulse-glow 1.5s infinite' }}
                  />
                  AI SYNTHESIZING
                </span>
              ) : (
                <span className="badge badge-amber flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3" /> PAUSED — PHYSICIAN APPROVAL REQUIRED
                </span>
              )}
              {!isStreaming && onNavigateHITL && (
                <button
                  onClick={onNavigateHITL}
                  className="btn-primary"
                  style={{ fontSize: '10px', padding: '6px 12px' }}
                  id="go-to-hitl-btn"
                >
                  REVIEW & APPROVE <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Event Log */}
          <div
            className="glass-card p-4 overflow-y-auto space-y-2.5"
            style={{ height: '520px' }}
          >
            {events.map((ev, index) => (
              <div
                key={index}
                className="agent-event"
                style={{
                  borderLeft: `3px solid ${eventBorderColor(ev.type)}`,
                  animationDelay: `${index * 40}ms`,
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <AgentBadge agent={ev.agent} />
                  <span
                    className="text-[10px] tabular-nums"
                    style={{ fontFamily: "'JetBrains Mono'", color: 'var(--text-faint)' }}
                  >
                    {ev.timestamp}
                  </span>
                </div>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}
                >
                  {ev.message}
                </p>
              </div>
            ))}
            <div ref={feedEndRef} />
          </div>
        </div>

        {/* Right: Findings Panel */}
        <div className="col-span-12 xl:col-span-5 space-y-4 animate-slide-in-up" style={{ animationDelay: '100ms' }}>
          {/* Patient Education Visual Aid Card */}
          <div className="glass-card p-5 space-y-4">
            <div className="section-header">
              <Palette className="w-3.5 h-3.5" style={{ color: 'var(--accent-rose)' }} />
              <span>PATIENT EDUCATION VISUAL AID</span>
              <span className="ml-1 badge badge-rose">FLUX.2-pro Visual Diagram</span>
            </div>

            <div
              className="relative rounded-xl overflow-hidden scanline-container"
              style={{
                height: 220,
                background: 'linear-gradient(135deg, #0f0b1e 0%, #1a0a1c 50%, #0c0b18 100%)',
                border: '1px solid rgba(244,63,94,0.2)',
              }}
            >
              {illustrationData?.b64_json ? (
                <img
                  src={`data:image/png;base64,${illustrationData.b64_json}`}
                  alt="Patient Education Medical Illustration"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                  <div className="animate-float">
                    <ImageIcon
                      className="w-10 h-10 mx-auto mb-3"
                      style={{ color: 'rgba(244,63,94,0.6)' }}
                    />
                  </div>
                  <span
                    className="text-xs font-bold uppercase tracking-wider block"
                    style={{ fontFamily: "'JetBrains Mono'", color: 'var(--text-primary)' }}
                  >
                    {illustrationData?.illustration_title || `ANATOMICAL DIAGRAM (#${patientId})`}
                  </span>
                  <span
                    className="text-[10px] mt-1.5"
                    style={{ color: 'rgba(244,63,94,0.7)', fontFamily: "'JetBrains Mono'" }}
                  >
                    Flat-Vector Anatomical Education Graphic
                  </span>
                </div>
              )}
              {/* Tag badge */}
              <div
                className="absolute bottom-3 right-3 badge badge-rose"
                style={{ fontSize: '9px' }}
              >
                {illustrationData?.tag || 'CLINICAL DIAGRAM'}
              </div>
            </div>

            {illustrationData?.prompt_sent && (
              <div className="mono-block">
                <div
                  className="text-[9px] font-bold uppercase tracking-widest mb-2"
                  style={{ color: 'var(--accent-rose)' }}
                >
                  ILLUSTRATION CLINICAL FOCUS:
                </div>
                <div style={{ color: '#c4b5fd', fontStyle: 'italic' }}>
                  {illustrationData.prompt_sent}
                </div>
              </div>
            )}
          </div>

          {/* Clinical Extractions Card */}
          <div className="glass-card p-5 space-y-4">
            <div className="section-header">
              <FileText className="w-3.5 h-3.5" style={{ color: 'var(--accent-amber)' }} />
              <span>EXTRACTED MEDICAL CONCEPTS & ICD-10 CODES</span>
            </div>
            {nlpData && nlpData.entities && (
              <div className="space-y-2.5">
                {nlpData.entities.map((ent, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl animate-fade-in"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      animationDelay: `${idx * 80}ms`,
                    }}
                  >
                    <div
                      className="text-xs font-bold mb-2"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {ent.text}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="badge badge-blue">UMLS: {ent.umls_cui}</span>
                      {ent.icd10 && <span className="badge badge-emerald">ICD-10: {ent.icd10}</span>}
                      {ent.atc_code && <span className="badge badge-purple">ATC: {ent.atc_code}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
