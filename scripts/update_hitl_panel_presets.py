import os
import sys
import json
import base64

sys.stdout.reconfigure(encoding="utf-8")

usecase_images_dir = os.path.join(os.getcwd(), "usecase_outputs")

patients_meta = {
    'PX-8810': {
        'name': 'Nikos Mavros', 'age': 58, 'gender': 'Male',
        'diag': 'Coronary Artery Disease (CAD - 85% Proximal LAD Stenosis)',
        'icd10': 'I25.10', 'cui': 'C0010054',
        'summary': 'Patient Nikos Mavros (58y) presented with exertional angina. Angiography confirmed 85% proximal LAD stenosis. Prescribed dual antiplatelet therapy (Aspirin + Clopidogrel).',
        'edu': 'Your heart receives blood through small arteries. One of these main arteries (the LAD) has an 85% blockage restricting blood flow, causing chest tightness when exercising.',
        'prompt': 'Create a simple, non-intimidating, flat-vector medical illustration of a human heart showing a blocked coronary artery, suitable for patient education, clean white background',
        'action': 'Share visual diagram with patient during consultation. Initiate dual antiplatelet therapy & cardiac rehabilitation.'
    },
    'PX-8811': {
        'name': 'Elena Dimou', 'age': 42, 'gender': 'Female',
        'diag': 'Lumbar Disc Displacement (L5-S1 Herniation & Nerve Root Compression)',
        'icd10': 'M51.26', 'cui': 'C0020440',
        'summary': 'Patient Elena Dimou (42y) presented with severe low back pain radiating to left leg (L5 distribution) for 3 weeks. MRI lumbar spine confirms L5-S1 herniated disc with nerve root compression.',
        'edu': 'Your lower back contains gel-like discs between the vertebrae. One of these discs (at L5-S1) has pushed outward slightly, pressing on a nearby nerve root and causing leg pain.',
        'prompt': 'Create a simple, non-intimidating, flat-vector medical illustration of a human lumbar spine showing an L5-S1 herniated disc pressing on a nerve root, suitable for patient education, clean white background',
        'action': 'Share visual anatomical diagram with patient. Initiate physical therapy & conservative pain management.'
    },
    'PX-8812': {
        'name': 'Christos Papanikolaou', 'age': 65, 'gender': 'Male',
        'diag': 'Type 2 Diabetes Mellitus with Peripheral Neuropathy',
        'icd10': 'E11.40', 'cui': 'C0011860',
        'summary': 'Patient Christos Papanikolaou (65y). Scanned lab & outpatient report: HbA1c 8.6%, fasting glucose 192 mg/dL. Distal sensory polyneuropathy symptoms in bilateral lower extremities.',
        'edu': 'High blood sugar levels over time can affect the tiny blood vessels that nourish your peripheral nerves, leading to numbness or tingling sensations in your toes.',
        'prompt': 'Create a simple, non-intimidating, flat-vector medical illustration of peripheral nerve fibers in the foot showing blood flow and glucose impact, suitable for patient education, clean white background',
        'action': 'Share visual diagram with patient. Optimize glycemic control (target HbA1c <7.0%) & routine foot care education.'
    },
    'PX-8813': {
        'name': 'George Vassiliou', 'age': 62, 'gender': 'Male',
        'diag': 'Chronic Obstructive Pulmonary Disease (COPD Exacerbation & Emphysema)',
        'icd10': 'J44.1', 'cui': 'C0024117',
        'summary': 'Patient George Vassiliou (62y) presented with progressive exertional dyspnea, chronic productive cough, FEV1/FVC 58%. HRCT chest shows hyperinflation and bilateral emphysematous bullae.',
        'edu': 'COPD causes swelling and blockage in your airways, making it harder for air to flow smoothly out of your lungs when you breathe out.',
        'prompt': 'Create a simple, non-intimidating, flat-vector medical illustration of human bronchial airways and alveoli showing airflow in COPD emphysema, suitable for patient education, clean white background',
        'action': 'Share visual diagram with patient during consultation. Initiate bronchodilator therapy & pulmonary rehabilitation.'
    },
    'PX-8814': {
        'name': 'Maria Karrathana', 'age': 39, 'gender': 'Female',
        'diag': 'Essential Primary Hypertension with LV Hypertrophy',
        'icd10': 'I10', 'cui': 'C0020538',
        'summary': 'Patient Maria Karrathana (39y) presented with recurrent occipital headaches, resting blood pressure 165/102 mmHg. Echocardiogram shows mild left ventricular hypertrophy.',
        'edu': 'High blood pressure means the force of blood pushing against your artery walls is consistently too high, causing your heart muscle to work harder.',
        'prompt': 'Create a simple, non-intimidating, flat-vector medical illustration of human vascular arteries showing blood pressure resistance and heart muscle workload, suitable for patient education, clean white background',
        'action': 'Share visual diagram with patient during consultation. Prescribe antihypertensive therapy & low-sodium diet.'
    },
    'PX-8815': {
        'name': 'Stefanos Kostopoulos', 'age': 51, 'gender': 'Male',
        'diag': 'Chronic Kidney Disease Stage 3 (CKD)',
        'icd10': 'N18.3', 'cui': 'C0022658',
        'summary': 'Patient Stefanos Kostopoulos (51y). Serum creatinine 2.1 mg/dL, eGFR 44 mL/min/1.73m2, proteinuria 450 mg/24h. Diagnosis: CKD Stage 3.',
        'edu': 'Kidneys filter waste products from your blood. In stage 3 CKD, the filtering rate has slowed down moderately, requiring careful blood pressure and dietary management.',
        'prompt': 'Create a simple, non-intimidating, flat-vector medical illustration of human kidneys showing blood filtration and nephron unit function, suitable for patient education, clean white background',
        'action': 'Share visual diagram with patient during consultation. Refer to nephrology & initiate ACE inhibitor therapy.'
    },
    'PX-8816': {
        'name': 'Sophia Alexiou', 'age': 47, 'gender': 'Female',
        'diag': 'Primary Vascular Headache / Chronic Migraine',
        'icd10': 'G43.90', 'cui': 'C0025202',
        'summary': 'Patient Sophia Alexiou (47y) presented with throbbing unilateral headache with photophobia and nausea lasting 24 hours. Neurological MRI brain normal.',
        'edu': 'Migraines involve temporary changes in brain nerve signals and blood vessels, causing sensitivity to light, sound, and pulsing head pain.',
        'prompt': 'Create a simple, non-intimidating, flat-vector medical illustration of cranial nerve pathways and blood vessel dilation in migraine, suitable for patient education, clean white background',
        'action': 'Share visual diagram with patient during consultation. Prescribe triptan acute therapy & trigger avoidance protocol.'
    },
    'PX-8817': {
        'name': 'Ioannis Antoniou', 'age': 71, 'gender': 'Male',
        'diag': 'Primary Knee Osteoarthritis (Bilateral Joint Narrowing)',
        'icd10': 'M17.9', 'cui': 'C0029408',
        'summary': 'Patient Ioannis Antoniou (71y) presented with bilateral knee joint stiffness, medial joint space narrowing, subchondral sclerosis on X-ray.',
        'edu': 'Knee osteoarthritis occurs when protective cartilage cushioning the knee joint wears down over time, causing bone-on-bone friction and stiffness.',
        'prompt': 'Create a simple, non-intimidating, flat-vector medical illustration of a human knee joint showing cartilage layer and joint space, suitable for patient education, clean white background',
        'action': 'Share visual diagram with patient during consultation. Recommend quad-strengthening exercises & intra-articular hyaluronic acid.'
    },
    'PX-8818': {
        'name': 'Anna Papageorgiou', 'age': 34, 'gender': 'Female',
        'diag': 'Acute Bronchial Pneumonia (Right RLL Opacity)',
        'icd10': 'J18.9', 'cui': 'C0032285',
        'summary': 'Patient Anna Papageorgiou (34y) presented with high fever (38.9 C), productive cough with purulent sputum, right lower lobe opacity on chest X-ray.',
        'edu': 'Pneumonia is an infection that inflames tiny air sacs in your lungs, which may fill with fluid or phlegm, causing fever and cough.',
        'prompt': 'Create a simple, non-intimidating, flat-vector medical illustration of lung bronchus and fluid-filled alveoli in pneumonia, suitable for patient education, clean white background',
        'action': 'Share visual diagram with patient during consultation. Prescribe targeted oral antibiotic course & adequate rest/hydration.'
    },
    'PX-8819': {
        'name': 'Eleni Papadaki', 'age': 36, 'gender': 'Female',
        'diag': 'Acute L4-L5 Lumbar Disc Extrusion with Radiculopathy',
        'icd10': 'M51.16', 'cui': 'C0020440',
        'summary': 'Patient Eleni Papadaki (36y) presented with acute severe lower back pain radiating to right anterior thigh and L4 dermatome. Lumbar MRI confirms 7mm L4-L5 disc extrusion with right L4 nerve root compression.',
        'edu': 'An L4-L5 disc extrusion occurs when outer disc fibers tear, allowing inner cushion material to extrude outward and press on the L4 nerve root going down your leg.',
        'prompt': 'Create a simple, non-intimidating, flat-vector medical illustration of human lumbar L4-L5 vertebrae showing disc extrusion pressing on L4 nerve root, suitable for patient education, clean white background',
        'action': 'Share visual diagram with patient during consultation. Initiate oral anti-inflammatory course & physical therapy evaluation.'
    },
    'PX-8888': {
        'name': 'Filippos-Paraskevas (Philip) Zygouris', 'age': 24, 'gender': 'Male',
        'diag': 'Masticatory Myalgia & Jaw Muscle Strain',
        'icd10': 'M79.1', 'cui': 'C0026848',
        'summary': 'Patient Philip Zygouris (24y) presented with localized pain and fatigue in muscles of mastication (masseter and temporalis) due to prolonged static posture and nocturnal bruxism.',
        'edu': 'Masticatory myalgia is muscle soreness in your chewing muscles (jaw and temples) caused by clenching teeth or muscle overuse.',
        'prompt': 'Create a simple, non-intimidating, flat-vector medical illustration of the human head, jaw, and masseter temporalis masticatory muscles showing myofascial strain areas, suitable for patient education, clean white background',
        'action': 'Share visual diagram with patient during consultation. Recommend custom night guard, ergonomic adjustments, and soft diet protocol.'
    }
}

