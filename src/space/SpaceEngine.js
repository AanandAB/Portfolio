/* ─── SpaceEngine — Procedural deep-space world renderer ───
   Pure Canvas 2D. No Three.js, no assets, no video.
   Driven by a single `depth` value (0–1) representing camera
   position along a flight path through a constellation of planets.
   ────────────────────────────────────────────────────────── */

const STAR_COLORS = [
  '#ffffff', '#f8f9ff', '#e8e0ff', '#d0d8ff', '#ffe8d0',
  '#c8d0ff', '#fff4e0', '#e0e8ff', '#f0f0ff', '#ffecd0',
  '#aaccff', '#ffccaa',
]

const NEBULA_PALETTES = [
  { inner: 'rgba(56,189,248,0.05)', outer: 'rgba(56,189,248,0)' },
  { inner: 'rgba(192,132,252,0.04)', outer: 'rgba(192,132,252,0)' },
  { inner: 'rgba(244,114,182,0.04)', outer: 'rgba(244,114,182,0)' },
  { inner: 'rgba(52,211,153,0.03)', outer: 'rgba(52,211,153,0)' },
  { inner: 'rgba(129,140,248,0.04)', outer: 'rgba(129,140,248,0)' },
]

/* ─── Planets — each is a project ─── */
const PLANETS = [
  { id:'cafe',        name:'CafePOSPro',       depthPos:0.06,  radius:85,  hue:200, color:'#38bdf8', ring:false, moons:2 },
  { id:'theyyam',     name:'Theyyam App',       depthPos:0.13,  radius:70,  hue:40,  color:'#fbbf24', ring:true,  moons:1 },
  { id:'knightly',    name:'Knightly Chess',    depthPos:0.20,  radius:80,  hue:270, color:'#c084fc', ring:false, moons:0 },
  { id:'evently',     name:'Evently Connect',   depthPos:0.27,  radius:62,  hue:330, color:'#f472b6', ring:true,  moons:1 },
  { id:'bytebot',     name:'Bytebot AI Lab',    depthPos:0.34,  radius:72,  hue:160, color:'#34d399', ring:false, moons:0 },
  { id:'aios',        name:'AIOS v2.0',         depthPos:0.41,  radius:92,  hue:0,   color:'#ef4444', ring:false, moons:3 },
  { id:'bitnexel',    name:'Bitnexel',          depthPos:0.48,  radius:78,  hue:190, color:'#06b6d4', ring:true,  moons:1 },
  { id:'tictac',      name:'Tactis',            depthPos:0.55,  radius:55,  hue:80,  color:'#84cc16', ring:false, moons:0 },
  { id:'sudoku',      name:'Sudoku 300',        depthPos:0.62,  radius:68,  hue:240, color:'#818cf8', ring:false, moons:2 },
  { id:'cafemaster',  name:'Cafe Flutter',      depthPos:0.69,  radius:84,  hue:35,  color:'#f59e0b', ring:true,  moons:1 },
  { id:'aquarium',    name:'Happy Aquarium',    depthPos:0.78,  radius:76,  hue:170, color:'#14b8a6', ring:false, moons:1 },
]

const APPROACH_ZONE = 0.06  // how close before planet "wakes up"
const VISIBLE_ZONE = 0.28   // max distance planet is visible

/* ─── Star generation ─── */
function generateStars(count, layerSpeed) {
  const arr = []
  for (let i = 0; i < count; i++) {
    arr.push({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.8 + 0.3,
      color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      twinkle: Math.random() < 0.15,
      twinkleSpeed: Math.random() * 2 + 0.5,
      twinklePhase: Math.random() * Math.PI * 2,
      layerSpeed,
    })
  }
  return arr
}

