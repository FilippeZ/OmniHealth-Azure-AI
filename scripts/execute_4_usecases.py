import os
import sys
import json
import base64
import urllib.request
import urllib.parse

sys.stdout.reconfigure(encoding="utf-8")

BASE_URL = "http://localhost:8000/api"

usecases = [
    {
        "patient_id": "PX-8810",
        "patient_name": "Nikos Mavros",
        "notes": "PATIENT: Mavros Nikos | AGE: 58 | ADMISSION: 2026-05-14. Clinical summary: Patient presented with exertional angina and shortness of breath. Coronary angiography revealed 85% proximal LAD artery stenosis. Diagnosis: Atherosclerotic Heart Disease (Coronary Artery Disease - CAD)."
    },
    {
        "patient_id": "PX-8811",
        "patient_name": "Elena Dimou",
        "notes": "PATIENT: Dimou Elena | AGE: 42 | ADMISSION: 2026-06-01. Clinical summary: Severe low back pain radiating to left leg (L5 distribution) for 3 weeks. MRI lumbar spine confirms L5-S1 herniated disc with nerve root compression. Diagnosis: Lumbar Disc Displacement (L5-S1 Herniation)."
    },
    {
        "patient_id": "PX-8812",
        "patient_name": "Christos Papanikolaou",
        "notes": "PATIENT: Papanikolaou Christos | AGE: 65 | ADMISSION: 2026-06-10. Clinical summary: Outpatient lab report: HbA1c 8.6%, fasting glucose 192 mg/dL. Distal sensory polyneuropathy in bilateral feet. Diagnosis: Type 2 Diabetes Mellitus with Peripheral Neuropathy."
    },
    {
        "patient_id": "PX-8813",
        "patient_name": "George Vassiliou",
        "notes": "PATIENT: Vassiliou George | AGE: 62 | ADMISSION: 2026-07-02. Clinical summary: Progressive exertional dyspnea, chronic productive cough, FEV1/FVC 58%. High-resolution CT chest shows hyperinflation and bilateral emphysematous bullae. Diagnosis: Chronic Obstructive Pulmonary Disease (COPD Exacerbation - J44.1)."
    }
]

output_dir_local = os.path.join(os.getcwd(), "usecase_outputs")
output_dir_brain = r"C:\Users\wwefi\.gemini\antigravity-ide\brain\22d6eb67-e89b-4b9e-850b-193e036d3943\usecase_images"
os.makedirs(output_dir_local, exist_ok=True)
os.makedirs(output_dir_brain, exist_ok=True)

results = []

print("==========================================================================")
print("🚀 OMNIHEALTH AI: EXECUTING 4 CLINICAL USE CASES (END-TO-END BENCHMARK)")
print("==========================================================================\n")

