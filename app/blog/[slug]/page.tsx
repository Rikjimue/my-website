"use client"

import Link from "next/link"
import { Terminal, ArrowLeft, Calendar, Clock, Tag } from "lucide-react"
import { useEffect, useState, useRef, JSX } from "react"
import { useParams } from "next/navigation"

// Synchronized decoding text animation component
function DecodingText({ 
  children: text, 
  className = "", 
  delay = 0 
}: { 
  children: string; 
  className?: string; 
  delay?: number;
}) {
  const [displayWords, setDisplayWords] = useState<Array<{ word: string; chars: string[]; resolved: boolean }>>([])
  const [isGlitching, setIsGlitching] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const animationFrameId = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const wordResolveTimes = useRef<number[]>([])

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

        setDisplayWords(prevWords => 
          prevWords.map((wordObj, wordIndex) => {
            if (elapsed >= wordResolveTimes.current[wordIndex]) {
              return {
                ...wordObj,
                chars: wordObj.word.split(''),
                resolved: true
              }
            } else {
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
      className={`${className} ${isGlitching ? 'animate-pulse text-red-400' : ''} transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ 
        wordBreak: 'break-word', 
        overflowWrap: 'anywhere',
        lineHeight: '1.5'
      }}
    >
      {displayWords.map((wordObj, wordIndex) => (
        <span 
          key={wordIndex}
          className="inline"
          style={{
            textShadow: isGlitching && !wordObj.resolved ? '2px 0 #ff0000, -2px 0 #00ffff' : 'none'
          }}
        >
          {wordObj.chars.join('')}
        </span>
      ))}
    </span>
  )
}

interface BlogPost {
  id: string
  title: string
  date: string
  readTime: string
  excerpt: string
  tags: string[]
  content: string
  slug: string
  published: boolean
}

export default function BlogPostPage() {
  const params = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Add navigation state
  const [allPosts, setAllPosts] = useState<BlogPost[]>([])
  const [previousPost, setPreviousPost] = useState<BlogPost | null>(null)
  const [nextPost, setNextPost] = useState<BlogPost | null>(null)

  // Updated function to fetch blog post and navigation data
  const fetchBlogPostAndNavigation = async (slug: string) => {
    try {
      const response = await fetch('/api/blog')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.posts && Array.isArray(data.posts)) {
        const posts = data.posts
        setAllPosts(posts)
        
        // Find current post
        const currentPostIndex = posts.findIndex((post: BlogPost) => post.slug === slug)
        
        if (currentPostIndex === -1) {
          return null
        }
        
        const currentPost = posts[currentPostIndex]
        
        // Find previous and next posts (based on chronological order)
        // Previous = older post (higher index), Next = newer post (lower index)  
        const prevPost = currentPostIndex < posts.length - 1 ? posts[currentPostIndex + 1] : null
        const nextPostData = currentPostIndex > 0 ? posts[currentPostIndex - 1] : null
        
        setPreviousPost(prevPost)
        setNextPost(nextPostData)
        
        return currentPost
      }
      
      return null
    } catch (error) {
      console.error('Error fetching blog post:', error)
      throw error
    }
  }

  useEffect(() => {
    const loadPost = async () => {
      const slug = params?.slug as string
      
      if (!slug) {
        setNotFound(true)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        const blogPost = await fetchBlogPostAndNavigation(slug)
        
        if (blogPost) {
          setPost(blogPost)
        } else {
          setNotFound(true)
        }
      } catch (err) {
        console.error('Failed to load blog post:', err)
        setError('Failed to load blog post')
      } finally {
        setLoading(false)
      }
    }

    loadPost()
  }, [params])

  // Render content with proper formatting
  const renderContent = (content: string) => {
    const lines = content.split("\n")
    const result: JSX.Element[] = []
    let inCodeBlock = false
    let codeBlockLanguage = ""
    let codeBlockContent: string[] = []

    lines.forEach((line, index) => {
      // Handle code blocks
      if (line.startsWith("```")) {
        if (inCodeBlock) {
          // End of code block
          result.push(
            <div key={`code-${index}`} className="bg-gray-900 border border-purple-500/30 p-4 rounded font-mono text-sm mt-4 mb-4 overflow-x-auto">
              {codeBlockLanguage && (
                <div className="text-purple-400 text-xs mb-2 border-b border-purple-500/20 pb-1">
                  {codeBlockLanguage}
                </div>
              )}
              <pre className="text-purple-300">
                <code>{codeBlockContent.join('\n')}</code>
              </pre>
            </div>
          )
          inCodeBlock = false
          codeBlockLanguage = ""
          codeBlockContent = []
        } else {
          // Start of code block
          inCodeBlock = true
          codeBlockLanguage = line.replace(/```/, "").trim()
        }
        return
      }

      // If we're inside a code block, collect the content
      if (inCodeBlock) {
        codeBlockContent.push(line)
        return
      }

      // Handle different markdown elements
      if (line.trim() === "") {
        // Empty line - add space
        result.push(<div key={`space-${index}`} className="h-2"></div>)
      } else if (line.startsWith("# ")) {
        // H1 - Main title
        result.push(
          <h1 key={index} className="text-3xl font-bold text-white mt-8 mb-6 border-l-4 border-purple-600 pl-4">
            {line.substring(2)}
          </h1>
        )
      } else if (line.startsWith("## ")) {
        // H2 - Section headers
        result.push(
          <h2 key={index} className="text-2xl font-bold text-white mt-8 mb-4 border-l-2 border-purple-600 pl-4">
            {line.substring(3)}
          </h2>
        )
      } else if (line.startsWith("### ")) {
        // H3 - Subsection headers
        result.push(
          <h3 key={index} className="text-xl font-semibold text-purple-300 mt-6 mb-3">
            {line.substring(4)}
          </h3>
        )
      } else if (line.startsWith("#### ")) {
        // H4 - Sub-subsection headers
        result.push(
          <h4 key={index} className="text-lg font-semibold text-purple-400 mt-4 mb-2">
            {line.substring(5)}
          </h4>
        )
      } else if (line.trim().startsWith("* ") || line.trim().startsWith("- ")) {
        // Bullet points
        const content = line.trim().substring(2)
        result.push(
          <div key={index} className="flex gap-2 my-2 text-gray-300">
            <span className="text-purple-400 flex-shrink-0 mt-0.5">▸</span>
            <span className="break-words min-w-0">{content}</span>
          </div>
        )
      } else if (line.trim().match(/^\d+\./)) {
        // Numbered lists
        const content = line.trim().substring(line.indexOf(".") + 1).trim()
        result.push(
          <div key={index} className="flex gap-2 my-2 text-gray-300">
            <span className="text-purple-400 flex-shrink-0 mt-0.5">
              {line.trim().split('.')[0]}.
            </span>
            <span className="break-words min-w-0">{content}</span>
          </div>
        )
      } else if (line.trim().startsWith("> ")) {
        // Blockquotes
        result.push(
          <blockquote key={index} className="border-l-4 border-purple-600 pl-4 italic text-purple-300 my-4">
            {line.substring(2)}
          </blockquote>
        )
      } else if (line.trim() && !line.startsWith("---")) {
        // Regular paragraphs
        // Handle inline code with backticks
        const processInlineCode = (text: string) => {
          const parts = text.split('`')
          return parts.map((part, partIndex) => {
            if (partIndex % 2 === 1) {
              // This is code
              return (
                <code key={partIndex} className="bg-gray-900 border border-purple-500/30 px-2 py-1 rounded text-purple-300 font-mono text-sm">
                  {part}
                </code>
              )
            } else {
              // This is regular text
              return <span key={partIndex}>{part}</span>
            }
          })
        }

        result.push(
          <p key={index} className="leading-relaxed my-4 text-gray-300">
            {line.includes('`') ? processInlineCode(line) : line}
          </p>
        )
      }
    })

    return result.filter(Boolean)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-white">
            <DecodingText>Loading...</DecodingText>
          </h1>
          <p className="text-gray-300">
            ▸ <DecodingText>Fetching blog post data...</DecodingText>
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-white">
            <DecodingText>Error</DecodingText>
          </h1>
          <p className="text-gray-300">
            ▸ <DecodingText>{error}</DecodingText>
          </p>
          <Link href="/blog" className="text-purple-300 hover:text-white transition-colors">
            ▸ <DecodingText>back to blog</DecodingText>
          </Link>
        </div>
      </div>
    )
  }

  if (notFound || !post) {
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
              <DecodingText>{`rikjimue@sec:~/blog/${post.slug}$`}</DecodingText>
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
              {renderContent(post.content)}
            </div>
          </div>

          {/* Article Footer with Working Navigation */}
          <footer className="mt-12 pt-8 border-t border-purple-500/30">
            <div className="space-y-6">
              {/* Social sharing or other content */}
              <div className="text-purple-300 text-center">
                <p>▸ Found this helpful? Share it with others.</p>
              </div>
              
              {/* Navigation between posts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Previous Post (Older) */}
                <div className="text-left">
                  {previousPost ? (
                    <Link 
                      href={`/blog/${previousPost.slug}`}
                      className="group block p-4 border border-purple-600/50 rounded hover:bg-purple-950/20 transition-all"
                    >
                      <div className="text-sm text-purple-400 mb-1">
                        ◂ Older Post
                      </div>
                      <div className="text-white group-hover:text-purple-300 transition-colors font-semibold">
                        {previousPost.title}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {previousPost.date}
                      </div>
                    </Link>
                  ) : (
                    <div className="p-4 border border-gray-700/50 rounded opacity-50">
                      <div className="text-sm text-gray-500 mb-1">
                        ◂ No older post
                      </div>
                      <div className="text-gray-500">
                        This is the oldest post
                      </div>
                    </div>
                  )}
                </div>

                {/* Next Post (Newer) */}
                <div className="text-right">
                  {nextPost ? (
                    <Link 
                      href={`/blog/${nextPost.slug}`}
                      className="group block p-4 border border-purple-600/50 rounded hover:bg-purple-950/20 transition-all"
                    >
                      <div className="text-sm text-purple-400 mb-1">
                        Newer Post ▸
                      </div>
                      <div className="text-white group-hover:text-purple-300 transition-colors font-semibold">
                        {nextPost.title}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {nextPost.date}
                      </div>
                    </Link>
                  ) : (
                    <div className="p-4 border border-gray-700/50 rounded opacity-50">
                      <div className="text-sm text-gray-500 mb-1">
                        No newer post ▸
                      </div>
                      <div className="text-gray-500">
                        This is the newest post
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Back to blog link */}
              <div className="text-center pt-4">
                <Link 
                  href="/blog" 
                  className="text-purple-300 hover:text-white transition-colors inline-flex items-center gap-2"
                >
                  <span className="text-purple-400">▸</span>
                  <span>View all posts</span>
                </Link>
              </div>
            </div>
          </footer>
        </article>
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-500/30 p-4 mt-12 backdrop-blur-sm bg-black/80">
        <div className="max-w-4xl mx-auto text-center text-purple-300">
          <p>◈ © 2025 Luke Johnson. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}