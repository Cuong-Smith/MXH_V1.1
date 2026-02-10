'use client'

import React from "react"

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { X, ChevronLeft, ChevronRight, Heart, Send, MoreHorizontal, Pause, Play } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { initialStories, users, currentUser } from '@/lib/mock-data'
import type { Story, User } from '@/lib/types'

export default function StoryPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string

  const userStoriesData = initialStories.filter(s => s.authorId === userId)
  const storyAuthor = users.find(u => u.id === userId)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const [replyText, setReplyText] = useState('')
  const [showMore, setShowMore] = useState(false)

  const currentStory = userStoriesData[currentIndex]
  const STORY_DURATION = 5000

  const goToNext = useCallback(() => {
    if (currentIndex < userStoriesData.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setProgress(0)
    } else {
      router.back()
    }
  }, [currentIndex, userStoriesData.length, router])

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
      setProgress(0)
    }
  }, [currentIndex])

  // Auto-advance stories
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          goToNext()
          return 0
        }
        return prev + (100 / (STORY_DURATION / 100))
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isPaused, goToNext])

  const handleTap = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const width = rect.width

    if (x < width / 3) {
      goToPrev()
    } else if (x > (width * 2) / 3) {
      goToNext()
    } else {
      setIsPaused(prev => !prev)
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours < 1) return 'Vua xong'
    if (hours < 24) return `${hours} gio truoc`
    return `${Math.floor(hours / 24)} ngay truoc`
  }

  if (!currentStory || !storyAuthor) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Progress bars */}
      <div className="absolute left-0 right-0 top-0 z-20 flex gap-1 p-2">
        {userStoriesData.map((_, index) => (
          <div
            key={`progress-${index}`}
            className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/30"
          >
            <div
              className="h-full bg-white transition-all duration-100"
              style={{
                width:
                  index < currentIndex ? '100%' : index === currentIndex ? `${progress}%` : '0%',
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between p-4 pt-8">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-white">
            <AvatarImage src={storyAuthor.avatar || '/placeholder.svg'} alt={storyAuthor.name} />
            <AvatarFallback>{storyAuthor.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold text-white">{storyAuthor.name}</p>
            <p className="text-xs text-white/70">{formatTime(currentStory.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={() => setIsPaused(prev => !prev)}
          >
            {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={() => setShowMore(!showMore)}
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={() => router.back()}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Story Content */}
      <div className="relative h-full w-full" onClick={handleTap}>
        {currentStory.media.type === 'image' ? (
          <img
            src={currentStory.media.url || '/placeholder.svg'}
            alt="Story"
            className="h-full w-full object-cover"
          />
        ) : (
          <video
            src={currentStory.media.url}
            className="h-full w-full object-cover"
            autoPlay
            loop
          />
        )}

        {/* Text overlay */}
        {currentStory.text && (
          <div
            className="absolute bottom-24 left-0 right-0 p-4"
            style={{
              color: currentStory.textColor || '#ffffff',
            }}
          >
            <p className="text-center text-lg font-medium drop-shadow-lg">
              {currentStory.text}
            </p>
          </div>
        )}

        {/* Navigation arrows */}
        {currentIndex > 0 && (
          <button
            type="button"
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 backdrop-blur-sm hover:bg-white/30 transition-colors"
            onClick={e => {
              e.stopPropagation()
              goToPrev()
            }}
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
        )}
        {currentIndex < userStoriesData.length - 1 && (
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 backdrop-blur-sm hover:bg-white/30 transition-colors"
            onClick={e => {
              e.stopPropagation()
              goToNext()
            }}
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        )}
      </div>

      {/* Reply bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center gap-2 p-4 pb-8">
        <Input
          placeholder="Tra loi..."
          value={replyText}
          onChange={e => setReplyText(e.target.value)}
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
