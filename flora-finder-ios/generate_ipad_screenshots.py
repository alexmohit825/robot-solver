import os
from PIL import Image, ImageDraw, ImageFont

out_dir = r"flora-finder-ios\AppStoreScreenshots"
os.makedirs(out_dir, exist_ok=True)

W, H = 2048, 2732

def draw_rounded_card(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)

def create_bg(w, h, top_color, bottom_color):
    base = Image.new('RGB', (w, h), top_color)
    top_r, top_g, top_b = top_color
    bot_r, bot_g, bot_b = bottom_color
    draw = ImageDraw.Draw(base)
    for y in range(h):
        ratio = y / h
        r = int(top_r + (bot_r - top_r) * ratio)
        g = int(top_g + (bot_g - top_g) * ratio)
        b = int(top_b + (bot_b - top_b) * ratio)
        draw.line([(0, y), (w, y)], fill=(r, g, b))
    return base

try:
    font_title = ImageFont.truetype('arialbd.ttf', 88)
    font_sub = ImageFont.truetype('arial.ttf', 44)
    font_card_title = ImageFont.truetype('arialbd.ttf', 50)
    font_body = ImageFont.truetype('arial.ttf', 36)
    font_body_bold = ImageFont.truetype('arialbd.ttf', 38)
    font_tag = ImageFont.truetype('arialbd.ttf', 32)
    font_stat_num = ImageFont.truetype('arialbd.ttf', 72)
    font_stat_label = ImageFont.truetype('arial.ttf', 30)
except Exception:
    font_title = font_sub = font_card_title = font_body = font_body_bold = font_tag = font_stat_num = font_stat_label = ImageFont.load_default()

# ----------------------------------------------------
# IPAD SCREENSHOT 1: Live Real-Time Scanner
# ----------------------------------------------------
s1 = create_bg(W, H, (10, 26, 18), (5, 14, 10))
d1 = ImageDraw.Draw(s1)

