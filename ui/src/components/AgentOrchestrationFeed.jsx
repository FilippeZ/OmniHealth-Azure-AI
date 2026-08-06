import React, { useEffect, useState, useRef } from 'react';
import { connectReasoningStream } from '../services/api';
import { Brain, FileText, Palette, ShieldCheck, AlertTriangle, Image as ImageIcon, Sparkles } from 'lucide-react';

const getPatientPresetData = (pid) => {
  if (pid === 'PX-8811') {
    return {
      events: [
        { type: "AGENT_STEP", agent: "Lead Medical Orchestrator", avatar: "brain", status: "INITIALIZING", message: `🚀 OmniHealth MAF Legacy Synthesis active for Patient #PX-8811 (Elena Dimou). Initializing system prompts...`, timestamp: "18:05:01" },
        { type: "AGENT_STEP", agent: "Legacy Records Agent", avatar: "description", status: "ANALYZING_DOCUMENT", message: "Parsing handwritten referral note with Mistral OCR 4.0 & Azure AI Content Understanding...", timestamp: "18:05:02" },
        { type: "OCR_FINDINGS", agent: "Legacy Records Agent", message: "Digitized handwritten note with 96.2% OCR confidence. Extracted L5-S1 radicular pain & MRI lumbar herniation findings.", timestamp: "18:05:03" },
        { type: "AGENT_STEP", agent: "Clinical NLP Agent", avatar: "clinical_notes", status: "ANALYZING_TEXT", message: "Mapping extracted text to UMLS CUIs (C0020440) & ICD-10-CM codes (M51.26 Lumbar Disc Displacement)...", timestamp: "18:05:04" },
        { type: "NLP_ENTITIES", agent: "Clinical NLP Agent", message: "Mapped 3 UMLS & ICD-10 clinical entities for L5-S1 disc herniation.", timestamp: "18:05:05" },
        { type: "AGENT_STEP", agent: "Medical Illustrator Agent", avatar: "palette", status: "GENERATING_ILLUSTRATION", message: "🎨 Synthesizing flat-vector lumbar spine L5-S1 nerve root compression diagram using FLUX.2-pro...", timestamp: "18:05:06" },
        { type: "ILLUSTRATION_GENERATED", agent: "Medical Illustrator Agent", message: "Visual anatomical graphic 'Lumbar Spine & L5-S1 Disc Herniation' generated successfully.", timestamp: "18:05:07" },
        { type: "SAFETY_GUARDRAIL", agent: "Azure Safety Middleware", avatar: "shield", status: "COMPLIANCE_PASSED", message: "EU AI Act & GDPR Article 9 Compliance Passed. No medical hallucinations detected.", timestamp: "18:05:09" },
        { type: "HITL_SUPERVISORY_REQUIRED", agent: "Lead Medical Orchestrator", avatar: "verified_user", message: "⚠️ Multi-Agent synthesis complete. Digitized L5-S1 Herniation M51.26 + FLUX.2-pro visual illustration ready. Awaiting approval.", timestamp: "18:05:10" }
      ],
      nlp: {
        entities: [
          { text: "Lumbar Disc Displacement (L5-S1 Herniation)", umls_cui: "C0020440", icd10: "M51.26" },
          { text: "L5 Nerve Root Compression / Radiculopathy", umls_cui: "C0231238", icd10: "M54.16" },
          { text: "Lumbar Spine MRI Finding", umls_cui: "C0742022", icd10: "M51.2" }
        ]
      },
      illustration: {
        model_engine: "FLUX.2-pro (Text-to-Image)",
        prompt_sent: "Create a simple, non-intimidating, flat-vector medical illustration of a human lumbar spine showing an L5-S1 herniated disc pressing on a nerve root, suitable for patient education, clean white background",
        illustration_title: "Understanding Lumbar Disc Herniation (L5-S1 Nerve Compression)",
        status: "GENERATED_SUCCESSFULLY",
        tag: "L5-S1 HERNIATION"
      }
    };
  } else if (pid === 'PX-8812') {
    return {
      events: [
        { type: "AGENT_STEP", agent: "Lead Medical Orchestrator", avatar: "brain", status: "INITIALIZING", message: `🚀 OmniHealth MAF Legacy Synthesis active for Patient #PX-8812 (Christos Papanikolaou)...`, timestamp: "18:05:01" },
        { type: "AGENT_STEP", agent: "Legacy Records Agent", avatar: "description", status: "ANALYZING_DOCUMENT", message: "Parsing scanned outpatient lab report with Mistral OCR 4.0 (HbA1c 8.6%, fasting glucose 192 mg/dL)...", timestamp: "18:05:02" },
        { type: "OCR_FINDINGS", agent: "Legacy Records Agent", message: "Digitized lab report with 98.8% OCR confidence. Extracted diabetic peripheral neuropathy indicators.", timestamp: "18:05:03" },
        { type: "AGENT_STEP", agent: "Clinical NLP Agent", avatar: "clinical_notes", status: "ANALYZING_TEXT", message: "Mapping extracted lab text to UMLS CUIs (C0011860) & ICD-10-CM codes (E11.40 Type 2 Diabetes)...", timestamp: "18:05:04" },
        { type: "NLP_ENTITIES", agent: "Clinical NLP Agent", message: "Mapped 4 UMLS & ICD-10 clinical entities for Type 2 Diabetes with Peripheral Neuropathy.", timestamp: "18:05:05" },
        { type: "AGENT_STEP", agent: "Medical Illustrator Agent", avatar: "palette", status: "GENERATING_ILLUSTRATION", message: "🎨 Generating flat-vector peripheral nerve ending diagram for patient education using FLUX.2-pro...", timestamp: "18:05:06" },
        { type: "ILLUSTRATION_GENERATED", agent: "Medical Illustrator Agent", message: "Visual anatomical graphic 'Diabetic Peripheral Neuropathy & Numbness' generated successfully.", timestamp: "18:05:07" },
        { type: "SAFETY_GUARDRAIL", agent: "Azure Safety Middleware", avatar: "shield", status: "COMPLIANCE_PASSED", message: "EU AI Act Compliance Passed. No medical hallucinations detected.", timestamp: "18:05:09" },
        { type: "HITL_SUPERVISORY_REQUIRED", agent: "Lead Medical Orchestrator", avatar: "verified_user", message: "⚠️ Multi-Agent synthesis complete. Digitized T2D E11.40 + FLUX.2-pro visual illustration ready. Awaiting approval.", timestamp: "18:05:10" }
      ],
      nlp: {
        entities: [
          { text: "Type 2 Diabetes Mellitus with Peripheral Neuropathy", umls_cui: "C0011860", icd10: "E11.40" },
          { text: "Elevated Glycated Hemoglobin (HbA1c 8.6%)", umls_cui: "C0425950", icd10: "R73.09" },
          { text: "Distal Sensory Polyneuropathy", umls_cui: "C0271680", icd10: "G62.9" }
        ]
      },
      illustration: {
        model_engine: "FLUX.2-pro (Text-to-Image)",
        prompt_sent: "Create a simple, non-intimidating, flat-vector medical illustration of peripheral nerve fibers in the foot showing blood flow and glucose impact, suitable for patient education, clean white background",
        illustration_title: "Understanding Type 2 Diabetes & Peripheral Nerve Care",
        status: "GENERATED_SUCCESSFULLY",
        tag: "T2D NEUROPATHY"
      }
    };
  } else {
    // Default PX-8810 CAD or custom patient
    return {
      events: [
        { type: "AGENT_STEP", agent: "Lead Medical Orchestrator", avatar: "brain", status: "INITIALIZING", message: `🚀 OmniHealth MAF Legacy Synthesis active for Patient #${pid}. Initializing system prompts...`, timestamp: "18:05:01" },
        { type: "AGENT_STEP", agent: "Legacy Records Agent", avatar: "description", status: "ANALYZING_DOCUMENT", message: "Parsing scanned hospital discharge PDF with Mistral OCR 4.0 & Azure AI Content Understanding...", timestamp: "18:05:02" },
        { type: "OCR_FINDINGS", agent: "Legacy Records Agent", message: "Digitized document with 98.5% OCR confidence. Extracted angiography results: 85% proximal LAD stenosis.", timestamp: "18:05:03" },
        { type: "AGENT_STEP", agent: "Clinical NLP Agent", avatar: "clinical_notes", status: "ANALYZING_TEXT", message: "Mapping extracted text to UMLS CUIs (C0010054) & ICD-10-CM codes (I25.10 Coronary Artery Disease)...", timestamp: "18:05:04" },
        { type: "NLP_ENTITIES", agent: "Clinical NLP Agent", message: "Mapped 4 UMLS & ICD-10 clinical entities with 99% accuracy.", timestamp: "18:05:05" },
        { type: "AGENT_STEP", agent: "Medical Illustrator Agent", avatar: "palette", status: "GENERATING_ILLUSTRATION", message: "🎨 Generating flat-vector, non-intimidating anatomical heart diagram for patient education using FLUX.2-pro...", timestamp: "18:05:06" },
        { type: "ILLUSTRATION_GENERATED", agent: "Medical Illustrator Agent", message: "Visual anatomical graphic 'Coronary Artery Blockage' generated successfully.", timestamp: "18:05:07" },
        { type: "SAFETY_GUARDRAIL", agent: "Azure Safety Middleware", avatar: "shield", status: "COMPLIANCE_PASSED", message: "EU AI Act Compliance Passed. No medical hallucinations detected.", timestamp: "18:05:09" },
        { type: "HITL_SUPERVISORY_REQUIRED", agent: "Lead Medical Orchestrator", avatar: "verified_user", message: `⚠️ Multi-Agent synthesis complete for Patient #${pid}. Digitized CAD I25.10 + FLUX.2-pro visual illustration ready. Awaiting approval.`, timestamp: "18:05:10" }
      ],
      nlp: {
        entities: [
          { text: "Coronary Artery Disease (CAD)", umls_cui: "C0010054", icd10: "I25.10" },
          { text: "Proximal LAD Stenosis (85%)", umls_cui: "C0265060", icd10: "I25.110" },
          { text: "Exertional Angina", umls_cui: "C0002962", icd10: "I20.8" },
          { text: "Aspirin & Clopidogrel Therapy", umls_cui: "C0004057", atc_code: "B01AC30" }
        ]
      },
      illustration: {
        model_engine: "FLUX.2-pro (Text-to-Image)",
        prompt_sent: "Create a simple, non-intimidating, flat-vector medical illustration of a human heart showing a blocked coronary artery, suitable for patient education, clean white background",
        illustration_title: "Understanding Coronary Artery Disease & Arterial Blockage",
        status: "GENERATED_SUCCESSFULLY",
        tag: "LAD BLOCKAGE (85%)"
      }
    };
  }
};

