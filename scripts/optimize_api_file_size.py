import os
import sys

sys.stdout.reconfigure(encoding="utf-8")

api_path = os.path.join(os.getcwd(), "core", "api.py")

with open(api_path, "r", encoding="utf-8") as f:
    content = f.read()

clean_patient_db = '''def get_image_b64(pid: str) -> str:
    path_new = os.path.join(os.getcwd(), "usecase_outputs", f"{pid}_FLUX2_Illustration_NEW.png")
    path_norm = os.path.join(os.getcwd(), "usecase_outputs", f"{pid}_FLUX2_Illustration.png")
    target = path_new if os.path.exists(path_new) else path_norm
    if os.path.exists(target):
        with open(target, "rb") as f:
            return base64.b64encode(f.read()).decode("utf-8")
    return ""

patient_database: Dict[str, Dict[str, Any]] = {
    "PX-8810": {
        "id": "PX-8810", "name": "Nikos Mavros", "age": 58, "gender": "Male",
        "type": "SCANNED DISCHARGE SUMMARY (PDF)", "ai_progress": 100, "status": "APPROVED",
        "diagnosis": "Coronary Artery Disease (CAD - 85% Proximal LAD Stenosis)",
        "icd10_code": "I25.10", "umls_cui": "C0010054",
        "digitized_summary": "PATIENT: Mavros Nikos | AGE: 58 | ADMISSION: 2026-05-14. Clinical summary: Patient presented with exertional angina and shortness of breath. Coronary angiography revealed 85% proximal LAD artery stenosis. Diagnosis: Atherosclerotic Heart Disease (CAD).",
        "illustration_prompt": "Create a simple, non-intimidating, flat-vector medical illustration of a human heart showing a blocked coronary artery, suitable for patient education, clean white background",
        "illustration_status": "FLUX.2-pro Visual Diagram Generated",
        "b64_json": get_image_b64("PX-8810"), "confidence": 98.5, "timestamp": "2026-08-05T18:00:00Z"
    },
    "PX-8811": {
        "id": "PX-8811", "name": "Elena Dimou", "age": 42, "gender": "Female",
        "type": "HANDWRITTEN REFERRAL NOTE", "ai_progress": 100, "status": "APPROVED",
        "diagnosis": "Lumbar Disc Displacement / L5-S1 Herniation",
        "icd10_code": "M51.26", "umls_cui": "C0020440",
        "digitized_summary": "PATIENT: Dimou Elena | AGE: 42. Handwritten referral note: Severe low back pain radiating to left leg (L5 distribution) for 3 weeks. MRI lumbar spine confirms L5-S1 herniation pressing on nerve root.",
        "illustration_prompt": "Create a simple, non-intimidating, flat-vector medical illustration of a human lumbar spine showing an L5-S1 herniated disc pressing on a nerve root, suitable for patient education, clean white background",
        "illustration_status": "FLUX.2-pro Visual Diagram Generated",
        "b64_json": get_image_b64("PX-8811"), "confidence": 96.2, "timestamp": "2026-08-05T16:30:00Z"
    },
    "PX-8812": {
        "id": "PX-8812", "name": "Christos Papanikolaou", "age": 65, "gender": "Male",
        "type": "SCANNED LAB & CLINICAL REPORT", "ai_progress": 100, "status": "APPROVED",
        "diagnosis": "Type 2 Diabetes Mellitus with Peripheral Neuropathy",
        "icd10_code": "E11.40", "umls_cui": "C0011860",
        "digitized_summary": "PATIENT: Papanikolaou Christos | AGE: 65. Scanned lab & outpatient note: HbA1c 8.6%, fasting glucose 192 mg/dL. Distal sensory polyneuropathy symptoms in toes.",
        "illustration_prompt": "Create a simple, non-intimidating, flat-vector medical illustration of peripheral nerve fibers in the foot showing blood flow and glucose impact, suitable for patient education, clean white background",
        "illustration_status": "FLUX.2-pro Visual Diagram Generated",
        "b64_json": get_image_b64("PX-8812"), "confidence": 95.8, "timestamp": "2026-08-05T17:55:00Z"
    },
    "PX-8813": {
        "id": "PX-8813", "name": "George Vassiliou", "age": 62, "gender": "Male",
        "type": "HRCT CHEST SCAN REPORT", "ai_progress": 100, "status": "APPROVED",
        "diagnosis": "COPD Exacerbation & Bronchial Emphysema",
        "icd10_code": "J44.1", "umls_cui": "C0024117",
        "digitized_summary": "PATIENT: Vassiliou George | AGE: 62 | ADMISSION: 2026-07-02. Clinical summary: Progressive exertional dyspnea, chronic productive cough, FEV1/FVC 58%. CT chest shows hyperinflation and bilateral emphysematous bullae. Diagnosis: COPD (J44.1).",
        "illustration_prompt": "Create a simple, non-intimidating, flat-vector medical illustration of human bronchial airways and alveoli showing airflow in COPD emphysema, suitable for patient education, clean white background",
        "illustration_status": "FLUX.2-pro Visual Diagram Generated",
        "b64_json": get_image_b64("PX-8813"), "confidence": 97.4, "timestamp": "2026-08-06T10:15:00Z"
    },
    "PX-8814": {
        "id": "PX-8814", "name": "Maria Karrathana", "age": 39, "gender": "Female",
        "type": "OUTPATIENT CLINIC NOTE", "ai_progress": 100, "status": "APPROVED",
        "diagnosis": "Essential Primary Hypertension with LV Hypertrophy",
        "icd10_code": "I10", "umls_cui": "C0020538",
        "digitized_summary": "PATIENT: Karrathana Maria | AGE: 39 | ADMISSION: 2026-07-12. Clinical summary: Recurrent occipital headaches, resting blood pressure 165/102 mmHg. Echocardiogram shows mild left ventricular hypertrophy. Diagnosis: Essential Primary Hypertension (ICD-10: I10).",
        "illustration_prompt": "Create a simple, non-intimidating, flat-vector medical illustration of human vascular arteries showing blood pressure resistance and heart muscle workload, suitable for patient education, clean white background",
        "illustration_status": "FLUX.2-pro Visual Diagram Generated",
        "b64_json": get_image_b64("PX-8814"), "confidence": 98.9, "timestamp": "2026-08-06T11:30:00Z"
    },
    "PX-8815": {
        "id": "PX-8815", "name": "Stefanos Kostopoulos", "age": 51, "gender": "Male",
        "type": "RENAL PANEL LAB REPORT", "ai_progress": 100, "status": "APPROVED",
        "diagnosis": "Chronic Kidney Disease Stage 3 (CKD)",
        "icd10_code": "N18.3", "umls_cui": "C0022658",
        "digitized_summary": "PATIENT: Kostopoulos Stefanos | AGE: 51 | ADMISSION: 2026-07-18. Clinical summary: Serum creatinine 2.1 mg/dL, estimated GFR 44 mL/min/1.73m2, proteinuria 450 mg/24h. Diagnosis: Chronic Kidney Disease Stage 3 (CKD - ICD-10: N18.3).",
        "illustration_prompt": "Create a simple, non-intimidating, flat-vector medical illustration of human kidneys showing blood filtration and nephron unit function, suitable for patient education, clean white background",
        "illustration_status": "FLUX.2-pro Visual Diagram Generated",
        "b64_json": get_image_b64("PX-8815"), "confidence": 98.1, "timestamp": "2026-08-06T14:00:00Z"
    },
    "PX-8816": {
        "id": "PX-8816", "name": "Sophia Alexiou", "age": 47, "gender": "Female",
        "type": "NEUROLOGY OUTPATIENT REFERRAL", "ai_progress": 100, "status": "APPROVED",
        "diagnosis": "Primary Vascular Headache / Chronic Migraine",
        "icd10_code": "G43.90", "umls_cui": "C0025202",
        "digitized_summary": "PATIENT: Alexiou Sophia | AGE: 47 | ADMISSION: 2026-07-25. Clinical summary: Throbbing unilateral headache with photophobia and nausea lasting 24 hours. Neurological MRI brain normal. Diagnosis: Primary Vascular Headache / Chronic Migraine (ICD-10: G43.90).",
        "illustration_prompt": "Create a simple, non-intimidating, flat-vector medical illustration of cranial nerve pathways and blood vessel dilation in migraine, suitable for patient education, clean white background",
        "illustration_status": "FLUX.2-pro Visual Diagram Generated",
        "b64_json": get_image_b64("PX-8816"), "confidence": 96.7, "timestamp": "2026-08-06T15:45:00Z"
    },
    "PX-8817": {
        "id": "PX-8817", "name": "Ioannis Antoniou", "age": 71, "gender": "Male",
        "type": "ORTHOPEDIC X-RAY REPORT", "ai_progress": 100, "status": "APPROVED",
        "diagnosis": "Primary Knee Osteoarthritis",
        "icd10_code": "M17.9", "umls_cui": "C0029408",
        "digitized_summary": "PATIENT: Antoniou Ioannis | AGE: 71 | ADMISSION: 2026-07-29. Clinical summary: Bilateral knee joint stiffness, medial joint space narrowing, subchondral sclerosis on X-ray. Diagnosis: Primary Knee Osteoarthritis (ICD-10: M17.9).",
        "illustration_prompt": "Create a simple, non-intimidating, flat-vector medical illustration of a human knee joint showing cartilage layer and joint space, suitable for patient education, clean white background",
        "illustration_status": "FLUX.2-pro Visual Diagram Generated",
        "b64_json": get_image_b64("PX-8817"), "confidence": 97.8, "timestamp": "2026-08-06T16:30:00Z"
    },
    "PX-8818": {
        "id": "PX-8818", "name": "Anna Papageorgiou", "age": 34, "gender": "Female",
        "type": "ER DISCHARGE SUMMARY", "ai_progress": 100, "status": "APPROVED",
        "diagnosis": "Acute Bronchial Pneumonia",
        "icd10_code": "J18.9", "umls_cui": "C0032285",
        "digitized_summary": "PATIENT: Papageorgiou Anna | AGE: 34 | ADMISSION: 2026-08-02. Clinical summary: High fever (38.9 C), productive cough with purulent sputum, right lower lobe opacity on chest X-ray. Diagnosis: Acute Bronchial Pneumonia (ICD-10: J18.9).",
        "illustration_prompt": "Create a simple, non-intimidating, flat-vector medical illustration of lung bronchus and fluid-filled alveoli in pneumonia, suitable for patient education, clean white background",
        "illustration_status": "FLUX.2-pro Visual Diagram Generated",
        "b64_json": get_image_b64("PX-8818"), "confidence": 98.6, "timestamp": "2026-08-07T09:10:00Z"
    },
    "PX-8819": {
        "id": "PX-8819", "name": "Eleni Papadaki", "age": 36, "gender": "Female",
        "type": "LUMBAR MRI SCAN PDF", "ai_progress": 100, "status": "APPROVED",
        "diagnosis": "Acute L4-L5 Lumbar Disc Extrusion with Radiculopathy",
        "icd10_code": "M51.16", "umls_cui": "C0020440",
        "digitized_summary": "PATIENT: Papadaki Eleni | AGE: 36 | ADMISSION: 2026-08-08. Clinical summary: Acute severe lower back pain radiating to right anterior thigh and L4 dermatome after lifting heavy weight. Lumbar MRI demonstrates 7mm L4-L5 disc extrusion with right L4 nerve root compression. Diagnosis: Acute L4-L5 Lumbar Disc Extrusion with Radiculopathy (ICD-10: M51.16).",
        "illustration_prompt": "Create a simple, non-intimidating, flat-vector medical illustration of human lumbar L4-L5 vertebrae showing disc extrusion pressing on L4 nerve root, suitable for patient education, clean white background",
        "illustration_status": "FLUX.2-pro Visual Diagram Generated",
        "b64_json": get_image_b64("PX-8819"), "confidence": 99.1, "timestamp": "2026-08-08T00:01:00Z"
    },
    "PX-8888": {
        "id": "PX-8888", "name": "Filippos-Paraskevas (Philip) Zygouris", "age": 24, "gender": "Male",
        "type": "MYOFASCIAL CLINICAL REPORT", "ai_progress": 100, "status": "APPROVED",
        "diagnosis": "Masticatory Myalgia & Jaw Muscle Strain",
        "icd10_code": "M79.1", "umls_cui": "C0026848",
        "digitized_summary": "PATIENT: Zygouris Filippos-Paraskevas | AGE: 24 | ADMISSION: 2026-08-07. Primary Diagnosis: Masticatory Myalgia (ICD-10: M79.1). Clinical summary: Localized pain and fatigue in muscles of mastication (masseter and temporalis). Prolonged static posture, high cognitive load, bruxism.",
        "illustration_prompt": "Create a simple, non-intimidating, flat-vector medical illustration of the human head, jaw, and masseter temporalis masticatory muscles showing myofascial strain areas, suitable for patient education, clean white background",
        "illustration_status": "FLUX.2-pro Visual Diagram Generated",
        "b64_json": get_image_b64("PX-8888"), "confidence": 98.5, "timestamp": "2026-08-07T18:05:00Z"
    }
}'''

db_start = content.find("patient_database: Dict[str, Dict[str, Any]] = {")
db_end = content.find("class ApprovalRequest(BaseModel):")

if db_start != -1 and db_end != -1:
    new_content = content[:db_start] + clean_patient_db + "\n\n" + content[db_end:]
    with open(api_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("✅ Successfully optimized core/api.py file size by loading Base64 images dynamically from disk!")
else:
    print("❌ Could not locate patient_database in core/api.py")
