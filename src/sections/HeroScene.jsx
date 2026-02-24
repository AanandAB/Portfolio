import React from 'react'
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
  return (
    <section className="hero-scene" id="hero">
      <div className="hero-scene__overlay">

        {/* Starfield background - ensure z-index is low in CSS */}
        <div className="hero-scene__stars" />

        {/* Neon beam animations */}
        <div className="hero-scene__beam hero-scene__beam--1" />
        <div className="hero-scene__beam hero-scene__beam--2" />

        {/* Added explicit zIndex and position to ensure visibility */}
        <div className="hero-scene__content" style={{ position: 'relative', zIndex: 10 }}>
          {/* Eyebrow */}
          <div className="hero-scene__eyebrow">
            <DecryptedText 
              text="✦ PORTFOLIO  · 3D EXPERIENCE" 
              speed={40} 
              maxIterations={12} 
              sequential 
            />
          </div>

          {/* Main heading */}
          <h1 className="hero-scene__title">
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
          </h1>

          {/* Subtitle */}
          <p className="hero-scene__subtitle">
            <DecryptedText 
              text="Scroll to explore my projects scattered across the island." 
              speed={50} 
              maxIterations={10} 
              sequential 
            />
          </p>

          {/* Tech chips */}
          <div className="hero-scene__chips">
            <PushableChip color="#38bdf8" duration={4} className="hero-scene__chip--cyan">React</PushableChip>
            <PushableChip color="#c084fc" duration={5} className="hero-scene__chip--purple">Three.js</PushableChip>
            <PushableChip color="#f472b6" duration={4.5} className="hero-scene__chip--pink">Salesforce</PushableChip>
            <PushableChip color="#94a3b8" duration={4} className="">Python · AI</PushableChip>
            <PushableChip color="#38bdf8" duration={5.5} className="hero-scene__chip--cyan">Web3</PushableChip>
          </div>
        </div>
      </div>
    </section>
  )
}