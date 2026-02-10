"use client"

import { useState } from "react"
import Image from "next/image"
import { useNewsfeed } from "@/lib/newsfeed-store"
import { users } from "@/lib/mock-data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { MobileStoryViewer } from "./mobile-story-viewer"
import { MobileCreateStoryDialog } from "./mobile-create-story-dialog"

export function MobileStoryBar() {
  const { stories = [], currentUser } = useNewsfeed()
  const [selectedUserIndex, setSelectedUserIndex] = useState<number | null>(null)
  const [createStoryOpen, setCreateStoryOpen] = useState(false)

  // Group stories by user
  const userStories = (stories || []).reduce((acc, story) => {
    if (!acc[story.userId]) {
      acc[story.userId] = []
    }
    acc[story.userId].push(story)
    return acc
  }, {} as Record<string, typeof stories>)

  const storyUsers = Object.keys(userStories)

  return (
    <div className="bg-background">
      <div className="flex gap-2 overflow-x-auto px-3 py-3 scrollbar-hide">
        {/* Create Story */}
        <button
          type="button"
          onClick={() => setCreateStoryOpen(true)}
          className="relative flex-shrink-0"
        >
          <div className="relative h-40 w-24 overflow-hidden rounded-xl bg-muted">
            <Image
              src={currentUser.avatar || "/placeholder.svg"}
              alt="Your story"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-2">
              <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-background bg-primary">
                <Plus className="h-4 w-4 text-primary-foreground" />
              </div>
              <p className="text-center text-xs font-medium text-white">Tao story</p>
            </div>
          </div>
        </button>

        {/* User Stories */}
        {storyUsers.map((userId) => {
          const userStoryList = userStories[userId]
          const firstStory = userStoryList[0]
          const hasUnviewed = userStoryList.some((s) => !s.views?.some((v) => v.userId === currentUser.id))

          const userIndex = storyUsers.indexOf(userId)
          return (
            <button
              key={userId}
              type="button"
              onClick={() => setSelectedUserIndex(userIndex)}
              className="relative flex-shrink-0"
            >
              <div
                className={cn(
                  "relative h-40 w-24 overflow-hidden rounded-xl",
                  hasUnviewed ? "ring-2 ring-primary ring-offset-2" : ""
                )}
              >
                <Image
                  src={firstStory.media?.url || "/placeholder.svg"}
                  alt={`${firstStory.authorId}'s story`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* User Avatar */}
                <div className="absolute left-2 top-2">
                  <Avatar
                    className={cn(
                      "h-8 w-8 ring-2",
                      hasUnviewed ? "ring-primary" : "ring-muted-foreground/30"
                    )}
                  >
                    <AvatarImage src={users.find((u) => u.id === userId)?.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{users.find((u) => u.id === userId)?.name.charAt(0) || "?"}</AvatarFallback>
                  </Avatar>
                </div>

                {/* User Name */}
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <p className="line-clamp-2 text-xs font-medium text-white">
                    {users.find((u) => u.id === userId)?.name}
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Full Screen Story Viewer */}
      {selectedUserIndex !== null && (
        <MobileStoryViewer
          stories={stories}
          users={users}
          initialUserIndex={selectedUserIndex}
          initialStoryIndex={0}
          onClose={() => setSelectedUserIndex(null)}
        />
      )}

      {/* Create Story Dialog */}
      <MobileCreateStoryDialog
        open={createStoryOpen}
        onOpenChange={setCreateStoryOpen}
      />
    </div>
  )
}
