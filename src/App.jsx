import React, { useEffect, useRef, lazy, Suspense } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'
import { usePortfolioStore } from './store/portfolioStore'

// Eagerly load hero (above-fold critical path)
import HeroScene from './sections/HeroScene'
import CustomCursor from './components/CustomCursor'
import SectionReveal from './components/SectionReveal'
import ErrorBoundary from './components/ErrorBoundary'
import { useRobotPush } from './hooks/useRobotPush'

// Lazy load heavy below-fold components
const BackgroundScene = lazy(() => import('./components/BackgroundScene'))
const ExperienceSection = lazy(() => import('./sections/ExperienceSection'))
const ProjectsSection = lazy(() => import('./sections/ProjectsSection'))
const CertificatesSection = lazy(() => import('./sections/CertificatesSection'))

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
    <section id="contact" className="contact">
      <div className="contact-glow-bg" />

      <div className="contact-eyebrow">
        <span className="contact-eyebrow-dot" />
        SIGNAL TRANSMITTED
      </div>

      <h2 className="contact-head">
        All areas explored.
        <br />
        <span className="contact-head-grad">Let's build something together.</span>
      </h2>

      {/* CTA buttons */}
      <div className="contact-links">
        <a href="https://github.com/AanandAB" target="_blank" rel="noopener noreferrer" className="contact-link contact-link--gh">
          GitHub →
        </a>
        <a href="https://linkedin.com/in/aanandab" target="_blank" rel="noopener noreferrer" className="contact-link contact-link--li">
          LinkedIn →
        </a>
        <a href="mailto:aanandab@outlook.com" className="contact-link contact-link--email">
          Email ✉
        </a>
      </div>

      {/* Attribution */}
      <p className="contact-attribution">
        Built with React · Framer Motion · Three.js
        <br />
        <span className="contact-attribution-muted">
          3D Models: "Floating Island" by Yosapat Panutyotin · "Asteroids" by Poly by Google — CC-BY-4.0
        </span>
      </p>

      <style>{`
        .contact {
          min-height: 100vh; display: flex; flex-direction: column;
          align-items: center; justify-content: center; text-align: center;
          padding: 80px 24px; border-top: 1px solid rgba(255,255,255,0.05);
          position: relative; z-index: 10;
        }
        .contact-glow-bg {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background: radial-gradient(ellipse at 50% 70%, rgba(56,189,248,0.06) 0%, transparent 60%),
                      radial-gradient(ellipse at 40% 30%, rgba(192,132,252,0.05) 0%, transparent 50%);
        }
        .contact-eyebrow {
          font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #34d399;
          letter-spacing: 0.16em; margin-bottom: 18px; text-transform: uppercase;
          display: flex; align-items: center; gap: 8px; position: relative; z-index: 1;
        }
        .contact-eyebrow-dot {
          width: 8px; height: 8px; border-radius: 50%; background: #34d399;
          animation: contactDotPulse 1.5s ease-in-out infinite;
        }
        @keyframes contactDotPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }
        .contact-head {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(28px, 4.5vw, 50px); font-weight: 700;
          color: #fff; line-height: 1.15; max-width: 640px;
          margin-bottom: 40px; position: relative; z-index: 1;
        }
        .contact-head-grad {
          background: linear-gradient(90deg, #38bdf8, #c084fc);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .contact-links {
          display: flex; gap: 14px; flex-wrap: wrap; justify-content: center;
          margin-bottom: 52px; position: relative; z-index: 1;
        }
        .contact-link {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 26px; border-radius: 12px;
          font-family: 'JetBrains Mono', monospace; font-size: 13px;
          text-decoration: none; transition: all 0.2s;
        }
        .contact-link--gh {
          border: 1px solid rgba(255,255,255,0.1); color: #e2e8f0;
          background: rgba(5,10,20,0.4); backdrop-filter: blur(10px);
        }
        .contact-link--li {
          border: 1px solid rgba(56,189,248,0.3); color: #38bdf8;
          background: rgba(56,189,248,0.08); backdrop-filter: blur(10px);
        }
        .contact-link--email {
          border: none; background: linear-gradient(135deg, #38bdf8, #c084fc);
          color: #fff; font-weight: 600; box-shadow: 0 0 24px rgba(56,189,248,0.25);
        }
        .contact-link:hover { transform: translateY(-2px); }
        .contact-link--email:hover { box-shadow: 0 0 36px rgba(56,189,248,0.4); }

        .contact-attribution {
          font-family: 'JetBrains Mono', monospace; font-size: 11px;
          color: #94a3b8; max-width: 500px; position: relative; z-index: 1;
        }
        .contact-attribution-muted { color: #475569; font-size: 10px; }
      `}</style>
    </section>
  )
}

/* ─── Track Full Page Scroll and Drive Zustand State ─── */
function ScrollTracker() {
  const setScrollProgress = usePortfolioStore((s) => s.setScrollProgress)

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate(self) {
        setScrollProgress(self.progress)
      },
    })

    // Sections below the hero are lazy-loaded, so they grow the page height
    // AFTER this trigger is created — leaving its scrub `end` stale and making
    // scrollProgress saturate early (the island fly-through freezes past the
    // career section). Re-measure whenever the document actually changes size.
    let rafId = 0
    const refresh = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => ScrollTrigger.refresh())
    }
    const ro = new ResizeObserver(refresh)
    ro.observe(document.body)
    window.addEventListener('load', refresh)
    const timers = [400, 1200, 3000].map((ms) => setTimeout(refresh, ms))

    return () => {
      trigger.kill()
      ro.disconnect()
      window.removeEventListener('load', refresh)
      cancelAnimationFrame(rafId)
      timers.forEach(clearTimeout)
    }
  }, [setScrollProgress])

  return null
}

/* ─── Minimal loading fallback ─── */
function SectionFallback() {
  return (
    <div style={{ minHeight: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        width: '32px', height: '32px',
        border: '2px solid rgba(56,189,248,0.15)',
        borderTopColor: '#38bdf8',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
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

      <div style={{ position: 'relative' }}>
        
        {/* 1. Hero Scene (eager — above fold) */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <HeroScene />
        </div>

        {/* FIXED 3D BACKGROUND - lazy loaded */}
        <Suspense fallback={null}>
          <BackgroundScene />
        </Suspense>

        {/* 1.5 Experience & Skills */}
        <SectionReveal>
          <ErrorBoundary name="Experience">
            <Suspense fallback={<SectionFallback />}>
              <ExperienceSection />
            </Suspense>
          </ErrorBoundary>
        </SectionReveal>

        {/* 2. Projects (keeps its own staggered card reveal — NOT wrapped, its
            detail modal is position:fixed and must stay viewport-relative) */}
        <div style={{ position: 'relative', zIndex: 100 }}>
          <ErrorBoundary name="Projects">
            <Suspense fallback={<SectionFallback />}>
              <ProjectsSection />
            </Suspense>
          </ErrorBoundary>
        </div>

        {/* 2.5. Certificates — NOT wrapped in SectionReveal (it has its own
            per-card fly-in reveal; the extra 3D wrapper caused a render crash) */}
        <div style={{ position: 'relative', zIndex: 100 }}>
          <ErrorBoundary name="Certificates">
            <Suspense fallback={<SectionFallback />}>
              <CertificatesSection />
            </Suspense>
          </ErrorBoundary>
        </div>

        {/* 3. Contact Section (lightweight, stays eager) */}
        <SectionReveal>
          <ErrorBoundary name="Contact">
            <ContactSection />
          </ErrorBoundary>
        </SectionReveal>
        
      </div>
    </div>
  )
}
