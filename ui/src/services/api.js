import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const fetchSystemStatus = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/system-status`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch system status", error);
    return null;
  }
};

export const fetchPatients = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/patients`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch patients", error);
    return [];
  }
};

export const uploadDiagnosticScan = async (formData) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (error) {
    console.error("Diagnostic upload error", error);
    throw error;
  }
};

export const sendPhysicianApproval = async (patientId, decision, physicianNotes = "") => {
  try {
    const res = await axios.post(`${API_BASE_URL}/approve`, {
      patient_id: patientId,
      physician_id: "DR-ARIS-992",
      decision: decision,
      physician_notes: physicianNotes
    });
    return res.data;
  } catch (error) {
    console.error("Physician approval error", error);
    throw error;
  }
};

export const connectReasoningStream = (patientId, onMessageCallback, onErrorCallback) => {
  const eventSource = new EventSource(`${API_BASE_URL}/stream-reasoning?patient_id=${patientId}`);

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessageCallback(data);
    } catch (err) {
      console.error("Failed to parse SSE payload", err);
    }
  };

  eventSource.onerror = (err) => {
    console.error("SSE stream error", err);
    if (onErrorCallback) onErrorCallback(err);
    eventSource.close();
  };

  return eventSource;
};
