import os
from PIL import Image, ImageDraw, ImageFont

out_dir = r"flora-finder-ios\AppStoreScreenshots"
os.makedirs(out_dir, exist_ok=True)

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
    font_title = ImageFont.truetype('arialbd.ttf', 70)
    font_sub = ImageFont.truetype('arial.ttf', 36)
    font_card_title = ImageFont.truetype('arialbd.ttf', 44)
    font_body = ImageFont.truetype('arial.ttf', 30)
    font_body_bold = ImageFont.truetype('arialbd.ttf', 32)
    font_tag = ImageFont.truetype('arialbd.ttf', 26)
    font_stat_num = ImageFont.truetype('arialbd.ttf', 56)
    font_stat_label = ImageFont.truetype('arial.ttf', 24)
except Exception:
    font_title = font_sub = font_card_title = font_body = font_body_bold = font_tag = font_stat_num = font_stat_label = ImageFont.load_default()

# ----------------------------------------------------
# SCREENSHOT 1: Live Real-Time Scanner
# ----------------------------------------------------
s1 = create_bg(1290, 2796, (10, 26, 18), (5, 14, 10))
d1 = ImageDraw.Draw(s1)

d1.text((645, 160), 'REAL-TIME BOTANICAL LENS', font=font_title, fill=(52, 211, 153), anchor='mt')
d1.text((645, 260), 'Zero-Shutter Continuous Species Identification', font=font_sub, fill=(209, 250, 229), anchor='mt')

draw_rounded_card(d1, (80, 360, 1210, 2680), 80, fill=(18, 38, 28), outline=(52, 211, 153), width=4)
draw_rounded_card(d1, (110, 390, 1180, 2100), 60, fill=(12, 28, 20))

leaf_pts = [(645, 600), (950, 950), (980, 1350), (800, 1750), (645, 1900), (490, 1750), (310, 1350), (340, 950)]
d1.polygon(leaf_pts, fill=(24, 75, 48))
d1.line([(645, 650), (645, 1850)], fill=(40, 120, 80), width=16)

draw_rounded_card(d1, (260, 750, 1030, 1750), 30, fill=None, outline=(52, 211, 153), width=6)
d1.line([(240, 750), (320, 750)], fill=(52, 211, 153), width=12)
d1.line([(260, 730), (260, 810)], fill=(52, 211, 153), width=12)
d1.line([(970, 750), (1050, 750)], fill=(52, 211, 153), width=12)
d1.line([(1030, 730), (1030, 810)], fill=(52, 211, 153), width=12)

draw_rounded_card(d1, (360, 680, 930, 780), 50, fill=(16, 185, 129))
d1.text((645, 730), 'MONSTERA DELICIOSA • 98.4%', font=font_tag, fill=(255, 255, 255), anchor='mm')

draw_rounded_card(d1, (130, 2130, 1160, 2630), 50, fill=(28, 55, 42), outline=(52, 211, 153), width=2)
d1.text((180, 2190), 'Monstera Deliciosa', font=font_card_title, fill=(255, 255, 255))
d1.text((180, 2250), 'Swiss Cheese Plant • Araceae Family', font=font_sub, fill=(167, 243, 208))

draw_rounded_card(d1, (180, 2330, 560, 2400), 20, fill=(239, 68, 68))
d1.text((370, 2365), 'TOXIC TO PETS', font=font_tag, fill=(255, 255, 255), anchor='mm')

draw_rounded_card(d1, (590, 2330, 920, 2400), 20, fill=(16, 185, 129))
d1.text((755, 2365), '98.4% MATCH', font=font_tag, fill=(255, 255, 255), anchor='mm')

d1.text((180, 2460), 'Native to tropical forests of southern Mexico. Prized for iconic', font=font_body, fill=(229, 231, 235))
d1.text((180, 2510), 'natural leaf perforations (fenestrations).', font=font_body, fill=(229, 231, 235))

p1 = os.path.join(out_dir, '1_live_camera_scanner.png')
s1.save(p1, 'PNG')
print('Saved:', p1)

# ----------------------------------------------------
# SCREENSHOT 2: Smart Care Schedules & Pet Safety
# ----------------------------------------------------
s2 = create_bg(1290, 2796, (12, 24, 38), (6, 14, 24))
d2 = ImageDraw.Draw(s2)

d2.text((645, 160), 'SMART CARE GUIDES', font=font_title, fill=(56, 189, 248), anchor='mt')
d2.text((645, 260), 'Sunlight Lux, Watering Intervals & Pet Safety', font=font_sub, fill=(224, 242, 254), anchor='mt')

