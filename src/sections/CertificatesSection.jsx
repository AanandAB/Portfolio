import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { useRobotPush } from '../hooks/useRobotPush'

const CERTIFICATES = [
  { id: 'python', title: 'Python Expert', image: import.meta.env.BASE_URL + 'certs/python_cert.png', color: '#fbbf24' },
  { id: 'salesforce', title: 'Salesforce Administrator', image: import.meta.env.BASE_URL + 'certs/salesforce_admin.jpeg', color: '#38bdf8' },
  { id: 'cert3', title: 'Professional Certification', image: import.meta.env.BASE_URL + 'certs/cert3.png', color: '#c084fc' },
  { id: 'cert4', title: 'Professional Certification', image: import.meta.env.BASE_URL + 'certs/cert4.png', color: '#34d399' },
]

function CertificateCard({ cert }) {
  const glowRef = useRef(null)
  const { wrapperRef, innerRef } = useRobotPush({ 
    pushRadius: 300, 
    maxForce: 20, 
    scaleCompression: 0.03,
    glowRef 
  })

  return (
    <motion.div
      ref={wrapperRef}
      className="cert-card-wrap"
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      style={{ '--accent': cert.color }}
    >
      <div ref={innerRef} className="cert-card">
        <div 
          ref={glowRef}
          className="cert-card__glow" 
          style={{
            background: `radial-gradient(circle at var(--glow-x, 50%) var(--glow-y, 0%), var(--accent), transparent 50%)`
          }}
        />
        <div className="cert-card__image-wrap">
          <img src={cert.image} alt={cert.title} className="cert-card__image" loading="lazy" />
        </div>
      </div>
    </motion.div>
  )
}

export default function CertificatesSection() {
  return (
    <section id="certificates" className="certs-section">
      <motion.div 
        className="certs-header"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
      >
        <h2 className="certs-title">
          Professional <span className="text-gradient">Certifications</span>
        </h2>
        <p className="certs-subtitle">
          Validated expertise across various domains and technologies.
        </p>
      </motion.div>

      <div className="certs-grid">
        {CERTIFICATES.map((cert) => (
          <CertificateCard key={cert.id} cert={cert} />
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
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 32px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .cert-card-wrap {
          border-radius: 16px;
          background: linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%);
          padding: 1px;
          position: relative;
          box-shadow: 0 10px 40px -10px var(--accent);
        }

        .cert-card {
          border-radius: 16px;
          background: rgba(10, 15, 25, 0.6);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          overflow: hidden;
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .cert-card__glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at top, var(--accent), transparent 50%);
          opacity: 0.15;
          mix-blend-mode: screen;
          pointer-events: none;
        }

        .cert-card__image-wrap {
          flex-grow: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          background: rgba(0,0,0,0.2);
        }

        .cert-card__image {
          max-width: 100%;
          max-height: 250px;
          object-fit: contain;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.4);
          transition: transform 0.3s ease;
        }

        .cert-card:hover .cert-card__image {
          transform: scale(1.05);
        }
      `}</style>
    </section>
  )
}
