import React, { useEffect, useState, useCallback, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import CustomCursor from './components/CustomCursor'
import ErrorBoundary from './components/ErrorBoundary'
import ProjectDetail from './components/ProjectDetail'
import BackgroundScene from './components/BackgroundScene'

const ExperienceSection = lazy(() => import('./sections/ExperienceSection'))
const ProjectsSection = lazy(() => import('./sections/ProjectsSection'))
const CertificatesSection = lazy(() => import('./sections/CertificatesSection'))

function HeroSection() {
  return (
    <section style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',position:'relative',zIndex:10,padding:'0 24px'}}>
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6}} style={{display:'inline-flex',alignItems:'center',gap:8,padding:'6px 18px',borderRadius:999,border:'1px solid rgba(56,189,248,0.2)',background:'rgba(56,189,248,0.05)',backdropFilter:'blur(12px)',marginBottom:32}}>
        <span style={{width:7,height:7,borderRadius:'50%',background:'#38bdf8',boxShadow:'0 0 8px #38bdf8',animation:'hd 1.5s ease-in-out infinite'}} />
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'#38bdf8',letterSpacing:'0.16em',textTransform:'uppercase'}}>PORTFOLIO · 11 PROJECTS</span>
      </motion.div>
      <motion.h1 initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{duration:0.8,delay:0.15}} style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'clamp(48px,10vw,100px)',fontWeight:800,color:'#fff',lineHeight:0.95,margin:'0 0 20px',letterSpacing:'-0.03em'}}>AANAND AB</motion.h1>
      <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6,delay:0.35}} style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'clamp(16px,2vw,24px)',fontWeight:500,margin:'0 0 10px',background:'linear-gradient(90deg,#38bdf8,#818cf8,#c084fc)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Software Engineer &amp; Builder</motion.p>
      <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.6,delay:0.5}} style={{fontFamily:"'Inter',sans-serif",fontSize:14,color:'#94a3b8',maxWidth:440,lineHeight:1.6,margin:'6px 0 28px'}}>Click any project to explore its cinematic diorama world.</motion.p>
      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:0.65}} style={{display:'flex',gap:8,flexWrap:'wrap',justifyContent:'center'}}>
        {['React','Flutter','Next.js','Salesforce','Python','AI'].map(t=><span key={t} style={{padding:'5px 14px',borderRadius:999,border:'1px solid rgba(255,255,255,0.07)',color:'#94a3b8',fontSize:11,fontFamily:"'JetBrains Mono',monospace",background:'rgba(255,255,255,0.015)',backdropFilter:'blur(4px)'}}>{t}</span>)}
      </motion.div>
      <style>{`@keyframes hd{0%,100%{opacity:.35;transform:scale(1)}50%{opacity:1;transform:scale(1.5)}}`}</style>
    </section>
  )
}

function SectionFallback() {
  return <div style={{minHeight:'40vh',display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{width:28,height:28,border:'2px solid rgba(56,189,248,0.12)',borderTopColor:'#38bdf8',borderRadius:'50%',animation:'spin 0.6s linear infinite'}} /></div>
}

function ContactSection() {
  return (
    <section style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',padding:'80px 24px',position:'relative',zIndex:10}}>
      <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 60%,rgba(56,189,248,0.04) 0%,transparent 60%),radial-gradient(ellipse at 40% 30%,rgba(192,132,252,0.03) 0%,transparent 50%)'}} />
      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'#34d399',letterSpacing:'0.18em',textTransform:'uppercase',marginBottom:18,position:'relative',zIndex:1}}>▸ All Worlds Explored ◂</div>
      <h2 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'clamp(28px,4.5vw,50px)',fontWeight:700,color:'#fff',lineHeight:1.15,maxWidth:640,marginBottom:36,position:'relative',zIndex:1}}>All 11 projects charted.<br/><span style={{background:'linear-gradient(90deg,#38bdf8,#c084fc)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Let's build something together.</span></h2>
      <div style={{display:'flex',gap:10,flexWrap:'wrap',justifyContent:'center',marginBottom:40,position:'relative',zIndex:1}}>
        {[{l:'GitHub →',h:'https://github.com/AanandAB',s:{border:'1px solid rgba(255,255,255,0.1)',color:'#e2e8f0',background:'rgba(5,10,20,0.4)',backdropFilter:'blur(10px)'}},{l:'LinkedIn →',h:'https://linkedin.com/in/aanandab',s:{border:'1px solid rgba(56,189,248,0.25)',color:'#38bdf8',background:'rgba(56,189,248,0.06)',backdropFilter:'blur(10px)'}},{l:'Email ✉',h:'mailto:aanandab@outlook.com',s:{border:'none',background:'linear-gradient(135deg,#38bdf8,#c084fc)',color:'#fff',fontWeight:600,boxShadow:'0 0 20px rgba(56,189,248,0.2)'}}].map(b=><a key={b.l} href={b.h} target="_blank" rel="noopener noreferrer" style={{display:'inline-flex',alignItems:'center',gap:6,padding:'12px 24px',borderRadius:10,fontFamily:"'JetBrains Mono',monospace",fontSize:12,textDecoration:'none',...b.s}}>{b.l}</a>)}
      </div>
      <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'#475569',maxWidth:460,position:'relative',zIndex:1}}>Built with React · Framer Motion · Lenis · AI diorama clips</p>
    </section>
  )
}

export default function App() {
  const [detailProject, setDetailProject] = useState(null)

  // Scroll to top on mount
  useEffect(() => { window.scrollTo(0,0) }, [])

  // Listen for project open
  const openDetail = useCallback((projectId) => {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    setDetailProject(projectId)
  }, [])

  useEffect(() => {
    const h = (e) => { if (e.detail?.projectId) openDetail(e.detail.projectId) }
    window.addEventListener('openProjectDetail', h)
    return () => window.removeEventListener('openProjectDetail', h)
  }, [openDetail])

  const closeDetail = useCallback(() => {
    setDetailProject(null)
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
  }, [])

  return (
    <AnimatePresence mode="wait">
      {detailProject ? (
        <motion.div
          key="detail"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          <ProjectDetail key={detailProject} projectId={detailProject} onClose={closeDetail} />
        </motion.div>
      ) : (
        <motion.div
          key="home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div style={{position:'relative',background:'#020410'}}>
            <BackgroundScene />
            <CustomCursor color="#38bdf8" />
            <div style={{position:'relative',zIndex:10}}>
              <HeroSection />
              <ErrorBoundary name="Experience"><Suspense fallback={<SectionFallback />}><ExperienceSection /></Suspense></ErrorBoundary>
              <div style={{position:'relative',zIndex:100}}><ErrorBoundary name="Projects"><Suspense fallback={<SectionFallback />}><ProjectsSection /></Suspense></ErrorBoundary></div>
              <div style={{position:'relative',zIndex:100}}><ErrorBoundary name="Certificates"><Suspense fallback={<SectionFallback />}><CertificatesSection /></Suspense></ErrorBoundary></div>
              <ErrorBoundary name="Contact"><ContactSection /></ErrorBoundary>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
