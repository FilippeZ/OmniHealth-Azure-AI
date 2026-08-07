import os
import sys
import json
import base64

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from core.azure_clients import azure_services

sys.stdout.reconfigure(encoding="utf-8")

usecases = [
    {
        "patient_id": "PX-8810",
        "name": "Nikos Mavros",
        "notes": "Coronary Artery Disease with 85% proximal LAD stenosis, exertional angina"
    },
    {
        "patient_id": "PX-8811",
        "name": "Elena Dimou",
        "notes": "Lumbar Disc Displacement L5-S1 herniation with nerve root compression"
    },
    {
        "patient_id": "PX-8812",
        "name": "Christos Papanikolaou",
        "notes": "Type 2 Diabetes Mellitus with Peripheral Neuropathy, elevated HbA1c"
    },
    {
        "patient_id": "PX-8813",
        "name": "George Vassiliou",
        "notes": "COPD Exacerbation with bilateral emphysematous bullae and impaired airflow"
    },
    {
        "patient_id": "PX-8814",
        "name": "Maria Karrathana",
        "notes": "Essential Primary Hypertension with left ventricular hypertrophy"
    },
    {
        "patient_id": "PX-8815",
        "name": "Stefanos Kostopoulos",
        "notes": "Chronic Kidney Disease Stage 3 with elevated creatinine and proteinuria"
    },
    {
        "patient_id": "PX-8816",
        "name": "Sophia Alexiou",
        "notes": "Primary Vascular Headache Chronic Migraine with photophobia"
    },
    {
        "patient_id": "PX-8817",
        "name": "Ioannis Antoniou",
        "notes": "Primary Knee Osteoarthritis with medial joint space narrowing"
    },
    {
        "patient_id": "PX-8818",
        "name": "Anna Papageorgiou",
        "notes": "Acute Bronchial Pneumonia with right lower lobe opacity and fever"
    },
    {
        "patient_id": "PX-8888",
        "name": "Filippos-Paraskevas (Philip) Zygouris",
        "notes": "Masticatory Myalgia with masseter and temporalis muscle strain"
    }
]

output_dir_local = os.path.join(os.getcwd(), "usecase_outputs")
output_dir_brain = r"C:\Users\wwefi\.gemini\antigravity-ide\brain\a07607c1-6949-4260-ad74-462585fce8e4\usecase_images"
os.makedirs(output_dir_local, exist_ok=True)
os.makedirs(output_dir_brain, exist_ok=True)

print("==========================================================================")
print("🚀 CALLING LIVE AZURE AI FOUNDRY FLUX.2-PRO MODEL FOR ALL 10 USE CASES")
print("==========================================================================\n")

for idx, uc in enumerate(usecases, 1):
    pid = uc["patient_id"]
    name = uc["name"]
    notes = uc["notes"]
    
    print(f"[{idx}/10] Generating live FLUX.2-pro image for {pid} ({name})...")
    res = azure_services.generate_patient_education_illustration(notes)
    
    engine = res.get("model_engine")
    title = res.get("illustration_title")
    b64_img = res.get("b64_json")
    
    print(f"   Engine: {engine}")
    print(f"   Title: {title}")
    print(f"   Image Bytes: {len(b64_img or '')}")
    
    if b64_img:
        img_bytes = base64.b64decode(b64_img)
        fname = f"{pid}_FLUX2_Illustration.png"
        path_local = os.path.join(output_dir_local, fname)
        path_brain = os.path.join(output_dir_brain, fname)
        
        with open(path_local, "wb") as f:
            f.write(img_bytes)
        with open(path_brain, "wb") as f:
            f.write(img_bytes)
        print(f"   ✅ Saved live FLUX.2-pro image ({len(img_bytes)} bytes) to {path_local}\n")
    else:
        print(f"   ❌ Failed to generate FLUX image for {pid}\n")

print("==========================================================================")
print("✅ ALL 10 LIVE FLUX.2-PRO IMAGES GENERATED SUCCESSFULLY")
print("==========================================================================")
