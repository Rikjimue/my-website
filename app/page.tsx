"use client"

import Link from "next/link"
import { Terminal, Shield, Code, FileText, Mail, Github, Linkedin, Twitter, Folder, ExternalLink, Menu, X } from "lucide-react"
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
      charResolveTimes.current = text.split("").map((_, i) => {
        const baseTime = (i / text.length) * ANIMATION_DURATION_MS * 0.7
        const randomVariation = Math.random() * ANIMATION_DURATION_MS * 0.5
        return baseTime + randomVariation
      })

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white font-mono relative overflow-x-hidden">
      {/* Header */}
      <header className="border-b border-purple-500/30 p-4 backdrop-blur-sm bg-black/80 relative z-20">
        <nav className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
            <DecodingText className="text-lg sm:text-xl font-bold">rikjimue@sec:~</DecodingText>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-6">
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

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-purple-400 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 border-b border-purple-500/30 backdrop-blur-sm">
            <div className="flex flex-col space-y-4 p-4">
              <Link href="#about" className="hover:text-purple-400 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                about
              </Link>
              <Link href="#skills" className="hover:text-purple-400 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                skills
              </Link>
              <Link href="#projects" className="hover:text-purple-400 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                projects
              </Link>
              <Link href="#blog" className="hover:text-purple-400 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                blog
              </Link>
              <Link href="#contact" className="hover:text-purple-400 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                contact
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-8 sm:space-y-12 relative z-10">
        {/* Hero Section */}
        <section className="py-8 sm:py-12">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div className="space-y-4 sm:space-y-6 order-2 lg:order-1 min-w-0">
              <div className="text-sm text-purple-300">
                <span className="text-white">╭─</span> <DecodingText delay={100}>whoami</DecodingText>
              </div>
              <div className="space-y-2 min-w-0">
                <DecodingText className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white break-words" delay={300}>Luke Johnson</DecodingText>
                <div className="text-lg sm:text-xl text-purple-300 space-y-1 min-w-0">
                  <div className="flex gap-2 items-center">
                    <span className="text-purple-400 flex-shrink-0">◈</span>
                    <div className="break-words min-w-0"><DecodingText delay={800}>Cybersecurity Student</DecodingText></div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-purple-400 flex-shrink-0">◈</span>
                    <div className="break-words min-w-0"><DecodingText delay={1000}>CTF Competitor</DecodingText></div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-purple-400 flex-shrink-0">◈</span>
                    <div className="break-words min-w-0"><DecodingText delay={1200}>Aspiring Security Researcher</DecodingText></div>
                  </div>
                </div>
              </div>
              <div className="space-y-3 text-sm sm:text-base text-gray-300 border-l-2 border-purple-600 pl-4 min-w-0 max-w-full">
                <div className="flex gap-2 leading-relaxed">
                  <span className="text-purple-400 flex-shrink-0">▸</span>
                  <span className="break-words overflow-wrap-anywhere"><DecodingText delay={1400}>Studying cybersecurity at Purdue while working as a security intern</DecodingText></span>
                </div>
                <div className="flex gap-2 leading-relaxed">
                  <span className="text-purple-400 flex-shrink-0">▸</span>
                  <span className="break-words overflow-wrap-anywhere"><DecodingText delay={1600}>Competing in CTF challenges and building personal security projects</DecodingText></span>
                </div>
                <div className="flex gap-2 leading-relaxed">
                  <span className="text-purple-400 flex-shrink-0">▸</span>
                  <span className="break-words overflow-wrap-anywhere"><DecodingText delay={1800}>Studying reverse engineering and exploitation outside of class through pwn.college</DecodingText></span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 sm:gap-6 pt-4 sm:pt-6">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/Rikjimue"
                  className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors group"
                >
                  <Github className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                  <DecodingText delay={2000}>github</DecodingText>
                </a>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.linkedin.com/in/rikjimue/"
                  className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors group"
                >
                  <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                  <DecodingText delay={2200}>linkedin</DecodingText>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors group"
                >
                  <Twitter className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                  <DecodingText delay={2400}>twitter</DecodingText>
                </a>
              </div>
            </div>

            {/* ASCII Art Section - Mobile Responsive */}
            <div className="border border-purple-500/30 backdrop-blur-sm bg-black/70 rounded-lg order-1 lg:order-2 max-w-full overflow-hidden fade-in-delayed fade-in-2">
              <div className="p-3 sm:p-6 flex flex-col items-center justify-center min-w-0 max-w-full">
                <div className="text-purple-400 whitespace-pre leading-none w-full flex justify-center overflow-hidden min-w-0" style={{
                  fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Source Code Pro", monospace',
                  letterSpacing: '0',
                  fontFeatureSettings: '"liga" 0',
                  fontVariant: 'normal',
                  fontSize: 'clamp(3px, 1.2vw, 10px)'
                }}>
{`██████╗ ██╗██╗  ██╗     ██╗██╗███╗   ███╗██╗   ██╗███████╗
██╔══██╗██║██║ ██╔╝     ██║██║████╗ ████║██║   ██║██╔════╝
██████╔╝██║█████╔╝      ██║██║██╔████╔██║██║   ██║█████╗  
██╔══██╗██║██╔═██╗ ██   ██║██║██║╚██╔╝██║██║   ██║██╔══╝  
██║  ██║██║██║  ██╗╚█████╔╝██║██║ ╚═╝ ██║╚██████╔╝███████╗
╚═╝  ╚═╝╚═╝╚═╝  ╚═╝ ╚════╝ ╚═╝╚═╝     ╚═╝ ╚═════╝ ╚══════╝`}
                </div>
                <div className="text-xs text-purple-300/70 mt-2 sm:mt-4 px-2 max-w-full w-full flex justify-center">
                  <div className="flex gap-2 leading-relaxed text-center">
                    <span className="text-purple-400 flex-shrink-0">▸</span>
                    <span className="break-words" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere', whiteSpace: 'normal' }}>
                      <DecodingText delay={3000}>"The good news about computers is that they do what you tell them to do. The bad news is that they do what you tell them to do." - Ted Nelson</DecodingText>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="border border-purple-500/30 p-4 sm:p-6 backdrop-blur-sm bg-black/50 rounded-lg fade-in-delayed fade-in-3">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              <h2 className="text-xl sm:text-2xl font-bold">about.md</h2>
              <div className="flex-1 border-b border-purple-500/30"></div>
            </div>
            <div className="space-y-4 text-sm sm:text-base text-gray-300">
              <div className="flex gap-2 leading-relaxed">
                <span className="text-purple-400 flex-shrink-0">┌─</span>
                <span className="break-words">I'm a cybersecurity student at Purdue University, currently working as an IT Security Intern at ConnectOne Bank. I spend most of my time learning how systems break and how to defend against those weaknesses.</span>
              </div>
              <div className="flex gap-2 leading-relaxed">
                <span className="text-purple-400 flex-shrink-0">├─</span>
                <span className="break-words">My main interests are in malware analysis and reverse engineering. I've built a few personal projects including a databreach monitoring platform and an isolated malware analysis environment on a Raspberry Pi.</span>
              </div>
              <div className="flex gap-2 leading-relaxed">
                <span className="text-purple-400 flex-shrink-0">└─</span>
                <span className="break-words">Outside of coursework, I compete with Purdue's CTF team (b01lers) and work on automating security processes with Python. I'm always looking for new ways to understand how attackers operate and improve defensive strategies.</span>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="border border-purple-500/30 p-4 sm:p-6 backdrop-blur-sm bg-black/50 rounded-lg fade-in-delayed fade-in-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white">
              <Code className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              <h2 className="text-xl sm:text-2xl font-bold">skills.json</h2>
              <div className="flex-1 border-b border-purple-500/30"></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-3">
                <h3 className="text-base sm:text-lg font-semibold text-purple-300">◆ Current Arsenal</h3>
                <ul className="space-y-2 text-sm sm:text-base text-gray-300">
                  <li className="flex gap-2 leading-relaxed">
                    <span className="text-purple-400 flex-shrink-0">▸</span>
                    <span className="break-words">Python, Java, C, Bash, SQL, Golang</span>
                  </li>
                  <li className="flex gap-2 leading-relaxed">
                    <span className="text-purple-400 flex-shrink-0">▸</span>
                    <span className="break-words">Wireshark, Splunk, Arctic Wolf, Burp Suite</span>
                  </li>
                  <li className="flex gap-2 leading-relaxed">
                    <span className="text-purple-400 flex-shrink-0">▸</span>
                    <span className="break-words">Linux Environments (Kali, Ubuntu, Proxmox)</span>
                  </li>
                  <li className="flex gap-2 leading-relaxed">
                    <span className="text-purple-400 flex-shrink-0">▸</span>
                    <span className="break-words">CTF Competitions & Binary Challenges</span>
                  </li>
                  <li className="flex gap-2 leading-relaxed">
                    <span className="text-purple-400 flex-shrink-0">▸</span>
                    <span className="break-words">Dark Web Reconnaissance & OSINT</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="text-base sm:text-lg font-semibold text-purple-300">◆ Currently Exploring</h3>
                <ul className="space-y-2 text-sm sm:text-base text-gray-300">
                  <li className="flex gap-2 leading-relaxed">
                    <span className="text-purple-400 flex-shrink-0">▸</span>
                    <span className="break-words">x86 Assembly & Reverse Engineering</span>
                  </li>
                  <li className="flex gap-2 leading-relaxed">
                    <span className="text-purple-400 flex-shrink-0">▸</span>
                    <span className="break-words">Ghidra, gdb, Advanced Debugging</span>
                  </li>
                  <li className="flex gap-2 leading-relaxed">
                    <span className="text-purple-400 flex-shrink-0">▸</span>
                    <span className="break-words">Malware Analysis & Behavioral Patterns</span>
                  </li>
                  <li className="flex gap-2 leading-relaxed">
                    <span className="text-purple-400 flex-shrink-0">▸</span>
                    <span className="break-words">Exploit Development Techniques</span>
                  </li>
                  <li className="flex gap-2 leading-relaxed">
                    <span className="text-purple-400 flex-shrink-0">▸</span>
                    <span className="break-words">Threat Intelligence & Attribution</span>
                  </li>
                  <li className="flex gap-2 leading-relaxed">
                    <span className="text-purple-400 flex-shrink-0">▸</span>
                    <span className="break-words">Red Team Methodologies</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="border border-purple-500/30 p-4 sm:p-6 backdrop-blur-sm bg-black/50 rounded-lg fade-in-delayed fade-in-5">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white">
              <Folder className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              <h2 className="text-xl sm:text-2xl font-bold">projects/</h2>
              <div className="flex-1 border-b border-purple-500/30"></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="border border-purple-600/50 p-4 transition-all group rounded-lg hover:bg-purple-950/20 hover:border-purple-400/70 hover:shadow-lg hover:shadow-purple-500/20"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                        {project.name}
                      </h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
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
                    <div className="flex gap-2 text-gray-300 text-sm leading-relaxed">
                      <span className="text-purple-400 flex-shrink-0">▸</span>
                      <span className="break-words">{project.description}</span>
                    </div>
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
        <section id="blog" className="border border-purple-500/30 p-4 sm:p-6 backdrop-blur-sm bg-black/50 rounded-lg fade-in-delayed fade-in-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              <h2 className="text-xl sm:text-2xl font-bold">recent_posts.log</h2>
              <div className="flex-1 border-b border-purple-500/30"></div>
            </div>
            <div className="space-y-4">
              <article className="border-l-2 border-purple-600 pl-4 space-y-2 p-2 transition-all rounded cursor-pointer hover:bg-purple-950/10">
                <div className="text-sm text-purple-300">2024-01-15</div>
                <h3 className="text-base sm:text-lg font-semibold text-white hover:text-purple-300 cursor-pointer">
                  Advanced SQL Injection in Modern Applications
                </h3>
                <div className="flex gap-2 text-gray-300 text-sm leading-relaxed">
                  <span className="text-purple-400 flex-shrink-0">▸</span>
                  <span className="break-words">Deep dive into bypassing modern WAFs and exploiting blind SQL injection vulnerabilities in contemporary web applications...</span>
                </div>
              </article>

              <article className="border-l-2 border-purple-600 pl-4 space-y-2 p-2 transition-all rounded cursor-pointer hover:bg-purple-950/10">
                <div className="text-sm text-purple-300">2024-01-08</div>
                <h3 className="text-base sm:text-lg font-semibold text-white hover:text-purple-300 cursor-pointer">
                  Building VulnHunter: A Python Security Scanner
                </h3>
                <div className="flex gap-2 text-gray-300 text-sm leading-relaxed">
                  <span className="text-purple-400 flex-shrink-0">▸</span>
                  <span className="break-words">Complete guide to building an automated vulnerability scanner using Python with async capabilities and custom payload generation...</span>
                </div>
              </article>

              <article className="border-l-2 border-purple-600 pl-4 space-y-2 p-2 transition-all rounded cursor-pointer hover:bg-purple-950/10">
                <div className="text-sm text-purple-300">2024-01-01</div>
                <h3 className="text-base sm:text-lg font-semibold text-white hover:text-purple-300 cursor-pointer">
                  2023 Security Landscape: A Year in Review
                </h3>
                <div className="flex gap-2 text-gray-300 text-sm leading-relaxed">
                  <span className="text-purple-400 flex-shrink-0">▸</span>
                  <span className="break-words">Analysis of major security incidents, emerging threats, and defensive innovations that shaped the cybersecurity landscape...</span>
                </div>
              </article>
            </div>
            <div className="pt-4">
              <Link href="/blog" className="text-purple-300 hover:text-white transition-colors flex gap-2 items-start leading-relaxed">
                <span className="text-purple-400 flex-shrink-0">▸</span>
                <span className="break-words">view all posts</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="border border-purple-500/30 p-4 sm:p-6 backdrop-blur-sm bg-black/50 rounded-lg">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              <h2 className="text-xl sm:text-2xl font-bold">contact.txt</h2>
              <div className="flex-1 border-b border-purple-500/30"></div>
            </div>
            <div className="space-y-4 text-sm sm:text-base text-gray-300">
              <div className="flex gap-2 leading-relaxed">
                <span className="text-purple-400 flex-shrink-0">▸</span>
                <span className="break-words">Want to reach me?</span>
              </div>
              <div className="grid sm:grid-cols-[2fr_3fr] gap-4">
                <div className="space-y-2">
                  <div className="flex gap-2 leading-relaxed">
                    <span className="text-purple-400 flex-shrink-0">◈</span>
                    <span className="break-words">email: contact@rikjimue.com</span>
                  </div>
                  <div className="flex gap-2 leading-relaxed">
                    <span className="text-purple-400 flex-shrink-0">◈</span>
                    <span className="break-words">signal: rikjimue.09</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2 leading-relaxed">
                    <span className="text-purple-400 flex-shrink-0">◈</span>
                    <span className="break-words">discord: rikjimue</span>
                  </div>
                  <div className="flex gap-2 leading-relaxed">
                    <span className="text-purple-400 flex-shrink-0">◈</span>
                    <span className="break-words break-all">pgp: 0x10C1BC17EA7E3683C07318B09F6467F1CA8829D2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-500/30 p-4 mt-8 sm:mt-12 backdrop-blur-sm bg-black/80 relative z-20">
        <div className="max-w-4xl mx-auto text-center text-purple-300">
          <p className="text-sm sm:text-base">◈ © 2025 Luke Johnson. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}