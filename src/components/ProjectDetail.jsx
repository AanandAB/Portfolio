import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Lenis from '@studio-freight/lenis'
import { ISLANDS } from '../data/islands'

const CLIP_FILES = [
  'vid/01-cafe.mp4', 'vid/02-theyyam.mp4', 'vid/03-knightly.mp4',
  'vid/04-evently.mp4', 'vid/05-bytebot.mp4', 'vid/06-aios.mp4',
  'vid/07-tactis.mp4', 'vid/08-sudoku.mp4', 'vid/09-cafemaster.mp4',
  'vid/10-aquarium.mp4',
]

const COLORS = ['#38bdf8','#fbbf24','#c084fc','#f472b6','#34d399','#ef4444','#84cc16','#818cf8','#f59e0b','#14b8a6']

/* ═══════════════════════════════════════════════
   CUSTOM CURSOR (inline for detail view)
   ═══════════════════════════════════════════════ */
function DetailCursor({ color }) {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  useEffect(() => {
    let x = 0, y = 0, tx = 0, ty = 0
    const onMove = (e) => { tx = e.clientX; ty = e.clientY }
    window.addEventListener('mousemove', onMove, { passive: true })
    function anim() {
      x += (tx - x) * 0.15; y += (ty - y) * 0.15
      if (dotRef.current) { dotRef.current.style.transform = `translate(${tx}px,${ty}px)` }
      if (ringRef.current) { ringRef.current.style.transform = `translate(${x}px,${y}px)` }
      requestAnimationFrame(anim)
    }
    requestAnimationFrame(anim)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])
  return (
    <>
      <div ref={dotRef} style={{position:'fixed',zIndex:9999,pointerEvents:'none',width:6,height:6,borderRadius:'50%',background:color,transform:'translate(-50%,-50%)',boxShadow:`0 0 10px ${color}`}} />
      <div ref={ringRef} style={{position:'fixed',zIndex:9998,pointerEvents:'none',width:28,height:28,borderRadius:'50%',border:`1.5px solid ${color}40`,transform:'translate(-50%,-50%)'}} />
    </>
  )
}

