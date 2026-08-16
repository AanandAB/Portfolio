import React, { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars, Sparkles, Float, Html, Text, Line, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { usePortfolioStore } from '../store/portfolioStore'

/* ═══════════════════════════════════════════════
   PROJECTS — each becomes a floating card in 3D space
   ═══════════════════════════════════════════════ */
const PROJECTS = [
  { id:'cafe',       name:'CafePOSPro',       tag:'Full-stack POS',     color:'#38bdf8', pos:[ -6,  1,  2], desc:'Desktop + mobile café system with QR menus & live order tracking' },
  { id:'theyyam',    name:'Theyyam App',       tag:'Cultural Tourism',  color:'#fbbf24', pos:[ -3,  3, -3], desc:'Kerala cultural tourism app with OSM navigation & live weather' },
  { id:'knightly',   name:'Knightly Chess',    tag:'Web3 Blockchain',   color:'#c084fc', pos:[  1,  0, -6], desc:'Decentralised chess on blockchain — final year B.Tech project' },
  { id:'evently',    name:'Evently Connect',   tag:'Landing Page',      color:'#f472b6', pos:[  5,  2, -4], desc:'Conversion-optimised event management landing page' },
  { id:'bytebot',    name:'Bytebot AI Lab',    tag:'Multi-Agent AI',    color:'#34d399', pos:[  4,  4,  1], desc:'Self-adaptive multi-agent AI system with recursive planning' },
  { id:'aios',       name:'AIOS v2.0',         tag:'AI Operating Sys',  color:'#ef4444', pos:[ -1,  5,  5], desc:'Local AI-driven operating system — sees your screen, spawns agents' },
  { id:'tictac',     name:'Tactis',            tag:'Flutter Game',      color:'#84cc16', pos:[ -5,  2,  8], desc:'Premium Tic Tac Toe with fluid animations & neumorphic design' },
  { id:'sudoku',     name:'Sudoku 300',        tag:'Neumorphic Puzzle', color:'#818cf8', pos:[ -7,  4, 12], desc:'300 procedurally-generated puzzles with custom backtracking engine' },
  { id:'cafemaster', name:'Cafe Flutter',      tag:'Restaurant OS',     color:'#f59e0b', pos:[  2,  3, 16], desc:'Production-ready offline-first POS + KDS with WiFi sync' },
  { id:'aquarium',   name:'Happy Aquarium',    tag:'Cloudflare CMS',    color:'#14b8a6', pos:[  6,  1, 20], desc:'Cinematic aquarium store with custom admin CMS on Cloudflare' },
]

/* ═══════════════════════════════════════════════
   CANVAS TEXTURE — renders project card as a texture
   ═══════════════════════════════════════════════ */
function createCardTexture(project) {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 320
  const ctx = canvas.getContext('2d')

  // Background — dark glass
  ctx.fillStyle = 'rgba(8, 12, 24, 0.92)'
  roundRect(ctx, 0, 0, 512, 320, 20)
  ctx.fill()

  // Border glow
  ctx.strokeStyle = project.color + '40'
  ctx.lineWidth = 2
  roundRect(ctx, 1, 1, 510, 318, 20)
  ctx.stroke()

  // Accent bar at top
  ctx.fillStyle = project.color
  roundRect(ctx, 20, 24, 472, 4, 2)
  ctx.fill()

  // Tag
  ctx.fillStyle = project.color
  ctx.font = 'bold 13px "JetBrains Mono", monospace'
  ctx.fillText(project.tag, 28, 64)

  // Project name
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 36px "Space Grotesk", sans-serif'
  ctx.fillText(project.name, 28, 120)

  // Description
  ctx.fillStyle = '#94a3b8'
  ctx.font = '15px "Inter", sans-serif'
  wrapText(ctx, project.desc, 28, 160, 456, 24)

  // Bottom dot indicator
  ctx.fillStyle = project.color
  ctx.beginPath()
  ctx.arc(256, 290, 6, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = project.color + '40'
  ctx.beginPath()
  ctx.arc(256, 290, 12, 0, Math.PI * 2)
  ctx.fill()

  return new THREE.CanvasTexture(canvas)
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ')
  let line = ''
  let cy = y
  for (const word of words) {
    const test = line + word + ' '
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, cy)
      line = word + ' '
      cy += lineHeight
    } else {
      line = test
    }
  }
  ctx.fillText(line, x, cy)
}

/* ═══════════════════════════════════════════════
   PROJECT CARD — a 3D plane with the project texture
   ═══════════════════════════════════════════════ */
