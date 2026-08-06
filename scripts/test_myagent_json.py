import sys
import json
import urllib.request
import urllib.error

sys.stdout.reconfigure(encoding="utf-8")

import os

API_KEY = os.getenv("AZURE_OPENAI_API_KEY", "<YOUR_AZURE_API_KEY>")
url = "https://wwefilip56-9387-resource.services.ai.azure.com/api/projects/wwefilip56-9387/agents/myagent/endpoint/protocols/openai/responses?api-version=v1"

payload = json.dumps({
    "input": "PATIENT: Mavros Nikos | AGE: 58 | ADMISSION: 2026-05-14. Clinical summary: Patient presented with exertional angina. Angiography: 85% proximal LAD stenosis. Diagnosis: Coronary Artery Disease (CAD). Synthesize and output JSON with primary_diagnosis, icd10_code, umls_cui, digitized_summary, patient_education_summary, and illustration_prompt. Output JSON immediately."
}).encode("utf-8")

print("Sending request to myagent with direct JSON request...")
try:
    req = urllib.request.Request(
        url,
        data=payload,
        headers={"Content-Type": "application/json", "api-key": API_KEY},
        method="POST"
    )
    with urllib.request.urlopen(req, timeout=90) as resp:
        body = resp.read().decode("utf-8")
        data = json.loads(body)
        print("Status:", resp.status)
        if "output" in data:
            for item in data.get("output", []):
                if item.get("type") == "message":
                    for content in item.get("content", []):
                        text = content.get("text", "")
                        print("--- MYAGENT TEXT OUTPUT ---")
                        print(text)
                        start = text.find("{")
                        end = text.rfind("}") + 1
                        if start >= 0 and end > start:
                            parsed_json = json.loads(text[start:end])
                            print("--- PARSED JSON OBJECT ---")
                            print(json.dumps(parsed_json, indent=2))
except urllib.error.HTTPError as e:
    print(f"HTTPError {e.code}: {e.read().decode('utf-8', errors='replace')}")
except Exception as e:
    print(f"Exception: {e}")
