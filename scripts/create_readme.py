"""Script to write the full OmniHealth AI README.md analytically for Legacy Document Synthesis & Patient Education."""
import os

README_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "README.md")

README = r"""# OmniHealth AI
### Azure MAF Clinical Decision Support System (CDSS) — Legacy Document Synthesis & Patient Education Platform

> **Version 2.0** | Enterprise Multi-Model AI Platform (Mistral OCR + Azure NLP + FLUX.2-pro)
> **Models:** Mistral-OCR-4.0, Azure Text Analytics for Health, FLUX.2-pro, DeepSeek-V3.2-Speciale
> **Framework:** Microsoft Agent Framework (MAF) v2 | **Region:** Sweden Central

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Architecture Diagram](#2-architecture-diagram)
3. [Component Breakdown](#3-component-breakdown)
4. [MAF Multi-Agent Workflow](#4-maf-multi-agent-workflow)
5. [Data Flow Analysis](#5-data-flow-analysis)
6. [Azure & Multi-Model Infrastructure](#6-azure--multi-model-infrastructure)
7. [API Reference](#7-api-reference)
8. [Regulatory Compliance Framework](#8-regulatory-compliance-framework)
9. [Clinical Intelligence Pipeline](#9-clinical-intelligence-pipeline)
10. [Security and Privacy Architecture](#10-security-and-privacy-architecture)
11. [Project Structure](#11-project-structure)
12. [Technology Stack](#12-technology-stack)
13. [Quick Start](#13-quick-start)
14. [Performance Benchmarks](#14-performance-benchmarks)
15. [Clinical Demo Walkthrough](#15-clinical-demo-walkthrough)

---

## 1. System Overview

OmniHealth AI is a **production-grade Clinical Decision Support System (CDSS)** that implements a **Microsoft Agent Framework (MAF) Multi-Agent Group Chat** pipeline for **Legacy Document Synthesis & Patient Education**. The platform digitizes chaotic, scanned, or handwritten medical records (hospital discharge summaries, handwritten specialist referrals, lab reports) and auto-generates personalized visual anatomical diagrams (`FLUX.2-pro` / `gpt-image-2`) to assist attending physicians when explaining complex conditions to patients.

### Multi-Model MAF Suite

| Agent Persona | Underlying Model | Primary Function |
|---------------|------------------|------------------|
| **Legacy Records Agent** | `mistral-ocr-4-0` / `Azure AI Content Understanding` | OCR layout parsing & handwriting extraction |
| **Clinical NLP Agent** | `Azure Text Analytics for Health` | UMLS CUI & ICD-10-CM concept mapping |
| **Medical Illustrator Agent** | `FLUX.2-pro` / `gpt-image-2` | Text-to-Image patient education anatomical diagrams |
| **Lead Medical Orchestrator** | `DeepSeek-V3.2-Speciale` (myagent) | Multi-model coordination & AHA RAG synthesis |

---

## 2. Architecture Diagram

```mermaid
graph TB
    subgraph UI["Clinical UI Layer - React 18 + Vite - http://localhost:5173"]
        A["Sidebar Navigation"]
        B["Clinical Dashboard\nMetrics + Patient Table\n/api/patients polling"]
        C["Diagnostic Uploader\nScanned PDFs / Handwritten Notes\nLegacy Record Presets"]
        D["Agent Feed\nSSE Live Reasoning Stream\nReal-time thought cards"]
        E["Supervisory HITL Panel\nPhysician Approval UI\nPatient Portal Share View"]
        F["Patient History\nUMLS Knowledge Graph\nTimeline View"]
    end

    subgraph API["FastAPI Backend - Python 3.11 - http://localhost:8000"]
        G["POST /api/upload\nPatient + Legacy PDF Intake"]
        H["GET /api/stream-reasoning\nSSE EventStream MAF Output"]
        I["POST /api/approve\nPhysician HITL Decision"]
        J["GET /api/patients\nActive Diagnostic Cases"]
        K["GET /api/system-status\nAzure Services Health"]
    end

    subgraph MAF["Microsoft Agent Framework - Multi-Agent Group Chat"]
        L["Lead Medical Orchestrator\nDeepSeek-V3.2-Speciale myagent\nGroup Chat Coordinator\nAHA RAG Evidence Synthesis"]
        M["Legacy Records Agent\nMistral OCR 4.0\nAzure Content Understanding\nPDF & Handwriting Intake"]
        N["Clinical NLP Agent\nAzure AI Language\nUMLS CUI + ICD-10-CM\nOntology Normalization"]
        O["Medical Illustrator Agent\nFLUX.2-pro / gpt-image-2\nText-to-Image Generator\nFlat-Vector Patient Diagrams"]
        P["Azure Safety Middleware\nContent Safety Bridge\nEU AI Act & GDPR Gate"]
    end

    subgraph MODELS["Multi-Model Cloud Suite"]
        Q["Mistral AI\nmistral-ocr-4-0\nDocument AI 2512"]
        R["Azure AI Language\nText Analytics for Health\nUMLS 2024AB Ontology"]
        S["FLUX.2-pro / OpenAI\ngpt-image-2\nText-to-Image Synthesis"]
        T["Azure AI Foundry\nDeepSeek-V3.2-Speciale\nmyagent Responses API"]
        U["Azure AI Search\nsearch-omnihealth\nAHA Visual Aids & ICD-10 Index"]
        V["Azure Cosmos DB\ncosmos-omnihealth\nImmutable Audit Records"]
    end

    C -->|"multipart/form-data POST"| G
    B -->|"GET 5s polling"| J
    B -->|"GET 5s polling"| K
    D -->|"EventSource SSE"| H
    E -->|"JSON POST"| I

    G --> L
    H --> L
    I --> P

    L -->|"Dispatch OCR task"| M
    L -->|"Dispatch NLP task"| N
    L -->|"Dispatch Image Gen task"| O
    M -->|"OCR JSON output"| L
    N -->|"UMLS entities JSON"| L
    O -->|"FLUX.2-pro diagram"| L

    M -->|"Document OCR"| Q
    N -->|"Clinical NLP"| R
    O -->|"Image synthesis"| S
    L -->|"Responses API POST"| T
    L -->|"Semantic RAG query"| U
    I -->|"Durable commit"| V

    style UI fill:#eff6ff,stroke:#2563eb
    style API fill:#f0fdf4,stroke:#16a34a
    style MAF fill:#fefce8,stroke:#d97706
    style MODELS fill:#fff7ed,stroke:#ea580c
```

---

## 3. Component Breakdown

### 3.1 Frontend Layer (React 18 + Vite)

| Component | File | Responsibility | Key Features |
|-----------|------|---------------|--------------|
| **App.jsx** | `ui/src/App.jsx` | Root router + layout | Tab-based navigation, global state |
| **DiagnosticUploader** | `DiagnosticUploader.jsx` | Document intake | PDF/image dropzone, 3 Legacy case presets |
| **AgentOrchestrationFeed** | `AgentOrchestrationFeed.jsx` | Live MAF stream | SSE, 4 Agent thought cards, FLUX.2-pro canvas |
| **SupervisoryHITL** | `SupervisoryHITLPanel.jsx` | Physician approval | Digitized summary, FLUX.2-pro prompt, patient share action |

### 3.2 Backend Layer (FastAPI & MAF)

| Module | File | Responsibility |
|--------|------|---------------|
| **api.py** | `core/api.py` | 5 REST + SSE endpoints, CORS, async |
| **azure_clients.py** | `core/azure_clients.py` | DeepSeek, Mistral OCR 4.0, FLUX.2-pro integration |
| **orchestration.py** | `core/orchestration.py` | 8-step async MAF multi-model pipeline |

---

## 4. MAF Multi-Agent Workflow

```
STEP 1 [0.8s]  INITIALIZATION
               Lead Medical Orchestrator activates Group Chat

STEP 2 [1.0s]  DOCUMENT OCR (Legacy Records Agent)
               Mistral OCR 4.0 & Azure AI Content Understanding
               Digitize scanned PDF discharge notes & handwriting

STEP 3 [1.0s]  CLINICAL NLP (Clinical NLP Agent)
               Azure AI Language (Text Analytics for Health)
               Extract UMLS CUIs (C0010054) & ICD-10-CM (I25.10 CAD)

STEP 4 [1.2s]  PATIENT ILLUSTRATION SYNTHESIS (Medical Illustrator Agent)
               FLUX.2-pro / gpt-image-2 (Text-to-Image)
               Generate non-intimidating, flat-vector anatomical heart diagram

STEP 5 [3-8s]  DEEPSEEK MYAGENT REASONING
               DeepSeek-V3.2-Speciale via Azure AI Foundry
               Synthesizes OCR + NLP + FLUX.2-pro illustration prompt into clinical package

STEP 6 [1.0s]  RAG RETRIEVAL
               Azure AI Search queries AHA Visual Aids & Health Literacy Guidelines

STEP 7 [0.5s]  SAFETY GUARDRAIL
               Azure Safety Middleware inspects outputs (EU AI Act & GDPR Art. 9)

STEP 8 [WAIT]  HITL PHYSICIAN VERIFICATION & PATIENT PORTAL COMMIT
               Physician reviews digitized record + visual diagram -> APPROVE & SHARE
```

---

## 5. JSON Output Schema & Cosmos DB Audit Record

```json
{
  "audit_id": "AUDIT-1785773039597",
  "patient_id": "PX-8810",
  "physician_id": "DR-ARIS-992",
  "eu_ai_act_classification": "Low-Risk Patient Education CDSS",
  "compliance_status": "HITL_APPROVED",
  "agent_conclusions": {
    "primary_diagnosis": "Coronary Artery Disease (CAD - 85% Proximal LAD Stenosis)",
    "icd10_code": "I25.10",
    "umls_cui": "C0010054",
    "digitized_summary": "Patient Nikos Mavros (58y) presented with exertional angina. Angiography confirmed 85% proximal LAD stenosis. Prescribed dual antiplatelet therapy.",
    "patient_education_summary": "Your heart receives blood through small arteries. One of these main arteries (the LAD) has an 85% blockage restricting blood flow, causing chest tightness when exercising.",
    "illustration_prompt": "Create a simple, non-intimidating, flat-vector medical illustration of a human heart showing a blocked coronary artery, suitable for patient education, clean white background",
    "illustration_status": "FLUX.2-pro Visual Diagram Generated",
    "confidence_score": 0.985,
    "model_source": "DeepSeek-V3.2-Speciale + Mistral OCR 4.0 + FLUX.2-pro"
  },
  "physician_notes": "APPROVE: Share visual diagram with patient in portal",
  "created_at": "2026-08-05T18:05:00Z",
  "is_immutable": true
}
```

---

## 6. Clinical Demo Walkthrough

### Case Study: PX-8810 (Coronary Artery Disease - Scanned Discharge PDF)

1. Open http://localhost:5173
2. Navigate to DIAGNOSTIC UPLOAD (Diagnostic Upload tab)
3. Click quick preset: **PX-8810: Στεφανιαία Νόσος (Scanned Discharge Summary PDF / CAD)**
   - Patient: 58yo Male, Nikos Mavros / ID: PX-8810
   - Scanned Record: Angiography report detailing 85% proximal LAD artery blockage.
4. Click **ΕΝΑΡΞΗ ΔΙΑΓΝΩΣΤΙΚΗΣ ΑΝΑΛΥΣΗΣ (MULTI-AGENT)**
5. Navigate to **AGENT FEEDS** - watch live SSE stream:
   - Lead Orchestrator initializes Group Chat
   - Legacy Records Agent runs **Mistral OCR 4.0** (98.5% confidence)
   - Clinical NLP Agent extracts UMLS `C0010054` and ICD-10 `I25.10`
   - Medical Illustrator Agent prompts **FLUX.2-pro**: *"Create a simple, non-intimidating, flat-vector medical illustration of a human heart showing a blocked coronary artery..."*
   - RAG retrieval fetches AHA Visual Aids Guidelines
   - Safety Middleware verifies compliance
   - Pipeline PAUSES for physician review
6. Navigate to **SUPERVISORY HITL** panel:
   - Review digitized record & FLUX.2-pro illustration prompt
   - Click **ΕΓΚΡΙΣΗ & ΚΟΙΝΟΠΟΙΗΣΗ ΣТОΝ ΑΣΘΕΝΗ**
7. Audit record `AUDIT-{timestamp}` committed to Azure Cosmos DB.

---

## License

MIT License - Research and Educational Use only.

---

OmniHealth AI v2.0 - Built on Microsoft Azure AI Foundry & Multi-Model Suite
Mistral OCR 4.0 | FLUX.2-pro | DeepSeek-V3.2-Speciale | FastAPI | React 18
"""

with open(README_PATH, "w", encoding="utf-8") as f:
    f.write(README)

print(f"README.md written successfully: {len(README):,} bytes -> {README_PATH}")
