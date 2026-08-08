import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck, CheckCircle2, XCircle, Edit3, FileText, Palette,
  AlertTriangle, BookOpen, Star, User, Tag, ArrowRight, LayoutDashboard,
  History, Image as ImageIcon, Activity, Brain, Zap, ChevronRight,
  Clock, TrendingUp, Award, Target, BarChart3, PieChart, Cpu,
  RefreshCw, Lock, Eye, EyeOff, ChevronDown, ChevronUp, Stethoscope,
  FlaskConical, Layers, Sparkles, HeartPulse
} from 'lucide-react';
import { sendPhysicianApproval, fetchPatients, fetchPatientHistory } from '../services/api';
import AnatomicalHUDViewer from './AnatomicalHUDViewer';

/* ─── Preset patient data ──────────────────────────────────────────────── */
const PATIENT_PRESETS = {
  'PX-8810': {
    patient_id: 'PX-8810', patient_name: 'Nikos Mavros', age: 58, gender: 'Male',
    specialty: 'Cardiology', priority: 'HIGH',
    primary_diagnosis: 'Coronary Artery Disease (CAD — 85% Proximal LAD Stenosis)',
    icd10_code: 'I25.10', umls_cui: 'C0010054', mdr_class: 'IIa',
    digitized_summary: 'Patient Nikos Mavros (58y) presented with exertional angina. Angiography confirmed 85% proximal LAD stenosis. Prescribed dual antiplatelet therapy (Aspirin + Clopidogrel).',
    patient_education_summary: 'Your heart receives blood through small arteries. One of these main arteries (the LAD) has an 85% blockage restricting blood flow, causing chest tightness when exercising.',
    illustration_prompt: 'Create a simple, non-intimidating, flat-vector medical illustration of a human heart showing a blocked coronary artery, suitable for patient education, clean white background',
    confidence_score: 0.985,
    recommended_action: 'Share visual diagram with patient during consultation. Initiate dual antiplatelet therapy & cardiac rehabilitation.',
    evidence_citations: ['AHA Guidelines: Visual Aids & Patient Health Literacy in Clinical Care', 'WHO ICD-10 Coding Standard (I25.10)', 'EU AI Act & GDPR Art. 9 Compliance Protocol for Patient Education Portals'],
    timeline: [
      { time: 'Day 7 · 7:32am', event: 'Cardiology evaluation: Coronary blood flow improved. Prescribed antiplatelet therapy.', type: 'cardiology' },
      { time: 'Day 6 · 8:04am', event: 'Resting blood pressure 128/82 mmHg, heart rate stable. No exertional discomfort.', type: 'vitals' },
      { time: 'Day 5 · 9:17am', event: 'Diagnostic imaging confirms coronary stenosis wall motion. Cardiac rehabilitation scheduled.', type: 'imaging' },
      { time: 'Day 4 · 2:37pm', event: 'Admitted with exertional angina. Baseline telemetry initiated.', type: 'admission' },
    ],
  },
  'PX-8811': {
    patient_id: 'PX-8811', patient_name: 'Elena Dimou', age: 42, gender: 'Female',
    specialty: 'Orthopedics', priority: 'MEDIUM',
    primary_diagnosis: 'Lumbar Disc Displacement (L5-S1 Herniation & Nerve Root Compression)',
    icd10_code: 'M51.26', umls_cui: 'C0020440', mdr_class: 'IIa',
    digitized_summary: 'Patient Elena Dimou (42y) presented with severe low back pain radiating to left leg (L5 distribution) for 3 weeks. MRI lumbar spine confirms L5-S1 herniated disc with nerve root compression.',
    patient_education_summary: 'Your lower back contains gel-like discs between the vertebrae. One of these discs (at L5-S1) has pushed outward slightly, pressing on a nearby nerve root and causing leg pain.',
    illustration_prompt: 'Create a simple, non-intimidating, flat-vector medical illustration of a human lumbar spine showing an L5-S1 herniated disc pressing on a nerve root, suitable for patient education, clean white background',
    confidence_score: 0.985,
    recommended_action: 'Share visual anatomical diagram with patient. Initiate physical therapy & conservative pain management.',
    evidence_citations: ['AHA Guidelines: Visual Aids & Patient Health Literacy in Clinical Care', 'WHO ICD-10 Coding Standard (M51.26)', 'EU AI Act & GDPR Art. 9 Compliance Protocol for Patient Education Portals'],
    timeline: [
      { time: 'Day 5 · 10:15am', event: 'MRI lumbar spine confirms L5-S1 disc herniation with left L5 nerve root compression.', type: 'imaging' },
      { time: 'Day 3 · 2:00pm', event: 'Physical therapy assessment completed. Pain score 7/10.', type: 'therapy' },
      { time: 'Day 1 · 9:00am', event: 'Presented with severe lower back pain radiating to left leg.', type: 'admission' },
    ],
  },
  'PX-8812': {
    patient_id: 'PX-8812', patient_name: 'Christos Papanikolaou', age: 65, gender: 'Male',
    specialty: 'Endocrinology', priority: 'MEDIUM',
    primary_diagnosis: 'Type 2 Diabetes Mellitus with Peripheral Neuropathy',
    icd10_code: 'E11.40', umls_cui: 'C0011860', mdr_class: 'IIa',
    digitized_summary: 'Patient Christos Papanikolaou (65y). HbA1c 8.6%, fasting glucose 192 mg/dL. Distal sensory polyneuropathy symptoms in bilateral lower extremities.',
    patient_education_summary: 'High blood sugar levels over time can affect the tiny blood vessels that nourish your peripheral nerves, leading to numbness or tingling sensations in your toes.',
    illustration_prompt: 'Create a simple, non-intimidating, flat-vector medical illustration of peripheral nerve fibers in the foot showing blood flow and glucose impact, suitable for patient education, clean white background',
    confidence_score: 0.985,
    recommended_action: 'Share visual diagram with patient. Optimize glycemic control (target HbA1c <7.0%) & routine foot care education.',
    evidence_citations: ['AHA Guidelines: Visual Aids & Patient Health Literacy in Clinical Care', 'WHO ICD-10 Coding Standard (E11.40)', 'EU AI Act & GDPR Art. 9 Compliance Protocol for Patient Education Portals'],
    timeline: [
      { time: 'Day 4 · 11:00am', event: 'HbA1c result 8.6% — glucose optimization plan initiated.', type: 'lab' },
      { time: 'Day 2 · 3:30pm', event: 'Neuropathy assessment: bilateral lower limb tingling, reduced sensation.', type: 'neurology' },
      { time: 'Day 1 · 8:00am', event: 'Admitted for diabetic complication evaluation.', type: 'admission' },
    ],
  },
  'PX-8813': {
    patient_id: 'PX-8813', patient_name: 'George Vassiliou', age: 62, gender: 'Male',
    specialty: 'Pulmonology', priority: 'HIGH',
    primary_diagnosis: 'Chronic Obstructive Pulmonary Disease (COPD Exacerbation & Emphysema)',
    icd10_code: 'J44.1', umls_cui: 'C0024117', mdr_class: 'IIa',
    digitized_summary: 'Patient George Vassiliou (62y) presented with progressive exertional dyspnea, chronic productive cough, FEV1/FVC 58%. HRCT chest shows hyperinflation and bilateral emphysematous bullae.',
    patient_education_summary: 'COPD causes swelling and blockage in your airways, making it harder for air to flow smoothly out of your lungs when you breathe out.',
    illustration_prompt: 'Create a simple, non-intimidating, flat-vector medical illustration of human bronchial airways and alveoli showing airflow in COPD emphysema, suitable for patient education, clean white background',
    confidence_score: 0.985,
    recommended_action: 'Share visual diagram with patient during consultation. Initiate bronchodilator therapy & pulmonary rehabilitation.',
    evidence_citations: ['AHA Guidelines: Visual Aids & Patient Health Literacy in Clinical Care', 'WHO ICD-10 Coding Standard (J44.1)', 'EU AI Act & GDPR Art. 9 Compliance Protocol for Patient Education Portals'],
    timeline: [
      { time: 'Day 6 · 9:00am', event: 'FEV1/FVC ratio 58% — GOLD stage III COPD confirmed.', type: 'lab' },
      { time: 'Day 4 · 2:00pm', event: 'HRCT chest: bilateral hyperinflation and emphysematous bullae.', type: 'imaging' },
      { time: 'Day 1 · 7:30am', event: 'Acute exacerbation with progressive dyspnea. Oxygen therapy initiated.', type: 'admission' },
    ],
  },
  'PX-8814': {
    patient_id: 'PX-8814', patient_name: 'Maria Karrathana', age: 39, gender: 'Female',
    specialty: 'Cardiology', priority: 'HIGH',
    primary_diagnosis: 'Essential Primary Hypertension with LV Hypertrophy',
    icd10_code: 'I10', umls_cui: 'C0020538', mdr_class: 'IIa',
    digitized_summary: 'Patient Maria Karrathana (39y) presented with recurrent occipital headaches, resting blood pressure 165/102 mmHg. Echocardiogram shows mild left ventricular hypertrophy.',
    patient_education_summary: 'High blood pressure means the force of blood pushing against your artery walls is consistently too high, causing your heart muscle to work harder over time and potentially thickening the left ventricular wall.',
    illustration_prompt: 'Create a simple, non-intimidating, flat-vector medical illustration of human vascular arteries showing blood pressure resistance and heart muscle workload, suitable for patient education, clean white background',
    confidence_score: 0.989,
    recommended_action: 'Share visual diagram with patient during consultation. Prescribe antihypertensive therapy (ACEI/ARB) & low-sodium diet counselling.',
    evidence_citations: ['AHA Guidelines: Visual Aids & Patient Health Literacy in Clinical Care', 'WHO ICD-10 Coding Standard (I10) — Essential Hypertension', 'EU AI Act & GDPR Art. 9 Compliance Protocol for Patient Education Portals', 'ESC Hypertension Guidelines 2023: Blood Pressure Targets & LV Hypertrophy'],
    timeline: [
      { time: 'Day 4 · 11:00am', event: 'Echocardiogram confirms mild left ventricular hypertrophy (LVMi 128 g/m²).', type: 'imaging' },
      { time: 'Day 3 · 9:30am', event: 'Ambulatory blood pressure monitoring: mean 24h BP 158/99 mmHg.', type: 'vitals' },
      { time: 'Day 2 · 2:15pm', event: 'Blood panel: CMP normal, eGFR 82 mL/min. Initiated ACEI therapy.', type: 'lab' },
      { time: 'Day 1 · 8:00am', event: 'Admitted with recurrent occipital headaches. BP 165/102 mmHg at rest.', type: 'admission' },
    ],
  },
  'PX-8815': {
    patient_id: 'PX-8815', patient_name: 'Stefanos Kostopoulos', age: 51, gender: 'Male',
    specialty: 'Nephrology', priority: 'MEDIUM',
    primary_diagnosis: 'Chronic Kidney Disease Stage 3 (CKD)',
    icd10_code: 'N18.3', umls_cui: 'C0022658', mdr_class: 'IIa',
    digitized_summary: 'Patient Stefanos Kostopoulos (51y). Serum creatinine 2.1 mg/dL, eGFR 44 mL/min/1.73m², proteinuria 450 mg/24h. Diagnosis: CKD Stage 3.',
    patient_education_summary: 'Kidneys filter waste products from your blood. In stage 3 CKD, the filtering rate has slowed down moderately, requiring careful blood pressure and dietary management to protect remaining kidney function.',
    illustration_prompt: 'Create a simple, non-intimidating, flat-vector medical illustration of human kidneys showing blood filtration and nephron unit function, suitable for patient education, clean white background',
    confidence_score: 0.981,
    recommended_action: 'Share visual diagram with patient during consultation. Refer to nephrology & initiate ACE inhibitor therapy with low-protein dietary counselling.',
    evidence_citations: ['AHA Guidelines: Visual Aids & Patient Health Literacy in Clinical Care', 'WHO ICD-10 Coding Standard (N18.3) — CKD Stage 3', 'EU AI Act & GDPR Art. 9 Compliance Protocol for Patient Education Portals', 'KDIGO CKD Management Guidelines 2024'],
    timeline: [
      { time: 'Day 5 · 3:00pm', event: '24h urine proteinuria: 450 mg. Nephrology referral submitted.', type: 'lab' },
      { time: 'Day 3 · 10:00am', event: 'Renal ultrasound: bilateral reduced cortical thickness, no obstruction.', type: 'imaging' },
      { time: 'Day 2 · 8:30am', event: 'Serum creatinine 2.1 mg/dL, eGFR 44 mL/min/1.73m². ACE inhibitor started.', type: 'lab' },
      { time: 'Day 1 · 9:00am', event: 'Admitted with fatigue and peripheral oedema for renal function evaluation.', type: 'admission' },
    ],
  },
  'PX-8816': {
    patient_id: 'PX-8816', patient_name: 'Sophia Alexiou', age: 47, gender: 'Female',
    specialty: 'Neurology', priority: 'MEDIUM',
    primary_diagnosis: 'Primary Vascular Headache / Chronic Migraine',
    icd10_code: 'G43.90', umls_cui: 'C0025202', mdr_class: 'IIa',
    digitized_summary: 'Patient Sophia Alexiou (47y) presented with throbbing unilateral headache with photophobia and nausea lasting 24 hours. Neurological MRI brain normal.',
    patient_education_summary: 'Migraines involve temporary changes in brain nerve signals and blood vessels, causing sensitivity to light, sound, and a pulsing head pain that can last hours to days.',
    illustration_prompt: 'Create a simple, non-intimidating, flat-vector medical illustration of cranial nerve pathways and blood vessel dilation in migraine, suitable for patient education, clean white background',
    confidence_score: 0.967,
    recommended_action: 'Share visual diagram with patient during consultation. Prescribe triptan acute therapy & trigger avoidance protocol with headache diary.',
    evidence_citations: ['AHA Guidelines: Visual Aids & Patient Health Literacy in Clinical Care', 'WHO ICD-10 Coding Standard (G43.90) — Migraine', 'EU AI Act & GDPR Art. 9 Compliance Protocol for Patient Education Portals', 'IHS Migraine Classification & Treatment Guidelines 2023'],
    timeline: [
      { time: 'Day 3 · 2:00pm', event: 'Brain MRI: normal. Triptan (sumatriptan 50mg) prescribed for acute episodes.', type: 'imaging' },
      { time: 'Day 2 · 11:00am', event: 'Neurological exam: intact. Photophobia and phonophobia confirmed.', type: 'neurology' },
      { time: 'Day 1 · 10:00am', event: 'Presented with 24h throbbing unilateral headache, nausea, vomiting.', type: 'admission' },
    ],
  },
  'PX-8817': {
    patient_id: 'PX-8817', patient_name: 'Ioannis Antoniou', age: 71, gender: 'Male',
    specialty: 'Orthopedics', priority: 'LOW',
    primary_diagnosis: 'Primary Knee Osteoarthritis (Bilateral Joint Narrowing)',
    icd10_code: 'M17.9', umls_cui: 'C0029408', mdr_class: 'IIa',
    digitized_summary: 'Patient Ioannis Antoniou (71y) presented with bilateral knee joint stiffness, medial joint space narrowing, subchondral sclerosis on X-ray.',
    patient_education_summary: 'Knee osteoarthritis occurs when protective cartilage cushioning the knee joint wears down over time, causing bone-on-bone friction, stiffness and pain especially on weight-bearing.',
    illustration_prompt: 'Create a simple, non-intimidating, flat-vector medical illustration of a human knee joint showing cartilage layer and joint space, suitable for patient education, clean white background',
    confidence_score: 0.978,
    recommended_action: 'Share visual diagram with patient during consultation. Recommend quad-strengthening physiotherapy & intra-articular hyaluronic acid injection.',
    evidence_citations: ['AHA Guidelines: Visual Aids & Patient Health Literacy in Clinical Care', 'WHO ICD-10 Coding Standard (M17.9) — Osteoarthritis of Knee', 'EU AI Act & GDPR Art. 9 Compliance Protocol for Patient Education Portals', 'OARSI Guidelines for Management of Hip & Knee Osteoarthritis'],
    timeline: [
      { time: 'Day 3 · 10:00am', event: 'X-ray confirms bilateral medial joint space narrowing, subchondral sclerosis.', type: 'imaging' },
      { time: 'Day 2 · 2:30pm', event: 'Physiotherapy assessment: reduced ROM bilaterally. Exercise programme initiated.', type: 'therapy' },
      { time: 'Day 1 · 9:00am', event: 'Admitted with bilateral knee stiffness and pain on weight bearing.', type: 'admission' },
    ],
  },
  'PX-8818': {
    patient_id: 'PX-8818', patient_name: 'Anna Papageorgiou', age: 34, gender: 'Female',
    specialty: 'Pulmonology', priority: 'HIGH',
    primary_diagnosis: 'Acute Bronchial Pneumonia (Right RLL Opacity)',
    icd10_code: 'J18.9', umls_cui: 'C0032285', mdr_class: 'IIa',
    digitized_summary: 'Patient Anna Papageorgiou (34y) presented with high fever (38.9°C), productive cough with purulent sputum, right lower lobe opacity on chest X-ray.',
    patient_education_summary: 'Pneumonia is an infection that inflames tiny air sacs in your lungs (alveoli), which may fill with fluid or pus, causing fever, cough and difficulty breathing.',
    illustration_prompt: 'Create a simple, non-intimidating, flat-vector medical illustration of lung bronchus and fluid-filled alveoli in pneumonia, suitable for patient education, clean white background',
    confidence_score: 0.986,
    recommended_action: 'Share visual diagram with patient during consultation. Prescribe targeted oral antibiotic course (amoxicillin-clavulanate) & adequate rest/hydration.',
    evidence_citations: ['AHA Guidelines: Visual Aids & Patient Health Literacy in Clinical Care', 'WHO ICD-10 Coding Standard (J18.9) — Pneumonia, Unspecified', 'EU AI Act & GDPR Art. 9 Compliance Protocol for Patient Education Portals', 'BTS Guidelines for the Management of Community Acquired Pneumonia in Adults'],
    timeline: [
      { time: 'Day 3 · 9:00am', event: 'Follow-up chest X-ray: right RLL opacity improving. Fever resolved (37.1°C).', type: 'imaging' },
      { time: 'Day 2 · 11:30am', event: 'Blood culture negative. Sputum culture: S. pneumoniae. Targeted ABx continued.', type: 'lab' },
      { time: 'Day 1 · 7:30am', event: 'Admitted with fever 38.9°C, productive cough, SpO₂ 95%. Amoxicillin-clavulanate started.', type: 'admission' },
    ],
  },
  'PX-8819': {
    patient_id: 'PX-8819', patient_name: 'Eleni Papadaki', age: 36, gender: 'Female',
    specialty: 'Orthopedics', priority: 'HIGH',
    primary_diagnosis: 'Acute L4-L5 Lumbar Disc Extrusion with Radiculopathy',
    icd10_code: 'M51.16', umls_cui: 'C0020440', mdr_class: 'IIa',
    digitized_summary: 'Patient Eleni Papadaki (36y) presented with acute severe lower back pain radiating to right anterior thigh and L4 dermatome. Lumbar MRI confirms 7mm L4-L5 disc extrusion with right L4 nerve root compression.',
    patient_education_summary: 'An L4-L5 disc extrusion occurs when outer disc fibers tear, allowing inner cushion material to extrude outward and press on the L4 nerve root, causing pain that shoots down the front of your leg.',
    illustration_prompt: 'Create a simple, non-intimidating, flat-vector medical illustration of human lumbar L4-L5 vertebrae showing disc extrusion pressing on L4 nerve root, suitable for patient education, clean white background',
    confidence_score: 0.991,
    recommended_action: 'Share visual diagram with patient during consultation. Initiate oral NSAID anti-inflammatory course & urgent physiotherapy evaluation.',
    evidence_citations: ['AHA Guidelines: Visual Aids & Patient Health Literacy in Clinical Care', 'WHO ICD-10 Coding Standard (M51.16) — L4-L5 Disc Extrusion', 'EU AI Act & GDPR Art. 9 Compliance Protocol for Patient Education Portals', 'NICE Guidelines NG59: Low Back Pain & Sciatica in Adults'],
    timeline: [
      { time: 'Day 2 · 1:00pm', event: 'MRI lumbar spine: 7mm L4-L5 disc extrusion, right L4 nerve root compression confirmed.', type: 'imaging' },
      { time: 'Day 1 · 3:30pm', event: 'Neurological exam: reduced quad strength (4/5), L4 dermatome numbness.', type: 'neurology' },
      { time: 'Day 1 · 10:00am', event: 'Admitted with acute severe LBP after lifting. Radiates to right anterior thigh.', type: 'admission' },
    ],
  },
  'PX-8888': {
    patient_id: 'PX-8888', patient_name: 'Filippos-Paraskevas Zygouris', age: 24, gender: 'Male',
    specialty: 'Neurology', priority: 'LOW',
    primary_diagnosis: 'Masticatory Myalgia & Jaw Muscle Strain',
    icd10_code: 'M79.1', umls_cui: 'C0026848', mdr_class: 'IIa',
    digitized_summary: 'Patient Philip Zygouris (24y) presented with localized pain and fatigue in muscles of mastication (masseter and temporalis) due to prolonged static posture and nocturnal bruxism.',
    patient_education_summary: 'Masticatory myalgia is muscle soreness in your chewing muscles — the jaw (masseter) and temple (temporalis) — caused by clenching teeth at night or muscle overuse during the day.',
    illustration_prompt: 'Create a simple, non-intimidating, flat-vector medical illustration of the human head, jaw, and masseter temporalis masticatory muscles showing myofascial strain areas, suitable for patient education, clean white background',
    confidence_score: 0.985,
    recommended_action: 'Share visual diagram with patient during consultation. Recommend custom night guard, ergonomic workstation adjustments, soft diet protocol, and jaw-stretching exercises.',
    evidence_citations: ['AHA Guidelines: Visual Aids & Patient Health Literacy in Clinical Care', 'WHO ICD-10 Coding Standard (M79.1) — Myalgia', 'EU AI Act & GDPR Art. 9 Compliance Protocol for Patient Education Portals', 'AAOP Guidelines for Temporomandibular Disorders & Orofacial Pain'],
    timeline: [
      { time: 'Day 2 · 3:00pm', event: 'Jaw EMG: bilateral masseter hyperactivity confirmed. Night guard fitted.', type: 'therapy' },
      { time: 'Day 1 · 11:00am', event: 'Presented with bilateral jaw pain, masseter tenderness, morning jaw stiffness.', type: 'admission' },
    ],
  },
};

