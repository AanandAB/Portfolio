import { useEffect, useRef } from 'react'

/**
 * Hook to apply a gentle 60fps repelling push when the floating robot nears an element.
 * @param {Object} options Options to tune push force and radius
 */
export function useRobotPush({ pushRadius = 350, maxForce = 30, scaleCompression = 0.05, glowRef = null } = {}) {
  const innerRef = useRef(null)
  const wrapperRef = useRef(null)

  useEffect(() => {
    let animId
    let currentX = 0
    let currentY = 0
    let currentScale = 1

    const loop = () => {
      animId = requestAnimationFrame(loop)
      if (!wrapperRef.current || !innerRef.current) return

      const rx = parseFloat(document.body.style.getPropertyValue('--robot-x')) || -1000
      const ry = parseFloat(document.body.style.getPropertyValue('--robot-y')) || -1000
      const rz = parseFloat(document.body.style.getPropertyValue('--robot-z')) || 1

      let targetX = 0
      let targetY = 0
      let targetScale = 1

      if (rz > -1 && rz < 1) {
        const rect = wrapperRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        const dx = centerX - rx
        const dy = centerY - ry
        const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy))

        if (dist < pushRadius) {
          const force = Math.pow((pushRadius - dist) / pushRadius, 2)
          targetX = (dx / dist) * force * maxForce
          targetY = (dy / dist) * force * maxForce
          targetScale = 1 - (force * scaleCompression)
        }
      }

      currentX += ((targetX || 0) - currentX) * 0.1
      currentY += ((targetY || 0) - currentY) * 0.1
      currentScale += ((targetScale || 1) - currentScale) * 0.1

      if (!isNaN(currentX) && !isNaN(currentY) && !isNaN(currentScale)) {
        innerRef.current.style.transform = `translate(${currentX}px, ${currentY}px) scale(${currentScale})`
      }

      if (glowRef && glowRef.current && !isNaN(rx) && !isNaN(ry)) {
        const rectLeft = wrapperRef.current.getBoundingClientRect().left
        const rectTop = wrapperRef.current.getBoundingClientRect().top
        glowRef.current.style.setProperty('--glow-x', `${rx - rectLeft}px`)
        glowRef.current.style.setProperty('--glow-y', `${ry - rectTop}px`)
      }
    }

    loop()
    return () => cancelAnimationFrame(animId)
  }, [pushRadius, maxForce, scaleCompression, glowRef])

  return { innerRef, wrapperRef }
}
