import os
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")

hitl_path = os.path.join(os.getcwd(), "ui", "src", "components", "SupervisoryHITLPanel.jsx")

with open(hitl_path, "r", encoding="utf-8") as f:
    content = f.read()

# Remove all inline b64_json: 'iVBORw0KG...' properties from PRESETS_DB in SupervisoryHITLPanel.jsx
cleaned_content = re.sub(r"\s*b64_json:\s*'iVBORw0KG[^']+'(?:,)?", "", content)

with open(hitl_path, "w", encoding="utf-8") as f:
    f.write(cleaned_content)

print("✅ Removed legacy inline base64 images from SupervisoryHITLPanel.jsx! File size optimized.")
