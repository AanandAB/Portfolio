import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useRobotPush } from '../hooks/useRobotPush'
import StarBorder from '../components/StarBorder'

// Skills data mapped from user request
const SKILLS = [
  { id: 'lwc', name: 'Custom LWC', color: '#38bdf8' },
  { id: 'apex', name: 'Apex Classes', color: '#c084fc' },
  { id: 'soql', name: 'SOQL & SOSL', color: '#34d399' },
  { id: 'flow', name: 'Declarative Automation (Flow)', color: '#fbbf24' },
  { id: 'security', name: 'Security Model', color: '#f87171' },
  { id: 'object', name: 'Object Modeling', color: '#818cf8' },
  { id: 'data', name: 'Data Management', color: '#a78bfa' },
  { id: 'agentforce', name: 'Agentforce', color: '#2dd4bf' },
]

/* ─── Animated Counter ─── */
function AnimatedCounter({ value, suffix = '' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const end = parseInt(value)
    if (start === end) return
    const duration = 1500
    const increment = end / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.ceil(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, value])

  return <span ref={ref}>{count}{suffix}</span>
}

function SkillBadge({ skill, index }) {
  const glowRef = useRef(null)
  const { wrapperRef, innerRef } = useRobotPush({ 
    pushRadius: 150, 
    maxForce: 15, 
    scaleCompression: 0.05,
    glowRef 
  })

  return (
    <motion.div
      ref={wrapperRef}
      className="skill-badge-wrap"
      initial={{ opacity: 0, scale: 0.7, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ 
        type: 'spring', 
        stiffness: 120, 
        damping: 14, 
        delay: index * 0.06 
      }}
      whileHover={{ 
        y: -6, 
        scale: 1.08,
        transition: { type: 'spring', stiffness: 300, damping: 12 }
      }}
      style={{ '--accent': skill.color }}
    >
      <div ref={innerRef} className="skill-badge">
        <div ref={glowRef} className="skill-badge__glow" />
        <motion.span 
          className="skill-badge__dot" 
          style={{ background: skill.color }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 2, delay: index * 0.2 }}
        />
        <span className="skill-badge__text">{skill.name}</span>
      </div>
    </motion.div>
  )
}

