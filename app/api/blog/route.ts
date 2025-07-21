import { getAllPosts, getAllTags } from '@/lib/blog';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const posts = getAllPosts();
    const tags = getAllTags();
    
    return NextResponse.json({ posts, tags });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load blog data' }, { status: 500 });
  }
}