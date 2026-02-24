import React, { useRef, Suspense, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment, Html, Float, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { usePortfolioStore } from '../store/portfolioStore'
import { Web, GitHub, RocketLaunch, DesignServices, Memory } from '@mui/icons-material'

// Preload GLB assets using absolute root resolution!
useGLTF.preload(import.meta.env.BASE_URL + 'models/island.glb')
useGLTF.preload(import.meta.env.BASE_URL + 'models/cute_robot.glb')

/* ─── Cute Robot Visitor Logic ─── */
function RobotVisitor({ robotContainerRef }) {
  const { scene } = useGLTF(import.meta.env.BASE_URL + 'models/cute_robot.glb')
  const robotRef = useRef()
  const [taunt, setTaunt] = useState('')

  // State to hold random targets and behavior mode
  // The robot occasionally stops (sits) on a location, then resumes flying.
  const stateRef = useRef({
    mode: 'flying', // 'flying' or 'sitting' or 'fleeing'
    targetPos: new THREE.Vector3(),
    timer: 0,
    flySpeed: 0.04
  })
  
  // React state for particle trail rendering
  const [isMoving, setIsMoving] = useState(true)

  // AI APIs: Fetch Visitor Context!
  const [visitorData, setVisitorData] = useState(null)

  useEffect(() => {
    const fetchContext = async () => {
      try {
        // 1. Get Location (Free, No Key, HTTPS)
        const geoRes = await fetch('https://get.geojs.io/v1/ip/geo.json')
        const geoData = await geoRes.json()
        
        let weatherData = null
        if (geoData.latitude && geoData.longitude) {
          // 2. Get Weather for that location (Free, No Key, HTTPS)
          const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${geoData.latitude}&longitude=${geoData.longitude}&current_weather=true`)
          const weatherJson = await weatherRes.json()
          weatherData = weatherJson.current_weather
        }

        const context = {
          city: geoData.city || 'Earth',
          country: geoData.country || 'Space',
          temp: weatherData ? weatherData.temperature : null
        }
        
        setVisitorData(context)

        // Give a smart initial greeting!
        setTaunt(`Scanning... incoming connection from ${context.city}, ${context.country}! 🌍`)
        setTimeout(() => setTaunt(''), 5000)

      } catch (err) {
        console.log("Could not fetch remote visitor context", err)
      }
    }
    
    // Slight delay so the scene loads first
    setTimeout(fetchContext, 2000)
  }, [])

  const handleInteract = (e) => {
    e.stopPropagation()
    const data = stateRef.current
    // If it's already fleeing, ignore
    if (data.mode === 'fleeing') return

    // Trigger a playful bounce instead of a terrifying sprint
    data.mode = 'fleeing'
    data.timer = 3.5 // flee state lasts a bit longer but is slower
    data.flySpeed = 0.015 + Math.random() * 0.01 // Soft slow bounce away!
    
    // Pick a gentle evasive target not too far away
    data.targetPos.set(
      (Math.random() * 15) - 7.5,
      10 + Math.random() * 10,
      (Math.random() * 15) - 7.5
    )

    // Taunt the user with standard or dynamic AIOS-style responses
    const taunts = [
      "Hehe, missed me! 😜", 
      "I'm too floaty! ☁️", 
      "*playful beep* 🎈", 
      "Just inspecting the DOM! 🔍", 
      "Can't catch a cloud! 🤖"
    ]

    // If we have AI context, add super smart taunts to the array!
    if (visitorData) {
      if (visitorData.city !== 'Earth') {
        taunts.push(`How are things in ${visitorData.city} today? 🏙️`)
        taunts.push(`Greetings to everyone in ${visitorData.country}! 🛸`)
      }
      if (visitorData.temp !== null) {
        taunts.push(`My sensors indicate it's ${visitorData.temp}°C outside! 🌡️`)
        if (visitorData.temp > 25) taunts.push("It's quite warm where you are! Stay hydrated! 💧")
        if (visitorData.temp < 10) taunts.push("It's chilly there! My processors are keeping me warm! ❄️")
      }
    }

    setTaunt(taunts[Math.floor(Math.random() * taunts.length)])
    
    // Clear taunt text after 3 seconds
    setTimeout(() => {
      setTaunt('')
    }, 3000)
  }

  useFrame((state, delta) => {
    if (!robotRef.current) return

    const t = state.clock.elapsedTime
    const data = stateRef.current
    
    // Decrement behavior timer
    data.timer -= delta

    if (data.mode === 'flying' || data.mode === 'fleeing') {
      // Pick a new destination randomly if timer runs out
      if (data.timer <= 0) {
        if (data.mode === 'fleeing') {
          // Finished fleeing, return to slow flying
          data.mode = 'flying'
        }
        
        // 35% chance to do a close sweep to gently drift in front of the camera view
        const isForeground = Math.random() > 0.65
        const radius = isForeground ? (15 + Math.random() * 10) : (5 + Math.random() * 8)
        const angle = Math.random() * Math.PI * 2
        // Expand the height to comfortably visit the top and bottom corners of the screen!
        const height = Math.random() * 25 - 6 
        
        let targetZ = Math.sin(angle) * radius
        // Clamp Z so it never flies completely behind the user's camera to prevent disappearing!
        if (targetZ > 8) targetZ = 8 
        
        data.targetPos.set(
          Math.cos(angle) * radius,
          height,
          targetZ
        )
        // Fly smoothly but a bit faster than before!
        data.timer = 5 + Math.random() * 5
        data.flySpeed = 0.008 + Math.random() * 0.006 
        
        // 10% chance it decides to dive-bomb and sit on the island! (only when flying naturally)
        if (data.mode === 'flying' && Math.random() > 0.9) {
          data.mode = 'sitting'
          data.timer = 8 + Math.random() * 10 // sit for a long time
          // Land peacefully in the main view area
          data.targetPos.set(
            (Math.random() * 6) - 3, 
            2 + Math.random() * 4, 
            (Math.random() * 6) - 3
          ) 
        }
      }

      // Sync the moving state for the particle trails!
      if (!isMoving) setIsMoving(true)

      // Create "Water-Like Currents" for extremely organic, non-linear floating
      const tDrift = t * 0.5
      const flowX = Math.sin(tDrift * 1.3) * 3 + Math.sin(tDrift * 0.8) * 2
      const flowY = Math.sin(tDrift * 1.7) * 1.5
      const flowZ = Math.cos(tDrift * 1.1) * 3 + Math.sin(tDrift * 0.9) * 2
      
      const currentPos = robotRef.current.position.clone()
      
      // Calculate dynamic flowing target
      const moveTarget = data.targetPos.clone()
      moveTarget.x += flowX
      moveTarget.y += flowY
      moveTarget.z += flowZ
      
      // Extremely smooth lerp creates water-like viscosity/drag
      robotRef.current.position.lerp(moveTarget, data.flySpeed)
      
      // Calculate continuous "velocity" vector to determine how to bank and lean!
      const velocityX = (moveTarget.x - currentPos.x) * data.flySpeed
      const velocityZ = (moveTarget.z - currentPos.z) * data.flySpeed

      // Look far ahead smoothly (to its true ultimate target, not the local flow)
      const lookTarget = currentPos.clone().lerp(data.targetPos, 0.01)
      lookTarget.y = currentPos.y // Lock the neck so he doesn't look up/down awkwardly
      robotRef.current.lookAt(lookTarget)
      
      // Beautiful Organic Banking: Leans into turns based on actual physical momentum!
      const targetBankZ = -velocityX * 4
      const targetPitchX = velocityZ * 4
      
      robotRef.current.rotation.z = THREE.MathUtils.lerp(robotRef.current.rotation.z, targetBankZ, 0.04)
      robotRef.current.rotation.x = THREE.MathUtils.lerp(robotRef.current.rotation.x, targetPitchX, 0.04)

    } else if (data.mode === 'sitting') {
      // Lerp very, very gently to sitting pos so it floats down softly
      robotRef.current.position.lerp(data.targetPos, 0.02)
      
      // Sit back and enjoy the view! Rotate gently.
      robotRef.current.rotation.x = THREE.MathUtils.lerp(robotRef.current.rotation.x, 0, 0.02)
      robotRef.current.rotation.z = THREE.MathUtils.lerp(robotRef.current.rotation.z, 0, 0.02)
      robotRef.current.rotation.y += delta * 0.1 // Spins extremely slowly around looking at things
      
      // Stop the particles since we are parked
      if (isMoving) setIsMoving(false)

      if (data.timer <= 0) {
        data.mode = 'flying'
      }
    }

    // -- 3D to 2D PROJECTION FOR DOM INTERACTION --
    // We project the drone's center immediately to 2D pixel coordinates and share it with pure CSS!
    const vector = robotRef.current.position.clone()
    vector.project(state.camera)
    
    // Convert normalized device coordinates (-1 to +1) to pixel screen coordinates
    const rx = (vector.x * 0.5 + 0.5) * window.innerWidth
    const ry = (-(vector.y * 0.5) + 0.5) * window.innerHeight
    
    // Store in global CSS so DOM elements can compute repel/pushing forces
    document.body.style.setProperty('--robot-x', `${rx}px`)
    document.body.style.setProperty('--robot-y', `${ry}px`)
    // -- DYNAMIC Z-INDEXING (THE MAGIC LAYER INTERLEAVING!) --
    // Compute exact physical distance from camera lens to the robot
    const dist = robotRef.current.position.distanceTo(state.camera.position)
    
    // If the robot swoops closer than 22 units, it pops out IN FRONT of the Glassmorphic HTML cards!
    // If it flies further away, it slips BEHIND the HTML cards, but stays in front of the Island!
    if (robotContainerRef && robotContainerRef.current) {
      if (dist < 26) {
        robotContainerRef.current.style.zIndex = '9999' // Topmost layer
      } else {
        robotContainerRef.current.style.zIndex = '50'   // Middle layer (Behind HTML which is 100)
      }
    }
    
  })

  return (
    <group 
      ref={robotRef}
      onPointerOver={handleInteract}
      onClick={handleInteract}
    >
      {/* Dynamic Particle System Tail */}
      {isMoving && (
        <Sparkles
          count={80}          // Optimized particle count for better performance
          scale={2}           // Tighter spread closely behind the robot
          size={5}            // Variable sizing
          speed={0.6}         // High energy movement
          opacity={0.8}
          color={'#38bdf8'}   // Neon blue thruster trail
          noise={15}          // Aggressive chaotic physics-based drift
        />
      )}
      <primitive 
        object={scene} 
        scale={1.5} 
        dispose={null}
      />
      
      {taunt && (
        <Html position={[0, 3, 0]} center style={{ pointerEvents: 'none', whiteSpace: 'nowrap' }}>
          <div style={{
            background: 'rgba(56, 189, 248, 0.9)',
            color: '#000',
            padding: '8px 16px',
            borderRadius: '20px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '14px',
            fontWeight: 'bold',
            boxShadow: '0 0 20px rgba(56,189,248,0.8)',
            transform: 'translateY(-10px)',
            animation: 'heroFadeIn 0.2s ease-out'
          }}>
            {taunt}
          </div>
        </Html>
      )}
    </group>
  )
}


/* ─── Projects Configuration mapped to 3D Space ─── */
// Tuned coordinates for a Scale=25 Island
const PROJECTS_3D = [
  {
    id: 'cafe',
    name: 'CafePOSPro',
    desc: 'Full-stack POS with QR menu & live tracking',
    icon: <Web fontSize="small" />,
    color: '#38bdf8',
    pos: [-12, 6, 8], 
    scrollEnter: 0.15,
    link: 'https://github.com/AanandAB/CafePOSPRO'
  },
  {
    id: 'theyyam',
    name: 'Theyyam & Tourism App',
    desc: 'Live cultural tourism app with OSM & Weather',
    icon: <RocketLaunch fontSize="small" />,
    color: '#fbbf24',
    pos: [10, 8, 12],
    scrollEnter: 0.35,
  },
  {
    id: 'knightly',
    name: 'Knightly Chess',
    desc: 'Decentralised blockchain chess',
    icon: <GitHub fontSize="small" />,
    color: '#c084fc',
    pos: [15, 4, -6],
    scrollEnter: 0.55,
    link: 'https://github.com/AanandAB/KNIGHTLY'
  },
  {
    id: 'evently',
    name: 'Evently Connect',
    desc: 'Sleek event management landing page',
    icon: <DesignServices fontSize="small" />,
    color: '#f472b6',
    pos: [-6, 10, -12],
    scrollEnter: 0.75,
    link: 'https://github.com/AanandAB/evently-connect-portal'
  },
  {
    id: 'bytebot',
    name: 'Bytebot AI Lab',
    desc: 'Self-adaptive multi-agent AI framework',
    icon: <RocketLaunch fontSize="small" />,
    color: '#34d399',
    pos: [0, 14, -15],
    scrollEnter: 0.88,
  },
  {
    id: 'aios',
    name: 'AIOS v2.0',
    desc: 'Local AI Operating System & Agents',
    icon: <Memory fontSize="small" />,
    color: '#ef4444',
    pos: [8, 16, -5],
    scrollEnter: 1.0, 
  }
]

/* ─── 3D Island & Camera Tour Logic ─── */
function TourScene() {
  const { scene } = useGLTF(import.meta.env.BASE_URL + 'models/island.glb')
  const islandRef = useRef()
  const scrollProgress = usePortfolioStore((s) => s.scrollProgress)
  const vFocus = new THREE.Vector3()

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    
    // Slow underlying auto-rotation of the island
    if (islandRef.current) {
      islandRef.current.rotation.y += delta * 0.05
    }
  })

  return (
    <>
      <Float floatIntensity={0.1} speed={0.5}>
        <primitive
          ref={islandRef}
          object={scene}
          scale={25}
          position={[0, -5, 0]}
          dispose={null}
        />
        
        {/* Render 3D HTML overlays attached directly to global coordinates */}
        {PROJECTS_3D.map((proj) => {
          // Calculate opacity based on proximity to the scroll waypoint
          const opacity = Math.max(0, 1 - Math.abs(scrollProgress - proj.scrollEnter) * 5)
          const isVisible = opacity > 0.01

          if (!isVisible) return null

          return (
            <Html
              key={proj.id}
              position={proj.pos}
              center
              zIndexRange={[100, 0]}
              distanceFactor={15}
              style={{
                opacity,
                pointerEvents: isVisible ? 'auto' : 'none',
                transition: 'opacity 0.1s'
              }}
            >
              <div
                style={{
                  background: 'rgba(5, 10, 20, 0.85)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${proj.color}50`,
                  borderRadius: '16px',
                  padding: '16px 20px',
                  width: '240px',
                  color: '#fff',
                  boxShadow: `0 0 30px ${proj.color}30`,
                  textAlign: 'center',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <div style={{ color: proj.color, marginBottom: '8px' }}>{proj.icon}</div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontFamily: "'Space Grotesk', sans-serif" }}>
                  {proj.name}
                </h3>
                <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: '#cbd5e1' }}>
                  {proj.desc}
                </p>
                {proj.link && (
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      background: `${proj.color}20`,
                      color: proj.color,
                      textDecoration: 'none',
                      padding: '6px 16px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: 600,
                      border: `1px solid ${proj.color}50`,
                      transition: 'transform 0.2s',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    VIEW REPO
                  </a>
                )}
              </div>
            </Html>
          )
        })}
      </Float>
    </>
  )
}

