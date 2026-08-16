"""Generate space flythrough frames → pipe to ffmpeg → video.
640x360, 15fps, 20 seconds = 300 frames. ~30 seconds to render."""
import struct, math, random, sys

W, H = 640, 360
FPS = 15
TOTAL_FRAMES = 300

random.seed(42)

STARS = []
for _ in range(400):
    STARS.append({
        'x': random.random(), 'y': random.random(),
        'r': random.random() * 2.5 + 0.3,
        'b': random.random() * 0.6 + 0.4,
        'depth': random.random(),
        'hue': random.random() * 0.15,
    })

NEBULAS = []
for _ in range(5):
    NEBULAS.append({
        'x': random.random(), 'y': random.random(),
        'rx': random.random() * 0.35 + 0.2, 'ry': random.random() * 0.25 + 0.15,
        'r': random.random() * 0.06 + 0.02,
        'g': random.random() * 0.10 + 0.04,
        'b': random.random() * 0.20 + 0.08,
        'alpha': random.random() * 0.04 + 0.02,
    })

def clamp(v):
    return max(0, min(255, int(v)))

def render_frame(frame_num):
    t = frame_num / FPS
    pixels = bytearray(W * H * 3)
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
        y0 = max(0, ny - nry)
        y1 = min(H - 1, ny + nry)
        x0 = max(0, nx - nrx)
        x1 = min(W - 1, nx + nrx)
        for py in range(y0, y1 + 1):
            dy_norm = (py - ny) / max(1, nry)
            row_start = py * W * 3
            for px in range(x0, x1 + 1):
                dx_norm = (px - nx) / max(1, nrx)
                dist = dx_norm*dx_norm + dy_norm*dy_norm
                if dist > 1: continue
                fade = max(0, 1 - dist)
                idx = row_start + px * 3
                a = n['alpha'] * fade
                pixels[idx] = clamp(pixels[idx] + n['r'] * 255 * a)
                pixels[idx+1] = clamp(pixels[idx+1] + n['g'] * 255 * a)
                pixels[idx+2] = clamp(pixels[idx+2] + n['b'] * 255 * a)

    # Stars
    for s in STARS:
        sx = int(s['x'] * W)
        speed = 0.5 + s['depth'] * 3.0
        sy = int((s['y'] * H - t * speed * 80) % H)
        sr = clamp(255 * s['b'])
        sg = clamp(255 * s['b'] * (1 - s['hue'] * 0.5))
        sb = clamp(255 * s['b'] * (1 - s['hue'] * 0.3))
        r = max(0.5, s['r'])
        ir = int(r * 2)
        y0 = max(0, sy - ir)
        y1 = min(H - 1, sy + ir)
        for py in range(y0, y1 + 1):
            dy = py - sy
            row_start = py * W * 3
            x0 = max(0, sx - ir)
            x1 = min(W - 1, sx + ir)
            for px in range(x0, x1 + 1):
                dx = px - sx
                dist = math.sqrt(dx*dx + dy*dy) / max(0.5, r)
                if dist > 2.0: continue
                alpha = max(0, 1 - dist*dist*0.5)
                idx = row_start + px * 3
                pixels[idx] = clamp(pixels[idx] + sr * alpha)
                pixels[idx+1] = clamp(pixels[idx+1] + sg * alpha)
                pixels[idx+2] = clamp(pixels[idx+2] + sb * alpha)

    return pixels

for f in range(TOTAL_FRAMES):
    sys.stdout.buffer.write(f"P6\n{W} {H}\n255\n".encode())
    sys.stdout.buffer.write(render_frame(f))
    if f % 30 == 0:
        sys.stderr.write(f"\rFrame {f}/{TOTAL_FRAMES}"); sys.stderr.flush()

sys.stderr.write(f"\rFrame {TOTAL_FRAMES}/{TOTAL_FRAMES} — done\n")
