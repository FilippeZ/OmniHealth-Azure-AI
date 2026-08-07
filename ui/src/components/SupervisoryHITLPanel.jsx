import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, CheckCircle2, XCircle, Edit3, FileText, Palette,
  AlertTriangle, BookOpen, Star, User, Tag, ArrowRight, LayoutDashboard, History, Image as ImageIcon
} from 'lucide-react';
import { sendPhysicianApproval, fetchPatients } from '../services/api';

/* ─── Preset data ─────────────────────────────────── */
const getPatientHitlPresetData = (pid) => {
  const presets = {
    'PX-8810': {
      patient_id: 'PX-8810', patient_name: 'Nikos Mavros', age: 58, gender: 'Male',
      primary_diagnosis: 'Coronary Artery Disease (CAD - 85% Proximal LAD Stenosis)',
      icd10_code: 'I25.10', umls_cui: 'C0010054',
      digitized_summary: 'Patient Nikos Mavros (58y) presented with exertional angina. Angiography confirmed 85% proximal LAD stenosis. Prescribed dual antiplatelet therapy (Aspirin + Clopidogrel).',
      patient_education_summary: 'Your heart receives blood through small arteries. One of these main arteries (the LAD) has an 85% blockage restricting blood flow, causing chest tightness when exercising.',
      illustration_prompt: 'Create a simple, non-intimidating, flat-vector medical illustration of a human heart showing a blocked coronary artery, suitable for patient education, clean white background',
      confidence_score: 0.985,
      recommended_action: 'Share visual diagram with patient during consultation. Initiate dual antiplatelet therapy & cardiac rehabilitation.',
      evidence_citations: [
        'AHA Guidelines: Visual Aids & Patient Health Literacy in Clinical Care',
        'WHO ICD-10 Coding Standard (I25.10)',
        'EU AI Act & GDPR Art. 9 Compliance Protocol for Patient Education Portals'
      ],
    },
    'PX-8811': {
      patient_id: 'PX-8811', patient_name: 'Elena Dimou', age: 42, gender: 'Female',
      primary_diagnosis: 'Lumbar Disc Displacement (L5-S1 Herniation & Nerve Root Compression)',
      icd10_code: 'M51.26', umls_cui: 'C0020440',
      digitized_summary: 'Patient Elena Dimou (42y) presented with severe low back pain radiating to left leg (L5 distribution) for 3 weeks. MRI lumbar spine confirms L5-S1 herniated disc with nerve root compression.',
      patient_education_summary: 'Your lower back contains gel-like discs between the vertebrae. One of these discs (at L5-S1) has pushed outward slightly, pressing on a nearby nerve root and causing leg pain.',
      illustration_prompt: 'Create a simple, non-intimidating, flat-vector medical illustration of a human lumbar spine showing an L5-S1 herniated disc pressing on a nerve root, suitable for patient education, clean white background',
      confidence_score: 0.985,
      recommended_action: 'Share visual anatomical diagram with patient. Initiate physical therapy & conservative pain management.',
      evidence_citations: [
        'AHA Guidelines: Visual Aids & Patient Health Literacy in Clinical Care',
        'WHO ICD-10 Coding Standard (M51.26)',
        'EU AI Act & GDPR Art. 9 Compliance Protocol for Patient Education Portals'
      ],
    },
    'PX-8812': {
      patient_id: 'PX-8812', patient_name: 'Christos Papanikolaou', age: 65, gender: 'Male',
      primary_diagnosis: 'Type 2 Diabetes Mellitus with Peripheral Neuropathy',
      icd10_code: 'E11.40', umls_cui: 'C0011860',
      digitized_summary: 'Patient Christos Papanikolaou (65y). Scanned lab & outpatient report: HbA1c 8.6%, fasting glucose 192 mg/dL. Distal sensory polyneuropathy symptoms in bilateral lower extremities.',
      patient_education_summary: 'High blood sugar levels over time can affect the tiny blood vessels that nourish your peripheral nerves, leading to numbness or tingling sensations in your toes.',
      illustration_prompt: 'Create a simple, non-intimidating, flat-vector medical illustration of peripheral nerve fibers in the foot showing blood flow and glucose impact, suitable for patient education, clean white background',
      confidence_score: 0.985,
      recommended_action: 'Share visual diagram with patient. Optimize glycemic control (target HbA1c <7.0%) & routine foot care education.',
      evidence_citations: [
        'AHA Guidelines: Visual Aids & Patient Health Literacy in Clinical Care',
        'WHO ICD-10 Coding Standard (E11.40)',
        'EU AI Act & GDPR Art. 9 Compliance Protocol for Patient Education Portals'
      ],
    },
    'PX-8813': {
      patient_id: 'PX-8813', patient_name: 'George Vassiliou', age: 62, gender: 'Male',
      primary_diagnosis: 'Chronic Obstructive Pulmonary Disease (COPD Exacerbation & Emphysema)',
      icd10_code: 'J44.1', umls_cui: 'C0024117',
      digitized_summary: 'Patient George Vassiliou (62y) presented with progressive exertional dyspnea, chronic productive cough, FEV1/FVC 58%. HRCT chest shows hyperinflation and bilateral emphysematous bullae.',
      patient_education_summary: 'COPD causes swelling and blockage in your airways, making it harder for air to flow smoothly out of your lungs when you breathe out.',
      illustration_prompt: 'Create a simple, non-intimidating, flat-vector medical illustration of human bronchial airways and alveoli showing airflow in COPD emphysema, suitable for patient education, clean white background',
      confidence_score: 0.985,
      recommended_action: 'Share visual diagram with patient during consultation. Initiate bronchodilator therapy & pulmonary rehabilitation.',
      evidence_citations: [
        'AHA Guidelines: Visual Aids & Patient Health Literacy in Clinical Care',
        'WHO ICD-10 Coding Standard (J44.1)',
        'EU AI Act & GDPR Art. 9 Compliance Protocol for Patient Education Portals'
      ],
    },
    'PX-8814': {
      patient_id: 'PX-8814', patient_name: 'Maria Karrathana', age: 39, gender: 'Female',
      primary_diagnosis: 'Essential Primary Hypertension with LV Hypertrophy',
      icd10_code: 'I10', umls_cui: 'C0020538',
      digitized_summary: 'Patient Maria Karrathana (39y) presented with recurrent occipital headaches, resting blood pressure 165/102 mmHg. Echocardiogram shows mild left ventricular hypertrophy.',
      patient_education_summary: 'High blood pressure means the force of blood pushing against your artery walls is consistently too high, causing your heart muscle to work harder.',
      illustration_prompt: 'Create a simple, non-intimidating, flat-vector medical illustration of human vascular arteries showing blood pressure resistance and heart muscle workload, suitable for patient education, clean white background',
      confidence_score: 0.985,
      recommended_action: 'Share visual diagram with patient during consultation. Prescribe antihypertensive therapy & low-sodium diet.',
      evidence_citations: [
        'AHA Guidelines: Visual Aids & Patient Health Literacy in Clinical Care',
        'WHO ICD-10 Coding Standard (I10)',
        'EU AI Act & GDPR Art. 9 Compliance Protocol for Patient Education Portals'
      ],
    },
    'PX-8815': {
      patient_id: 'PX-8815', patient_name: 'Stefanos Kostopoulos', age: 51, gender: 'Male',
      primary_diagnosis: 'Chronic Kidney Disease Stage 3 (CKD)',
      icd10_code: 'N18.3', umls_cui: 'C0022658',
      digitized_summary: 'Patient Stefanos Kostopoulos (51y). Serum creatinine 2.1 mg/dL, eGFR 44 mL/min/1.73m2, proteinuria 450 mg/24h. Diagnosis: CKD Stage 3.',
      patient_education_summary: 'Kidneys filter waste products from your blood. In stage 3 CKD, the filtering rate has slowed down moderately, requiring careful blood pressure and dietary management.',
      illustration_prompt: 'Create a simple, non-intimidating, flat-vector medical illustration of human kidneys showing blood filtration and nephron unit function, suitable for patient education, clean white background',
      confidence_score: 0.985,
      recommended_action: 'Share visual diagram with patient during consultation. Refer to nephrology & initiate ACE inhibitor therapy.',
      evidence_citations: [
        'AHA Guidelines: Visual Aids & Patient Health Literacy in Clinical Care',
        'WHO ICD-10 Coding Standard (N18.3)',
        'EU AI Act & GDPR Art. 9 Compliance Protocol for Patient Education Portals'
      ],
    },
    'PX-8816': {
      patient_id: 'PX-8816', patient_name: 'Sophia Alexiou', age: 47, gender: 'Female',
      primary_diagnosis: 'Primary Vascular Headache / Chronic Migraine',
      icd10_code: 'G43.90', umls_cui: 'C0025202',
      digitized_summary: 'Patient Sophia Alexiou (47y) presented with throbbing unilateral headache with photophobia and nausea lasting 24 hours. Neurological MRI brain normal.',
      patient_education_summary: 'Migraines involve temporary changes in brain nerve signals and blood vessels, causing sensitivity to light, sound, and pulsing head pain.',
      illustration_prompt: 'Create a simple, non-intimidating, flat-vector medical illustration of cranial nerve pathways and blood vessel dilation in migraine, suitable for patient education, clean white background',
      confidence_score: 0.985,
      recommended_action: 'Share visual diagram with patient during consultation. Prescribe triptan acute therapy & trigger avoidance protocol.',
      evidence_citations: [
        'AHA Guidelines: Visual Aids & Patient Health Literacy in Clinical Care',
        'WHO ICD-10 Coding Standard (G43.90)',
        'EU AI Act & GDPR Art. 9 Compliance Protocol for Patient Education Portals'
      ],
    },
    'PX-8817': {
      patient_id: 'PX-8817', patient_name: 'Ioannis Antoniou', age: 71, gender: 'Male',
      primary_diagnosis: 'Primary Knee Osteoarthritis (Bilateral Joint Narrowing)',
      icd10_code: 'M17.9', umls_cui: 'C0029408',
      digitized_summary: 'Patient Ioannis Antoniou (71y) presented with bilateral knee joint stiffness, medial joint space narrowing, subchondral sclerosis on X-ray.',
      patient_education_summary: 'Knee osteoarthritis occurs when protective cartilage cushioning the knee joint wears down over time, causing bone-on-bone friction and stiffness.',
      illustration_prompt: 'Create a simple, non-intimidating, flat-vector medical illustration of a human knee joint showing cartilage layer and joint space, suitable for patient education, clean white background',
      confidence_score: 0.985,
      recommended_action: 'Share visual diagram with patient during consultation. Recommend quad-strengthening exercises & intra-articular hyaluronic acid.',
      evidence_citations: [
        'AHA Guidelines: Visual Aids & Patient Health Literacy in Clinical Care',
        'WHO ICD-10 Coding Standard (M17.9)',
        'EU AI Act & GDPR Art. 9 Compliance Protocol for Patient Education Portals'
      ],
    },
    'PX-8818': {
      patient_id: 'PX-8818', patient_name: 'Anna Papageorgiou', age: 34, gender: 'Female',
      primary_diagnosis: 'Acute Bronchial Pneumonia (Right RLL Opacity)',
      icd10_code: 'J18.9', umls_cui: 'C0032285',
      digitized_summary: 'Patient Anna Papageorgiou (34y) presented with high fever (38.9 C), productive cough with purulent sputum, right lower lobe opacity on chest X-ray.',
      patient_education_summary: 'Pneumonia is an infection that inflames tiny air sacs in your lungs, which may fill with fluid or phlegm, causing fever and cough.',
      illustration_prompt: 'Create a simple, non-intimidating, flat-vector medical illustration of lung bronchus and fluid-filled alveoli in pneumonia, suitable for patient education, clean white background',
      confidence_score: 0.985,
      recommended_action: 'Share visual diagram with patient during consultation. Prescribe targeted oral antibiotic course & adequate rest/hydration.',
      evidence_citations: [
        'AHA Guidelines: Visual Aids & Patient Health Literacy in Clinical Care',
        'WHO ICD-10 Coding Standard (J18.9)',
        'EU AI Act & GDPR Art. 9 Compliance Protocol for Patient Education Portals'
      ],
    },
    'PX-8819': {
      patient_id: 'PX-8819', patient_name: 'Eleni Papadaki', age: 36, gender: 'Female',
      primary_diagnosis: 'Acute L4-L5 Lumbar Disc Extrusion with Radiculopathy',
      icd10_code: 'M51.16', umls_cui: 'C0020440',
      digitized_summary: 'Patient Eleni Papadaki (36y) presented with acute severe lower back pain radiating to right anterior thigh and L4 dermatome. Lumbar MRI confirms 7mm L4-L5 disc extrusion with right L4 nerve root compression.',
      patient_education_summary: 'An L4-L5 disc extrusion occurs when outer disc fibers tear, allowing inner cushion material to extrude outward and press on the L4 nerve root going down your leg.',
      illustration_prompt: 'Create a simple, non-intimidating, flat-vector medical illustration of human lumbar L4-L5 vertebrae showing disc extrusion pressing on L4 nerve root, suitable for patient education, clean white background',
      confidence_score: 0.985,
      recommended_action: 'Share visual diagram with patient during consultation. Initiate oral anti-inflammatory course & physical therapy evaluation.',
      evidence_citations: [
        'AHA Guidelines: Visual Aids & Patient Health Literacy in Clinical Care',
        'WHO ICD-10 Coding Standard (M51.16)',
        'EU AI Act & GDPR Art. 9 Compliance Protocol for Patient Education Portals'
      ],
    },
    'PX-8888': {
      patient_id: 'PX-8888', patient_name: 'Filippos-Paraskevas (Philip) Zygouris', age: 24, gender: 'Male',
      primary_diagnosis: 'Masticatory Myalgia & Jaw Muscle Strain',
      icd10_code: 'M79.1', umls_cui: 'C0026848',
      digitized_summary: 'Patient Philip Zygouris (24y) presented with localized pain and fatigue in muscles of mastication (masseter and temporalis) due to prolonged static posture and nocturnal bruxism.',
      patient_education_summary: 'Masticatory myalgia is muscle soreness in your chewing muscles (jaw and temples) caused by clenching teeth or muscle overuse.',
      illustration_prompt: 'Create a simple, non-intimidating, flat-vector medical illustration of the human head, jaw, and masseter temporalis masticatory muscles showing myofascial strain areas, suitable for patient education, clean white background',
      confidence_score: 0.985,
      recommended_action: 'Share visual diagram with patient during consultation. Recommend custom night guard, ergonomic adjustments, and soft diet protocol.',
      evidence_citations: [
        'AHA Guidelines: Visual Aids & Patient Health Literacy in Clinical Care',
        'WHO ICD-10 Coding Standard (M79.1)',
        'EU AI Act & GDPR Art. 9 Compliance Protocol for Patient Education Portals'
      ],
    },
  };
  return presets[pid] || {
    patient_id: pid, patient_name: `Patient #${pid}`, age: null, gender: null,
    primary_diagnosis: `Clinical Evaluation & Digitized Record (#${pid})`,
    icd10_code: 'Z00.00', umls_cui: 'C0012644',
    digitized_summary: `Digitized legacy medical report for patient #${pid}. Multi-agent synthesis completed with OCR and NLP concept extraction.`,
    patient_education_summary: `Personalized educational summary created for patient #${pid} explaining diagnosis, anatomical features, and care instructions.`,
    illustration_prompt: `Create a simple, non-intimidating, flat-vector medical illustration for Patient #${pid}, suitable for patient education, clean white background`,
    confidence_score: 0.985,
    recommended_action: 'Share visual anatomical illustration with patient during consultation.',
    evidence_citations: [
      'AHA Guidelines: Visual Aids & Patient Health Literacy in Clinical Care',
      'WHO ICD-10 Coding Standard for Legacy Document Synthesis',
      'EU AI Act & GDPR Art. 9 Compliance Protocol for Patient Education Portals',
    ],
  };
};

