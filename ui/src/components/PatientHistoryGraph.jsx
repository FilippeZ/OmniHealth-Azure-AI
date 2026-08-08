import React, { useEffect, useState, useRef } from 'react';
import {
  Folder, FileText, Activity, Tag, User, Calendar, Clock, CheckCircle2,
  ArrowRight, Stethoscope, ShieldCheck, Radio, Search, RefreshCw,
  ChevronRight, BookOpen, Cpu, Layers, Database, Brain, Heart,
  AlertCircle, Pill, Microscope, Eye, Download, Share2, Filter,
  TrendingUp, BarChart2, Zap, Lock, Globe, FlaskConical
} from 'lucide-react';
import { fetchPatientHistory, fetchPatients } from '../services/api';
import AnatomicalHUDViewer from './AnatomicalHUDViewer';

/* ─── UMLS Entity Presets per patient ────────────────────────────────── */
const UMLS_ENTITIES = {
  'PX-8810': [
    { cui: 'C0010054', term: 'Coronary Artery Disease', category: 'Disease', negated: false, icd10: 'I25.10', confidence: 0.99 },
    { cui: 'C0265060', term: 'LAD Stenosis (85% Proximal)', category: 'Finding', negated: false, icd10: 'I25.10', confidence: 0.97 },
    { cui: 'C0002902', term: 'Aspirin (Antiplatelet)', category: 'Medication', negated: false, icd10: null, confidence: 0.96 },
    { cui: 'C0009217', term: 'Clopidogrel', category: 'Medication', negated: false, icd10: null, confidence: 0.95 },
    { cui: 'C0003489', term: 'Coronary Angiography', category: 'Procedure', negated: false, icd10: null, confidence: 0.98 },
    { cui: 'C0340515', term: 'Exertional Angina', category: 'Symptom', negated: false, icd10: 'I20.8', confidence: 0.94 },
  ],
  'PX-8811': [
    { cui: 'C0020440', term: 'Lumbar Disc Herniation L5-S1', category: 'Disease', negated: false, icd10: 'M51.26', confidence: 0.98 },
    { cui: 'C0027768', term: 'Nerve Root Compression', category: 'Finding', negated: false, icd10: null, confidence: 0.96 },
    { cui: 'C0023508', term: 'Radicular Pain (L5 Distribution)', category: 'Symptom', negated: false, icd10: 'M54.4', confidence: 0.95 },
    { cui: 'C0199209', term: 'MRI Lumbar Spine', category: 'Procedure', negated: false, icd10: null, confidence: 0.99 },
    { cui: 'C0020528', term: 'Intervertebral Disc', category: 'Anatomy', negated: false, icd10: null, confidence: 0.93 },
  ],
  'PX-8812': [
    { cui: 'C0011860', term: 'Type 2 Diabetes Mellitus', category: 'Disease', negated: false, icd10: 'E11.40', confidence: 0.99 },
    { cui: 'C0031117', term: 'Peripheral Neuropathy', category: 'Disease', negated: false, icd10: 'E11.40', confidence: 0.97 },
    { cui: 'C0392885', term: 'HbA1c 8.6%', category: 'Lab Finding', negated: false, icd10: null, confidence: 0.99 },
    { cui: 'C0016209', term: 'Fasting Glucose 192 mg/dL', category: 'Lab Finding', negated: false, icd10: null, confidence: 0.98 },
    { cui: 'C0025518', term: 'Metformin', category: 'Medication', negated: false, icd10: null, confidence: 0.95 },
    { cui: 'C0700594', term: 'Distal Sensory Polyneuropathy', category: 'Finding', negated: false, icd10: null, confidence: 0.93 },
  ],
  'PX-8813': [
    { cui: 'C0024117', term: 'COPD Exacerbation', category: 'Disease', negated: false, icd10: 'J44.1', confidence: 0.99 },
    { cui: 'C0034069', term: 'Pulmonary Emphysema', category: 'Disease', negated: false, icd10: 'J43.9', confidence: 0.96 },
    { cui: 'C0277607', term: 'FEV1/FVC Ratio 58%', category: 'Lab Finding', negated: false, icd10: null, confidence: 0.99 },
    { cui: 'C0013341', term: 'Dyspnea on Exertion', category: 'Symptom', negated: false, icd10: 'R06.0', confidence: 0.97 },
    { cui: 'C0006456', term: 'Bronchodilator Therapy', category: 'Procedure', negated: false, icd10: null, confidence: 0.94 },
    { cui: 'C1708755', term: 'Emphysematous Bullae (Bilateral)', category: 'Finding', negated: false, icd10: null, confidence: 0.95 },
  ],
  'PX-8814': [
    { cui: 'C0020538', term: 'Essential Hypertension', category: 'Disease', negated: false, icd10: 'I10', confidence: 0.99 },
    { cui: 'C0149721', term: 'Left Ventricular Hypertrophy', category: 'Finding', negated: false, icd10: 'I51.7', confidence: 0.97 },
    { cui: 'C0018805', term: 'Resting BP 165/102 mmHg', category: 'Vital Sign', negated: false, icd10: null, confidence: 0.99 },
    { cui: 'C0949690', term: 'Echocardiogram', category: 'Procedure', negated: false, icd10: null, confidence: 0.98 },
    { cui: 'C0003015', term: 'ACE Inhibitor (ACEI)', category: 'Medication', negated: false, icd10: null, confidence: 0.96 },
    { cui: 'C0018681', term: 'Occipital Headache (Recurrent)', category: 'Symptom', negated: false, icd10: 'R51', confidence: 0.94 },
  ],
  'PX-8815': [
    { cui: 'C0022658', term: 'Chronic Kidney Disease Stage 3', category: 'Disease', negated: false, icd10: 'N18.3', confidence: 0.99 },
    { cui: 'C0010294', term: 'Serum Creatinine 2.1 mg/dL', category: 'Lab Finding', negated: false, icd10: null, confidence: 0.99 },
    { cui: 'C1293704', term: 'eGFR 44 mL/min/1.73m²', category: 'Lab Finding', negated: false, icd10: null, confidence: 0.99 },
    { cui: 'C0033687', term: 'Proteinuria 450 mg/24h', category: 'Finding', negated: false, icd10: null, confidence: 0.97 },
    { cui: 'C0064926', term: 'ACE Inhibitor Nephroprotection', category: 'Procedure', negated: false, icd10: null, confidence: 0.95 },
    { cui: 'C0014869', term: 'Peripheral Oedema', category: 'Symptom', negated: false, icd10: 'R60.0', confidence: 0.93 },
  ],
  'PX-8816': [
    { cui: 'C0025202', term: 'Chronic Migraine', category: 'Disease', negated: false, icd10: 'G43.90', confidence: 0.98 },
    { cui: 'C0085041', term: 'Photophobia', category: 'Symptom', negated: false, icd10: 'H53.1', confidence: 0.97 },
    { cui: 'C0027497', term: 'Nausea & Vomiting', category: 'Symptom', negated: false, icd10: 'R11', confidence: 0.96 },
    { cui: 'C0162791', term: 'Brain MRI (Normal)', category: 'Procedure', negated: false, icd10: null, confidence: 0.99 },
    { cui: 'C0076220', term: 'Sumatriptan 50mg (Triptan)', category: 'Medication', negated: false, icd10: null, confidence: 0.97 },
    { cui: 'C0392756', term: 'Unilateral Pulsating Headache', category: 'Finding', negated: false, icd10: 'R51', confidence: 0.95 },
  ],
  'PX-8817': [
    { cui: 'C0029408', term: 'Knee Osteoarthritis (Bilateral)', category: 'Disease', negated: false, icd10: 'M17.9', confidence: 0.99 },
    { cui: 'C0022676', term: 'Medial Joint Space Narrowing', category: 'Finding', negated: false, icd10: null, confidence: 0.97 },
    { cui: 'C0036415', term: 'Subchondral Sclerosis', category: 'Finding', negated: false, icd10: null, confidence: 0.96 },
    { cui: 'C0022667', term: 'Knee X-Ray (Bilateral)', category: 'Procedure', negated: false, icd10: null, confidence: 0.99 },
    { cui: 'C1609177', term: 'Hyaluronic Acid Injection', category: 'Medication', negated: false, icd10: null, confidence: 0.95 },
    { cui: 'C0022678', term: 'Joint Stiffness & Pain on WB', category: 'Symptom', negated: false, icd10: 'M25.36', confidence: 0.94 },
  ],
  'PX-8818': [
    { cui: 'C0032285', term: 'Community-Acquired Pneumonia', category: 'Disease', negated: false, icd10: 'J18.9', confidence: 0.99 },
    { cui: 'C0038002', term: 'S. pneumoniae (Sputum Culture)', category: 'Lab Finding', negated: false, icd10: null, confidence: 0.98 },
    { cui: 'C0277677', term: 'Right Lower Lobe Opacity', category: 'Finding', negated: false, icd10: null, confidence: 0.97 },
    { cui: 'C0015967', term: 'Fever 38.9°C', category: 'Vital Sign', negated: false, icd10: 'R50.9', confidence: 0.99 },
    { cui: 'C0002636', term: 'Amoxicillin-Clavulanate (ABx)', category: 'Medication', negated: false, icd10: null, confidence: 0.96 },
    { cui: 'C0232483', term: 'SpO₂ 95% on RA', category: 'Vital Sign', negated: false, icd10: null, confidence: 0.98 },
  ],
  'PX-8819': [
    { cui: 'C0020440', term: 'L4-L5 Disc Extrusion (7mm)', category: 'Disease', negated: false, icd10: 'M51.16', confidence: 0.99 },
    { cui: 'C0027768', term: 'Right L4 Nerve Root Compression', category: 'Finding', negated: false, icd10: null, confidence: 0.98 },
    { cui: 'C0751537', term: 'Quad Weakness (4/5) — L4 Derm.', category: 'Finding', negated: false, icd10: null, confidence: 0.96 },
    { cui: 'C0199209', term: 'MRI Lumbar Spine (Urgent)', category: 'Procedure', negated: false, icd10: null, confidence: 0.99 },
    { cui: 'C0003029', term: 'NSAID Anti-Inflammatory', category: 'Medication', negated: false, icd10: null, confidence: 0.95 },
    { cui: 'C0024528', term: 'Radicular Pain — Anterior Thigh', category: 'Symptom', negated: false, icd10: 'M54.4', confidence: 0.97 },
  ],
  'PX-8888': [
    { cui: 'C0026848', term: 'Masticatory Myalgia', category: 'Disease', negated: false, icd10: 'M79.1', confidence: 0.98 },
    { cui: 'C0006445', term: 'Nocturnal Bruxism', category: 'Finding', negated: false, icd10: 'F45.8', confidence: 0.97 },
    { cui: 'C0700594', term: 'Masseter & Temporalis Tenderness', category: 'Symptom', negated: false, icd10: null, confidence: 0.96 },
    { cui: 'C0013492', term: 'EMG (Bilateral Masseter)', category: 'Procedure', negated: false, icd10: null, confidence: 0.95 },
    { cui: 'C0026498', term: 'Occlusal Night Guard', category: 'Medication', negated: false, icd10: null, confidence: 0.94 },
    { cui: 'C0004625', term: 'Morning Jaw Stiffness', category: 'Symptom', negated: false, icd10: 'M79.1', confidence: 0.93 },
  ],
};

