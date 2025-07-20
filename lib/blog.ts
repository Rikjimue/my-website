import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

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

const postsDirectory = path.join(process.cwd(), 'content/blog')

// Get all blog posts with metadata
export function getAllPosts(): BlogPost[] {
  try {
    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => {
        const slug = fileName.replace(/\.md$/, '')
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data, content } = matter(fileContents)

        return {
          id: slug,
          slug,
          content,
          title: data.title || 'Untitled',
          date: data.date || new Date().toISOString().split('T')[0],
          readTime: data.readTime || '5 min read',
          excerpt: data.excerpt || content.substring(0, 150) + '...',
          tags: data.tags || [],
          published: data.published !== false, // Default to true
        } as BlogPost
      })
      .filter(post => post.published)
      .sort((a, b) => (a.date > b.date ? -1 : 1))

    return allPostsData
  } catch (error) {
    console.error('Error reading blog posts:', error)
    return []
  }
}

// Get a single blog post by slug
export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      id: slug,
      slug,
      content,
      title: data.title || 'Untitled',
      date: data.date || new Date().toISOString().split('T')[0],
      readTime: data.readTime || '5 min read',
      excerpt: data.excerpt || content.substring(0, 150) + '...',
      tags: data.tags || [],
      published: data.published !== false,
    } as BlogPost
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error)
    return null
  }
}

// Get all unique tags
export function getAllTags(): string[] {
  const posts = getAllPosts()
  const tags = posts.flatMap(post => post.tags)
  return [...new Set(tags)].sort()
}

// Get posts by tag
export function getPostsByTag(tag: string): BlogPost[] {
  return getAllPosts().filter(post => 
    post.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase())
  )
}

// Search posts
export function searchPosts(query: string): BlogPost[] {
  const posts = getAllPosts()
  const lowercaseQuery = query.toLowerCase()
  
  return posts.filter(post => 
    post.title.toLowerCase().includes(lowercaseQuery) ||
    post.excerpt.toLowerCase().includes(lowercaseQuery) ||
    post.content.toLowerCase().includes(lowercaseQuery) ||
    post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}

// Generate RSS feed data
export function generateRSSData() {
  const posts = getAllPosts().slice(0, 10) // Latest 10 posts
  return {
    title: "Luke Johnson's Security Blog",
    description: "Thoughts, research, and tutorials on cybersecurity and ethical hacking",
    posts
  }
}