function generateNebulas(count) {
  const arr = []
  for (let i = 0; i < count; i++) {
    const pal = NEBULA_PALETTES[Math.floor(Math.random() * NEBULA_PALETTES.length)]
    arr.push({
      x: Math.random(),
      y: Math.random(),
      rx: Math.random() * 0.40 + 0.25,
      ry: Math.random() * 0.30 + 0.15,
      angle: Math.random() * Math.PI * 2,
      inner: pal.inner,
      outer: pal.outer,
      parallax: Math.random() * 0.3 + 0.3,
    })
  }
  return arr
}

function seededRandom(seed) {
  let s = seed
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646 }
}

function hslToRgb(h, s, l) {
  h /= 360; s /= 100; l /= 100
  let r, g, b
  if (s === 0) { r = g = b = l }
  else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1; if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1/3); g = hue2rgb(p, q, h); b = hue2rgb(p, q, h - 1/3)
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}

/* ═══════════════════════════════════════════════════════════
   ENGINE
   ═══════════════════════════════════════════════════════════ */

export function createSpaceEngine(canvas) {
  const ctx = canvas.getContext('2d')
  let W, H, dpr
  let depth = 0
  let targetDepth = 0
  let prevDepth = 0
  let time = 0
  let activePlanetIdx = -1

  const BG_STARS = generateStars(350, 0.06)
  const MID_STARS = generateStars(220, 0.20)
  const FG_STARS = generateStars(60, 0.42)
  const NEBULAS = generateNebulas(6)

  const planetCraters = new Map()
  const shootingStars = []

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    W = window.innerWidth
    H = window.innerHeight
    canvas.width = W * dpr
    canvas.height = H * dpr
    canvas.style.width = W + 'px'
    canvas.style.height = H + 'px'
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  function setDepth(d) { targetDepth = d }

  /* ─── Background ─── */
  function drawBackground() {
    const grad = ctx.createRadialGradient(W * 0.3, H * 0.35, 0, W * 0.5, H * 0.5, Math.max(W, H))
    grad.addColorStop(0, '#0a0e1a')
    grad.addColorStop(0.5, '#060912')
    grad.addColorStop(1, '#020408')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, H)
  }

  /* ─── Nebulas ─── */
  function drawNebulas() {
    for (const n of NEBULAS) {
      const nx = n.x * W
      const ny = n.y * H - depth * H * n.parallax
      const nrx = n.rx * W
      const nry = n.ry * H
      ctx.save()
      const wrapY = ((ny % (H * 1.6)) + H * 1.6) % (H * 1.6) - H * 0.8
      ctx.translate(nx, wrapY)
      ctx.rotate(n.angle)
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, nrx)
      grad.addColorStop(0, n.inner); grad.addColorStop(1, n.outer)
      ctx.fillStyle = grad
      ctx.fillRect(-nrx, -nry, nrx * 2, nry * 2)
      ctx.fillRect(-nrx, -nry - H * 1.6, nrx * 2, nry * 2)
      ctx.restore()
    }
  }

  /* ─── Stars with fly-speed streaks ─── */
  function drawStarLayer(stars, speedMultiplier) {
    const speed = Math.abs(depth - prevDepth) * 60 * speedMultiplier
    for (const s of stars) {
      const sx = s.x * W
      const sy = ((s.y * H - depth * s.layerSpeed * H * 25) % H + H) % H
      let alpha = 0.7
      let rx = s.r
      let ry = s.r

      if (s.twinkle) {
        alpha = 0.3 + 0.7 * Math.abs(Math.sin(time * s.twinkleSpeed + s.twinklePhase))
      }

      // Speed streaks during flight
      if (speed > 0.3 && s.r > 0.7) {
        rx = s.r * (1 + speed * 0.6)
        ry = s.r * (1 + speed * 2.5)
        alpha = Math.min(1, alpha * 1.3)
      }

      ctx.beginPath()
      ctx.ellipse(sx, sy, rx, ry, 0, 0, Math.PI * 2)
      ctx.fillStyle = s.color
      ctx.globalAlpha = alpha
      ctx.fill()

      if (s.r > 1.0 && alpha > 0.5) {
        const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, rx * 2.5)
        glow.addColorStop(0, s.color); glow.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(sx, sy, rx * 2.5, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.globalAlpha = alpha * 0.25
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }
  }

  /* ─── Shooting stars ─── */
  function maybeSpawnShootingStar() {
    if (shootingStars.length < 2 && Math.random() < 0.003) {
      shootingStars.push({
        x: Math.random() * W * 0.8 + W * 0.1,
        y: Math.random() * H * 0.5,
        vx: (Math.random() - 0.5) * 8,
        vy: Math.random() * 4 + 3,
        life: 1,
        len: Math.random() * 80 + 40,
      })
    }
  }

  function drawShootingStars() {
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const ss = shootingStars[i]
      ss.x += ss.vx; ss.y += ss.vy; ss.life -= 0.015
      if (ss.life <= 0) { shootingStars.splice(i, 1); continue }

      const grad = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.vx * ss.len / 8, ss.y - ss.vy * ss.len / 8)
      grad.addColorStop(0, `rgba(255,255,255,${ss.life})`)
      grad.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.beginPath()
      ctx.moveTo(ss.x, ss.y)
      ctx.lineTo(ss.x - ss.vx * ss.len / 8, ss.y - ss.vy * ss.len / 8)
      ctx.strokeStyle = grad
      ctx.lineWidth = 1.5 * ss.life
      ctx.stroke()
    }
  }

  /* ─── Constellation lines ─── */
  function drawConstellation() {
    ctx.strokeStyle = 'rgba(56,189,248,0.06)'
    ctx.lineWidth = 0.5
    ctx.setLineDash([8, 20])
    ctx.beginPath()
    for (let i = 0; i < PLANETS.length; i++) {
      const t = (depth - PLANETS[i].depthPos) / VISIBLE_ZONE
      const visible = Math.abs(t) < 1.5
      if (!visible) continue
      const px = W * (0.3 + PLANETS[i].depthPos * 0.4)
      const py = H * (0.25 + (PLANETS[i].hue % 100) / 200)
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()
    ctx.setLineDash([])
  }

  /* ─── Planet rendering ─── */
  function drawOnePlanet(p, screenX, screenY, screenR, t) {
    if (screenR < 2) return
    const cx = screenX, cy = screenY, r = screenR
    const hue = p.hue

    // Atmosphere
    const [ar, ag, ab] = hslToRgb(hue, 60, 50)
    const atmoGrad = ctx.createRadialGradient(cx, cy, r * 0.85, cx, cy, r * 1.5)
    atmoGrad.addColorStop(0, `rgba(${ar},${ag},${ab},0.18)`)
    atmoGrad.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.beginPath(); ctx.arc(cx, cy, r * 1.5, 0, Math.PI * 2)
    ctx.fillStyle = atmoGrad; ctx.fill()

    // Body
    const [br, bg, bb] = hslToRgb(hue, 55, 30)
    const [lr, lg, lb] = hslToRgb(hue, 70, 52)
    const [dr, dg, db] = hslToRgb(hue, 40, 12)
    const bodyGrad = ctx.createRadialGradient(cx - r * 0.25, cy - r * 0.25, r * 0.03, cx, cy, r)
    bodyGrad.addColorStop(0, `rgb(${lr},${lg},${lb})`)
    bodyGrad.addColorStop(0.45, `rgb(${br},${bg},${bb})`)
    bodyGrad.addColorStop(1, `rgb(${dr},${dg},${db})`)
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fillStyle = bodyGrad; ctx.fill()

    // Surface craters
    if (!planetCraters.has(p.id) && r > 18) {
      const rand = seededRandom(p.hue * 37 + p.depthPos * 1000)
      const craters = []
      for (let i = 0; i < Math.floor(r * 0.7); i++) {
        craters.push({ angle: rand() * Math.PI * 2, dist: rand() * 0.88, cr: rand() * r * 0.11 + r * 0.012, alpha: rand() * 0.28 + 0.04 })
      }
      planetCraters.set(p.id, craters)
    }
    if (r > 18) {
      for (const c of planetCraters.get(p.id) || []) {
        const c2x = cx + Math.cos(c.angle) * r * c.dist
        const c2y = cy + Math.sin(c.angle) * r * c.dist
        ctx.beginPath(); ctx.arc(c2x + 0.8, c2y + 0.8, c.cr, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0,0,0,${c.alpha * 0.55})`; ctx.fill()
        ctx.beginPath(); ctx.arc(c2x - 0.4, c2y - 0.4, c.cr, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${c.alpha * 0.25})`; ctx.fill()
      }
    }

    // Shadow
    const shadow = ctx.createLinearGradient(cx + r * 0.4, cy, cx - r, cy)
    shadow.addColorStop(0, 'rgba(0,0,0,0)'); shadow.addColorStop(0.5, 'rgba(0,0,0,0)')
    shadow.addColorStop(1, 'rgba(0,0,0,0.72)')
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fillStyle = shadow; ctx.fill()

    // Rim
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1; ctx.stroke()

    // Rings
    if (p.ring && r > 22) {
      ctx.beginPath()
      ctx.ellipse(cx, cy, r * 2.4, r * 0.42, -0.25, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(${ar},${ag},${ab},0.22)`; ctx.lineWidth = r * 0.08; ctx.stroke()
      ctx.beginPath()
      ctx.ellipse(cx, cy, r * 1.75, r * 0.28, -0.25, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = r * 0.025; ctx.stroke()
    }

    // Moons
    if (p.moons > 0 && r > 12) {
      for (let m = 0; m < p.moons; m++) {
        const ma = time * 0.35 + (m * Math.PI * 2) / p.moons
        const md = r * 2.5 + m * r * 0.5
        const mx = cx + Math.cos(ma) * md, my = cy + Math.sin(ma) * md * 0.5
        const mr = r * 0.07 + m * 0.6
        ctx.beginPath(); ctx.arc(mx, my, mr, 0, Math.PI * 2)
        ctx.fillStyle = '#cbd5e1'; ctx.fill()
        const mg = ctx.createRadialGradient(mx, my, 0, mx, my, mr * 2.5)
        mg.addColorStop(0, 'rgba(203,213,225,0.25)'); mg.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.beginPath(); ctx.arc(mx, my, mr * 2.5, 0, Math.PI * 2)
        ctx.fillStyle = mg; ctx.fill()
      }
    }

    // Target ring on active planet
    if (t < 0.3 && r > 20) {
      const pulse = 1 + Math.sin(time * 2) * 0.06
      ctx.beginPath()
      ctx.arc(cx, cy, r * 1.35 * pulse, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(${ar},${ag},${ab},${(0.3 - t) * 1.8})`
      ctx.lineWidth = 1.5; ctx.setLineDash([4, 6]); ctx.stroke()
      ctx.setLineDash([])
    }

    // Name label
    if (t < 0.18 && r > 18) {
      const labelAlpha = Math.min(1, (0.18 - t) / 0.08)
      ctx.fillStyle = `rgba(255,255,255,${labelAlpha * 0.9})`
      ctx.font = `${Math.max(11, r * 0.18)}px "JetBrains Mono", monospace`
      ctx.textAlign = 'center'
      ctx.fillText(p.name, cx, cy + r + 20)
    }
  }

  /* ─── Draw all planets ─── */
  function drawPlanets() {
    let bestDist = Infinity
    let bestIdx = -1

    for (let i = 0; i < PLANETS.length; i++) {
      const p = PLANETS[i]
      const dist = Math.abs(depth - p.depthPos)
      if (dist > VISIBLE_ZONE) continue
      if (dist < bestDist) { bestDist = dist; bestIdx = i }

      const t = dist / VISIBLE_ZONE
      const scale = 1 - t * t
      const screenR = p.radius * scale * (Math.min(W, H) / 900)
      const alpha = 1 - t * t * t

      // Position with drift
      const baseX = W * (0.3 + p.depthPos * 0.4)
      const baseY = H * (0.25 + (p.hue % 100) / 200)
      const screenX = baseX + (depth - p.depthPos) * W * 0.5
      const screenY = baseY + (depth - p.depthPos) * H * 0.08

      ctx.globalAlpha = alpha
      drawOnePlanet(p, screenX, screenY, screenR, dist)
      ctx.globalAlpha = 1
    }

    activePlanetIdx = bestIdx
  }

  /* ─── Dust ─── */
  function drawDust() {
    for (let i = 0; i < 40; i++) {
      const seed = i * 7919
      const x = ((seed * 13) % 1000) / 1000 * W
      const y = (((seed * 17 + depth * 800) % 1000) / 1000) * H
      const r = 0.35 + (i % 4) * 0.3
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(180,200,240,${0.06 + (i % 6) * 0.02})`; ctx.fill()
    }
  }

  /* ─── Vignette + scan lines ─── */
  function drawVignette() {
    const grad = ctx.createRadialGradient(W/2, H/2, Math.max(W,H)*0.5, W/2, H/2, Math.max(W,H)*0.92)
    grad.addColorStop(0, 'rgba(0,0,0,0)'); grad.addColorStop(1, 'rgba(0,0,0,0.55)')
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H)
  }

  /* ─── Navigation hint for nearest planet ─── */
  function drawNavHint() {
    if (activePlanetIdx < 0) return
    const p = PLANETS[activePlanetIdx]
    const dist = Math.abs(depth - p.depthPos)
    if (dist > APPROACH_ZONE * 2) return

    const t = dist / (APPROACH_ZONE * 2)
    const alpha = (1 - t) * 0.5
    const baseX = W * (0.3 + p.depthPos * 0.4)
    const baseY = H * (0.25 + (p.hue % 100) / 200)
    const px = baseX + (depth - p.depthPos) * W * 0.5
    const py = baseY + (depth - p.depthPos) * H * 0.08

    // Subtle arrow pointing at planet
    if (dist > 0.01) {
      const arrowAlpha = alpha * 0.6
      const dx = px - W * 0.5
      const dy = py - H * 0.5
      const mag = Math.sqrt(dx*dx + dy*dy) || 1
      const ax = W * 0.5 + (dx / mag) * Math.min(W, H) * 0.15
      const ay = H * 0.5 + (dy / mag) * Math.min(W, H) * 0.15
      const angle = Math.atan2(dy, dx)

      ctx.save()
      ctx.translate(ax, ay); ctx.rotate(angle)
      ctx.fillStyle = `rgba(255,255,255,${arrowAlpha})`
      ctx.beginPath()
      ctx.moveTo(8, 0); ctx.lineTo(-4, -4); ctx.lineTo(-4, 4); ctx.closePath()
      ctx.fill()
      ctx.restore()
    }
  }

  /* ═══════════════════════════════════════════
     RENDER LOOP
     ═══════════════════════════════════════════ */
  function render(timestamp) {
    prevDepth = depth
    time = timestamp * 0.001
    depth += (targetDepth - depth) * 0.07

    maybeSpawnShootingStar()

    ctx.clearRect(0, 0, W, H)
    drawBackground()
    drawNebulas()
    drawConstellation()
    drawStarLayer(BG_STARS, 0.5)
    drawStarLayer(MID_STARS, 1.0)
    drawPlanets()
    drawShootingStars()
    drawStarLayer(FG_STARS, 1.8)
    drawNavHint()
    drawDust()
    drawVignette()
  }

  resize()

  return {
    resize,
    setDepth,
    render,
    getDepth: () => depth,
    getActivePlanetId: () => activePlanetIdx >= 0 ? PLANETS[activePlanetIdx].id : null,
    getPlanets: () => PLANETS,
  }
}
