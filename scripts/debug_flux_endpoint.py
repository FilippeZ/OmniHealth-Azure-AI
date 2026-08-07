import os
import json
import urllib.request
import urllib.error

env_path = ".env"
key = ""
if os.path.exists(env_path):
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            if line.startswith("AZURE_OPENAI_KEY="):
                key = line.split("=", 1)[1].strip()

ep = "https://wwefilip56-9387-resource.services.ai.azure.com/providers/blackforestlabs/v1/flux-2-pro?api-version=preview"

model_names = [
    "flux-2-pro",
    "flux-1-pro",
    "flux-pro",
    "flux-1.1-pro",
    "blackforestlabs/flux-2-pro",
    "blackforestlabs/flux-1-pro",
    "blackforestlabs/flux-pro",
    "FLUX.2-pro",
    "FLUX.1-pro"
]

prompt = "Create a simple non-intimidating flat vector medical illustration of a human lumbar spine showing L4-L5 disc extrusion, clean white background"

for m in model_names:
    print(f"\n--- Testing model name: '{m}' ---")
    payload = json.dumps({
        "model": m,
        "prompt": prompt,
        "width": 1024,
        "height": 1024,
        "output_format": "png"
    }).encode("utf-8")
    
    req = urllib.request.Request(
        ep,
        data=payload,
        headers={
            "Content-Type": "application/json",
            "api-key": key,
            "Authorization": f"Bearer {key}"
        },
        method="POST"
    )
    
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            print(f"SUCCESS for model '{m}'! Keys: {list(data.keys())}")
            if "b64_json" in data:
                print(f"b64_json length: {len(data['b64_json'])}")
            elif "images" in data:
                print(f"images length: {len(data['images'])}")
            else:
                print(f"Response snippet: {str(data)[:300]}")
    except urllib.error.HTTPError as e:
        print(f"HTTP Error {e.code}: {e.reason}")
        try:
            err_body = e.read().decode("utf-8")
            print(f"Body: {err_body[:400]}")
        except Exception:
            pass
    except Exception as ex:
        print(f"Exception: {ex}")