export default function AgentOrchestrationFeed({ patientId, onHitlTriggered }) {
  const initialPreset = getPatientPresetData(patientId);

  const [events, setEvents] = useState(initialPreset.events);
  const [illustrationData, setIllustrationData] = useState(initialPreset.illustration);
  const [nlpData, setNlpData] = useState(initialPreset.nlp);
  const [isStreaming, setIsStreaming] = useState(false);
  const feedEndRef = useRef(null);

  useEffect(() => {
    const preset = getPatientPresetData(patientId);
    setEvents(preset.events);
    setIllustrationData(preset.illustration);
    setNlpData(preset.nlp);

    // Connect live SSE stream
    const es = connectReasoningStream(patientId, (payload) => {
      setIsStreaming(true);
      setEvents((prev) => [...prev, payload]);

      if (payload.type === 'ILLUSTRATION_GENERATED') {
        setIllustrationData(payload.data);
      } else if (payload.type === 'NLP_ENTITIES') {
        setNlpData(payload.data);
      } else if (payload.type === 'HITL_SUPERVISORY_REQUIRED') {
        setIsStreaming(false);
        if (onHitlTriggered) onHitlTriggered(payload.data);
      }
    });

    return () => {
      es.close();
    };
  }, [patientId]);

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events]);

  const getAgentBadge = (agentName) => {
    switch (agentName) {
      case 'Lead Medical Orchestrator':
        return (
          <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-200 text-[10px]">
            <Brain class="w-3.5 h-3.5" /> LEAD ORCHESTRATOR
          </div>
        );
      case 'Legacy Records Agent':
        return (
          <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 font-bold border border-purple-200 text-[10px]">
            <FileText class="w-3.5 h-3.5" /> MISTRAL OCR 4.0
          </div>
        );
      case 'Medical Illustrator Agent':
        return (
          <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 font-bold border border-rose-200 text-[10px]">
            <Palette class="w-3.5 h-3.5" /> FLUX.2-PRO ILLUSTRATOR
          </div>
        );
      case 'Clinical NLP Agent':
        return (
          <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 font-bold border border-amber-200 text-[10px]">
            <Sparkles class="w-3.5 h-3.5" /> CLINICAL NLP
          </div>
        );
      default:
        return (
          <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[10px]">
            <ShieldCheck class="w-3.5 h-3.5" /> SAFETY BRIDGE
          </div>
        );
    }
  };

  return (
    <div class="grid grid-cols-12 gap-6">
      {/* Left Column: Live Agent Stream */}
      <div class="col-span-12 lg:col-span-7 space-y-4">
        <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <h2 class="text-sm font-mono font-bold text-slate-900 uppercase tracking-wider">
              LIVE MULTI-AGENT REASONING STREAM (MAF LEGACY SYNTHESIS)
            </h2>
            <p class="text-[11px] font-mono text-slate-500">Patient ID: #{patientId}</p>
          </div>
          {isStreaming ? (
            <span class="px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span> MULTI-AGENT STREAMING
            </span>
          ) : (
            <span class="px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-2">
              <AlertTriangle class="w-3.5 h-3.5" /> PAUSED FOR HITL APPROVAL
            </span>
          )}
        </div>

        {/* Thought Log Feed */}
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 h-[520px] overflow-y-auto space-y-3 font-mono text-xs">
          {events.map((ev, index) => (
            <div key={index} class="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
              <div class="flex items-center justify-between">
                {getAgentBadge(ev.agent)}
                <span class="text-[10px] text-slate-400 font-medium">{ev.timestamp}</span>
              </div>
              <p class="text-slate-700 text-xs leading-relaxed font-sans font-medium pl-3 border-l-2 border-blue-500">
                {ev.message}
              </p>
            </div>
          ))}
          <div ref={feedEndRef} />
        </div>
      </div>

      {/* Right Column: Multimodal Findings */}
      <div class="col-span-12 lg:col-span-5 space-y-6">
        {/* Generated Patient Illustration Card */}
        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 class="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <Palette class="w-4 h-4 text-rose-600" /> MEDICAL ILLUSTRATOR AGENT (FLUX.2-PRO / GPT-IMAGE-2)
          </h3>
          <div class="relative bg-slate-900 rounded-lg border border-slate-300 overflow-hidden h-48 flex items-center justify-center p-4">
            {illustrationData?.b64_json ? (
              <img
                src={`data:image/png;base64,${illustrationData.b64_json}`}
                alt="FLUX.2-pro Medical Illustration"
                class="w-full h-full object-contain"
              />
            ) : (
              <div class="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-rose-950 opacity-90 flex flex-col items-center justify-center p-4 text-center">
                <ImageIcon class="w-8 h-8 text-rose-400 mb-2" />
                <span class="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  {illustrationData?.illustration_title || "ANATOMICAL PATIENT EDUCATION DIAGRAM"}
                </span>
                <span class="text-[10px] font-mono text-rose-200 mt-1">FLUX.2-pro Flat-Vector Render</span>
              </div>
            )}
            <div class="absolute bottom-3 right-3 bg-rose-600 text-white text-[9px] font-mono font-bold px-2 py-1 rounded shadow-sm">
              {illustrationData?.tag || "ANATOMICAL DIAGRAM"}
            </div>
          </div>
          {illustrationData && (
            <div class="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-xs font-sans font-medium text-rose-900 space-y-1">
              <p class="font-bold text-rose-800">FLUX.2-pro Prompt Sent:</p>
              <p class="text-[11px] italic font-mono">{illustrationData.prompt_sent}</p>
            </div>
          )}
        </div>

        {/* Clinical NLP UMLS Badges */}
        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 class="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileText class="w-4 h-4 text-amber-600" /> CLINICAL NLP & MISTRAL OCR 4.0 EXTRACTIONS
          </h3>
          {nlpData && (
            <div class="flex flex-wrap gap-2">
              {nlpData.entities.map((ent, idx) => (
                <div key={idx} class="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <div class="text-xs font-bold text-slate-900">{ent.text}</div>
                  <div class="flex gap-2 text-[10px] font-mono font-bold">
                    <span class="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                      UMLS: {ent.umls_cui}
                    </span>
                    {ent.icd10 && (
                      <span class="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        ICD-10: {ent.icd10}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
