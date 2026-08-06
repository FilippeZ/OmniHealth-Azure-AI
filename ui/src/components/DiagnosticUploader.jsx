import React, { useState } from 'react';
import { Upload, CheckCircle2, Play, FileText, Sparkles } from 'lucide-react';
import { uploadDiagnosticScan } from '../services/api';

export default function DiagnosticUploader({ onScanUploaded }) {
  const [patientId, setPatientId] = useState('PX-8810');
  const [patientName, setPatientName] = useState('Nikos Mavros');
  const [clinicalNotes, setClinicalNotes] = useState(
    'PATIENT: Mavros Nikos | AGE: 58 | ADMISSION: 2026-05-14. Clinical summary: Patient presented with exertional angina and shortness of breath. Coronary angiography revealed 85% proximal LAD artery stenosis. Diagnosis: Atherosclerotic Heart Disease (Coronary Artery Disease - CAD).'
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handlePreset = (id, name, notes) => {
    setPatientId(id);
    setPatientName(name);
    setClinicalNotes(notes);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('patient_id', patientId);
      formData.append('patient_name', patientName);
      formData.append('clinical_notes', clinicalNotes);
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      await uploadDiagnosticScan(formData);
      setUploadSuccess(true);
      setTimeout(() => {
        onScanUploaded(patientId);
      }, 800);
    } catch (err) {
      console.error(err);
      alert('Failed to upload scan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <div class="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div class="p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Upload class="w-6 h-6" />
          </div>
          <div>
            <h2 class="text-sm font-mono font-bold text-slate-900 uppercase tracking-wider">
              LEGACY DOCUMENT DIGITIZATION & PATIENT ILLUSTRATION SYNTHESIS (MAF)
            </h2>
            <p class="text-xs text-slate-500 font-medium">
              Upload scanned hospital discharge PDFs, handwritten doctor referrals, or legacy medical records for Multi-Agent OCR Synthesis & Patient Illustration (FLUX.2-pro).
            </p>
          </div>
        </div>

        {/* Quick Sample Clinical Cases */}
        <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
          <span class="text-[11px] font-mono font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles class="w-3.5 h-3.5 text-blue-600" /> SAMPLE LEGACY CLINICAL RECORD PRESETS
          </span>
          <div class="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={() => handlePreset('PX-8810', 'Nikos Mavros', 'PATIENT: Mavros Nikos | AGE: 58 | ADMISSION: 2026-05-14. Clinical summary: Patient presented with exertional angina and shortness of breath. Coronary angiography revealed 85% proximal LAD artery stenosis. Diagnosis: Atherosclerotic Heart Disease (Coronary Artery Disease - CAD).')}
              class="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-mono font-medium text-slate-700 hover:border-blue-500 hover:text-blue-600 transition-all shadow-2xs"
            >
              PX-8810: Coronary Artery Disease (Scanned Discharge Summary PDF / CAD)
            </button>
            <button
              type="button"
              onClick={() => handlePreset('PX-8811', 'Elena Dimou', 'PATIENT: Dimou Elena | AGE: 42. Handwritten referral note: Severe low back pain radiating to left leg (L5 distribution) for 3 weeks. MRI lumbar spine shows L5-S1 herniated disc with nerve root compression.')}
              class="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-mono font-medium text-slate-700 hover:border-blue-500 hover:text-blue-600 transition-all shadow-2xs"
            >
              PX-8811: Lumbar Disc Herniation (Handwritten Referral Note)
            </button>
            <button
              type="button"
              onClick={() => handlePreset('PX-8812', 'Christos Papanikolaou', 'PATIENT: Papanikolaou Christos | AGE: 65. Scanned lab & outpatient note: HbA1c 8.6%, fasting glucose 192 mg/dL. Distal sensory polyneuropathy symptoms in toes.')}
              class="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-mono font-medium text-slate-700 hover:border-blue-500 hover:text-blue-600 transition-all shadow-2xs"
            >
              PX-8812: Type 2 Diabetes Mellitus (Scanned Lab & Clinical Report)
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} class="space-y-6">
          {/* Metadata Grid */}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1.5">PATIENT ID</label>
              <input
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                required
                class="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs font-mono text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
              />
            </div>
            <div>
              <label class="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1.5">PATIENT FULL NAME</label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                required
                class="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs font-mono text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
              />
            </div>
          </div>

          {/* File Dropzone */}
          <div>
            <label class="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1.5">
              SCANNED MEDICAL DOCUMENT / HANDWRITTEN REFERRAL NOTE (PDF, PNG, JPG)
            </label>
            <div class="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center bg-slate-50/50 hover:bg-slate-50 hover:border-blue-500 transition-all cursor-pointer relative group">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload class="w-8 h-8 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p class="text-xs font-mono font-semibold text-slate-800">
                {selectedFile ? selectedFile.name : 'Drag & drop scanned PDF or handwritten note here, or click to browse'}
              </p>
              <p class="text-[10px] font-mono text-slate-400 mt-1">
                Supported Formats: PDF, PNG, JPG, TIFF — Powered by Mistral OCR 4.0 & Azure AI Content Understanding
              </p>
            </div>
          </div>

          {/* Clinical Notes */}
          <div>
            <label class="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1.5">
              DOCUMENT CONTENT / CLINICAL SUMMARY NOTES
            </label>
            <textarea
              rows={4}
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              required
              class="w-full bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-xs font-mono text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
              placeholder="Enter discharge notes or handwritten clinical referral text..."
            />
          </div>

          {/* Action Button */}
          <div class="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              class="w-full py-4 px-6 bg-blue-600 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>INITIALIZING MULTI-AGENT WORKFLOW (MAF)...</span>
              ) : uploadSuccess ? (
                <span class="flex items-center gap-2 text-emerald-300">
                  <CheckCircle2 class="w-4 h-4" /> UPLOAD & DIGITIZATION SUCCESSFUL
                </span>
              ) : (
                <span class="flex items-center gap-2">
                  <Play class="w-4 h-4 fill-current" /> START DIAGNOSTIC ANALYSIS (MULTI-AGENT)
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