d1.text((W // 2, 140), 'REAL-TIME BOTANICAL LENS', font=font_title, fill=(52, 211, 153), anchor='mt')
d1.text((W // 2, 250), 'Zero-Shutter Neural Engine Species Identification', font=font_sub, fill=(209, 250, 229), anchor='mt')

# iPad Frame
draw_rounded_card(d1, (100, 360, W - 100, H - 100), 60, fill=(18, 38, 28), outline=(52, 211, 153), width=4)

# Left Column: Viewfinder (width: 1000)
draw_rounded_card(d1, (140, 400, 1140, H - 140), 40, fill=(12, 28, 20), outline=(34, 197, 94), width=2)

# Simulated Leaf in Viewfinder
leaf_pts = [(640, 700), (980, 1150), (1020, 1600), (820, 2100), (640, 2300), (460, 2100), (260, 1600), (300, 1150)]
d1.polygon(leaf_pts, fill=(24, 75, 48))
d1.line([(640, 750), (640, 2250)], fill=(40, 120, 80), width=20)

# AR Reticle Box
draw_rounded_card(d1, (240, 900, 1040, 2150), 30, fill=None, outline=(52, 211, 153), width=6)
# Floating Tag
draw_rounded_card(d1, (360, 820, 920, 930), 50, fill=(16, 185, 129))
d1.text((640, 875), 'MONSTERA DELICIOSA • 98.4%', font=font_tag, fill=(255, 255, 255), anchor='mm')

# Right Column: iPad Detail Dashboard (width: 720)
# Card 1: Specimen Header
draw_rounded_card(d1, (1180, 400, W - 140, 950), 35, fill=(28, 55, 42), outline=(52, 211, 153), width=2)
d1.text((1220, 450), 'Monstera Deliciosa', font=font_card_title, fill=(255, 255, 255))
d1.text((1220, 520), 'Swiss Cheese Plant • Araceae Family', font=font_sub, fill=(167, 243, 208))

draw_rounded_card(d1, (1220, 600, 1550, 680), 20, fill=(239, 68, 68))
d1.text((1385, 640), 'TOXIC TO PETS', font=font_tag, fill=(255, 255, 255), anchor='mm')

draw_rounded_card(d1, (1580, 600, 1880, 680), 20, fill=(16, 185, 129))
d1.text((1730, 640), '98.4% MATCH', font=font_tag, fill=(255, 255, 255), anchor='mm')

d1.text((1220, 730), 'Native to tropical rainforests. Famous for iconic', font=font_body, fill=(229, 231, 235))
d1.text((1220, 780), 'natural fenestrations and fast climbing growth.', font=font_body, fill=(229, 231, 235))
d1.text((1220, 840), 'Growth Rate: Fast (1-2 ft per season)', font=font_body_bold, fill=(52, 211, 153))

# Card 2: Care Telemetry
draw_rounded_card(d1, (1180, 990, W - 140, 1750), 35, fill=(28, 55, 42), outline=(52, 211, 153), width=2)
d1.text((1220, 1040), 'Care Telemetry', font=font_card_title, fill=(255, 255, 255))

d1.text((1220, 1130), '☀️ Light Target: 1,500 - 2,500 Lux (Bright Indirect)', font=font_body, fill=(224, 242, 254))
draw_rounded_card(d1, (1220, 1190, 1860, 1225), 15, fill=(15, 23, 42))
draw_rounded_card(d1, (1220, 1190, 1680, 1225), 15, fill=(52, 211, 153))

d1.text((1220, 1280), '💧 Water Interval: Every 7 - 10 Days', font=font_body, fill=(224, 242, 254))
draw_rounded_card(d1, (1220, 1340, 1860, 1375), 15, fill=(15, 23, 42))
draw_rounded_card(d1, (1220, 1340, 1600, 1375), 15, fill=(59, 130, 246))

d1.text((1220, 1430), '🌡️ Optimal Temp: 65 - 85 deg F (18 - 29 deg C)', font=font_body, fill=(224, 242, 254))
d1.text((1220, 1510), '🌱 Soil Mixture: Peat, perlite & orchid bark mix', font=font_body, fill=(224, 242, 254))
d1.text((1220, 1590), '🔬 Apple Vision Frame Rate: 60 FPS continuous', font=font_body_bold, fill=(52, 211, 153))
d1.text((1220, 1660), '📍 Geotagging: Active (Saved to Field Journal)', font=font_body, fill=(167, 243, 208))

# Card 3: Quick Action
draw_rounded_card(d1, (1180, 1790, W - 140, H - 140), 35, fill=(20, 48, 34), outline=(52, 211, 153), width=2)
d1.text((1220, 1840), 'Clinical Diagnostic Triage', font=font_card_title, fill=(255, 255, 255))
d1.text((1220, 1920), 'Foliage appears healthy with zero active lesion spots.', font=font_body, fill=(209, 250, 229))
d1.text((1220, 1980), 'Tap Doctor Mode below to run Gemini deep pathology.', font=font_body, fill=(167, 243, 208))
draw_rounded_card(d1, (1220, 2080, 1860, 2180), 30, fill=(16, 185, 129))
d1.text((1540, 2130), 'OPEN PLANT DOCTOR TRIAGE', font=font_tag, fill=(255, 255, 255), anchor='mm')

p1 = os.path.join(out_dir, 'ipad_1_live_camera_scanner.png')
s1.save(p1, 'PNG')
print('Saved iPad 1:', p1)

# ----------------------------------------------------
# IPAD SCREENSHOT 2: Care Schedules & Pet Safety
# ----------------------------------------------------
s2 = create_bg(W, H, (12, 24, 38), (6, 14, 24))
d2 = ImageDraw.Draw(s2)

d2.text((W // 2, 140), 'SMART CARE GUIDES & PET SAFETY', font=font_title, fill=(56, 189, 248), anchor='mt')
d2.text((W // 2, 250), 'Precision Environmental Telemetry & Toxicity Rationale', font=font_sub, fill=(224, 242, 254), anchor='mt')

draw_rounded_card(d2, (100, 360, W - 100, H - 100), 60, fill=(18, 32, 50), outline=(56, 189, 248), width=4)

# 2x2 Grid Layout
# Col 1, Row 1: Light Requirements
draw_rounded_card(d2, (140, 400, 990, 1150), 35, fill=(26, 46, 72), outline=(56, 189, 248), width=2)
d2.text((180, 450), 'Sunlight Lux Telemetry', font=font_card_title, fill=(255, 255, 255))
d2.text((180, 530), 'Optimal Target: 1,500 - 2,500 Lux', font=font_body_bold, fill=(56, 189, 248))
d2.text((180, 600), 'Exposure: Bright Indirect Light', font=font_body, fill=(224, 242, 254))
d2.text((180, 660), 'Tolerates medium shade; direct midday rays burn', font=font_body, fill=(148, 163, 184))
d2.text((180, 720), 'delicate fenestrated leaves.', font=font_body, fill=(148, 163, 184))
draw_rounded_card(d2, (180, 820, 950, 860), 15, fill=(15, 23, 42))
draw_rounded_card(d2, (180, 820, 780, 860), 15, fill=(56, 189, 248))
d2.text((180, 910), 'Placement: 3-5 feet from East/South window', font=font_body_bold, fill=(56, 189, 248))

# Col 2, Row 1: Water & Soil
draw_rounded_card(d2, (1030, 400, W - 140, 1150), 35, fill=(26, 46, 72), outline=(56, 189, 248), width=2)
d2.text((1070, 450), 'Hydration & Soil Schedule', font=font_card_title, fill=(255, 255, 255))
d2.text((1070, 530), 'Interval: Every 7 - 10 Days', font=font_body_bold, fill=(56, 189, 248))
d2.text((1070, 600), 'Topsoil Rule: Allow top 2 inches to dry fully', font=font_body, fill=(224, 242, 254))
d2.text((1070, 660), 'Target Soil pH: 5.5 - 7.0 (Slightly Acidic)', font=font_body, fill=(148, 163, 184))
d2.text((1070, 720), 'Potting Mix: Chunky aroid mix with perlite', font=font_body, fill=(148, 163, 184))
draw_rounded_card(d2, (1070, 820, 1860, 860), 15, fill=(15, 23, 42))
draw_rounded_card(d2, (1070, 820, 1600, 860), 15, fill=(59, 130, 246))
d2.text((1070, 910), 'Drainage: Essential - prevents root rot pathogen', font=font_body_bold, fill=(56, 189, 248))

# Col 1, Row 2: Pet Safety Analysis (Alert Box)
draw_rounded_card(d2, (140, 1190, 990, 2200), 35, fill=(45, 20, 24), outline=(239, 68, 68), width=3)
d2.text((180, 1240), 'Pet Safety Analysis: TOXIC', font=font_card_title, fill=(248, 113, 113))
d2.text((180, 1330), 'Cats & Dogs: High Clinical Risk', font=font_body_bold, fill=(255, 255, 255))
d2.text((180, 1410), 'Biochemical Mechanism:', font=font_body_bold, fill=(248, 113, 113))
d2.text((180, 1470), 'Contains insoluble needle-like calcium oxalate', font=font_body, fill=(254, 202, 202))
d2.text((180, 1530), 'crystals (raphides) that pierce mucosal tissues', font=font_body, fill=(254, 202, 202))
d2.text((180, 1590), 'when chewed, triggering intense pain.', font=font_body, fill=(254, 202, 202))
d2.text((180, 1680), 'Key Symptoms in Pets:', font=font_body_bold, fill=(255, 255, 255))
d2.text((180, 1740), '- Severe oral irritation & swelling', font=font_body, fill=(254, 202, 202))
d2.text((180, 1800), '- Excessive hypersalivation (drooling)', font=font_body, fill=(254, 202, 202))
d2.text((180, 1860), '- Difficulty swallowing & vomiting', font=font_body, fill=(254, 202, 202))
d2.text((180, 1950), 'Recommendation: Keep out of reach of pets', font=font_body_bold, fill=(239, 68, 68))

# Col 2, Row 2: AI Botanist Chat
draw_rounded_card(d2, (1030, 1190, W - 140, 2200), 35, fill=(26, 46, 72), outline=(56, 189, 248), width=2)
d2.text((1070, 1240), 'Ask FloraFinder AI Botanist', font=font_card_title, fill=(255, 255, 255))

draw_rounded_card(d2, (1070, 1330, 1860, 1490), 25, fill=(15, 23, 42))
d2.text((1100, 1370), 'Why are my Monstera leaf tips turning brown?', font=font_body, fill=(224, 242, 254))

draw_rounded_card(d2, (1070, 1530, 1860, 1980), 25, fill=(30, 58, 90), outline=(56, 189, 248), width=1)
d2.text((1100, 1570), 'FloraFinder AI Botanist:', font=font_body_bold, fill=(56, 189, 248))
d2.text((1100, 1630), 'Crispy brown tips indicate low ambient humidity', font=font_body, fill=(255, 255, 255))
d2.text((1100, 1690), '(below 50%) or tap water mineral accumulation.', font=font_body, fill=(255, 255, 255))
d2.text((1100, 1750), 'Use filtered water and mist foliage weekly.', font=font_body, fill=(255, 255, 255))
d2.text((1100, 1830), 'If tips are soft and dark, reduce watering frequency.', font=font_body, fill=(167, 243, 208))

# Bottom Bar
draw_rounded_card(d2, (140, 2240, W - 140, H - 140), 30, fill=(15, 28, 45))
d2.text((180, 2290), 'Environment Monitored: Living Room • Offline Mode: Ready • Sync: Active', font=font_body, fill=(148, 163, 184))

p2 = os.path.join(out_dir, 'ipad_2_care_schedule_and_toxicity.png')
s2.save(p2, 'PNG')
print('Saved iPad 2:', p2)

# ----------------------------------------------------
# IPAD SCREENSHOT 3: Plant Doctor Mode Pathology Triage
# ----------------------------------------------------
s3 = create_bg(W, H, (36, 18, 14), (20, 8, 6))
d3 = ImageDraw.Draw(s3)

d3.text((W // 2, 140), 'PLANT DOCTOR MODE', font=font_title, fill=(251, 146, 60), anchor='mt')
d3.text((W // 2, 250), 'Multimodal AI Pathology Triage & Recovery Protocols', font=font_sub, fill=(254, 215, 170), anchor='mt')

draw_rounded_card(d3, (100, 360, W - 100, H - 100), 60, fill=(45, 24, 18), outline=(251, 146, 60), width=4)

# Top Clinical Summary Card
draw_rounded_card(d3, (140, 400, W - 140, 950), 35, fill=(60, 32, 24), outline=(251, 146, 60), width=2)
d3.text((180, 450), 'Clinical Pathology Diagnosis', font=font_card_title, fill=(255, 255, 255))
d3.text((180, 530), 'Pathology: Anthracnose Leaf Spot (Colletotrichum Fungi)', font=font_body_bold, fill=(251, 146, 60))
d3.text((180, 600), 'Confidence: 94.2% • Engine: Gemini 2.0 Flash Multimodal Analysis', font=font_body, fill=(254, 215, 170))

draw_rounded_card(d3, (180, 680, 650, 760), 20, fill=(234, 88, 12))
d3.text((415, 720), 'SEVERITY: MODERATE', font=font_tag, fill=(255, 255, 255), anchor='mm')
draw_rounded_card(d3, (690, 680, 1150, 760), 20, fill=(16, 185, 129))
d3.text((920, 720), 'PROGNOSIS: 85% RECOVERY', font=font_tag, fill=(255, 255, 255), anchor='mm')

d3.text((180, 810), 'Identified on: Monstera Deliciosa (Swiss Cheese Plant)', font=font_body, fill=(229, 231, 235))
d3.text((180, 870), 'Primary Vector: Water pooling on leaf margins combined with stagnant indoor air.', font=font_body, fill=(212, 212, 216))

# Left Column: Symptoms (width: 850)
draw_rounded_card(d3, (140, 990, 990, 2200), 35, fill=(60, 32, 24), outline=(251, 146, 60), width=2)
d3.text((180, 1040), 'Detected Foliage Symptoms', font=font_card_title, fill=(255, 255, 255))

d3.text((180, 1140), '- Tan to dark brown circular necrotic lesions', font=font_body, fill=(254, 215, 170))
d3.text((180, 1200), '- Distinct yellow chlorotic halos around lesions', font=font_body, fill=(254, 215, 170))
d3.text((180, 1260), '- Premature leaf senescence along lower canopy', font=font_body, fill=(254, 215, 170))
d3.text((180, 1320), '- Early fungal spore formation along leaf vein apex', font=font_body, fill=(254, 215, 170))
d3.text((180, 1380), '- Elevated moisture saturation in root substrate', font=font_body, fill=(254, 215, 170))

draw_rounded_card(d3, (180, 1500, 950, 2140), 25, fill=(35, 16, 12))
d3.text((210, 1540), 'Pathogen Profile:', font=font_body_bold, fill=(251, 146, 60))
d3.text((210, 1600), 'Colletotrichum fungi thrive in warm, humid', font=font_body, fill=(255, 255, 255))
d3.text((210, 1660), 'environments with overhead wetting. Left', font=font_body, fill=(255, 255, 255))
d3.text((210, 1720), 'untreated, spores rapidly spread to adjacent', font=font_body, fill=(255, 255, 255))
d3.text((210, 1780), 'houseplants through water splashing.', font=font_body, fill=(255, 255, 255))
d3.text((210, 1860), 'Urgency: Moderate (Initiate protocol within 48h)', font=font_body_bold, fill=(234, 88, 12))

# Right Column: 3-Step Treatment Protocol (width: 850)
draw_rounded_card(d3, (1030, 990, W - 140, 2200), 35, fill=(60, 32, 24), outline=(251, 146, 60), width=2)
d3.text((1070, 1040), '3-Step Clinical Recovery Protocol', font=font_card_title, fill=(255, 255, 255))

draw_rounded_card(d3, (1070, 1130, 1860, 1440), 25, fill=(35, 16, 12))
d3.text((1100, 1160), 'Step 1: Sanitize & Isolate', font=font_body_bold, fill=(251, 146, 60))
d3.text((1100, 1220), 'Prune infected leaves with 70% isopropyl alcohol', font=font_body, fill=(255, 255, 255))
d3.text((1100, 1280), 'sterilized shears. Separate plant from others.', font=font_body, fill=(255, 255, 255))
d3.text((1100, 1340), 'Safely dispose of clippings away from compost.', font=font_body, fill=(212, 212, 216))

draw_rounded_card(d3, (1070, 1480, 1860, 1790), 25, fill=(35, 16, 12))
d3.text((1100, 1510), 'Step 2: Copper Fungicide / Neem Oil Spray', font=font_body_bold, fill=(251, 146, 60))
d3.text((1100, 1570), 'Apply organic copper-based fungicide to foliage.', font=font_body, fill=(255, 255, 255))
d3.text((1100, 1630), 'Spray top and undersides every 7 days for 3 weeks.', font=font_body, fill=(255, 255, 255))
d3.text((1100, 1690), 'Prevents remaining spore germination.', font=font_body, fill=(212, 212, 216))

draw_rounded_card(d3, (1070, 1830, 1860, 2140), 25, fill=(35, 16, 12))
d3.text((1100, 1860), 'Step 3: Modify Airflow & Base Watering', font=font_body_bold, fill=(251, 146, 60))
d3.text((1100, 1920), 'Water at the pot base only - keep leaves dry.', font=font_body, fill=(255, 255, 255))
d3.text((1100, 1980), 'Increase ambient room air circulation with a fan.', font=font_body, fill=(255, 255, 255))
d3.text((1100, 2040), 'Allow topsoil to dry before subsequent watering.', font=font_body, fill=(212, 212, 216))

# Bottom Bar
draw_rounded_card(d3, (140, 2240, W - 140, H - 140), 30, fill=(25, 12, 10))
d3.text((180, 2290), 'Pathology Case #FF-2026-08 • Saved to Clinical History • Follow-up Reminder: 7 Days', font=font_body, fill=(212, 212, 216))

p3 = os.path.join(out_dir, 'ipad_3_doctor_mode_pathology.png')
s3.save(p3, 'PNG')
print('Saved iPad 3:', p3)

# ----------------------------------------------------
# IPAD SCREENSHOT 4: Offline Field Journal & Expedition Log
# ----------------------------------------------------
s4 = create_bg(W, H, (20, 16, 36), (10, 8, 20))
d4 = ImageDraw.Draw(s4)

d4.text((W // 2, 140), 'OFFLINE FIELD JOURNAL', font=font_title, fill=(192, 132, 252), anchor='mt')
d4.text((W // 2, 250), 'Catalog, Search & Analyze Discoveries Without Cellular Service', font=font_sub, fill=(243, 232, 255), anchor='mt')

draw_rounded_card(d4, (100, 360, W - 100, H - 100), 60, fill=(30, 24, 52), outline=(192, 132, 252), width=4)

# Search Bar
draw_rounded_card(d4, (140, 400, W - 140, 520), 30, fill=(45, 36, 78))
d4.text((180, 445), '🔍  Search 12 indexed botanical specimens across all journals...', font=font_body, fill=(192, 132, 252))

# 2x2 Grid of Specimen Cards
# Item 1: Monstera
draw_rounded_card(d4, (140, 560, 990, 1340), 35, fill=(42, 34, 72), outline=(192, 132, 252), width=2)
d4.text((180, 600), 'Monstera Deliciosa', font=font_card_title, fill=(255, 255, 255))
d4.text((180, 670), 'Swiss Cheese Plant • Living Room Shelf', font=font_body, fill=(216, 180, 254))
d4.text((180, 740), '📅 Logged: Today, 2:45 PM • Confidence: 98.4%', font=font_stat_label, fill=(168, 162, 158))
d4.text((180, 800), '📍 GPS: 37.7749 deg N, 122.4194 deg W', font=font_stat_label, fill=(168, 162, 158))
draw_rounded_card(d4, (180, 880, 580, 960), 20, fill=(239, 68, 68))
d4.text((380, 920), 'TOXIC TO PETS', font=font_tag, fill=(255, 255, 255), anchor='mm')
draw_rounded_card(d4, (610, 880, 950, 960), 20, fill=(16, 185, 129))
d4.text((780, 920), 'HEALTHY (100%)', font=font_tag, fill=(255, 255, 255), anchor='mm')
d4.text((180, 1020), 'Care: 1,500-2,500 Lux • Water Every 7-10 Days', font=font_body, fill=(243, 232, 255))
d4.text((180, 1080), 'Phenology: Active fenestrated leaf unfurling', font=font_body, fill=(192, 132, 252))

# Item 2: Fiddle Leaf Fig
draw_rounded_card(d4, (1030, 560, W - 140, 1340), 35, fill=(42, 34, 72), outline=(192, 132, 252), width=1)
d4.text((1070, 600), 'Ficus Lyrata (Fiddle Leaf Fig)', font=font_card_title, fill=(255, 255, 255))
d4.text((1070, 670), 'Moraceae Family • Home Office Window', font=font_body, fill=(216, 180, 254))
d4.text((1070, 740), '📅 Logged: Yesterday, 10:15 AM • Confidence: 96.1%', font=font_stat_label, fill=(168, 162, 158))
d4.text((1070, 800), '📍 GPS: 37.7751 deg N, 122.4189 deg W', font=font_stat_label, fill=(168, 162, 158))
draw_rounded_card(d4, (1070, 880, 1470, 960), 20, fill=(239, 68, 68))
d4.text((1270, 920), 'TOXIC TO PETS', font=font_tag, fill=(255, 255, 255), anchor='mm')
draw_rounded_card(d4, (1500, 880, 1860, 960), 20, fill=(234, 88, 12))
d4.text((1680, 920), 'CARE NEEDED', font=font_tag, fill=(255, 255, 255), anchor='mm')
d4.text((1070, 1020), 'Care: Bright Direct Morning Light • High Humidity', font=font_body, fill=(243, 232, 255))
d4.text((1070, 1080), 'Note: Rotate pot weekly to balance trunk growth', font=font_body, fill=(192, 132, 252))

# Item 3: Spider Plant
draw_rounded_card(d4, (140, 1380, 990, 2140), 35, fill=(42, 34, 72), outline=(192, 132, 252), width=1)
d4.text((180, 1420), 'Chlorophytum (Spider Plant)', font=font_card_title, fill=(255, 255, 255))
d4.text((180, 1490), 'Asparagaceae Family • Patio Basket', font=font_body, fill=(216, 180, 254))
d4.text((180, 1560), '📅 Logged: 3 days ago • Confidence: 99.1%', font=font_stat_label, fill=(168, 162, 158))
d4.text((180, 1620), '📍 GPS: 37.7760 deg N, 122.4170 deg W', font=font_stat_label, fill=(168, 162, 158))
draw_rounded_card(d4, (180, 1700, 560, 1780), 20, fill=(16, 185, 129))
d4.text((370, 1740), 'PET SAFE', font=font_tag, fill=(255, 255, 255), anchor='mm')
draw_rounded_card(d4, (590, 1700, 950, 1780), 20, fill=(16, 185, 129))
d4.text((770, 1740), 'THRIVING (95%)', font=font_tag, fill=(255, 255, 255), anchor='mm')
d4.text((180, 1840), 'Care: Adaptable Light • Water When Soil Dries', font=font_body, fill=(243, 232, 255))
d4.text((180, 1900), 'Phenology: Producing healthy plantlet runners', font=font_body, fill=(192, 132, 252))

# Item 4: Sansevieria
draw_rounded_card(d4, (1030, 1380, W - 140, 2140), 35, fill=(42, 34, 72), outline=(192, 132, 252), width=1)
d4.text((1070, 1420), 'Sansevieria (Snake Plant)', font=font_card_title, fill=(255, 255, 255))
d4.text((1070, 1490), 'Asparagaceae Family • Bedroom Corner', font=font_body, fill=(216, 180, 254))
d4.text((1070, 1560), '📅 Logged: 5 days ago • Confidence: 99.5%', font=font_stat_label, fill=(168, 162, 158))
d4.text((1070, 1620), '📍 GPS: 37.7745 deg N, 122.4200 deg W', font=font_stat_label, fill=(168, 162, 158))
draw_rounded_card(d4, (1070, 1700, 1470, 1780), 20, fill=(239, 68, 68))
d4.text((1270, 1740), 'TOXIC TO PETS', font=font_tag, fill=(255, 255, 255), anchor='mm')
draw_rounded_card(d4, (1500, 1700, 1860, 1780), 20, fill=(16, 185, 129))
d4.text((1680, 1740), 'HARDY (100%)', font=font_tag, fill=(255, 255, 255), anchor='mm')
d4.text((1070, 1840), 'Care: Low to Bright Light • Water Monthly', font=font_body, fill=(243, 232, 255))
d4.text((1070, 1900), 'Note: Extremely drought tolerant; avoid overwatering', font=font_body, fill=(192, 132, 252))

# Bottom Stats Bar
draw_rounded_card(d4, (140, 2180, W - 140, H - 140), 35, fill=(48, 38, 80), outline=(192, 132, 252), width=2)
d4.text((180, 2220), 'Botanical Expedition Summary', font=font_card_title, fill=(255, 255, 255))

d4.text((220, 2320), '12', font=font_stat_num, fill=(192, 132, 252))
d4.text((220, 2410), 'Total Species Logged', font=font_stat_label, fill=(216, 180, 254))

d4.text((650, 2320), '8', font=font_stat_num, fill=(16, 185, 129))
d4.text((650, 2410), 'Pet Safe Varieties', font=font_stat_label, fill=(216, 180, 254))

d4.text((1080, 2320), '100%', font=font_stat_num, fill=(56, 189, 248))
d4.text((1080, 2410), 'Offline Indexed (Zero Cell Required)', font=font_stat_label, fill=(216, 180, 254))

d4.text((1580, 2320), '60 FPS', font=font_stat_num, fill=(52, 211, 153))
d4.text((1580, 2410), 'Apple Neural Engine', font=font_stat_label, fill=(216, 180, 254))

p4 = os.path.join(out_dir, 'ipad_4_offline_field_journal.png')
s4.save(p4, 'PNG')
print('Saved iPad 4:', p4)