function ProjectCard3D({ project, index, isActive }) {
  const meshRef = useRef()
  const glowRef = useRef()
  const texture = useMemo(() => createCardTexture(project), [project.id])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (meshRef.current) {
      // Gentle float
      meshRef.current.position.y = project.pos[1] + Math.sin(t * 0.6 + index) * 0.3
      // Face the camera slightly
      meshRef.current.lookAt(
        state.camera.position.x,
        meshRef.current.position.y,
        state.camera.position.z
      )
    }
    if (glowRef.current) {
      glowRef.current.material.opacity = isActive ? 0.3 + Math.sin(t * 3) * 0.1 : 0.05
      glowRef.current.scale.setScalar(isActive ? 1.15 + Math.sin(t * 2) * 0.03 : 1)
    }
  })

  return (
    <group position={project.pos}>
      {/* Glow plane behind card */}
      <mesh ref={glowRef} position={[0, 0, -0.05]}>
        <planeGeometry args={[4.2, 2.7]} />
        <meshBasicMaterial
          color={project.color}
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Card plane */}
      <Float speed={0.5} rotationIntensity={0.02} floatIntensity={0.2}>
        <mesh ref={meshRef}>
          <planeGeometry args={[4, 2.5]} />
          <meshBasicMaterial
            map={texture}
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>
      </Float>

      {/* Particles around active card */}
      {isActive && (
        <Sparkles count={30} scale={5} size={3} speed={1} color={project.color} />
      )}
    </group>
  )
}

/* ═══════════════════════════════════════════════
   CONNECTION STREAMS — energy lines between cards
   ═══════════════════════════════════════════════ */
function ConnectionStreams({ activeIdx }) {
  const lines = useMemo(() => {
    const pts = []
    for (let i = 0; i < PROJECTS.length - 1; i++) {
      const a = new THREE.Vector3(...PROJECTS[i].pos)
      const b = new THREE.Vector3(...PROJECTS[i+1].pos)
      pts.push([a, b, PROJECTS[i].color])
    }
    return pts
  }, [])

  return (
    <group>
      {lines.map(([a, b, color], i) => {
        const points = [a, b]
        const isActive = i <= activeIdx
        return (
          <Line
            key={i}
            points={points}
            color={color}
            lineWidth={0.5}
            transparent
            opacity={isActive ? 0.3 : 0.04}
            dashed={!isActive}
            dashSize={0.5}
            gapSize={0.3}
          />
        )
      })}
    </group>
  )
}

/* ═══════════════════════════════════════════════
   CENTRAL GLOW — the developer's "core"
   ═══════════════════════════════════════════════ */
function CentralCore() {
  const meshRef = useRef()
  const scrollDepth = usePortfolioStore((s) => s.scrollDepth)

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime
      meshRef.current.rotation.y = t * 0.15
      meshRef.current.rotation.x = t * 0.05
      meshRef.current.scale.setScalar(1 + Math.sin(t * 0.8) * 0.05)
    }
  })

  return (
    <group position={[0, 2, -10]}>
      {/* Inner sphere */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.6, 2]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#38bdf8"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.3}
          wireframe
        />
      </mesh>
      {/* Outer glow sphere */}
      <mesh>
        <sphereGeometry args={[1.0, 32, 32]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.06}
        />
      </mesh>
      {/* Orbiting ring */}
      <mesh rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[1.8, 0.02, 16, 100]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.2} />
      </mesh>
      {/* Particles */}
      <Sparkles count={60} scale={5} size={2} speed={0.5} color="#38bdf8" />
    </group>
  )
}

/* ═══════════════════════════════════════════════
   CAMERA RIG — scroll-driven flight
   ═══════════════════════════════════════════════ */
function CameraRig() {
  const scrollDepth = usePortfolioStore((s) => s.scrollDepth)
  const { camera } = useThree()
  const curve = useMemo(() => {
    // Build spline through all project positions
    const allPts = [
      [0, 1, -8],  // starting position (viewing the core)
      ...PROJECTS.map(p => p.pos),
    ]
    return new THREE.CatmullRomCurve3(
      allPts.map(p => new THREE.Vector3(...p)),
      false, 'catmullrom', 0.5
    )
  }, [])

  useFrame(() => {
    const t = scrollDepth
    const point = curve.getPointAt(Math.min(0.999, t))
    const tangent = curve.getTangentAt(Math.min(0.999, t))

    // Camera follows the path, offset slightly back and up
    const target = new THREE.Vector3(point.x, point.y + 1.5, point.z + 4)
    camera.position.lerp(target, 0.04)

    // Look at the current card
    const lookTarget = new THREE.Vector3(point.x, point.y, point.z)
    camera.lookAt(lookTarget)
  })

  return null
}