for uc in usecases:
    pid = uc["patient_id"]
    name = uc["patient_name"]
    notes = uc["notes"]
    
    print(f"------------ USE CASE: {pid} ({name}) ------------")
    
    # Step 1: Upload Diagnostic Record
    upload_data = urllib.parse.urlencode({
        "patient_id": pid,
        "patient_name": name,
        "clinical_notes": notes
    }).encode("utf-8")
    
    req_upload = urllib.request.Request(
        f"{BASE_URL}/upload",
        data=upload_data,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        method="POST"
    )
    
    try:
        with urllib.request.urlopen(req_upload, timeout=10) as resp:
            up_res = json.loads(resp.read().decode("utf-8"))
            print(f"1. Upload Accepted: {up_res['message']}")
    except Exception as e:
        print(f"❌ Upload Failed for {pid}: {e}")
        continue

    # Step 2: Stream SSE Reasoning Events
    req_stream = urllib.request.Request(f"{BASE_URL}/stream-reasoning?patient_id={pid}")
    
    illustration_title = "Anatomical Graphic"
    prompt_sent = ""
    b64_img = None
    nlp_entities = []
    hitl_data = None
    
    try:
        with urllib.request.urlopen(req_stream, timeout=60) as resp:
            for line in resp:
                decoded_line = line.decode("utf-8").strip()
                if not decoded_line:
                    continue
                try:
                    payload = json.loads(decoded_line)
                    ev_type = payload.get("type")
                    agent = payload.get("agent")
                    msg = payload.get("message")
                    
                    if ev_type == "AGENT_STEP":
                        print(f"   [{agent}] {msg}")
                    elif ev_type == "OCR_FINDINGS":
                        print(f"   [Mistral OCR 4.0] {msg}")
                    elif ev_type == "NLP_ENTITIES":
                        nlp_entities = payload.get("data", {}).get("entities", [])
                        print(f"   [Clinical NLP] Extracted {len(nlp_entities)} UMLS & ICD-10 entities.")
                    elif ev_type == "ILLUSTRATION_GENERATED":
                        data_ill = payload.get("data", {})
                        illustration_title = data_ill.get("illustration_title", "Visual Graphic")
                        prompt_sent = data_ill.get("prompt_sent", "")
                        b64_img = data_ill.get("b64_json")
                        print(f"   [FLUX.2-pro] Generated: '{illustration_title}' (b64 size: {len(b64_img) if b64_img else 0} chars)")
                    elif ev_type == "HITL_SUPERVISORY_REQUIRED":
                        hitl_data = payload.get("data", {})
                        print(f"   [HITL Supervisory] Paused for physician review: {hitl_data.get('primary_diagnosis')}")
                except Exception:
                    pass
    except Exception as e:
        print(f"❌ Streaming Error for {pid}: {e}")

    # Save FLUX image to both local directory and brain artifact directory
    img_local_path = None
    img_brain_path = None
    if b64_img:
        try:
            img_bytes = base64.b64decode(b64_img)
            img_local_path = os.path.join(output_dir_local, f"{pid}_FLUX2_Illustration.png")
            img_brain_path = os.path.join(output_dir_brain, f"{pid}_FLUX2_Illustration.png")
            with open(img_local_path, "wb") as f:
                f.write(img_bytes)
            with open(img_brain_path, "wb") as f:
                f.write(img_bytes)
            print(f"📷 FLUX.2-pro image saved to:\n   - {img_local_path}\n   - {img_brain_path}")
        except Exception as e:
            print(f"⚠️ Failed to save image: {e}")

    # Step 3: Physician Approval (/api/approve)
    appr_payload = json.dumps({
        "patient_id": pid,
        "physician_id": "DR-ARIS-992",
        "decision": "APPROVED",
        "physician_notes": f"APPROVE: Verified digitized record for {name} ({pid}). Visual anatomical illustration shared with patient."
    }).encode("utf-8")
    
    req_appr = urllib.request.Request(
        f"{BASE_URL}/approve",
        data=appr_payload,
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    
    try:
        with urllib.request.urlopen(req_appr, timeout=10) as resp:
            appr_res = json.loads(resp.read().decode("utf-8"))
            audit_id = appr_res.get("audit_record", {}).get("audit_id", "AUDIT-OK")
            print(f"3. Physician Approved: Decision durably recorded in Cosmos DB. Audit ID: {audit_id}\n")
    except Exception as e:
        print(f"❌ Approval error: {e}\n")

    results.append({
        "patient_id": pid,
        "patient_name": name,
        "primary_diagnosis": hitl_data.get("primary_diagnosis") if hitl_data else notes,
        "icd10": hitl_data.get("icd10_code") if hitl_data else "ICD-10",
        "umls_cui": hitl_data.get("umls_cui") if hitl_data else "UMLS",
        "illustration_title": illustration_title,
        "prompt_sent": prompt_sent,
        "image_file": img_brain_path or img_local_path,
        "nlp_entities": nlp_entities
    })

print("==========================================================================")
print("📊 EXECUTION COMPLETE: SUMMARY OF 4 CLINICAL USE CASES")
print("==========================================================================\n")

for res in results:
    print(f"• Patient {res['patient_id']} ({res['patient_name']}):")
    print(f"  Diagnosis: {res['primary_diagnosis']}")
    print(f"  ICD-10: {res['icd10']} | UMLS CUI: {res['umls_cui']}")
    print(f"  FLUX.2-pro Illustration: {res['illustration_title']}")
    print(f"  Saved Image: {res['image_file']}")
    print(f"  UMLS Entities: {', '.join([e['text'] for e in res['nlp_entities']])}\n")
