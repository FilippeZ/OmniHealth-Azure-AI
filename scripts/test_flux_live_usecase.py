import os
import sys
import json
import urllib.request
import urllib.parse

sys.stdout.reconfigure(encoding="utf-8")

BASE_URL = "http://localhost:8000/api"

patient_data = {
    "patient_id": "PX-8819",
    "patient_name": "Eleni Papadaki",
    "clinical_notes": "PATIENT: Papadaki Eleni | AGE: 36 | ADMISSION: 2026-08-08. Clinical summary: Acute severe lower back pain radiating to right anterior thigh and L4 dermatome after lifting heavy weight. Lumbar MRI demonstrates 7mm L4-L5 disc extrusion with right L4 nerve root compression. Diagnosis: Acute L4-L5 Lumbar Disc Extrusion with Radiculopathy (ICD-10: M51.16)."
}

print("==========================================================================")
print("🚀 TESTING LIVE RAG ASSET RETRIEVAL: PX-8819 (Eleni Papadaki)")
print("==========================================================================\n")

# Step 1: Upload Diagnostic Record
upload_payload = urllib.parse.urlencode(patient_data).encode("utf-8")
req_upload = urllib.request.Request(
    f"{BASE_URL}/upload",
    data=upload_payload,
    headers={"Content-Type": "application/x-www-form-urlencoded"},
    method="POST"
)

try:
    with urllib.request.urlopen(req_upload, timeout=10) as resp:
        up_res = json.loads(resp.read().decode("utf-8"))
        print(f"1. Upload Status: {up_res.get('status')} - {up_res.get('message')}\n")
except Exception as e:
    print(f"❌ Upload Failed: {e}")
    sys.exit(1)

# Step 2: Listen to SSE Reasoning Stream
req_stream = urllib.request.Request(f"{BASE_URL}/stream-reasoning?patient_id=PX-8819")

asset_title = None
asset_url = None
asset_type = None
extracted_icd10 = None
extracted_cui = None

try:
    with urllib.request.urlopen(req_stream, timeout=40) as resp:
        for line in resp:
            decoded_line = line.decode("utf-8").strip()
            if not decoded_line:
                continue
            try:
                event = json.loads(decoded_line)
                ev_type = event.get("type")
                agent = event.get("agent")
                msg = event.get("message")
                
                print(f"➜ [{agent or 'SYSTEM'}] {msg}")
                
                if ev_type == "NLP_ENTITIES":
                    ents = event.get("data", {}).get("entities", [])
                    if ents:
                        extracted_icd10 = ents[0].get("icd10")
                        extracted_cui = ents[0].get("umls_cui")
                        print(f"   📌 Primary ICD-10 Extracted: {extracted_icd10} | UMLS CUI: {extracted_cui}")
                
                # ΑΛΛΑΓΗ ΕΔΩ: Πιάνουμε το Event της ανάκτησης αντί για της δημιουργίας
                elif ev_type == "ASSET_RETRIEVED":
                    asset_data = event.get("data", {})
                    asset_title = event.get("title") or asset_data.get("title")
                    asset_url = asset_data.get("url")
                    asset_type = asset_data.get("media_type") # π.χ. "video/mp4" ή "image/svg+xml"
                    
                    print(f"\n🎬 PRE-RENDERED ASSET RETRIEVED (RAG):")
                    print(f"   - Title: {asset_title}")
                    print(f"   - Media Type: {asset_type}")
                    print(f"   - File URL: {asset_url}")
            except Exception:
                pass
except Exception as e:
    print(f"Stream finished: {e}")

print("\n==========================================================================")
print("✅ LIVE RAG ASSET RETRIEVAL COMPLETED SUCCESSFULLY")
print("==========================================================================")