draw_rounded_card(d2, (80, 360, 1210, 2680), 80, fill=(18, 32, 50), outline=(56, 189, 248), width=4)

# Card 1: Sunlight
draw_rounded_card(d2, (130, 440, 1160, 840), 40, fill=(26, 46, 72), outline=(56, 189, 248), width=2)
d2.text((180, 490), 'Light Requirements', font=font_card_title, fill=(255, 255, 255))
d2.text((180, 560), 'Bright Indirect Sunlight', font=font_body_bold, fill=(56, 189, 248))
d2.text((180, 620), 'Optimal Lux Target: 1,500 - 2,500 Lux', font=font_body, fill=(224, 242, 254))
d2.text((180, 680), 'Avoid direct midday sun to prevent leaf scorching.', font=font_body, fill=(148, 163, 184))
draw_rounded_card(d2, (180, 750, 1110, 780), 15, fill=(15, 23, 42))
draw_rounded_card(d2, (180, 750, 850, 780), 15, fill=(56, 189, 248))

# Card 2: Watering
draw_rounded_card(d2, (130, 880, 1160, 1280), 40, fill=(26, 46, 72), outline=(56, 189, 248), width=2)
d2.text((180, 930), 'Hydration & Soil Schedule', font=font_card_title, fill=(255, 255, 255))
d2.text((180, 1000), 'Water Frequency: Every 7 - 10 Days', font=font_body_bold, fill=(56, 189, 248))
d2.text((180, 1060), 'Allow top 2 inches of soil to dry before soaking.', font=font_body, fill=(224, 242, 254))
d2.text((180, 1120), 'Soil pH: 5.5 - 7.0 (Peat & perlite blend)', font=font_body, fill=(148, 163, 184))
draw_rounded_card(d2, (180, 1190, 1110, 1220), 15, fill=(15, 23, 42))
draw_rounded_card(d2, (180, 1190, 720, 1220), 15, fill=(59, 130, 246))

# Card 3: Pet Toxicity
draw_rounded_card(d2, (130, 1320, 1160, 1820), 40, fill=(45, 20, 24), outline=(239, 68, 68), width=3)
d2.text((180, 1370), 'Pet Safety Analysis: TOXIC', font=font_card_title, fill=(248, 113, 113))
d2.text((180, 1450), 'Cats & Dogs: High Risk', font=font_body_bold, fill=(255, 255, 255))
d2.text((180, 1510), 'Contains insoluble calcium oxalate crystals that cause', font=font_body, fill=(254, 202, 202))
d2.text((180, 1560), 'oral irritation, drooling, and difficulty swallowing.', font=font_body, fill=(254, 202, 202))
d2.text((180, 1630), 'Action: Keep on elevated stands away from pets.', font=font_body_bold, fill=(239, 68, 68))

# Card 4: AI Chat
draw_rounded_card(d2, (130, 1860, 1160, 2580), 40, fill=(26, 46, 72), outline=(56, 189, 248), width=2)
d2.text((180, 1910), 'Ask FloraFinder AI', font=font_card_title, fill=(255, 255, 255))
draw_rounded_card(d2, (180, 1990, 980, 2110), 30, fill=(15, 23, 42))
d2.text((220, 2030), 'Why are my Monstera leaves turning yellow?', font=font_body, fill=(224, 242, 254))

draw_rounded_card(d2, (260, 2140, 1110, 2480), 30, fill=(30, 58, 90), outline=(56, 189, 248), width=1)
d2.text((300, 2180), 'FloraFinder AI:', font=font_body_bold, fill=(56, 189, 248))
d2.text((300, 2240), 'Yellow lower leaves are commonly caused by', font=font_body, fill=(255, 255, 255))
d2.text((300, 2290), 'overwatering or soil drainage issues. Check that', font=font_body, fill=(255, 255, 255))
d2.text((300, 2340), 'the pot has drainage holes and let soil dry out.', font=font_body, fill=(255, 255, 255))

p2 = os.path.join(out_dir, '2_care_schedule_and_toxicity.png')
s2.save(p2, 'PNG')
print('Saved:', p2)

# ----------------------------------------------------
# SCREENSHOT 3: Plant Doctor Mode Pathology Triage
# ----------------------------------------------------
s3 = create_bg(1290, 2796, (36, 18, 14), (20, 8, 6))
d3 = ImageDraw.Draw(s3)

d3.text((645, 160), 'PLANT DOCTOR MODE', font=font_title, fill=(251, 146, 60), anchor='mt')
d3.text((645, 260), 'AI Pathology Triage & Clinical Recovery Plans', font=font_sub, fill=(254, 215, 170), anchor='mt')

