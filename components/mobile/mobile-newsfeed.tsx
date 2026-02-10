"use client"

import { TabsTrigger } from "@/components/ui/tabs"
import { TabsList } from "@/components/ui/tabs"
import { Tabs } from "@/components/ui/tabs"
import { useState, useRef, useCallback } from "react"
import { RefreshCw } from "lucide-react"
import { useNewsfeed } from "@/lib/newsfeed-store"
import { usePullToRefresh } from "@/hooks/use-pull-to-refresh"
import { MobileStoryBar } from "./mobile-story-bar"
import { MobilePostCard } from "./mobile-post-card"
import { MobilePostComposer } from "./mobile-post-composer"

type FeedFilter = "all" | "following" | "department";

export function MobileNewsfeed() {
  const { posts, currentUser } = useNewsfeed()
  const containerRef = useRef<HTMLDivElement>(null)
  const [feedFilter, setFeedFilter] = useState<FeedFilter>("all");

  const handleRefresh = useCallback(async () => {
    // Simulate refresh - in real app, this would fetch new data
    await new Promise((resolve) => setTimeout(resolve, 1500))
  }, [])

  const { pullHandlers, isRefreshing, pullDistance, isPulling } = usePullToRefresh({
    onRefresh: handleRefresh,
    containerRef,
  })

  const filteredPosts = posts.filter((post) => {
    // Check if user can see the post
    const canSee =
      post.authorId === currentUser.id ||
      post.visibility === "company" ||
      (post.visibility === "specific" &&
        post.visibleTo?.includes(currentUser.id)) ||
      (post.visibility === "department" &&
        post.visibleToDepartments?.includes(currentUser.department.id))

    if (!canSee) return false

    // Check if post is published
    if (!post.isPublished && post.scheduledAt && new Date(post.scheduledAt) > new Date()) {
      if (post.authorId !== currentUser.id) return false
    }

    return true
  })

  const sortedPosts = [...filteredPosts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-muted/30"
      {...pullHandlers}
    >
      {/* Pull to Refresh Indicator */}
      <div
        className="flex items-center justify-center overflow-hidden transition-all duration-200"
        style={{ height: isPulling || isRefreshing ? Math.max(pullDistance, isRefreshing ? 60 : 0) : 0 }}
      >
        <div className={`flex items-center gap-2 ${isRefreshing ? "animate-pulse" : ""}`}>
          <RefreshCw 
            className={`h-5 w-5 text-primary transition-transform ${isRefreshing ? "animate-spin" : ""}`}
            style={{ transform: !isRefreshing ? `rotate(${pullDistance * 3}deg)` : undefined }}
          />
          <span className="text-sm text-muted-foreground">
            {isRefreshing ? "Dang tai lai..." : pullDistance > 60 ? "Tha de tai lai" : "Keo xuong de tai lai"}
          </span>
        </div>
      </div>

      {/* Stories */}
      <MobileStoryBar />

      {/* Post Feed */}

      {/* Post Composer */}
      <MobilePostComposer />

      {/* Posts Feed */}
      <div className="space-y-2 pb-20">
        {sortedPosts.length > 0 ? (
          sortedPosts.map((post) => <MobilePostCard key={post.id} post={post} />)
        ) : (
          <div className="py-12 text-center bg-background">
            <p className="text-muted-foreground">Khong co bai viet nao.</p>
          </div>
        )}
      </div>
    </div>
  )
}