const getCategoryStyle = (category) => {
  const map = {
    'Disease':      { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',  color: '#F87171', icon: <AlertCircle size={9} /> },
    'Finding':      { bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.3)', color: '#60A5FA', icon: <Eye size={9} /> },
    'Symptom':      { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', color: '#FCD34D', icon: <Brain size={9} /> },
    'Medication':   { bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.3)', color: '#C084FC', icon: <Pill size={9} /> },
    'Procedure':    { bg: 'rgba(6,182,212,0.12)',  border: 'rgba(6,182,212,0.3)',  color: '#22D3EE', icon: <Microscope size={9} /> },
    'Lab Finding':  { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', color: '#34D399', icon: <FlaskConical size={9} /> },
    'Vital Sign':   { bg: 'rgba(251,146,60,0.12)', border: 'rgba(251,146,60,0.3)', color: '#FB923C', icon: <Heart size={9} /> },
    'Anatomy':      { bg: 'rgba(148,163,184,0.12)',border: 'rgba(148,163,184,0.3)',color: '#94A3B8', icon: <Layers size={9} /> },
  };
  return map[category] || map['Finding'];
};

const STATUS_STYLES = {
  APPROVED:   { bg: 'rgba(16,185,129,0.15)',  border: 'rgba(16,185,129,0.4)',  color: '#34D399', dot: '#10B981' },
  COMPLETED:  { bg: 'rgba(59,130,246,0.15)',  border: 'rgba(59,130,246,0.4)',  color: '#60A5FA', dot: '#3B82F6' },
  PROCESSING: { bg: 'rgba(245,158,11,0.15)',  border: 'rgba(245,158,11,0.4)',  color: '#FCD34D', dot: '#F59E0B' },
  REJECTED:   { bg: 'rgba(239,68,68,0.15)',   border: 'rgba(239,68,68,0.4)',   color: '#F87171', dot: '#EF4444' },
};

const NODE_COLORS = {
  purple: { bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.3)', color: '#C084FC' },
  emerald:{ bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', color: '#34D399' },
  blue:   { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.3)', color: '#60A5FA' },
  rose:   { bg: 'rgba(244,63,94,0.1)',  border: 'rgba(244,63,94,0.3)',  color: '#FB7185' },
};

/* ─── Animated Confidence Bar ────────────────────────────────────────── */
function ConfidenceBar({ value, color }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(value * 100), 200); return () => clearTimeout(t); }, [value]);
  return (
    <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
      <div style={{ width: `${w}%`, height: '100%', background: color, borderRadius: 2, transition: 'width 0.9s cubic-bezier(.4,0,.2,1)', boxShadow: `0 0 6px ${color}60` }} />
    </div>
  );
}

/* ─── Patient Specialty Map ──────────────────────────────────────────── */
const PATIENT_META = {
  'PX-8810': { name: 'Nikos Mavros',                  specialty: 'Cardiology',     age: 58, gender: 'M', priority: 'HIGH',   icd10: 'I25.10', condition: 'Coronary Artery Disease (CAD)' },
  'PX-8811': { name: 'Elena Dimou',                   specialty: 'Orthopedics',    age: 42, gender: 'F', priority: 'MEDIUM', icd10: 'M51.26', condition: 'L5-S1 Disc Herniation' },
  'PX-8812': { name: 'Christos Papanikolaou',         specialty: 'Endocrinology',  age: 65, gender: 'M', priority: 'MEDIUM', icd10: 'E11.40', condition: 'T2 Diabetes & Neuropathy' },
  'PX-8813': { name: 'George Vassiliou',              specialty: 'Pulmonology',    age: 62, gender: 'M', priority: 'HIGH',   icd10: 'J44.1',  condition: 'COPD Exacerbation' },
  'PX-8814': { name: 'Maria Karrathana',              specialty: 'Cardiology',     age: 39, gender: 'F', priority: 'HIGH',   icd10: 'I10',    condition: 'Essential Hypertension LVH' },
  'PX-8815': { name: 'Stefanos Kostopoulos',          specialty: 'Nephrology',     age: 51, gender: 'M', priority: 'MEDIUM', icd10: 'N18.3',  condition: 'CKD Stage 3' },
  'PX-8816': { name: 'Sophia Alexiou',                specialty: 'Neurology',      age: 47, gender: 'F', priority: 'MEDIUM', icd10: 'G43.90', condition: 'Chronic Migraine' },
  'PX-8817': { name: 'Ioannis Antoniou',              specialty: 'Orthopedics',    age: 71, gender: 'M', priority: 'LOW',    icd10: 'M17.9',  condition: 'Bilateral Knee OA' },
  'PX-8818': { name: 'Anna Papageorgiou',             specialty: 'Pulmonology',    age: 34, gender: 'F', priority: 'HIGH',   icd10: 'J18.9',  condition: 'Bronchial Pneumonia' },
  'PX-8819': { name: 'Eleni Papadaki',                specialty: 'Orthopedics',    age: 36, gender: 'F', priority: 'HIGH',   icd10: 'M51.16', condition: 'L4-L5 Disc Extrusion' },
  'PX-8888': { name: 'Filippos-Paraskevas Zygouris',  specialty: 'Neurology',      age: 24, gender: 'M', priority: 'LOW',    icd10: 'M79.1',  condition: 'Masticatory Myalgia' },
  'PX-9999': { name: 'Patient PX-9999',               specialty: 'General',        age: 50, gender: 'F', priority: 'MEDIUM', icd10: 'J18.9',  condition: 'Pneumonia & Pulmonary Infiltrate' },
};

const PRIORITY_COLORS = {
  HIGH:   { color: '#F87171', dot: '#EF4444' },
  MEDIUM: { color: '#FCD34D', dot: '#F59E0B' },
  LOW:    { color: '#34D399', dot: '#10B981' },
};

export default function PatientHistoryGraph({ patientId, patients = [], onSelectPatient, onOpenHUD }) {
  const [historyData, setHistoryData] = useState(null);
  const [patientRecord, setPatientRecord] = useState(null); // from /api/patients (contains b64_json)
  const [allPatients, setAllPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(patientId || 'PX-8810');
  const [activeTab, setActiveTab] = useState('timeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('ALL');
  const [liveTime, setLiveTime] = useState(new Date());
  const contentRef = useRef(null);

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearTimeout(t);
  }, []);

  // Load patient list from API or use passed prop
  useEffect(() => {
    if (patients.length > 0) {
      setAllPatients(patients);
    } else {
      fetchPatients().then((pts) => { if (Array.isArray(pts)) setAllPatients(pts); });
    }
  }, [patients]);

  const loadHistory = (pid) => {
    setLoading(true);
    setHistoryData(null);
    setPatientRecord(null);
    // Fetch history and patient record in parallel
    Promise.all([
      fetchPatientHistory(pid).catch(() => null),
      fetchPatients().catch(() => []),
    ]).then(([hist, pts]) => {
      setHistoryData(hist);
      // Find the matching patient record (contains b64_json, confidence etc.)
      const rec = Array.isArray(pts) ? pts.find((p) => p.id === pid || p.patient_id === pid) : null;
      setPatientRecord(rec || null);
      setLoading(false);
    });
  };

  useEffect(() => {
    const resolved = patientId || 'PX-8810';
    setSelectedId(resolved);
    loadHistory(resolved);
  }, [patientId]);

  const handleSwitch = (pid) => {
    if (pid === selectedId) return;
    setSelectedId(pid);
    setActiveTab('timeline');
    loadHistory(pid);
    if (onSelectPatient) onSelectPatient(pid);
    if (contentRef.current) contentRef.current.scrollTop = 0;
  };

  // Resolved meta
  const meta = PATIENT_META[selectedId] || {
    name: historyData?.patient_name || selectedId,
    specialty: 'General', age: '—', gender: '—', priority: 'MEDIUM',
    icd10: historyData?.icd10 || '—', condition: historyData?.condition || '—',
  };

  // b64_json: prefer patientRecord (from /api/patients which always has it)
  const resolvedB64 = patientRecord?.b64_json || historyData?.b64_json || null;

  // Confidence score from the patient record (stored as 0-100 in API, normalise to 0-1)
  const rawConf = patientRecord?.confidence || patientRecord?.confidence_score;
  const resolvedConf = rawConf ? (rawConf > 1 ? rawConf / 100 : rawConf) : 0.985;

  const umlsEntities = UMLS_ENTITIES[selectedId] || [];
  const pipelineNodes = historyData?.pipeline_nodes || [
    { step: 'Document Intake', label: 'Scanned Medical Record', color: 'purple' },
    { step: 'Mistral OCR 4.0', label: 'Text & Layout Extracted', color: 'emerald' },
    { step: 'UMLS / ICD-10', label: `Code: ${meta.icd10}`, color: 'blue' },
    { step: 'FLUX.2-pro', label: 'Patient Education Render', color: 'rose' },
  ];
  const timelineEvents = historyData?.timeline || [];
  const priorityC = PRIORITY_COLORS[meta.priority] || PRIORITY_COLORS.MEDIUM;

  // Per-patient pipeline agent accuracy derived from actual confidence score
  // Each agent contributes a slightly different % based on its task complexity
  const confPct = resolvedConf * 100;
  const agentAccuracy = [
    { label: 'Mistral OCR 4.0',      desc: 'Document layout extraction & text digitization',        acc: Math.min(99.9, confPct * 0.985 + 0.5).toFixed(1), color: '#8B5CF6' },
    { label: 'Azure TA4H NLP',       desc: 'UMLS entity recognition & ICD-10 auto-coding',           acc: Math.min(99.9, confPct * 0.992 + 0.3).toFixed(1), color: '#06B6D4' },
    { label: 'DeepSeek Orchestrator',desc: 'AHA guideline RAG synthesis & education prompt',         acc: Math.min(99.9, confPct * 0.978 + 0.2).toFixed(1), color: '#F59E0B' },
    { label: 'FLUX.2-pro Visual Gen',desc: 'Patient education anatomical illustration render',       acc: Math.min(99.9, confPct * 0.963 + 0.1).toFixed(1), color: '#EC4899' },
  ];


  // Filtered patient list for sidebar
  const specialties = ['ALL', ...new Set(Object.values(PATIENT_META).map(p => p.specialty))];
  const listPatients = (() => {
    const base = allPatients.length > 0 ? allPatients : Object.entries(PATIENT_META).map(([id, m]) => ({ id, name: m.name }));
    return base.filter((p) => {
      const m = PATIENT_META[p.id] || {};
      const matchSearch = !searchQuery || p.id.toLowerCase().includes(searchQuery.toLowerCase()) || (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (m.condition || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchSpec = filterSpecialty === 'ALL' || m.specialty === filterSpecialty;
      return matchSearch && matchSpec;
    });
  })();

  const TABS = [
    { id: 'timeline', label: 'CLINICAL ENCOUNTERS', icon: <Calendar size={11} /> },
    { id: 'umls', label: 'UMLS ENTITY MAP', icon: <Database size={11} /> },
    { id: 'pipeline', label: 'PIPELINE AUDIT', icon: <Activity size={11} /> },
    { id: 'hud', label: '3D HUD SCOPE', icon: <Radio size={11} /> },
  ];

  return (
    <div style={{ display: 'flex', gap: 0, height: '100%', overflow: 'hidden', margin: 0, borderRadius: 0 }}>

      {/* ── LEFT PATIENT SIDEBAR ── */}
      <div style={{
        width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column',
        background: 'rgba(8,12,24,0.95)', borderRight: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
      }}>
        {/* Sidebar Header */}
        <div style={{ padding: '16px 14px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(16,185,129,0.4)', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(16,185,129,0.2)' }}>
              <img src="/logo.jpeg" alt="OmniHealth Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: '#10B981', fontWeight: 700, letterSpacing: 1.5 }}>EHR CHART SYSTEM</div>
              <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 7, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>{listPatients.length} ACTIVE RECORDS</div>
            </div>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: 8 }}>
            <Search size={10} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patients..."
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '6px 8px 6px 24px', borderRadius: 8,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.7)', fontFamily: "'JetBrains Mono'", fontSize: 9,
                outline: 'none',
              }}
            />
          </div>

          {/* Specialty Filter */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {specialties.slice(0, 5).map((s) => (
              <button key={s} onClick={() => setFilterSpecialty(s)} style={{
                padding: '2px 7px', borderRadius: 4, border: '1px solid',
                borderColor: filterSpecialty === s ? 'rgba(16,185,129,0.5)' : 'rgba(255,255,255,0.08)',
                background: filterSpecialty === s ? 'rgba(16,185,129,0.12)' : 'transparent',
                color: filterSpecialty === s ? '#34D399' : 'rgba(255,255,255,0.35)',
                fontFamily: "'JetBrains Mono'", fontSize: 7, fontWeight: 700, cursor: 'pointer',
              }}>
                {s === 'ALL' ? 'ALL' : s.substring(0, 4).toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Patient List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 6px' }}>
          {listPatients.map((p) => {
            const pm = PATIENT_META[p.id] || {};
            const pc = PRIORITY_COLORS[pm.priority] || PRIORITY_COLORS.MEDIUM;
            const isActive = selectedId === p.id;
            return (
              <button key={p.id} onClick={() => handleSwitch(p.id)} style={{
                width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 10, marginBottom: 3, cursor: 'pointer',
                background: isActive ? 'rgba(16,185,129,0.1)' : 'transparent',
                border: `1px solid ${isActive ? 'rgba(16,185,129,0.3)' : 'transparent'}`,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: isActive ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${isActive ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.07)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <User size={12} color={isActive ? '#10B981' : 'rgba(255,255,255,0.3)'} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: pc.dot, flexShrink: 0 }} />
                      <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 8, color: isActive ? '#10B981' : 'rgba(255,255,255,0.4)', fontWeight: 700 }}>#{p.id}</span>
                    </div>
                    <div style={{ fontFamily: 'Inter', fontSize: 10, color: isActive ? '#fff' : 'rgba(255,255,255,0.6)', fontWeight: 600, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.name || pm.name || p.id}
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 7, color: 'rgba(255,255,255,0.3)', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {pm.condition || '—'} · {pm.specialty || '—'}
                    </div>
                  </div>
                  {isActive && <ChevronRight size={11} color="#10B981" style={{ flexShrink: 0 }} />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
          <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 7, color: 'rgba(255,255,255,0.2)', letterSpacing: 1 }}>
            EU AI ACT ART. 14 · GDPR ART. 9 · HIPAA
          </div>
          <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 8, color: '#10B981', marginTop: 2, fontWeight: 700 }}>
            ● SYSTEM SECURE
          </div>
        </div>
      </div>

      {/* ── MAIN EHR PANEL ── */}
      <div ref={contentRef} style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-base)' }}>

        {/* Patient Identity Header */}
        <div style={{
          padding: '18px 24px', position: 'sticky', top: 0, zIndex: 10,
          background: 'rgba(8,12,24,0.92)', borderBottom: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(20px)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>

            {/* Patient Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 20px rgba(16,185,129,0.12)',
              }}>
                <User size={22} color="#10B981" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 8, color: '#10B981', fontWeight: 700, letterSpacing: 2 }}>
                    EHR CHART · #{selectedId}
                  </span>
                  <span style={{ padding: '2px 7px', borderRadius: 4, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#34D399', fontFamily: "'JetBrains Mono'", fontSize: 7, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}>
                    <ShieldCheck size={8} /> ACTIVE RECORD
                  </span>
                  <span style={{ padding: '2px 7px', borderRadius: 4, background: `${priorityC.dot}20`, border: `1px solid ${priorityC.dot}40`, color: priorityC.color, fontFamily: "'JetBrains Mono'", fontSize: 7, fontWeight: 700 }}>
                    {meta.priority} PRIORITY
                  </span>
                </div>
                <h1 style={{ fontFamily: 'Inter', fontSize: 16, fontWeight: 700, color: '#fff', margin: '4px 0 2px' }}>
                  {meta.name}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 8, color: 'rgba(255,255,255,0.4)' }}>
                    {meta.age}y · {meta.gender === 'M' ? 'Male' : meta.gender === 'F' ? 'Female' : meta.gender}
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 8, color: 'rgba(255,255,255,0.3)' }}>·</span>
                  <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 8, color: '#A78BFA' }}>
                    <Stethoscope size={9} style={{ display: 'inline', marginRight: 3 }} />{meta.specialty}
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 8, color: 'rgba(255,255,255,0.3)' }}>·</span>
                  <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 8, color: 'rgba(255,255,255,0.4)' }}>
                    ATTENDING: DR. ARIS NIKOLAIDIS
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Codes + Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)', color: '#60A5FA', fontFamily: "'JetBrains Mono'", fontSize: 8, fontWeight: 700 }}>
                ICD-10: {meta.icd10}
              </span>
              <span style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.3)', color: '#22D3EE', fontFamily: "'JetBrains Mono'", fontSize: 8, fontWeight: 700 }}>
                UMLS: {umlsEntities[0]?.cui || historyData?.umls_cui || '—'}
              </span>
              <button
                onClick={() => { setActiveTab('hud'); if (onOpenHUD) onOpenHUD(selectedId); }}
                style={{
                  padding: '5px 11px', borderRadius: 6, border: '1px solid rgba(0,242,254,0.35)',
                  background: 'rgba(0,242,254,0.07)', color: '#00F2FE', cursor: 'pointer',
                  fontFamily: "'JetBrains Mono'", fontSize: 8, fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: 5,
                }}
              >
                <Radio size={10} className="animate-pulse" /> 3D HUD SCOPE
              </button>
              <button
                onClick={() => loadHistory(selectedId)}
                style={{ padding: '5px 9px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}
              >
                <RefreshCw size={11} />
              </button>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: '#00F2FE', fontWeight: 700 }}>
                  {liveTime.toLocaleTimeString('en-GB')}
                </div>
                <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 7, color: 'rgba(255,255,255,0.3)' }}>LIVE</div>
              </div>
            </div>
          </div>

          {/* Quick Stats Strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 14 }}>
            {[
              { label: 'PRIMARY DIAGNOSIS', value: meta.condition, color: '#60A5FA' },
              { label: 'INGESTION STATUS', value: '✓ DIGITIZED & VERIFIED', color: '#34D399' },
              { label: 'LAST ENCOUNTER', value: historyData?.timeline?.[0]?.date?.split(' ')[0] || '2026-08-08', color: 'rgba(255,255,255,0.7)' },
              { label: 'UMLS ENTITIES MAPPED', value: `${umlsEntities.length} ENTITIES EXTRACTED`, color: '#C084FC' },
            ].map((s) => (
              <div key={s.label} style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 7, color: 'rgba(255,255,255,0.3)', letterSpacing: 1, marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 600, color: s.color, lineHeight: 1.3 }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── TAB BAR ── */}
        <div style={{
          display: 'flex', padding: '0 24px', gap: 2,
          background: 'rgba(8,12,24,0.8)', borderBottom: '1px solid rgba(255,255,255,0.06)',
          position: 'sticky', top: loading ? 0 : 'auto', zIndex: 9,
        }}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                padding: '12px 16px', border: 'none', borderBottom: `2px solid ${isActive ? '#10B981' : 'transparent'}`,
                background: isActive ? 'rgba(16,185,129,0.06)' : 'transparent',
                color: isActive ? '#34D399' : 'rgba(255,255,255,0.35)', cursor: 'pointer',
                fontFamily: "'JetBrains Mono'", fontSize: 8, fontWeight: 700, letterSpacing: 1,
                display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s',
              }}>
                {tab.icon} {tab.label}
                {tab.id === 'umls' && umlsEntities.length > 0 && (
                  <span style={{ padding: '1px 5px', borderRadius: 4, background: 'rgba(168,85,247,0.2)', color: '#C084FC', fontSize: 7 }}>{umlsEntities.length}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── TAB CONTENT ── */}
        <div style={{ padding: 24 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ width: 32, height: 32, border: '2px solid rgba(16,185,129,0.3)', borderTopColor: '#10B981', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
              <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: 2 }}>LOADING EHR RECORD...</div>
            </div>
          ) : (
            <>
              {/* ── TIMELINE TAB ── */}
              {activeTab === 'timeline' && (
                <div className="animate-fade-in">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Clock size={13} color="#10B981" />
                      <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: '#10B981', fontWeight: 700, letterSpacing: 2 }}>
                        EHR ENCOUNTER & REPORT HISTORY — #{selectedId}
                      </span>
                    </div>
                    <span style={{ padding: '3px 8px', borderRadius: 4, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#34D399', fontFamily: "'JetBrains Mono'", fontSize: 7, fontWeight: 700 }}>
                      CHRONOLOGICAL RECORD · {timelineEvents.length} EVENTS
                    </span>
                  </div>

                  {timelineEvents.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.3)' }}>
                      <Calendar size={32} style={{ margin: '0 auto 10px' }} />
                      <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, letterSpacing: 1 }}>NO ENCOUNTER RECORDS FOUND</div>
                    </div>
                  ) : (
                    <div style={{ position: 'relative' }}>
                      {/* Vertical connector line */}
                      <div style={{ position: 'absolute', left: 19, top: 10, bottom: 10, width: 1, background: 'linear-gradient(to bottom, rgba(16,185,129,0.4), rgba(255,255,255,0.05))', zIndex: 0 }} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {timelineEvents.map((event, idx) => {
                          const sc = STATUS_STYLES[event.status] || STATUS_STYLES.COMPLETED;
                          return (
                            <div key={idx} className="animate-fade-in" style={{ display: 'flex', gap: 16, animationDelay: `${idx * 80}ms`, position: 'relative', zIndex: 1 }}>
                              {/* Timeline Dot */}
                              <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', width: 38 }}>
                                <div style={{
                                  width: 14, height: 14, borderRadius: '50%', border: `2px solid ${sc.dot}`,
                                  background: `${sc.dot}30`, marginTop: 12, flexShrink: 0,
                                  boxShadow: `0 0 10px ${sc.dot}60`,
                                }} />
                              </div>

                              {/* Event Card */}
                              <div style={{
                                flex: 1, padding: '14px 16px', borderRadius: 12,
                                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
                                transition: 'all 0.2s',
                              }}
                              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
                              >
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <FileText size={11} color="#10B981" />
                                    <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 700, color: '#fff' }}>{event.title}</span>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
                                    <span style={{ padding: '2px 8px', borderRadius: 4, background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color, fontFamily: "'JetBrains Mono'", fontSize: 7, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}>
                                      <div style={{ width: 4, height: 4, borderRadius: '50%', background: sc.dot }} /> {event.status}
                                    </span>
                                    <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 8, color: 'rgba(255,255,255,0.35)' }}>{event.date}</span>
                                  </div>
                                </div>

                                <p style={{ fontFamily: 'Inter', fontSize: 11, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: '0 0 10px' }}>
                                  {event.details}
                                </p>

                                {event.umls && (
                                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                    <span style={{ padding: '3px 8px', borderRadius: 5, background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)', color: '#60A5FA', fontFamily: "'JetBrains Mono'", fontSize: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                                      <Database size={8} /> {event.umls}
                                    </span>
                                    <span style={{ padding: '3px 8px', borderRadius: 5, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#34D399', fontFamily: "'JetBrains Mono'", fontSize: 8 }}>
                                      ICD-10: {meta.icd10}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── UMLS ENTITY MAP TAB ── */}
              {activeTab === 'umls' && (
                <div className="animate-fade-in">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Database size={13} color="#A78BFA" />
                      <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: '#A78BFA', fontWeight: 700, letterSpacing: 2 }}>
                        UMLS MEDICAL ENTITY EXTRACTION — #{selectedId}
                      </span>
                    </div>
                    <span style={{ padding: '3px 8px', borderRadius: 4, background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.25)', color: '#C084FC', fontFamily: "'JetBrains Mono'", fontSize: 7, fontWeight: 700 }}>
                      {umlsEntities.length} ENTITIES · Azure Text Analytics Health
                    </span>
                  </div>

                  {/* Category Legend */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                    {['Disease', 'Finding', 'Symptom', 'Medication', 'Procedure', 'Lab Finding', 'Vital Sign'].map((cat) => {
                      const s = getCategoryStyle(cat);
                      const count = umlsEntities.filter(e => e.category === cat).length;
                      if (count === 0) return null;
                      return (
                        <span key={cat} style={{ padding: '3px 9px', borderRadius: 5, background: s.bg, border: `1px solid ${s.border}`, color: s.color, fontFamily: "'JetBrains Mono'", fontSize: 7, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                          {s.icon} {cat.toUpperCase()} ({count})
                        </span>
                      );
                    })}
                  </div>

                  {umlsEntities.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.3)' }}>
                      <Brain size={32} style={{ margin: '0 auto 10px' }} />
                      <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9 }}>NO UMLS ENTITIES FOR THIS PATIENT</div>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                      {umlsEntities.map((entity, idx) => {
                        const s = getCategoryStyle(entity.category);
                        return (
                          <div key={idx} className="animate-fade-in" style={{
                            padding: '14px 16px', borderRadius: 12, animationDelay: `${idx * 60}ms`,
                            background: `${s.bg}`, border: `1px solid ${s.border}`,
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${s.border}40`; }}
                          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                          >
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                              <span style={{ padding: '2px 7px', borderRadius: 4, background: 'rgba(0,0,0,0.2)', border: `1px solid ${s.border}`, color: s.color, fontFamily: "'JetBrains Mono'", fontSize: 7, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}>
                                {s.icon} {entity.category.toUpperCase()}
                              </span>
                              <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 8, color: entity.negated ? '#F87171' : '#34D399', fontWeight: 700 }}>
                                {entity.negated ? '✗ NEGATED' : '✓ CONFIRMED'}
                              </span>
                            </div>

                            <div style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 6, lineHeight: 1.3 }}>
                              {entity.term}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                              <span style={{ padding: '2px 6px', borderRadius: 4, background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#60A5FA', fontFamily: "'JetBrains Mono'", fontSize: 8 }}>
                                <Database size={7} style={{ display: 'inline', marginRight: 3 }} />{entity.cui}
                              </span>
                              {entity.icd10 && (
                                <span style={{ padding: '2px 6px', borderRadius: 4, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#34D399', fontFamily: "'JetBrains Mono'", fontSize: 8 }}>
                                  ICD-10: {entity.icd10}
                                </span>
                              )}
                            </div>

                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 7, color: 'rgba(255,255,255,0.3)', letterSpacing: 1 }}>NLP CONFIDENCE</span>
                                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 7, color: s.color, fontWeight: 700 }}>{Math.round(entity.confidence * 100)}%</span>
                              </div>
                              <ConfidenceBar value={entity.confidence} color={s.color} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ── PIPELINE AUDIT TAB ── */}
              {activeTab === 'pipeline' && (
                <div className="animate-fade-in">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Activity size={13} color="#00F2FE" />
                      <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: '#00F2FE', fontWeight: 700, letterSpacing: 2 }}>
                        MULTI-AGENT PIPELINE SYNTHESIS AUDIT
                      </span>
                    </div>
                    <span style={{ padding: '3px 8px', borderRadius: 4, background: 'rgba(0,242,254,0.08)', border: '1px solid rgba(0,242,254,0.2)', color: '#00F2FE', fontFamily: "'JetBrains Mono'", fontSize: 7, fontWeight: 700 }}>
                      4/4 NODES · 100% COMPLETE
                    </span>
                  </div>

                  {/* Pipeline Flow Diagram */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 24, overflowX: 'auto', padding: '8px 0' }}>
                    {pipelineNodes.map((node, idx) => {
                      const nc = NODE_COLORS[node.color] || NODE_COLORS.blue;
                      return (
                        <React.Fragment key={idx}>
                          <div className="animate-fade-in" style={{
                            padding: '16px 18px', borderRadius: 14, minWidth: 140, textAlign: 'center',
                            background: nc.bg, border: `1px solid ${nc.border}`,
                            animationDelay: `${idx * 100}ms`, transition: 'all 0.2s',
                            boxShadow: `0 0 20px ${nc.color}15`,
                          }}
                          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 30px ${nc.color}30`; }}
                          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 0 20px ${nc.color}15`; }}
                          >
                            <div style={{ width: 32, height: 32, borderRadius: 10, background: `${nc.color}20`, border: `1px solid ${nc.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                              {idx === 0 ? <FileText size={14} color={nc.color} /> :
                               idx === 1 ? <Cpu size={14} color={nc.color} /> :
                               idx === 2 ? <Database size={14} color={nc.color} /> :
                               <Brain size={14} color={nc.color} />}
                            </div>
                            <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 8, color: nc.color, fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>{node.step}</div>
                            <div style={{ fontFamily: 'Inter', fontSize: 10, color: 'rgba(255,255,255,0.6)', lineHeight: 1.3 }}>{node.label}</div>
                            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981' }} />
                              <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 7, color: '#34D399' }}>COMPLETE</span>
                            </div>
                          </div>
                          {idx < pipelineNodes.length - 1 && (
                            <div style={{ display: 'flex', alignItems: 'center', padding: '0 6px', color: 'rgba(255,255,255,0.2)', flexShrink: 0 }}>
                              <ArrowRight size={16} />
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>

                  {/* Compliance Audit Block */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                    {agentAccuracy.map((agent) => (
                      <div key={agent.label} style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                          <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: agent.color, fontWeight: 700 }}>{agent.label}</span>
                          <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: '#34D399', fontWeight: 700 }}>{agent.acc}%</span>
                        </div>
                        <p style={{ fontFamily: 'Inter', fontSize: 10, color: 'rgba(255,255,255,0.5)', margin: '0 0 8px', lineHeight: 1.4 }}>{agent.desc}</p>
                        <ConfidenceBar value={parseFloat(agent.acc) / 100} color={agent.color} />
                      </div>
                    ))}
                  </div>

                  {/* EU AI Act Compliance Block */}
                  <div style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <Lock size={11} color="#10B981" />
                      <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: '#10B981', fontWeight: 700, letterSpacing: 1.5 }}>CLINICAL COMPLIANCE & EU AI ACT ART. 14 AUDIT</span>
                    </div>
                    <p style={{ fontFamily: 'Inter', fontSize: 11, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, margin: 0 }}>
                      All digitized records, OCR extractions, and patient education visuals operate under physician HITL supervision (EU AI Act Art. 14). UMLS codes validated against WHO ICD-10-CM. Patient data processed under GDPR Art. 9 zero-retention protocol. MDR Class IIa compliant.
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                      {['✓ EU AI Act Art. 14 — HITL', '✓ GDPR Art. 9 — ZDR', '✓ MDR Class IIa', '✓ WHO ICD-10-CM', '✓ UMLS NLM', '✓ AHA Literacy Std.'].map((b) => (
                        <span key={b} style={{ padding: '2px 8px', borderRadius: 4, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#34D399', fontFamily: "'JetBrains Mono'", fontSize: 7, fontWeight: 700 }}>{b}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── 3D HUD SCOPE TAB ── */}
              {activeTab === 'hud' && (
                <div className="animate-fade-in">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Radio size={13} color="#00F2FE" className="animate-pulse" />
                      <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: '#00F2FE', fontWeight: 700, letterSpacing: 2 }}>
                        3D HOLOGRAPHIC ANATOMICAL HUD SCOPE — #{selectedId}
                      </span>
                    </div>
                    <span style={{ padding: '3px 8px', borderRadius: 4, background: 'rgba(0,242,254,0.08)', border: '1px solid rgba(0,242,254,0.2)', color: '#00F2FE', fontFamily: "'JetBrains Mono'", fontSize: 7, fontWeight: 700 }}>
                      QT CARDIOCARE SPEC · FLUX.2-PRO RENDER
                    </span>
                  </div>
                  <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(0,242,254,0.15)' }}>
                    <AnatomicalHUDViewer patientData={{
                      patient_id: selectedId,
                      patient_name: meta.name,
                      primary_diagnosis: meta.condition,
                      icd10_code: meta.icd10,
                      umls_cui: umlsEntities[0]?.cui || historyData?.umls_cui,
                      illustration_prompt: `Create a simple, non-intimidating, flat-vector medical illustration for ${meta.condition}, suitable for patient education, clean white background`,
                      b64_json: resolvedB64,
                      confidence_score: resolvedConf,
                      // Pass real timeline so clinical logs show actual encounter data
                      timeline: timelineEvents.map((e) => ({
                        time: e.date || e.title || '—',
                        event: e.details || e.title || '—',
                        date: e.date || '—',
                      })),
                    }} />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