export default function ProjectDetail({ projectId, onClose }) {
  const videoRef = useRef(null)
  const lenisRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const [progress, setProgress] = useState(0)

  const idx = ISLANDS.findIndex(i => i.id === projectId)
  const project = idx >= 0 ? ISLANDS[idx] : null
  const clipFile = idx >= 0 ? CLIP_FILES[idx] : null
  const accent = idx >= 0 ? COLORS[idx] : '#38bdf8'
  const features = project?.features || []
  const tags = project?.tags || []
  const status = project?.status || []

  // ═══ SCROLL RESET — must beat Lenis + browser scroll restoration ═══
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    const r1 = requestAnimationFrame(() => {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
    })
    const t1 = setTimeout(() => {
      window.scrollTo(0, 0)
      if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true })
    }, 120)
    return () => { clearTimeout(t1); cancelAnimationFrame(r1) }
  }, [projectId])

  // Lenis — force start at 0
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.07, smoothWheel: true, smoothTouch: false })
    lenisRef.current = lenis
    lenis.scrollTo(0, { immediate: true })
    function raf(t) { lenis.raf(t); requestAnimationFrame(raf) }
    const id = requestAnimationFrame(raf)
    return () => { cancelAnimationFrame(id); lenis.destroy(); lenisRef.current = null }
  }, [])

  // Load video
  useEffect(() => {
    if (!clipFile) return
    const vid = videoRef.current
    fetch(clipFile).then(r => r.blob()).then(blob => {
      vid.src = URL.createObjectURL(blob)
      vid.addEventListener('loadedmetadata', () => {
        setLoaded(true)
        vid.play().then(() => vid.pause()).catch(() => {})
      })
    }).catch(() => { vid.src = clipFile })
  }, [clipFile])

  // Scroll → video scrub
  useEffect(() => {
    const onScroll = () => {
      const maxScroll = document.body.scrollHeight - window.innerHeight
      const p = maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0
      setProgress(p)
      const vid = videoRef.current
      if (vid?.duration && !vid.seeking) vid.currentTime = p * vid.duration
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [loaded])

  if (!project) {
    return (
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',background:'#020410',flexDirection:'column',gap:16}}>
        <span style={{fontSize:40}}>🚀</span><span>Project not found</span>
        <button onClick={onClose} style={{color:'#38bdf8',cursor:'pointer',background:'none',border:'1px solid #38bdf840',borderRadius:8,padding:'8px 20px',fontSize:13,fontFamily:'JetBrains Mono,monospace'}}>← Back</button>
      </div>
    )
  }

  const featureReveals = features.map((_, i) => (i + 1) / (features.length + 1))

  return (
    <div style={{position:'relative',background:'#020410'}}>
      <DetailCursor color={accent} />

      {/* Video */}
      <video ref={videoRef} muted playsInline preload="auto" style={{position:'fixed',inset:0,zIndex:0,width:'100%',height:'100%',objectFit:'cover'}} />
      <div style={{position:'fixed',inset:0,zIndex:1,pointerEvents:'none',background:'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(2,4,16,0.55) 100%)'}} />

      {/* Header */}
      <div style={{position:'fixed',top:0,left:0,right:0,zIndex:30,padding:'clamp(12px,3vw,20px) clamp(16px,5vw,50px)',display:'flex',justifyContent:'space-between',alignItems:'center',background:'linear-gradient(180deg, rgba(2,4,16,0.85) 0%, transparent 100%)'}}>
        <button onClick={() => { onClose(); window.scrollTo(0,0) }} style={{display:'flex',alignItems:'center',gap:6,color:'#fff',background:'rgba(255,255,255,0.06)',backdropFilter:'blur(10px)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:8,padding:'7px 14px',cursor:'pointer',fontFamily:'JetBrains Mono,monospace',fontSize:11,transition:'all 0.2s'}}>← Back</button>
        <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:10,color:'#64748b'}}>{String(idx+1).padStart(2,'0')} / {ISLANDS.length}</span>
      </div>

      {/* Bottom info panel */}
      <div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:25,padding:'clamp(14px,3vh,28px) clamp(18px,5vw,50px)',background:'linear-gradient(0deg, rgba(2,4,16,0.95) 0%, transparent 100%)'}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
          <span style={{width:7,height:7,borderRadius:'50%',background:accent,boxShadow:`0 0 8px ${accent}`}} />
          <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:10,color:accent,letterSpacing:'0.12em',textTransform:'uppercase'}}>{tags[0] || project.name}</span>
        </div>
        <h1 style={{fontFamily:'Space Grotesk,sans-serif',fontSize:'clamp(22px,3.5vw,38px)',fontWeight:700,color:'#fff',margin:'0 0 4px',lineHeight:1.1}}>{project.name}</h1>
        <p style={{fontFamily:'Inter,sans-serif',fontSize:12,color:'#94a3b8',margin:'0 0 8px',lineHeight:1.5,maxWidth:480}}>{project.description}</p>
        <div style={{display:'flex',flexWrap:'wrap',gap:5,marginBottom:6}}>
          {tags.slice(0,6).map(t=><span key={t} style={{padding:'3px 10px',borderRadius:999,border:`1px solid ${accent}30`,color:accent,fontSize:10,fontFamily:'JetBrains Mono,monospace',background:`${accent}10`}}>{t}</span>)}
          {status.map(s=><span key={s} style={{padding:'3px 10px',borderRadius:6,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',color:'#94a3b8',fontSize:10}}>{s}</span>)}
        </div>
        <div style={{display:'flex',gap:8}}>
          {project.github && <a href={project.github} target="_blank" rel="noopener noreferrer" style={{display:'inline-flex',alignItems:'center',gap:5,padding:'6px 14px',borderRadius:8,border:'1px solid rgba(255,255,255,0.12)',color:'#e2e8f0',fontSize:11,fontFamily:'JetBrains Mono,monospace',textDecoration:'none',transition:'all 0.2s'}}>GitHub ↗</a>}
          {project.live && <a href={project.live} target="_blank" rel="noopener noreferrer" style={{display:'inline-flex',alignItems:'center',gap:5,padding:'6px 14px',borderRadius:8,background:`${accent}20`,border:`1px solid ${accent}40`,color:accent,fontSize:11,fontFamily:'JetBrains Mono,monospace',textDecoration:'none',fontWeight:600}}>Live ↗</a>}
        </div>
      </div>

      {/* Features — reveal one by one */}
      <div style={{position:'fixed',right:'clamp(12px,3vw,40px)',top:'50%',transform:'translateY(-50%)',zIndex:20,pointerEvents:'none',display:'flex',flexDirection:'column',gap:'clamp(50px,10vh,90px)'}}>
        {features.slice(0,5).map((f, i) => {
          const visible = progress >= featureReveals[i]
          return (
            <motion.div key={i} initial={{opacity:0,x:30}} animate={{opacity:visible?1:0.1,x:visible?0:20}} transition={{duration:0.4,ease:'easeOut'}} style={{display:'flex',alignItems:'center',gap:10}}>
              <span style={{width:26,height:26,borderRadius:'50%',background:`${accent}20`,border:`1px solid ${accent}30`,display:'grid',placeItems:'center',fontSize:11,fontFamily:'JetBrains Mono,monospace',color:accent,flexShrink:0}}>{String(i+1).padStart(2,'0')}</span>
              <span style={{fontSize:11,color:visible?'#e2e8f0':'#475569',maxWidth:170,fontFamily:'Inter,sans-serif',lineHeight:1.4,transition:'color 0.3s'}}>{f}</span>
            </motion.div>
          )
        })}
      </div>

      {/* Scroll hint — only at start */}
      <motion.div animate={{opacity:progress<0.05?1:0}} style={{position:'fixed',bottom:120,left:'50%',transform:'translateX(-50%)',zIndex:20,pointerEvents:'none',display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
        <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:10,color:'#64748b',letterSpacing:'0.16em'}}>SCROLL TO EXPLORE</span>
        <motion.span animate={{y:[0,6,0]}} transition={{repeat:Infinity,duration:1.8}} style={{color:accent,fontSize:16}}>↓</motion.span>
      </motion.div>

      {/* Progress bar */}
      <div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:35,height:2}}>
        <div style={{height:'100%',background:accent,width:`${progress*100}%`,transition:'width 0.08s linear',boxShadow:`0 0 4px ${accent}`}} />
      </div>

      {/* Scroll track */}
      <div style={{height:'300vh'}} />
    </div>
  )
}
