// Optimized blog page component with layout shift prevention
"use client"

import Link from "next/link"
import { Terminal, ArrowLeft, Calendar, Clock, Search, Tag, Rss } from "lucide-react"
import { useEffect, useState, useRef, useMemo } from "react"
import dynamic from 'next/dynamic'

// Lazy load heavy components
const DecodingText = dynamic(() => import('@/components/DecodingText'), {
  loading: () => <span className="text-decoding opacity-0" style={{ minWidth: '10ch' }}>Loading...</span>,
  ssr: false
})

export interface BlogPost {
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

// Optimized skeleton loader to prevent layout shift
function BlogPostSkeleton() {
  return (
    <article className="border border-purple-500/30 p-6 backdrop-blur-sm bg-black/50 rounded-lg animate-pulse">
      <div className="space-y-3">
        <div className="flex items-center gap-4 text-sm">
          <div className="h-4 bg-purple-900/30 rounded w-20"></div>
          <div className="h-4 bg-purple-900/30 rounded w-16"></div>
        </div>
        <div className="h-6 bg-purple-900/30 rounded w-3/4"></div>
        <div className="h-4 bg-purple-900/30 rounded w-full"></div>
        <div className="flex gap-2">
          <div className="h-6 bg-purple-900/30 rounded w-16"></div>
          <div className="h-6 bg-purple-900/30 rounded w-20"></div>
        </div>
      </div>
    </article>
  )
}

// Optimized blog post component
function OptimizedBlogPost({ post, onTagFilter }: { post: BlogPost; onTagFilter: (tag: string) => void }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <article
      ref={ref}
      className={`border border-purple-500/30 p-6 hover:bg-purple-950/20 transition-colors backdrop-blur-sm bg-black/50 rounded-lg layout-stable ${
        isVisible ? 'fade-in-optimized' : 'opacity-0'
      }`}
      style={{ minHeight: '200px' }} // Reserve space to prevent layout shift
    >
      <div className="space-y-3">
        <div className="flex items-center gap-4 text-sm text-purple-300">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{post.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{post.readTime}</span>
          </div>
        </div>

        <h2 className="text-xl font-bold text-white hover:text-purple-300 cursor-pointer transition-colors">
          <Link 
            href={`/blog/${post.slug}`}
            aria-label={`Read blog post: ${post.title}`}
          >
            {post.title}
          </Link>
        </h2>

        <p className="text-gray-300 break-words">{post.excerpt}</p>

        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagFilter(tag)}
              className="text-xs px-2 py-1 border border-purple-600/50 text-purple-300 hover:border-purple-400 transition-colors"
              aria-label={`Filter posts by ${tag} tag`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
    </article>
  )
}

export default function OptimizedBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Memoized filtered posts to prevent unnecessary re-renders
  const memoizedFilteredPosts = useMemo(() => {
    let filtered = posts

    if (searchQuery.trim()) {
      const lowercaseSearch = searchQuery.toLowerCase()
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(lowercaseSearch) ||
        post.excerpt.toLowerCase().includes(lowercaseSearch) ||
        post.tags.some(t => t.toLowerCase().includes(lowercaseSearch))
      )
    }

    if (selectedTag) {
      filtered = filtered.filter(post => 
        post.tags.map(t => t.toLowerCase()).includes(selectedTag.toLowerCase())
      )
    }

    return filtered
  }, [posts, searchQuery, selectedTag])

  useEffect(() => {
    setFilteredPosts(memoizedFilteredPosts)
  }, [memoizedFilteredPosts])

  useEffect(() => {
    const loadBlogData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch('/api/blog')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        
        setPosts(data.posts || [])
        setAllTags(data.tags || [])
      } catch (error) {
        console.error('Failed to load blog data:', error)
        setError('Failed to load blog posts')
      } finally {
        setIsLoading(false)
      }
    }

    loadBlogData()
  }, [])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleTagFilter = (tag: string | null) => {
    setSelectedTag(tag)
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Header with improved accessibility */}
      <header className="border-b border-purple-500/30 p-4 backdrop-blur-sm bg-black/80">
        <nav className="max-w-4xl mx-auto flex items-center justify-between" role="navigation" aria-label="Blog navigation">
          <div className="flex items-center gap-2">
            <Terminal className="w-6 h-6 text-purple-400" />
            <span className="text-xl font-bold">
              <DecodingText>rikjimue@sec:~/blog$</DecodingText>
            </span>
          </div>
          <Link 
            href="/" 
            className="flex items-center gap-2 hover:text-purple-400 transition-colors"
            aria-label="Return to homepage"
          >
            <ArrowLeft className="w-4 h-4" />
            <DecodingText delay={500}>back to home</DecodingText>
          </Link>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto p-4" id="main-content">
        {/* Page Header with stable layout */}
        <section className="py-8">
          <div className="space-y-4">
            <div className="text-sm text-purple-300">
              <span className="text-white">╭─</span> ls -la blog/
            </div>
            <h1 className="text-3xl font-bold text-white">
              <DecodingText delay={200}>Security Research Blog</DecodingText>
            </h1>
            <p className="text-gray-300 border-l-2 border-purple-600 pl-4">
              <DecodingText delay={400}>Thoughts, homelab, research, and tutorials on cybersecurity</DecodingText>
            </p>
          </div>
        </section>

        {/* Search and Filters with improved accessibility */}
        <section className="mb-8 space-y-4" role="search" aria-label="Blog search and filters">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-black border border-purple-500/30 text-white pl-10 pr-4 py-2 rounded focus:border-purple-400 focus:outline-none"
              aria-describedby="search-help"
              aria-label="Search blog posts"
            />
            <div id="search-help" className="sr-only">
              Search through blog post titles, content, and tags
            </div>
          </div>

          {/* Tag Filters */}
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter posts by tags">
            <button
              onClick={() => handleTagFilter(null)}
              className={`text-xs px-3 py-1 border transition-colors ${
                selectedTag === null 
                  ? 'border-purple-400 text-purple-300 bg-purple-950/20' 
                  : 'border-purple-600/50 text-purple-300 hover:border-purple-400'
              }`}
              aria-pressed={selectedTag === null}
              aria-label="Show all posts"
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
                aria-pressed={selectedTag === tag}
                aria-label={`Filter posts by ${tag} tag`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </section>

        {/* RSS Feed Link with better accessibility */}
        <div className="flex justify-end mb-4">
          <a
            href="/rss.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors text-sm"
            aria-label="Subscribe to RSS feed (opens in new tab)"
          >
            <Rss className="w-4 h-4" aria-hidden="true" />
            <span>RSS Feed</span>
          </a>
        </div>

        {/* Blog Posts with loading states and layout stability */}
        <section className="space-y-6" aria-label="Blog posts">
          {isLoading ? (
            // Loading skeletons to prevent layout shift
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <BlogPostSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8" role="alert">
              <p className="text-red-400">▸ {error}</p>
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="space-y-6">
              {filteredPosts.map((post) => (
                <OptimizedBlogPost 
                  key={post.id} 
                  post={post} 
                  onTagFilter={handleTagFilter}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">▸ No posts found matching your criteria.</p>
              {searchQuery && (
                <button
                  onClick={() => handleSearch("")}
                  className="mt-2 text-purple-300 hover:text-white transition-colors"
                  aria-label="Clear search query"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </section>

        {/* Post Statistics */}
        {!isLoading && !error && (
          <section className="py-8 text-center border-t border-purple-500/30 mt-12" aria-label="Blog statistics">
            <div className="space-y-2">
              <p className="text-purple-300">
                ▸ Showing {filteredPosts.length} of {posts.length} posts
              </p>
              <p className="text-sm text-gray-400">
                Topics: {allTags.length} tags • Latest: {posts[0]?.date}
              </p>
            </div>
          </section>
        )}
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