export default function ExperienceSection() {
  const [duration, setDuration] = useState('')
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center']
  })
  const lineWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const headerOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 1])
  const headerY = useTransform(scrollYProgress, [0, 0.4], [30, 0])

  useEffect(() => {
    const calcDuration = () => {
      const startDate = new Date('2024-07-01')
      const now = new Date()
      let months = (now.getFullYear() - startDate.getFullYear()) * 12
      months -= startDate.getMonth()
      months += now.getMonth()

      if (now.getDate() < startDate.getDate()) {
        months--
      }

      const yrs = Math.floor(months / 12)
      const mths = months % 12

      let result = ''
      if (yrs > 0) result += `${yrs} Yr${yrs > 1 ? 's' : ''} `
      if (mths > 0 || yrs === 0) result += `${mths} Mo${mths > 1 ? 's' : ''}`
      
      setDuration(result.trim())
    }

    calcDuration()
    const intval = setInterval(calcDuration, 1000 * 60 * 60 * 24)
    return () => clearInterval(intval)
  }, [])

  return (
    <section id="experience" className="exp-section" ref={sectionRef}>
      <div className="exp-container">
        
        {/* Header */}
        <motion.div 
          className="exp-header"
          style={{ opacity: headerOpacity, y: headerY }}
        >
          <motion.div
            className="exp-header__eyebrow"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="exp-header__dot" />
            CAREER
          </motion.div>
          <h2 className="exp-title">
            Professional <span className="text-gradient">Experience</span>
          </h2>
          <p className="exp-subtitle">
            Forging enterprise solutions and pushing boundaries.
          </p>
          <motion.div className="exp-header__line" style={{ width: lineWidth }} />
        </motion.div>

        {/* Vibe Coding Philosophy (Banner) */}
        <motion.div 
          className="vibe-banner"
          initial={{ opacity: 0, x: -40, rotateY: -5 }}
          whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ type: 'spring', stiffness: 70, damping: 16 }}
          whileHover={{ 
            scale: 1.01,
            borderColor: 'rgba(192, 132, 252, 0.35)',
            transition: { duration: 0.2 }
          }}
        >
          <motion.div 
            className="vibe-icon-wrap"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          >
            <span className="vibe-icon">⚡</span>
          </motion.div>
          <div className="vibe-content">
            <h3 className="vibe-banner__title">Vibe Coding Philosophy</h3>
            <p className="vibe-banner__text">
              I architect my complex projects like <span className="highlight">AIOS</span> and 
              <span className="highlight"> Bytebot</span> using advanced <strong>'Vibe Coding'</strong> workflows 
              — directing AI agents to generate robust logic through high-level orchestration.
            </p>
          </div>
        </motion.div>

        {/* Experience Card */}
        <motion.div 
          className="exp-card-outer"
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ type: 'spring', stiffness: 60, damping: 16 }}
        >
          <StarBorder color="#38bdf8" duration={6}>
            <div className="exp-card">
              <div className="exp-card__glow-bg" />
              <div className="exp-card__content">
                <div className="exp-role-header">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="exp-role">Software Engineer</h3>
                    <h4 className="exp-company">Spectra Solution</h4>
                  </motion.div>
                  <motion.div 
                    className="exp-date-badge"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ 
                      scale: 1.03,
                      borderColor: 'rgba(56, 189, 248, 0.2)',
                      transition: { duration: 0.15 }
                    }}
                  >
                    <span className="exp-date">Jul 2024 — Present</span>
                    <span className="exp-duration">{duration}</span>
                  </motion.div>
                </div>

                <div className="exp-skills-section">
                  <motion.h5 
                    className="exp-skills-title"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.35 }}
                  >
                    Salesforce Expertise
                  </motion.h5>
                  <div className="exp-skills-grid">
                    {SKILLS.map((skill, i) => (
                      <SkillBadge key={skill.id} skill={skill} index={i} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </StarBorder>
        </motion.div>

      </div>

      <style>{`
        .exp-section {
          padding: 80px 24px;
          background: transparent;
          position: relative;
          z-index: 10;
        }

        .exp-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .exp-header {
          text-align: center;
          margin-bottom: 64px;
        }

        .exp-header__eyebrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #34d399;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .exp-header__dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #34d399;
          animation: expDotPulse 2s ease-in-out infinite;
        }

        @keyframes expDotPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }

        .exp-header__line {
          height: 2px;
          background: linear-gradient(90deg, transparent, #34d399, #38bdf8, transparent);
          margin: 24px auto 0;
          border-radius: 2px;
        }

        .exp-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(32px, 5vw, 56px);
          font-weight: 700;
          color: #fff;
          margin-bottom: 16px;
        }

        .exp-subtitle {
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          color: #94a3b8;
          max-width: 600px;
          margin: 0 auto;
        }

        .text-gradient {
          background: linear-gradient(90deg, #38bdf8, #c084fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Vibe Banner */
        .vibe-banner {
          display: flex;
          align-items: center;
          gap: 24px;
          background: rgba(192, 132, 252, 0.08);
          border: 1px solid rgba(192, 132, 252, 0.15);
          border-left: 4px solid #c084fc;
          padding: 24px;
          border-radius: 12px;
          margin-bottom: 40px;
          backdrop-filter: none;
          cursor: default;
          transition: border-color 0.3s;
        }

        .vibe-icon-wrap {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(192, 132, 252, 0.1);
          border-radius: 50%;
          flex-shrink: 0;
        }

        .vibe-icon {
          font-size: 24px;
        }

        .vibe-banner__title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 4px 0;
        }

        .vibe-banner__text {
          margin: 0;
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          color: #cbd5e1;
          line-height: 1.5;
        }

        .vibe-banner .highlight {
          color: #c084fc;
          font-weight: 600;
        }

        /* Card Outer */
        .exp-card-outer {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 80px -20px rgba(56, 189, 248, 0.15);
        }

        .exp-card {
          border-radius: inherit;
          background: rgba(2, 6, 23, 0.15); /* Significantly more transparent */
          border: 1px solid rgba(56, 189, 248, 0.1);
          overflow: hidden;
          position: relative;
          padding: 40px;
        }

        .exp-card__glow-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at top right, rgba(56, 189, 248, 0.1), transparent 70%);
          pointer-events: none;
        }

        .exp-card__content {
          position: relative;
          z-index: 2;
        }

        .exp-role-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 40px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding-bottom: 30px;
        }

        .exp-role {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 8px 0;
        }

        .exp-company {
          font-family: 'Inter', sans-serif;
          font-size: 18px;
          color: #38bdf8;
          font-weight: 500;
          margin: 0;
        }

        .exp-date-badge {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          background: rgba(255,255,255,0.03);
          padding: 12px 20px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.05);
          transition: border-color 0.2s;
          cursor: default;
        }

        .exp-date {
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
          color: #e2e8f0;
          margin-bottom: 4px;
        }

        .exp-duration {
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          color: #34d399;
          font-weight: 600;
          text-transform: uppercase;
        }

        @media (max-width: 600px) {
          .exp-role-header { flex-direction: column; }
          .exp-date-badge { align-items: flex-start; width: 100%; }
          .vibe-banner { flex-direction: column; align-items: flex-start; }
        }

        .exp-skills-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 18px;
          color: #fff;
          margin: 0 0 20px 0;
          font-weight: 600;
        }

        .exp-skills-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .skill-badge-wrap {
          border-radius: 8px;
          background: linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%);
          padding: 1px;
          position: relative;
          cursor: default;
        }

        .skill-badge {
          background: rgba(10, 15, 25, 0.4);
          padding: 10px 18px;
          border-radius: 8px;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .skill-badge__glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at var(--glow-x, 50%) var(--glow-y, 0%), var(--accent), transparent 60%);
          opacity: 0.12;
          pointer-events: none;
        }

        .skill-badge__dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .skill-badge__text {
          position: relative;
          z-index: 1;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          color: #e2e8f0;
        }
      `}</style>
    </section>
  )
}