draw_rounded_card(d3, (80, 360, 1210, 2680), 80, fill=(45, 24, 18), outline=(251, 146, 60), width=4)

draw_rounded_card(d3, (130, 440, 1160, 920), 40, fill=(60, 32, 24), outline=(251, 146, 60), width=2)
d3.text((180, 490), 'Clinical Pathology Report', font=font_card_title, fill=(255, 255, 255))
d3.text((180, 570), 'Diagnosis: Anthracnose Leaf Spot', font=font_body_bold, fill=(251, 146, 60))
d3.text((180, 630), 'Pathogen Class: Fungal (Colletotrichum)', font=font_body, fill=(254, 215, 170))
d3.text((180, 690), 'Confidence Score: 94.2% (Gemini 2.0 Flash)', font=font_body, fill=(212, 212, 216))

draw_rounded_card(d3, (180, 770, 560, 840), 20, fill=(234, 88, 12))
d3.text((370, 805), 'SEVERITY: MODERATE', font=font_tag, fill=(255, 255, 255), anchor='mm')
draw_rounded_card(d3, (590, 770, 960, 840), 20, fill=(16, 185, 129))
d3.text((775, 805), 'CURABLE: YES (85%)', font=font_tag, fill=(255, 255, 255), anchor='mm')

draw_rounded_card(d3, (130, 960, 1160, 1480), 40, fill=(60, 32, 24), outline=(251, 146, 60), width=2)
d3.text((180, 1010), 'Detected Symptoms', font=font_card_title, fill=(255, 255, 255))
d3.text((180, 1090), '- Tan-brown lesions with dark halo margins on leaf edges', font=font_body, fill=(254, 215, 170))
d3.text((180, 1150), '- Early fungal spore formation along leaf vein apex', font=font_body, fill=(254, 215, 170))
d3.text((180, 1210), '- Accelerated leaf drop and localized chlorosis', font=font_body, fill=(254, 215, 170))
d3.text((180, 1270), '- Root moisture excess identified as primary vector', font=font_body, fill=(254, 215, 170))

draw_rounded_card(d3, (130, 1520, 1160, 2580), 40, fill=(60, 32, 24), outline=(251, 146, 60), width=2)
d3.text((180, 1570), '3-Step Treatment Protocol', font=font_card_title, fill=(255, 255, 255))

draw_rounded_card(d3, (180, 1660, 1110, 1880), 30, fill=(35, 16, 12))
d3.text((220, 1700), 'Step 1: Sanitize & Isolate', font=font_body_bold, fill=(251, 146, 60))
d3.text((220, 1750), 'Prune infected leaves with sterile shears. Isolate plant', font=font_body, fill=(255, 255, 255))
d3.text((220, 1800), 'from other specimens to prevent spore transmission.', font=font_body, fill=(255, 255, 255))

draw_rounded_card(d3, (180, 1920, 1110, 2140), 30, fill=(35, 16, 12))
d3.text((220, 1960), 'Step 2: Copper Fungicide / Neem Oil', font=font_body_bold, fill=(251, 146, 60))
d3.text((220, 2010), 'Apply organic copper fungicide spray to remaining foliage', font=font_body, fill=(255, 255, 255))
d3.text((220, 2060), 'every 7 days for 3 consecutive weeks.', font=font_body, fill=(255, 255, 255))

draw_rounded_card(d3, (180, 2180, 1110, 2400), 30, fill=(35, 16, 12))
d3.text((220, 2220), 'Step 3: Modify Airflow & Watering', font=font_body_bold, fill=(251, 146, 60))
d3.text((220, 2270), 'Water at the base only - keep foliage completely dry.', font=font_body, fill=(255, 255, 255))
d3.text((220, 2320), 'Increase ambient ventilation around the pot.', font=font_body, fill=(255, 255, 255))

p3 = os.path.join(out_dir, '3_doctor_mode_pathology.png')
s3.save(p3, 'PNG')
print('Saved:', p3)

# ----------------------------------------------------
# SCREENSHOT 4: Offline Field Journal & Map
# ----------------------------------------------------
s4 = create_bg(1290, 2796, (20, 16, 36), (10, 8, 20))
d4 = ImageDraw.Draw(s4)

d4.text((645, 160), 'OFFLINE FIELD JOURNAL', font=font_title, fill=(192, 132, 252), anchor='mt')
d4.text((645, 260), 'Catalog Botanical Discoveries Anywhere Without Cellular', font=font_sub, fill=(243, 232, 255), anchor='mt')

