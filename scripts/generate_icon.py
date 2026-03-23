#!/usr/bin/env python3
"""Generate ScoreKeeper app icon - 1024x1024px"""

from PIL import Image, ImageDraw, ImageFont
import math
import os

SIZE = 1024

def lerp_color(c1, c2, t):
    return tuple(int(c1[i] + t * (c2[i] - c1[i])) for i in range(3))

def draw_star(draw, cx, cy, r_outer, r_inner, n_points, fill, outline=None):
    """Draw an n-pointed star centered at (cx, cy)."""
    points = []
    for i in range(n_points * 2):
        angle = math.pi * i / n_points - math.pi / 2
        r = r_outer if i % 2 == 0 else r_inner
        points.append((cx + r * math.cos(angle), cy + r * math.sin(angle)))
    draw.polygon(points, fill=fill, outline=outline)

def create_icon():
    img = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # --- Background gradient (top-left lighter, bottom-right darker) ---
    c_tl = (120, 110, 255)   # #786EFF
    c_br = (72, 58, 185)     # #483AB9
    for y in range(SIZE):
        t = y / SIZE
        r = int(c_tl[0] + t * (c_br[0] - c_tl[0]))
        g = int(c_tl[1] + t * (c_br[1] - c_tl[1]))
        b = int(c_tl[2] + t * (c_br[2] - c_tl[2]))
        draw.line([(0, y), (SIZE - 1, y)], fill=(r, g, b, 255))

    # --- Subtle radial glow behind podium (upper center) ---
    glow_cx, glow_cy = SIZE // 2, SIZE // 2 - 40
    glow_r = 340
    glow_img = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_img)
    for step in range(60, 0, -1):
        r_step = int(glow_r * step / 60)
        alpha = int(28 * (1 - step / 60))
        glow_draw.ellipse(
            [glow_cx - r_step, glow_cy - r_step, glow_cx + r_step, glow_cy + r_step],
            fill=(255, 255, 255, alpha)
        )
    img = Image.alpha_composite(img, glow_img)
    draw = ImageDraw.Draw(img)

    # --- Podium geometry ---
    bar_w = 190
    gap = 28
    bottom_y = 820
    # heights: [2nd/left, 1st/center, 3rd/right]
    heights = [300, 440, 210]
    total_w = 3 * bar_w + 2 * gap
    start_x = (SIZE - total_w) // 2  # 99

    bars = [
        {"x": start_x,                    "h": heights[0], "place": 2, "opacity": 0.78},
        {"x": start_x + bar_w + gap,      "h": heights[1], "place": 1, "opacity": 0.95},
        {"x": start_x + 2 * (bar_w + gap),"h": heights[2], "place": 3, "opacity": 0.65},
    ]

    # Draw bars
    for bar in bars:
        x = bar["x"]
        top = bottom_y - bar["h"]
        alpha = int(255 * bar["opacity"])
        draw.rounded_rectangle([x, top, x + bar_w, bottom_y], radius=18, fill=(255, 255, 255, alpha))

    # --- Place numbers on bars ---
    font_path = None
    for fp in [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
        "/usr/share/fonts/TTF/DejaVuSans-Bold.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
    ]:
        if os.path.exists(fp):
            font_path = fp
            break

    num_font = ImageFont.truetype(font_path, 110) if font_path else ImageFont.load_default()
    label_font = ImageFont.truetype(font_path, 52) if font_path else ImageFont.load_default()

    for bar in bars:
        x = bar["x"]
        cx = x + bar_w // 2
        top = bottom_y - bar["h"]
        bar_center_y = (top + bottom_y) // 2

        place_str = str(bar["place"])
        bbox = draw.textbbox((0, 0), place_str, font=num_font)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]

        # Purple text on the white bar
        purple = (72, 58, 185, 230)
        draw.text((cx - tw // 2, bar_center_y - th // 2 + 10), place_str, font=num_font, fill=purple)

    # --- Crown / Trophy above 1st place bar ---
    c1 = bars[1]
    c1_cx = c1["x"] + bar_w // 2
    c1_top = bottom_y - c1["h"]

    # Gold star
    star_cx = c1_cx
    star_cy = c1_top - 72
    gold = (255, 200, 40, 255)
    gold_inner = (220, 150, 20, 255)
    draw_star(draw, star_cx, star_cy, r_outer=62, r_inner=28, n_points=5,
              fill=gold, outline=None)
    # Smaller inner highlight
    draw_star(draw, star_cx, star_cy, r_outer=42, r_inner=20, n_points=5,
              fill=(255, 230, 120, 180))

    # --- Thin white line at bottom of bars (base plate) ---
    base_y = bottom_y + 8
    plate_x0 = start_x - 20
    plate_x1 = start_x + total_w + 20
    draw.rounded_rectangle([plate_x0, base_y, plate_x1, base_y + 22],
                            radius=11, fill=(255, 255, 255, 100))

    # --- Save as RGB PNG (Xcode needs no alpha on AppIcon) ---
    final = Image.new('RGB', (SIZE, SIZE), (0, 0, 0))
    final.paste(img, mask=img.split()[3])
    return final

if __name__ == "__main__":
    out_path = os.path.join(os.path.dirname(__file__), "../assets/icon.png")
    icon = create_icon()
    icon.save(out_path, "PNG", optimize=True)
    print(f"Saved: {os.path.abspath(out_path)}  ({SIZE}x{SIZE})")
