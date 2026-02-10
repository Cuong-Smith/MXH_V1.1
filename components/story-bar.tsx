"use client"

import { useRouter } from "next/navigation"

import { useState, useRef, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Heart,
  Send,
  Eye,
  Trash2,
  Star,
  Globe,
  Lock,
  Users,
  Building2,
  ImageIcon,
  Video,
  Pause,
  Play,
  MessageCircle,
  MoreHorizontal,
  Bookmark,
  UserPlus
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Story, Visibility, User, StoryHighlight } from '@/lib/types'
import { users, currentUser, departments, storyReactionEmojis, initialStories, initialStoryHighlights } from '@/lib/mock-data'

// Group stories by user
function groupStoriesByUser(stories: Story[], currentUserId: string) {
  const activeStories = stories.filter(s => new Date(s.expiresAt) > new Date())
  const grouped = new Map<string, Story[]>()
  
  activeStories.forEach(story => {
    // Check visibility
    const canSee = 
      story.authorId === currentUserId ||
      story.visibility === 'company' ||
      (story.visibility === 'specific' && story.visibleTo?.includes(currentUserId)) ||
      (story.visibility === 'department' && story.visibleToDepartments?.includes(currentUser.department.id))
    
    if (canSee) {
      const existing = grouped.get(story.authorId) || []
      grouped.set(story.authorId, [...existing, story])
    }
  })
  
  return grouped
}

// Check if user has viewed all stories
function hasViewedAll(stories: Story[], userId: string) {
  return stories.every(s => s.views.some(v => v.userId === userId))
}

