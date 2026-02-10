"use client"

import { DialogTitle } from "@/components/ui/dialog"
import { DialogHeader } from "@/components/ui/dialog"
import { DialogContent } from "@/components/ui/dialog"
import { Dialog } from "@/components/ui/dialog"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MobileShareDialog } from "@/components/mobile/mobile-share-dialog"
import { ReactionsBottomSheet } from "@/components/mobile/reactions-bottom-sheet"
import {
  MoreHorizontal,
  MessageCircle,
  Share2,
  Send,
  Globe,
  Lock,
  Users,
  Building2,
  Heart,
  Bookmark,
  ThumbsUp,
  AtSign,
  Star,
  Reply,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useNewsfeed } from "@/lib/newsfeed-store"
import type { Post } from "@/lib/types"
import { commonEmojis } from "@/lib/mock-data"

type MobilePostCardProps = {
  post: Post
}

export function MobilePostCard({ post }: MobilePostCardProps) {
  const { users, currentUser, addReaction, removeReaction, addComment, addCommentReaction, removeCommentReaction, addReply, votePoll } = useNewsfeed()
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [starRating, setStarRating] = useState(0)
  const [showStarDialog, setShowStarDialog] = useState(false)
  const [showReactionsSheet, setShowReactionsSheet] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const isLiked = post.reactions.some((r) => r.users.includes(currentUser.id))
  const [showReactionsModal, setShowReactionsModal] = useState(false)
  const [replyingTo, setReplyingTo] = useState<{ commentId: string; authorName: string; mentionName?: string } | null>(null)
  const [replyText, setReplyText] = useState("")
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set())
  const [showCommentReactions, setShowCommentReactions] = useState<string | null>(null)

  const author = users.find((u) => u.id === post.authorId)

  const formatDate = (date: Date) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Vua xong"
    if (minutes < 60) return `${minutes}p`
    if (hours < 24) return `${hours}h`
    if (days < 7) return `${days}d`
    return d.toLocaleDateString("vi-VN", { day: "numeric", month: "numeric" })
  }

  const getVisibilityIcon = () => {
    switch (post.visibility) {
      case "private":
        return <Lock className="h-3 w-3" />
      case "specific":
        return <Users className="h-3 w-3" />
      case "department":
        return <Building2 className="h-3 w-3" />
      default:
        return <Globe className="h-3 w-3" />
    }
  }

  const handleLike = () => {
    if (isLiked) {
      removeReaction(post.id, "👍")
    } else {
      addReaction(post.id, "👍")
    }
    setIsSaved(!isLiked)
  }

  const handleComment = () => {
    if (commentText.trim()) {
      addComment(post.id, { content: commentText, stars: starRating > 0 ? starRating : undefined })
      setCommentText("")
      setStarRating(0)
      setShowStarDialog(false)
    }
  }

  const totalReactions = post.reactions.reduce((sum, r) => sum + r.users.length, 0)
  const totalComments = post.comments.length

  const handleVote = (optionId: string) => {
    votePoll(post.id, optionId)
  }

  const getTotalVotes = () => {
    if (!post.poll) return 0
    return post.poll.options.reduce((sum, opt) => sum + opt.votes.length, 0)
  }

  const getVotePercentage = (votes: number) => {
    const total = getTotalVotes()
    return total === 0 ? 0 : Math.round((votes / total) * 100)
  }

  const hasUserVoted = () => {
    if (!post.poll) return false
    return post.poll.options.some((opt) => opt.votes.includes(currentUser.id))
  }

  return (
    <article className="bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${post.authorId}`}>
            <Avatar className="h-10 w-10">
              <AvatarImage src={author?.avatar || "/placeholder.svg"} />
              <AvatarFallback>{author?.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Link
                href={`/profile/${post.authorId}`}
                className="font-semibold text-foreground"
              >
                {author?.name}
              </Link>
              {post.taggedUsers.length > 0 && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <AtSign className="h-3 w-3" />
                  {post.taggedUsers.length}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>{formatDate(post.createdAt)}</span>
              <span>·</span>
              {getVisibilityIcon()}
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Luu bai viet</DropdownMenuItem>
            <DropdownMenuItem>An bai viet</DropdownMenuItem>
            <DropdownMenuItem>Bao cao</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="whitespace-pre-wrap text-foreground">{post.content}</p>
      </div>

      {/* Tagged Users */}
      {post.taggedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2 px-4 pb-3">
          {post.taggedUsers.map((userId) => {
            const user = users.find((u) => u.id === userId)
            return user ? (
              <Link
                key={userId}
                href={`/profile/${userId}`}
                className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900"
              >
                <AtSign className="h-3 w-3" />
                {user.name}
              </Link>
            ) : null
          })}
        </div>
      )}

      {/* Media */}
      {post.attachments && post.attachments.length > 0 && (
        <div className="relative aspect-square w-full">
          <Image
            src={post.attachments[0].url || "/placeholder.svg"}
            alt="Post media"
            fill
            className="object-cover"
          />
          {post.attachments.length > 1 && (
            <div className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white">
              +{post.attachments.length - 1}
            </div>
          )}
        </div>
      )}

      {/* Poll */}
      {post.poll && (
        <div className="px-4 py-3">
          <p className="mb-3 font-medium text-foreground">{post.poll.question}</p>
          <div className="space-y-2">
            {post.poll.options.map((option) => {
              const percentage = getVotePercentage(option.votes.length)
              const hasVoted = option.votes.includes(currentUser.id)
              const showResults = hasUserVoted()

              return (
                <button
                  key={option.id}
                  onClick={() => !hasUserVoted() && handleVote(option.id)}
                  disabled={hasUserVoted()}
                  className={cn(
                    "relative w-full overflow-hidden rounded-lg border p-3 text-left transition-colors",
                    hasVoted ? "border-primary bg-primary/10" : "border-border",
                    !hasUserVoted() && "hover:bg-muted"
                  )}
                >
                  {showResults && (
                    <div
                      className="absolute inset-y-0 left-0 bg-primary/20"
                      style={{ width: `${percentage}%` }}
                    />
                  )}
                  <div className="relative flex items-center justify-between">
                    <span className="text-sm text-foreground">{option.text}</span>
                    {showResults && (
                      <span className="text-sm font-medium text-foreground">
                        {percentage}%
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {getTotalVotes()} luot binh chon
          </p>
        </div>
      )}

      {/* Stats */}
      {(totalReactions > 0 || totalComments > 0) && (
        <div className="border-t border-border px-4 py-2 flex items-center justify-between text-sm text-muted-foreground">
          {totalReactions > 0 && (
            <button
              onClick={() => setShowReactionsSheet(true)}
              className="flex items-center gap-2 hover:bg-muted rounded px-2 py-1 transition-colors"
            >
              <div className="flex -space-x-1">
                {post.reactions.slice(0, 3).map((r) => (
                  <span
                    key={r.emoji}
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs border border-background"
                  >
                    {r.emoji}
                  </span>
                ))}
              </div>
              <span>{totalReactions}</span>
            </button>
          )}
          {totalComments > 0 && (
            <button
              type="button"
              onClick={() => setShowComments(!showComments)}
              className="hover:underline"
            >
              {totalComments} binh luan
            </button>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="border-t border-b border-border px-4 py-2 flex gap-1">
        <button
          type="button"
          onClick={handleLike}
          className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-muted rounded-lg transition-colors font-medium text-sm"
        >
          <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-blue-500 text-blue-500' : ''}`} />
          Thich
        </button>
        <button
          type="button"
          onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-muted rounded-lg transition-colors font-medium text-sm"
        >
          <MessageCircle className="h-4 w-4" />
          Binh luan
        </button>
        <button
          type="button"
          onClick={() => setShareDialogOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-muted rounded-lg transition-colors font-medium text-sm"
        >
          <Share2 className="h-4 w-4" />
          Chia se
        </button>
      </div>

      {/* Reactions Detail Bottom Sheet */}
      <ReactionsBottomSheet
        open={showReactionsSheet}
        onOpenChange={setShowReactionsSheet}
        post={post}
      />

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-border px-4 py-3">
          {/* Comment Input */}
          <div className="mb-3 flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
              <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
            </Avatar>
            <div className="relative flex-1 flex gap-1 items-center">
              <Input
                placeholder="Viet binh luan..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="rounded-full bg-muted border-0 flex-1"
                onKeyDown={(e) => e.key === "Enter" && handleComment()}
              />
              <button
                type="button"
                onClick={() => setShowStarDialog(!showStarDialog)}
                className={`flex-shrink-0 p-2 rounded-full transition-colors ${starRating > 0 ? "text-yellow-500 bg-yellow-50" : "text-muted-foreground hover:bg-muted"
                  }`}
              >
                <Star className={`h-4 w-4 ${starRating > 0 ? 'fill-yellow-500' : ''}`} />
              </button>
              <button
                type="button"
                onClick={handleComment}
                disabled={!commentText.trim()}
                className="flex-shrink-0 p-2 text-primary disabled:text-muted-foreground"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Star Input */}
          {showStarDialog && (
            <div className="mb-3 rounded-lg bg-yellow-50 border border-yellow-200 p-3 space-y-2">
              <div className="text-sm font-semibold text-yellow-900">Nhap so sao</div>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min="0"
                  placeholder="Nhap so sao..."
                  value={starRating}
                  onChange={(e) => setStarRating(parseInt(e.target.value) || 0)}
                  className="flex-1"
                />
                <Button size="sm" onClick={() => setShowStarDialog(false)} className="bg-yellow-500 hover:bg-yellow-600">
                  OK
                </Button>
              </div>
              {starRating > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[...Array(Math.min(starRating, 10))].map((_, i) => (
                      <span key={i} className="text-lg text-yellow-500">
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-yellow-700">
                    {starRating} sao
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-3">
            {post.comments.slice(0, 3).map((comment) => {
              const commentAuthor = users.find((u) => u.id === comment.authorId)
              const hasStars = comment.stars && comment.stars > 0
              const commentReactionsTotal = comment.reactions.reduce((sum, r) => sum + r.users.length, 0)
              const isReplyExpanded = expandedReplies.has(comment.id)
              const replyCount = comment.replies?.length || 0

              return (
                <div key={comment.id} className="space-y-1">
                  <div className="flex gap-2">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={commentAuthor?.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{commentAuthor?.name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="relative">
                        <div
                          className={`rounded-2xl px-3 py-2 ${hasStars
                            ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-300 dark:from-yellow-950/30 dark:to-yellow-900/30 dark:border-yellow-700'
                            : 'bg-muted'
                            }`}
                          onTouchStart={() => {
                            const timer = setTimeout(() => setShowCommentReactions(comment.id), 500)
                            const handleEnd = () => { clearTimeout(timer); document.removeEventListener('touchend', handleEnd) }
                            document.addEventListener('touchend', handleEnd)
                          }}
                        >
                          <p className="text-sm font-semibold text-foreground">
                            {commentAuthor?.name}
                          </p>
                          {hasStars && (
                            <div className="mb-1 flex items-center gap-1">
                              <span className="text-base text-yellow-500">★</span>
                              <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-400">
                                {comment.stars} sao
                              </span>
                            </div>
                          )}
                          <p className="text-sm text-foreground">{comment.content}</p>
                        </div>
                        {/* Reaction badges */}
                        {commentReactionsTotal > 0 && (
                          <div className="absolute -bottom-2 right-2 flex items-center gap-0.5 rounded-full border border-border bg-background px-1.5 py-0.5 shadow-sm">
                            {comment.reactions.slice(0, 3).map((r) => (
                              <span key={r.emoji} className="text-xs">{r.emoji}</span>
                            ))}
                            <span className="text-[10px] text-muted-foreground ml-0.5">{commentReactionsTotal}</span>
                          </div>
                        )}
                      </div>

                      {/* Reaction picker for comment */}
                      {showCommentReactions === comment.id && (
                        <div className="mt-1 flex items-center gap-1 rounded-full bg-background border border-border shadow-lg px-2 py-1 w-fit animate-in fade-in zoom-in-95">
                          {commonEmojis.slice(0, 6).map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              className="p-1 text-lg hover:scale-125 active:scale-110 transition-transform"
                              onClick={() => {
                                addCommentReaction(post.id, comment.id, emoji)
                                setShowCommentReactions(null)
                              }}
                            >
                              {emoji}
                            </button>
                          ))}
                          <button
                            type="button"
                            className="p-1 ml-1 text-muted-foreground"
                            onClick={() => setShowCommentReactions(null)}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )}

                      <div className={`flex items-center gap-3 px-2 text-xs text-muted-foreground ${commentReactionsTotal > 0 ? 'mt-3' : 'mt-1'}`}>
                        <span>{formatDate(comment.createdAt)}</span>
                        <button
                          type="button"
                          className={`font-semibold hover:underline ${comment.reactions.some(r => r.users.includes(currentUser.id)) ? 'text-primary' : ''
                            }`}
                          onClick={() => setShowCommentReactions(showCommentReactions === comment.id ? null : comment.id)}
                        >
                          Thich
                        </button>
                        <button
                          type="button"
                          className="font-semibold hover:underline"
                          onClick={() => {
                            setReplyingTo({ commentId: comment.id, authorName: commentAuthor?.name || '' })
                            setReplyText('')
                          }}
                        >
                          Tra loi
                        </button>
                      </div>

                      {/* Replies */}
                      {replyCount > 0 && (
                        <div className="mt-2 ml-1">
                          {!isReplyExpanded && (
                            <button
                              type="button"
                              className="flex items-center gap-1 text-xs font-semibold text-primary"
                              onClick={() => setExpandedReplies(prev => new Set([...prev, comment.id]))}
                            >
                              <Reply className="h-3 w-3" />
                              Xem {replyCount} phan hoi
                            </button>
                          )}
                          {isReplyExpanded && (
                            <div className="space-y-2 border-l-2 border-border pl-2">
                              {comment.replies?.map((reply) => {
                                const replyAuthor = users.find((u) => u.id === reply.authorId)
                                const replyReactionsTotal = reply.reactions.reduce((sum, r) => sum + r.users.length, 0)
                                return (
                                  <div key={reply.id} className="flex gap-2">
                                    <Avatar className="h-6 w-6 flex-shrink-0">
                                      <AvatarImage src={replyAuthor?.avatar || "/placeholder.svg"} />
                                      <AvatarFallback>{replyAuthor?.name?.[0] || 'U'}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                      <div className="relative">
                                        <div className="rounded-2xl bg-muted px-3 py-1.5">
                                          <p className="text-xs font-semibold text-foreground">{replyAuthor?.name}</p>
                                          <p className="text-xs text-foreground">
                                            {reply.mentionName && (
                                              <span className="font-semibold text-blue-500 mr-1">@{reply.mentionName}</span>
                                            )}
                                            {reply.content}
                                          </p>
                                        </div>
                                        {replyReactionsTotal > 0 && (
                                          <div className="absolute -bottom-2 right-2 flex items-center gap-0.5 rounded-full border border-border bg-background px-1 py-0.5 shadow-sm">
                                            {reply.reactions.slice(0, 2).map((r) => (
                                              <span key={r.emoji} className="text-[10px]">{r.emoji}</span>
                                            ))}
                                            <span className="text-[10px] text-muted-foreground ml-0.5">{replyReactionsTotal}</span>
                                          </div>
                                        )}
                                      </div>
                                      <div className={`flex items-center gap-3 px-2 text-xs text-muted-foreground ${replyReactionsTotal > 0 ? 'mt-3' : 'mt-1'}`}>
                                        <span>{formatDate(reply.createdAt)}</span>
                                        <button
                                          type="button"
                                          className={`font-semibold hover:underline ${reply.reactions.some(r => r.users.includes(currentUser.id)) ? 'text-primary' : ''
                                            }`}
                                          onClick={() => addCommentReaction(post.id, reply.id, '👍')}
                                        >
                                          Thich
                                        </button>
                                        <button
                                          type="button"
                                          className="font-semibold hover:underline"
                                          onClick={() => {
                                            setReplyingTo({ commentId: comment.id, authorName: replyAuthor?.name || '', mentionName: replyAuthor?.name || '' })
                                            setReplyText('')
                                          }}
                                        >
                                          Tra loi
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                              <button
                                type="button"
                                className="text-xs font-semibold text-muted-foreground"
                                onClick={() => setExpandedReplies(prev => {
                                  const next = new Set(prev)
                                  next.delete(comment.id)
                                  return next
                                })}
                              >
                                An phan hoi
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Reply input */}
                      {replyingTo?.commentId === comment.id && (
                        <div className="mt-2 ml-1 space-y-1">
                          {replyingTo.mentionName && (
                            <div className="flex items-center gap-1 px-1">
                              <span className="text-xs text-muted-foreground">Dang tra loi</span>
                              <span className="text-xs font-semibold text-blue-500">@{replyingTo.mentionName}</span>
                              <button
                                type="button"
                                className="text-xs text-muted-foreground ml-1"
                                onClick={() => setReplyingTo({ ...replyingTo, mentionName: undefined })}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                          <div className="flex gap-2 items-center">
                            <Avatar className="h-6 w-6 flex-shrink-0">
                              <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 flex gap-1 items-center">
                              <Input
                                placeholder={`Tra loi ${replyingTo.authorName}...`}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && replyText.trim()) {
                                    addReply(post.id, comment.id, { content: replyText, mentionName: replyingTo.mentionName })
                                    setReplyText("")
                                    setReplyingTo(null)
                                    setExpandedReplies(prev => new Set([...prev, comment.id]))
                                  }
                                }}
                                className="rounded-full bg-muted border-0 text-sm h-8 flex-1"
                                autoFocus
                              />
                              <button
                                type="button"
                                className="flex-shrink-0 p-1 text-muted-foreground"
                                onClick={() => setReplyingTo(null)}
                              >
                                <X className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                disabled={!replyText.trim()}
                                className="flex-shrink-0 p-1 text-primary disabled:text-muted-foreground"
                                onClick={() => {
                                  if (replyText.trim()) {
                                    addReply(post.id, comment.id, { content: replyText, mentionName: replyingTo.mentionName })
                                    setReplyText("")
                                    setReplyingTo(null)
                                    setExpandedReplies(prev => new Set([...prev, comment.id]))
                                  }
                                }}
                              >
                                <Send className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
            {post.comments.length > 3 && (
              <button
                type="button"
                className="text-sm font-semibold text-muted-foreground hover:underline"
              >
                Xem them {post.comments.length - 3} binh luan
              </button>
            )}
          </div>
        </div>
      )}

      {/* Share Dialog */}
      <MobileShareDialog open={shareDialogOpen} onOpenChange={setShareDialogOpen} post={post} />
    </article>
  )
}
