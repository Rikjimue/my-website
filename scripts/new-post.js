#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve))

async function createNewPost() {
  console.log('🚀 Creating a new blog post...\n')
  
  try {
    const title = await question('📝 Post title: ')
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
    
    const excerpt = await question('📄 Brief excerpt: ')
    const tagsInput = await question('🏷️  Tags (comma-separated): ')
    const tags = tagsInput.split(',').map(tag => tag.trim()).filter(Boolean)
    
    const publishChoice = await question('📤 Publish immediately? (y/N): ')
    const published = publishChoice.toLowerCase() === 'y'
    
    const date = new Date().toISOString().split('T')[0]
    
    const frontmatter = `---
title: "${title}"
date: "${date}"
readTime: "5 min read"
excerpt: "${excerpt}"
tags: [${tags.map(tag => `"${tag}"`).join(', ')}]
published: ${published}
author: "Luke Johnson"
---

# ${title}

${excerpt}

## Introduction

Write your introduction here...

## Main Content

Your main content goes here.

## Conclusion

Wrap up your thoughts here.
`

    const filename = `${slug}.md`
    const filepath = path.join(process.cwd(), 'content', 'blog', filename)
    
    // Ensure directory exists
    const dir = path.dirname(filepath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    
    // Check if file already exists
    if (fs.existsSync(filepath)) {
      const overwrite = await question(`⚠️  File ${filename} already exists. Overwrite? (y/N): `)
      if (overwrite.toLowerCase() !== 'y') {
        console.log('❌ Cancelled.')
        rl.close()
        return
      }
    }
    
    fs.writeFileSync(filepath, frontmatter)
    
    console.log(`\n✅ Post created successfully!`)
    console.log(`📁 File: ${filepath}`)
    console.log(`🔗 URL: /blog/${slug}`)
    console.log(`📊 Status: ${published ? 'Published' : 'Draft'}`)
    
    if (!published) {
      console.log('\n💡 To publish, set "published: true" in the frontmatter.')
    }
    
  } catch (error) {
    console.error('❌ Error creating post:', error.message)
  }
  
  rl.close()
}

createNewPost()