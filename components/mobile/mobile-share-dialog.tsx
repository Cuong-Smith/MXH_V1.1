"use client"

import { useState } from "react"
import Image from "next/image"
import { useNewsfeed } from "@/lib/newsfeed-store"
import { users } from "@/lib/mock-data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  BookOpen,
  Link2,
  Users,
  MessageCircle,
  Smile,
  AtSign,
  Lock,
  Globe,
  Check,
  GripHorizontal,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Post, Visibility } from "@/lib/types"

interface MobileShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post: Post
}

export function MobileShareDialog({ open, onOpenChange, post }: MobileShareDialogProps) {
  const { currentUser, groups, users } = useNewsfeed()
  const [shareText, setShareText] = useState("")
  const [feedType, setFeedType] = useState<"feed" | "group">("feed")
  const [visibility, setVisibility] = useState<Visibility>("company")
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Recent chat users (mock data - in real app this would come from chat history)
  const recentChatUsers = users.slice(0, 4)

  // Get post author
  const postAuthor = users.find((u) => u.id === post.authorId)

  const visibilityOptions = [
    { value: "company", label: "Toan cong ty", icon: Globe },
    { value: "department", label: "Phong ban", icon: Users },
    { value: "private", label: "Chi minh toi", icon: Lock },
  ]

  const handleShareToFeed = () => {
    // In real app, this would create a shared post
    console.log("Sharing to feed:", { shareText, visibility, post })
    onOpenChange(false)
    setShareText("")
  }

  const handleShareToStory = () => {
    // In real app, this would create a story with the shared content
    console.log("Sharing to story:", post)
    onOpenChange(false)
  }

  const handleCopyLink = async () => {
    const link = `${window.location.origin}/post/${post.id}`
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShareToGroup = (groupId: string) => {
    // In real app, this would share to the selected group
    console.log("Sharing to group:", { groupId, shareText, post })
    onOpenChange(false)
    setShareText("")
  }

  const handleSendToUser = (userId: string) => {
    // In real app, this would open chat and send the post
    console.log("Sending to user:", { userId, post })
    onOpenChange(false)
  }

  const currentVisibility = visibilityOptions.find(v => v.value === visibility)
  const VisibilityIcon = currentVisibility?.icon || Globe

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[90vh] rounded-t-2xl p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>Chia se bai viet</SheetTitle>
        </SheetHeader>
        {/* Drag Handle */}
        <div className="flex justify-center py-2">
          <GripHorizontal className="h-5 w-5 text-muted-foreground" />
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-56px)]">
          {/* Share Compose Section */}
          <div className="border-b border-border p-4">
            <div className="flex items-start gap-3 mb-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
                <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{currentUser.name}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {/* Feed Type Selector */}
                  <Select value={feedType} onValueChange={(v) => setFeedType(v as "feed" | "group")}>
                    <SelectTrigger className="h-8 w-auto gap-1 rounded-full bg-muted px-3 text-xs font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="feed">Bang tin</SelectItem>
                      <SelectItem value="group">Nhom</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Visibility Selector */}
                  <Select value={visibility} onValueChange={(v) => setVisibility(v as Visibility)}>
                    <SelectTrigger className="h-8 w-auto gap-2 rounded-full bg-muted px-3 text-xs font-medium">
                      <Globe className="h-4 w-4" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {visibilityOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          <div className="flex items-center gap-2">
                            <opt.icon className="h-4 w-4" />
                            {opt.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Text Input */}
            <Textarea
              value={shareText}
              onChange={(e) => setShareText(e.target.value)}
              placeholder="Say something about this..."
              className="mb-3 min-h-[80px] resize-none border-0 bg-transparent p-0 text-sm placeholder:text-muted-foreground focus-visible:ring-0"
            />

            {/* Preview of shared post */}
            <div className="mb-4 rounded-lg border border-border bg-muted/40 p-3">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={postAuthor?.avatar || "/placeholder.svg"} alt={postAuthor?.name || "User"} />
                  <AvatarFallback>{postAuthor?.name?.charAt(0) || "?"}</AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium text-foreground">{postAuthor?.name || "Unknown"}</span>
              </div>
              <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{post.content}</p>
              {post.attachments && post.attachments.length > 0 && (
                <div className="relative mt-2 h-16 w-full overflow-hidden rounded">
                  <Image
                    src={post.attachments[0].url || "/placeholder.svg"}
                    alt="Post preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            {/* Actions Row */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-muted">
                  <Smile className="h-5 w-5 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-muted">
                  <AtSign className="h-5 w-5 text-muted-foreground" />
                </Button>
              </div>
              <Button
                size="sm"
                onClick={handleShareToFeed}
                className="rounded-full bg-blue-500 px-6 font-semibold text-white hover:bg-blue-600"
              >
                Share now
              </Button>
            </div>
          </div>

          {/* Send in Chat Section */}
          <div className="border-b border-border p-4">
            <h3 className="mb-4 text-sm font-bold text-foreground">Send in Messenger</h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {recentChatUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleSendToUser(user.id)}
                  className="flex flex-shrink-0 flex-col items-center gap-2"
                >
                  <Avatar className="h-16 w-16 ring-2 ring-muted transition-all hover:ring-blue-400">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="max-w-[70px] truncate text-xs font-medium text-foreground">
                    {user.name.split(" ").slice(-2).join(" ")}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Share To Section */}
          <div className="p-4">
            <h3 className="mb-4 text-sm font-bold text-foreground">Share to</h3>
            <div className="grid grid-cols-4 gap-3">
              {/* Your Story */}
              <button
                type="button"
                onClick={handleShareToStory}
                className="flex flex-col items-center gap-2 transition-opacity hover:opacity-80"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <BookOpen className="h-7 w-7 text-foreground" />
                </div>
                <span className="text-xs font-medium text-center text-foreground">Your story</span>
              </button>

              {/* Chat/Messenger */}
              <button
                type="button"
                onClick={() => handleSendToUser(recentChatUsers[0]?.id || "")}
                className="flex flex-col items-center gap-2 transition-opacity hover:opacity-80"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500">
                  <MessageCircle className="h-7 w-7 text-white" />
                </div>
                <span className="text-xs font-medium text-center text-foreground">Messenger</span>
              </button>

              {/* Copy Link */}
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex flex-col items-center gap-2 transition-opacity hover:opacity-80"
              >
                <div className={cn(
                  "flex h-16 w-16 items-center justify-center rounded-full",
                  copied ? "bg-green-500" : "bg-muted"
                )}>
                  {copied ? (
                    <Check className="h-7 w-7 text-white" />
                  ) : (
                    <Link2 className="h-7 w-7 text-foreground" />
                  )}
                </div>
                <span className="text-xs font-medium text-center text-foreground">
                  {copied ? "Copied!" : "Copy link"}
                </span>
              </button>

              {/* Group */}
              <button
                type="button"
                onClick={() => setSelectedGroup(groups?.[0]?.id || null)}
                className="flex flex-col items-center gap-2 transition-opacity hover:opacity-80"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Users className="h-7 w-7 text-foreground" />
                </div>
                <span className="text-xs font-medium text-center text-foreground">Group</span>
              </button>
            </div>
          </div>

          {/* Groups List (when Group is selected) */}
          {selectedGroup !== null && (
            <div className="border-t border-border p-4">
              <h3 className="mb-4 text-sm font-bold text-foreground">Choose a group</h3>
              <div className="space-y-2">
                {(groups || []).slice(0, 5).map((group: any) => (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => handleShareToGroup(group.id)}
                    className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted"
                  >
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-muted flex-shrink-0">
                      {group.coverImage ? (
                        <Image
                          src={group.coverImage || "/placeholder.svg"}
                          alt={group.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Users className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{group.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(group.members || []).length} members
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
