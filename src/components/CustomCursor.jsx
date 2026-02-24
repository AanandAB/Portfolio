import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import './CustomCursor.css'

export default function CustomCursor({ color = '#38bdf8' }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    
    const handleMouseOver = (e) => {
      // Check if hovering over interactive elements
      if (
        e.target.tagName === 'A' ||
        e.target.tagName === 'BUTTON' ||
        e.target.closest('a') !== null ||
        e.target.closest('button') !== null ||
        e.target.closest('.project-card') !== null
      ) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handleMouseOver)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
    }
  }, [])

  return (
    <>
      <motion.div
        className="custom-cursor-dot"
        style={{
          backgroundColor: color,
        }}
        animate={{
          x: mousePosition.x - 4, // Center offset
          y: mousePosition.y - 4,
          scale: isHovering ? 0 : 1, // disappear when hovering to let the ring take over entirely
        }}
        transition={{
          type: 'tween',
          ease: 'backOut',
          duration: 0.1,
        }}
      />
      
      <motion.div
        className="custom-cursor-ring"
        style={{
          border: `1px solid ${color}`,
          boxShadow: `0 0 15px ${color}80, inset 0 0 10px ${color}40`,
        }}
        animate={{
          x: mousePosition.x - 20, // Center offset (40x40 ring)
          y: mousePosition.y - 20,
          scale: isHovering ? 1.5 : 1,
          backgroundColor: isHovering ? `${color}20` : 'transparent',
          borderWidth: isHovering ? '2px' : '1px'
        }}
        transition={{
          type: 'spring',
          stiffness: 150,
          damping: 15,
          mass: 0.5,
        }}
      />
    </>
  )
}
