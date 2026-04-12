import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import './HeroScene.css'
import DecryptedText from '../components/DecryptedText'
import StarBorder from '../components/StarBorder'
import { useRobotPush } from '../hooks/useRobotPush'

function PushableChip({ children, duration, color, className }) {
  const { wrapperRef, innerRef } = useRobotPush({ pushRadius: 200, maxForce: 20, scaleCompression: 0.02 })
  return (
    <div ref={wrapperRef} style={{ display: 'inline-block' }}>
      <div ref={innerRef} style={{ display: 'inline-block', height: '100%' }}>
        <StarBorder color={color} className="hero-scene__chip-wrapper" duration={duration}>
          <span className={`hero-scene__chip ${className}`}>{children}</span>
        </StarBorder>
      </div>
    </div>
  )
}

export default function HeroScene() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  })

  // Parallax layers: title moves up faster, subtitle slower, chips slowest
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -120])
  const subtitleY = useTransform(scrollYProgress, [0, 1], [0, -60])
  const chipsY = useTransform(scrollYProgress, [0, 1], [0, -30])
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const starsScale = useTransform(scrollYProgress, [0, 1], [1, 1.3])

  return (
    <section className="hero-scene" id="hero" ref={heroRef}>
      <motion.div className="hero-scene__overlay" style={{ opacity: overlayOpacity }}>

        {/* Starfield background with parallax zoom */}
        <motion.div className="hero-scene__stars" style={{ scale: starsScale }} />

        {/* Neon beam animations */}
        <div className="hero-scene__beam hero-scene__beam--1" />
        <div className="hero-scene__beam hero-scene__beam--2" />

        {/* Content with staggered parallax depths */}
        <div className="hero-scene__content" style={{ position: 'relative', zIndex: 10 }}>
          {/* Eyebrow */}
          <motion.div className="hero-scene__eyebrow" style={{ y: titleY }}>
            <DecryptedText 
              text="✦ PORTFOLIO  · 3D EXPERIENCE" 
              speed={40} 
              maxIterations={12} 
              sequential 
            />
          </motion.div>

          {/* Main heading */}
          <motion.h1 className="hero-scene__title" style={{ y: titleY }}>
            <span className="hero-scene__title-line1">
              <DecryptedText
                text="AANAND AB"
                speed={40}
                maxIterations={15}
                sequential
              />
            </span>
            <br />
            <span className="hero-scene__title-line2">
              <DecryptedText
                text="Software Engineer"
                speed={40}
                maxIterations={15}
                sequential
              />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p className="hero-scene__subtitle" style={{ y: subtitleY }}>
            <DecryptedText 
              text="Scroll to explore my projects scattered across the island." 
              speed={50} 
              maxIterations={10} 
              sequential 
            />
          </motion.p>

          {/* Tech chips */}
          <motion.div className="hero-scene__chips" style={{ y: chipsY }}>
            <PushableChip color="#38bdf8" duration={4} className="hero-scene__chip--cyan">React</PushableChip>
            <PushableChip color="#c084fc" duration={5} className="hero-scene__chip--purple">Three.js</PushableChip>
            <PushableChip color="#f472b6" duration={4.5} className="hero-scene__chip--pink">Salesforce</PushableChip>
            <PushableChip color="#94a3b8" duration={4} className="">Python · AI</PushableChip>
            <PushableChip color="#38bdf8" duration={5.5} className="hero-scene__chip--cyan">Web3</PushableChip>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div 
            className="hero-scene__scroll-cta"
            style={{ y: chipsY }}
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <div className="hero-scene__scroll-line" />
            <span className="hero-scene__scroll-text">SCROLL</span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}