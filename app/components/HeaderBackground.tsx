"use client"

import { useEffect, useState } from "react"

export default function HeaderBackground() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; speed: number }>>(
    [],
  )

  useEffect(() => {
    const generateParticle = () => ({
      id: Math.random(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 0.5 + 0.1,
    })

    setParticles(Array.from({ length: 15 }, generateParticle))

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((particle) => ({
          ...particle,
          x: particle.x > 100 ? -5 : particle.x + particle.speed,
        })),
      )
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute bg-purple-500/10 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
        />
      ))}
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/5 via-transparent to-purple-900/5" />
    </div>
  )
}
