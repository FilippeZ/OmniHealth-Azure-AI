import os
import sys
import json
import base64
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from core.azure_clients import azure_services

sys.stdout.reconfigure(encoding="utf-8")

clinical_notes = "PATIENT: Papadaki Eleni | AGE: 36 | ADMISSION: 2026-08-08. Clinical summary: Acute severe lower back pain radiating to right anterior thigh and L4 dermatome after lifting heavy weight. Lumbar MRI demonstrates 7mm L4-L5 disc extrusion with right L4 nerve root compression. Diagnosis: Acute L4-L5 Lumbar Disc Extrusion with Radiculopathy (ICD-10: M51.16)."

print("🎨 Generating new FLUX.2-pro illustration for PX-8819...")

result = azure_services.generate_patient_education_illustration(clinical_notes)

title = result.get("illustration_title")
engine = result.get("model_engine")
b64_image = result.get("b64_json")

print(f"Title: {title}")
print(f"Engine: {engine}")
print(f"B64 Image Length: {len(b64_image or '')} bytes")

if b64_image:
    out_dir = os.path.join(os.getcwd(), "usecase_outputs")
    os.makedirs(out_dir, exist_ok=True)
    
    img_bytes = base64.b64decode(b64_image)
    
    file_path = os.path.join(out_dir, "PX-8819_FLUX2_Illustration_NEW.png")
    file_path_main = os.path.join(out_dir, "PX-8819_FLUX2_Illustration.png")
    
    with open(file_path, "wb") as f:
        f.write(img_bytes)
    with open(file_path_main, "wb") as f:
        f.write(img_bytes)
        
    print(f"✅ Saved new FLUX image to: {file_path}")
    print(f"✅ Overwritten main artifact: {file_path_main}")
else:
    print("❌ Failed to generate FLUX image")
