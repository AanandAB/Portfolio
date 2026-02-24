import React from 'react'
import { motion } from 'framer-motion'
import './StarBorder.css'

export default function StarBorder({
  children,
  className = '',
  color = '#ffffff',
  duration = 4,
}) {
  return (
    <div className={`star-border-container ${className}`}>
      {/* rotating conic gradient layer */}
      <motion.div
        className="star-border-glow"
        style={{
          background: `conic-gradient(from 0deg, transparent 0%, transparent 80%, ${color} 100%)`,
        }}
        animate={{ rotate: [0, 360] }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: duration,
        }}
      />
      {/* second glow spinning offset to form a trail */}
      <motion.div
        className="star-border-glow"
        style={{
          background: `conic-gradient(from 180deg, transparent 0%, transparent 80%, ${color} 100%)`,
        }}
        animate={{ rotate: [180, 540] }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: duration,
        }}
      />
      
      {/* the actual content mask layered above it */}
      <div className="star-border-content">
        {children}
      </div>
    </div>
  )
}
