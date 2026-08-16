import React, { useRef, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Sparkles, Html } from '@react-three/drei'
import * as THREE from 'three'

/* ═══════════════════════════════════════════════
   ROBOT — flies randomly around the viewport
   ═══════════════════════════════════════════════ */
function RobotModel() {
  const { scene } = useGLTF('/robot_idle_animated.glb')
  const robotRef = useRef()
  const { camera } = useThree()
  const stateRef = useRef({
    mode: 'flying',     // 'flying' | 'hovering'
    target: new THREE.Vector3(),
    timer: 0,
    speed: 0.03,
    taunt: '',
    tauntTimer: 0,
  })
  const [taunt, setTaunt] = React.useState('')

  // Pick a random fly-to target within viewport-safe bounds
  const pickTarget = () => {
    const s = stateRef.current
    // Keep robot mostly in the visible area — Z clamped to positive (in front of camera)
    s.target.set(
      (Math.random() - 0.5) * 14,
      (Math.random() - 0.5) * 8 + 2,
      Math.random() * 6 + 2,
    )
    s.timer = 3 + Math.random() * 5
    s.mode = 'flying'
  }

  // Taunts
  const say = (msg) => {
    stateRef.current.taunt = msg
    stateRef.current.tauntTimer = 4
    setTaunt(msg)
    setTimeout(() => { setTaunt(''); stateRef.current.taunt = '' }, 4000)
  }

  useFrame((_, delta) => {
    if (!robotRef.current) return
    const s = stateRef.current
    s.timer -= delta

    // Pick new target when timer expires
    if (s.timer <= 0) {
      if (Math.random() < 0.12) {
        // Hover in place
        s.mode = 'hovering'
        s.timer = 2 + Math.random() * 4
        const quips = [
          "Just checking the CSS... 👀",
          "Nice site you got here! 🏠",
          "Hmm, interesting layout... 🤔",
          "＊beep boop＊ maintenance mode! 🔧",
          "This portfolio is my home now! 🤖",
          "Re-arranging pixels... please wait! ✨",
          "I live here! Rent-free! 😎",
          "Ooh, what's this section? 📐",
        ]
        say(quips[Math.floor(Math.random() * quips.length)])
      } else {
        pickTarget()
      }
    }

    if (s.mode === 'flying') {
      // Organic floating toward target
      const drift = Math.sin(performance.now() * 0.001) * 2
      const driftTarget = s.target.clone()
      driftTarget.x += Math.sin(performance.now() * 0.0007) * 3
      driftTarget.y += Math.cos(performance.now() * 0.0009) * 2 + drift
      driftTarget.z += Math.sin(performance.now() * 0.0005) * 2

      robotRef.current.position.lerp(driftTarget, s.speed)

      // Look toward movement direction with slight wobble
      const lookDir = driftTarget.clone().sub(robotRef.current.position).normalize()
      const lookTarget = robotRef.current.position.clone().add(lookDir)
      robotRef.current.lookAt(lookTarget.x, lookTarget.y, lookTarget.z)
      robotRef.current.rotation.z += Math.sin(performance.now() * 0.002) * 0.15
    }

    // Project to screen for CSS var (used by existing useRobotPush hook)
    const v = robotRef.current.position.clone()
    v.project(camera)
    const rx = (v.x * 0.5 + 0.5) * window.innerWidth
    const ry = (-v.y * 0.5 + 0.5) * window.innerHeight
    document.body.style.setProperty('--robot-x', `${rx}px`)
    document.body.style.setProperty('--robot-y', `${ry}px`)
    document.body.style.setProperty('--robot-z', `${v.z}`)
  })

  return (
    <group ref={robotRef} position={[0, 3, 4]}>
      <primitive object={scene} scale={1.5} />
      {/* Particle trail */}
      <Sparkles count={20} scale={1.5} size={2} speed={0.3} color="#38bdf8" />
      {/* Speech bubble */}
      {taunt && (
        <Html position={[0, 2.5, 0]} center style={{ pointerEvents: 'none', whiteSpace: 'nowrap' }}>
          <div style={{
            background: 'rgba(56,189,248,0.85)',
            color: '#000',
            padding: '6px 14px',
            borderRadius: '16px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '12px',
            fontWeight: 600,
            boxShadow: '0 0 16px rgba(56,189,248,0.6)',
            animation: 'robotPop 0.2s ease-out',
          }}>
            {taunt}
          </div>
        </Html>
      )}
    </group>
  )
}

/* ═══════════════════════════════════════════════
   SCENE — minimal lighting + robot
   ═══════════════════════════════════════════════ */
function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={0.6} color="#4488ff" />
      <pointLight position={[-3, 2, -2]} intensity={0.3} color="#ff6688" />
      <RobotModel />
    </>
  )
}

/* ═══════════════════════════════════════════════
   COMPONENT — fixed canvas overlay
   ═══════════════════════════════════════════════ */
export default function RobotCompanion() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 5, pointerEvents: 'none' }}>
      <style>{`@keyframes robotPop{from{opacity:0;transform:scale(0.8)translateY(6px)}to{opacity:1;transform:scale(1)translateY(0)}}`}</style>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50, near: 0.1, far: 30 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
}