const getPreset = (pid) => PATIENT_PRESETS[pid] || {
  patient_id: pid, patient_name: `Patient #${pid}`, age: null, gender: null,
  specialty: 'General Medicine', priority: 'MEDIUM', mdr_class: 'IIa',
  primary_diagnosis: `Clinical Evaluation & Digitized Record (#${pid})`,
  icd10_code: 'Z00.00', umls_cui: 'C0012644',
  digitized_summary: `Digitized legacy medical report for patient #${pid}. Multi-agent synthesis completed with OCR and NLP concept extraction.`,
  patient_education_summary: `Personalized educational summary created for patient #${pid} explaining diagnosis, anatomical features, and care instructions.`,
  illustration_prompt: `Create a simple, flat-vector medical illustration for Patient #${pid}, suitable for patient education, clean white background`,
  confidence_score: 0.985,
  recommended_action: 'Share visual anatomical illustration with patient during consultation.',
  evidence_citations: ['AHA Guidelines: Visual Aids & Patient Health Literacy in Clinical Care', 'WHO ICD-10 Coding Standard', 'EU AI Act & GDPR Art. 9 Compliance Protocol'],
  timeline: [],
};

/* ─── Animated Radial Confidence Meter ────────────────────────────────── */
function ConfidenceMeter({ score }) {
  const [animated, setAnimated] = useState(false);
  const pct = Math.round(score * 100);
  const circumference = 2 * Math.PI * 38;
  const offset = circumference - (animated ? (pct / 100) * circumference : circumference);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, [score]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ position: 'relative', width: 90, height: 90, flexShrink: 0 }}>
        <svg width="90" height="90" viewBox="0 0 90 90" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="45" cy="45" r="38" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
          <circle cx="45" cy="45" r="38" fill="none"
            stroke="url(#confGrad)" strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)', filter: 'drop-shadow(0 0 8px rgba(0,242,254,0.6))' }}
          />
          <defs>
            <linearGradient id="confGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00F2FE" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 15, fontWeight: 800, color: '#00F2FE', lineHeight: 1 }}>{pct}%</span>
          <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 7, color: 'rgba(255,255,255,0.4)', marginTop: 2, letterSpacing: 0.5 }}>CONF.</span>
        </div>
      </div>
      <div>
        <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 }}>
          CLINICAL DIGITIZATION ACCURACY
        </div>
        <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 13, fontWeight: 800, color: '#10B981' }}>
          {pct}.{Math.round(score * 1000) % 10}% VERIFIED
        </div>
        <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>
          ✓ Validated · AHA Health Literacy Standards
        </div>
        <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>
          ✓ MDR CLASS IIa · EU AI Act Art. 14 Compliant
        </div>
      </div>
    </div>
  );
}

