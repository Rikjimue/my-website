"use client"

import Link from "next/link"
import { Terminal, Shield, Code, FileText, Mail, Github, Linkedin, Twitter, Folder, ExternalLink } from "lucide-react"
import { useEffect, useState, useRef } from "react"

// Enhanced decoding text animation with glitch effects
function DecodingText({ children: text, className = "", delay = 0 }: { children: string; className?: string; delay?: number }) {
  const [displayChars, setDisplayChars] = useState<string[]>(Array(text.length).fill(""))
  const [isGlitching, setIsGlitching] = useState(false)
  const animationFrameId = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const charResolveTimes = useRef<number[]>([])
  const currentScrambledChars = useRef<string[]>(Array(text.length).fill(""))

  const ANIMATION_DURATION_MS = 1500
  const GLITCH_CHANCE = 0.02

  const getRandomChar = () => {
    const hackChars = "!@#$%^&*()_+-=[]{}|;:,.<>?~`"
    const alphaNum = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    const specialChars = "█▓▒░▄▀■□▪▫"
    const allChars = hackChars + alphaNum + specialChars
    return allChars[Math.floor(Math.random() * allChars.length)]
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      // Initialize random resolve times with some clustering for wave effect
      charResolveTimes.current = text.split("").map((_, i) => {
        const baseTime = (i / text.length) * ANIMATION_DURATION_MS * 0.7
        const randomVariation = Math.random() * ANIMATION_DURATION_MS * 0.5
        return baseTime + randomVariation
      })

      // Initialize scrambled characters
      currentScrambledChars.current = Array(text.length)
        .fill("")
        .map(() => getRandomChar())

      startTimeRef.current = performance.now()
      let frameCount = 0

      const animate = () => {
        const elapsed = performance.now() - (startTimeRef.current || 0)

        if (elapsed >= ANIMATION_DURATION_MS) {
          setDisplayChars(text.split(""))
          setIsGlitching(false)
          if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current)
          }
          return
        }

        frameCount++

        // Random glitch effect
        if (Math.random() < GLITCH_CHANCE) {
          setIsGlitching(true)
          setTimeout(() => setIsGlitching(false), 100)
        }

        setDisplayChars(() => {
          const newChars = Array(text.length).fill("")
          for (let i = 0; i < text.length; i++) {
            if (elapsed >= charResolveTimes.current[i]) {
              newChars[i] = text[i]
            } else {
              // Update scrambled chars more frequently for better effect
              if (frameCount % 2 === 0) {
                currentScrambledChars.current[i] = getRandomChar()
              }
              newChars[i] = currentScrambledChars.current[i]
            }
          }
          return newChars
        })

        animationFrameId.current = requestAnimationFrame(animate)
      }

      animationFrameId.current = requestAnimationFrame(animate)
    }, delay)

    return () => {
      clearTimeout(timer)
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [text, delay])

  return (
    <span 
      className={`${className} ${isGlitching ? 'animate-pulse text-red-400' : ''} transition-colors duration-100`}
    >
      {displayChars.map((char, index) => (
        <span 
          key={index} 
          className="inline-block"
          style={{ 
            minWidth: char === ' ' ? '0.3em' : '0.6em', 
            textAlign: 'center',
            textShadow: isGlitching ? '2px 0 #ff0000, -2px 0 #00ffff' : 'none'
          }}
        >
          {char || '\u00A0'}
        </span>
      ))}
    </span>
  )
}

