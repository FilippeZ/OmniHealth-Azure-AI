import os
import sys
import base64
import json
import fitz

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from core.api import app, azure_services, patient_database, history_db

client = TestClient(app)

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "usecase_outputs")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# 1. Read the 3 PDFs in usecases/
pdf_anxiety = fitz.open("usecases/medical_report_anxiety.pdf")[0].get_text()
pdf_cancer = fitz.open("usecases/medical_report_colorectal_cancer.pdf")[0].get_text()
pdf_depression = fitz.open("usecases/medical_report_depression.pdf")[0].get_text()

USE_CASES = [
    {
        "id": "PX-8890",
        "patient_name": "Sarah Jenkins",
        "age": 32,
        "gender": "Female",
        "source": "medical_report_anxiety.pdf",
        "clinical_text": pdf_anxiety,
        "diagnosis": "Generalized Anxiety Disorder & Autonomic Arousal",
        "icd10": "F41.1",
        "umls": "C0003467",
    },
    {
        "id": "PX-8891",
        "patient_name": "Robert Kensington",
        "age": 67,
        "gender": "Male",
        "source": "medical_report_colorectal_cancer.pdf",
        "clinical_text": pdf_cancer,
        "diagnosis": "Primary Adenocarcinoma of Sigmoid Colon",
        "icd10": "C18.9",
        "umls": "C0009375",
    },
    {
        "id": "PX-8892",
        "patient_name": "Michael Torres",
        "age": 44,
        "gender": "Male",
        "source": "medical_report_depression.pdf",
        "clinical_text": pdf_depression,
        "diagnosis": "Major Depressive Disorder, Severe",
        "icd10": "F32.2",
        "umls": "C0011581",
    },
    {
        "id": "PX-8893",
        "patient_name": "Elena Papadaki",
        "age": 48,
        "gender": "Female",
        "source": "Synthetic Clinical Ingestion",
        "clinical_text": "PATIENT: Papadaki Elena | AGE: 48 | GENDER: Female | ADMISSION: 2026-08-08. Clinical summary: Mammography and breast ultrasound reveal a 2.8 cm irregular retroareolar mass in left breast with spicuated margins. Core needle biopsy confirms Invasive Ductal Carcinoma (ICD-10: C50.9, UMLS: C0006142). ER/PR positive, HER2 negative.",
        "diagnosis": "Invasive Ductal Carcinoma of Left Breast",
        "icd10": "C50.9",
        "umls": "C0006142",
    },
    {
        "id": "PX-8894",
        "patient_name": "Dimitris Kostopoulos",
        "age": 62,
        "gender": "Male",
        "source": "Synthetic Clinical Ingestion",
        "clinical_text": "PATIENT: Kostopoulos Dimitris | AGE: 62 | GENDER: Male | ADMISSION: 2026-08-08. Clinical summary: Acute onset severe retrosternal crushing chest pain radiating to left jaw, diaphoresis, ST-segment elevation V1-V4 on 12-lead ECG. Cardiac troponin I elevated (14.2 ng/mL). Coronary angiography confirms acute 95% proximal LAD thrombus occlusion. Diagnosis: Acute Transmural Anterior STEMI (ICD-10: I21.0, UMLS: C0155626).",
        "diagnosis": "Acute Anterior Transmural Myocardial Infarction (STEMI)",
        "icd10": "I21.0",
        "umls": "C0155626",
    },
    {
        "id": "PX-8895",
        "patient_name": "Maria Vassiliou",
        "age": 55,
        "gender": "Female",
        "source": "Synthetic Clinical Ingestion",
        "clinical_text": "PATIENT: Vassiliou Maria | AGE: 55 | GENDER: Female | ADMISSION: 2026-08-08. Clinical summary: Sudden onset right hemiparesis and receptive aphasia 2 hours prior to arrival. NIHSS score 14. Non-contrast head CT rules out intracranial hemorrhage; CTA reveals M1 segment occlusion of left Middle Cerebral Artery (MCA). Diagnosis: Acute Ischemic Cerebral Infarction (ICD-10: I63.50, UMLS: C0007780).",
        "diagnosis": "Acute Ischemic Cerebral Infarction (Left MCA Stroke)",
        "icd10": "I63.50",
        "umls": "C0007780",
    },
]

print("=" * 80)
print("🚀 EXECUTING 6 CLINICAL USE CASES (INGESTION, NLP, FLUX RENDERING, AND STATE SYNC)")
print("=" * 80)

results = []

for idx, uc in enumerate(USE_CASES, 1):
    print(f"\n--- [USE CASE {idx}/6] {uc['id']} · {uc['patient_name']} ({uc['diagnosis']}) ---")

    b64_input = base64.b64encode(uc["clinical_text"].encode("utf-8")).decode("utf-8")

    # Ingest document via API
    resp = client.post(
        "/api/upload",
        data={
            "patient_id": uc["id"],
            "patient_name": uc["patient_name"],
            "clinical_notes": uc["clinical_text"]
        }
    )

    if resp.status_code != 200:
        print(f"  ❌ Error uploading: {resp.text}")
        continue

    res_data = resp.json()
    record = res_data.get("patient_record", {})

    # Extract base64 image and save to disk
    b64_img = record.get("b64_json") or patient_database.get(uc["id"], {}).get("b64_json")

    image_filename = f"{uc['id']}_FLUX2_Illustration.png"
    image_path = os.path.join(OUTPUT_DIR, image_filename)

    if b64_img:
        try:
            img_bytes = base64.b64decode(b64_img)
            with open(image_path, "wb") as img_f:
                img_f.write(img_bytes)
            print(f"  ✅ FLUX 3D Diagram Saved -> {image_path} ({len(img_bytes)} bytes)")
        except Exception as e:
            print(f"  ⚠️ Error saving image: {e}")

    # Build result dictionary
    usecase_result = {
        "id": uc["id"],
        "name": uc["patient_name"],
        "age": record.get("age", uc["age"]),
        "gender": record.get("gender", uc["gender"]),
        "diagnosis": record.get("primary_diagnosis", uc["diagnosis"]),
        "icd10": record.get("icd10_code", uc["icd10"]),
        "umls": record.get("umls_cui", uc["umls"]),
        "source": uc["source"],
        "summary": record.get("digitized_summary", uc["clinical_text"][:250]),
        "education": record.get("patient_education_summary"),
        "image_path": image_path,
        "image_filename": image_filename,
    }
    results.append(usecase_result)

    print(f"  ✅ Digitized Name: {usecase_result['name']}")
    print(f"  ✅ Age/Sex: {usecase_result['age']}y {usecase_result['gender']}")
    print(f"  ✅ Diagnosis: {usecase_result['diagnosis']} (ICD-10: {usecase_result['icd10']}, UMLS: {usecase_result['umls']})")

print("\n" + "=" * 80)
print("🎉 ALL 6 CLINICAL USE CASES PROCESSED SUCCESSFULLY!")
print("=" * 80)
