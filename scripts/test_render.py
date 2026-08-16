"""Quick test: render N frames at 640x360 to gauge speed."""
import struct, math, random, sys, time

W, H = 640, 360
FPS = 15
TOTAL_FRAMES = 3  # just test 3 frames

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

    for s in STARS:
        sx = int(s['x'] * W)
        speed = 0.5 + s['depth'] * 3.0
        sy = int((s['y'] * H - t * speed * 80) % H)
        sr = clamp(255 * s['b'])
        sg = clamp(255 * s['b'] * (1 - s['hue'] * 0.5))
        sb = clamp(255 * s['b'] * (1 - s['hue'] * 0.3))
        r = max(0.5, s['r'])
        ir = int(r * 2)
        for dy in range(-ir, ir + 1):
            py = sy + dy
            if py < 0 or py >= H: continue
            for dx in range(-ir, ir + 1):
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

start = time.time()
for f in range(TOTAL_FRAMES):
    sys.stdout.buffer.write(f"P6\n{W} {H}\n255\n".encode())
    pixels = render_frame(f)
    sys.stdout.buffer.write(pixels)
elapsed = time.time() - start
print(f"Rendered {TOTAL_FRAMES} frames in {elapsed:.1f}s ({elapsed/TOTAL_FRAMES:.1f}s/frame)", file=sys.stderr)
print(f"Estimated 300 frames @ 640x360: {elapsed/TOTAL_FRAMES * 300 / 60:.1f} minutes", file=sys.stderr)
