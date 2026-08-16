import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const P = '#F9FBFB'  // primary white
const VD = '#0D3A62' // visor dark
const VB = '#00B8E8' // visor bright

function createEva() {
  const group = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: P, roughness: 0.06, metalness: 0.03 })

  // ── Egg-shaped torso ──
  const bodyGeo = new THREE.SphereGeometry(0.45, 48, 48)
  bodyGeo.scale(1, 1.5, 0.85)
  group.add(new THREE.Mesh(bodyGeo, mat))

  // ── Head ──
  const headGeo = new THREE.SphereGeometry(0.26, 40, 40)
  headGeo.scale(1.05, 0.65, 0.9)
  const head = new THREE.Mesh(headGeo, new THREE.MeshStandardMaterial({ color: P, roughness: 0.05, metalness: 0.03 }))
  head.position.y = 0.48
  group.add(head)

  // ── Visor ──
  const visorGeo = new THREE.SphereGeometry(0.22, 36, 20, 0, Math.PI*2, 0.15, Math.PI*0.45)
  visorGeo.scale(1.05, 0.55, 0.82)
  const visor = new THREE.Mesh(visorGeo, new THREE.MeshStandardMaterial({ color: VD, roughness: 0.15, metalness: 0.1, transparent: true, opacity: 0.75 }))
  visor.rotation.x = -0.1
  visor.position.set(0, 0.46, 0.16)
  group.add(visor)

  // ── Eyes with glow ──
  const eyeGeo = new THREE.SphereGeometry(0.05, 24, 24)
  eyeGeo.scale(1.4, 0.9, 0.3)
  const eyeMat = new THREE.MeshBasicMaterial({ color: VD })
  const lEye = new THREE.Mesh(eyeGeo, eyeMat); lEye.position.set(-0.08, 0.52, 0.2)
  const rEye = new THREE.Mesh(eyeGeo, eyeMat); rEye.position.set(0.08, 0.52, 0.2)
  const glowGeo = new THREE.RingGeometry(0.045, 0.058, 24)
  const glowMat = new THREE.MeshBasicMaterial({ color: VB, side: THREE.DoubleSide, transparent: true, opacity: 0.4 })
  const lGlow = new THREE.Mesh(glowGeo, glowMat); lGlow.position.set(-0.08, 0.52, 0.205)
  const rGlow = new THREE.Mesh(glowGeo, glowMat); rGlow.position.set(0.08, 0.52, 0.205)
  group.add(lEye, rEye, lGlow, rGlow)

  // ── Arms ──
  const armGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.9, 12)
  const armMat = new THREE.MeshStandardMaterial({ color: P, roughness: 0.07, metalness: 0.04 })
  const lArm = new THREE.Mesh(armGeo, armMat)
  lArm.position.set(-0.42, 0.0, 0); lArm.rotation.z = 0.2
  const rArm = new THREE.Mesh(armGeo, armMat)
  rArm.position.set(0.42, 0.0, 0); rArm.rotation.z = -0.2
  group.add(lArm, rArm)

  return { group, lGlow, rGlow }
}

/* ═══════════════════════════════════════════════
   CSS STARS
   ═══════════════════════════════════════════════ */
function Starfield() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {Array.from({ length: 200 }, (_, i) => (
        <div key={i} style={{
          position: 'absolute', left: `${Math.random()*100}%`, top: `${Math.random()*100}%`,
          width: `${Math.random()*3+1}px`, height: `${Math.random()*3+1}px`, borderRadius: '50%',
          background: i%3===0?'#ffffff':i%3===1?'#ccddff':'#aaccff',
          boxShadow: i%4===0?`0 0 ${Math.random()*4+2}px rgba(180,210,255,0.5)`:'none',
          opacity: Math.random()*0.7+0.3,
          animation: `tw${i%5} ${Math.random()*3+2}s ease-in-out ${Math.random()*3}s infinite`,
        }} />
      ))}
      <style>{`
        @keyframes tw0{0%,100%{opacity:0.3}50%{opacity:0.9}}
        @keyframes tw1{0%,100%{opacity:0.5}30%{opacity:0.2}60%{opacity:0.8}}
        @keyframes tw2{0%,100%{opacity:0.4}40%{opacity:0.9}70%{opacity:0.2}}
        @keyframes tw3{0%,100%{opacity:0.6}25%{opacity:0.2}55%{opacity:0.9}80%{opacity:0.3}}
        @keyframes tw4{0%,100%{opacity:0.35}50%{opacity:0.85}75%{opacity:0.15}}
      `}</style>
    </div>
  )
}

