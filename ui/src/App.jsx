import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import ClinicalDashboard from './components/ClinicalDashboard';
import DiagnosticUploader from './components/DiagnosticUploader';
import SupervisoryHITLPanel from './components/SupervisoryHITLPanel';
import PatientHistoryGraph from './components/PatientHistoryGraph';
import LandingPage from './components/LandingPage';
import { fetchPatients, fetchSystemStatus } from './services/api';
import { ShieldCheck, Sparkles, X, ChevronRight, Bell, Radio, FileText } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState('PX-8810');
  const [uploadedPatientData, setUploadedPatientData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);
  const [systemStatus, setSystemStatus] = useState(null);
  const [hitlData, setHitlData] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [doctor, setDoctor] = useState({
    name: 'DR. ARIS NIKOLAIDIS',
    role: 'LEAD CLINICAL DIAGNOSTICIAN',
    licenseId: 'GR-MDR-99823',
    institution: 'OmniHealth Azure AI Hub',
    authenticated: true,
  });

  // Add Toast Notification
  const addToast = (toast) => {
    const id = Date.now() + Math.random();
    const newToast = { id, time: 'Just now', ...toast };
    setToasts((prev) => [newToast, ...prev].slice(0, 4));

    // Auto dismiss after 9 seconds
    setTimeout(() => {
      removeToast(id);
    }, 9000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loadData = async () => {
    try {
      const [pts, status] = await Promise.all([fetchPatients(), fetchSystemStatus()]);
      setPatients(pts);
      setSystemStatus(status);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 6000);
    return () => clearInterval(interval);
  }, []);

  // SSE Global Event Stream Listener
  useEffect(() => {
    const eventSource = new EventSource('http://127.0.0.1:8000/api/stream-reasoning');
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'APPROVAL_REQUIRED' || data.event === 'CHECKPOINT_CREATED') {
          addToast({
            title: 'REGULATORY SIGN-OFF REQUIRED',
            message: `New Case ${data.patient_id || 'PX-8890'} requires EU AI Act Art. 14 approval.`,
            patientId: data.patient_id || 'PX-8811',
            targetTab: 'hitl',
            badge: 'badge-amber',
          });
        }
      } catch (e) {
        // Handle non-JSON keepalive
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => eventSource.close();
  }, []);

  const handlePatientSelect = (patientId, patientRecord = null) => {
    setSelectedPatientId(patientId);
    if (patientRecord) setUploadedPatientData(patientRecord);
    else setUploadedPatientData(null);
    setActiveTab('hitl');
  };

  const handleScanUploaded = (patientId, patientRecord = null) => {
    setSelectedPatientId(patientId);
    if (patientRecord) setUploadedPatientData(patientRecord);
    loadData();
    addToast({
      title: 'SCAN DIGITIZATION COMPLETE',
      message: `New Case ${patientId} processed by Mistral & FLUX. Ready for regulatory sign-off.`,
      patientId: patientId,
      targetTab: 'hitl',
      badge: 'badge-emerald',
    });
    setActiveTab('hitl');
  };

  const handleOpenHUD = (pid) => {
    setSelectedPatientId(pid);
    setActiveTab('hud-scope');
  };

  const handleNavigateEHR = (pid) => {
    setSelectedPatientId(pid);
    setActiveTab('patient-history');
  };

  const handleApproved = (pid) => {
    loadData();
    addToast({
      title: 'PATIENT CONSULTATION APPROVED',
      message: `Record ${pid} approved and shared with patient portal. Dashboard updated.`,
      patientId: pid,
      targetTab: 'dashboard',
      badge: 'badge-emerald',
    });
  };

  const filteredPatients = (Array.isArray(patients) ? patients : []).filter(
    (p) =>
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const mainPadding = sidebarCollapsed ? 'pl-20' : 'pl-64';

  if (!isAuthenticated) {
    return (
      <LandingPage
        onLogin={(docData) => {
          setDoctor(docData);
          setIsAuthenticated(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen relative" style={{ background: 'var(--bg-base)' }}>
      {/* Global Floating Toast Notifications Overlay */}
      <div className="fixed top-20 right-6 z-50 space-y-3 max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            onClick={() => {
              if (t.patientId) setSelectedPatientId(t.patientId);
              if (t.targetTab) setActiveTab(t.targetTab);
              removeToast(t.id);
            }}
            className="pointer-events-auto p-4 rounded-xl shadow-2xl border flex items-start gap-3 cursor-pointer transition-all duration-300 animate-slide-in-right hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(8,18,38,0.98) 100%)',
              borderColor: 'rgba(56,189,248,0.4)',
              boxShadow: '0 0 25px rgba(6,182,212,0.2)',
            }}
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono font-bold text-cyan-400 tracking-wider">
                  {t.title}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeToast(t.id);
                  }}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs text-slate-200 mt-1 leading-snug font-sans">{t.message}</p>

              <div className="mt-2.5 flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-cyan-300 flex items-center gap-1 hover:underline">
                  Open Case #{t.patientId} <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sidebarCollapsed={sidebarCollapsed}
        systemStatus={systemStatus}
        onSelectPatient={(pid, targetTab) => {
          setSelectedPatientId(pid);
          setActiveTab(targetTab || 'hitl');
        }}
        onNavigateTab={(tab) => setActiveTab(tab)}
        doctor={doctor}
        setDoctor={setDoctor}
        onSignOut={() => setIsAuthenticated(false)}
      />

      <main className={`${mainPadding} pt-14 min-h-screen transition-all duration-300`}>
        {activeTab === 'patient-history' ? (
          <div key={activeTab} style={{ height: 'calc(100vh - 56px)', overflow: 'hidden' }}>
            <PatientHistoryGraph
              patientId={selectedPatientId}
              patients={patients}
              onSelectPatient={(id) => setSelectedPatientId(id)}
              onOpenHUD={handleOpenHUD}
            />
          </div>
        ) : (
          <div className="px-5 py-3" key={activeTab}>
            {activeTab === 'dashboard' && (
              <ClinicalDashboard
                patients={filteredPatients}
                systemStatus={systemStatus}
                onSelectPatient={handlePatientSelect}
                isLoading={isLoading}
              />
            )}
            {activeTab === 'hitl' && (
              <SupervisoryHITLPanel
                hitlData={hitlData}
                patientId={selectedPatientId}
                uploadedPatientData={uploadedPatientData}
                onApproved={() => handleApproved(selectedPatientId)}
                onNavigateDashboard={() => setActiveTab('dashboard')}
                onNavigateHistory={() => setActiveTab('patient-history')}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
