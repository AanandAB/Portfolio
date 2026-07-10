import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const BASE = import.meta.env.BASE_URL
const CERTS = [
  { id: 'python', title: 'Python Expert', image: BASE + 'certs/python_cert.png', color: '#fbbf24', issuer: 'Python Institute' },
  { id: 'salesforce', title: 'Salesforce Administrator', image: BASE + 'certs/salesforce_admin.jpeg', color: '#38bdf8', issuer: 'Salesforce' },
  { id: 'cert3', title: 'Platform Developer I', image: BASE + 'certs/cert3.png', color: '#c084fc', issuer: 'Salesforce' },
  { id: 'salesforce-pd2', title: 'Platform Developer II', image: BASE + 'certs/salesforce_pd2.jpg', color: '#6366f1', issuer: 'Salesforce' },
  { id: 'cert4', title: 'Agentforce Specialist', image: BASE + 'certs/cert4.png', color: '#34d399', issuer: 'Salesforce' },
  { id: 'data-cloud', title: 'Data Cloud Consultant', image: BASE + 'certs/data_cloud_cert.png', color: '#10b981', issuer: 'Salesforce' },
]

/* ── 3D tilt + spotlight per card ── */
function CertCard({ cert, index }) {
  const card = useRef(null)
  const glow = useRef(null)
  const img = useRef(null)
  const [rotate, setRotate] = useState({ x: 0, y: 0 })
  const [spot, setSpot] = useState({ x: 50, y: 50 })

  const onMove = useCallback((e) => {
    const r = card.current?.getBoundingClientRect()
    if (!r) return
    const rx = (0.5 - (e.clientY - r.top) / r.height) * 18
    const ry = ((e.clientX - r.left) / r.width - 0.5) * 18
    setRotate({ x: rx, y: ry })
    setSpot({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 })
  }, [])

  const onLeave = useCallback(() => {
    setRotate({ x: 0, y: 0 })
    setSpot({ x: 50, y: 50 })
  }, [])

  return (
    <motion.div
      className="cc-cell"
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ type: 'spring', stiffness: 60, damping: 15, delay: index * 0.08 }}
    >
      <div
        ref={card}
        className="cc-card"
        style={{ '--a': cert.color, '--aa': cert.color + '18' }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        {/* spotlight */}
        <div
          ref={glow}
          className="cc-spot"
          style={{ '--sx': `${spot.x}%`, '--sy': `${spot.y}%`, background: `radial-gradient(circle 200px at var(--sx) var(--sy), var(--aa) 0%, transparent 70%)` }}
        />

        {/* image — optical tilt */}
        <div className="cc-img-shell">
          <img
            ref={img}
            src={cert.image}
            alt={cert.title}
            className="cc-img"
            loading="lazy"
            style={{ transform: `rotateX(${rotate.x * 0.35}deg) rotateY(${rotate.y * 0.35}deg)` }}
          />
        </div>

        {/* info */}
        <div className="cc-info">
          <span className="cc-dot" style={{ background: cert.color }} />
          <div>
            <p className="cc-name">{cert.title}</p>
            <p className="cc-issuer">{cert.issuer}</p>
          </div>
        </div>

        {/* accent bar */}
        <div className="cc-bar" style={{ background: cert.color }} />
      </div>
    </motion.div>
  )
}

/* ── Section ── */
export default function CertificatesSection() {
  const sec = useRef(null)
  const { scrollYProgress } = useScroll({ target: sec, offset: ['start end', 'center center'] })
  const lw = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const ho = useTransform(scrollYProgress, [0, 0.4], [0, 1])

  return (
    <section id="certificates" className="cc" ref={sec}>
      <motion.div className="cc-head" style={{ opacity: ho }}>
        <p className="cc-eyebrow">CREDENTIALS</p>
        <h2 className="cc-h2">
          Certifications &amp; <span className="cc-h2-b">Accreditations</span>
        </h2>
        <p className="cc-lead">Verified expertise across platforms, languages, and enterprise ecosystems.</p>
        <motion.div className="cc-line" style={{ width: lw }} />
      </motion.div>

      <div className="cc-grid">
        {CERTS.map((c, i) => (<CertCard key={c.id} cert={c} index={i} />))}
      </div>

      <style>{`
        .cc { padding: 80px 24px 120px; background: transparent; position: relative; z-index: 10; }
        .cc-head { text-align: center; margin-bottom: 60px; }
        .cc-eyebrow {
          font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #c084fc;
          text-transform: uppercase; letter-spacing: 0.24em; margin-bottom: 14px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .cc-eyebrow::before { content: ''; width: 7px; height: 7px; border-radius: 50%; background: #c084fc; animation: ccPulse 2s ease-in-out infinite; }
        @keyframes ccPulse { 0%, 100% { opacity: .4; transform: scale(1); } 50% { opacity: 1; transform: scale(1.5); } }
        .cc-h2 { font-family: 'Space Grotesk', sans-serif; font-size: clamp(30px, 5vw, 50px); font-weight: 700; color: #fff; margin-bottom: 10px; }
        .cc-h2-b { background: linear-gradient(90deg, #c084fc, #38bdf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .cc-lead { font-size: 15px; color: #94a3b8; max-width: 500px; margin: 0 auto; }
        .cc-line { height: 2px; background: linear-gradient(90deg, transparent, #c084fc, #38bdf8, transparent); margin: 24px auto 0; border-radius: 2px; }

        /* grid */
        .cc-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; max-width: 1100px; margin: 0 auto; }
        @media (max-width: 900px) { .cc-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .cc-grid { grid-template-columns: 1fr; } }

        /* card */
        .cc-cell { border-radius: 20px; }
        .cc-card {
          position: relative; border-radius: 20px; overflow: hidden;
          background: rgba(6, 13, 28, 0.5);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.05);
          transition: transform 0.2s ease, border-color 0.25s, box-shadow 0.25s;
          will-change: transform;
        }
        .cc-card:hover {
          border-color: var(--a);
          box-shadow: 0 28px 60px -16px var(--aa);
        }

        /* spotlight layer */
        .cc-spot { position: absolute; inset: 0; z-index: 1; pointer-events: none; opacity: 0.22; }

        /* image */
        .cc-img-shell { padding: 22px 22px 0; background: rgba(0,0,0,0.22); position: relative; z-index: 2; }
        .cc-img {
          display: block; width: 100%; max-height: 190px; object-fit: contain;
          border-radius: 10px; box-shadow: 0 8px 28px rgba(0,0,0,0.5);
          transition: transform 0.12s ease;
        }

        /* info */
        .cc-info {
          padding: 14px 20px; display: flex; align-items: center; gap: 10px;
          border-top: 1px solid rgba(255,255,255,0.04); position: relative; z-index: 2;
        }
        .cc-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
        .cc-name { font-family: 'Space Grotesk', sans-serif; font-size: 13px; font-weight: 600; color: #e2e8f0; margin: 0; }
        .cc-issuer { font-size: 11px; color: #94a3b8; margin: 2px 0 0; }

        /* accent bar */
        .cc-bar { height: 3px; opacity: 0; transition: opacity 0.25s; }
        .cc-card:hover .cc-bar { opacity: 1; }
      `}</style>
    </section>
  )
}
