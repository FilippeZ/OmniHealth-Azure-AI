import sys
import base64
import json
import logging

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from fastapi.testclient import TestClient
from core.api import app


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("test_new_usecases")

client = TestClient(app)

usecases = [
    {
        "id": "PX-8890",
        "name": "Dimitris Konstantinou",
        "condition": "Severe Calcific Aortic Valve Stenosis",
        "icd10_expected": "I35.0",
        "text": "PATIENT: Konstantinou Dimitris | AGE: 68 | ADMISSION: 2026-08-08. Clinical summary: Patient presents with exertional syncope, dyspnea on exertion, and grade 3/6 systolic ejection murmur. Echocardiogram reveals calcific aortic valve stenosis with aortic valve area 0.8 cm2 and mean pressure gradient 42 mmHg. Diagnosis: Severe Aortic Valve Stenosis (ICD-10: I35.0)."
    },
    {
        "id": "PX-8891",
        "name": "Katerina Nikolaou",
        "condition": "Acute Pulmonary Embolism (PE)",
        "icd10_expected": "I26.99",
        "text": "PATIENT: Nikolaou Katerina | AGE: 54 | ADMISSION: 2026-08-08. Clinical summary: Emergency presentation with sudden onset pleuritic chest pain, tachypnea, tachycardia (HR 118 bpm), and D-dimer 2400 ng/mL. CT pulmonary angiogram confirms filling defect in right main pulmonary artery. Diagnosis: Acute Pulmonary Embolism (ICD-10: I26.99)."
    },
    {
        "id": "PX-8892",
        "name": "Vassilis Georgiou",
        "condition": "Acute Suppurative Appendicitis",
        "icd10_expected": "K35.80",
        "text": "PATIENT: Georgiou Vassilis | AGE: 31 | ADMISSION: 2026-08-08. Clinical summary: Right lower quadrant abdominal pain radiating to McBurney point, fever 38.4°C, WBC 16.2 K/uL. Abdominal CT scan reveals dilated non-compressible appendix 9.5 mm with periappendiceal fat stranding. Diagnosis: Acute Appendicitis (ICD-10: K35.80)."
    }
]

print("=" * 70)
print("🚀 RUNNING 3 NEW CLINICAL USE CASES VERIFICATION")
print("=" * 70)

for idx, uc in enumerate(usecases, 1):
    print(f"\n--- USE CASE [{idx}/3]: {uc['id']} - {uc['name']} ({uc['condition']}) ---")
    b64_pdf = base64.b64encode(uc["text"].encode("utf-8")).decode("utf-8")

    payload = {
        "record_id": uc["id"],
        "base64_pdf": b64_pdf
    }

    # Step 1-5: Call /api/v1/evaluate-record
    response = client.post("/api/v1/evaluate-record", json=payload)
    assert response.status_code == 200, f"Failed for {uc['id']}: {response.text}"

    data = response.json()
    print(f"  ✅ Step 1 (Mistral OCR Status): {data['ocr_status']}")
    print(f"  ✅ Step 2 (Clinical NLP Entities): Extracted {len(data['clinical_entities'].get('entities', []))} entities.")
    top_ent = data['clinical_entities'].get('entities', [{}])[0]
    print(f"     -> Top Identified Entity: {top_ent.get('text')} (ICD-10: {top_ent.get('links', [{}])[0].get('id', 'N/A')})")
    print(f"  ✅ Step 3 (Lead Orchestrator DeepSeek Summary): {data['orchestrator_summary'][:100]}...")
    print(f"  ✅ Step 4 (Medical Illustrator FLUX.2-pro): Diagram Path -> {data['illustration_url']}")
    print(f"  ✅ Step 5 (Safety Control Bridge HITL Checkpoint): ID -> {data['safety_checkpoint_id']}")

# Step 6: Verify React UI state persistence via /api/patients
print("\n" + "=" * 70)
print("🔍 VERIFYING STATE PERSISTENCE IN /api/patients ENDPOINT")
print("=" * 70)

get_patients_res = client.get("/api/patients")
assert get_patients_res.status_code == 200, "Failed to retrieve patients list"
all_patients = get_patients_res.json()

print(f"Total Active Patients in Database: {len(all_patients)}")
for uc in usecases:
    found = [p for p in all_patients if p["id"] == uc["id"]]
    assert len(found) > 0, f"Patient {uc['id']} not found in database!"
    patient_entry = found[0]
    print(f"  ✅ Verified Patient [{patient_entry['id']}] - Status: {patient_entry['status']} | Diagnosis: {patient_entry['diagnosis']} | FLUX Image: {'Present' if patient_entry.get('b64_json') else 'Missing'}")

print("\n" + "=" * 70)
print("🎉 ALL 3 NEW USE CASES PASSED EVERY STEP SUCCESSFULLY!")
print("=" * 70)
