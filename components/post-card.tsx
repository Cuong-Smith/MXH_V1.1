"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useNewsfeed } from '@/lib/newsfeed-store'
import type { Post } from '@/lib/types'
import { commonEmojis } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  MoreHorizontal,
  Edit2,
  Trash2,
  MessageCircle,
  Send,
  Globe,
  Lock,
  Users,
  Building2,
  Clock,
  AtSign,
  Star,
  ThumbsUp,
  Reply,
  Share2,
} from 'lucide-react'
import { PostComposer } from './post-composer'

type PostCardProps = {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const router = useRouter()
  const { users, currentUser, deletePost, addReaction, removeReaction, addComment, addCommentReaction, removeCommentReaction, addReply, votePoll } = useNewsfeed()
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showStarDialog, setShowStarDialog] = useState(false)
  const [starRating, setStarRating] = useState(5)
  const [showReactionsModal, setShowReactionsModal] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [replyingTo, setReplyingTo] = useState<{ commentId: string; authorName: string; mentionName?: string } | null>(null)
  const [replyText, setReplyText] = useState('')
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set())

  const totalReactions = post.reactions.reduce((sum, r) => sum + r.users.length, 0)

  const author = users.find((u) => u.id === post.authorId)
  const isOwner = post.authorId === currentUser.id

  const formatDate = (date: Date) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Vua xong'
    if (minutes < 60) return `${minutes} phut truoc`
    if (hours < 24) return `${hours} gio truoc`
    if (days < 7) return `${days} ngay truoc`
    return d.toLocaleDateString('vi-VN')
  }

  const getVisibilityIcon = () => {
    switch (post.visibility) {
      case 'private':
        return <Lock className="h-3 w-3" />
      case 'specific':
        return <Users className="h-3 w-3" />
      case 'department':
        return <Building2 className="h-3 w-3" />
      default:
        return <Globe className="h-3 w-3" />
    }
  }

  const getVisibilityLabel = () => {
    switch (post.visibility) {
      case 'private':
        return 'Rieng tu'
      case 'specific':
        return `${post.visibleTo?.length || 0} nguoi`
      case 'department':
        return 'Phong ban'
      default:
        return 'Cong ty'
    }
  }

  const handleReaction = (emoji: string) => {
    const reaction = post.reactions.find((r) => r.emoji === emoji)
    if (reaction?.users.includes(currentUser.id)) {
      removeReaction(post.id, emoji)
    } else {
      addReaction(post.id, emoji)
    }
  }

  const handleComment = () => {
    if (commentText.trim()) {
      addComment(post.id, { content: commentText, stars: starRating > 0 ? starRating : undefined })
      setCommentText('')
      setStarRating(5)
      setShowStarDialog(false)
    }
  }

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
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarImage src={author?.avatar || "/placeholder.svg"} />
            <AvatarFallback>{author?.name?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-medium text-foreground">{author?.name}</p>
              {post.taggedUsers.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  <AtSign className="mr-1 inline h-3 w-3" />
                  {post.taggedUsers.length} nguoi
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{formatDate(post.createdAt)}</span>
              <span className="flex items-center gap-1">
                {getVisibilityIcon()}
                {getVisibilityLabel()}
              </span>
              {post.scheduledAt && new Date(post.scheduledAt) > new Date() && (
                <span className="flex items-center gap-1 text-amber-500">
                  <Clock className="h-3 w-3" />
                  Len lich
                </span>
              )}
            </div>
          </div>
          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Chinh sua
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => deletePost(post.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xoa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {post.content && (
          <p className="whitespace-pre-wrap text-foreground">{post.content}</p>
        )}

        {post.taggedUsers.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.taggedUsers.map((userId) => {
              const user = users.find((u) => u.id === userId)
              return user ? (
                <Badge key={userId} variant="secondary" className="text-xs">
                  @{user.name}
                </Badge>
              ) : null
            })}
          </div>
        )}

        {post.attachments.length > 0 && (
          <div className={`grid gap-2 ${post.attachments.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {post.attachments.map((att) => (
              <div key={att.id} className="overflow-hidden rounded-lg">
                {att.type === 'image' || att.type === 'sticker' ? (
                  <img
                    src={att.url || "/placeholder.svg"}
                    alt={att.name || 'attachment'}
                    className="h-auto max-h-80 w-full object-cover"
                  />
                ) : (
                  <video
                    src={att.url}
                    className="h-auto max-h-80 w-full"
                    controls
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {post.poll && (
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="mb-3 font-medium text-foreground">{post.poll.question}</p>
            <div className="space-y-2">
              {post.poll.options.map((opt) => {
                const percentage = getVotePercentage(opt.votes.length)
                const isVoted = opt.votes.includes(currentUser.id)
                const showResults = hasUserVoted()

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleVote(opt.id)}
                    disabled={hasUserVoted() && !post.poll?.multipleChoice}
                    className={`relative w-full overflow-hidden rounded-md border px-3 py-2 text-left transition-colors ${
                      isVoted
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-background hover:bg-muted'
                    } disabled:cursor-default`}
                  >
                    {showResults && (
                      <div
                        className="absolute inset-y-0 left-0 bg-primary/20 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    )}
                    <div className="relative flex items-center justify-between">
                      <span className="text-sm text-foreground">{opt.text}</span>
                      {showResults && (
                        <span className="text-sm font-medium text-muted-foreground">
                          {percentage}%
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {getTotalVotes()} phieu bau
              {post.poll.multipleChoice && ' - Chon nhieu'}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-3 border-t border-border pt-3">
        <div className="flex w-full items-center justify-between">
          {/* Reactions Summary */}
          {totalReactions > 0 && (
            <button
              onClick={() => setShowReactionsModal(true)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:underline transition"
            >
              <div className="flex -space-x-1">
                {post.reactions.slice(0, 3).map((r) => (
                  <span
                    key={r.emoji}
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs"
                  >
                    {r.emoji}
                  </span>
                ))}
              </div>
              <span>{totalReactions}</span>
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="flex-1 h-9 gap-1">
                <ThumbsUp className="h-4 w-4" />
                Thich
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
              <div className="flex gap-1">
                {commonEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    className="rounded p-1 text-lg hover:bg-muted transition-colors"
                    onClick={() => handleReaction(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="flex-1 h-9 gap-1"
          >
            <MessageCircle className="h-4 w-4" />
            Binh luan
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1 h-9 gap-1"
            onClick={() => setShowShareDialog(true)}
          >
            <Share2 className="h-4 w-4" />
            Chia se
          </Button>
        </div>
        {showComments && (
          <div className="w-full space-y-3">
            {post.comments.map((comment) => {
              const commentAuthor = users.find((u) => u.id === comment.authorId)
              const hasStars = comment.stars && comment.stars > 0
              const commentReactionsTotal = comment.reactions.reduce((sum, r) => sum + r.users.length, 0)
              const isReplyExpanded = expandedReplies.has(comment.id)
              const replyCount = comment.replies?.length || 0

              return (
                <div key={comment.id} className="space-y-2">
                  <div className="flex gap-2">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={commentAuthor?.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {commentAuthor?.name?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="relative">
                        <div className={`rounded-xl px-3 py-2 ${
                          hasStars
                            ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-300 shadow-sm dark:from-yellow-950/30 dark:to-yellow-900/30 dark:border-yellow-700'
                            : 'bg-muted'
                        }`}>
                          <p className="text-sm font-medium text-foreground">
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
                        {/* Reaction badges on comment bubble */}
                        {commentReactionsTotal > 0 && (
                          <div className="absolute -bottom-2 right-2 flex items-center gap-0.5 rounded-full border border-border bg-background px-1.5 py-0.5 shadow-sm">
                            {comment.reactions.slice(0, 3).map((r) => (
                              <span key={r.emoji} className="text-xs">{r.emoji}</span>
                            ))}
                            <span className="text-xs text-muted-foreground ml-0.5">{commentReactionsTotal}</span>
                          </div>
                        )}
                      </div>
                      <div className={`flex items-center gap-3 px-2 text-xs text-muted-foreground ${commentReactionsTotal > 0 ? 'mt-3' : 'mt-1'}`}>
                        <span>{formatDate(comment.createdAt)}</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className={`font-semibold hover:text-foreground transition-colors ${
                              comment.reactions.some(r => r.users.includes(currentUser.id)) ? 'text-primary' : ''
                            }`}>
                              Thich
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-1.5" side="top">
                            <div className="flex gap-0.5">
                              {commonEmojis.slice(0, 6).map((emoji) => (
                                <button
                                  key={emoji}
                                  className="rounded-full p-1.5 text-lg hover:bg-muted hover:scale-125 transition-all"
                                  onClick={() => addCommentReaction(post.id, comment.id, emoji)}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                        <button
                          className="font-semibold hover:text-foreground transition-colors"
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
                        <div className="mt-2 ml-2">
                          {!isReplyExpanded && (
                            <button
                              className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                              onClick={() => setExpandedReplies(prev => new Set([...prev, comment.id]))}
                            >
                              <Reply className="h-3 w-3" />
                              Xem {replyCount} phan hoi
                            </button>
                          )}
                          {isReplyExpanded && (
                            <div className="space-y-2 border-l-2 border-border pl-3">
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
                                        <div className="rounded-xl bg-muted px-3 py-1.5">
                                          <p className="text-xs font-medium text-foreground">{replyAuthor?.name}</p>
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
                                        <Popover>
                                          <PopoverTrigger asChild>
                                            <button className={`font-semibold hover:text-foreground transition-colors ${
                                              reply.reactions.some(r => r.users.includes(currentUser.id)) ? 'text-primary' : ''
                                            }`}>
                                              Thich
                                            </button>
                                          </PopoverTrigger>
                                          <PopoverContent className="w-auto p-1.5" side="top">
                                            <div className="flex gap-0.5">
                                              {commonEmojis.slice(0, 6).map((emoji) => (
                                                <button
                                                  key={emoji}
                                                  className="rounded-full p-1.5 text-lg hover:bg-muted hover:scale-125 transition-all"
                                                  onClick={() => addCommentReaction(post.id, reply.id, emoji)}
                                                >
                                                  {emoji}
                                                </button>
                                              ))}
                                            </div>
                                          </PopoverContent>
                                        </Popover>
                                        <button
                                          className="font-semibold hover:text-foreground transition-colors"
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
                                className="text-xs font-semibold text-muted-foreground hover:underline"
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

                      {/* Reply input for this comment */}
                      {replyingTo?.commentId === comment.id && (
                        <div className="mt-2 ml-2 space-y-1">
                          {replyingTo.mentionName && (
                            <div className="flex items-center gap-1 px-1">
                              <span className="text-xs text-muted-foreground">Dang tra loi</span>
                              <span className="text-xs font-semibold text-blue-500">@{replyingTo.mentionName}</span>
                              <button
                                className="text-xs text-muted-foreground hover:text-foreground ml-1"
                                onClick={() => setReplyingTo({ ...replyingTo, mentionName: undefined })}
                              >
                                ✕
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
                                  if (e.key === 'Enter' && replyText.trim()) {
                                    addReply(post.id, comment.id, { content: replyText, mentionName: replyingTo.mentionName })
                                    setReplyText('')
                                    setReplyingTo(null)
                                    setExpandedReplies(prev => new Set([...prev, comment.id]))
                                  }
                                  if (e.key === 'Escape') {
                                    setReplyingTo(null)
                                  }
                                }}
                                className="rounded-full text-sm h-8"
                                autoFocus
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 flex-shrink-0"
                                onClick={() => setReplyingTo(null)}
                              >
                                <span className="text-xs text-muted-foreground">✕</span>
                              </Button>
                              <Button
                                size="sm"
                                className="h-8 w-8 p-0 flex-shrink-0 rounded-full"
                                disabled={!replyText.trim()}
                                onClick={() => {
                                  if (replyText.trim()) {
                                    addReply(post.id, comment.id, { content: replyText, mentionName: replyingTo.mentionName })
                                    setReplyText('')
                                    setReplyingTo(null)
                                    setExpandedReplies(prev => new Set([...prev, comment.id]))
                                  }
                                }}
                              >
                                <Send className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
            <div className="flex gap-2 items-end">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
                <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 flex gap-1 items-center">
                <Input
                  placeholder="Viet binh luan..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                  className="flex-1 rounded-full"
                />
                <Popover open={showStarDialog} onOpenChange={setShowStarDialog}>
                  <PopoverTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className={`flex-shrink-0 ${starRating > 0 ? "text-yellow-500" : ""}`}
                      title="Tang sao"
                    >
                      <Star className={`h-5 w-5 ${starRating > 0 ? 'fill-yellow-500' : ''}`} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-60 p-4" side="top">
                    <div className="space-y-3">
                      <div className="text-sm font-semibold">Nhap so sao</div>
                      <div className="flex gap-2 items-center">
                        <Input
                          type="number"
                          min="0"
                          placeholder="Nhap so sao..."
                          value={starRating}
                          onChange={(e) => setStarRating(parseInt(e.target.value) || 0)}
                          className="flex-1"
                        />
                        <Button
                          size="sm"
                          onClick={() => setShowStarDialog(false)}
                        >
                          OK
                        </Button>
                      </div>
                      {starRating > 0 && (
                        <div className="flex gap-1 flex-wrap justify-center">
                          {[...Array(Math.min(starRating, 20))].map((_, i) => (
                            <span key={i} className="text-lg text-yellow-400">
                              ★
                            </span>
                          ))}
                          {starRating > 20 && <span className="text-sm text-muted-foreground">+{starRating - 20}</span>}
                        </div>
                      )}
                      <div className="text-center text-xs text-muted-foreground">
                        {starRating > 0 ? `${starRating} sao` : 'Khong co sao'}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <Button
                  size="sm"
                  className="flex-shrink-0 rounded-full"
                  onClick={handleComment}
                  title="Gui binh luan"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardFooter>
      {/* Reactions Detail Modal */}
      <Dialog open={showReactionsModal} onOpenChange={setShowReactionsModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Chi tiet cam xuc</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {post.reactions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Chua co cam xuc nao</p>
            ) : (
              post.reactions.map((reaction) => (
                <div key={reaction.emoji} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{reaction.emoji}</span>
                    <span className="text-sm font-medium text-foreground">{reaction.users.length}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {reaction.users.slice(0, 5).map((userId) => {
                      const user = users.find((u) => u.id === userId)
                      return user ? (
                        <div key={userId} className="flex items-center gap-1 text-xs">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-foreground">{user.name}</span>
                        </div>
                      ) : null
                    })}
                    {reaction.users.length > 5 && (
                      <span className="text-xs text-muted-foreground">
                        va {reaction.users.length - 5} nguoi khac
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
