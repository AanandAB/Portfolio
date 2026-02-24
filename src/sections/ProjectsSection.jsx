import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Web, GitHub, RocketLaunch, DesignServices, Memory } from '@mui/icons-material'
import { ISLANDS } from '../data/islands'
import StarBorder from '../components/StarBorder'
import { useRobotPush } from '../hooks/useRobotPush'

/* ─── Shared Variants for Framer Motion ─── */
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 100, damping: 20 },
  },
}

/* ─── Spotlight Card (React Bits style) ─── */
function ProjectCard({ project, index }) {
  const glowRef = useRef(null)
  const { wrapperRef, innerRef } = useRobotPush({ 
    pushRadius: 350, 
    maxForce: 30, 
    scaleCompression: 0.05, 
    glowRef 
  })

  return (
    <motion.div
      ref={wrapperRef}
      variants={itemVariants}
      className={`project-card-wrapper project-card--${project.id}`}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
      style={{ borderRadius: '20px', height: '100%', position: 'relative' }}
    >
      <StarBorder color={project.accentColor}>
        <div ref={innerRef} className="project-card">
          <div 
            ref={glowRef}
            className="project-card__glow" 
            style={{ 
              background: `radial-gradient(circle at var(--glow-x, 50%) var(--glow-y, 0%), ${project.accentColor}40 0%, transparent 60%)`,
              transition: 'opacity 0.2s',
            }}
          />
          
          <div className="project-card__icon-wrap" style={{ color: project.accentColor }}>
            {project.id === 'cafe' && <Web fontSize="large" />}
            {project.id === 'theyyam' && <RocketLaunch fontSize="large" />}
            {project.id === 'knightly' && <GitHub fontSize="large" />}
            {project.id === 'evently' && <DesignServices fontSize="large" />}
            {project.id === 'bytebot' && <RocketLaunch fontSize="large" />}
            {project.id === 'aios' && <Memory fontSize="large" />}
          </div>

          <h3 className="project-card__title" style={{ textShadow: `0 0 10px ${project.accentColor}80` }}>
            {project.name}
          </h3>
          <p className="project-card__headline">{project.headline}</p>

          <div className="project-card__tags">
            {project.tags.map(tag => (
              <span key={tag} className="project-card__tag" style={{ border: `1px solid ${project.accentColor}40` }}>
                {tag}
              </span>
            ))}
          </div>

          <div className="project-card__desc">
            {project.description}
          </div>

          <ul className="project-card__features">
            {project.features.map(f => (
              <li key={f}>
                <span style={{ color: project.accentColor }}>✦</span> {f}
              </li>
            ))}
          </ul>

          {project.github && (
            <motion.a 
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card__link"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ background: `${project.accentColor}20`, borderColor: `${project.accentColor}60`, color: project.accentColor }}
            >
              View Source
            </motion.a>
          )}
        </div>
      </StarBorder>
    </motion.div>
  )
}

/* ─── Projects Section ─── */
export default function ProjectsSection() {
  return (
    <section id="projects" className="projects-section">
      <motion.div 
        className="projects-header"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
      >
        <h2 className="projects-title">
          Selected <span className="text-gradient">Works</span>
        </h2>
        <p className="projects-subtitle">
          A showcase of projects across full-stack, Web3, and AI.
        </p>
      </motion.div>

      <motion.div 
        className="projects-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {ISLANDS.map((project, idx) => (
          <ProjectCard key={project.id} project={project} index={idx} />
        ))}
      </motion.div>

      <style>{`
        .projects-section {
          padding: 120px 24px;
          background: transparent;
          position: relative;
          z-index: 10;
          overflow: hidden;
        }

        .projects-header {
          text-align: center;
          margin-bottom: 80px;
        }

        .projects-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(36px, 5vw, 64px);
          font-weight: 700;
          color: #fff;
          margin-bottom: 16px;
        }

        .text-gradient {
          background: linear-gradient(135deg, #38bdf8, #c084fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .projects-subtitle {
          font-family: 'Inter', sans-serif;
          font-size: 18px;
          color: #94a3b8;
          max-width: 600px;
          margin: 0 auto;
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 32px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .project-card {
          position: relative;
          background: rgba(13, 21, 37, 0.4);
          border-radius: inherit;
          padding: 32px;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
          height: 100%;
          will-change: transform; /* Hint 60fps translation engine */
        }

        .project-card__glow {
          position: absolute;
          inset: 0;
          opacity: 0.5;
          pointer-events: none;
        }

        .project-card__icon-wrap {
          margin-bottom: 24px;
          width: 50px;
          height: 50px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.03);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .project-card__title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }

        .project-card__headline {
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          color: #cbd5e1;
          margin-bottom: 24px;
          line-height: 1.5;
        }

        .project-card__tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 24px;
        }

        .project-card__tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          padding: 4px 10px;
          border-radius: 100px;
          background: rgba(255, 255, 255, 0.03);
          color: #e2e8f0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .project-card__desc {
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          color: #94a3b8;
          line-height: 1.6;
          margin-bottom: 24px;
          flex-grow: 1;
        }

        .project-card__features {
          list-style: none;
          padding: 0;
          margin: 0 0 32px 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .project-card__features li {
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          color: #cbd5e1;
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        .project-card__link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 24px;
          border-radius: 10px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          text-decoration: none;
          font-weight: 600;
          border: 1px solid transparent;
          margin-top: auto;
          align-self: flex-start;
        }
      `}</style>
    </section>
  )
}
