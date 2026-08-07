import os
import sys
import json
import base64

sys.stdout.reconfigure(encoding="utf-8")

usecase_images_dir = os.path.join(os.getcwd(), "usecase_outputs")

patients_ids = ['PX-8810', 'PX-8811', 'PX-8812', 'PX-8813', 'PX-8814', 'PX-8815', 'PX-8816', 'PX-8817', 'PX-8818', 'PX-8819', 'PX-8888']

b64_data = {}
for pid in patients_ids:
    fname = f"{pid}_FLUX2_Illustration.png"
    p_path = os.path.join(usecase_images_dir, fname)
    if os.path.exists(p_path):
        with open(p_path, "rb") as f:
            b64_data[pid] = base64.b64encode(f.read()).decode("utf-8")
        print(f"Loaded {pid} live FLUX image ({os.path.getsize(p_path)} bytes)")
    else:
        print(f"Warning: {fname} not found!")

api_path = os.path.join(os.getcwd(), "core", "api.py")
with open(api_path, "r", encoding="utf-8") as f:
    content = f.read()

# Update patient_database dictionary in api.py
db_start = content.find("patient_database: Dict[str, Dict[str, Any]] = {")
db_end = content.find("class ApprovalRequest(BaseModel):")

if db_start != -1 and db_end != -1:
    # Extract current patient_database code and inject b64_json field for each patient
    db_block = content[db_start:db_end]
    
    # We will rebuild patient_database with new b64_json values
    new_db = "patient_database: Dict[str, Dict[str, Any]] = {\n"
    
    patient_meta = {
        "PX-8810": { "name": "Nikos Mavros", "age": 58, "gender": "Male", "type": "SCANNED DISCHARGE SUMMARY (PDF)", "diag": "Coronary Artery Disease (CAD - 85% Proximal LAD Stenosis)", "icd10": "I25.10", "cui": "C0010054", "summary": "Angiography confirmed 85% proximal LAD stenosis. Exertional angina.", "prompt": "Create a simple, non-intimidating, flat-vector medical illustration of a human heart showing a blocked coronary artery, suitable for patient education, clean white background" },
        "PX-8811": { "name": "Elena Dimou", "age": 42, "gender": "Female", "type": "HANDWRITTEN REFERRAL NOTE", "diag": "Lumbar Disc Displacement / L5-S1 Herniation", "icd10": "M51.26", "cui": "C0020440", "summary": "Radicular pain L5 distribution. MRI lumbar spine confirms herniation.", "prompt": "Create a simple, non-intimidating, flat-vector medical illustration of a human lumbar spine showing an L5-S1 herniated disc pressing on a nerve root, suitable for patient education, clean white background" },
        "PX-8812": { "name": "Christos Papanikolaou", "age": 65, "gender": "Male", "type": "SCANNED LAB & CLINICAL REPORT", "diag": "Type 2 Diabetes Mellitus with Peripheral Neuropathy", "icd10": "E11.40", "cui": "C0011860", "summary": "HbA1c 8.6%, distal sensory polyneuropathy in bilateral lower extremities.", "prompt": "Create a simple, non-intimidating, flat-vector medical illustration of peripheral nerve fibers in the foot showing blood flow and glucose impact, suitable for patient education, clean white background" },
        "PX-8813": { "name": "George Vassiliou", "age": 62, "gender": "Male", "type": "HRCT CHEST SCAN REPORT", "diag": "COPD Exacerbation & Bronchial Emphysema", "icd10": "J44.1", "cui": "C0024117", "summary": "FEV1/FVC 58%. HRCT chest shows hyperinflation and bilateral emphysematous bullae.", "prompt": "Create a simple, non-intimidating, flat-vector medical illustration of human bronchial airways and alveoli showing airflow in COPD emphysema, suitable for patient education, clean white background" },
        "PX-8814": { "name": "Maria Karrathana", "age": 39, "gender": "Female", "type": "OUTPATIENT CLINIC NOTE", "diag": "Essential Primary Hypertension with LV Hypertrophy", "icd10": "I10", "cui": "C0020538", "summary": "BP 165/102 mmHg. Echocardiogram confirms mild left ventricular hypertrophy.", "prompt": "Create a simple, non-intimidating, flat-vector medical illustration of human vascular arteries showing blood pressure resistance and heart muscle workload, suitable for patient education, clean white background" },
        "PX-8815": { "name": "Stefanos Kostopoulos", "age": 51, "gender": "Male", "type": "RENAL PANEL LAB REPORT", "diag": "Chronic Kidney Disease Stage 3 (CKD)", "icd10": "N18.3", "cui": "C0022658", "summary": "Serum creatinine 2.1 mg/dL, eGFR 44 mL/min/1.73m2, proteinuria 450 mg/24h.", "prompt": "Create a simple, non-intimidating, flat-vector medical illustration of human kidneys showing blood filtration and nephron unit function, suitable for patient education, clean white background" },
        "PX-8816": { "name": "Sophia Alexiou", "age": 47, "gender": "Female", "type": "NEUROLOGY OUTPATIENT REFERRAL", "diag": "Primary Vascular Headache / Chronic Migraine", "icd10": "G43.90", "cui": "C0025202", "summary": "Throbbing unilateral headache with photophobia and nausea. Brain MRI normal.", "prompt": "Create a simple, non-intimidating, flat-vector medical illustration of cranial nerve pathways and blood vessel dilation in migraine, suitable for patient education, clean white background" },
        "PX-8817": { "name": "Ioannis Antoniou", "age": 71, "gender": "Male", "type": "ORTHOPEDIC X-RAY REPORT", "diag": "Primary Knee Osteoarthritis", "icd10": "M17.9", "cui": "C0029408", "summary": "Bilateral knee joint stiffness, medial joint space narrowing, subchondral sclerosis.", "prompt": "Create a simple, non-intimidating, flat-vector medical illustration of a human knee joint showing cartilage layer and joint space, suitable for patient education, clean white background" },
        "PX-8818": { "name": "Anna Papageorgiou", "age": 34, "gender": "Female", "type": "ER DISCHARGE SUMMARY", "diag": "Acute Bronchial Pneumonia", "icd10": "J18.9", "cui": "C0032285", "summary": "Fever 38.9C, productive cough, right lower lobe opacity on chest X-ray.", "prompt": "Create a simple, non-intimidating, flat-vector medical illustration of lung bronchus and fluid-filled alveoli in pneumonia, suitable for patient education, clean white background" },
        "PX-8819": { "name": "Eleni Papadaki", "age": 36, "gender": "Female", "type": "LUMBAR MRI SCAN PDF", "diag": "Acute L4-L5 Lumbar Disc Extrusion with Radiculopathy", "icd10": "M51.16", "cui": "C0020440", "summary": "7mm L4-L5 disc extrusion with right L4 nerve root compression. Severe radicular pain.", "prompt": "Create a simple, non-intimidating, flat-vector medical illustration of human lumbar L4-L5 vertebrae showing disc extrusion pressing on L4 nerve root, suitable for patient education, clean white background" },
        "PX-8888": { "name": "Filippos-Paraskevas (Philip) Zygouris", "age": 24, "gender": "Male", "type": "MYOFASCIAL CLINICAL REPORT", "diag": "Masticatory Myalgia & Jaw Muscle Strain", "icd10": "M79.1", "cui": "C0026848", "summary": "Pain and fatigue in masseter and temporalis muscles. Prolonged static posture and bruxism.", "prompt": "Create a simple, non-intimidating, flat-vector medical illustration of the human head, jaw, and masseter temporalis masticatory muscles showing myofascial strain areas, suitable for patient education, clean white background" }
    }
    
    for pid, meta in patient_meta.items():
        img_b64 = b64_data.get(pid, "")
        new_db += f"""    "{pid}": {{
        "id": "{pid}",
        "name": "{meta['name']}",
        "age": {meta['age']},
        "gender": "{meta['gender']}",
        "type": "{meta['type']}",
        "ai_progress": 100,
        "status": "APPROVED",
        "diagnosis": "{meta['diag']}",
        "icd10_code": "{meta['icd10']}",
        "umls_cui": "{meta['cui']}",
        "digitized_summary": "{meta['summary']}",
        "illustration_prompt": "{meta['prompt']}",
        "illustration_status": "FLUX.2-pro Visual Diagram Generated",
        "b64_json": "{img_b64}",
        "confidence": 98.5,
        "timestamp": "2026-08-07T18:05:00Z"
    }},\n"""
    new_db += "}"
    
    final_content = content[:db_start] + new_db + "\n\n" + content[db_end:]
    with open(api_path, "w", encoding="utf-8") as f:
        f.write(final_content)
    print("✅ Successfully updated patient_database in core/api.py with all live FLUX.2-pro Base64 images!")
else:
    print("❌ Failed to find patient_database block in core/api.py")