export default function BackgroundScene() {
  const mountRef = useRef(null)
  const tauntRef = useRef(null)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(55, innerWidth/innerHeight, 1, 50)
    camera.position.set(0, 1, 7)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    renderer.setSize(innerWidth, innerHeight)
    container.appendChild(renderer.domElement)
    scene.add(new THREE.AmbientLight(0xffffff, 0.8))
    scene.add(new THREE.PointLight(0xffffff, 1.2, 12)).position.set(3, 4, 3)

    // White egg at SAME spot as red sphere
    const bodyGeo = new THREE.SphereGeometry(0.5, 32, 32)
    const body = new THREE.Mesh(bodyGeo, new THREE.MeshStandardMaterial({ color: '#F9FBFB', roughness: 0.06, metalness: 0.03 }))
    body.position.set(2, 1, 2)
    scene.add(body)

    const s = {
      pos: new THREE.Vector3(0, 1.2, 2),
      target: new THREE.Vector3(0, 1.2, 2),
      timer: 0, busy: false,
    }

    window.addEventListener('resize', () => { camera.aspect = innerWidth/innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight) })

    const swapDom = (a, b) => {
      const pA = a.parentNode
      if (a.nextSibling === b) pA.insertBefore(b, a)
      else { const ph = document.createTextNode(''); pA.insertBefore(ph, a); pA.insertBefore(a, b); pA.insertBefore(b, ph); pA.removeChild(ph) }
    }

    const rearrange = () => {
      if (s.busy) return
      const els = Array.from(document.querySelectorAll('.pw-card-outer, .cg-card, .exp-stat'))
        .filter(el => { const r = el.getBoundingClientRect(); return r.width > 50 && r.height > 20 && r.top < innerHeight && r.bottom > 0 })
      if (els.length < 2) return
      const i = Math.floor(Math.random()*els.length)
      let j; do { j = Math.floor(Math.random()*els.length) } while (j===i)
      const a = els[i], b = els[j]
      s.busy = true
      // Fly to A
      const rA = a.getBoundingClientRect()
      s.target.set(((rA.left+rA.width/2)/innerWidth-0.5)*7, -((rA.top+rA.height/2)/innerHeight-0.5)*4+1.2, 1.5)
      if(tauntRef.current){tauntRef.current.textContent='Found one! 🔍';tauntRef.current.style.opacity='1'}
      setTimeout(() => {
        a.style.setProperty('transition','all 0.4s cubic-bezier(0.34,1.56,0.64,1)','important')
        a.style.setProperty('transform','scale(0.75) rotate(-2deg)','important')
        a.style.setProperty('filter','brightness(1.5) drop-shadow(0 0 30px rgba(0,184,232,0.9))','important')
        const rB = b.getBoundingClientRect()
        s.target.set(((rB.left+rB.width/2)/innerWidth-0.5)*7, -((rB.top+rB.height/2)/innerHeight-0.5)*4+1.2, 1.5)
        setTimeout(() => {
          b.style.setProperty('transition','all 0.4s cubic-bezier(0.34,1.56,0.64,1)','important')
          b.style.setProperty('transform','scale(0.75) rotate(2deg)','important')
          b.style.setProperty('filter','brightness(1.5) drop-shadow(0 0 30px rgba(0,184,232,0.9))','important')
          setTimeout(() => {
            swapDom(a,b)
            ;[a,b].forEach(el => { el.style.setProperty('transition','all 0.6s cubic-bezier(0.16,1,0.3,1)','important'); el.style.setProperty('transform','scale(1) rotate(0deg)','important'); el.style.setProperty('filter','','important') })
            if(tauntRef.current){tauntRef.current.textContent='Perfect! ✨';tauntRef.current.style.opacity='1'}
            s.target.set((Math.random()-0.5)*3, 1.2, 2.5)
            setTimeout(() => { s.busy=false; if(tauntRef.current)tauntRef.current.style.opacity='0' }, 2500)
          }, 400)
        }, 600)
      }, 500)
    }

    let animId
    const animate = () => {
      const t = Date.now() * 0.001
      s.timer -= 0.016
      if (s.timer <= 0 && !s.busy) {
        s.target.set((Math.random()-0.5)*6, (Math.random()-0.5)*3+1.2, Math.random()*1.5+1.8)
        s.timer = 5 + Math.random()*6
      }
      const mid = new THREE.Vector3().addVectors(s.pos, s.target).multiplyScalar(0.5)
      mid.y += Math.sin(t*0.2)*1.2; mid.x += Math.sin(t*0.25)*1
      const p = Math.min(1, 1 - s.timer/(s.timer+0.016))
      const om = 1-p
      s.pos.set(om*om*s.pos.x+2*om*p*mid.x*0.5+p*p*s.target.x*0.5+s.pos.x*0.5, om*om*s.pos.y+2*om*p*mid.y*0.5+p*p*s.target.y*0.5+s.pos.y*0.5, om*om*s.pos.z+2*om*p*mid.z*0.5+p*p*s.target.z*0.5+s.pos.z*0.5)
      body.position.set(s.pos.x, s.pos.y+Math.sin(t*1.2)*0.06, s.pos.z)
      body.rotation.z += (s.pos.x*0.02-body.rotation.z)*0.03

      renderer.render(scene, camera)
      animId = requestAnimationFrame(animate)
    }
    animate()
    const interval = setInterval(rearrange, 14000)
    setTimeout(rearrange, 6000)
    return () => { cancelAnimationFrame(animId); clearInterval(interval); renderer.dispose(); container.removeChild(renderer.domElement) }
  }, [])

  return (
    <>
      <Starfield />
      <div ref={mountRef} style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none' }} />
      <div ref={tauntRef} style={{ position:'fixed',top:'10%',left:'50%',transform:'translateX(-50%)',zIndex:6,pointerEvents:'none',opacity:0,transition:'opacity 0.3s',background:'rgba(0,184,232,0.88)',color:'#fff',padding:'8px 18px',borderRadius:'20px',fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:600,boxShadow:'0 0 24px rgba(0,184,232,0.6)' }} />
    </>
  )
}
