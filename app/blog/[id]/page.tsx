"use client"

import Link from "next/link"
import { Terminal, ArrowLeft, Calendar, Clock, Tag } from "lucide-react"
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

// This would typically come from a database or CMS
const getBlogPost = (id: string) => {
  const posts = {
    "1": {
      title: "Advanced SQL Injection in Modern Applications",
      date: "2024-01-15",
      readTime: "8 min read",
      tags: ["sql-injection", "web-security", "penetration-testing"],
      content: `
▸ Introduction

SQL injection remains one of the most critical vulnerabilities in web applications, despite being well-documented for over two decades. In this post, we'll explore advanced SQL injection techniques that are still effective against modern applications.

▸ Understanding the Basics

Before diving into advanced techniques, let's review the fundamentals:

1. SQL injection occurs when user input is improperly sanitized
2. Attackers can manipulate SQL queries to access unauthorized data
3. Modern frameworks provide protection, but misconfigurations are common

▸ Advanced Techniques

◆ Blind SQL Injection

When applications don't return database errors, we can use blind techniques:

\`\`\`sql
' AND (SELECT SUBSTRING(username,1,1) FROM users WHERE id=1)='a'--
\`\`\`

◆ Time-Based Attacks

Using database-specific functions to create delays:

\`\`\`sql
'; WAITFOR DELAY '00:00:05'--
\`\`\`

▸ Prevention Strategies

1. Use parameterized queries
2. Implement proper input validation
3. Apply the principle of least privilege
4. Regular security testing

▸ Conclusion

While SQL injection is an old vulnerability, it continues to plague modern applications. Understanding these techniques helps both attackers and defenders stay ahead of the curve.
      `,
    },
    "2": {
      title: "Building VulnHunter: A Python Security Scanner",
      date: "2024-01-08",
      readTime: "12 min read",
      tags: ["python", "automation", "security-tools"],
      content: `
▸ Introduction

Building your own vulnerability scanner is an excellent way to understand security testing at a deeper level. In this guide, we'll create VulnHunter, a Python-based scanner with async capabilities.

▸ Project Setup

First, let's set up our project structure:

\`\`\`python
import asyncio
import aiohttp
from bs4 import BeautifulSoup
import re
\`\`\`

▸ Core Scanner Architecture

Our scanner will use an async architecture for better performance:

\`\`\`python
class VulnHunter:
    def __init__(self, target_url):
        self.target = target_url
        self.session = None
        
    async def scan(self):
        async with aiohttp.ClientSession() as session:
            self.session = session
            await self.run_tests()
\`\`\`

▸ Implementing Detection Modules

We'll create modular detection systems for different vulnerability types.

▸ Conclusion

Building security tools helps you understand both offensive and defensive security better.
      `,
    },
  }

  return posts[id as keyof typeof posts] || null
}

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const post = getBlogPost(params.id)

  if (!post) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-white">
            <DecodingText>404 - Post Not Found</DecodingText>
          </h1>
          <p className="text-gray-300">
            ▸ <DecodingText>The requested blog post could not be found.</DecodingText>
          </p>
          <Link href="/blog" className="text-purple-300 hover:text-white transition-colors">
            ▸ <DecodingText>back to blog</DecodingText>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Header */}
      <header className="border-b border-purple-500/30 p-4 backdrop-blur-sm bg-black/80">
        <nav className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-6 h-6 text-purple-400" />
            <span className="text-xl font-bold">
              <DecodingText>{`alex@sec:~/blog/${params.id}$`}</DecodingText>
            </span>
          </div>
          <Link href="/blog" className="flex items-center gap-2 hover:text-purple-400 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <DecodingText>back to blog</DecodingText>
          </Link>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        {/* Article Header */}
        <article className="py-8">
          <header className="space-y-4 mb-8">
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

            <h1 className="text-3xl font-bold text-white leading-tight">{post.title}</h1>

            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 text-xs px-2 py-1 border border-purple-600/50 text-purple-300"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-invert max-w-none">
            <div className="space-y-6 text-gray-300">
              {post.content.split("\n").map((line, index) => {
                if (line.startsWith("▸ ") && line.length > 2) {
                  return (
                    <h2
                      key={index}
                      className="text-xl font-bold text-white mt-8 mb-4 border-l-2 border-purple-600 pl-4"
                    >
                      {line.substring(2)}
                    </h2>
                  )
                } else if (line.startsWith("◆ ")) {
                  return (
                    <h3 key={index} className="text-lg font-semibold text-purple-300 mt-6 mb-3">
                      {line.substring(2)}
                    </h3>
                  )
                } else if (line.startsWith("```")) {
                  return (
                    <div key={index} className="bg-gray-900 border border-purple-500/30 p-4 rounded font-mono text-sm">
                      <code className="text-purple-300">{line.replace(/```\w*/, "")}</code>
                    </div>
                  )
                } else if (line.trim().match(/^\d+\./)) {
                  return (
                    <li key={index} className="ml-4 text-gray-300">
                      {line
                        .trim()
                        .substring(line.indexOf(".") + 1)
                        .trim()}
                    </li>
                  )
                } else if (line.trim() && !line.startsWith("`") && !line.startsWith("```")) {
                  return (
                    <p key={index} className="leading-relaxed">
                      {line.trim()}
                    </p>
                  )
                }
                return null
              })}
            </div>
          </div>

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t border-purple-500/30">
            <div className="flex justify-between items-center">
              <div className="text-purple-300">
                <p>▸ Found this helpful? Share it with others.</p>
              </div>
              <div className="flex gap-4">
                <button className="text-gray-300 hover:text-white transition-colors">▸ previous post</button>
                <button className="text-gray-300 hover:text-white transition-colors">next post ▸</button>
              </div>
            </div>
          </footer>
        </article>
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