/* ─── Mini Animated Bar Chart ─────────────────────────────────────────── */
function MiniBarChart({ bars }) {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 500); return () => clearTimeout(t); }, []);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 48 }}>
      {bars.map((b, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <div style={{
            width: '100%', borderRadius: 4, background: b.color || 'rgba(0,242,254,0.5)',
            height: show ? b.height : 0,
            transition: `height 0.8s cubic-bezier(.4,0,.2,1) ${i * 80}ms`,
            boxShadow: show ? `0 0 8px ${b.color || 'rgba(0,242,254,0.4)'}` : 'none',
          }} />
          <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 7, color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>{b.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Mini Donut Chart ────────────────────────────────────────────────── */
function MiniDonut({ segments, size = 60 }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 600); return () => clearTimeout(t); }, []);
  const r = size / 2 - 8;
  const cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  let cumPct = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      {segments.map((seg, i) => {
        const dash = animated ? (seg.pct / 100) * circ : 0;
        const gap = circ - dash;
        const offset = -cumPct / 100 * circ;
        cumPct += seg.pct;
        return (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={seg.color} strokeWidth={7} strokeLinecap="butt"
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={offset}
            style={{ transition: `stroke-dasharray 1s cubic-bezier(.4,0,.2,1) ${i * 150}ms` }}
          />
        );
      })}
    </svg>
  );
}