draw_rounded_card(d4, (80, 360, 1210, 2680), 80, fill=(30, 24, 52), outline=(192, 132, 252), width=4)

draw_rounded_card(d4, (130, 440, 1160, 540), 30, fill=(45, 36, 78))
d4.text((180, 480), 'Search 12 saved specimens...', font=font_body, fill=(192, 132, 252))

draw_rounded_card(d4, (130, 580, 1160, 980), 35, fill=(42, 34, 72), outline=(192, 132, 252), width=2)
d4.text((180, 620), 'Monstera Deliciosa', font=font_card_title, fill=(255, 255, 255))
d4.text((180, 680), 'Swiss Cheese Plant • Living Room Shelf', font=font_body, fill=(216, 180, 254))
d4.text((180, 740), 'Logged: Today, 2:45 PM • Confidence: 98.4%', font=font_stat_label, fill=(168, 162, 158))
draw_rounded_card(d4, (180, 820, 520, 890), 20, fill=(239, 68, 68))
d4.text((350, 855), 'TOXIC TO PETS', font=font_tag, fill=(255, 255, 255), anchor='mm')
draw_rounded_card(d4, (550, 820, 850, 890), 20, fill=(16, 185, 129))
d4.text((700, 855), 'HEALTHY (100%)', font=font_tag, fill=(255, 255, 255), anchor='mm')

draw_rounded_card(d4, (130, 1020, 1160, 1420), 35, fill=(42, 34, 72), outline=(192, 132, 252), width=1)
d4.text((180, 1060), 'Ficus Lyrata (Fiddle Leaf Fig)', font=font_card_title, fill=(255, 255, 255))
d4.text((180, 1120), 'Moraceae Family • Home Office Window', font=font_body, fill=(216, 180, 254))
d4.text((180, 1180), 'Logged: Yesterday, 10:15 AM • Confidence: 96.1%', font=font_stat_label, fill=(168, 162, 158))
draw_rounded_card(d4, (180, 1260, 520, 1330), 20, fill=(239, 68, 68))
d4.text((350, 1295), 'TOXIC TO PETS', font=font_tag, fill=(255, 255, 255), anchor='mm')
draw_rounded_card(d4, (550, 1260, 880, 1330), 20, fill=(234, 88, 12))
d4.text((715, 1295), 'CARE NEEDED (60%)', font=font_tag, fill=(255, 255, 255), anchor='mm')

draw_rounded_card(d4, (130, 1460, 1160, 1860), 35, fill=(42, 34, 72), outline=(192, 132, 252), width=1)
d4.text((180, 1500), 'Chlorophytum Comosum (Spider Plant)', font=font_card_title, fill=(255, 255, 255))
d4.text((180, 1560), 'Asparagaceae Family • Patio Hanging Basket', font=font_body, fill=(216, 180, 254))
d4.text((180, 1620), 'Logged: 3 days ago • Confidence: 99.1%', font=font_stat_label, fill=(168, 162, 158))
draw_rounded_card(d4, (180, 1700, 520, 1770), 20, fill=(16, 185, 129))
d4.text((350, 1735), 'PET SAFE', font=font_tag, fill=(255, 255, 255), anchor='mm')
draw_rounded_card(d4, (550, 1700, 850, 1770), 20, fill=(16, 185, 129))
d4.text((700, 1735), 'THRIVING (95%)', font=font_tag, fill=(255, 255, 255), anchor='mm')

draw_rounded_card(d4, (130, 1920, 1160, 2580), 40, fill=(48, 38, 80), outline=(192, 132, 252), width=2)
d4.text((180, 1970), 'Discovery Statistics', font=font_card_title, fill=(255, 255, 255))
d4.text((220, 2070), '12', font=font_stat_num, fill=(192, 132, 252))
d4.text((220, 2140), 'Total Species', font=font_stat_label, fill=(216, 180, 254))
d4.text((560, 2070), '8', font=font_stat_num, fill=(16, 185, 129))
d4.text((560, 2140), 'Pet Safe', font=font_stat_label, fill=(216, 180, 254))
d4.text((900, 2070), '100%', font=font_stat_num, fill=(56, 189, 248))
d4.text((900, 2140), 'Offline Synced', font=font_stat_label, fill=(216, 180, 254))

d4.text((180, 2260), 'All specimens are indexed on local storage with full GPS', font=font_body, fill=(243, 232, 255))
d4.text((180, 2310), 'coordinates and offline high-resolution reference data.', font=font_body, fill=(243, 232, 255))

p4 = os.path.join(out_dir, '4_offline_field_journal.png')
s4.save(p4, 'PNG')
print('Saved:', p4)