/* ─── Shared Camera Rig (Syncs Both Canvases!) ─── */
function CameraRig() {
  const scrollProgress = usePortfolioStore((s) => s.scrollProgress)

  useFrame((state) => {
    // Camera animation path tuned for Scale 25 island
    const theta = -scrollProgress * Math.PI * 2.5 // greater than 360 degree orbit
    const radius = 35 - Math.sin(scrollProgress * Math.PI) * 10 
    const camY = 15 + Math.sin(scrollProgress * Math.PI * 2) * 8

    // Target Camera Position
    const targetX = Math.sin(theta) * radius
    const targetZ = Math.cos(theta) * radius

    // Set camera position directly
    state.camera.position.set(targetX, camY, targetZ)
    state.camera.lookAt(0, 5, 0)
  })

  return null
}

/* ─── BackgroundScene: Manages layering of WebGL Canvases ─── */
export default function BackgroundScene() {
  const robotContainerRef = useRef(null)

  return (
    <>
      {/* LAYER 1: The Island (Always Behind everything, fixed at z-index 1) */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
        <Suspense fallback={null}>
          <Canvas
            dpr={[1, 1.5]}    // KEY PERFORMANCE FIX: Cap pixel ratio to 1.5 for retina/mobile!
            eventSource={document.body}
            eventPrefix="client"
            camera={{ position: [0, 4, 12], fov: 50 }}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
          >
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 8, 5]} intensity={1.2} />
            <pointLight position={[-3, 4, -2]} color="#0ea5e9" intensity={0.5} distance={20} />
            
            <CameraRig />
            <TourScene />
          </Canvas>
        </Suspense>
      </div>

      {/* LAYER 3: The Robot (Dynamically pops back and forth, z-index 50 or 9999) */}
      <div 
        ref={robotContainerRef} 
        style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none' }}
      >
        <Suspense fallback={null}>
          <Canvas
            dpr={[1, 1.5]}    // KEY PERFORMANCE FIX: Cap pixel ratio to 1.5 for retina/mobile!
            eventSource={document.body}
            eventPrefix="client"
            camera={{ position: [0, 4, 12], fov: 50 }}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
          >
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 8, 5]} intensity={1.2} />
            <pointLight position={[4, 2, 3]} color="#c084fc" intensity={0.4} distance={15} />

            <CameraRig />
            <RobotVisitor robotContainerRef={robotContainerRef} />
          </Canvas>
        </Suspense>
      </div>
    </>
  )
}
