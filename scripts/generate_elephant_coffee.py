import os
import sys
import json
import base64
import urllib.request

sys.stdout.reconfigure(encoding="utf-8")

env_path = ".env"
key = ""
if os.path.exists(env_path):
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            if line.startswith("AZURE_OPENAI_KEY="):
                key = line.split("=", 1)[1].strip()

ep = "https://wwefilip56-9387-resource.services.ai.azure.com/providers/blackforestlabs/v1/flux-2-pro?api-version=preview"
prompt = "A charming, detailed photograph of an elephant sitting comfortably in a cozy coffee shop, holding a warm cup of coffee with its trunk, soft morning lighting, high resolution"

print(f"🐘 Sending prompt to FLUX.2-pro: '{prompt}'...")

payload_data = {
    "model": "FLUX.2-pro",
    "prompt": prompt,
    "width": 1024,
    "height": 1024,
    "n": 1,
    "output_format": "png"
}

req = urllib.request.Request(
    ep,
    data=json.dumps(payload_data).encode("utf-8"),
    headers={
        "Content-Type": "application/json",
        "api-key": key,
        "Authorization": f"Bearer {key}"
    },
    method="POST"
)

try:
    with urllib.request.urlopen(req, timeout=40) as resp:
        raw_data = json.loads(resp.read().decode("utf-8"))
        b64_img = raw_data["data"][0]["b64_json"]
        img_bytes = base64.b64decode(b64_img)
        
        out_dir = os.path.join(os.getcwd(), "usecase_outputs")
        os.makedirs(out_dir, exist_ok=True)
        file_path = os.path.join(out_dir, "elephant_drinking_coffee.png")
        
        with open(file_path, "wb") as f:
            f.write(img_bytes)
            
        print(f"✅ Success! Image saved to: {file_path}")
        print(f"Image size: {len(img_bytes)} bytes")
except Exception as e:
    print(f"❌ Failed: {e}")