export function StoryBar() {
  const router = useRouter()
  const [stories, setStories] = useState<Story[]>(initialStories)
  const [highlights, setHighlights] = useState<StoryHighlight[]>(initialStoryHighlights)
  const [isCreating, setIsCreating] = useState(false)
  const [showMyStories, setShowMyStories] = useState(false)
  const [viewingStory, setViewingStory] = useState<{ user: User, stories: Story[], index: number } | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  
  const groupedStories = groupStoriesByUser(stories, currentUser.id)
  const userStories = Array.from(groupedStories.entries()).map(([userId, userStories]) => ({
    user: users.find(u => u.id === userId)!,
    stories: userStories.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  })).filter(item => item.user)

  // Put current user first if they have stories
  const currentUserStories = userStories.find(item => item.user.id === currentUser.id)
  const otherUserStories = userStories.filter(item => item.user.id !== currentUser.id)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const openStory = (user: User) => {
    router.push(`/story/${user.id}`)
  }

  const handleCreateStory = (newStory: Story) => {
    setStories(prev => [newStory, ...prev])
    setIsCreating(false)
  }

  const handleDeleteStory = (storyId: string) => {
    setStories(prev => prev.filter(s => s.id !== storyId))
    if (viewingStory) {
      const remaining = viewingStory.stories.filter(s => s.id !== storyId)
      if (remaining.length === 0) {
        setViewingStory(null)
      } else {
        setViewingStory({
          ...viewingStory,
          stories: remaining,
          index: Math.min(viewingStory.index, remaining.length - 1)
        })
      }
    }
  }

  const handleReactToStory = (storyId: string, emoji: string) => {
    setStories(prev => prev.map(s => {
      if (s.id === storyId) {
        const existingReaction = s.reactions.find(r => r.userId === currentUser.id)
        if (existingReaction) {
          return {
            ...s,
            reactions: s.reactions.map(r => 
              r.userId === currentUser.id ? { ...r, emoji } : r
            )
          }
        }
        return {
          ...s,
          reactions: [...s.reactions, {
            id: `sr-${Date.now()}`,
            userId: currentUser.id,
            emoji,
            createdAt: new Date()
          }]
        }
      }
      return s
    }))
  }

  const handleReplyToStory = (storyId: string, message: string) => {
    setStories(prev => prev.map(s => {
      if (s.id === storyId) {
        return {
          ...s,
          replies: [...s.replies, {
            id: `srp-${Date.now()}`,
            userId: currentUser.id,
            message,
            createdAt: new Date()
          }]
        }
      }
      return s
    }))
  }

  const handleViewStory = (storyId: string) => {
    setStories(prev => prev.map(s => {
      if (s.id === storyId && !s.views.some(v => v.userId === currentUser.id)) {
        return {
          ...s,
          views: [...s.views, { userId: currentUser.id, viewedAt: new Date() }]
        }
      }
      return s
    }))
  }

  const handleSaveHighlight = (storyId: string, highlightName: string) => {
    setStories(prev => prev.map(s => {
      if (s.id === storyId) {
        return { ...s, isHighlight: true, highlightName }
      }
      return s
    }))

    // Create or update highlight
    setHighlights(prev => {
      const existing = prev.find(h => h.name === highlightName && h.userId === currentUser.id)
      if (existing) {
        return prev.map(h => 
          h.id === existing.id 
            ? { ...h, storyIds: [...h.storyIds, storyId] }
            : h
        )
      }
      return [...prev, {
        id: `highlight-${Date.now()}`,
        userId: currentUser.id,
        name: highlightName,
        coverStoryId: storyId,
        storyIds: [storyId],
        createdAt: new Date()
      }]
    })
  }

  return (
    <div className="relative rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Story</h3>
        <Dialog open={showMyStories} onOpenChange={setShowMyStories}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-xs">
              Story cua toi
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Story cua toi</DialogTitle>
              <DialogDescription>Quan ly cac story ban da dang</DialogDescription>
            </DialogHeader>
            <MyStoriesView 
              stories={stories.filter(s => s.authorId === currentUser.id)}
              highlights={highlights.filter(h => h.userId === currentUser.id)}
              onDelete={handleDeleteStory}
              onSaveHighlight={handleSaveHighlight}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute -left-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-background shadow-md"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div
          ref={scrollRef}
          className="scrollbar-hide flex gap-3 overflow-x-auto scroll-smooth px-4"
        >
          {/* Create Story Button */}
          <button
            onClick={() => router.push('/create-story')}
            className="flex flex-shrink-0 flex-col items-center gap-2 hover:opacity-80 transition"
          >
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/60">
              <Plus className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="w-16 truncate text-center text-xs font-medium">
              Tao story
            </span>
          </button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-background shadow-md"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Dialog for creating a new story */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="text-xs">
            Tao Story moi
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Tao Story moi</DialogTitle>
            <DialogDescription>Chia se khoang khac cua ban voi dong nghiep</DialogDescription>
          </DialogHeader>
          <CreateStoryForm onSubmit={handleCreateStory} onCancel={() => setIsCreating(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Story Avatar Component
function StoryAvatar({ 
  user, 
  stories, 
  hasViewed, 
  onClick, 
  isCurrentUser = false 
}: { 
  user: User
  stories: Story[]
  hasViewed: boolean
  onClick: () => void
  isCurrentUser?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-shrink-0 flex-col items-center gap-2"
    >
      <div className={cn(
        "rounded-full p-[3px]",
        hasViewed 
          ? "bg-muted" 
          : "bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600"
      )}>
        <div className="rounded-full bg-background p-[2px]">
          <Avatar className="h-14 w-14">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <span className="w-16 truncate text-center text-xs font-medium">
        {isCurrentUser ? 'Story cua ban' : user.name.split(' ').pop()}
      </span>
    </button>
  )
}

// Create Story Form
function CreateStoryForm({ 
  onSubmit, 
  onCancel 
}: { 
  onSubmit: (story: Story) => void
  onCancel: () => void
}) {
  const [mediaUrl, setMediaUrl] = useState('')
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image')
  const [text, setText] = useState('')
  const [textColor, setTextColor] = useState('#ffffff')
  const [bgColor, setBgColor] = useState('')
  const [visibility, setVisibility] = useState<Visibility>('company')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [selectedDepts, setSelectedDepts] = useState<string[]>([])
  const [taggedUsers, setTaggedUsers] = useState<string[]>([])

  const handleSubmit = () => {
    if (!mediaUrl) return

    const story: Story = {
      id: `story-${Date.now()}`,
      authorId: currentUser.id,
      media: {
        id: `sm-${Date.now()}`,
        type: mediaType,
        url: mediaUrl,
      },
      text: text || undefined,
      textPosition: text ? { x: 50, y: 85 } : undefined,
      textColor,
      backgroundColor: bgColor || undefined,
      visibility,
      visibleTo: visibility === 'specific' ? selectedUsers : undefined,
      visibleToDepartments: visibility === 'department' ? selectedDepts : undefined,
      taggedUsers,
      reactions: [],
      replies: [],
      views: [],
      isHighlight: false,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    }

    onSubmit(story)
  }

  const sampleImages = [
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80',
  ]

  return (
    <div className="space-y-4">
      {/* Media Type Selection */}
      <div className="flex gap-2">
        <Button
          variant={mediaType === 'image' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMediaType('image')}
        >
          <ImageIcon className="mr-2 h-4 w-4" />
          Hinh anh
        </Button>
        <Button
          variant={mediaType === 'video' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMediaType('video')}
        >
          <Video className="mr-2 h-4 w-4" />
          Video
        </Button>
      </div>

      {/* Sample Images */}
      <div className="grid grid-cols-4 gap-2">
        {sampleImages.map((url, i) => (
          <button
            key={i}
            onClick={() => setMediaUrl(url)}
            className={cn(
              "aspect-square overflow-hidden rounded-lg border-2 transition-all",
              mediaUrl === url ? "border-primary" : "border-transparent"
            )}
          >
            <img src={url || "/placeholder.svg"} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      {/* Or enter URL */}
      <div>
        <Label>URL hinh anh/video</Label>
        <Input
          value={mediaUrl}
          onChange={(e) => setMediaUrl(e.target.value)}
          placeholder="Nhap URL hoac chon tu tren"
        />
      </div>

      {/* Preview */}
      {mediaUrl && (
        <div className="relative aspect-[9/16] max-h-64 overflow-hidden rounded-lg">
          {mediaType === 'image' ? (
            <img src={mediaUrl || "/placeholder.svg"} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <video src={mediaUrl} className="h-full w-full object-cover" />
          )}
          {text && (
            <div 
              className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-lg px-3 py-1"
              style={{ backgroundColor: bgColor || 'rgba(0,0,0,0.5)', color: textColor }}
            >
              {text}
            </div>
          )}
        </div>
      )}

      {/* Text overlay */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Chu tren story</Label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Them chu..."
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <div>
            <Label>Mau chu</Label>
            <Input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="h-8 w-full"
            />
          </div>
          <div>
            <Label>Mau nen chu</Label>
            <Input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="h-8 w-full"
            />
          </div>
        </div>
      </div>

      {/* Visibility */}
      <div>
        <Label>Ai co the xem?</Label>
        <Select value={visibility} onValueChange={(v) => setVisibility(v as Visibility)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
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
                Chi dinh nguoi xem
              </div>
            </SelectItem>
            <SelectItem value="private">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Chi minh toi
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Specific users selection */}
      {visibility === 'specific' && (
        <div>
          <Label>Chon nguoi xem</Label>
          <ScrollArea className="h-32 rounded-md border p-2">
            {users.filter(u => u.id !== currentUser.id).map(user => (
              <div key={user.id} className="flex items-center gap-2 py-1">
                <Checkbox
                  checked={selectedUsers.includes(user.id)}
                  onCheckedChange={(checked) => {
                    setSelectedUsers(prev => 
                      checked 
                        ? [...prev, user.id]
                        : prev.filter(id => id !== user.id)
                    )
                  }}
                />
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{user.name}</span>
              </div>
            ))}
          </ScrollArea>
        </div>
      )}

      {/* Department selection */}
      {visibility === 'department' && (
        <div>
          <Label>Chon phong ban</Label>
          <ScrollArea className="h-32 rounded-md border p-2">
            {departments.map(dept => (
              <div key={dept.id} className="flex items-center gap-2 py-1">
                <Checkbox
                  checked={selectedDepts.includes(dept.id)}
                  onCheckedChange={(checked) => {
                    setSelectedDepts(prev => 
                      checked 
                        ? [...prev, dept.id]
                        : prev.filter(id => id !== dept.id)
                    )
                  }}
                />
                <span className="text-sm">{dept.name}</span>
              </div>
            ))}
          </ScrollArea>
        </div>
      )}

      {/* Tag users */}
      <div>
        <Label>Tag dong nghiep</Label>
        <ScrollArea className="h-24 rounded-md border p-2">
          {users.filter(u => u.id !== currentUser.id).map(user => (
            <div key={user.id} className="flex items-center gap-2 py-1">
              <Checkbox
                checked={taggedUsers.includes(user.id)}
                onCheckedChange={(checked) => {
                  setTaggedUsers(prev => 
                    checked 
                      ? [...prev, user.id]
                      : prev.filter(id => id !== user.id)
                  )
                }}
              />
              <Avatar className="h-6 w-6">
                <AvatarImage src={user.avatar || "/placeholder.svg"} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm">{user.name}</span>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Huy</Button>
        <Button onClick={handleSubmit} disabled={!mediaUrl}>
          Dang Story
        </Button>
      </div>
    </div>
  )
}

// Story Viewer Component
function StoryViewer({
  user,
  stories,
  currentIndex,
  onClose,
  onNext,
  onPrev,
  onReact,
  onReply,
  onView,
  onDelete,
  onSaveHighlight,
}: {
  user: User
  stories: Story[]
  currentIndex: number
  onClose: () => void
  onNext: () => void
  onPrev: () => void
  onReact: (storyId: string, emoji: string) => void
  onReply: (storyId: string, message: string) => void
  onView: (storyId: string) => void
  onDelete?: (storyId: string) => void
  onSaveHighlight?: (storyId: string, name: string) => void
}) {
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const [replyText, setReplyText] = useState('')
  const [showViewers, setShowViewers] = useState(false)
  const [showHighlightDialog, setShowHighlightDialog] = useState(false)
  const [highlightName, setHighlightName] = useState('')
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  
  const story = stories[currentIndex]
  const isOwner = user.id === currentUser.id

  // Mark as viewed
  useEffect(() => {
    if (story && !isOwner) {
      onView(story.id)
    }
  }, [story, isOwner, onView])

  // Auto progress
  useEffect(() => {
    if (isPaused) return

    const duration = 5000 // 5 seconds per story
    const interval = 50
    const step = (interval / duration) * 100

    timerRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          onNext()
          return 0
        }
        return prev + step
      })
    }, interval)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPaused, currentIndex, onNext])

  // Reset progress when story changes
  useEffect(() => {
    setProgress(0)
  }, [currentIndex])

  const formatTime = (date: Date) => {
    const diff = Date.now() - new Date(date).getTime()
    const hours = Math.floor(diff / 3600000)
    if (hours < 1) return 'Vua xong'
    if (hours < 24) return `${hours}h truoc`
    return `${Math.floor(hours / 24)}d truoc`
  }

  const handleSendReply = () => {
    if (replyText.trim()) {
      onReply(story.id, replyText)
      setReplyText('')
    }
  }

  const taggedUsersList = story.taggedUsers.map(id => users.find(u => u.id === id)).filter(Boolean)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-4 text-white hover:bg-white/20"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Navigation */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
        onClick={onPrev}
        disabled={currentIndex === 0}
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
        onClick={onNext}
      >
        <ChevronRight className="h-8 w-8" />
      </Button>

      {/* Story Content */}
      <div className="relative h-[80vh] w-[400px] max-w-[90vw] overflow-hidden rounded-xl bg-black">
        {/* Progress bars */}
        <div className="absolute left-0 right-0 top-0 z-10 flex gap-1 p-2">
          {stories.map((_, i) => (
            <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-white/30">
              <div
                className="h-full bg-white transition-all"
                style={{
                  width: i < currentIndex ? '100%' : i === currentIndex ? `${progress}%` : '0%'
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute left-0 right-0 top-4 z-10 flex items-center justify-between px-4 pt-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-white">
              <AvatarImage src={user.avatar || "/placeholder.svg"} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-white">{user.name}</p>
              <p className="text-xs text-white/70">{formatTime(story.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => setIsPaused(!isPaused)}
            >
              {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
            </Button>
            {isOwner && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={() => setShowViewers(true)}
                >
                  <Eye className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={() => setShowHighlightDialog(true)}
                >
                  <Bookmark className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={() => onDelete?.(story.id)}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Media */}
        {story.media.type === 'image' ? (
          <img
            src={story.media.url || "/placeholder.svg"}
            alt=""
            className="h-full w-full object-cover"
            onClick={() => setIsPaused(!isPaused)}
          />
        ) : (
          <video
            src={story.media.url}
            className="h-full w-full object-cover"
            autoPlay
            loop
            muted
            onClick={() => setIsPaused(!isPaused)}
          />
        )}

        {/* Text overlay */}
        {story.text && (
          <div
            className="absolute left-1/2 -translate-x-1/2 rounded-lg px-4 py-2"
            style={{
              top: `${story.textPosition?.y || 85}%`,
              backgroundColor: story.backgroundColor || 'rgba(0,0,0,0.6)',
              color: story.textColor || '#ffffff',
            }}
          >
            <p className="whitespace-pre-wrap text-center font-medium">{story.text}</p>
          </div>
        )}

        {/* Tagged users */}
        {taggedUsersList.length > 0 && (
          <div className="absolute bottom-24 left-4 flex items-center gap-1">
            <UserPlus className="h-4 w-4 text-white" />
            <div className="flex -space-x-2">
              {taggedUsersList.slice(0, 3).map(u => (
                <Avatar key={u!.id} className="h-6 w-6 border-2 border-black">
                  <AvatarImage src={u!.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{u!.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            {taggedUsersList.length > 3 && (
              <span className="text-xs text-white">+{taggedUsersList.length - 3}</span>
            )}
          </div>
        )}

        {/* Reactions display */}
        {story.reactions.length > 0 && (
          <div className="absolute bottom-24 right-4 flex items-center gap-1 rounded-full bg-black/50 px-2 py-1">
            {Array.from(new Set(story.reactions.map(r => r.emoji))).slice(0, 3).map((emoji, i) => (
              <span key={i}>{emoji}</span>
            ))}
            <span className="ml-1 text-xs text-white">{story.reactions.length}</span>
          </div>
        )}

        {/* Footer - React & Reply */}
        {!isOwner && (
          <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
            <div className="flex gap-1 rounded-full bg-black/50 p-1">
              {storyReactionEmojis.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => onReact(story.id, emoji)}
                  className="rounded-full p-1 transition-transform hover:scale-125"
                >
                  {emoji}
                </button>
              ))}
            </div>
            <div className="flex flex-1 items-center gap-2 rounded-full bg-black/50 px-3 py-1">
              <Input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Tra loi..."
                className="flex-1 border-0 bg-transparent text-sm text-white placeholder:text-white/50 focus-visible:ring-0"
                onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white"
                onClick={handleSendReply}
                disabled={!replyText.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* View count for owner */}
        {isOwner && (
          <div className="absolute bottom-4 left-4 right-4">
            <button
              onClick={() => setShowViewers(true)}
              className="flex items-center gap-2 rounded-full bg-black/50 px-4 py-2 text-white"
            >
              <Eye className="h-4 w-4" />
              <span className="text-sm">{story.views.length} luot xem</span>
            </button>
          </div>
        )}
      </div>

      {/* Viewers Dialog */}
      <Dialog open={showViewers} onOpenChange={setShowViewers}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nguoi da xem ({story.views.length})</DialogTitle>
            <DialogDescription>Danh sach nguoi da xem story cua ban</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-64">
            {story.views.map(view => {
              const viewer = users.find(u => u.id === view.userId)
              const reaction = story.reactions.find(r => r.userId === view.userId)
              return viewer ? (
                <div key={view.userId} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={viewer.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{viewer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{viewer.name}</p>
                      <p className="text-sm text-muted-foreground">{formatTime(view.viewedAt)}</p>
                    </div>
                  </div>
                  {reaction && <span className="text-xl">{reaction.emoji}</span>}
                </div>
              ) : null
            })}
            {story.views.length === 0 && (
              <p className="py-8 text-center text-muted-foreground">Chua co ai xem story nay</p>
            )}
          </ScrollArea>
          {story.replies.length > 0 && (
            <>
              <h4 className="mt-4 font-semibold">Tra loi ({story.replies.length})</h4>
              <ScrollArea className="h-32">
                {story.replies.map(reply => {
                  const replier = users.find(u => u.id === reply.userId)
                  return replier ? (
                    <div key={reply.id} className="flex items-start gap-3 py-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={replier.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{replier.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{replier.name}</p>
                        <p className="text-sm">{reply.message}</p>
                      </div>
                    </div>
                  ) : null
                })}
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Save Highlight Dialog */}
      <Dialog open={showHighlightDialog} onOpenChange={setShowHighlightDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Luu vao Story noi bat</DialogTitle>
            <DialogDescription>Story noi bat se duoc luu lai va hien thi tren trang ca nhan cua ban</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Ten highlight</Label>
              <Input
                value={highlightName}
                onChange={(e) => setHighlightName(e.target.value)}
                placeholder="VD: Work, Travel, Team..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowHighlightDialog(false)}>Huy</Button>
              <Button
                onClick={() => {
                  if (highlightName.trim() && onSaveHighlight) {
                    onSaveHighlight(story.id, highlightName)
                    setShowHighlightDialog(false)
                    setHighlightName('')
                  }
                }}
                disabled={!highlightName.trim()}
              >
                <Star className="mr-2 h-4 w-4" />
                Luu Highlight
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// My Stories View
function MyStoriesView({
  stories,
  highlights,
  onDelete,
  onSaveHighlight,
}: {
  stories: Story[]
  highlights: StoryHighlight[]
  onDelete: (id: string) => void
  onSaveHighlight: (storyId: string, name: string) => void
}) {
  const activeStories = stories.filter(s => new Date(s.expiresAt) > new Date())
  const expiredStories = stories.filter(s => new Date(s.expiresAt) <= new Date())

  return (
    <div className="space-y-6">
      {/* Highlights */}
      {highlights.length > 0 && (
        <div>
          <h4 className="mb-2 font-semibold">Story noi bat</h4>
          <div className="flex flex-wrap gap-2">
            {highlights.map(h => (
              <Badge key={h.id} variant="secondary" className="py-1">
                <Star className="mr-1 h-3 w-3" />
                {h.name} ({h.storyIds.length})
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Active Stories */}
      <div>
        <h4 className="mb-2 font-semibold">Dang hoat dong ({activeStories.length})</h4>
        {activeStories.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {activeStories.map(story => (
              <div key={story.id} className="group relative aspect-[9/16] overflow-hidden rounded-lg">
                <img src={story.media.url || "/placeholder.svg"} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                    <span className="text-xs text-white">{story.views.length} luot xem</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-white hover:bg-white/20"
                      onClick={() => onDelete(story.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {story.isHighlight && (
                  <Badge className="absolute right-1 top-1 h-5 px-1 text-[10px]">
                    <Star className="mr-0.5 h-2 w-2" />
                    {story.highlightName}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Khong co story dang hoat dong</p>
        )}
      </div>

      {/* Expired Stories */}
      {expiredStories.length > 0 && (
        <div>
          <h4 className="mb-2 font-semibold text-muted-foreground">Da het han ({expiredStories.length})</h4>
          <div className="grid grid-cols-3 gap-2 opacity-50">
            {expiredStories.slice(0, 6).map(story => (
              <div key={story.id} className="relative aspect-[9/16] overflow-hidden rounded-lg">
                <img src={story.media.url || "/placeholder.svg"} alt="" className="h-full w-full object-cover grayscale" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
