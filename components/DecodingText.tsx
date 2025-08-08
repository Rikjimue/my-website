// Fixed DecodingText component that maintains the cool animations while fixing layout shift and accessibility
"use client"

import { useEffect, useState, useRef, useCallback } from "react"

interface DecodingTextProps {
  children: string
  className?: string
  delay?: number
  onComplete?: () => void
}

function DecodingText({ 
  children: text, 
  className = "", 
  delay = 0, 
  onComplete 
}: DecodingTextProps) {
  const [displayWords, setDisplayWords] = useState<Array<{ word: string; chars: string[]; resolved: boolean }>>([])
  const [isGlitching, setIsGlitching] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const animationFrameId = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const wordResolveTimes = useRef<number[]>([])
  const containerRef = useRef<HTMLSpanElement>(null)

  const ANIMATION_DURATION_MS = 1500
  const GLITCH_CHANCE = 0.02

  const getRandomChar = useCallback(() => {
    const hackChars = "!@#$%^&*()_+-=[]{}|;:,.<>?~`"
    const alphaNum = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    const specialChars = "█▓▒░▄▀■□▪▫"
    const allChars = hackChars + alphaNum + specialChars
    return allChars[Math.floor(Math.random() * allChars.length)]
  }, [])

  useEffect(() => {
    const words = text.split(/(\s+)/)
    const initialWords = words.map(word => ({
      word,
      chars: word.split('').map(() => getRandomChar()),
      resolved: false
    }))
    
    setDisplayWords(initialWords)

    const timer = setTimeout(() => {
      setIsVisible(true)
      
      wordResolveTimes.current = words.map((_, i) => {
        const baseTime = (i / words.length) * ANIMATION_DURATION_MS * 0.8
        const randomVariation = Math.random() * ANIMATION_DURATION_MS * 0.4
        return baseTime + randomVariation
      })

      startTimeRef.current = performance.now()
      let frameCount = 0

      const animate = () => {
        const elapsed = performance.now() - (startTimeRef.current || 0)

        if (elapsed >= ANIMATION_DURATION_MS) {
          setDisplayWords(words.map(word => ({
            word,
            chars: word.split(''),
            resolved: true
          })))
          setIsGlitching(false)
          setIsComplete(true)
          if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current)
          }
          // Clean up will-change for performance
          if (containerRef.current) {
            containerRef.current.style.willChange = 'auto'
          }
          setTimeout(() => {
            onComplete?.()
          }, 100)
          return
        }

        frameCount++

        if (Math.random() < GLITCH_CHANCE) {
          setIsGlitching(true)
          setTimeout(() => setIsGlitching(false), 100)
        }

        setDisplayWords(prevWords => 
          prevWords.map((wordObj, wordIndex) => {
            if (elapsed >= wordResolveTimes.current[wordIndex]) {
              // Word is resolved - show final characters
              return {
                ...wordObj,
                chars: wordObj.word.split(''),
                resolved: true
              }
            } else {
              // Word is still scrambling - update every few frames for performance
              if (frameCount % 2 === 0) {
                return {
                  ...wordObj,
                  chars: wordObj.word.split('').map(char => 
                    char === ' ' ? ' ' : getRandomChar()
                  ),
                  resolved: false
                }
              }
              return wordObj
            }
          })
        )

        animationFrameId.current = requestAnimationFrame(animate)
      }

      // Set will-change for animation optimization
      if (containerRef.current) {
        containerRef.current.style.willChange = 'transform, opacity'
      }

      animationFrameId.current = requestAnimationFrame(animate)
    }, delay)

    return () => {
      clearTimeout(timer)
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [text, delay, onComplete, getRandomChar])

  return (
    <>
      {/* ACCESSIBILITY: Provide screen reader content immediately */}
      <span className="sr-only" aria-live="polite">
        {text}
      </span>
      
      {/* Visual animation - hidden from screen readers during animation */}
      <span 
        ref={containerRef}
        className={`${className} ${isGlitching ? 'animate-pulse text-red-400' : ''} transition-all duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ 
          // CRITICAL: Allow text to wrap naturally in containers
          wordBreak: 'break-word', 
          overflowWrap: 'anywhere',
          lineHeight: '1.5',
          minHeight: '1.2em', // Reserve minimum vertical space
          width: '100%', // Take full width of container
          maxWidth: '100%', // Don't exceed container
          display: 'block', // Allow proper text flow and wrapping
          fontFamily: 'inherit', // Use the same font as parent
        }}
        // Hide from screen readers during animation, show when complete
        aria-hidden={!isComplete}
      >
        {displayWords.map((wordObj, wordIndex) => (
          <span 
            key={wordIndex}
            className="inline"
            style={{
              textShadow: isGlitching && !wordObj.resolved ? '2px 0 #ff0000, -2px 0 #00ffff' : 'none',
            }}
          >
            {wordObj.chars.join('')}
          </span>
        ))}
      </span>
    </>
  )
}

export default DecodingText