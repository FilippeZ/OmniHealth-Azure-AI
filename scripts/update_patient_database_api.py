import os
import sys

sys.stdout.reconfigure(encoding="utf-8")

api_path = os.path.join(os.getcwd(), "core", "api.py")

with open(api_path, "r", encoding="utf-8") as f:
    content = f.read()

db_code = """patient_database: Dict[str, Dict[str, Any]] = {
    "PX-8810": {
        "id": "PX-8810",
        "name": "Nikos Mavros",
        "age": 58,
        "gender": "Male",
        "type": "SCANNED DISCHARGE SUMMARY (PDF)",
        "ai_progress": 100,
        "status": "APPROVED",
        "diagnosis": "Coronary Artery Disease (CAD - 85% Proximal LAD Stenosis)",
        "icd10_code": "I25.10",
        "umls_cui": "C0010054",
        "digitized_summary": "Angiography confirmed 85% proximal LAD stenosis. Exertional angina.",
        "illustration_status": "FLUX.2-pro Visual Diagram Generated",
        "confidence": 98.5,
        "timestamp": "2026-08-05T18:00:00Z"
    },
    "PX-8811": {
        "id": "PX-8811",
        "name": "Elena Dimou",
        "age": 42,
        "gender": "Female",
        "type": "HANDWRITTEN REFERRAL NOTE",
        "ai_progress": 100,
        "status": "APPROVED",
        "diagnosis": "Lumbar Disc Displacement / L5-S1 Herniation",
        "icd10_code": "M51.26",
        "umls_cui": "C0020440",
        "digitized_summary": "Radicular pain L5 distribution. MRI lumbar spine confirms herniation.",
        "illustration_status": "FLUX.2-pro Visual Diagram Generated",
        "confidence": 96.2,
        "timestamp": "2026-08-05T16:30:00Z"
    },
    "PX-8812": {
        "id": "PX-8812",
        "name": "Christos Papanikolaou",
        "age": 65,
        "gender": "Male",
        "type": "SCANNED LAB & CLINICAL REPORT",
        "ai_progress": 100,
        "status": "APPROVED",
        "diagnosis": "Type 2 Diabetes Mellitus with Peripheral Neuropathy",
        "icd10_code": "E11.40",
        "umls_cui": "C0011860",
        "digitized_summary": "HbA1c 8.6%, distal sensory polyneuropathy in bilateral lower extremities.",
        "illustration_status": "FLUX.2-pro Visual Diagram Generated",
        "confidence": 95.8,
        "timestamp": "2026-08-05T17:55:00Z"
    },
    "PX-8813": {
        "id": "PX-8813",
        "name": "George Vassiliou",
        "age": 62,
        "gender": "Male",
        "type": "HRCT CHEST SCAN REPORT",
        "ai_progress": 100,
        "status": "APPROVED",
        "diagnosis": "COPD Exacerbation & Bronchial Emphysema",
        "icd10_code": "J44.1",
        "umls_cui": "C0024117",
        "digitized_summary": "FEV1/FVC 58%. HRCT chest shows hyperinflation and bilateral emphysematous bullae.",
        "illustration_status": "FLUX.2-pro Visual Diagram Generated",
        "confidence": 97.4,
        "timestamp": "2026-08-06T10:15:00Z"
    },
    "PX-8814": {
        "id": "PX-8814",
        "name": "Maria Karrathana",
        "age": 39,
        "gender": "Female",
        "type": "OUTPATIENT CLINIC NOTE",
        "ai_progress": 100,
        "status": "APPROVED",
        "diagnosis": "Essential Primary Hypertension with LV Hypertrophy",
        "icd10_code": "I10",
        "umls_cui": "C0020538",
        "digitized_summary": "BP 165/102 mmHg. Echocardiogram confirms mild left ventricular hypertrophy.",
        "illustration_status": "FLUX.2-pro Visual Diagram Generated",
        "confidence": 98.9,
        "timestamp": "2026-08-06T11:30:00Z"
    },
    "PX-8815": {
        "id": "PX-8815",
        "name": "Stefanos Kostopoulos",
        "age": 51,
        "gender": "Male",
        "type": "RENAL PANEL LAB REPORT",
        "ai_progress": 100,
        "status": "APPROVED",
        "diagnosis": "Chronic Kidney Disease Stage 3 (CKD)",
        "icd10_code": "N18.3",
        "umls_cui": "C0022658",
        "digitized_summary": "Serum creatinine 2.1 mg/dL, eGFR 44 mL/min/1.73m2, proteinuria 450 mg/24h.",
        "illustration_status": "FLUX.2-pro Visual Diagram Generated",
        "confidence": 98.1,
        "timestamp": "2026-08-06T14:00:00Z"
    },
    "PX-8816": {
        "id": "PX-8816",
        "name": "Sophia Alexiou",
        "age": 47,
        "gender": "Female",
        "type": "NEUROLOGY OUTPATIENT REFERRAL",
        "ai_progress": 100,
        "status": "APPROVED",
        "diagnosis": "Primary Vascular Headache / Chronic Migraine",
        "icd10_code": "G43.90",
        "umls_cui": "C0025202",
        "digitized_summary": "Throbbing unilateral headache with photophobia and nausea. Brain MRI normal.",
        "illustration_status": "FLUX.2-pro Visual Diagram Generated",
        "confidence": 96.7,
        "timestamp": "2026-08-06T15:45:00Z"
    },
    "PX-8817": {
        "id": "PX-8817",
        "name": "Ioannis Antoniou",
        "age": 71,
        "gender": "Male",
        "type": "ORTHOPEDIC X-RAY REPORT",
        "ai_progress": 100,
        "status": "APPROVED",
        "diagnosis": "Primary Knee Osteoarthritis",
        "icd10_code": "M17.9",
        "umls_cui": "C0029408",
        "digitized_summary": "Bilateral knee joint stiffness, medial joint space narrowing, subchondral sclerosis.",
        "illustration_status": "FLUX.2-pro Visual Diagram Generated",
        "confidence": 97.8,
        "timestamp": "2026-08-06T16:30:00Z"
    },
    "PX-8818": {
        "id": "PX-8818",
        "name": "Anna Papageorgiou",
        "age": 34,
        "gender": "Female",
        "type": "ER DISCHARGE SUMMARY",
        "ai_progress": 100,
        "status": "APPROVED",
        "diagnosis": "Acute Bronchial Pneumonia",
        "icd10_code": "J18.9",
        "umls_cui": "C0032285",
        "digitized_summary": "Fever 38.9C, productive cough, right lower lobe opacity on chest X-ray.",
        "illustration_status": "FLUX.2-pro Visual Diagram Generated",
        "confidence": 98.6,
        "timestamp": "2026-08-07T09:10:00Z"
    },
    "PX-8819": {
        "id": "PX-8819",
        "name": "Eleni Papadaki",
        "age": 36,
        "gender": "Female",
        "type": "LUMBAR MRI SCAN PDF",
        "ai_progress": 100,
        "status": "APPROVED",
        "diagnosis": "Acute L4-L5 Lumbar Disc Extrusion with Radiculopathy",
        "icd10_code": "M51.16",
        "umls_cui": "C0020440",
        "digitized_summary": "7mm L4-L5 disc extrusion with right L4 nerve root compression. Severe radicular pain.",
        "illustration_status": "FLUX.2-pro Visual Diagram Generated",
        "confidence": 99.1,
        "timestamp": "2026-08-08T00:01:00Z"
    },
    "PX-8888": {
        "id": "PX-8888",
        "name": "Filippos-Paraskevas (Philip) Zygouris",
        "age": 24,
        "gender": "Male",
        "type": "MYOFASCIAL CLINICAL REPORT",
        "ai_progress": 100,
        "status": "APPROVED",
        "diagnosis": "Masticatory Myalgia & Jaw Muscle Strain",
        "icd10_code": "M79.1",
        "umls_cui": "C0026848",
        "digitized_summary": "Pain and fatigue in masseter and temporalis muscles. Prolonged static posture and bruxism.",
        "illustration_status": "FLUX.2-pro Visual Diagram Generated",
        "confidence": 98.5,
        "timestamp": "2026-08-07T18:05:00Z"
    }
}"""

start_idx = content.find("patient_database: Dict[str, Dict[str, Any]] = {")
end_idx = content.find("class ApprovalRequest(BaseModel):")

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + db_code + "\n\n" + content[end_idx:]
    with open(api_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("✅ Successfully updated patient_database in core/api.py for all 11 patients!")
else:
    print("❌ Failed to find patient_database dictionary in core/api.py")
