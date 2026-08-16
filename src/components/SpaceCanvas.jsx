import React, { useRef, useEffect } from 'react'
import { usePortfolioStore } from '../store/portfolioStore'
import { createSpaceEngine } from '../space/SpaceEngine'

export default function SpaceCanvas() {
  const canvasRef = useRef(null)
  const engineRef = useRef(null)
  const rafRef = useRef(null)
  const setScrollDepth = usePortfolioStore((s) => s.setScrollDepth)
  const setActivePlanet = usePortfolioStore((s) => s.setActivePlanet)

  useEffect(() => {
    const engine = createSpaceEngine(canvasRef.current)
    engineRef.current = engine

    const onResize = () => engine.resize()
    const onScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset
      const maxScroll = document.body.scrollHeight - window.innerHeight
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0
      engine.setDepth(progress)
      setScrollDepth(progress)
    }

    const loop = (ts) => {
      engine.render(ts)
      // Update active planet ~10 times/sec to avoid spamming React
      setActivePlanet(engine.getActivePlanetId())
      rafRef.current = requestAnimationFrame(loop)
    }

    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
    }
  }, [setScrollDepth, setActivePlanet])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background: '#020408',
      }}
    />
  )
}
