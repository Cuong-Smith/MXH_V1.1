"use client"

import { useState } from 'react'
import { useNewsfeed } from '@/lib/newsfeed-store'
import { PostComposer } from './post-composer'
import { PostCard } from './post-card'
import { NewsfeedSidebar } from './newsfeed-sidebar'
import { StoryBar } from './story-bar'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Filter, Globe, Lock, Users, Building2 } from 'lucide-react'
import type { Visibility } from '@/lib/types'

export function Newsfeed() {
  const { posts, currentUser } = useNewsfeed()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterVisibility, setFilterVisibility] = useState<Visibility | 'all'>('all')

  const filteredPosts = posts.filter((post) => {
    // Check if user can see the post
    const canSee =
      post.authorId === currentUser.id ||
      post.visibility === 'company' ||
      (post.visibility === 'specific' &&
        post.visibleTo?.includes(currentUser.id)) ||
      (post.visibility === 'department' &&
        post.visibleToDepartments?.includes(currentUser.department.id))

    if (!canSee) return false

    // Check if post is published
    if (!post.isPublished && post.scheduledAt && new Date(post.scheduledAt) > new Date()) {
      // Only show scheduled posts to the author
      if (post.authorId !== currentUser.id) return false
    }

    // Filter by visibility
    if (filterVisibility !== 'all' && post.visibility !== filterVisibility) {
      return false
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        post.content.toLowerCase().includes(query) ||
        post.poll?.question.toLowerCase().includes(query)
      )
    }

    return true
  })

  const sortedPosts = [...filteredPosts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            {/* Story Bar */}
            <StoryBar />

            {/* Filter Bar */}
            <div className="flex items-center gap-3 rounded-xl bg-card p-3 shadow-sm border border-border">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tim kiem bai viet..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-muted border-0"
                />
              </div>
              <Select
                value={filterVisibility}
                onValueChange={(v) => setFilterVisibility(v as Visibility | 'all')}
              >
                <SelectTrigger className="w-40 bg-muted border-0">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Loc" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tat ca</SelectItem>
                  <SelectItem value="company">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Toan cong ty
                    </div>
                  </SelectItem>
                  <SelectItem value="department">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Phong ban
                    </div>
                  </SelectItem>
                  <SelectItem value="specific">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Chi dinh
                    </div>
                  </SelectItem>
                  <SelectItem value="private">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Rieng tu
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <PostComposer />
            {sortedPosts.length > 0 ? (
              sortedPosts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  Khong co bai viet nao.
                </p>
              </div>
            )}
          </div>
          <aside className="hidden lg:block">
            <div className="sticky top-20">
              <NewsfeedSidebar />
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
