import { getAllPosts } from '@/lib/blog'
import { NextResponse } from 'next/server'

export async function GET() {
  const posts = getAllPosts().slice(0, 20)
  const siteUrl = 'https://rikjimue.com'
  
  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Luke Johnson - Security Research Blog</title>
    <description>Thoughts, research, and tutorials on cybersecurity and ethical hacking</description>
    <link>${siteUrl}</link>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <managingEditor>contact@rikjimue.com (Luke Johnson)</managingEditor>
    <webMaster>contact@rikjimue.com (Luke Johnson)</webMaster>
    <category>Technology</category>
    <category>Cybersecurity</category>
    <category>Security Research</category>
    <ttl>1440</ttl>
    
    ${posts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt}]]></description>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <author>contact@rikjimue.com (Luke Johnson)</author>
      ${post.tags.map(tag => `<category>${tag}</category>`).join('\n      ')}
    </item>`).join('')}
  </channel>
</rss>`

  return new NextResponse(rssXml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=1200, stale-while-revalidate=600',
    },
  })
}