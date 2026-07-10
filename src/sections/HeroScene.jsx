import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import './HeroScene.css'
import { useRobotPush } from '../hooks/useRobotPush'
import StarBorder from '../components/StarBorder'

const heroLinks = [
  { label: 'React', color: '#38bdf8', href: null },
  { label: 'Three.js', color: '#c084fc', href: null },
  { label: 'Salesforce', color: '#f472b6', href: null },
  { label: 'Flutter', color: '#818cf8', href: null },
  { label: 'AI / Agents', color: '#34d399', href: null },
  { label: 'Web3', color: '#fbbf24', href: null },
]

function HeroLink({ label, color, href, i }) {
  const { wrapperRef, innerRef } = useRobotPush({
    pushRadius: 180, maxForce: 18, scaleCompression: 0.02,
  })
  const El = href ? 'a' : 'span'
  return (
    <motion.div
      ref={wrapperRef}
      initial={{ opacity: 0, y: 30, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 14, delay: 0.45 + i * 0.07 }}
    >
      <StarBorder color={color} duration={5 + i * 0.6} className="hs-chip-outer">
        <El
          ref={innerRef}
          href={href ?? undefined}
          target={href ? '_blank' : undefined}
          rel={href ? 'noopener noreferrer' : undefined}
          className="hs-chip"
          style={{ color }}
        >
          {label}
        </El>
      </StarBorder>
    </motion.div>
  )
}

export default function HeroScene() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef, offset: ['start start', 'end start'],
  })
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const chipsY = useTransform(scrollYProgress, [0, 1], [0, -35])

  return (
    <section className="hs" id="hero" ref={heroRef}>
      <motion.div className="hs-overlay" style={{ opacity: overlayOpacity }}>
        {/* Stars */}
        <div className="hs-stars" />

        {/* Content */}
        <div className="hs-content">

          {/* Glowing badge */}
          <motion.div
            className="hs-badge"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 120, damping: 14 }}
          >
            <span className="hs-badge-dot" />
            <span>✦ PORTFOLIO · 3D EXPERIENCE</span>
          </motion.div>

          {/* Title — staggered lines */}
          <h1 className="hs-title">
            <motion.span
              className="hs-title-line hs-title-l1"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 80, damping: 16, delay: 0.15 }}
            >
              AANAND AB
            </motion.span>
            <motion.span
              className="hs-title-line hs-title-l2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 80, damping: 16, delay: 0.28 }}
            >
              Software Engineer
            </motion.span>
          </h1>

          {/* Subtitle */}
          <motion.p
            className="hs-sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 60, damping: 16, delay: 0.4 }}
          >
            Scroll to explore my projects scattered across the floating island.
          </motion.p>

          {/* Tech chips — bento-style */}
          <motion.div className="hs-links" style={{ y: chipsY }}>
            {heroLinks.map((l, i) => (
              <HeroLink key={l.label} label={l.label} color={l.color} href={l.href} i={i} />
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="hs-scroll"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, -6, 0] }}
            transition={{
              opacity: { delay: 1.2, duration: 0.6 },
              y: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
            }}
          >
            <div className="hs-scroll-line" />
            <span className="hs-scroll-label">SCROLL</span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
