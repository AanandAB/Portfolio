import React, { useEffect, useState } from 'react'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+{}:"<>?[];,./~'

export default function DecryptedText({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = false,
  className = '',
  as: Component = 'span',
}) {
  const [displayText, setDisplayText] = useState('')
  const [isHovering, setIsHovering] = useState(false)
  const [iterations, setIterations] = useState(0)

  // Start with scrambled text on mount
  useEffect(() => {
    let interval;
    if (iterations < maxIterations) {
      interval = setInterval(() => {
        setDisplayText((prev) =>
          text
            .split('')
            .map((char, index) => {
              // If sequential, reveal from left to right
              if (sequential) {
                if (index < (iterations / maxIterations) * text.length) return text[index]
              } else {
                // Otherwise random reveal
                if (Math.random() < iterations / maxIterations) return text[index]
              }
              // Skip spaces
              if (char === ' ') return ' '
              // Return random char
              return ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
            })
            .join('')
        )
        setIterations((prev) => prev + 1)
      }, speed)
    } else {
      setDisplayText(text)
    }

    return () => clearInterval(interval)
  }, [iterations, maxIterations, speed, text, sequential])

  const handleMouseEnter = () => {
    setIsHovering(true)
    setIterations(0) // Restart animation on hover
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
  }

  return (
    <Component
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {displayText || text}
    </Component>
  )
}
