"""Generate space flythrough frames → pipe to ffmpeg → MP4 video.
Pure stdlib — no PIL, no numpy. Uses PPM P6 format (raw RGB bytes)."""
import struct, math, random, sys, os

W, H = 1920, 1080
FPS, DURATION = 30, 45  # 45 seconds
TOTAL_FRAMES = FPS * DURATION

# Seed for reproducibility
random.seed(42)

# Generate star positions once
STARS = []
for _ in range(800):
    STARS.append({
        'x': random.random(),
        'y': random.random(),
        'r': random.random() * 2.5 + 0.3,
        'b': random.random() * 0.6 + 0.4,
        'depth': random.random(),  # 0=far, 1=near
        'hue': random.random() * 0.15,  # slight color variation
    })

# Nebula blobs
NEBULAS = []
for _ in range(5):
    NEBULAS.append({
        'x': random.random(),
        'y': random.random(),
        'rx': random.random() * 0.35 + 0.2,
        'ry': random.random() * 0.25 + 0.15,
        'r': random.random() * 0.1 + 0.02,  # red tint
        'g': random.random() * 0.15 + 0.05,  # green
        'b': random.random() * 0.3 + 0.1,  # blue dominant
        'alpha': random.random() * 0.04 + 0.02,
    })

def clamp(v):
    return max(0, min(255, int(v)))

def write_ppm_header(f, w, h):
    f.write(f"P6\n{w} {h}\n255\n".encode())

def render_frame(frame_num):
    """Render one frame to a bytearray of PPM raw RGB data."""
    t = frame_num / FPS  # time in seconds
    progress = frame_num / TOTAL_FRAMES  # 0→1

    # Create raw RGB buffer
    pixels = bytearray(W * H * 3)

    # Camera depth increases with time
    cam_depth = progress * 1000

    # Background: deep space gradient
    for y in range(H):
        y_ratio = y / H
        bg_r = int(2 + y_ratio * 6)
        bg_g = int(3 + y_ratio * 3)
        bg_b = int(6 + y_ratio * 10)
        row_start = y * W * 3
        for x in range(W):
            idx = row_start + x * 3
            pixels[idx] = bg_r
            pixels[idx+1] = bg_g
            pixels[idx+2] = bg_b

    # Nebulas
    for n in NEBULAS:
        nx = int(n['x'] * W)
        ny = int(n['y'] * H)
        nrx = int(n['rx'] * W)
        nry = int(n['ry'] * H)
        for dy in range(-nry, nry+1):
            py = ny + dy
            if py < 0 or py >= H: continue
            dy_norm = dy / max(1, nry)
            for dx in range(-nrx, nrx+1):
                px = nx + dx
                if px < 0 or px >= W: continue
                dx_norm = dx / max(1, nrx)
                dist = math.sqrt(dx_norm*dx_norm + dy_norm*dy_norm)
                if dist > 1: continue
                fade = max(0, 1 - dist*dist)
                idx = py * W * 3 + px * 3
                a = n['alpha'] * fade
                pixels[idx] = clamp(pixels[idx] + n['r'] * 255 * a)
                pixels[idx+1] = clamp(pixels[idx+1] + n['g'] * 255 * a)
                pixels[idx+2] = clamp(pixels[idx+2] + n['b'] * 255 * a)

    # Stars with parallax
    for s in STARS:
        sx = int(s['x'] * W)
        # Parallax: closer stars move faster
        speed = 0.5 + s['depth'] * 3.0
        sy = int((s['y'] * H - t * speed * 80) % H)
        # Star color with slight warmth
        hue = s['hue']
        sr = clamp(255 * s['b'])
        sg = clamp(255 * s['b'] * (1 - hue * 0.5))
        sb = clamp(255 * s['b'] * (1 - hue * 0.3))

        # Draw star as a small circle
        r = max(0.5, s['r'])
        for dy in range(-int(r*2), int(r*2)+1):
            py = sy + dy
            if py < 0 or py >= H: continue
            for dx in range(-int(r*2), int(r*2)+1):
                px = sx + dx
                if px < 0 or px >= W: continue
                dist = math.sqrt(dx*dx + dy*dy) / max(0.5, r)
                if dist > 2.0: continue
                alpha = max(0, 1 - dist*dist*0.5)
                idx = py * W * 3 + px * 3
                pixels[idx] = clamp(pixels[idx] + sr * alpha)
                pixels[idx+1] = clamp(pixels[idx+1] + sg * alpha)
                pixels[idx+2] = clamp(pixels[idx+2] + sb * alpha)

    return pixels

# Write frames to stdout, one PPM per frame
# ffmpeg reads from stdin: ... | ffmpeg -f image2pipe -r 30 -i - ...
for f in range(TOTAL_FRAMES):
    # PPM header
    sys.stdout.buffer.write(f"P6\n{W} {H}\n255\n".encode())
    pixels = render_frame(f)
    sys.stdout.buffer.write(pixels)
    if f % 30 == 0:
        sys.stderr.write(f"\rFrame {f}/{TOTAL_FRAMES}")
        sys.stderr.flush()

sys.stderr.write(f"\rFrame {TOTAL_FRAMES}/{TOTAL_FRAMES} — done\n")
