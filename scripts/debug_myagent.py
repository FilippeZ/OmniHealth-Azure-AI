import sys
import json
import urllib.request
import urllib.error

sys.path.append(".")
sys.stdout.reconfigure(encoding="utf-8")

import os

API_KEY = os.getenv("AZURE_OPENAI_API_KEY", "<YOUR_AZURE_API_KEY>")
url = "https://wwefilip56-9387-resource.services.ai.azure.com/api/projects/wwefilip56-9387/agents/myagent/endpoint/protocols/openai/responses?api-version=v1"

payload = json.dumps({
    "input": "Patient ID: PX-8810\nLegacy Clinical Record Notes:\nPATIENT: Mavros Nikos | AGE: 58. Angiography: 85% LAD stenosis. Exertional angina.\n\nSynthesize the legacy record data. Extract UMLS CUIs, ICD-10 codes, patient education points, and generate FLUX.2-pro visual illustration prompts according to AHA Patient Education guidelines. Return ONLY valid JSON format."
}).encode("utf-8")

print("Sending request to myagent...")
try:
    req = urllib.request.Request(
        url,
        data=payload,
        headers={"Content-Type": "application/json", "api-key": API_KEY},
        method="POST"
    )
    with urllib.request.urlopen(req, timeout=90) as resp:
        body = resp.read().decode("utf-8")
        print(f"Status: {resp.status}")
        print("Raw Body:")
        print(body)
except urllib.error.HTTPError as e:
    print(f"HTTPError {e.code}: {e.read().decode('utf-8', errors='replace')}")
except Exception as e:
    print(f"Exception: {e}")