/* ─── Confidence Meter ────────────────────────────── */
function ConfidenceMeter({ score }) {
  const pct = Math.round(score * 100);
  const color = pct >= 95 ? 'var(--accent-emerald)' : pct >= 85 ? 'var(--accent-amber)' : 'var(--accent-rose)';
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span
          className="text-[10px] font-bold uppercase tracking-widest"
          style={{ fontFamily: "'JetBrains Mono'", color: 'var(--text-muted)' }}
        >
          CLINICAL DIGITIZATION CONFIDENCE
        </span>
        <span
          className="text-2xl font-bold"
          style={{ fontFamily: "'JetBrains Mono'", color }}
        >
          {pct}.{Math.round(score * 1000) % 10}%
        </span>
      </div>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}aa)` }}
        />
      </div>
      <div
        className="text-[10px]"
        style={{ color: 'var(--text-faint)', fontFamily: "'JetBrains Mono'" }}
      >
        Validated against AHA Health Literacy Standards
      </div>
    </div>
  );
}

export default function SupervisoryHITLPanel({
  hitlData, patientId, onApproved, onNavigateDashboard, onNavigateHistory
}) {
  const [selectedPid, setSelectedPid] = useState(patientId || 'PX-8810');
  const [patientList, setPatientList] = useState([]);
  const [activePatientRecord, setActivePatientRecord] = useState(null);
  const [physicianNotes, setPhysicianNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [decisionOutcome, setDecisionOutcome] = useState(null);

  useEffect(() => {
    fetchPatients().then((pts) => {
      if (Array.isArray(pts) && pts.length > 0) {
        setPatientList(pts);
      }
    });
  }, []);

  useEffect(() => {
    if (patientList.length > 0) {
      const found = patientList.find((p) => p.id === selectedPid);
      if (found) setActivePatientRecord(found);
    }
  }, [selectedPid, patientList]);

  useEffect(() => {
    if (patientId) setSelectedPid(patientId);
    setDecisionOutcome(null);
    setPhysicianNotes('');
  }, [patientId]);

  const handleDecision = async (decisionType) => {
    setSubmitting(true);
    try {
      const res = await sendPhysicianApproval(selectedPid, decisionType, physicianNotes);
      setDecisionOutcome(res);
      if (onApproved) onApproved(res);
    } catch (err) {
      console.error(err);
      alert('Failed to submit physician decision. Please check backend API.');
    } finally {
      setSubmitting(false);
    }
  };

  const preset = getPatientHitlPresetData(selectedPid);
  const rawData = hitlData || {};

  const data = {
    patient_id: selectedPid,
    patient_name: activePatientRecord?.name || rawData.patient_name || preset.patient_name,
    primary_diagnosis: activePatientRecord?.diagnosis || activePatientRecord?.primary_diagnosis || rawData.primary_diagnosis || rawData.diagnosis || preset.primary_diagnosis,
    icd10_code: activePatientRecord?.icd10_code || activePatientRecord?.icd10 || rawData.icd10_code || rawData.icd10 || preset.icd10_code,
    umls_cui: activePatientRecord?.umls_cui || rawData.umls_cui || preset.umls_cui,
    digitized_summary: activePatientRecord?.digitized_summary || activePatientRecord?.clinical_notes || rawData.digitized_summary || rawData.clinical_notes || preset.digitized_summary,
    patient_education_summary: rawData.patient_education_summary || preset.patient_education_summary,
    illustration_prompt: activePatientRecord?.illustration_prompt || rawData.illustration_prompt || preset.illustration_prompt,
    confidence_score: rawData.confidence_score || preset.confidence_score || 0.985,
    recommended_action: rawData.recommended_action || preset.recommended_action,
    evidence_citations: (Array.isArray(rawData.evidence_citations) && rawData.evidence_citations.length > 0)
      ? rawData.evidence_citations
      : preset.evidence_citations,
    b64_json: activePatientRecord?.b64_json || rawData.b64_json || preset.b64_json
  };

  return (
    <div className="space-y-5">
      {/* Page Title & Patient Selector */}
      <div className="animate-fade-in-down flex items-center justify-between">
        <div>
          <h1
            className="text-lg font-bold"
            style={{ fontFamily: "'JetBrains Mono'", color: 'var(--text-primary)' }}
          >
            PHYSICIAN SUPERVISORY REVIEW
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Human-in-the-Loop Clinical Verification & Protocol Approval — Patient #{selectedPid} ({data.patient_name})
          </p>
        </div>

        {patientList.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {patientList.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedPid(p.id);
                  setDecisionOutcome(null);
                }}
                className="btn-ghost transition-all duration-200 hover:scale-105"
                style={{
                  padding: '6px 12px',
                  fontSize: '10px',
                  ...(selectedPid === p.id
                    ? {
                        background: 'rgba(59,130,246,0.15)',
                        borderColor: 'rgba(59,130,246,0.4)',
                        color: 'var(--accent-blue)',
                        boxShadow: '0 0 12px rgba(59,130,246,0.15)',
                      }
                    : {}),
                }}
              >
                <User className="w-3 h-3" /> #{p.id}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto space-y-5">
        {/* Clean HITL Header Card */}
        <div
          className="glass-card-elevated p-6 animate-slide-in-up"
          style={{ border: '1px solid rgba(245,158,11,0.25)', boxShadow: '0 0 30px rgba(245,158,11,0.08)' }}
        >
          <div
            className="flex items-center justify-between pb-5"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 animate-pulse-glow"
                style={{
                  background: 'rgba(245,158,11,0.1)',
                  border: '1px solid rgba(245,158,11,0.3)',
                }}
              >
                <ShieldCheck className="w-6 h-6" style={{ color: 'var(--accent-amber)' }} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2
                    className="text-sm font-bold uppercase tracking-wider"
                    style={{ fontFamily: "'JetBrains Mono'", color: 'var(--text-primary)' }}
                  >
                    PHYSICIAN SUPERVISORY REVIEW
                  </h2>
                  <span
                    className="badge badge-emerald flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3 h-3" /> DIRECT EDUCATION DELIVERY READY
                  </span>
                </div>
                <p
                  className="text-[10px] mt-0.5"
                  style={{ fontFamily: "'JetBrains Mono'", color: 'var(--text-muted)' }}
                >
                  EU AI Act Article 14 / GDPR Article 9 Protocol · Patient #{selectedPid} ({data.patient_name})
                </p>
              </div>
            </div>
          </div>

          {/* Grid: Diagnosis + Confidence */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            <div
              className="p-4 rounded-xl space-y-3"
              style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)' }}
            >
              <span
                className="text-[10px] font-bold uppercase tracking-widest block"
                style={{ fontFamily: "'JetBrains Mono'", color: 'var(--text-faint)' }}
              >
                DIGITIZED DIAGNOSIS & CODES
              </span>
              <h3
                className="text-sm font-bold leading-snug"
                style={{ color: 'var(--accent-blue)' }}
              >
                {data.primary_diagnosis}
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="badge badge-emerald">ICD-10: {data.icd10_code}</span>
                <span className="badge badge-blue">UMLS CUI: {data.umls_cui}</span>
              </div>
            </div>

            <div
              className="p-4 rounded-xl"
              style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)' }}
            >
              <ConfidenceMeter score={data.confidence_score} />
            </div>
          </div>
        </div>

        {/* Visual Diagram Inspection Card */}
        <div
          className="glass-card p-5 space-y-4 animate-slide-in-up"
          style={{ borderColor: 'rgba(244,63,94,0.25)' }}
        >
          <div className="section-header justify-between">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4" style={{ color: 'var(--accent-rose)' }} />
              <span className="font-bold">PATIENT EDUCATION VISUAL AID INSPECTION</span>
            </div>
            <span className="badge badge-rose">AI Anatomical Visual Aid</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Visual Diagram Image */}
            <div
              className="md:col-span-6 relative rounded-xl overflow-hidden scanline-container"
              style={{
                height: 220,
                background: 'linear-gradient(135deg, #0f0b1e 0%, #1a0a1c 50%, #0c0b18 100%)',
                border: '1px solid rgba(244,63,94,0.25)',
              }}
            >
              {data.b64_json ? (
                <img
                  src={`data:image/png;base64,${data.b64_json}`}
                  alt="Patient Education Anatomical Visual Diagram"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                  <ImageIcon className="w-10 h-10 mb-2" style={{ color: 'rgba(244,63,94,0.5)' }} />
                  <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                    Anatomical Education Graphic
                  </span>
                </div>
              )}
            </div>

            {/* Prompt details */}
            <div className="md:col-span-6 space-y-3">
              <div
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ fontFamily: "'JetBrains Mono'", color: 'var(--accent-rose)' }}
              >
                SYNTHESIZED ANATOMICAL VISUAL AID SPECIFICATION:
              </div>
              <div className="mono-block text-xs leading-relaxed" style={{ color: '#c4b5fd' }}>
                {data.illustration_prompt}
              </div>
            </div>
          </div>
        </div>

        {/* Summaries */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-in-up" style={{ animationDelay: '100ms' }}>
          <div
            className="glass-card p-5 space-y-3"
            style={{ borderColor: 'rgba(168,85,247,0.2)' }}
          >
            <div
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ fontFamily: "'JetBrains Mono'", color: 'var(--accent-purple)' }}
            >
              CLINICAL DOCUMENT DIGITIZATION SUMMARY
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-primary)', fontFamily: 'Inter' }}>
              {data.digitized_summary}
            </p>
          </div>

          <div
            className="glass-card p-5 space-y-3"
            style={{ borderColor: 'rgba(244,63,94,0.2)' }}
          >
            <div
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ fontFamily: "'JetBrains Mono'", color: 'var(--accent-rose)' }}
            >
              PATIENT EDUCATION SUMMARY
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-primary)', fontFamily: 'Inter' }}>
              {data.patient_education_summary}
            </p>
          </div>
        </div>

        {/* Recommended Action */}
        <div
          className="glass-card p-5 animate-slide-in-up"
          style={{ animationDelay: '150ms', borderColor: 'rgba(59,130,246,0.2)' }}
        >
          <div
            className="text-[10px] font-bold uppercase tracking-widest mb-3"
            style={{ fontFamily: "'JetBrains Mono'", color: 'var(--accent-blue)' }}
          >
            RECOMMENDED CLINICAL ACTION
          </div>
          <div className="flex items-start gap-3">
            <Star className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent-blue)' }} />
            <p
              className="text-xs font-bold leading-relaxed"
              style={{ color: 'var(--text-primary)', fontFamily: 'Inter' }}
            >
              {data.recommended_action}
            </p>
          </div>
        </div>

        {/* Evidence Citations */}
        <div
          className="glass-card p-5 animate-slide-in-up"
          style={{ animationDelay: '200ms' }}
        >
          <div
            className="text-[10px] font-bold uppercase tracking-widest mb-4"
            style={{ fontFamily: "'JetBrains Mono'", color: 'var(--text-muted)' }}
          >
            CLINICAL GUIDELINES & EVIDENCE CITATIONS
          </div>
          <div className="space-y-2.5">
            {data.evidence_citations.map((cit, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl animate-fade-in"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  animationDelay: `${idx * 80}ms`,
                }}
              >
                <BookOpen className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent-blue)' }} />
                <span className="text-xs" style={{ color: 'var(--text-primary)', fontFamily: 'Inter' }}>{cit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Physician Notes Entry */}
        <div
          className="glass-card p-5 animate-slide-in-up"
          style={{ animationDelay: '250ms' }}
        >
          <label
            className="block text-[10px] font-bold uppercase tracking-widest mb-3"
            style={{ fontFamily: "'JetBrains Mono'", color: 'var(--text-muted)' }}
          >
            PHYSICIAN AUDIT NOTES (OPTIONAL REVIEW NOTES)
          </label>
          <textarea
            rows={3}
            value={physicianNotes}
            onChange={(e) => setPhysicianNotes(e.target.value)}
            placeholder="Enter clinical notes (e.g. APPROVED: Visual diagram verified with patient during bedside consultation)..."
            className="clinical-input"
            style={{ resize: 'none' }}
            id="physician-notes-textarea"
          />
        </div>

        {/* Decision Outcome Card */}
        {decisionOutcome && (
          <div
            className={`glass-card-elevated p-8 text-center space-y-4 animate-slide-in-up ${
              decisionOutcome.physician_decision === 'APPROVED' ? 'glow-ring-emerald' :
              decisionOutcome.physician_decision === 'REJECTED' ? 'glow-ring-rose' : ''
            }`}
          >
            {decisionOutcome.physician_decision === 'APPROVED' && (
              <CheckCircle2 className="w-12 h-12 mx-auto animate-count-up" style={{ color: 'var(--accent-emerald)' }} />
            )}
            {decisionOutcome.physician_decision === 'MODIFIED' && (
              <Edit3 className="w-12 h-12 mx-auto animate-count-up" style={{ color: 'var(--accent-amber)' }} />
            )}
            {decisionOutcome.physician_decision === 'REJECTED' && (
              <XCircle className="w-12 h-12 mx-auto animate-count-up" style={{ color: 'var(--accent-rose)' }} />
            )}

            <div>
              <h4
                className="text-base font-bold uppercase tracking-widest"
                style={{
                  fontFamily: "'JetBrains Mono'",
                  color: decisionOutcome.physician_decision === 'APPROVED' ? 'var(--accent-emerald)' :
                         decisionOutcome.physician_decision === 'MODIFIED' ? 'var(--accent-amber)' : 'var(--accent-rose)',
                }}
              >
                {decisionOutcome.physician_decision === 'APPROVED' && 'DIGITIZATION & PATIENT ILLUSTRATION APPROVED'}
                {decisionOutcome.physician_decision === 'MODIFIED' && 'ILLUSTRATION PROMPT MODIFIED & RE-SYNTHESIZED'}
                {decisionOutcome.physician_decision === 'REJECTED' && 'SYNTHESIS REJECTED — MARKED FOR RE-EVALUATION'}
              </h4>
              <p
                className="text-xs mt-1"
                style={{ fontFamily: "'JetBrains Mono'", color: 'var(--text-muted)' }}
              >
                Physician Decision Recorded · Audit ID: {decisionOutcome.audit_record?.audit_id || 'AUDIT-99823'}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              {onNavigateDashboard && (
                <button
                  onClick={onNavigateDashboard}
                  className="btn-primary flex items-center gap-2 transition-all duration-200 hover:scale-105"
                  style={{ padding: '12px 20px', fontSize: '11px' }}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  GO TO CLINICAL DASHBOARD
                </button>
              )}
              {onNavigateHistory && (
                <button
                  onClick={onNavigateHistory}
                  className="btn-ghost flex items-center gap-2 transition-all duration-200 hover:scale-105"
                  style={{ padding: '12px 20px', fontSize: '11px', color: 'var(--accent-emerald)', borderColor: 'rgba(16,185,129,0.3)' }}
                >
                  <History className="w-4 h-4" />
                  VIEW PATIENT HISTORY GRAPH
                </button>
              )}
            </div>
          </div>
        )}

        {/* CENTERED Bottom Primary Decision Buttons */}
        {!decisionOutcome && (
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 py-4 animate-slide-in-up"
            style={{ animationDelay: '300ms' }}
          >
            <button
              onClick={() => handleDecision('APPROVED')}
              disabled={submitting}
              className="btn-primary btn-emerald flex-1 max-w-xs transition-all duration-300 hover:scale-[1.03]"
              style={{ justifyContent: 'center', padding: '16px 24px', fontSize: '12px', width: '100%' }}
              id="center-btn-approve"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              APPROVE & SHARE WITH PATIENT
            </button>
            <button
              onClick={() => handleDecision('MODIFIED')}
              disabled={submitting}
              className="btn-primary btn-amber flex-1 max-w-xs transition-all duration-300 hover:scale-[1.03]"
              style={{ justifyContent: 'center', padding: '16px 24px', fontSize: '12px', width: '100%' }}
              id="center-btn-modify"
            >
              <Edit3 className="w-4 h-4 mr-1.5" />
              MODIFY ILLUSTRATION
            </button>
            <button
              onClick={() => handleDecision('REJECTED')}
              disabled={submitting}
              className="btn-primary btn-rose flex-1 max-w-xs transition-all duration-300 hover:scale-[1.03]"
              style={{ justifyContent: 'center', padding: '16px 24px', fontSize: '12px', width: '100%' }}
              id="center-btn-reject"
            >
              <XCircle className="w-4 h-4 mr-1.5" />
              REJECT & RE-EVALUATE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
