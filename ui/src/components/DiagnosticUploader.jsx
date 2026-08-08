import React, { useState } from 'react';
import { Upload, CheckCircle2, Play, FileText, Sparkles, X, UploadCloud, Stethoscope } from 'lucide-react';
import { uploadDiagnosticScan } from '../services/api';

const PRESETS = [
  {
    id: 'PX-8810', name: 'Nikos Mavros', tag: 'CAD',
    badge: 'badge-rose',
    label: 'PX-8810: Coronary Artery Disease',
    notes: 'PATIENT: Mavros Nikos | AGE: 58 | ADMISSION: 2026-05-14. Clinical summary: Patient presented with exertional angina and shortness of breath. Coronary angiography revealed 85% proximal LAD artery stenosis. Diagnosis: Atherosclerotic Heart Disease (Coronary Artery Disease - CAD).',
  },
  {
    id: 'PX-8811', name: 'Elena Dimou', tag: 'L5-S1',
    badge: 'badge-purple',
    label: 'PX-8811: Lumbar Disc Herniation',
    notes: 'PATIENT: Dimou Elena | AGE: 42. Handwritten referral note: Severe low back pain radiating to left leg (L5 distribution) for 3 weeks. MRI lumbar spine shows L5-S1 herniated disc with nerve root compression.',
  },
  {
    id: 'PX-8812', name: 'Christos Papanikolaou', tag: 'T2D',
    badge: 'badge-amber',
    label: 'PX-8812: Type 2 Diabetes Mellitus',
    notes: 'PATIENT: Papanikolaou Christos | AGE: 65. Scanned lab & outpatient note: HbA1c 8.6%, fasting glucose 192 mg/dL. Distal sensory polyneuropathy symptoms in toes.',
  },
  {
    id: 'PX-8813', name: 'George Vassiliou', tag: 'COPD',
    badge: 'badge-blue',
    label: 'PX-8813: COPD Exacerbation',
    notes: 'PATIENT: Vassiliou George | AGE: 62 | ADMISSION: 2026-07-02. Clinical summary: Progressive exertional dyspnea, chronic productive cough, FEV1/FVC 58%. CT chest shows hyperinflation and bilateral emphysematous bullae. Diagnosis: Chronic Obstructive Pulmonary Disease (COPD - J44.1).',
  },
  {
    id: 'PX-8819', name: 'Eleni Papadaki', tag: 'L4-L5',
    badge: 'badge-emerald',
    label: 'PX-8819: Acute L4-L5 Disc Extrusion',
    notes: 'PATIENT: Papadaki Eleni | AGE: 36 | ADMISSION: 2026-08-08. Clinical summary: Acute severe lower back pain radiating to right anterior thigh and L4 dermatome after lifting heavy weight. Lumbar MRI demonstrates 7mm L4-L5 disc extrusion with right L4 nerve root compression. Diagnosis: Acute L4-L5 Lumbar Disc Extrusion with Radiculopathy (M51.16).',
  },
  {
    id: 'PX-8888', name: 'Filippos-Paraskevas Zygouris', tag: 'MYALGIA',
    badge: 'badge-cyan',
    label: 'PX-8888: Masticatory Myalgia',
    notes: 'PATIENT: Zygouris Filippos-Paraskevas | AGE: 24 | ADMISSION: 2026-08-07. Primary Diagnosis: Masticatory Myalgia (ICD-10: M79.1). Clinical summary: Localized pain and fatigue in muscles of mastication (masseter and temporalis). Prolonged static posture, high cognitive load, bruxism.',
  },
  {
    id: 'PX-8820', name: 'Maria Karrathana', tag: 'COLON CANCER',
    badge: 'badge-rose',
    label: 'PX-8820: Colorectal Adenocarcinoma (Colon Cancer)',
    notes: 'PATIENT: Karrathana Maria | AGE: 59 | ADMISSION: 2026-08-08. Clinical summary: Colonoscopy and CT abdomen reveal exophytic 3.4 cm intestinal mass in descending colon lumen causing partial bowel stenosis. Biopsy confirms Colorectal Adenocarcinoma (ICD-10: C18.9, UMLS: C0009375). Elevated Carcinoembryonic Antigen (CEA 18.4 ng/mL).',
  },
];