/* ═══════════════════════════════════════════════
   MAIN SCENE
   ═══════════════════════════════════════════════ */
function Scene() {
  const scrollDepth = usePortfolioStore((s) => s.scrollDepth)
  const activeIdx = Math.min(PROJECTS.length - 1, Math.floor(scrollDepth * PROJECTS.length))

  return (
    <>
      <color attach="background" args={['#020410']} />
      <fog attach="fog" args={['#020410', 20, 60]} />

      <ambientLight intensity={0.15} />
      <pointLight position={[0, 5, -5]} intensity={0.6} color="#4488ff" />
      <pointLight position={[-10, -2, 15]} intensity={0.3} color="#ff4488" />

      {/* Starfield */}
      <Stars radius={60} depth={40} count={4000} factor={5} saturation={0.1} fade speed={0.5} />

      {/* Central core */}
      <CentralCore />

      {/* Connection streams */}
      <ConnectionStreams activeIdx={activeIdx} />

      {/* Project cards */}
      {PROJECTS.map((proj, i) => (
        <ProjectCard3D
          key={proj.id}
          project={proj}
          index={i}
          isActive={i === activeIdx}
        />
      ))}

      {/* Camera */}
      <CameraRig />
    </>
  )
}

/* ═══════════════════════════════════════════════
   HTML OVERLAY — enhanced card info at active stop
   ═══════════════════════════════════════════════ */
function ProjectOverlay() {
  const scrollDepth = usePortfolioStore((s) => s.scrollDepth)
  const activeIdx = Math.min(PROJECTS.length - 1, Math.floor(scrollDepth * PROJECTS.length))
  const localP = (scrollDepth * PROJECTS.length) % 1
  const fadeIn = Math.min(1, localP / 0.25)
  const fadeOut = Math.min(1, (1 - localP) / 0.12)
  const alpha = Math.min(fadeIn, fadeOut)

  if (activeIdx < 0 || alpha < 0.01) {
    return <div style={{position:'fixed',bottom:'clamp(40px,8vh,90px)',left:'clamp(16px,4vw,60px)',zIndex:20,pointerEvents:'none',opacity:0}} />
  }

  const p = PROJECTS[activeIdx]

  return (
    <div style={{
      position:'fixed',bottom:'clamp(40px,8vh,90px)',left:'clamp(16px,4vw,60px)',
      zIndex:20,pointerEvents:'none',opacity:alpha,transition:'opacity 0.15s',
      maxWidth:'440px',
    }}>
      <div style={{
        display:'flex',alignItems:'center',gap:8,marginBottom:8,
        fontFamily:"'JetBrains Mono',monospace",fontSize:10,
        color:p.color,letterSpacing:'0.12em',
      }}>
        <span style={{
          width:8,height:8,borderRadius:'50%',background:p.color,
          boxShadow:`0 0 10px ${p.color}`,animation:'pulse 2s ease-in-out infinite',
        }} />
        {p.tag}
      </div>
      <h2 style={{
        fontFamily:"'Space Grotesk',sans-serif",
        fontSize:'clamp(26px,4.5vw,44px)',fontWeight:700,
        color:'#fff',margin:'0 0 4px',lineHeight:1.1,
        textShadow:'0 0 40px rgba(0,0,0,0.9)',
      }}>
        {p.name}
      </h2>
      <p style={{
        fontFamily:"'Inter',sans-serif",fontSize:14,
        color:'#94a3b8',margin:'6px 0 0',lineHeight:1.5,maxWidth:'380px',
      }}>
        {p.desc}
      </p>
      <p style={{
        fontFamily:"'JetBrains Mono',monospace",fontSize:10,
        color:'#475569',margin:'8px 0 0',
      }}>
        {String(activeIdx+1).padStart(2,'0')} / {PROJECTS.length}
      </p>
      <style>{`@keyframes pulse{0%,100%{opacity:0.5;transform:scale(1)}50%{opacity:1;transform:scale(1.4)}}`}</style>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   EXPORT
   ═══════════════════════════════════════════════ */
export default function SpaceScene3D() {
  return (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <Canvas
          camera={{ position: [0, 2, 0], fov: 55, near: 0.1, far: 100 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: false, toneMapping: THREE.ACESFilmicToneMapping }}
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>
      <ProjectOverlay />
    </>
  )
}
