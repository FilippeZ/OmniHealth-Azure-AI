import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import ClinicalDashboard from './components/ClinicalDashboard';
import DiagnosticUploader from './components/DiagnosticUploader';
import SupervisoryHITLPanel from './components/SupervisoryHITLPanel';
import PatientHistoryGraph from './components/PatientHistoryGraph';
import { fetchPatients, fetchSystemStatus } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState('PX-8810');
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);
  const [systemStatus, setSystemStatus] = useState(null);
  const [hitlData, setHitlData] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  const handlePatientSelect = (patientId) => {
    setSelectedPatientId(patientId);
    setActiveTab('hitl');
  };

  const handleScanUploaded = (patientId) => {
    setSelectedPatientId(patientId);
    setActiveTab('hitl');
    loadData();
  };

  const filteredPatients = (Array.isArray(patients) ? patients : []).filter(
    (p) =>
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const mainPadding = sidebarCollapsed ? 'pl-20' : 'pl-64';

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
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
      />

      <main className={`${mainPadding} pt-16 min-h-screen transition-all duration-300`}>
        <div className="p-6 page-section" key={activeTab}>
          {activeTab === 'dashboard' && (
            <ClinicalDashboard
              patients={filteredPatients}
              systemStatus={systemStatus}
              onSelectPatient={handlePatientSelect}
              onNavigateUpload={() => setActiveTab('upload')}
              isLoading={isLoading}
            />
          )}
          {activeTab === 'upload' && (
            <DiagnosticUploader onScanUploaded={handleScanUploaded} />
          )}
          {activeTab === 'hitl' && (
            <SupervisoryHITLPanel
              hitlData={hitlData}
              patientId={selectedPatientId}
              onApproved={() => { loadData(); }}
              onNavigateDashboard={() => setActiveTab('dashboard')}
              onNavigateHistory={() => setActiveTab('patient-history')}
            />
          )}
          {activeTab === 'patient-history' && (
            <PatientHistoryGraph
              patientId={selectedPatientId}
              patients={patients}
              onSelectPatient={(id) => setSelectedPatientId(id)}
            />
          )}
        </div>
      </main>
    </div>
  );
}
