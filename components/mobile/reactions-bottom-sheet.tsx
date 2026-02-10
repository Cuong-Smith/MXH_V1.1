"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Post } from "@/lib/types"
import { useNewsfeed } from "@/lib/newsfeed-store"
import { X } from "lucide-react"

interface ReactionsBottomSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post: Post
}

const reactionEmojis: Record<string, string> = {
  "👍": "Like",
  "❤️": "Love",
  "😂": "Haha",
  "😢": "Sad",
  "😠": "Angry",
  "🔥": "Fire",
  "🎉": "Wow",
}

export function ReactionsBottomSheet({
  open,
  onOpenChange,
  post,
}: ReactionsBottomSheetProps) {
  const { users } = useNewsfeed()
  const [selectedTab, setSelectedTab] = useState("all")

  const totalReactions = post.reactions.reduce((sum, r) => sum + r.users.length, 0)

  const getReactionsByType = (emoji?: string) => {
    if (!emoji) {
      return post.reactions.flatMap((r) =>
        r.users.map((userId) => ({
          userId,
          emoji: r.emoji,
        }))
      )
    }

    const reaction = post.reactions.find((r) => r.emoji === emoji)
    return (
      reaction?.users.map((userId) => ({
        userId,
        emoji,
      })) || []
    )
  }

  const displayReactions = getReactionsByType(
    selectedTab === "all" ? undefined : selectedTab
  )

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-2xl p-0 flex flex-col">
        {/* Handle Bar */}
        <div className="flex justify-center pt-2 pb-2">
          <div className="h-1 w-12 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Header */}
        <SheetHeader className="px-4 py-3 border-b border-border flex flex-row items-center justify-between space-y-0">
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 hover:bg-muted rounded-full transition"
          >
            <X className="h-5 w-5" />
          </button>
          <SheetTitle className="font-semibold text-foreground flex-1 text-center">
            Tuong tac
          </SheetTitle>
          <div className="w-10" />
        </SheetHeader>

        {/* Tabs */}
        <div className="px-4 pt-2 border-b border-border overflow-x-auto">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="w-max inline-flex gap-2 h-auto bg-transparent p-0 border-b-2 border-border">
              <TabsTrigger
                value="all"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent px-3 pb-3 rounded-none text-sm font-medium whitespace-nowrap"
              >
                <span className="text-primary font-semibold">All</span>
                <span className="ml-1 text-muted-foreground">{totalReactions}</span>
              </TabsTrigger>

              {post.reactions.map((reaction) => (
                <TabsTrigger
                  key={reaction.emoji}
                  value={reaction.emoji}
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent px-3 pb-3 rounded-none text-sm font-medium whitespace-nowrap"
                >
                  <span>{reaction.emoji}</span>
                  <span className="ml-1 text-muted-foreground">
                    {reaction.users.length}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Reactions List */}
        <ScrollArea className="flex-1">
          <div className="divide-y divide-border">
            {displayReactions.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                Không có tương tác nào
              </div>
            ) : (
              displayReactions.map(({ userId, emoji }, index) => {
                const user = users.find((u) => u.id === userId)
                if (!user) return null

                return (
                  <div
                    key={`${userId}-${index}`}
                    className="px-4 py-3 flex items-center gap-3 hover:bg-muted/50 transition"
                  >
                    <Avatar className="h-12 w-12 flex-shrink-0">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {user.name}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {user.department.name}
                      </p>
                    </div>

                    <div className="flex-shrink-0 text-xl">{emoji}</div>
                  </div>
                )
              })
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
