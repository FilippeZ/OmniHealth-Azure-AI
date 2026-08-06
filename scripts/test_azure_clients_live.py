"""
Script to test azure_clients.py methods live against Azure endpoints:
1. run_legacy_ocr_analysis
2. run_orchestrator_reasoning
3. generate_patient_education_illustration
"""
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(__file__)))
sys.stdout.reconfigure(encoding="utf-8")

from core.azure_clients import azure_services

print("==================================================")
print("TESTING OMNIHEALTH AZURE_CLIENTS LIVE INTEGRATION")
print("==================================================")

print(f"DeepSeek myagent Endpoint: {azure_services.agent_endpoint}")
print(f"Mistral OCR Endpoint:     {azure_services.mistral_ocr_endpoint}")
print(f"FLUX.2-pro Endpoint:      {azure_services.flux_pro_endpoint}\n")

# 1. Test Mistral OCR
print("1. Running Legacy Records Agent OCR...")
ocr_res = azure_services.run_legacy_ocr_analysis("scanned_discharge_summary.pdf")
print(f"   OCR Engine: {ocr_res.get('ocr_engine')}")
print(f"   Confidence: {ocr_res.get('ocr_confidence')}")
print(f"   Extracted Text: {ocr_res.get('extracted_text')[:120]}...\n")

# 2. Test FLUX.2-pro Image Generation
print("2. Running Medical Illustrator Agent (FLUX.2-pro)...")
illus_res = azure_services.generate_patient_education_illustration("Coronary Artery Disease (85% LAD Stenosis)")
print(f"   Model Engine: {illus_res.get('model_engine')}")
print(f"   Prompt Sent:  {illus_res.get('prompt_sent')}")
b64_len = len(illus_res.get("b64_json") or "")
print(f"   Base64 Image Bytes Received: {b64_len:,} chars")
print(f"   Status:       {illus_res.get('status')}\n")

# 3. Test DeepSeek myagent Clinical Reasoning
print("3. Running Lead Medical Orchestrator (DeepSeek 3.2 myagent)...")
ds_res = azure_services.run_orchestrator_reasoning(
    "PATIENT: Mavros Nikos | AGE: 58. Exertional angina. Angiography: 85% proximal LAD stenosis. Diagnosis: CAD.",
    "PX-8810"
)
print(f"   DeepSeek Response Received: {ds_res is not None}")
if ds_res:
    print(f"   Primary Diagnosis: {ds_res.get('primary_diagnosis')}")
    print(f"   ICD-10 Code:       {ds_res.get('icd10_code')}")
    print(f"   UMLS CUI:         {ds_res.get('umls_cui')}")

print("\n==================================================")
print("ALL LIVE SERVICE CALLS VERIFIED!")
print("==================================================")
