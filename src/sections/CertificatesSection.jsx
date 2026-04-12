import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRobotPush } from '../hooks/useRobotPush'

const CERTIFICATES = [
  { id: 'python', title: 'Python Expert', image: import.meta.env.BASE_URL + 'certs/python_cert.png', color: '#fbbf24' },
  { id: 'salesforce', title: 'Salesforce Administrator', image: import.meta.env.BASE_URL + 'certs/salesforce_admin.jpeg', color: '#38bdf8' },
  { id: 'cert3', title: 'Platform Developer I', image: import.meta.env.BASE_URL + 'certs/cert3.png', color: '#c084fc' },
  { id: 'cert4', title: 'Agentforce Specialist', image: import.meta.env.BASE_URL + 'certs/cert4.png', color: '#34d399' },
  { id: 'data-cloud', title: 'Data Cloud Consultant', image: import.meta.env.BASE_URL + 'certs/data_cloud_cert.png', color: '#10b981' },
]

function CertificateCard({ cert, index, total }) {
  const glowRef = useRef(null)
  const cardRef = useRef(null)
  const { wrapperRef, innerRef } = useRobotPush({ 
    pushRadius: 300, 
    maxForce: 20, 
    scaleCompression: 0.03,
    glowRef 
  })

  // Alternate direction: even from left, odd from right
  const fromLeft = index % 2 === 0

  return (
    <motion.div
      ref={wrapperRef}
      className="cert-card-wrap"
      initial={{ 
        opacity: 0, 
        y: 50, 
        x: fromLeft ? -40 : 40, 
        scale: 0.9,
        rotateY: fromLeft ? -8 : 8
      }}
      whileInView={{ 
        opacity: 1, 
        y: 0, 
        x: 0, 
        scale: 1,
        rotateY: 0
      }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ 
        type: 'spring', 
        stiffness: 80, 
        damping: 16, 
        delay: index * 0.1 
      }}
      style={{ '--accent': cert.color, perspective: '800px' }}
    >
      <motion.div 
        ref={innerRef} 
        className="cert-card"
        whileHover={{ 
          y: -12, 
          scale: 1.03,
          boxShadow: `0 20px 60px -15px ${cert.color}50`,
          transition: { type: 'spring', stiffness: 200, damping: 15 }
        }}
      >
        <div 
          ref={glowRef}
          className="cert-card__glow" 
          style={{
            background: `radial-gradient(circle at var(--glow-x, 50%) var(--glow-y, 0%), var(--accent), transparent 50%)`
          }}
        />

        {/* Shine sweep on hover */}
        <div className="cert-card__shine" />

        <div className="cert-card__image-wrap">
          <motion.img 
            src={cert.image} 
            alt={cert.title} 
            className="cert-card__image" 
            loading="lazy"
            whileHover={{ scale: 1.08, rotate: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          />
        </div>

        <motion.div 
          className="cert-card__label"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + index * 0.1 }}
        >
          <span className="cert-card__label-dot" style={{ background: cert.color }} />
          {cert.title}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default function CertificatesSection() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center']
  })
  const lineWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const headerOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 1])
  const headerY = useTransform(scrollYProgress, [0, 0.4], [30, 0])

  return (
    <section id="certificates" className="certs-section" ref={sectionRef}>
      <motion.div 
        className="certs-header"
        style={{ opacity: headerOpacity, y: headerY }}
      >
        <motion.div
          className="certs-header__eyebrow"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="certs-header__dot" />
          CREDENTIALS
        </motion.div>
        <h2 className="certs-title">
          Professional <span className="text-gradient">Certifications</span>
        </h2>
        <p className="certs-subtitle">
          Validated expertise across various domains and technologies.
        </p>
        <motion.div className="certs-header__line" style={{ width: lineWidth }} />
      </motion.div>

      <div className="certs-grid">
        {CERTIFICATES.map((cert, i) => (
          <CertificateCard key={cert.id} cert={cert} index={i} total={CERTIFICATES.length} />
        ))}
      </div>

      <style>{`
        .certs-section {
          padding: 80px 24px 120px;
          background: transparent;
          position: relative;
          z-index: 10;
        }

        .certs-header {
          text-align: center;
          margin-bottom: 64px;
        }

        .certs-header__eyebrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #c084fc;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .certs-header__dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #c084fc;
          animation: certDotPulse 2s ease-in-out infinite;
        }

        @keyframes certDotPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }

        .certs-header__line {
          height: 2px;
          background: linear-gradient(90deg, transparent, #c084fc, #38bdf8, transparent);
          margin: 24px auto 0;
          border-radius: 2px;
        }

        .certs-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(32px, 5vw, 56px);
          font-weight: 700;
          color: #fff;
          margin-bottom: 16px;
        }

        .certs-subtitle {
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          color: #94a3b8;
          max-width: 600px;
          margin: 0 auto;
        }

        .certs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 28px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .cert-card-wrap {
          border-radius: 16px;
          position: relative;
        }

        .cert-card {
          border-radius: 16px;
          background: rgba(10, 15, 25, 0.5);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          overflow: hidden;
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: border-color 0.3s ease;
          cursor: default;
        }

        .cert-card:hover {
          border-color: var(--accent);
        }

        .cert-card__glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at top, var(--accent), transparent 50%);
          opacity: 0.15;
          mix-blend-mode: screen;
          pointer-events: none;
          transition: opacity 0.3s;
        }

        .cert-card:hover .cert-card__glow {
          opacity: 0.3;
        }

        /* Sweeping shine effect */
        .cert-card__shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            105deg,
            transparent 40%,
            rgba(255, 255, 255, 0.03) 45%,
            rgba(255, 255, 255, 0.07) 50%,
            rgba(255, 255, 255, 0.03) 55%,
            transparent 60%
          );
          transform: translateX(-100%);
          z-index: 3;
          pointer-events: none;
          transition: none;
        }

        .cert-card:hover .cert-card__shine {
          animation: certShine 0.7s ease-out forwards;
        }

        @keyframes certShine {
          to { transform: translateX(100%); }
        }

        .cert-card__image-wrap {
          flex-grow: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(0,0,0,0.15);
        }

        .cert-card__image {
          max-width: 100%;
          max-height: 220px;
          object-fit: contain;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.4);
        }

        .cert-card__label {
          padding: 14px 20px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #e2e8f0;
          display: flex;
          align-items: center;
          gap: 8px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .cert-card__label-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        @media (max-width: 600px) {
          .certs-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  )
}
