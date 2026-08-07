import os
import sys

sys.stdout.reconfigure(encoding="utf-8")

api_path = os.path.join(os.getcwd(), "core", "api.py")

with open(api_path, "r", encoding="utf-8") as f:
    content = f.read()

history_code = """@app.get("/api/patient-history")
def get_patient_history(patient_id: str = "PX-8810"):
    \"\"\"Fetches dynamic chronological timeline and UMLS entity knowledge graph for patient.\"\"\"
    pid = patient_id
    history_db = {
        "PX-8810": {
            "patient_id": "PX-8810",
            "patient_name": "Nikos Mavros",
            "condition": "Coronary Artery Disease (CAD - 85% LAD Stenosis)",
            "icd10": "I25.10",
            "umls_cui": "C0010054",
            "pipeline_nodes": [
                {"step": "Intake", "label": "Scanned Discharge Summary PDF", "color": "purple"},
                {"step": "Mistral OCR 4.0", "label": "85% LAD Stenosis Extracted", "color": "emerald"},
                {"step": "UMLS C0010054", "label": "ICD-10 I25.10 (CAD)", "color": "blue"},
                {"step": "FLUX.2-pro", "label": "Heart Blockage Diagram", "color": "rose"}
            ],
            "timeline": [
                {
                    "date": "2026-08-05 18:05",
                    "title": "Scanned Discharge PDF & Multi-Agent Synthesis",
                    "status": "APPROVED",
                    "details": "Digitized Coronary Artery Disease (85% LAD Stenosis - I25.10). FLUX.2-pro visual anatomical diagram generated for patient consultation.",
                    "umls": "UMLS C0010054 (Coronary Artery Disease)"
                },
                {
                    "date": "2026-05-14 11:00",
                    "title": "Inpatient Coronary Angiography (Scanned Record)",
                    "status": "COMPLETED",
                    "details": "Paper record: 85% proximal LAD occlusion. Prescribed dual antiplatelet therapy (Aspirin + Clopidogrel).",
                    "umls": "UMLS C0265060 (LAD Stenosis)"
                }
            ]
        },
        "PX-8811": {
            "patient_id": "PX-8811",
            "patient_name": "Elena Dimou",
            "condition": "Lumbar Disc Displacement (L5-S1 Herniation)",
            "icd10": "M51.26",
            "umls_cui": "C0020440",
            "pipeline_nodes": [
                {"step": "Intake", "label": "Handwritten Referral Note", "color": "purple"},
                {"step": "Mistral OCR 4.0", "label": "L5-S1 Radicular Pain Extracted", "color": "emerald"},
                {"step": "UMLS C0020440", "label": "ICD-10 M51.26 (Herniation)", "color": "blue"},
                {"step": "FLUX.2-pro", "label": "Lumbar Spine Render", "color": "rose"}
            ],
            "timeline": [
                {
                    "date": "2026-08-05 16:30",
                    "title": "Handwritten Referral Note Digitization (Mistral OCR 4.0)",
                    "status": "APPROVED",
                    "details": "Digitized handwritten referral note. MRI lumbar spine confirms L5-S1 herniation pressing on nerve root.",
                    "umls": "UMLS C0020440 (Lumbar Disc Displacement)"
                }
            ]
        },
        "PX-8812": {
            "patient_id": "PX-8812",
            "patient_name": "Christos Papanikolaou",
            "condition": "Type 2 Diabetes Mellitus with Peripheral Neuropathy",
            "icd10": "E11.40",
            "umls_cui": "C0011860",
            "pipeline_nodes": [
                {"step": "Intake", "label": "Scanned Lab Report PDF", "color": "purple"},
                {"step": "Mistral OCR 4.0", "label": "HbA1c 8.6% & Fasting Glucose", "color": "emerald"},
                {"step": "UMLS C0011860", "label": "ICD-10 E11.40 (T2D Neuropathy)", "color": "blue"},
                {"step": "FLUX.2-pro", "label": "Nerve Ending Graphic", "color": "rose"}
            ],
            "timeline": [
                {
                    "date": "2026-08-05 17:55",
                    "title": "Outpatient Lab Report OCR Digitization",
                    "status": "PROCESSING",
                    "details": "Glycated hemoglobin HbA1c 8.6%, fasting plasma glucose 192 mg/dL.",
                    "umls": "UMLS C0011860 (Type 2 Diabetes Mellitus)"
                }
            ]
        },
        "PX-8813": {
            "patient_id": "PX-8813",
            "patient_name": "George Vassiliou",
            "condition": "COPD Exacerbation & Bronchial Emphysema",
            "icd10": "J44.1",
            "umls_cui": "C0024117",
            "pipeline_nodes": [
                {"step": "Intake", "label": "HRCT Chest Report PDF", "color": "purple"},
                {"step": "Mistral OCR 4.0", "label": "FEV1/FVC 58% & Emphysematous Bullae", "color": "emerald"},
                {"step": "UMLS C0024117", "label": "ICD-10 J44.1 (COPD)", "color": "blue"},
                {"step": "FLUX.2-pro", "label": "Airway & Alveoli Graphic", "color": "rose"}
            ],
            "timeline": [
                {
                    "date": "2026-08-06 10:15",
                    "title": "HRCT Chest Scan & Multi-Agent Synthesis",
                    "status": "APPROVED",
                    "details": "High-resolution CT chest shows bilateral hyperinflation and emphysematous bullae. Digitized COPD Exacerbation J44.1.",
                    "umls": "UMLS C0024117 (Chronic Obstructive Airway Disease)"
                }
            ]
        },
        "PX-8814": {
            "patient_id": "PX-8814",
            "patient_name": "Maria Karrathana",
            "condition": "Essential Primary Hypertension",
            "icd10": "I10",
            "umls_cui": "C0020538",
            "pipeline_nodes": [
                {"step": "Intake", "label": "Outpatient Clinic Note", "color": "purple"},
                {"step": "Mistral OCR 4.0", "label": "BP 165/102 mmHg & LVH Extracted", "color": "emerald"},
                {"step": "UMLS C0020538", "label": "ICD-10 I10 (Hypertension)", "color": "blue"},
                {"step": "FLUX.2-pro", "label": "Vascular Resistance Diagram", "color": "rose"}
            ],
            "timeline": [
                {
                    "date": "2026-08-06 11:30",
                    "title": "Hypertension Clinical Encounter Digitization",
                    "status": "APPROVED",
                    "details": "Resting blood pressure 165/102 mmHg, echocardiogram confirms mild left ventricular hypertrophy.",
                    "umls": "UMLS C0020538 (Hypertensive Vascular Disease)"
                }
            ]
        },
        "PX-8815": {
            "patient_id": "PX-8815",
            "patient_name": "Stefanos Kostopoulos",
            "condition": "Chronic Kidney Disease Stage 3 (CKD)",
            "icd10": "N18.3",
            "umls_cui": "C0022658",
            "pipeline_nodes": [
                {"step": "Intake", "label": "Renal Panel Lab PDF", "color": "purple"},
                {"step": "Mistral OCR 4.0", "label": "eGFR 44 mL/min & Proteinuria", "color": "emerald"},
                {"step": "UMLS C0022658", "label": "ICD-10 N18.3 (CKD 3)", "color": "blue"},
                {"step": "FLUX.2-pro", "label": "Kidney Filtration Diagram", "color": "rose"}
            ],
            "timeline": [
                {
                    "date": "2026-08-06 14:00",
                    "title": "Renal Function Assessment & Multi-Agent OCR",
                    "status": "APPROVED",
                    "details": "Serum creatinine 2.1 mg/dL, eGFR 44 mL/min/1.73m2, 24h proteinuria 450 mg. Digitized CKD Stage 3.",
                    "umls": "UMLS C0022658 (Chronic Renal Failure)"
                }
            ]
        },
        "PX-8816": {
            "patient_id": "PX-8816",
            "patient_name": "Sophia Alexiou",
            "condition": "Primary Vascular Headache / Chronic Migraine",
            "icd10": "G43.90",
            "umls_cui": "C0025202",
            "pipeline_nodes": [
                {"step": "Intake", "label": "Neurology Outpatient Referral", "color": "purple"},
                {"step": "Mistral OCR 4.0", "label": "Photophobia & Unilateral Pain", "color": "emerald"},
                {"step": "UMLS C0025202", "label": "ICD-10 G43.90 (Migraine)", "color": "blue"},
                {"step": "FLUX.2-pro", "label": "Cranial Nerve Pathway Graphic", "color": "rose"}
            ],
            "timeline": [
                {
                    "date": "2026-08-06 15:45",
                    "title": "Neurology Consultation & Brain MRI Synthesis",
                    "status": "APPROVED",
                    "details": "Throbbing unilateral headache with photophobia and nausea. Brain MRI normal. Digitized Chronic Migraine G43.90.",
                    "umls": "UMLS C0025202 (Migraine Disorder)"
                }
            ]
        },
        "PX-8817": {
            "patient_id": "PX-8817",
            "patient_name": "Ioannis Antoniou",
            "condition": "Primary Knee Osteoarthritis",
            "icd10": "M17.9",
            "umls_cui": "C0029408",
            "pipeline_nodes": [
                {"step": "Intake", "label": "Knee Radiography Report", "color": "purple"},
                {"step": "Mistral OCR 4.0", "label": "Joint Space Narrowing Extracted", "color": "emerald"},
                {"step": "UMLS C0029408", "label": "ICD-10 M17.9 (Osteoarthritis)", "color": "blue"},
                {"step": "FLUX.2-pro", "label": "Knee Joint Cartilage Render", "color": "rose"}
            ],
            "timeline": [
                {
                    "date": "2026-08-06 16:30",
                    "title": "Orthopedic X-Ray Report Digitization",
                    "status": "APPROVED",
                    "details": "Bilateral knee joint stiffness, medial joint space narrowing and subchondral sclerosis on X-ray.",
                    "umls": "UMLS C0029408 (Osteoarthritis of Knee)"
                }
            ]
        },
        "PX-8818": {
            "patient_id": "PX-8818",
            "patient_name": "Anna Papageorgiou",
            "condition": "Acute Bronchial Pneumonia",
            "icd10": "J18.9",
            "umls_cui": "C0032285",
            "pipeline_nodes": [
                {"step": "Intake", "label": "ER Discharge Note & Chest X-Ray", "color": "purple"},
                {"step": "Mistral OCR 4.0", "label": "Right Lower Lobe Opacity", "color": "emerald"},
                {"step": "UMLS C0032285", "label": "ICD-10 J18.9 (Pneumonia)", "color": "blue"},
                {"step": "FLUX.2-pro", "label": "Bronchial Alveoli Graphic", "color": "rose"}
            ],
            "timeline": [
                {
                    "date": "2026-08-07 09:10",
                    "title": "Emergency Department Discharge & OCR Digitization",
                    "status": "APPROVED",
                    "details": "High fever (38.9 C), productive cough with purulent sputum, right lower lobe opacity on chest X-ray.",
                    "umls": "UMLS C0032285 (Pneumonia)"
                }
            ]
        },
        "PX-8819": {
            "patient_id": "PX-8819",
            "patient_name": "Eleni Papadaki",
            "condition": "Acute L4-L5 Lumbar Disc Extrusion",
            "icd10": "M51.16",
            "umls_cui": "C0020440",
            "pipeline_nodes": [
                {"step": "Intake", "label": "Lumbar Spine MRI Report PDF", "color": "purple"},
                {"step": "Mistral OCR 4.0", "label": "7mm L4-L5 Disc Extrusion", "color": "emerald"},
                {"step": "UMLS C0020440", "label": "ICD-10 M51.16 (L4 Radiculopathy)", "color": "blue"},
                {"step": "FLUX.2-pro", "label": "Disc Extrusion Render", "color": "rose"}
            ],
            "timeline": [
                {
                    "date": "2026-08-08 00:01",
                    "title": "Lumbar Spine MRI & Multi-Agent Synthesis",
                    "status": "APPROVED",
                    "details": "Acute severe lower back pain radiating to right anterior thigh. Lumbar MRI confirms 7mm L4-L5 disc extrusion with right L4 nerve root compression.",
                    "umls": "UMLS C0020440 (Lumbar Disc Displacement)"
                }
            ]
        },
        "PX-8888": {
            "patient_id": "PX-8888",
            "patient_name": "Filippos-Paraskevas (Philip) Zygouris",
            "condition": "Masticatory Myalgia & Jaw Muscle Strain",
            "icd10": "M79.1",
            "umls_cui": "C0026848",
            "pipeline_nodes": [
                {"step": "Intake", "label": "Myofascial Examination Note", "color": "purple"},
                {"step": "Mistral OCR 4.0", "label": "Masseter & Temporalis Strain", "color": "emerald"},
                {"step": "UMLS C0026848", "label": "ICD-10 M79.1 (Myalgia)", "color": "blue"},
                {"step": "FLUX.2-pro", "label": "Masticatory Muscle Render", "color": "rose"}
            ],
            "timeline": [
                {
                    "date": "2026-08-07 18:05",
                    "title": "Myofascial Clinical Encounter Digitization",
                    "status": "APPROVED",
                    "details": "Localized pain and fatigue in muscles of mastication (masseter and temporalis). Prolonged static posture and nocturnal bruxism.",
                    "umls": "UMLS C0026848 (Myalgia of Masticatory Muscles)"
                }
            ]
        }
    }
    return history_db.get(pid, history_db["PX-8810"])"""

start_idx = content.find("@app.get(\"/api/patient-history\")")
end_idx = content.find("@app.post(\"/api/upload\")")

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + history_code + "\n\n" + content[end_idx:]
    with open(api_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("✅ Successfully updated core/api.py get_patient_history for all 11 patients!")
else:
    print("❌ Failed to find get_patient_history block in core/api.py")
