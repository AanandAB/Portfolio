import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'
import { usePortfolioStore } from './store/portfolioStore'

import HeroScene from './sections/HeroScene'
import ExperienceSection from './sections/ExperienceSection'
import ProjectsSection from './sections/ProjectsSection'
import CertificatesSection from './sections/CertificatesSection'
import BackgroundScene from './components/BackgroundScene'
import CustomCursor from './components/CustomCursor'
import { useRobotPush } from './hooks/useRobotPush'

gsap.registerPlugin(ScrollTrigger)

/* ─── Pushable Components for Layout ─── */
function PushableHeader() {
  const { wrapperRef, innerRef } = useRobotPush({ pushRadius: 300, maxForce: 25, scaleCompression: 0.05 })
  return (
    <div ref={wrapperRef}>
      <h2
        ref={innerRef}
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(28px, 4vw, 48px)',
          fontWeight: 700,
          color: '#fff',
          lineHeight: 1.15,
          maxWidth: '600px',
          marginBottom: '40px',
          textShadow: '0 4px 20px #000',
        }}
      >
        All areas explored.
        <br />
        <span
          style={{
            background: 'linear-gradient(90deg, #38bdf8, #c084fc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Let's build something together.
        </span>
      </h2>
    </div>
  )
}

function PushableButton({ href, label, styleOverrides }) {
  const { wrapperRef, innerRef } = useRobotPush({ pushRadius: 200, maxForce: 15, scaleCompression: 0.02 })
  return (
    <div ref={wrapperRef}>
      <a
        ref={innerRef}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="contact-btn"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 24px',
          borderRadius: '10px',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '13px',
          textDecoration: 'none',
          transition: 'border-color 0.2s',
          ...styleOverrides
        }}
      >
        {label}
      </a>
    </div>
  )
}

/* ─── Contact Section ─── */
function ContactSection() {
  return (
    <section
      id="contact"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '80px 24px',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '12px',
          color: '#34d399',
          letterSpacing: '0.15em',
          marginBottom: '16px',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#34d399',
            animation: 'contactPulse 1.5s ease-in-out infinite',
            display: 'inline-block',
          }}
        />
        SIGNAL TRANSMITTED
      </div>

      <PushableHeader />

      {/* Contact buttons */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '48px',
        }}
      >
        <PushableButton 
          href="https://github.com/AanandAB" 
          label="GitHub →" 
          styleOverrides={{
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(5,10,20,0.4)',
            backdropFilter: 'blur(10px)',
            color: '#e2e8f0',
          }} 
        />
        <PushableButton 
          href="https://linkedin.com/in/aanandab" 
          label="LinkedIn →" 
          styleOverrides={{
            border: '1px solid rgba(56,189,248,0.3)',
            background: 'rgba(56,189,248,0.08)',
            backdropFilter: 'blur(10px)',
            color: '#38bdf8',
          }} 
        />
        <PushableButton 
          href="mailto:aanandab@outlook.com" 
          label="Email ✉" 
          styleOverrides={{
            border: 'none',
            background: 'linear-gradient(135deg, #38bdf8, #c084fc)',
            color: '#fff',
            fontWeight: 600,
            boxShadow: '0 0 20px rgba(56,189,248,0.3)',
          }} 
        />
      </div>

      {/* Footer */}
      <p
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '11px',
          color: '#94a3b8',
          maxWidth: '500px',
          textShadow: '0 2px 10px #000',
        }}
      >
        Built with React · Framer Motion · Three.js
        <br />
        <span style={{ color: '#475569', fontSize: '10px' }}>
          3D Model: "Floating Island" by Yosapat Panutyotin — CC-BY-4.0
        </span>
      </p>
    </section>
  )
}

/* ─── Track Full Page Scroll and Drive Zustand State ─── */
function ScrollTracker() {
  const setScrollProgress = usePortfolioStore((s) => s.setScrollProgress)
  const containerRef = useRef(null)

  useEffect(() => {
    // We bind a ScrollTrigger to the document root to update Progress 0...1
    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate(self) {
        setScrollProgress(self.progress)
      },
    })
    return () => trigger.kill()
  }, [setScrollProgress])

  return null
}

/* ─── App: Root Component ─── */
export default function App() {
  const lenisRef = useRef(null)

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.06,
      smoothWheel: true,
    })
    lenisRef.current = lenis

    const rafCallback = (time) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(rafCallback)
    gsap.ticker.lagSmoothing(0)
    lenis.on('scroll', ScrollTrigger.update)

    return () => {
      gsap.ticker.remove(rafCallback)
      lenis.destroy()
    }
  }, [])

  return (
    <div id="app" style={{ position: 'relative' }}>
      <ScrollTracker />
      <CustomCursor color="#38bdf8" />

      {/* FOREGROUND HTML OVERLAYS */}
      {/* 
        We use varying z-indexes here. 
        BackgroundScene is at z-index 50.
        Therefore, to put something UNDER the robot (like Hero Scene), use z-index < 50.
        To put something OVER the robot (like glassmorphic Cards), use z-index > 50.
      */}
      <div style={{ position: 'relative' }}>
        
        {/* 1. Transparent Hero Scene Spacer (Z-index 10, robot flies OVER this!) */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <HeroScene />
        </div>

        {/* FIXED 3D BACKGROUND - Operates as the visual Tour Guide! (Z-index 50) */}
        <BackgroundScene />

        {/* 1.5 Experience & Skills (Z-index 100) */}
        <div style={{ position: 'relative', zIndex: 100 }}>
          <ExperienceSection />
        </div>

        {/* 2. Glassmorphic App Content (Z-index 100, robot flies UNDER this!) */}
        <div style={{ position: 'relative', zIndex: 100 }}>
          <ProjectsSection />
        </div>

        {/* 2.5. Certificates (Z-index 100) */}
        <div style={{ position: 'relative', zIndex: 100 }}>
          <CertificatesSection />
        </div>

        {/* 3. Transparent Contact Section (Z-index 100) */}
        <div style={{ position: 'relative', zIndex: 100 }}>
          <ContactSection />
        </div>
        
      </div>
    </div>
  )
}
