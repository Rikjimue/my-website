import { getAllPosts } from '@/lib/blog'
import { NextResponse } from 'next/server'

export async function GET() {
  const posts = getAllPosts().slice(0, 20) // Latest 20 posts
  const siteUrl = 'https://rikjimue.com'
  
  const jsonFeed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: 'Luke Johnson - Security Research Blog',
    description: 'Thoughts, research, and tutorials on cybersecurity and ethical hacking',
    home_page_url: siteUrl,
    feed_url: `${siteUrl}/feed.json`,
    language: 'en-US',
    author: {
      name: 'Luke Johnson',
      email: 'contact@rikjimue.com',
      url: siteUrl
    },
    items: posts.map(post => ({
      id: `${siteUrl}/blog/${post.slug}`,
      title: post.title,
      content_html: post.content.replace(/\n/g, '<br>'), // Basic conversion
      summary: post.excerpt,
      url: `${siteUrl}/blog/${post.slug}`,
      date_published: new Date(post.date).toISOString(),
      tags: post.tags,
      author: {
        name: 'Luke Johnson',
        email: 'contact@rikjimue.com'
      }
    }))
  }

  return NextResponse.json(jsonFeed, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, s-maxage=1200, stale-while-revalidate=600',
    },
  })
}
