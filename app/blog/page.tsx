"use client"

import Link from "next/link"
import { Terminal, ArrowLeft, Calendar, Clock, Search, Tag } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { getAllPosts, getAllTags, searchPosts, type BlogPost } from "@/lib/blog"

// Word-based decoding text animation (same as homepage)
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

interface BlogPageProps {
  initialPosts: BlogPost[]
  allTags: string[]
}

export default function BlogPage({ initialPosts, allTags }: BlogPageProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Handle search
  const handleSearch = async (query: string) => {
    setIsLoading(true)
    setSearchQuery(query)
    
    if (query.trim() === "") {
      setPosts(initialPosts)
    } else {
      try {
        const results = await searchPosts(query)
        setPosts(results)
      } catch (error) {
        console.error('Search failed:', error)
        setPosts([])
      }
    }
    setIsLoading(false)
  }

  // Handle tag filtering
  const handleTagFilter = (tag: string | null) => {
    setSelectedTag(tag)
    if (tag === null) {
      setPosts(initialPosts)
    } else {
      setPosts(initialPosts.filter(post => 
        post.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase())
      ))
    }
  }

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
            <DecodingText delay={500}>back to home</DecodingText>
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
            <h1 className="text-3xl font-bold text-white">
              <DecodingText delay={200}>Security Research Blog</DecodingText>
            </h1>
            <p className="text-gray-300 border-l-2 border-purple-600 pl-4">
              ▸ <DecodingText delay={400}>Thoughts, research, and tutorials on cybersecurity and ethical hacking</DecodingText>
            </p>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-black border border-purple-500/30 text-white pl-10 pr-4 py-2 rounded focus:border-purple-400 focus:outline-none"
            />
          </div>

          {/* Tag Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleTagFilter(null)}
              className={`text-xs px-3 py-1 border transition-colors ${
                selectedTag === null 
                  ? 'border-purple-400 text-purple-300 bg-purple-950/20' 
                  : 'border-purple-600/50 text-purple-300 hover:border-purple-400'
              }`}
            >
              All Posts
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagFilter(tag)}
                className={`text-xs px-3 py-1 border transition-colors ${
                  selectedTag === tag 
                    ? 'border-purple-400 text-purple-300 bg-purple-950/20' 
                    : 'border-purple-600/50 text-purple-300 hover:border-purple-400'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </section>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <p className="text-purple-300">▸ Searching...</p>
          </div>
        )}

        {/* Blog Posts */}
        <section className="space-y-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <article
                key={post.id}
                className="border border-purple-500/30 p-6 hover:bg-purple-950/20 transition-colors backdrop-blur-sm bg-black/50 rounded-lg"
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
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>

                  <p className="text-gray-300">▸ {post.excerpt}</p>

                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleTagFilter(tag)}
                        className="text-xs px-2 py-1 border border-purple-600/50 text-purple-300 hover:border-purple-400 transition-colors"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">▸ No posts found matching your criteria.</p>
              {searchQuery && (
                <button
                  onClick={() => handleSearch("")}
                  className="mt-2 text-purple-300 hover:text-white transition-colors"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </section>

        {/* Post Statistics */}
        <section className="py-8 text-center border-t border-purple-500/30 mt-12">
          <div className="space-y-2">
            <p className="text-purple-300">
              ▸ Showing {posts.length} of {initialPosts.length} posts
            </p>
            <p className="text-sm text-gray-400">
              Topics: {allTags.length} tags • Latest: {initialPosts[0]?.date}
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-500/30 p-4 mt-12 backdrop-blur-sm bg-black/80">
        <div className="max-w-4xl mx-auto text-center text-purple-300">
          <p>◈ © 2025 Luke Johnson. All rights reserved.</p>
          <p className="text-sm mt-2">▸ Built with Next.js and hacker aesthetics</p>
        </div>
      </footer>
    </div>
  )
}

// This would be used with Next.js getStaticProps or similar
export async function getStaticProps() {
  const posts = getAllPosts()
  const tags = getAllTags()
  
  return {
    props: {
      initialPosts: posts,
      allTags: tags,
    },
    revalidate: 60, // Regenerate every minute
  }
}