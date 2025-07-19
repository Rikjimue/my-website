"use client"

import Link from "next/link"
import { Terminal, ArrowLeft, Calendar, Clock } from "lucide-react"
import { useEffect, useState, useRef } from "react"

// Synchronized decoding text animation component (copied from app/page.tsx)
function DecodingText({ children: text, className = "" }: { children: string; className?: string }) {
  const [displayChars, setDisplayChars] = useState<string[]>(Array(text.length).fill(""))
  const animationFrameId = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const charResolveTimes = useRef<number[]>([]) // Stores the time each char should resolve
  const currentScrambledChars = useRef<string[]>(Array(text.length).fill("")) // Store current scrambled chars

  const ANIMATION_DURATION_MS = 2000 // Total duration for the animation (2.0 seconds)
  const SCRAMBLE_FRAME_SKIP = 3 // Update random characters every N frames (e.g., every 3 frames)

  const getRandomChar = () => {
    const commonChars = "!@#$%^&*()_+-=[]{}|;:,.<>?ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    return commonChars[Math.floor(Math.random() * commonChars.length)]
  }

  useEffect(() => {
    // Initialize random resolve times for each character
    charResolveTimes.current = text.split("").map(() => Math.random() * ANIMATION_DURATION_MS)
    // Initialize current scrambled characters
    currentScrambledChars.current = Array(text.length)
      .fill("")
      .map(() => getRandomChar())

    startTimeRef.current = performance.now()
    let frameCount = 0 // To track frames for scramble update frequency

    const animate = () => {
      const elapsed = performance.now() - (startTimeRef.current || 0)

      if (elapsed >= ANIMATION_DURATION_MS) {
        // Animation finished
        setDisplayChars(text.split("")) // Ensure final text is set
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current)
        }
        return
      }

      frameCount++

      setDisplayChars(() => {
        const newChars = Array(text.length).fill("")
        for (let i = 0; i < text.length; i++) {
          if (elapsed >= charResolveTimes.current[i]) {
            newChars[i] = text[i] // Character resolved
          } else {
            // Only update random char every SCRAMBLE_FRAME_SKIP frames
            if (frameCount % SCRAMBLE_FRAME_SKIP === 0) {
              currentScrambledChars.current[i] = getRandomChar()
            }
            newChars[i] = currentScrambledChars.current[i] // Use the stored scrambled char
          }
        }
        return newChars
      })

      animationFrameId.current = requestAnimationFrame(animate)
    }

    animationFrameId.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [text]) // Rerun if text changes

  return (
    <span className={className}>
      {displayChars.map((char, index) => (
        <span key={index} style={{ display: "inline-block", width: "0.6em", textAlign: "center" }}>
          {char}
        </span>
      ))}
    </span>
  )
}

const blogPosts = [
  {
    id: 1,
    title: "Advanced SQL Injection in Modern Applications",
    date: "2024-01-15",
    readTime: "8 min read",
    excerpt:
      "Deep dive into bypassing modern WAFs and exploiting blind SQL injection vulnerabilities in contemporary web applications, including advanced techniques and bypass methods.",
    tags: ["sql-injection", "web-security", "penetration-testing"],
  },
  {
    id: 2,
    title: "Building VulnHunter: A Python Security Scanner",
    date: "2024-01-08",
    readTime: "12 min read",
    excerpt:
      "Complete guide to building an automated vulnerability scanner using Python with async capabilities and custom payload generation for modern security testing.",
    tags: ["python", "automation", "security-tools"],
  },
  {
    id: 3,
    title: "2023 Security Landscape: A Year in Review",
    date: "2024-01-01",
    readTime: "6 min read",
    excerpt:
      "Analysis of major security incidents, emerging threats, and defensive innovations that shaped the cybersecurity landscape throughout 2023.",
    tags: ["retrospective", "trends", "analysis"],
  },
  {
    id: 4,
    title: "Advanced XSS Techniques and Prevention",
    date: "2023-12-20",
    readTime: "10 min read",
    excerpt:
      "Exploring sophisticated cross-site scripting attack vectors, including DOM-based XSS, CSP bypasses, and effective mitigation strategies for modern applications.",
    tags: ["xss", "web-security", "prevention"],
  },
  {
    id: 5,
    title: "Reverse Engineering Mobile Applications",
    date: "2023-12-10",
    readTime: "15 min read",
    excerpt:
      "A practical guide to reverse engineering Android and iOS applications, including static and dynamic analysis techniques for security researchers.",
    tags: ["mobile-security", "reverse-engineering", "android", "ios"],
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Header */}
      <header className="border-b border-purple-500/30 p-4 backdrop-blur-sm bg-black/80">
        <nav className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-6 h-6 text-purple-400" />
            <span className="text-xl font-bold">
              <DecodingText>rikjimue@sec:~/blog$</DecodingText>
            </span>
          </div>
          <Link href="/" className="flex items-center gap-2 hover:text-purple-400 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <DecodingText>back to home</DecodingText>
          </Link>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        {/* Page Header */}
        <section className="py-8">
          <div className="space-y-4">
            <div className="text-sm text-purple-300">
              <span className="text-white">╭─</span> ls -la blog/
            </div>
            <h1 className="text-3xl font-bold text-white">Security Research Blog</h1>
            <p className="text-gray-300 border-l-2 border-purple-600 pl-4">
              ▸ Thoughts, research, and tutorials on cybersecurity and ethical hacking
            </p>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="space-y-6">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="border border-purple-500/30 p-6 hover:bg-purple-950/20 transition-colors backdrop-blur-sm bg-black/50"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-sm text-purple-300">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </div>
                </div>

                <h2 className="text-xl font-bold text-white hover:text-purple-300 cursor-pointer transition-colors">
                  <Link href={`/blog/${post.id}`}>
                    {post.title}
                  </Link>
                  
                </h2>

                <p className="text-gray-300">▸ {post.excerpt}</p>

                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-1 border border-purple-600/50 text-purple-300">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Pagination */}
        <section className="py-8 text-center">
          <div className="space-y-2">
            <p className="text-purple-300">▸ Showing 5 of 23 posts</p>
            <div className="flex justify-center gap-4">
              <button className="text-gray-300 hover:text-white transition-colors">{"<"} previous</button>
              <span className="text-white">1 / 5</span>
              <button className="text-gray-300 hover:text-white transition-colors">next {">"}</button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-500/30 p-4 mt-12 backdrop-blur-sm bg-black/80">
        <div className="max-w-4xl mx-auto text-center text-purple-300">
          <p>◈ © 2024 Alex Thompson. All rights reserved.</p>
          <p className="text-sm mt-2">▸ Built with Next.js and hacker aesthetics</p>
        </div>
      </footer>
    </div>
  )
}