const projects = [
  {
    id: 1,
    name: "Breach Radar",
    description: "Website that tracks and stores popular databreaches",
    tech: ["Next.JS", "Golang", "PostgreSQL"],
    status: "Completed",
    github: "https://github.com/Rikjimue/breach-radar",
  },
  {
    id: 2,
    name: "Homelab",
    description: "Proxmox server for self-hosting and sandbox to learn new skills",
    tech: ["Proxmox", "Virtualization", "SIEM", "Bash"],
    status: "Active",
    github: "link to blog",
  },
  {
    id: 3,
    name: "C Projects",
    description: "A Collection of projects in C as I learned CS concepts",
    tech: ["C", "Unix", "CLI", "Systems programming"],
    status: "Active",
    github: "https://github.com/Rikjimue/c-projects",
  },
  {
    id: 4,
    name: "Hack The Matrix",
    description: "A puzzel based video game developed in Java",
    tech: ["Java"],
    status: "Completed",
    github: "https://github.com/Rikjimue/Hack-the-Matrix",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white font-mono relative overflow-x-hidden">

      {/* Header */}
      <header className="border-b border-purple-500/30 p-4 backdrop-blur-sm bg-black/80 relative z-20">
        <nav className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-6 h-6 text-purple-400" />
            <DecodingText className="text-xl font-bold">rikjimue@sec:~</DecodingText>
          </div>
          <div className="flex gap-6">
            <Link href="#about" className="hover:text-purple-400 transition-colors">
              <DecodingText delay={200}>about</DecodingText>
            </Link>
            <Link href="#skills" className="hover:text-purple-400 transition-colors">
              <DecodingText delay={400}>skills</DecodingText>
            </Link>
            <Link href="#projects" className="hover:text-purple-400 transition-colors">
              <DecodingText delay={600}>projects</DecodingText>
            </Link>
            <Link href="#blog" className="hover:text-purple-400 transition-colors">
              <DecodingText delay={800}>blog</DecodingText>
            </Link>
            <Link href="#contact" className="hover:text-purple-400 transition-colors">
              <DecodingText delay={1000}>contact</DecodingText>
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-12 relative z-10">
        {/* Hero Section */}
        <section className="py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="text-sm text-purple-300">
                <span className="text-white">╭─</span> <DecodingText delay={100}>whoami</DecodingText>
              </div>
              <div className="space-y-2">
                <DecodingText className="text-5xl font-bold text-white" delay={300}>Luke Johnson</DecodingText>
                <div className="text-xl text-purple-300 space-y-1">
                  <p>
                    ◈ <DecodingText delay={800}>Cybersecurity Student</DecodingText>
                  </p>
                  <p>
                    ◈ <DecodingText delay={1000}>CTF Competitor</DecodingText>
                  </p>
                  <p>
                    ◈ <DecodingText delay={1200}>Aspiring Security Researcher</DecodingText>
                  </p>
                </div>
              </div>
              <div className="space-y-3 text-gray-300 border-l-2 border-purple-600 pl-4">
                <p>
                  ▸ <DecodingText delay={1400}>Studying cybersecurity at Purdue while working as a security intern</DecodingText>
                </p>
                <p>
                  ▸ <DecodingText delay={1600}>Competing in CTF challenges and building personal security projects</DecodingText>
                </p>
                <p>
                  ▸ <DecodingText delay={1800}>Studying reverse engineering and exploitation outside of class through pwn.college</DecodingText>
                </p>
              </div>
              <div className="flex gap-6 pt-6">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/Rikjimue"
                  className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors group"
                >
                  <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <DecodingText delay={2000}>github</DecodingText>
                </a>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.linkedin.com/in/rikjimue/"
                  className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors group"
                >
                  <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <DecodingText delay={2200}>linkedin</DecodingText>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors group"
                >
                  <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <DecodingText delay={2400}>twitter</DecodingText>
                </a>
              </div>
            </div>

            {/* Fixed ASCII Art Section */}
            <div className="border border-purple-500/30 backdrop-blur-sm bg-black/70 rounded-lg">
              <div className="p-6 flex flex-col items-center justify-center">
                <div className="text-purple-400 whitespace-pre text-xs leading-none inline-block" style={{
                  fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Source Code Pro", monospace',
                  letterSpacing: '0',
                  fontFeatureSettings: '"liga" 0',
                  fontVariant: 'normal'
                }}>
{`██████╗ ██╗██╗  ██╗     ██╗██╗███╗   ███╗██╗   ██╗███████╗
██╔══██╗██║██║ ██╔╝     ██║██║████╗ ████║██║   ██║██╔════╝
██████╔╝██║█████╔╝      ██║██║██╔████╔██║██║   ██║█████╗  
██╔══██╗██║██╔═██╗ ██   ██║██║██║╚██╔╝██║██║   ██║██╔══╝  
██║  ██║██║██║  ██╗╚█████╔╝██║██║ ╚═╝ ██║╚██████╔╝███████╗
╚═╝  ╚═╝╚═╝╚═╝  ╚═╝ ╚════╝ ╚═╝╚═╝     ╚═╝ ╚═════╝ ╚══════╝
`}
                </div>
                <div className="text-xs text-purple-300/70 mt-4">
                  <DecodingText delay={3000}>▸ "The good news about computers is that they do what you tell them to do. The bad news is that they do what you tell them to do." - Ted Nelson</DecodingText>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="border border-purple-500/30 p-6 backdrop-blur-sm bg-black/50 rounded-lg">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white">
              <Shield className="w-5 h-5 text-purple-400" />
              <h2 className="text-2xl font-bold">about.md</h2>
              <div className="flex-1 border-b border-purple-500/30"></div>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>
                ┌─ I'm a cybersecurity student at Purdue University, currently working as an
                <br />│ IT Security Intern at ConnectOne Bank. I spend most of my time learning
                <br />│ how systems break and how to defend against those weaknesses.
              </p>
              <p>
                ├─ My main interests are in malware analysis and reverse engineering. I've
                <br />│ built a few personal projects including a databreach monitoring platform
                <br />│ and an isolated malware analysis environment on a Raspberry Pi.
              </p>
              <p>
                └─ Outside of coursework, I compete with Purdue's CTF team (b01lers) and work
                <br />│ on automating security processes with Python. I'm always looking for new
                <br />│ ways to understand how attackers operate and improve defensive strategies.
              </p>
              <p>
              └─ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
            </p>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="border border-purple-500/30 p-6 backdrop-blur-sm bg-black/50 rounded-lg">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white">
              <Code className="w-5 h-5 text-purple-400" />
              <h2 className="text-2xl font-bold">skills.json</h2>
              <div className="flex-1 border-b border-purple-500/30"></div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-purple-300">◆ Current Arsenal</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>▸ Python, Java, C, Bash, SQL, Golang</li>
                  <li>▸ Wireshark, Splunk, Arctic Wolf, Burp Suite</li>
                  <li>▸ Linux Environments (Kali, Ubuntu, Proxmox)</li>
                  <li>▸ CTF Competitions & Binary Challenges</li>
                  <li>▸ Dark Web Reconnaissance & OSINT</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-purple-300">◆ Currently Exploring</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>▸ x86 Assembly & Reverse Engineering</li>
                  <li>▸ Ghidra, gdb, Advanced Debugging</li>
                  <li>▸ Malware Analysis & Behavioral Patterns</li>
                  <li>▸ Exploit Development Techniques</li>
                  <li>▸ Threat Intelligence & Attribution</li>
                  <li>▸ Red Team Methodologies</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="border border-purple-500/30 p-6 backdrop-blur-sm bg-black/50 rounded-lg">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white">
              <Folder className="w-5 h-5 text-purple-400" />
              <h2 className="text-2xl font-bold">projects/</h2>
              <div className="flex-1 border-b border-purple-500/30"></div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="border border-purple-600/50 p-4 transition-all group rounded-lg hover:bg-purple-950/20 hover:border-purple-400/70 hover:shadow-lg hover:shadow-purple-500/20"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                        {project.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            project.status === "Completed"
                              ? "bg-green-600/20 text-green-400 border border-green-600/50"
                              : "bg-orange-600/20 text-orange-400 border border-orange-600/50"
                          }`}
                        >
                          {project.status}
                        </span>
                        <a
                          href={project.github}
                          className="text-purple-300 hover:text-white transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm">▸ {project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <span key={tech} className="text-xs px-2 py-1 border border-purple-600/50 text-purple-300 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section id="blog" className="border border-purple-500/30 p-6 backdrop-blur-sm bg-black/50 rounded-lg">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white">
              <FileText className="w-5 h-5 text-purple-400" />
              <h2 className="text-2xl font-bold">recent_posts.log</h2>
              <div className="flex-1 border-b border-purple-500/30"></div>
            </div>
            <div className="space-y-4">
              <article className="border-l-2 border-purple-600 pl-4 space-y-2 p-2 transition-all rounded cursor-pointer hover:bg-purple-950/10">
                <div className="text-sm text-purple-300">2024-01-15</div>
                <h3 className="text-lg font-semibold text-white hover:text-purple-300 cursor-pointer">
                  Advanced SQL Injection in Modern Applications
                </h3>
                <p className="text-gray-300 text-sm">
                  ▸ Deep dive into bypassing modern WAFs and exploiting blind SQL injection vulnerabilities in
                  contemporary web applications...
                </p>
              </article>

              <article className="border-l-2 border-purple-600 pl-4 space-y-2 p-2 transition-all rounded cursor-pointer hover:bg-purple-950/10">
                <div className="text-sm text-purple-300">2024-01-08</div>
                <h3 className="text-lg font-semibold text-white hover:text-purple-300 cursor-pointer">
                  Building VulnHunter: A Python Security Scanner
                </h3>
                <p className="text-gray-300 text-sm">
                  ▸ Complete guide to building an automated vulnerability scanner using Python with async capabilities
                  and custom payload generation...
                </p>
              </article>

              <article className="border-l-2 border-purple-600 pl-4 space-y-2 p-2 transition-all rounded cursor-pointer hover:bg-purple-950/10">
                <div className="text-sm text-purple-300">2024-01-01</div>
                <h3 className="text-lg font-semibold text-white hover:text-purple-300 cursor-pointer">
                  2023 Security Landscape: A Year in Review
                </h3>
                <p className="text-gray-300 text-sm">
                  ▸ Analysis of major security incidents, emerging threats, and defensive innovations that shaped the
                  cybersecurity landscape...
                </p>
              </article>
            </div>
            <div className="pt-4">
              <Link href="/blog" className="text-purple-300 hover:text-white transition-colors">
                ▸ view all posts
              </Link>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="border border-purple-500/30 p-6 backdrop-blur-sm bg-black/50 rounded-lg">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white">
              <Mail className="w-5 h-5 text-purple-400" />
              <h2 className="text-2xl font-bold">contact.txt</h2>
              <div className="flex-1 border-b border-purple-500/30"></div>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>▸ Want to reach me?</p>
              <div className="grid md:grid-cols-[2fr_3fr] gap-4">
                <div className="space-y-2">
                  <p>◈ email: contact@rikjimue.com</p>
                  <p>◈ signal: rikjimue.09</p>
                </div>
                <div className="space-y-2">
                  <p>◈ discord: rikjimue</p>
                  <p>◈ pgp: 0x10C1BC17EA7E3683C07318B09F6467F1CA8829D2</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-500/30 p-4 mt-12 backdrop-blur-sm bg-black/80 relative z-20">
        <div className="max-w-4xl mx-auto text-center text-purple-300">
          <p>◈ © 2025 Luke Johnson. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}