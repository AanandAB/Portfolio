import React, { useRef, useEffect, useState } from 'react'
import { usePortfolioStore } from '../store/portfolioStore'

const CLIPS = [
  { file: 'vid/01-cafe.mp4',       color: '#38bdf8' },
  { file: 'vid/02-theyyam.mp4',    color: '#fbbf24' },
  { file: 'vid/03-knightly.mp4',   color: '#c084fc' },
  { file: 'vid/04-evently.mp4',    color: '#f472b6' },
  { file: 'vid/05-bytebot.mp4',    color: '#34d399' },
  { file: 'vid/06-aios.mp4',       color: '#ef4444' },
  { file: 'vid/07-tactis.mp4',     color: '#84cc16' },
  { file: 'vid/08-sudoku.mp4',     color: '#818cf8' },
  { file: 'vid/09-cafemaster.mp4', color: '#f59e0b' },
  { file: 'vid/10-aquarium.mp4',   color: '#14b8a6' },
]

export default function VideoScrubBackground() {
  const videoRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const [currentClip, setCurrentClip] = useState(0)
  const scrollDepth = usePortfolioStore((s) => s.scrollDepth)
  const setActiveProjectIdx = usePortfolioStore((s) => s.setActiveProjectIdx)

  // Load first clip on mount
  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return

    fetch(CLIPS[0].file)
      .then(r => r.blob())
      .then(blob => {
        vid.src = URL.createObjectURL(blob)
        vid.addEventListener('loadedmetadata', () => {
          setLoaded(true)
          vid.play().then(() => vid.pause()).catch(() => {})
        })
      })
      .catch(() => { vid.src = CLIPS[0].file })
  }, [])

  // Switch clip based on scroll position
  useEffect(() => {
    if (!loaded) return
    const idx = Math.min(CLIPS.length - 1, Math.floor(scrollDepth * CLIPS.length))
    if (idx !== currentClip) {
      setCurrentClip(idx)
      const vid = videoRef.current
      fetch(CLIPS[idx].file)
        .then(r => r.blob())
        .then(blob => {
          vid.src = URL.createObjectURL(blob)
          vid.play().then(() => vid.pause()).catch(() => {})
        })
        .catch(() => { vid.src = CLIPS[idx].file })
    }
    if (setActiveProjectIdx) setActiveProjectIdx(idx)
  }, [scrollDepth, loaded, currentClip, setActiveProjectIdx])

  // Scrub current clip
  useEffect(() => {
    if (!loaded) return
    const vid = videoRef.current
    const localProgress = (scrollDepth * CLIPS.length) % 1
    if (vid.duration && !vid.seeking) {
      vid.currentTime = localProgress * vid.duration
    }
  }, [scrollDepth, loaded])

  return (
    <>
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        style={{
          position: 'fixed', inset: 0, zIndex: 0,
          width: '100%', height: '100%', objectFit: 'cover',
          pointerEvents: 'none',
        }}
      />
      {/* Vignette */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(2,4,16,0.6) 100%)',
      }} />
      {/* Film grain */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 998, pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`,
        backgroundSize: '256px 256px',
      }} />
    </>
  )
}
