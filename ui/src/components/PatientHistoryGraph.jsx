import React, { useEffect, useState } from 'react';
import {
  History, ArrowRight, Tag, User, Calendar, Folder, FileText,
  Activity, ShieldCheck, Stethoscope, Clock, CheckCircle2, ChevronRight, Bookmark
} from 'lucide-react';
import { fetchPatientHistory } from '../services/api';

/* ─── Pipeline node color map ─────────────────────── */
const nodeColors = {
  purple: { bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.25)', text: '#c084fc' },
  emerald: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)', text: '#34d399' },
  blue:   { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.25)',  text: '#60a5fa' },
  rose:   { bg: 'rgba(244,63,94,0.1)',  border: 'rgba(244,63,94,0.25)',   text: '#fb7185' },
};

const statusColors = {
  APPROVED:   { cls: 'badge-emerald', dot: 'var(--accent-emerald)' },
  COMPLETED:  { cls: 'badge-blue',   dot: 'var(--accent-blue)'    },
  PROCESSING: { cls: 'badge-amber',  dot: 'var(--accent-amber)'   },
};

export default function PatientHistoryGraph({ patientId, patients = [], onSelectPatient }) {
  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(patientId);
  const [activeFolderTab, setActiveFolderTab] = useState('timeline'); // 'timeline' | 'umls' | 'pipeline'

  const loadHistory = (pid) => {
    setLoading(true);
    fetchPatientHistory(pid).then((data) => {
      setHistoryData(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    setSelectedId(patientId);
    loadHistory(patientId);
  }, [patientId]);

  const handlePatientSwitch = (pid) => {
    setSelectedId(pid);
    loadHistory(pid);
    if (onSelectPatient) onSelectPatient(pid);
  };

  const pipelineNodes = historyData?.pipeline_nodes || [
    { step: 'Document Intake', label: 'Scanned Discharge Summary PDF', color: 'purple' },
    { step: 'Document Digitization', label: 'Layout Digitization (98.5%)', color: 'emerald' },
    { step: 'UMLS & ICD-10', label: `Code: ${historyData?.icd10 || 'I25.10'}`, color: 'blue' },
    { step: 'Anatomical Synthesis', label: 'Patient Visual Consultation Aid', color: 'rose' },
  ];

  const timelineEvents = historyData?.timeline || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="animate-fade-in-down flex items-center justify-between">
        <div>
          <h1
            className="text-lg font-bold flex items-center gap-2"
            style={{ fontFamily: "'JetBrains Mono'", color: 'var(--text-primary)' }}
          >
            <Folder className="w-5 h-5" style={{ color: 'var(--accent-emerald)' }} />
            PATIENT ELECTRONIC HEALTH RECORD (EHR CHART)
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Clinical history folder, UMLS medical entity mapping, and diagnostic encounter timeline
          </p>
        </div>

        {/* Patient Selection Bar */}
        {patients.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {patients.map((p) => (
              <button
                key={p.id}
                onClick={() => handlePatientSwitch(p.id)}
                className="btn-ghost transition-all duration-200 hover:scale-105"
                style={{
                  padding: '6px 12px',
                  fontSize: '10px',
                  ...(selectedId === p.id
                    ? {
                        background: 'rgba(16,185,129,0.15)',
                        borderColor: 'rgba(16,185,129,0.4)',
                        color: 'var(--accent-emerald)',
                        boxShadow: '0 0 12px rgba(16,185,129,0.15)',
                      }
                    : {}),
                }}
              >
                <User className="w-3 h-3" /> #{p.id}: {p.name || p.id}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div className="glass-card p-16 text-center animate-fade-in">
          <div
            className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: 'var(--accent-emerald)', borderTopColor: 'transparent' }}
          />
          <span
            className="text-xs font-bold uppercase tracking-wider"
            style={{ fontFamily: "'JetBrains Mono'", color: 'var(--text-faint)' }}
          >
            OPENING PATIENT EHR MEDICAL FOLDER...
          </span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* EHR Patient Medical Chart Folder Container */}
          <div
            className="glass-card-elevated overflow-hidden animate-slide-in-up"
            style={{ border: '1px solid rgba(16,185,129,0.25)', boxShadow: '0 0 35px rgba(16,185,129,0.08)' }}
          >
            {/* Top Folder Tab Header */}
            <div
              className="px-6 py-4 flex flex-wrap items-center justify-between gap-4"
              style={{
                background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(15,23,42,0.95) 100%)',
                borderBottom: '1px solid rgba(16,185,129,0.2)',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)' }}
                >
                  <FileText className="w-5 h-5" style={{ color: 'var(--accent-emerald)' }} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-bold uppercase tracking-widest"
                      style={{ fontFamily: "'JetBrains Mono'", color: 'var(--accent-emerald)' }}
                    >
                      EHR MEDICAL CHART FOLDER · ID #{selectedId}
                    </span>
                    <span className="badge badge-emerald flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> ACTIVE RECORD
                    </span>
                  </div>
                  <h2
                    className="text-base font-bold mt-0.5"
                    style={{ color: 'var(--text-primary)', fontFamily: 'Inter' }}
                  >
                    {historyData?.patient_name || 'Nikos Mavros'}
                  </h2>
                </div>
              </div>

              {/* EHR Banner Quick Badges */}
              {historyData && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="badge badge-blue">UMLS CUI: {historyData.umls_cui}</span>
                  <span className="badge badge-emerald">ICD-10-CM: {historyData.icd10}</span>
                  <span className="badge badge-purple">ATTENDING: DR. ARIS NIKOLAIDIS</span>
                </div>
              )}
            </div>

            {/* EHR Folder Clinical Details Bar */}
            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5"
              style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}
            >
              <div>
                <span className="text-[10px] uppercase font-bold text-muted block" style={{ fontFamily: "'JetBrains Mono'" }}>
                  PRIMARY DIAGNOSIS
                </span>
                <span className="text-xs font-bold text-primary mt-1 block">
                  {historyData?.condition || 'Coronary Artery Disease (CAD)'}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-muted block" style={{ fontFamily: "'JetBrains Mono'" }}>
                  RECORD INGESTION STATUS
                </span>
                <span className="text-xs font-bold text-emerald-400 mt-1 block flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> DIGITIZED & VERIFIED
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-muted block" style={{ fontFamily: "'JetBrains Mono'" }}>
                  LAST ENCOUNTER DATE
                </span>
                <span className="text-xs font-bold text-primary mt-1 block">
                  2026-08-05 (Discharge Summary)
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-muted block" style={{ fontFamily: "'JetBrains Mono'" }}>
                  PATIENT CONSULTATION AID
                </span>
                <span className="text-xs font-bold text-rose-400 mt-1 block">
                  Anatomical Consultation Diagram Ready
                </span>
              </div>
            </div>

            {/* Folder View Switcher Tabs */}
            <div className="flex border-b" style={{ borderColor: 'var(--border)', background: 'rgba(15,23,42,0.6)' }}>
              <button
                onClick={() => setActiveFolderTab('timeline')}
                className={`px-6 py-3.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
                  activeFolderTab === 'timeline'
                    ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                    : 'border-transparent text-muted hover:text-primary'
                }`}
                style={{ fontFamily: "'JetBrains Mono'" }}
              >
                <Calendar className="w-4 h-4" />
                CHRONOLOGICAL CLINICAL ENCOUNTERS
              </button>
              <button
                onClick={() => setActiveFolderTab('pipeline')}
                className={`px-6 py-3.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
                  activeFolderTab === 'pipeline'
                    ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                    : 'border-transparent text-muted hover:text-primary'
                }`}
                style={{ fontFamily: "'JetBrains Mono'" }}
              >
                <Activity className="w-4 h-4" />
                CLINICAL DIGITIZATION & PIPELINE SYNTHESIS
              </button>
            </div>

            {/* Folder Body Content */}
            <div className="p-6">
              {activeFolderTab === 'timeline' && (
                <div className="space-y-4">
                  <div className="section-header justify-between">
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4" style={{ color: 'var(--accent-emerald)' }} />
                      EHR ENCOUNTER & MEDICAL REPORT HISTORY — PATIENT #{selectedId}
                    </span>
                    <span className="badge badge-emerald">CHRONOLOGICAL RECORD</span>
                  </div>

                  {timelineEvents.length === 0 ? (
                    <div className="text-center py-10 text-xs text-muted" style={{ fontFamily: "'JetBrains Mono'" }}>
                      NO ENCOUNTER HISTORY FOUND FOR PATIENT #{selectedId}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {timelineEvents.map((item, idx) => {
                        const sc = statusColors[item.status] || statusColors.COMPLETED;
                        return (
                          <div
                            key={idx}
                            className="p-4 rounded-xl space-y-2 animate-fade-in"
                            style={{
                              background: 'rgba(255,255,255,0.025)',
                              border: '1px solid rgba(255,255,255,0.07)',
                              animationDelay: `${idx * 80}ms`,
                            }}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <Bookmark className="w-3.5 h-3.5 text-emerald-400" />
                                <span
                                  className="text-xs font-bold"
                                  style={{ fontFamily: "'JetBrains Mono'", color: 'var(--text-primary)' }}
                                >
                                  {item.title}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`badge ${sc.cls}`}>{item.status}</span>
                                <span
                                  className="text-[10px] text-faint"
                                  style={{ fontFamily: "'JetBrains Mono'" }}
                                >
                                  {item.date}
                                </span>
                              </div>
                            </div>

                            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)', fontFamily: 'Inter' }}>
                              {item.details}
                            </p>

                            {item.umls && (
                              <div className="pt-1 flex gap-2">
                                <span className="badge badge-blue flex items-center gap-1">
                                  <Tag className="w-2.5 h-2.5" /> {item.umls}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {activeFolderTab === 'pipeline' && (
                <div className="space-y-6">
                  <div className="section-header">
                    <Activity className="w-4 h-4" style={{ color: 'var(--accent-blue)' }} />
                    CLINICAL SYNTHESIS PIPELINE AUDIT
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 py-6">
                    {pipelineNodes.map((node, idx) => {
                      const nc = nodeColors[node.color] || nodeColors.blue;
                      return (
                        <React.Fragment key={idx}>
                          <div
                            className="p-5 rounded-2xl flex flex-col items-center min-w-[160px] text-center animate-fade-in transition-all duration-200 hover:scale-105"
                            style={{
                              background: nc.bg,
                              border: `1px solid ${nc.border}`,
                              animationDelay: `${idx * 80}ms`,
                            }}
                          >
                            <span
                              className="text-xs font-bold uppercase tracking-wider"
                              style={{ fontFamily: "'JetBrains Mono'", color: nc.text }}
                            >
                              {node.step}
                            </span>
                            <span className="text-[11px] mt-1.5 font-medium" style={{ color: 'var(--text-primary)' }}>
                              {node.label}
                            </span>
                          </div>
                          {idx < pipelineNodes.length - 1 && (
                            <ArrowRight
                              className="w-4 h-4 flex-shrink-0 animate-fade-in"
                              style={{ color: 'var(--text-faint)', animationDelay: `${idx * 80 + 40}ms` }}
                            />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-emerald-400" style={{ fontFamily: "'JetBrains Mono'" }}>
                      CLINICAL COMPLIANCE & EU AI ACT ART. 14 AUDIT VERIFICATION
                    </div>
                    <p className="text-xs text-muted leading-relaxed">
                      All digitized records, OCR extractions, and patient education visual graphics operate under Human-in-the-Loop (HITL) physician supervision. Diagnostic codes are validated against WHO ICD-10 standards.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
