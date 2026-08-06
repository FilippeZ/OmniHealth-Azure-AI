"""
Test script to pinpoint exact authentication & api-version for myagent
"""
import os
import sys
import json
import urllib.request
import urllib.error

sys.stdout.reconfigure(encoding="utf-8")

API_KEY = os.getenv("AZURE_OPENAI_API_KEY", "<YOUR_AZURE_API_KEY>")
BASE_URL = "https://wwefilip56-9387-resource.services.ai.azure.com"
agent_url_base = f"{BASE_URL}/api/projects/wwefilip56-9387/agents/myagent/endpoint/protocols/openai/responses"

# Test 1: api-key in query param
print("Testing api-key in query param...")
for ver in ["v1", "2024-05-01-preview", "2024-07-01-preview", "2024-10-01-preview"]:
    url = f"{agent_url_base}?api-version={ver}&api-key={API_KEY}"
    payload = json.dumps({"input": "Hello"}).encode("utf-8")
    try:
        req = urllib.request.Request(
            url,
            data=payload,
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            body = resp.read().decode("utf-8")
            print(f"✅ SUCCESS for ver={ver} -> HTTP {resp.status}: {body[:250]}")
            break
    except urllib.error.HTTPError as e:
        err = e.read().decode("utf-8", errors="replace")
        print(f"   ver={ver} HTTP {e.code}: {err[:200]}")
    except Exception as e:
        print(f"   ver={ver} Exception: {e}")

# Test 2: Azure AI Agent Service standard v1 endpoint
print("\nTesting Azure AI Agent Service standard endpoints...")
endpoints = [
    f"{BASE_URL}/api/projects/wwefilip56-9387/agents/myagent/endpoint/protocols/openai/responses?api-version=v1",
    f"{BASE_URL}/api/projects/wwefilip56-9387/agents/myagent/responses?api-version=2024-10-01-preview",
    f"{BASE_URL}/agents/v1/projects/wwefilip56-9387/agents/myagent/responses?api-version=2024-10-01-preview",
    f"{BASE_URL}/agents/v1.0/projects/wwefilip56-9387/agents/myagent/responses"
]

for ep in endpoints:
    payload = json.dumps({"input": "Hello"}).encode("utf-8")
    try:
        req = urllib.request.Request(
            ep,
            data=payload,
            headers={"Content-Type": "application/json", "api-key": API_KEY},
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            body = resp.read().decode("utf-8")
            print(f"✅ SUCCESS for {ep} -> HTTP {resp.status}: {body[:250]}")
            break
    except urllib.error.HTTPError as e:
        err = e.read().decode("utf-8", errors="replace")
        print(f"   HTTP {e.code} for {ep}: {err[:150]}")
    except Exception as e:
        pass