b64_data = {}
for pid in patients_meta:
    fname = f"{pid}_FLUX2_Illustration.png"
    if pid == "PX-8819":
        # check if NEW exists first
        p_new = os.path.join(usecase_images_dir, "PX-8819_FLUX2_Illustration_NEW.png")
        if os.path.exists(p_new):
            with open(p_new, "rb") as f:
                b64_data[pid] = base64.b64encode(f.read()).decode("utf-8")
                continue
    p_path = os.path.join(usecase_images_dir, fname)
    if os.path.exists(p_path):
        with open(p_path, "rb") as f:
            b64_data[pid] = base64.b64encode(f.read()).decode("utf-8")
    else:
        print(f"Warning: {fname} not found!")

print(f"Loaded {len(b64_data)} Base64 FLUX images!")

hitl_panel_path = os.path.join(os.getcwd(), "ui", "src", "components", "SupervisoryHITLPanel.jsx")
with open(hitl_panel_path, "r", encoding="utf-8") as f:
    content = f.read()

# Build preset javascript object
presets_js = "{\n"
for pid, meta in patients_meta.items():
    b64_str = b64_data.get(pid, "")
    presets_js += f"""    '{pid}': {{
      patient_id: '{pid}', patient_name: '{meta['name']}', age: {meta['age']}, gender: '{meta['gender']}',
      primary_diagnosis: '{meta['diag']}',
      icd10_code: '{meta['icd10']}', umls_cui: '{meta['cui']}',
      digitized_summary: '{meta['summary']}',
      patient_education_summary: '{meta['edu']}',
      illustration_prompt: '{meta['prompt']}',
      confidence_score: 0.985,
      recommended_action: '{meta['action']}',
      evidence_citations: [
        'AHA Guidelines: Visual Aids & Patient Health Literacy in Clinical Care',
        'WHO ICD-10 Coding Standard ({meta['icd10']})',
        'EU AI Act & GDPR Art. 9 Compliance Protocol for Patient Education Portals'
      ],
      b64_json: '{b64_str}'
    }},\n"""
presets_js += "  };"

start_idx = content.find("const presets = {")
end_idx = content.find("return presets[pid] || {")

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + "const presets = " + presets_js + "\n  " + content[end_idx:]
    with open(hitl_panel_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("✅ Successfully updated SupervisoryHITLPanel.jsx with all 11 patient presets and FLUX.2-pro images!")
else:
    print("❌ Failed to locate presets object in SupervisoryHITLPanel.jsx")