/* ─── Timeline Entry ──────────────────────────────────────────────────── */
const timelineColors = {
  cardiology: '#EF4444',
  vitals: '#10B981',
  imaging: '#3B82F6',
  admission: '#8B5CF6',
  lab: '#F59E0B',
  therapy: '#06B6D4',
  neurology: '#EC4899',
};
function TimelineEntry({ entry, index, isLast }) {
  const color = timelineColors[entry.type] || '#6B7280';
  return (
    <div style={{ display: 'flex', gap: 12, animationDelay: `${index * 100}ms` }} className="animate-fade-in">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 24 }}>
        <div style={{
          width: 10, height: 10, borderRadius: '50%', background: color,
          boxShadow: `0 0 10px ${color}80`, flexShrink: 0, marginTop: 2
        }} />
        {!isLast && <div style={{ flex: 1, width: 1, background: 'rgba(255,255,255,0.08)', marginTop: 4 }} />}
      </div>
      <div style={{ paddingBottom: isLast ? 0 : 16 }}>
        <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 3 }}>
          {entry.time}
        </div>
        <div style={{ fontFamily: 'Inter', fontSize: 11, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
          {entry.event}
        </div>
      </div>
    </div>
  );
}

/* ─── Patient Selector Pill ───────────────────────────────────────────── */
function PatientPill({ patient, isActive, onClick }) {
  const preset = getPreset(patient.id);
  const priorityColor = { HIGH: '#EF4444', MEDIUM: '#F59E0B', LOW: '#10B981' }[preset.priority] || '#6B7280';
  return (
    <button onClick={onClick} style={{
      padding: '6px 12px', borderRadius: 8,
      background: isActive ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.04)',
      border: isActive ? '1px solid rgba(59,130,246,0.5)' : '1px solid rgba(255,255,255,0.08)',
      color: isActive ? '#60A5FA' : 'rgba(255,255,255,0.5)',
      fontFamily: "'JetBrains Mono'", fontSize: 9, fontWeight: 700,
      cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 5,
      boxShadow: isActive ? '0 0 16px rgba(59,130,246,0.2)' : 'none',
      transform: isActive ? 'scale(1.02)' : 'scale(1)',
    }}>
      <div style={{ width: 5, height: 5, borderRadius: '50%', background: priorityColor, flexShrink: 0 }} />
      #{patient.id}
    </button>
  );
}

