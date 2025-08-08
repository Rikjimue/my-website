"use client"

import Link from "next/link"
import { Terminal, Shield, Code, FileText, Mail, Github, Linkedin, Twitter, Folder, ExternalLink, Menu, X } from "lucide-react"
import { useEffect, useState, useRef, useCallback } from "react"
import DecodingText from "@/components/DecodingText"

interface BlogPost {
  id: string
  title: string
  date: string
  readTime: string
  excerpt: string
  tags: string[]
  slug: string
  published: boolean
}

function AnimatedSection({ 
  children, 
  delay = 0, 
  className = "",
  isVisible = false 
}: { 
  children: React.ReactNode; 
  delay?: number; 
  className?: string;
  isVisible?: boolean;
}) {
  const [shouldShow, setShouldShow] = useState(false)

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setShouldShow(true)
      }, delay)
      return () => clearTimeout(timer)
    }
  }, [isVisible, delay])

  return (
    <div 
      className={`transition-all duration-700 ease-out ${
        shouldShow ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${className}`}
    >
      {children}
    </div>
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
  const [heroAnimationComplete, setHeroAnimationComplete] = useState(false)
  const [completedAnimations, setCompletedAnimations] = useState(0)
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([])
  const [blogLoading, setBlogLoading] = useState(true)
  const [blogError, setBlogError] = useState<string | null>(null)

  const loadRecentPosts = async (): Promise<BlogPost[]> => {
  try {
    const response = await fetch('/api/blog')
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    
    const data = await response.json()
    
    if (data.posts && Array.isArray(data.posts)) {
      return data.posts.slice(0, 3)
    }
    return []
  } catch (error) {
    console.error('Failed to load recent posts:', error)
    return []
  }
}
  
  const handleAnimationComplete = useCallback(() => {
    setCompletedAnimations(prev => {
      const newCount = prev + 1
      if (newCount >= 6) {
        setTimeout(() => setHeroAnimationComplete(true), 500)
      }
      return newCount
    })
  }, [])

useEffect(() => {
    const loadPosts = async () => {
      setBlogLoading(true)
      setBlogError(null)
      
      try {
        const posts = await loadRecentPosts()
        setRecentPosts(posts)
        
        if (posts.length === 0) {
          setBlogError('No blog posts found.')
        }
      } catch (error) {
        console.error('Error loading blog posts:', error)
        setBlogError('Failed to load blog posts')
      } finally {
        setBlogLoading(false)
      }
    }

    if (heroAnimationComplete) {
      loadPosts()
    }
  }, [heroAnimationComplete])

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
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div 
            className="md:hidden absolute top-full left-0 right-0 bg-black/95 border-b border-purple-500/30 backdrop-blur-sm"
            id="mobile-navigation"
            role="navigation"
            aria-label="Mobile navigation menu"
          >
            <div className="flex flex-col space-y-4 p-4">
              <Link 
                href="#about" 
                className="hover:text-purple-400 transition-colors" 
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Go to About section"
              >
                about
              </Link>
              <Link 
                href="#skills" 
                className="hover:text-purple-400 transition-colors" 
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Go to Skills section"
              >
                skills
              </Link>
              <Link 
                href="#projects" 
                className="hover:text-purple-400 transition-colors" 
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Go to Projects section"
              >
                projects
              </Link>
              <Link 
                href="#blog" 
                className="hover:text-purple-400 transition-colors" 
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Go to Blog section"
              >
                blog
              </Link>
              <Link 
                href="#contact" 
                className="hover:text-purple-400 transition-colors" 
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Go to Contact section"
              >
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
              <AnimatedSection isVisible={true} className="text-sm text-purple-300">
                <DecodingText delay={100} onComplete={handleAnimationComplete}>╭─ whoami</DecodingText>
              </AnimatedSection>
              
              <AnimatedSection isVisible={true} className="space-y-2 min-w-0">
                <DecodingText 
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white break-words" 
                  delay={300}
                  onComplete={handleAnimationComplete}
                >
                  Luke Johnson
                </DecodingText>
                <div className="text-lg sm:text-xl text-purple-300 space-y-1 min-w-0">
                  <AnimatedSection isVisible={true} delay={800} className="flex gap-2 items-center">
                    <span className="text-purple-400 flex-shrink-0">◈</span>
                    <div className="break-words min-w-0">
                      <DecodingText delay={800} onComplete={handleAnimationComplete}>Cybersecurity Student</DecodingText>
                    </div>
                  </AnimatedSection>
                  <AnimatedSection isVisible={true} delay={1000} className="flex gap-2 items-center">
                    <span className="text-purple-400 flex-shrink-0">◈</span>
                    <div className="break-words min-w-0">
                      <DecodingText delay={1000} onComplete={handleAnimationComplete}>CTF Competitor</DecodingText>
                    </div>
                  </AnimatedSection>
                  <AnimatedSection isVisible={true} delay={1200} className="flex gap-2 items-center">
                    <span className="text-purple-400 flex-shrink-0">◈</span>
                    <div className="break-words min-w-0">
                      <DecodingText delay={1200} onComplete={handleAnimationComplete}>Aspiring Security Researcher</DecodingText>
                    </div>
                  </AnimatedSection>
                </div>
              </AnimatedSection>
              
              <AnimatedSection isVisible={true} delay={1400} className="space-y-3 text-sm sm:text-base text-gray-300 border-l-2 border-purple-600 pl-4">
                <div className="flex gap-2 leading-relaxed">
                  <span className="text-purple-400 flex-shrink-0 mt-0.5">▸</span>
                  <div className="flex-1 min-w-0">
                    <DecodingText delay={1400} onComplete={handleAnimationComplete}>
                      Studying cybersecurity at Purdue while working as a security intern
                    </DecodingText>
                  </div>
                </div>
                <div className="flex gap-2 leading-relaxed">
                  <span className="text-purple-400 flex-shrink-0 mt-0.5">▸</span>
                  <div className="flex-1 min-w-0">
                    <DecodingText delay={1600}>
                      Competing in CTF challenges and building personal security projects
                    </DecodingText>
                  </div>
                </div>
                <div className="flex gap-2 leading-relaxed">
                  <span className="text-purple-400 flex-shrink-0 mt-0.5">▸</span>
                  <div className="flex-1 min-w-0">
                    <DecodingText delay={1800}>
                      Studying reverse engineering and exploitation outside of class through pwn.college
                    </DecodingText>
                  </div>
                </div>
              </AnimatedSection>
              
              <AnimatedSection isVisible={true} delay={2000} className="flex flex-wrap gap-4 sm:gap-6 pt-4 sm:pt-6">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/Rikjimue"
                  className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors group"
                  aria-label="Visit Luke Johnson's GitHub profile (opens in new tab)"
                >
                  <Github className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                  <DecodingText delay={2000}>github</DecodingText>
                </a>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.linkedin.com/in/rikjimue/"
                  className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors group"
                  aria-label="Visit Luke Johnson's LinnkedIn profile (opens in new tab)"
                >
                  <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                  <DecodingText delay={2200}>linkedin</DecodingText>
                </a>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://x.com/rikjimue/"
                  className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors group"
                  aria-label="Visit Luke Johnson's LinkedIn profile (opens in new tab)"
                >
                  <Twitter className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                  <DecodingText delay={2400}>twitter</DecodingText>
                </a>
              </AnimatedSection>
            </div>

            {/* ASCII Art Section - Mobile Responsive */}
            <AnimatedSection 
              isVisible={true} 
              delay={500}
              className="ascii-art-section border border-purple-500/30 backdrop-blur-sm bg-black/70 rounded-lg order-1 lg:order-2 max-w-full overflow-hidden"
            >
              <div className="ascii-container p-3 sm:p-6 flex flex-col items-center justify-center min-w-0 max-w-full">
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
                <div className="quote-container mt-2 sm:mt-4 w-full px-2 sm:px-4">
                  <div className="text-xs text-purple-300/70 leading-relaxed text-center max-w-full">
                    <div className="flex items-start gap-2 justify-center max-w-full">
                      <span className="text-purple-400 flex-shrink-0 mt-0.5">▸</span>
                      <div className="quote-text-content flex-1 max-w-full text-left sm:text-center">
                        <DecodingText delay={1400}>
                          "The good news about computers is that they do what you tell them to do. The bad news is that they do what you tell them to do." - Ted Nelson
                        </DecodingText>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* About Section */}
        <AnimatedSection isVisible={heroAnimationComplete} delay={200}>
          <section id="about" className="border border-purple-500/30 p-4 sm:p-6 backdrop-blur-sm bg-black/50 rounded-lg">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-white">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                <h2 className="text-xl sm:text-2xl font-bold">about.md</h2>
                <div className="flex-1 border-b border-purple-500/30"></div>
              </div>
              <div className="space-y-4 text-sm sm:text-base text-gray-300">
                <div className="flex gap-2 leading-relaxed">
                  <span className="text-purple-400 flex-shrink-0 mt-0.5">┌─</span>
                  <span className="break-words min-w-0 flex-1">I'm a cybersecurity student at Purdue University, currently working as an IT Security Intern at ConnectOne Bank. I spend most of my time learning how systems break and how to defend against those weaknesses.</span>
                </div>
                <div className="flex gap-2 leading-relaxed">
                  <span className="text-purple-400 flex-shrink-0 mt-0.5">├─</span>
                  <span className="break-words min-w-0 flex-1">My main interests are in malware analysis and reverse engineering. I've built a few personal projects including a databreach monitoring platform and an isolated malware analysis environment on a Raspberry Pi.</span>
                </div>
                <div className="flex gap-2 leading-relaxed">
                  <span className="text-purple-400 flex-shrink-0 mt-0.5">└─</span>
                  <span className="break-words min-w-0 flex-1">Outside of coursework, I compete with Purdue's CTF team (b01lers) and work on automating security processes with Python. I'm always looking for new ways to understand how attackers operate and improve defensive strategies.</span>
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* Skills Section */}
        <AnimatedSection isVisible={heroAnimationComplete} delay={400}>
          <section id="skills" className="border border-purple-500/30 p-4 sm:p-6 backdrop-blur-sm bg-black/50 rounded-lg">
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
                      <span className="text-purple-400 flex-shrink-0 mt-0.5">▸</span>
                      <span className="break-words min-w-0">Python, Java, C, Bash, SQL, Golang</span>
                    </li>
                    <li className="flex gap-2 leading-relaxed">
                      <span className="text-purple-400 flex-shrink-0 mt-0.5">▸</span>
                      <span className="break-words min-w-0">Wireshark, Splunk, Arctic Wolf, Burp Suite</span>
                    </li>
                    <li className="flex gap-2 leading-relaxed">
                      <span className="text-purple-400 flex-shrink-0 mt-0.5">▸</span>
                      <span className="break-words min-w-0">Linux Environments (Kali, Ubuntu, Proxmox)</span>
                    </li>
                    <li className="flex gap-2 leading-relaxed">
                      <span className="text-purple-400 flex-shrink-0 mt-0.5">▸</span>
                      <span className="break-words min-w-0">CTF Competitions & Binary Challenges</span>
                    </li>
                    <li className="flex gap-2 leading-relaxed">
                      <span className="text-purple-400 flex-shrink-0 mt-0.5">▸</span>
                      <span className="break-words min-w-0">Dark Web Reconnaissance & OSINT</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-semibold text-purple-300">◆ Currently Exploring</h3>
                  <ul className="space-y-2 text-sm sm:text-base text-gray-300">
                    <li className="flex gap-2 leading-relaxed">
                      <span className="text-purple-400 flex-shrink-0 mt-0.5">▸</span>
                      <span className="break-words min-w-0">x86 Assembly & Reverse Engineering</span>
                    </li>
                    <li className="flex gap-2 leading-relaxed">
                      <span className="text-purple-400 flex-shrink-0 mt-0.5">▸</span>
                      <span className="break-words min-w-0">Ghidra, gdb, Advanced Debugging</span>
                    </li>
                    <li className="flex gap-2 leading-relaxed">
                      <span className="text-purple-400 flex-shrink-0 mt-0.5">▸</span>
                      <span className="break-words min-w-0">Malware Analysis & Behavioral Patterns</span>
                    </li>
                    <li className="flex gap-2 leading-relaxed">
                      <span className="text-purple-400 flex-shrink-0 mt-0.5">▸</span>
                      <span className="break-words min-w-0">Exploit Development Techniques</span>
                    </li>
                    <li className="flex gap-2 leading-relaxed">
                      <span className="text-purple-400 flex-shrink-0 mt-0.5">▸</span>
                      <span className="break-words min-w-0">Threat Intelligence & Attribution</span>
                    </li>
                    <li className="flex gap-2 leading-relaxed">
                      <span className="text-purple-400 flex-shrink-0 mt-0.5">▸</span>
                      <span className="break-words min-w-0">Red Team Methodologies</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* Projects Section */}
        <AnimatedSection isVisible={heroAnimationComplete} delay={600}>
          <section id="projects" className="border border-purple-500/30 p-4 sm:p-6 backdrop-blur-sm bg-black/50 rounded-lg">
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
                            aria-label={`View ${project.name} on GitHub (opens in new tab)`}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                      <div className="flex gap-2 text-gray-300 text-sm leading-relaxed">
                        <span className="text-purple-400 flex-shrink-0 mt-0.5">▸</span>
                        <span className="break-words min-w-0">{project.description}</span>
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
        </AnimatedSection>

        {/* Blog Section */}
      <AnimatedSection isVisible={heroAnimationComplete} delay={800}>
        <section id="blog" className="border border-purple-500/30 p-4 sm:p-6 backdrop-blur-sm bg-black/50 rounded-lg">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              <h2 className="text-xl sm:text-2xl font-bold">recent_posts.log</h2>
              <div className="flex-1 border-b border-purple-500/30"></div>
            </div>
            
            {/* Loading State */}
            {blogLoading ? (
              <div className="space-y-4">
                <div className="flex gap-2 text-purple-300 text-sm">
                  <span className="text-purple-400 flex-shrink-0 mt-0.5">▸</span>
                  <span>Loading recent posts...</span>
                </div>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border-l-2 border-purple-600 pl-4 space-y-2 p-2 animate-pulse">
                    <div className="h-4 bg-purple-900/30 rounded w-20"></div>
                    <div className="h-6 bg-purple-900/30 rounded w-3/4"></div>
                    <div className="h-4 bg-purple-900/30 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : blogError ? (
              /* Error State */
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm mt-2">
                  No blog posts available
                </p>
              </div>
            ) : recentPosts.length > 0 ? (
              /* Dynamic Blog Posts from Real Files */
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <article 
                    key={post.id}
                    className="border-l-2 border-purple-600 pl-4 space-y-2 p-2 transition-all rounded hover:bg-purple-950/10"
                  >
                    <div className="flex items-center gap-4 text-sm text-purple-300">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-white hover:text-purple-300 cursor-pointer transition-colors">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>
                    <div className="flex gap-2 text-gray-300 text-sm leading-relaxed">
                      <span className="break-words min-w-0">{post.excerpt}</span>
                    </div>
                    {/* Show tags */}
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span 
                            key={tag}
                            className="text-xs px-2 py-0.5 border border-purple-600/30 text-purple-400 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="text-xs text-purple-400">
                            +{post.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              /* No Posts State */
              <div className="text-center py-8 text-gray-400">
                <div className="flex gap-2 justify-center">
                  <span className="text-purple-400 flex-shrink-0 mt-0.5">▸</span>
                  <span>No blog posts found.</span>
                </div>
              </div>
            )}
            
            <div className="pt-4">
              <Link href="/blog" className="text-purple-300 hover:text-white transition-colors flex gap-2 items-start leading-relaxed">
                <span className="text-purple-400 flex-shrink-0 mt-0.5">▸</span>
                <span className="break-words min-w-0">view all posts</span>
              </Link>
            </div>
          </div>
        </section>
      </AnimatedSection>

        {/* Contact Section */}
        <AnimatedSection isVisible={heroAnimationComplete} delay={1000}>
          <section id="contact" className="border border-purple-500/30 p-4 sm:p-6 backdrop-blur-sm bg-black/50 rounded-lg">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-white">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                <h2 className="text-xl sm:text-2xl font-bold">contact.txt</h2>
                <div className="flex-1 border-b border-purple-500/30"></div>
              </div>
              <div className="space-y-4 text-sm sm:text-base text-gray-300">
                <div className="flex gap-2 leading-relaxed">
                  <span className="text-purple-400 flex-shrink-0 mt-0.5">▸</span>
                  <span className="break-words min-w-0">Want to reach me?</span>
                </div>
                <div className="grid sm:grid-cols-[2fr_3fr] gap-4">
                  <div className="space-y-2">
                    <div className="flex gap-2 leading-relaxed">
                      <span className="text-purple-400 flex-shrink-0 mt-0.5">◈</span>
                      <span className="break-words min-w-0">email: contact@rikjimue.com</span>
                    </div>
                    <div className="flex gap-2 leading-relaxed">
                      <span className="text-purple-400 flex-shrink-0 mt-0.5">◈</span>
                      <span className="break-words min-w-0">signal: rikjimue.09</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex gap-2 leading-relaxed">
                      <span className="text-purple-400 flex-shrink-0 mt-0.5">◈</span>
                      <span className="break-words min-w-0">discord: rikjimue</span>
                    </div>
                    <div className="flex gap-2 leading-relaxed">
                      <span className="text-purple-400 flex-shrink-0 mt-0.5">◈</span>
                      <span className="break-words min-w-0 break-all">pgp: 0x10C1BC17EA7E3683C07318B09F6467F1CA8829D2</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>
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