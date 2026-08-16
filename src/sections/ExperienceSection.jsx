import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import StarBorder from '../components/StarBorder'

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
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(Math.ceil(start))
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, value])
  return <span ref={ref} className="exp-stat-val">{count}{suffix}</span>
}

/* ─── Skill Bar ─── */
function SkillBar({ label, pct, color, i }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  return (
    <motion.div
      ref={ref}
      className="exp-sbar"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 60, damping: 15, delay: 0.3 + i * 0.07 }}
    >
      <div className="exp-sbar__head">
        <span className="exp-sbar__dot" style={{ background: color }} />
        <span className="exp-sbar__label">{label}</span>
        <span className="exp-sbar__pct">{pct}%</span>
      </div>
      <div className="exp-sbar__track">
        <motion.div
          className="exp-sbar__fill"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${pct}%` } : { width: 0 }}
          transition={{ duration: 0.9, delay: 0.55 + i * 0.07, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  )
}

const SKILLS = [
  { label: 'Custom LWC', pct: 92, color: '#38bdf8' },
  { label: 'Apex Classes', pct: 88, color: '#c084fc' },
  { label: 'SOQL & SOSL', pct: 90, color: '#34d399' },
  { label: 'Declarative Flow', pct: 85, color: '#fbbf24' },
  { label: 'Security Model', pct: 82, color: '#f87171' },
  { label: 'Object Modeling', pct: 87, color: '#818cf8' },
  { label: 'Agentforce', pct: 78, color: '#2dd4bf' },
  { label: 'Data Management', pct: 86, color: '#a78bfa' },
]

export default function ExperienceSection() {
  const [duration, setDuration] = useState('')
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'center center'] })
  const lineWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const headerOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 1])

  useEffect(() => {
    const calc = () => {
      const s = new Date('2024-07-01'), n = new Date()
      let m = (n.getFullYear() - s.getFullYear()) * 12 - s.getMonth() + n.getMonth()
      if (n.getDate() < s.getDate()) m--
      const y = Math.floor(m / 12), mo = m % 12
      setDuration([y > 0 ? `${y} Yr${y > 1 ? 's' : ''}` : '', mo > 0 || y === 0 ? `${mo} Mo${mo > 1 ? 's' : ''}` : ''].filter(Boolean).join(' '))
    }
    calc()
    const iv = setInterval(calc, 86400000)
    return () => clearInterval(iv)
  }, [])

  return (
    <section id="experience" className="exp" ref={sectionRef}>
      <div className="exp-container">

        {/* Header */}
        <motion.div className="exp-header" style={{ opacity: headerOpacity }}>
          <div className="exp-header__eyebrow"><span className="exp-header__dot" />CAREER</div>
          <h2 className="exp-title">Professional <span className="exp-grad">Experience</span></h2>
          <p className="exp-sub">Forging enterprise solutions and pushing boundaries.</p>
          <motion.div className="exp-header__line" style={{ width: lineWidth }} />
        </motion.div>

        {/* Vibe banner — horizontal card */}
        <motion.div
          className="exp-vibe"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 70, damping: 16 }}
        >
          <span className="exp-vibe-emoji">⚡</span>
          <div>
            <h3 className="exp-vibe-title">Vibe Coding Philosophy</h3>
            <p className="exp-vibe-text">
              I architect complex projects like <strong className="exp-hl">AIOS</strong> and <strong className="exp-hl">Bytebot</strong> using advanced <strong>'Vibe Coding'</strong> — directing AI agents to generate robust logic through high-level orchestration.
            </p>
          </div>
        </motion.div>

        {/* Timeline entry */}
        <motion.div
          className="exp-entry"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 55, damping: 16 }}
        >
          <StarBorder color="#38bdf8" duration={8}>
            <div className="exp-card">
              <div className="exp-card-glow" />
              <div className="exp-card-inner">
                <div className="exp-role-row">
                  <div>
                    <h3 className="exp-role">Software Engineer</h3>
                    <h4 className="exp-company">Spectra Solution</h4>
                  </div>
                  <div className="exp-date-badge">
                    <span className="exp-date">Jul 2024 — Present</span>
                    <span className="exp-years">{duration}</span>
                  </div>
                </div>

                {/* Stats row */}
                <div className="exp-stats">
                  <div className="exp-stat"><AnimatedCounter value="2" suffix="+" /><span className="exp-stat-label">Years</span></div>
                  <div className="exp-stat"><AnimatedCounter value="12" suffix="+" /><span className="exp-stat-label">Projects</span></div>
                  <div className="exp-stat"><AnimatedCounter value="8" suffix="" /><span className="exp-stat-label">Tech Stacks</span></div>
                </div>
              </div>
            </div>
          </StarBorder>
        </motion.div>

        {/* Skills grid — horizontal bars */}
        <div className="exp-skills">
          <h4 className="exp-skills-title">Salesforce Expertise</h4>
          <div className="exp-skills-grid">
            {SKILLS.map((s, i) => (<SkillBar key={s.label} label={s.label} pct={s.pct} color={s.color} i={i} />))}
          </div>
        </div>
      </div>

      <style>{`
        .exp { padding: 80px 24px; background: transparent; position: relative; z-index: 10; }
        .exp-container { max-width: 900px; margin: 0 auto; }
        .exp-header { text-align: center; margin-bottom: 52px; }
        .exp-header__eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #34d399; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 14px; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .exp-header__dot { width: 6px; height: 6px; border-radius: 50%; background: #34d399; animation: expDot 2s ease-in-out infinite; }
        @keyframes expDot { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.3); } }
        .exp-header__line { height: 2px; background: linear-gradient(90deg, transparent, #34d399, #38bdf8, transparent); margin: 24px auto 0; border-radius: 2px; }
        .exp-title { font-family: 'Space Grotesk', sans-serif; font-size: clamp(32px, 5vw, 52px); font-weight: 700; color: #fff; margin-bottom: 12px; }
        .exp-grad { background: linear-gradient(90deg, #38bdf8, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .exp-sub { color: #94a3b8; font-size: 15px; }
        .exp-hl { color: #c084fc; }

        /* vibe banner */
        .exp-vibe { display: flex; gap: 20px; background: rgba(192,132,252,0.08); border: 1px solid rgba(192,132,252,0.15); border-left: 4px solid #c084fc; padding: 20px 24px; border-radius: 14px; margin-bottom: 44px; }
        .exp-vibe-emoji { font-size: 28px; flex-shrink: 0; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; background: rgba(192,132,252,0.1); border-radius: 50%; }
        .exp-vibe-title { font-family: 'Space Grotesk', sans-serif; font-size: 17px; font-weight: 700; color: #fff; margin: 0 0 4px; }
        .exp-vibe-text { margin: 0; font-size: 14px; color: #cbd5e1; line-height: 1.6; }

        /* timeline entry */
        .exp-entry { border-radius: 20px; overflow: hidden; box-shadow: 0 20px 70px -20px rgba(56,189,248,0.12); margin-bottom: 44px; }
        .exp-card { border-radius: inherit; background: rgba(2,6,23,0.15); border: 1px solid rgba(56,189,248,0.1); overflow: hidden; position: relative; padding: 36px 40px; }
        .exp-card-glow { position: absolute; inset: 0; background: radial-gradient(circle at top right, rgba(56,189,248,0.1), transparent 70%); pointer-events: none; }
        .exp-card-inner { position: relative; z-index: 2; }
        .exp-role-row { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 24px; margin-bottom: 24px; }
        .exp-role { font-family: 'Space Grotesk', sans-serif; font-size: 26px; font-weight: 700; color: #fff; margin: 0 0 6px; }
        .exp-company { font-size: 16px; color: #38bdf8; font-weight: 500; margin: 0; }
        .exp-date-badge { display: flex; flex-direction: column; align-items: flex-end; background: rgba(255,255,255,0.03); padding: 10px 18px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.05); }
        .exp-date { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #e2e8f0; margin-bottom: 2px; }
        .exp-years { font-size: 13px; color: #34d399; font-weight: 600; text-transform: uppercase; }

        /* stats */
        .exp-stats { display: flex; gap: 32px; justify-content: center; }
        .exp-stat { text-align: center; }
        .exp-stat-val { font-family: 'Space Grotesk', sans-serif; font-size: 32px; font-weight: 700; color: #fff; display: block; }
        .exp-stat-label { display: block; font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 2px; }

        /* skills */
        .exp-skills { margin-top: 8px; }
        .exp-skills-title { font-family: 'Space Grotesk', sans-serif; font-size: 17px; color: #fff; font-weight: 600; margin-bottom: 20px; }
        .exp-skills-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px 32px; }
        .exp-sbar { }
        .exp-sbar__head { display: flex; align-items: center; gap: 8px; margin-bottom: 5px; }
        .exp-sbar__dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .exp-sbar__label { font-size: 13px; color: #cbd5e1; }
        .exp-sbar__pct { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #94a3b8; margin-left: auto; }
        .exp-sbar__track { height: 5px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden; }
        .exp-sbar__fill { height: 100%; border-radius: 3px; }

        @media (max-width: 640px) {
          .exp-card { padding: 24px 20px; }
          .exp-role-row { flex-direction: column; }
          .exp-date-badge { align-items: flex-start; width: 100%; }
          .exp-vibe { flex-direction: column; }
          .exp-skills-grid { grid-template-columns: 1fr; }
          .exp-stats { gap: 20px; }
        }
      `}</style>
    </section>
  )
}
