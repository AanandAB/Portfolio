import React from 'react'
import { motion } from 'framer-motion'

/**
 * SectionReveal
 * Wraps a section and reveals it with an immersive 3D tilt-up as it scrolls
 * into view: it rises, un-tilts (rotateX) out of the depth, scales up and
 * fades in — like a panel swinging into place in front of the camera.
 *
 * Uses per-element `transformPerspective` (not the CSS `perspective` property
 * on the parent) so it does NOT create a containing block that would break
 * `position: fixed` descendants. Only use this on sections without fixed
 * overlays (e.g. NOT the Projects section, whose detail modal is fixed).
 */
export default function SectionReveal({ children, zIndex = 100, y = 90, rotateX = 12, delay = 0 }) {
  return (
    <motion.div
      style={{
        position: 'relative',
        zIndex,
        transformPerspective: 1200,
        transformOrigin: '50% 100%',
        willChange: 'transform, opacity',
      }}
      initial={{ opacity: 0, y, rotateX, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ type: 'spring', stiffness: 55, damping: 18, delay }}
    >
      {children}
    </motion.div>
  )
}
