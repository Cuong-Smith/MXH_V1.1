"use client"

import React from "react"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, Heart, Send, MoreHorizontal, Pause, Play } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSwipe } from "@/hooks/use-swipe"
import type { Story, User } from "@/lib/types"

interface MobileStoryViewerProps {
  stories: Story[]
  users: User[]
  initialStoryIndex?: number
  initialUserIndex?: number
  onClose: () => void
}

export function MobileStoryViewer({
  stories,
  users,
  initialStoryIndex = 0,
  initialUserIndex = 0,
  onClose,
}: MobileStoryViewerProps) {
  // Group stories by user
  const userStories = users.map((user) => ({
    user,
    stories: stories.filter((s) => s.userId === user.id),
  })).filter((us) => us.stories.length > 0)

  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex)
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const [replyText, setReplyText] = useState("")

  const currentUserStories = userStories[currentUserIndex]
  const currentStory = currentUserStories?.stories[currentStoryIndex]
  const currentUser = currentUserStories?.user

  const STORY_DURATION = 5000 // 5 seconds per story

  const goToNextStory = useCallback(() => {
    if (!currentUserStories) return

    if (currentStoryIndex < currentUserStories.stories.length - 1) {
      // Next story of same user
      setCurrentStoryIndex((prev) => prev + 1)
      setProgress(0)
    } else if (currentUserIndex < userStories.length - 1) {
      // Next user's stories
      setCurrentUserIndex((prev) => prev + 1)
      setCurrentStoryIndex(0)
      setProgress(0)
    } else {
      // End of all stories
      onClose()
    }
  }, [currentStoryIndex, currentUserIndex, currentUserStories, userStories.length, onClose])

  const goToPrevStory = useCallback(() => {
    if (currentStoryIndex > 0) {
      // Previous story of same user
      setCurrentStoryIndex((prev) => prev - 1)
      setProgress(0)
    } else if (currentUserIndex > 0) {
      // Previous user's last story
      const prevUserStories = userStories[currentUserIndex - 1]
      setCurrentUserIndex((prev) => prev - 1)
      setCurrentStoryIndex(prevUserStories.stories.length - 1)
      setProgress(0)
    }
  }, [currentStoryIndex, currentUserIndex, userStories])

  const { swipeHandlers } = useSwipe({
    onSwipeLeft: goToNextStory,
    onSwipeRight: goToPrevStory,
    onSwipeDown: onClose,
    threshold: 50,
  })

  // Auto-advance stories
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          goToNextStory()
          return 0
        }
        return prev + (100 / (STORY_DURATION / 100))
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isPaused, goToNextStory])

  // Handle tap on left/right side of screen
  const handleTap = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const width = rect.width

    if (x < width / 3) {
      goToPrevStory()
    } else if (x > (width * 2) / 3) {
      goToNextStory()
    } else {
      setIsPaused((prev) => !prev)
    }
  }

  if (!currentStory || !currentUser) return null

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours < 1) return "Vua xong"
    if (hours < 24) return `${hours} gio truoc`
    return `${Math.floor(hours / 24)} ngay truoc`
  }

  return (
    <div 
      className="fixed inset-0 z-50 bg-black"
      {...swipeHandlers}
    >
      {/* Progress bars */}
      <div className="absolute left-0 right-0 top-0 z-20 flex gap-1 p-2">
        {currentUserStories.stories.map((_, index) => (
          <div
            key={`progress-${currentUser.id}-${index}`}
            className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/30"
          >
            <div
              className="h-full bg-white transition-all duration-100"
              style={{
                width: index < currentStoryIndex ? "100%" : index === currentStoryIndex ? `${progress}%` : "0%",
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between p-4 pt-8">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-white">
            <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
            <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold text-white">{currentUser.name}</p>
            <p className="text-xs text-white/70">{formatTime(currentStory.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={() => setIsPaused((prev) => !prev)}
          >
            {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20"
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Story Content */}
      <div
        className="relative h-full w-full"
        onClick={handleTap}
      >
        {currentStory.image ? (
          <Image
            src={currentStory.image || "/placeholder.svg"}
            alt="Story"
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div 
            className="flex h-full w-full items-center justify-center"
            style={{ backgroundColor: currentStory.backgroundColor || "#1a1a1a" }}
          >
            <p className="max-w-[80%] text-center text-2xl font-bold text-white">
              {currentStory.content}
            </p>
          </div>
        )}

        {/* Text overlay if story has both image and content */}
        {currentStory.image && currentStory.content && (
          <div className="absolute bottom-24 left-0 right-0 p-4">
            <p className="text-center text-lg font-medium text-white drop-shadow-lg">
              {currentStory.content}
            </p>
          </div>
        )}

        {/* Navigation arrows (desktop fallback) */}
        {currentUserIndex > 0 || currentStoryIndex > 0 ? (
          <button
            type="button"
            className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/20 p-2 backdrop-blur-sm md:block"
            onClick={(e) => {
              e.stopPropagation()
              goToPrevStory()
            }}
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
        ) : null}
        {currentUserIndex < userStories.length - 1 || currentStoryIndex < currentUserStories.stories.length - 1 ? (
          <button
            type="button"
            className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/20 p-2 backdrop-blur-sm md:block"
            onClick={(e) => {
              e.stopPropagation()
              goToNextStory()
            }}
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        ) : null}
      </div>

      {/* Reply bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center gap-2 p-4 pb-8">
        <Input
          placeholder="Tra loi..."
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          className="flex-1 border-white/30 bg-transparent text-white placeholder:text-white/50"
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 text-white hover:bg-white/20"
        >
          <Heart className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 text-white hover:bg-white/20"
          disabled={!replyText.trim()}
        >
          <Send className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}
