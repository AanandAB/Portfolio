import React from 'react'
import { usePortfolioStore } from '../store/portfolioStore'

const PLANETS = [
  { id:'cafe',        name:'CafePOSPro',       depthPos:0.06,  color:'#38bdf8' },
  { id:'theyyam',     name:'Theyyam App',       depthPos:0.13,  color:'#fbbf24' },
  { id:'knightly',    name:'Knightly Chess',    depthPos:0.20,  color:'#c084fc' },
  { id:'evently',     name:'Evently Connect',   depthPos:0.27,  color:'#f472b6' },
  { id:'bytebot',     name:'Bytebot AI Lab',    depthPos:0.34,  color:'#34d399' },
  { id:'aios',        name:'AIOS v2.0',         depthPos:0.41,  color:'#ef4444' },
  { id:'bitnexel',    name:'Bitnexel',          depthPos:0.48,  color:'#06b6d4' },
  { id:'tictac',      name:'Tactis',            depthPos:0.55,  color:'#84cc16' },
  { id:'sudoku',      name:'Sudoku 300',        depthPos:0.62,  color:'#818cf8' },
  { id:'cafemaster',  name:'Cafe Flutter',      depthPos:0.69,  color:'#f59e0b' },
  { id:'aquarium',    name:'Happy Aquarium',    depthPos:0.78,  color:'#14b8a6' },
]

export default function SpaceNav() {
  const activePlanet = usePortfolioStore((s) => s.activePlanet)

  const scrollTo = (depthPos) => {
    const maxScroll = document.body.scrollHeight - window.innerHeight
    window.scrollTo({ top: depthPos * maxScroll, behavior: 'smooth' })
  }

  return (
    <nav style={{
      position: 'fixed',
      right: 'clamp(12px, 2.4vw, 28px)',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 40,
      display: 'flex',
      flexDirection: 'column',
      gap: '18px',
      padding: '16px 8px',
    }}>
      {PLANETS.map((p) => {
        const isActive = activePlanet === p.id
        return (
          <button
            key={p.id}
            onClick={() => scrollTo(p.depthPos)}
            title={p.name}
            aria-label={`Navigate to ${p.name}`}
            style={{
              position: 'relative',
              width: '14px', height: '14px',
              border: 'none', background: 'transparent',
              cursor: 'pointer',
              display: 'grid', placeItems: 'center',
              padding: 0,
            }}
          >
            {/* Dot */}
            <span style={{
              width: isActive ? '10px' : '7px',
              height: isActive ? '10px' : '7px',
              borderRadius: '50%',
              background: isActive ? p.color : `rgba(255,255,255,0.2)`,
              boxShadow: isActive ? `0 0 10px ${p.color}80` : 'none',
              transition: 'all 0.3s ease',
            }} />
            {/* Label on hover */}
            <span style={{
              position: 'absolute',
              right: '22px',
              top: '50%',
              transform: 'translateY(-50%)',
              whiteSpace: 'nowrap',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px',
              color: isActive ? p.color : '#64748b',
              opacity: isActive ? 1 : 0,
              transition: 'opacity 0.2s',
              pointerEvents: 'none',
            }}>
              {p.name}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