export default function DiagnosticUploader({ onScanUploaded }) {
  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [activePreset, setActivePreset] = useState(null);

  const handlePreset = (p) => {
    setPatientId(p.id);
    setPatientName(p.name);
    setClinicalNotes(p.notes);
    setActivePreset(p.id);
    setSelectedFile(null);
    setUploadSuccess(false);
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
      setActivePreset(null);
      if (!patientId || activePreset) setPatientId('');
      if (!patientName || activePreset) setPatientName('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setActivePreset(null);
      if (!patientId || activePreset) setPatientId('');
      if (!patientName || activePreset) setPatientName('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('patient_id', patientId.trim());
      formData.append('patient_name', patientName.trim());
      formData.append('clinical_notes', clinicalNotes);
      if (selectedFile) formData.append('file', selectedFile);

      const response = await uploadDiagnosticScan(formData);
      const resPid = response?.patient_id || patientId.trim() || 'PX-8890';
      const resRecord = response?.patient_record || null;
      setUploadSuccess(true);
      setTimeout(() => onScanUploaded(resPid, resRecord), 700);
    } catch (err) {
      console.error(err);
      alert('Failed to upload diagnostic record. Please check the backend connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Centered Page Header */}
      <div className="animate-fade-in-down text-center max-w-xl mx-auto space-y-1.5">
        <h1
          className="text-xl font-bold flex items-center justify-center gap-2"
          style={{ fontFamily: "'JetBrains Mono'", color: 'var(--text-primary)' }}
        >
          <Stethoscope className="w-5 h-5" style={{ color: 'var(--accent-blue)' }} />
          DIAGNOSTIC SCAN & DOCUMENT INGESTION
        </h1>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          Upload scanned hospital discharge PDFs, handwritten referral notes, or clinical lab reports for AI document digitization and patient education visual synthesis.
        </p>
      </div>

      <div className="space-y-5">
        {/* Centered Sample Presets Selector */}
        <div className="glass-card p-5 animate-slide-in-up text-center">
          <div
            className="text-[10px] font-bold uppercase tracking-widest mb-3.5 flex items-center justify-center gap-2"
            style={{ fontFamily: "'JetBrains Mono'", color: 'var(--text-muted)' }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--accent-blue)' }} />
            SAMPLE CLINICAL CASE PRESETS (CLICK TO LOAD)
          </div>
          <div className="flex flex-wrap justify-center gap-2.5">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handlePreset(p)}
                className="btn-ghost transition-all duration-200 hover:scale-105"
                style={{
                  padding: '8px 14px',
                  fontSize: '11px',
                  ...(activePreset === p.id
                    ? {
                        background: 'rgba(59,130,246,0.15)',
                        borderColor: 'rgba(59,130,246,0.45)',
                        color: 'var(--accent-blue)',
                        boxShadow: '0 0 15px rgba(59,130,246,0.15)',
                      }
                    : {}),
                }}
                id={`preset-${p.id}`}
              >
                <span className={`badge ${p.badge}`} style={{ fontSize: '9px', padding: '2px 6px' }}>
                  {p.tag}
                </span>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Centered Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Patient ID + Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-in-up" style={{ animationDelay: '100ms' }}>
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-2">
                <label
                  className="block text-[10px] font-bold uppercase tracking-widest"
                  style={{ fontFamily: "'JetBrains Mono'", color: 'var(--text-muted)' }}
                >
                  PATIENT ID / RECORD CODE
                </label>
                <span className="text-[9px] font-mono text-cyan-400 font-bold">OPTIONAL · AUTO-GENERATE</span>
              </div>
              <input
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                placeholder="Auto-generated if empty (e.g. PX-8895)..."
                className="clinical-input font-mono"
                id="patient-id-input"
              />
            </div>
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-2">
                <label
                  className="block text-[10px] font-bold uppercase tracking-widest"
                  style={{ fontFamily: "'JetBrains Mono'", color: 'var(--text-muted)' }}
                >
                  PATIENT FULL NAME
                </label>
                <span className="text-[9px] font-mono text-cyan-400 font-bold">AUTO-DETECT (MISTRAL OCR 4.0)</span>
              </div>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Leave empty to auto-detect from PDF scan..."
                className="clinical-input"
                id="patient-name-input"
              />
            </div>
          </div>

          {/* Centered Drag & Drop Zone */}
          <div
            className="glass-card p-5 animate-slide-in-up text-center"
            style={{ animationDelay: '150ms' }}
          >
            <label
              className="block text-[10px] font-bold uppercase tracking-widest mb-3"
              style={{ fontFamily: "'JetBrains Mono'", color: 'var(--text-muted)' }}
            >
              SCANNED CLINICAL DOCUMENT FILE (PDF, PNG, JPG, TIFF)
            </label>
            <div
              className={`dropzone relative ${isDragging ? 'dragging' : ''}`}
              style={{
                padding: '36px 24px',
                borderRadius: '16px',
                border: '2px dashed #00F2FE',
                boxShadow: '0 0 20px rgba(0, 242, 254, 0.15)',
                background: 'rgba(0, 242, 254, 0.03)'
              }}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="file-upload-input"
              />
              <div className="text-center pointer-events-none">
                {selectedFile ? (
                  <div className="flex items-center justify-center gap-3 animate-fade-in">
                    <FileText className="w-8 h-8" style={{ color: 'var(--accent-blue)' }} />
                    <div className="text-left">
                      <div
                        className="text-sm font-bold"
                        style={{ color: 'var(--text-primary)', fontFamily: "'JetBrains Mono'" }}
                      >
                        {selectedFile.name}
                      </div>
                      <div className="text-xs font-semibold" style={{ color: 'var(--accent-emerald)' }}>
                        {(selectedFile.size / 1024).toFixed(1)} KB · Medical Document Loaded & Ready for Processing
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <UploadCloud
                      className="w-12 h-12 mx-auto mb-3 animate-float"
                      style={{ color: 'rgba(59,130,246,0.6)' }}
                    />
                    <p
                      className="text-sm font-semibold"
                      style={{ color: 'var(--text-primary)', fontFamily: "'JetBrains Mono'" }}
                    >
                      Drag & drop scanned medical document here
                    </p>
                    <p
                      className="text-xs mt-1.5"
                      style={{ color: 'var(--text-faint)' }}
                    >
                      or click to browse files · AI Optical Document Digitization Engine
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Clinical Notes Summary Input */}
          <div
            className="glass-card p-5 animate-slide-in-up"
            style={{ animationDelay: '200ms' }}
          >
            <label
              className="block text-[10px] font-bold uppercase tracking-widest mb-3"
              style={{ fontFamily: "'JetBrains Mono'", color: 'var(--text-muted)' }}
            >
              DOCUMENT SUMMARY / CLINICAL NOTES TEXT <span style={{ color: 'var(--text-faint)' }}>(OPTIONAL IF PDF SCAN IS UPLOADED)</span>
            </label>
            <textarea
              rows={4}
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              className="clinical-input"
              style={{ resize: 'vertical' }}
              placeholder="Enter discharge notes, handwritten clinical referral text, or leave empty if uploading a PDF file for automatic AI structuring..."
              id="clinical-notes-textarea"
            />
          </div>

          {/* Visual Progress Stepper during processing */}
          {isSubmitting && (
            <div className="glass-card p-5 border-cyan-500/30 animate-fade-in space-y-3">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-400">
                <span>MULTI-AGENT CLINICAL PIPELINE EXECUTING...</span>
                <span>STEP 4 OF 4</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div className="p-2.5 rounded-lg bg-purple-500/20 border border-purple-400/40 text-center">
                  <span className="text-[10px] font-mono font-bold text-purple-300 block">STEP 1</span>
                  <span className="text-xs font-bold text-white block mt-0.5">Intake</span>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-center">
                  <span className="text-[10px] font-mono font-bold text-emerald-300 block">STEP 2</span>
                  <span className="text-xs font-bold text-white block mt-0.5">Mistral OCR</span>
                </div>
                <div className="p-2.5 rounded-lg bg-blue-500/20 border border-blue-400/40 text-center">
                  <span className="text-[10px] font-mono font-bold text-blue-300 block">STEP 3</span>
                  <span className="text-xs font-bold text-white block mt-0.5">Azure TA4H</span>
                </div>
                <div className="p-2.5 rounded-lg bg-rose-500/20 border border-rose-400/40 text-center animate-pulse">
                  <span className="text-[10px] font-mono font-bold text-rose-300 block">STEP 4</span>
                  <span className="text-xs font-bold text-white block mt-0.5">FLUX Visual</span>
                </div>
              </div>
            </div>
          )}

          {/* Centered Doctor Submit Button */}
          <div className="animate-slide-in-up text-center pt-2" style={{ animationDelay: '250ms' }}>
            <button
              type="submit"
              disabled={isSubmitting || uploadSuccess}
              className="btn-primary flex items-center justify-center mx-auto transition-all duration-300 hover:scale-[1.02]"
              style={{ width: '100%', maxWidth: '480px', padding: '16px 28px', fontSize: '12px' }}
              id="submit-diagnosis-btn"
            >
              {isSubmitting ? (
                <>
                  <span
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
                  />
                  PROCESSING PIPELINE (OCR → TA4H → FLUX)...
                </>
              ) : uploadSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" style={{ color: '#86efac' }} />
                  DIGITIZATION SUCCESSFUL — REDIRECTING TO SUPERVISORY REVIEW...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current mr-2" />
                  START CLINICAL DIGITIZATION & PATIENT ILLUSTRATION
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