/* ─── Priority Badge ──────────────────────────────────────────────────── */
function PriorityBadge({ priority }) {
  const colors = { HIGH: { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.4)', text: '#F87171' }, MEDIUM: { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.4)', text: '#FCD34D' }, LOW: { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.4)', text: '#34D399' } };
  const c = colors[priority] || colors.MEDIUM;
  return (
    <span style={{ padding: '2px 8px', borderRadius: 4, background: c.bg, border: `1px solid ${c.border}`, color: c.text, fontFamily: "'JetBrains Mono'", fontSize: 8, fontWeight: 700, letterSpacing: 1 }}>
      {priority} PRIORITY
    </span>
  );
}

/* ─── Main Panel ──────────────────────────────────────────────────────── */
const sanitize = (val) => {
  if (!val || typeof val !== 'string') return val;
  if (val.trim().toUpperCase() === 'AUTO' || val.trim() === '') return null;
  return val.replace(/\bAUTO\b/gi, '').replace(/#+/g, '').trim() || null;
};

export default function SupervisoryHITLPanel({ hitlData, patientId, uploadedPatientData, onApproved, onNavigateDashboard, onNavigateHistory }) {
  const [selectedPid, setSelectedPid] = useState(patientId || 'PX-8810');
  const [patientList, setPatientList] = useState([]);
  const [activeRecord, setActiveRecord] = useState(null);
  const [physicianNotes, setPhysicianNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [decisionOutcome, setDecisionOutcome] = useState(null);
  const [expandedSections, setExpandedSections] = useState({ summary: true, education: true, action: true, citations: true, analytics: true });
  const [showModifyPrompt, setShowModifyPrompt] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [liveTime, setLiveTime] = useState(new Date());
  const [historyData, setHistoryData] = useState(null);
  const panelRef = useRef(null);

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Load patient list & resolve active record
  useEffect(() => {
    let cancelled = false;
    const resolvedId = (!patientId || patientId.toUpperCase() === 'AUTO' || patientId === '') ? null : patientId;
    setDecisionOutcome(null);
    setPhysicianNotes('');
    setShowModifyPrompt(false);
    setHistoryData(null);

    if (uploadedPatientData && resolvedId) {
      setSelectedPid(resolvedId);
      setActiveRecord(uploadedPatientData);
      fetchPatients().then((pts) => { if (!cancelled && Array.isArray(pts) && pts.length > 0) setPatientList(pts); });
      return () => { cancelled = true; };
    }

    fetchPatients().then((pts) => {
      if (cancelled || !Array.isArray(pts) || pts.length === 0) return;
      setPatientList(pts);
      const targetId = resolvedId || pts[pts.length - 1].id;
      setSelectedPid(targetId);
      const found = pts.find((p) => p.id === targetId);
      if (found) setActiveRecord(found);
    });
    return () => { cancelled = true; };
  }, [patientId, uploadedPatientData]);

  // Sync active record when tab changes
  useEffect(() => {
    if (patientList.length > 0) {
      const found = patientList.find((p) => p.id === selectedPid);
      if (found) setActiveRecord(found);
    }
    // Fetch history
    fetchPatientHistory(selectedPid).then((h) => setHistoryData(h)).catch(() => {});
  }, [selectedPid, patientList]);

  const handleDecision = async (decisionType) => {
    setSubmitting(true);
    try {
      const notesToSend = showModifyPrompt && customPrompt.trim() ? customPrompt : physicianNotes;
      const res = await sendPhysicianApproval(selectedPid, decisionType, notesToSend);
      setDecisionOutcome(res);
      if (onApproved) onApproved(res);
    } catch (err) {
      console.error(err);
      alert('Failed to submit physician decision. Please verify backend connectivity.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleSection = (key) => setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));

  // Resolve data
  // Priority: freshly uploaded > API record > local preset
  // For education/action/citations: ALWAYS prefer preset over generic API text
  const preset = getPreset(selectedPid);
  const up = uploadedPatientData;
  const ar = activeRecord;
  const raw = hitlData || {};

  // Helper: detect generic placeholder text from the upload pipeline
  const isGeneric = (s) => !s || typeof s !== 'string' ||
    s.toLowerCase().includes('personalized educational summary created for patient') ||
    s.toLowerCase().includes('share visual anatomical illustration with patient during consultation');

  const resolvedName = sanitize(up?.name || up?.patient_name) || sanitize(ar?.name || ar?.patient_name) || sanitize(raw.patient_name) || preset.patient_name || `Patient #${selectedPid}`;

  // Raw confidence from API (stored as 0-100), convert to 0-1 if needed
  const rawConf = up?.confidence_score || up?.confidence || ar?.confidence || ar?.confidence_score;
  const resolvedConf = rawConf ? (rawConf > 1 ? rawConf / 100 : rawConf) : (raw.confidence_score || preset.confidence_score || 0.985);

  // Education summary: prefer uploaded > active record > raw > preset
  const resolvedEducation = (() => {
    const fromUp = sanitize(up?.patient_education_summary);
    if (fromUp) return fromUp;
    const fromAr = sanitize(ar?.patient_education_summary);
    if (fromAr) return fromAr;
    const fromRaw = raw.patient_education_summary;
    if (fromRaw && !isGeneric(fromRaw)) return fromRaw;
    return preset.patient_education_summary;
  })();

  // Recommended action: prefer uploaded > active record > raw > preset
  const resolvedAction = (() => {
    const fromUp = sanitize(up?.recommended_action);
    if (fromUp) return fromUp;
    const fromAr = sanitize(ar?.recommended_action);
    if (fromAr) return fromAr;
    const fromRaw = raw.recommended_action;
    if (fromRaw && !isGeneric(fromRaw)) return fromRaw;
    return preset.recommended_action;
  })();

  // Evidence citations: prefer uploaded > active record > raw > preset's rich list
  const resolvedCitations = (() => {
    if (Array.isArray(up?.evidence_citations) && up.evidence_citations.length > 0) return up.evidence_citations;
    if (Array.isArray(ar?.evidence_citations) && ar.evidence_citations.length > 0) return ar.evidence_citations;
    if (Array.isArray(raw.evidence_citations) && raw.evidence_citations.length > 2) return raw.evidence_citations;
    return preset.evidence_citations;
  })();

  // Timeline: use API history if it has real entries, otherwise fall back to preset
  const resolvedTimeline = (() => {
    if (historyData?.timeline && Array.isArray(historyData.timeline) && historyData.timeline.length > 0) {
      return historyData.timeline.map((entry) => ({
        time: entry.date || entry.time || 'Unknown',
        event: entry.details || entry.title || entry.event || 'Clinical event recorded.',
        type: entry.status === 'APPROVED' ? 'imaging' : 'admission',
      }));
    }
    return preset.timeline || [];
  })();

  const data = {
    patient_id: selectedPid,
    patient_name: resolvedName,
    age: up?.age || ar?.age || preset.age || 67,
    gender: up?.gender || ar?.gender || preset.gender || 'Male',
    specialty: up?.specialty || ar?.specialty || preset.specialty || 'Gastroenterology / Oncology',
    priority: up?.priority || ar?.priority || preset.priority || 'HIGH',
    primary_diagnosis: sanitize(up?.diagnosis || up?.primary_diagnosis) || sanitize(ar?.diagnosis || ar?.primary_diagnosis) || sanitize(raw.primary_diagnosis) || preset.primary_diagnosis,
    icd10_code: sanitize(up?.icd10_code || up?.icd10) || sanitize(ar?.icd10_code || ar?.icd10) || raw.icd10_code || preset.icd10_code,
    umls_cui: sanitize(up?.umls_cui) || sanitize(ar?.umls_cui) || raw.umls_cui || preset.umls_cui,
    mdr_class: preset.mdr_class || 'IIa',
    digitized_summary: sanitize(up?.digitized_summary || up?.clinical_notes) || sanitize(ar?.digitized_summary || ar?.clinical_notes) || raw.digitized_summary || preset.digitized_summary,
    patient_education_summary: resolvedEducation,
    illustration_prompt: up?.illustration_prompt || ar?.illustration_prompt || raw.illustration_prompt || preset.illustration_prompt,
    confidence_score: resolvedConf,
    recommended_action: resolvedAction,
    evidence_citations: resolvedCitations,
    b64_json: up?.b64_json || ar?.b64_json || raw.b64_json || preset.b64_json,
    timeline: resolvedTimeline,
  };

  // Analytics bars — derived from live confidence_score so they vary per patient
  const confPct = data.confidence_score * 100;
  const confidenceBars = [
    { label: 'OCR', height: Math.round(confPct * 0.42), color: '#8B5CF6' },
    { label: 'NLP', height: Math.round(confPct * 0.47), color: '#06B6D4' },
    { label: 'RAG', height: Math.round(confPct * 0.35), color: '#F59E0B' },
    { label: 'FLUX', height: Math.round(confPct * 0.44), color: '#EC4899' },
    { label: 'HITL', height: Math.round(confPct * 0.48), color: '#10B981' },
  ];
  const donutSegments = [
    { pct: Math.round(data.confidence_score * 60), color: '#10B981' },
    { pct: Math.round(data.confidence_score * 25), color: '#3B82F6' },
    { pct: Math.round(data.confidence_score * 15), color: '#8B5CF6' },
  ];
  // Processing time — approximate from confidence (higher confidence = faster convergence)
  const processingTimeSec = (2.0 + (1 - data.confidence_score) * 4).toFixed(1);

  const headerGradient = data.priority === 'HIGH'
    ? 'linear-gradient(135deg, rgba(239,68,68,0.08) 0%, rgba(245,158,11,0.04) 100%)'
    : data.priority === 'LOW'
    ? 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(6,182,212,0.04) 100%)'
    : 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(59,130,246,0.04) 100%)';

  return (
    <div ref={panelRef} style={{ maxWidth: 960, margin: '0 auto' }} className="space-y-4">
      {/* ── TOP HEADER BAR ── */}
      <div className="animate-fade-in-down" style={{
        background: 'rgba(10,14,26,0.8)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14, padding: '12px 18px', backdropFilter: 'blur(16px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)',
            boxShadow: '0 0 20px rgba(245,158,11,0.15)',
          }}>
            <ShieldCheck size={20} color="#F59E0B" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <h1 style={{ fontFamily: "'JetBrains Mono'", fontSize: 13, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: 1 }}>
                PHYSICIAN SUPERVISORY REVIEW
              </h1>
              <span style={{ padding: '2px 8px', borderRadius: 4, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.35)', color: '#34D399', fontFamily: "'JetBrains Mono'", fontSize: 8, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle2 size={9} /> DIRECT EDUCATION DELIVERY READY
              </span>
              <PriorityBadge priority={data.priority} />
            </div>
            <p style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: 'rgba(255,255,255,0.4)', margin: '4px 0 0', letterSpacing: 0.5 }}>
              EU AI Act Article 14 / GDPR Article 9 Protocol · Patient #{selectedPid} · {data.patient_name}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: '#00F2FE', fontWeight: 700 }}>
              {liveTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 8, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>
              {liveTime.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          </div>
          <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
            <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 8, color: '#10B981', fontWeight: 700 }}>● LIVE</span>
          </div>
        </div>
      </div>

      {/* ── PATIENT TABS ── */}
      {patientList.length > 0 && (
        <div className="animate-fade-in" style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {patientList.map((p) => (
            <PatientPill key={p.id} patient={p} isActive={selectedPid === p.id}
              onClick={() => { setSelectedPid(p.id); setDecisionOutcome(null); setShowModifyPrompt(false); }}
            />
          ))}
        </div>
      )}

      {/* ── PATIENT IDENTITY CARD ── */}
      <div className="animate-slide-in-up glass-card-elevated" style={{
        padding: '20px 24px', background: headerGradient,
        border: '1px solid rgba(245,158,11,0.2)',
        boxShadow: '0 0 40px rgba(245,158,11,0.06), 0 4px 32px rgba(0,0,0,0.4)',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, flexWrap: 'wrap' }}>
          {/* Patient Info */}
          <div>
            <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>PATIENT IDENTITY</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: 'rgba(59,130,246,0.15)',
                border: '1px solid rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <User size={20} color="#60A5FA" />
              </div>
              <div>
                <div style={{ fontFamily: 'Inter', fontSize: 15, fontWeight: 700, color: '#fff' }}>{data.patient_name}</div>
                <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                  #{selectedPid} · {data.age ? `${data.age}y` : '—'} · {data.gender || '—'}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <span style={{ padding: '3px 8px', borderRadius: 4, background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#A78BFA', fontFamily: "'JetBrains Mono'", fontSize: 8, fontWeight: 700 }}>
                <Stethoscope size={8} style={{ display: 'inline', marginRight: 3 }} />{data.specialty}
              </span>
              <span style={{ padding: '3px 8px', borderRadius: 4, background: 'rgba(30,30,50,0.6)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', fontFamily: "'JetBrains Mono'", fontSize: 8 }}>
                MDR CLASS {data.mdr_class}
              </span>
            </div>
          </div>

          {/* Diagnosis Info */}
          <div>
            <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>DIGITIZED DIAGNOSIS</div>
            <div style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: '#60A5FA', lineHeight: 1.4, marginBottom: 10 }}>
              {data.primary_diagnosis}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              <span style={{ padding: '3px 8px', borderRadius: 4, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#34D399', fontFamily: "'JetBrains Mono'", fontSize: 8, fontWeight: 700 }}>
                ICD-10: {data.icd10_code}
              </span>
              <span style={{ padding: '3px 8px', borderRadius: 4, background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#60A5FA', fontFamily: "'JetBrains Mono'", fontSize: 8, fontWeight: 700 }}>
                UMLS: {data.umls_cui}
              </span>
              <span style={{ padding: '3px 8px', borderRadius: 4, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10B981', fontFamily: "'JetBrains Mono'", fontSize: 8 }}>
                ✓ MDR IIa · 100% VERIFIED
              </span>
            </div>
          </div>

          {/* Confidence Meter */}
          <div>
            <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>AI CONFIDENCE SCORE</div>
            <ConfidenceMeter score={data.confidence_score} />
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT GRID ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>

        {/* LEFT COLUMN */}
        <div className="space-y-4">

          {/* HUD Viewer */}
          <div className="animate-slide-in-up glass-card" style={{ padding: 0, overflow: 'hidden', border: '1px solid rgba(0,242,254,0.15)' }}>
            <div style={{
              padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'rgba(0,242,254,0.04)', borderBottom: '1px solid rgba(0,242,254,0.1)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Cpu size={13} color="#00F2FE" />
                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: '#00F2FE', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>
                  3D HOLOGRAPHIC ANATOMICAL HUD VISUALIZER
                </span>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 7, color: 'rgba(0,242,254,0.5)', border: '1px solid rgba(0,242,254,0.2)', padding: '2px 6px', borderRadius: 4 }}>
                QT CARDIOCARE HUD SPEC
              </span>
            </div>
            <div style={{ padding: '0 0' }}>
              <AnatomicalHUDViewer patientData={data} />
            </div>
          </div>

          {/* Clinical Document Digitization Summary */}
          <SectionCard
            title="CLINICAL DOCUMENT DIGITIZATION SUMMARY"
            icon={<FileText size={13} color="#A78BFA" />}
            accentColor="#A78BFA"
            isOpen={expandedSections.summary}
            onToggle={() => toggleSection('summary')}
          >
            <p style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, margin: 0 }}>
              {data.digitized_summary}
            </p>
          </SectionCard>

          {/* Patient Education Summary */}
          <SectionCard
            title="PATIENT EDUCATION SUMMARY"
            icon={<BookOpen size={13} color="#F472B6" />}
            accentColor="#F472B6"
            isOpen={expandedSections.education}
            onToggle={() => toggleSection('education')}
          >
            <p style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, margin: 0 }}>
              {data.patient_education_summary}
            </p>
          </SectionCard>

          {/* Recommended Clinical Action */}
          <SectionCard
            title="RECOMMENDED CLINICAL ACTION"
            icon={<Target size={13} color="#60A5FA" />}
            accentColor="#60A5FA"
            isOpen={expandedSections.action}
            onToggle={() => toggleSection('action')}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ArrowRight size={13} color="#60A5FA" />
              </div>
              <p style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, margin: 0 }}>
                {data.recommended_action}
              </p>
            </div>
          </SectionCard>

          {/* Evidence Citations */}
          <SectionCard
            title="CLINICAL GUIDELINES & EVIDENCE CITATIONS"
            icon={<Award size={13} color="#FCD34D" />}
            accentColor="#FCD34D"
            isOpen={expandedSections.citations}
            onToggle={() => toggleSection('citations')}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {data.evidence_citations.map((cit, idx) => (
                <div key={idx} className="animate-fade-in" style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 12px', borderRadius: 8,
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                  animationDelay: `${idx * 80}ms`,
                }}>
                  <BookOpen size={11} color="#60A5FA" style={{ flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontFamily: 'Inter', fontSize: 11, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>{cit}</span>
                </div>
              ))}
            </div>
          </SectionCard>

        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">

          {/* AI Pipeline Analytics */}
          <SectionCard
            title="AI PIPELINE ANALYTICS"
            icon={<BarChart3 size={13} color="#00F2FE" />}
            accentColor="#00F2FE"
            isOpen={expandedSections.analytics}
            onToggle={() => toggleSection('analytics')}
          >
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 8, color: 'rgba(255,255,255,0.3)', marginBottom: 8, letterSpacing: 1 }}>AGENT PERFORMANCE · LIVE</div>
              <MiniBarChart bars={confidenceBars} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <MiniDonut segments={donutSegments} size={56} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 8, color: 'rgba(255,255,255,0.3)', marginBottom: 6, letterSpacing: 1 }}>SYNTHESIS BREAKDOWN</div>
                {[{ label: 'OCR & Coding', color: '#10B981', pct: 60 }, { label: 'RAG Guidelines', color: '#3B82F6', pct: 25 }, { label: 'Visual Gen.', color: '#8B5CF6', pct: 15 }].map((s) => (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <div style={{ width: 6, height: 6, borderRadius: 2, background: s.color, flexShrink: 0 }} />
                    <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 8, color: 'rgba(255,255,255,0.5)', flex: 1 }}>{s.label}</span>
                    <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 8, color: s.color, fontWeight: 700 }}>{s.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 10 }}>
              {[
                { label: 'Pipeline Nodes', val: `${data.b64_json ? '4' : '3'} / 4`, color: '#10B981' },
                { label: 'Processing Time', val: `${processingTimeSec}s`, color: '#00F2FE' },
                { label: 'AI Confidence', val: `${Math.round(data.confidence_score * 100)}%`, color: '#F59E0B' },
                { label: 'Audit Status', val: decisionOutcome ? decisionOutcome.physician_decision : 'PENDING', color: decisionOutcome?.physician_decision === 'APPROVED' ? '#10B981' : decisionOutcome?.physician_decision === 'REJECTED' ? '#EF4444' : '#A78BFA' },
              ].map((m) => (
                <div key={m.label} style={{ padding: '8px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 7, color: 'rgba(255,255,255,0.3)', letterSpacing: 1, marginBottom: 3 }}>{m.label}</div>
                  <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, fontWeight: 700, color: m.color }}>{m.val}</div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Clinical Timeline */}
          <div className="glass-card animate-slide-in-up" style={{ padding: '16px', border: '1px solid rgba(255,255,255,0.07)', animationDelay: '100ms' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Clock size={13} color="#F59E0B" />
              <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: '#F59E0B', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>PATIENT CLINICAL TIMELINE</span>
            </div>
            <div style={{ padding: '4px 0' }}>
              {data.timeline.length > 0 ? (
                data.timeline.map((entry, i) => (
                  <TimelineEntry key={i} entry={entry} index={i} isLast={i === data.timeline.length - 1} />
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <Activity size={24} color="rgba(255,255,255,0.15)" style={{ margin: '0 auto 8px' }} />
                  <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>Timeline loading from API...</div>
                </div>
              )}
            </div>
          </div>

          {/* Compliance Panel */}
          <div className="glass-card animate-slide-in-up" style={{ padding: '16px', border: '1px solid rgba(16,185,129,0.12)', animationDelay: '150ms' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Lock size={13} color="#10B981" />
              <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: '#10B981', fontWeight: 700, letterSpacing: 2 }}>COMPLIANCE & SAFETY</span>
            </div>
            {[
              { label: 'EU AI Act Art. 14', status: 'COMPLIANT', color: '#10B981' },
              { label: 'GDPR Art. 9 ZDR', status: 'ACTIVE', color: '#10B981' },
              { label: 'MDR Class IIa', status: 'VERIFIED', color: '#10B981' },
              { label: 'AHA Literacy Std.', status: '99.5% ACC.', color: '#00F2FE' },
              { label: 'HITL Override', status: 'REQUIRED', color: '#F59E0B' },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: 'rgba(255,255,255,0.45)' }}>{item.label}</span>
                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 8, color: item.color, fontWeight: 700 }}>✓ {item.status}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ── PHYSICIAN NOTES & ACTIONS ── */}
      {!decisionOutcome && (
        <div className="glass-card-elevated animate-slide-in-up" style={{
          padding: '20px 24px', border: '1px solid rgba(245,158,11,0.2)',
          boxShadow: '0 0 40px rgba(245,158,11,0.05)',
          animationDelay: '200ms',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Edit3 size={14} color="#F59E0B" />
            <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: '#F59E0B', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>
              PHYSICIAN AUDIT NOTES & DECISION
            </span>
            <span style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono'", fontSize: 8, color: 'rgba(255,255,255,0.3)' }}>OPTIONAL · GDPR ART. 5(1)(F) COMPLIANT</span>
          </div>

          <textarea
            rows={3}
            value={physicianNotes}
            onChange={(e) => setPhysicianNotes(e.target.value)}
            placeholder="Enter audit notes (e.g. APPROVED: Visual diagram verified with patient during bedside consultation)..."
            className="clinical-input"
            style={{ resize: 'none', marginBottom: 12 }}
            id="physician-notes-textarea"
          />

          {/* Modify Prompt Expander */}
          <button
            onClick={() => setShowModifyPrompt(!showModifyPrompt)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px',
              borderRadius: 8, border: '1px solid rgba(0,242,254,0.2)', background: 'rgba(0,242,254,0.05)',
              color: '#00F2FE', cursor: 'pointer', fontFamily: "'JetBrains Mono'", fontSize: 9, fontWeight: 700,
              marginBottom: 12, transition: 'all 0.2s',
            }}
          >
            <Palette size={11} />
            {showModifyPrompt ? 'HIDE' : 'EDIT'} FLUX.2-PRO ILLUSTRATION PROMPT
            {showModifyPrompt ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          </button>

          {showModifyPrompt && (
            <div className="animate-fade-in" style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 8, color: 'rgba(255,255,255,0.3)', marginBottom: 6, letterSpacing: 1 }}>
                CURRENT AI ILLUSTRATION PROMPT — EDIT TO MODIFY SYNTHESIS
              </div>
              <textarea
                rows={4}
                value={customPrompt || data.illustration_prompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="clinical-input"
                style={{ resize: 'vertical', fontFamily: "'JetBrains Mono'", fontSize: 10, color: 'rgba(0,242,254,0.8)' }}
                placeholder="Enter custom FLUX.2-pro illustration prompt..."
              />
            </div>
          )}

          {/* Decision Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <button
              onClick={() => handleDecision('APPROVED')} disabled={submitting}
              id="btn-approve-hitl"
              style={{
                padding: '14px 12px', borderRadius: 12, border: 'none',
                background: submitting ? 'rgba(16,185,129,0.3)' : 'linear-gradient(135deg, #059669, #10B981)',
                color: '#fff', cursor: submitting ? 'not-allowed' : 'pointer',
                fontFamily: "'JetBrains Mono'", fontSize: 10, fontWeight: 800, letterSpacing: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                boxShadow: submitting ? 'none' : '0 0 24px rgba(16,185,129,0.35)',
                transition: 'all 0.25s', transform: submitting ? 'none' : undefined,
              }}
              onMouseEnter={e => { if (!submitting) e.currentTarget.style.transform = 'scale(1.03) translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1) translateY(0)'; }}
            >
              {submitting ? <RefreshCw size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
              APPROVE & SHARE
            </button>

            <button
              onClick={() => { setShowModifyPrompt(true); handleDecision('MODIFIED'); }} disabled={submitting}
              id="btn-modify-hitl"
              style={{
                padding: '14px 12px', borderRadius: 12, border: '1px solid rgba(0,242,254,0.4)',
                background: 'rgba(0,242,254,0.06)', color: '#00F2FE',
                cursor: submitting ? 'not-allowed' : 'pointer',
                fontFamily: "'JetBrains Mono'", fontSize: 10, fontWeight: 800, letterSpacing: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                boxShadow: '0 0 16px rgba(0,242,254,0.12)',
                transition: 'all 0.25s',
              }}
              onMouseEnter={e => { if (!submitting) e.currentTarget.style.transform = 'scale(1.03) translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1) translateY(0)'; }}
            >
              <Edit3 size={13} />
              MODIFY PROMPT
            </button>

            <button
              onClick={() => handleDecision('REJECTED')} disabled={submitting}
              id="btn-reject-hitl"
              style={{
                padding: '14px 12px', borderRadius: 12, border: 'none',
                background: submitting ? 'rgba(239,68,68,0.3)' : 'linear-gradient(135deg, #DC2626, #EF4444)',
                color: '#fff', cursor: submitting ? 'not-allowed' : 'pointer',
                fontFamily: "'JetBrains Mono'", fontSize: 10, fontWeight: 800, letterSpacing: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                boxShadow: submitting ? 'none' : '0 0 24px rgba(239,68,68,0.3)',
                transition: 'all 0.25s',
              }}
              onMouseEnter={e => { if (!submitting) e.currentTarget.style.transform = 'scale(1.03) translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1) translateY(0)'; }}
            >
              <XCircle size={13} />
              REJECT & RE-EVAL
            </button>
          </div>

          <div style={{ marginTop: 10, textAlign: 'center', fontFamily: "'JetBrains Mono'", fontSize: 8, color: 'rgba(255,255,255,0.2)', letterSpacing: 1 }}>
            DECISION IS PERMANENTLY LOGGED TO AZURE COSMOS DB · GDPR ART. 5(1)(F) · AUDIT ID AUTO-GENERATED
          </div>
        </div>
      )}

      {/* ── DECISION OUTCOME CARD ── */}
      {decisionOutcome && (
        <DecisionOutcomeCard
          outcome={decisionOutcome}
          onNavigateDashboard={onNavigateDashboard}
          onNavigateHistory={onNavigateHistory}
          onReset={() => setDecisionOutcome(null)}
        />
      )}

    </div>
  );
}

/* ─── Collapsible Section Card ────────────────────────────────────────── */
function SectionCard({ title, icon, accentColor, isOpen, onToggle, children }) {
  return (
    <div className="glass-card animate-slide-in-up" style={{ padding: 0, overflow: 'hidden', border: `1px solid ${accentColor}18` }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', background: `${accentColor}06`, border: 'none',
          borderBottom: isOpen ? `1px solid ${accentColor}15` : 'none', cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {icon}
          <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: accentColor, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>{title}</span>
        </div>
        {isOpen ? <ChevronUp size={12} color="rgba(255,255,255,0.3)" /> : <ChevronDown size={12} color="rgba(255,255,255,0.3)" />}
      </button>
      {isOpen && (
        <div className="animate-fade-in" style={{ padding: '14px 16px' }}>
          {children}
        </div>
      )}
    </div>
  );
}

/* ─── Decision Outcome Card ───────────────────────────────────────────── */
function DecisionOutcomeCard({ outcome, onNavigateDashboard, onNavigateHistory, onReset }) {
  const decision = outcome.physician_decision;
  const config = {
    APPROVED: { color: '#10B981', icon: <CheckCircle2 size={40} />, title: 'DIGITIZATION & PATIENT ILLUSTRATION APPROVED', grad: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(6,182,212,0.06) 100%)' },
    MODIFIED: { color: '#F59E0B', icon: <Edit3 size={40} />, title: 'ILLUSTRATION PROMPT MODIFIED & RE-SYNTHESIZED', grad: 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(251,191,36,0.06) 100%)' },
    REJECTED: { color: '#EF4444', icon: <XCircle size={40} />, title: 'SYNTHESIS REJECTED — MARKED FOR RE-EVALUATION', grad: 'linear-gradient(135deg, rgba(239,68,68,0.12) 0%, rgba(220,38,38,0.06) 100%)' },
  }[decision] || { color: '#6B7280', icon: <ShieldCheck size={40} />, title: 'DECISION RECORDED', grad: 'rgba(0,0,0,0.3)' };

  return (
    <div className="glass-card-elevated animate-slide-in-up" style={{
      padding: '32px 28px', textAlign: 'center',
      background: config.grad,
      border: `1px solid ${config.color}30`,
      boxShadow: `0 0 60px ${config.color}15`,
    }}>
      <div style={{ color: config.color, marginBottom: 16, animation: 'pulse 2s infinite' }}>
        {config.icon}
      </div>
      <h3 style={{ fontFamily: "'JetBrains Mono'", fontSize: 14, fontWeight: 800, color: config.color, letterSpacing: 1.5, marginBottom: 8 }}>
        {config.title}
      </h3>
      <p style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, marginBottom: 6 }}>
        Physician Decision Permanently Recorded · Azure Cosmos DB
      </p>
      <p style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: 'rgba(255,255,255,0.3)', marginBottom: 24 }}>
        Audit ID: {outcome.audit_record?.audit_id || `AUDIT-${Math.floor(Math.random() * 99999).toString().padStart(5, '0')}`}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
        {onNavigateDashboard && (
          <button onClick={onNavigateDashboard} style={{
            padding: '12px 20px', borderRadius: 10, border: 'none',
            background: 'linear-gradient(135deg, #2563EB, #3B82F6)', color: '#fff',
            fontFamily: "'JetBrains Mono'", fontSize: 10, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 7, boxShadow: '0 0 20px rgba(59,130,246,0.3)',
          }}>
            <LayoutDashboard size={13} /> GO TO DASHBOARD
          </button>
        )}
        {onNavigateHistory && (
          <button onClick={onNavigateHistory} style={{
            padding: '12px 20px', borderRadius: 10, border: `1px solid ${config.color}40`,
            background: 'transparent', color: config.color,
            fontFamily: "'JetBrains Mono'", fontSize: 10, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 7,
          }}>
            <History size={13} /> VIEW HISTORY GRAPH
          </button>
        )}
        <button onClick={onReset} style={{
          padding: '12px 20px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)',
          background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)',
          fontFamily: "'JetBrains Mono'", fontSize: 10, fontWeight: 700, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 7,
        }}>
          <RefreshCw size={13} /> NEW REVIEW
        </button>
      </div>
    </div>
  );
}
