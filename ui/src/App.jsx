import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import ClinicalDashboard from './components/ClinicalDashboard';
import DiagnosticUploader from './components/DiagnosticUploader';
import AgentOrchestrationFeed from './components/AgentOrchestrationFeed';
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

  const loadData = async () => {
    const pts = await fetchPatients();
    setPatients(pts);
    const status = await fetchSystemStatus();
    setSystemStatus(status);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePatientSelect = (patientId) => {
    setSelectedPatientId(patientId);
    setActiveTab('agent-feed');
  };

  const handleScanUploaded = (patientId) => {
    setSelectedPatientId(patientId);
    setActiveTab('agent-feed');
    loadData();
  };

  const filteredPatients = patients.filter(
    (p) =>
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div class="min-h-screen bg-background text-on-surface font-sans antialiased">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <main class="pl-64 pt-16 min-h-screen p-8">
        {activeTab === 'dashboard' && (
          <ClinicalDashboard
            patients={filteredPatients}
            systemStatus={systemStatus}
            onSelectPatient={handlePatientSelect}
            onNavigateUpload={() => setActiveTab('upload')}
          />
        )}

        {activeTab === 'upload' && (
          <DiagnosticUploader onScanUploaded={handleScanUploaded} />
        )}

        {activeTab === 'agent-feed' && (
          <AgentOrchestrationFeed
            patientId={selectedPatientId}
            onHitlTriggered={(data) => {
              setHitlData(data);
            }}
          />
        )}

        {activeTab === 'hitl' && (
          <SupervisoryHITLPanel
            hitlData={hitlData}
            patientId={selectedPatientId}
            onApproved={() => loadData()}
          />
        )}

        {activeTab === 'patient-history' && (
          <PatientHistoryGraph patientId={selectedPatientId} />
        )}
      </main>
    </div>
  );
}
