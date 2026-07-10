import React, { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { Web, GitHub, RocketLaunch, DesignServices, Memory, Storefront, SportsEsports, Extension, PointOfSale, Waves, Launch, Close } from '@mui/icons-material'
import { ISLANDS } from '../data/islands'
import { useRobotPush } from '../hooks/useRobotPush'

/* ─── Icon resolver ─── */
const ICON_MAP = {
  cafe: Web,
  theyyam: RocketLaunch,
  knightly: GitHub,
  evently: DesignServices,
  bytebot: RocketLaunch,
  aios: Memory,
  bitnexel: Storefront,
  tictac: SportsEsports,
  sudoku: Extension,
  cafemaster: PointOfSale,
  aquarium: Waves,
}

/* ─── Magnetic Tilt Hook ─── */
function useMagneticTilt(strength = 10) {
  const ref = useRef(null)
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springX = useSpring(rotateX, { stiffness: 200, damping: 20 })
  const springY = useSpring(rotateY, { stiffness: 200, damping: 20 })

  const handleMouse = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    rotateX.set(-y * strength)
    rotateY.set(x * strength)
  }

  const handleLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return { ref, springX, springY, handleMouse, handleLeave }
}

/* ─── Project Card (compact, clickable) ─── */
function ProjectCard({ project, index, onClick }) {
  const glowRef = useRef(null)
  const { wrapperRef, innerRef } = useRobotPush({
    pushRadius: 250,
    maxForce: 20,
    scaleCompression: 0.03,
    glowRef
  })
  const { ref: tiltRef, springX, springY, handleMouse, handleLeave } = useMagneticTilt(8)
  const IconComp = ICON_MAP[project.id] || Web

  const col = index % 3
  const row = Math.floor(index / 3)
  const delay = row * 0.1 + col * 0.05
  const wide = index === 0 || index === 5 // bento: a couple of cards span 2 cols

  return (
    <motion.div
      className={`pw-card-outer${wide ? ' pw-card-outer--wide' : ''}`}
      initial={{ opacity: 0, y: 60, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ type: 'spring', stiffness: 80, damping: 16, delay }}
      layout
      layoutId={`card-${project.id}`}
    >
      <div ref={wrapperRef}>
        <motion.div
          ref={(el) => { innerRef.current = el; tiltRef.current = el }}
          className="pw-card"
          style={{
            rotateX: springX,
            rotateY: springY,
            transformPerspective: 900,
            '--accent': project.accentColor,
          }}
          onMouseMove={handleMouse}
          onMouseLeave={handleLeave}
          onClick={() => onClick(project)}
          whileHover={{ y: -6, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {/* Accent strip */}
          <div className="pw-card__strip" style={{ background: `linear-gradient(90deg, ${project.accentColor}, ${project.accentColor}60)` }} />

          {/* Glow */}
          <div
            ref={glowRef}
            className="pw-card__glow"
            style={{ background: `radial-gradient(circle at var(--glow-x, 50%) var(--glow-y, 0%), ${project.accentColor}25 0%, transparent 55%)` }}
          />

          {/* Shine */}
          <div className="pw-card__shine" />

          {/* Content */}
          <div className="pw-card__body">
            <div className="pw-card__top">
              <span className="pw-card__num" style={{ color: `${project.accentColor}25` }}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <motion.div
                className="pw-card__icon"
                style={{ color: project.accentColor, background: `${project.accentColor}10`, borderColor: `${project.accentColor}25` }}
                whileHover={{ rotate: 15, scale: 1.1 }}
              >
                <IconComp fontSize="small" />
              </motion.div>
            </div>

            <h3 className="pw-card__title">{project.name}</h3>
            <p className="pw-card__headline">{project.headline}</p>

            {/* Tags row */}
            <div className="pw-card__tags">
              {project.tags.slice(0, 3).map(tag => (
                <span key={tag} className="pw-card__tag" style={{ borderColor: `${project.accentColor}25` }}>{tag}</span>
              ))}
              {project.tags.length > 3 && (
                <span className="pw-card__tag pw-card__tag--more">+{project.tags.length - 3}</span>
              )}
            </div>

            {/* Status */}
            {project.status && project.status.length > 0 && (
              <div className="pw-card__statuses">
                {project.status.slice(0, 2).map(s => (
                  <span key={s} className="pw-card__status" style={{ color: project.accentColor, borderColor: `${project.accentColor}40` }}>
                    {s}
                  </span>
                ))}
              </div>
            )}

            {/* CTA */}
            <div className="pw-card__cta">
              <span className="pw-card__cta-text" style={{ color: project.accentColor }}>View Details →</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

/* ─── Detail Modal ─── */
function ProjectDetailModal({ project, onClose }) {
  const IconComp = ICON_MAP[project.id] || Web

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <motion.div
      className="pw-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <motion.div
        className="pw-detail"
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 30 }}
        transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
        style={{ '--accent': project.accentColor }}
      >
        {/* Accent bar */}
        <div className="pw-detail__accent" style={{ background: `linear-gradient(90deg, ${project.accentColor}, ${project.accentColor}40)` }} />

        {/* Close button */}
        <motion.button
          className="pw-detail__close"
          onClick={onClose}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          <Close fontSize="small" />
        </motion.button>

        {/* Glow */}
        <div className="pw-detail__glow" style={{ background: `radial-gradient(ellipse at top right, ${project.accentColor}20 0%, transparent 60%)` }} />

        {/* Header */}
        <div className="pw-detail__header">
          <div className="pw-detail__icon" style={{ color: project.accentColor, background: `${project.accentColor}12`, borderColor: `${project.accentColor}30` }}>
            <IconComp fontSize="large" />
          </div>
          <div>
            <h2 className="pw-detail__title">{project.name}</h2>
            <p className="pw-detail__headline">{project.headline}</p>
          </div>
        </div>

        {/* Status badges */}
        {project.status && project.status.length > 0 && (
          <div className="pw-detail__badges">
            {project.status.map(s => (
              <span key={s} className="pw-detail__badge" style={{ borderColor: `${project.accentColor}50`, color: project.accentColor }}>
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Tags */}
        <div className="pw-detail__tags">
          {project.tags.map((tag, i) => (
            <motion.span
              key={tag}
              className="pw-detail__tag"
              style={{ border: `1px solid ${project.accentColor}30` }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.04 }}
            >
              {tag}
            </motion.span>
          ))}
        </div>

        {/* Description */}
        <motion.p
          className="pw-detail__desc"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {project.description}
        </motion.p>

        {/* Features */}
        <ul className="pw-detail__features">
          {project.features.map((f, i) => (
            <motion.li
              key={f}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.06 }}
            >
              <span className="pw-detail__feature-dot" style={{ background: project.accentColor }} />
              {f}
            </motion.li>
          ))}
        </ul>

        {/* Links */}
        <div className="pw-detail__links">
          {project.github && (
            <motion.a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="pw-detail__link"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              style={{ background: `${project.accentColor}12`, borderColor: `${project.accentColor}40`, color: project.accentColor }}
            >
              <GitHub fontSize="small" /> Source Code
            </motion.a>
          )}
          {project.live && (
            <motion.a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="pw-detail__link pw-detail__link--live"
              whileHover={{ scale: 1.04, y: -2, boxShadow: `0 8px 30px ${project.accentColor}35` }}
              whileTap={{ scale: 0.96 }}
              style={{ background: project.accentColor, color: '#000' }}
            >
              <Launch fontSize="small" /> Live Demo
            </motion.a>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─── Section Header ─── */
function SectionHeader() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center']
  })
  const lineWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const headerOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])
  const headerY = useTransform(scrollYProgress, [0, 0.5], [40, 0])

  return (
    <motion.div ref={ref} className="pw-header" style={{ opacity: headerOpacity, y: headerY }}>
      <motion.div
        className="pw-header__eyebrow"
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className="pw-header__dot" />
        SELECTED WORKS
      </motion.div>
      <h2 className="pw-header__title">
        Selected <span className="pw-text-gradient">Works</span>
      </h2>
      <p className="pw-header__subtitle">
        A showcase of projects across full-stack, Web3, and AI. Click any card to explore.
      </p>
      <motion.div className="pw-header__line" style={{ width: lineWidth }} />
    </motion.div>
  )
}

/* ─── Projects Section ─── */
export default function ProjectsSection() {
  const [selected, setSelected] = useState(null)

  return (
    <section id="projects" className="pw-section">
      <SectionHeader />

      <div className="pw-grid">
        {ISLANDS.map((project, idx) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={idx}
            onClick={setSelected}
          />
        ))}
      </div>

      {/* Detail overlay */}
      <AnimatePresence>
        {selected && (
          <ProjectDetailModal
            key={selected.id}
            project={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>

      <style>{`
        /* ═══════════════════════════════════════
           PROJECTS SECTION — CLEAN GRID + MODAL
           ═══════════════════════════════════════ */

        .pw-section {
          padding: 100px 24px 100px;
          background: transparent;
          position: relative;
          z-index: 10;
          overflow: visible;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* ── Header ── */
        .pw-header {
          text-align: center;
          margin-bottom: 56px;
        }

        .pw-header__eyebrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #38bdf8;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .pw-header__dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #38bdf8;
          animation: pwDotPulse 2s ease-in-out infinite;
        }

        @keyframes pwDotPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }

        .pw-header__title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(36px, 5vw, 60px);
          font-weight: 700;
          color: #fff;
          margin-bottom: 14px;
        }

        .pw-text-gradient {
          background: linear-gradient(135deg, #38bdf8, #c084fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .pw-header__subtitle {
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          color: #94a3b8;
          max-width: 520px;
          margin: 0 auto 20px;
        }

        .pw-header__line {
          height: 2px;
          background: linear-gradient(90deg, transparent, #38bdf8, #c084fc, transparent);
          margin: 0 auto;
          border-radius: 2px;
        }

        /* ── Grid (bento) ── */
        .pw-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-auto-flow: dense;
          gap: 20px;
        }
        .pw-card-outer--wide {
          grid-column: span 2;
        }
        @media (max-width: 900px) {
          .pw-card-outer--wide { grid-column: span 1; }
        }

        /* ── Card ── */
        .pw-card-outer {
          position: relative;
        }

        .pw-card {
          will-change: transform;
          cursor: pointer;
          border-radius: 16px;
          background: rgba(10, 16, 30, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.04);
          overflow: hidden;
          position: relative;
          transition: border-color 0.3s;
        }

        .pw-card:hover {
          border-color: var(--accent, #38bdf8);
        }

        .pw-card__strip {
          height: 3px;
          width: 100%;
        }

        .pw-card__glow {
          position: absolute;
          inset: 0;
          opacity: 0.3;
          pointer-events: none;
          transition: opacity 0.3s;
        }

        .pw-card:hover .pw-card__glow {
          opacity: 0.6;
        }

        .pw-card__shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 55%, transparent 60%);
          transform: translateX(-100%);
          z-index: 3;
          pointer-events: none;
        }

        .pw-card:hover .pw-card__shine {
          animation: pwShine 0.6s ease-out forwards;
        }

        @keyframes pwShine {
          to { transform: translateX(100%); }
        }

        .pw-card__body {
          padding: 20px;
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          min-height: 200px;
        }

        .pw-card__top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .pw-card__num {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 36px;
          font-weight: 800;
          line-height: 1;
          user-select: none;
        }

        .pw-card__icon {
          width: 36px;
          height: 36px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid;
          flex-shrink: 0;
        }

        .pw-card__title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 17px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 5px;
          letter-spacing: -0.01em;
          line-height: 1.3;
        }

        .pw-card__headline {
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          color: #64748b;
          line-height: 1.45;
          margin-bottom: 14px;
          flex-grow: 1;
        }

        .pw-card__tags {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin-bottom: 10px;
        }

        .pw-card__tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          padding: 2px 8px;
          border-radius: 100px;
          background: rgba(255,255,255,0.03);
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          border: 1px solid;
        }

        .pw-card__tag--more {
          border-color: rgba(255,255,255,0.08) !important;
          color: #475569;
        }

        .pw-card__statuses {
          display: flex;
          gap: 5px;
          margin-bottom: 10px;
        }

        .pw-card__status {
          font-family: 'JetBrains Mono', monospace;
          font-size: 8px;
          padding: 2px 8px;
          border-radius: 100px;
          border: 1px solid;
          background: rgba(255,255,255,0.03);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }

        .pw-card__cta {
          margin-top: auto;
          padding-top: 10px;
          border-top: 1px solid rgba(255,255,255,0.04);
        }

        .pw-card__cta-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.05em;
          font-weight: 600;
          opacity: 0.5;
          transition: opacity 0.2s;
        }

        .pw-card:hover .pw-card__cta-text {
          opacity: 1;
        }

        /* ═══════════════════════
           DETAIL MODAL / OVERLAY
           ═══════════════════════ */
        .pw-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(2, 4, 12, 0.75);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          padding: 24px;
        }

        .pw-detail {
          position: relative;
          width: 100%;
          max-width: 620px;
          max-height: 85vh;
          overflow-y: auto;
          background: rgba(10, 16, 30, 0.92);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          box-shadow: 0 30px 100px -20px rgba(0,0,0,0.7);
        }

        .pw-detail::-webkit-scrollbar {
          width: 4px;
        }
        .pw-detail::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
        }

        .pw-detail__accent {
          height: 3px;
          width: 100%;
          border-radius: 20px 20px 0 0;
        }

        .pw-detail__close {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          color: #94a3b8;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: background 0.2s;
        }

        .pw-detail__close:hover {
          background: rgba(255,255,255,0.1);
          color: #fff;
        }

        .pw-detail__glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          border-radius: inherit;
        }

        .pw-detail__header {
          padding: 28px 28px 0;
          display: flex;
          align-items: center;
          gap: 16px;
          position: relative;
          z-index: 2;
        }

        .pw-detail__icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid;
          flex-shrink: 0;
        }

        .pw-detail__title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 4px;
          letter-spacing: -0.02em;
        }

        .pw-detail__headline {
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          color: #94a3b8;
          line-height: 1.4;
          margin: 0;
        }

        .pw-detail__badges {
          padding: 16px 28px 0;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          position: relative;
          z-index: 2;
        }

        .pw-detail__badge {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          padding: 3px 10px;
          border-radius: 100px;
          border: 1px solid;
          background: rgba(255,255,255,0.04);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-weight: 600;
        }

        .pw-detail__tags {
          padding: 16px 28px 0;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          position: relative;
          z-index: 2;
        }

        .pw-detail__tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          padding: 4px 10px;
          border-radius: 100px;
          background: rgba(255,255,255,0.03);
          color: #cbd5e1;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .pw-detail__desc {
          padding: 20px 28px 0;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          color: #94a3b8;
          line-height: 1.7;
          position: relative;
          z-index: 2;
        }

        .pw-detail__features {
          padding: 16px 28px 0;
          list-style: none;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
          position: relative;
          z-index: 2;
        }

        .pw-detail__features li {
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          color: #cbd5e1;
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .pw-detail__feature-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 6px;
        }

        .pw-detail__links {
          padding: 24px 28px 28px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          position: relative;
          z-index: 2;
        }

        .pw-detail__link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 10px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          text-decoration: none;
          font-weight: 700;
          border: 1px solid transparent;
          transition: box-shadow 0.2s;
        }

        .pw-detail__link--live {
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .pw-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .pw-grid {
            grid-template-columns: 1fr;
          }

          .pw-card__body {
            padding: 16px;
            min-height: 170px;
          }

          .pw-detail {
            max-height: 90vh;
          }

          .pw-detail__header {
            padding: 20px 20px 0;
          }

          .pw-detail__desc,
          .pw-detail__features,
          .pw-detail__tags,
          .pw-detail__badges {
            padding-left: 20px;
            padding-right: 20px;
          }

          .pw-detail__links {
            padding: 20px;
          }
        }
      `}</style>
    </section>
  )
}
