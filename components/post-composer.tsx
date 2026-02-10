"use client"

import React from "react"

import { useState, useRef } from 'react'
import { useNewsfeed } from '@/lib/newsfeed-store'
import type { Post, Visibility, Attachment, Poll, PollOption } from '@/lib/types'
import { stickers, commonEmojis } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  ImageIcon,
  Video,
  Smile,
  Sticker,
  BarChart3,
  Clock,
  AtSign,
  Globe,
  Lock,
  Users,
  Building2,
  X,
  Plus,
  Trash2,
  Send,
} from 'lucide-react'

type PostComposerProps = {
  editingPost?: Post
  onClose?: () => void
}

export function PostComposer({ editingPost, onClose }: PostComposerProps) {
  const { currentUser, users, departments, addPost, updatePost } = useNewsfeed()
  const [content, setContent] = useState(editingPost?.content || '')
  const [visibility, setVisibility] = useState<Visibility>(editingPost?.visibility || 'company')
  const [selectedUsers, setSelectedUsers] = useState<string[]>(editingPost?.visibleTo || [])
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>(
    editingPost?.visibleToDepartments || []
  )
  const [attachments, setAttachments] = useState<Attachment[]>(editingPost?.attachments || [])
  const [taggedUsers, setTaggedUsers] = useState<string[]>(editingPost?.taggedUsers || [])
  const [scheduledAt, setScheduledAt] = useState<string>(
    editingPost?.scheduledAt ? new Date(editingPost.scheduledAt).toISOString().slice(0, 16) : ''
  )
  const [showPollDialog, setShowPollDialog] = useState(false)
  const [poll, setPoll] = useState<Poll | undefined>(editingPost?.poll)
  const [pollQuestion, setPollQuestion] = useState(editingPost?.poll?.question || '')
  const [pollOptions, setPollOptions] = useState<string[]>(
    editingPost?.poll?.options.map((o) => o.text) || ['', '']
  )
  const [pollMultipleChoice, setPollMultipleChoice] = useState(
    editingPost?.poll?.multipleChoice || false
  )
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const visibilityOptions = [
    { value: 'private', label: 'Rieng tu', icon: Lock },
    { value: 'specific', label: 'Chi dinh nguoi xem', icon: Users },
    { value: 'department', label: 'Phong ban', icon: Building2 },
    { value: 'company', label: 'Toan cong ty', icon: Globe },
  ]

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const url = URL.createObjectURL(file)
        setAttachments((prev) => [
          ...prev,
          { id: `att-${Date.now()}`, type: 'image', url, name: file.name },
        ])
      })
    }
  }

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const url = URL.createObjectURL(file)
        setAttachments((prev) => [
          ...prev,
          { id: `att-${Date.now()}`, type: 'video', url, name: file.name },
        ])
      })
    }
  }

  const handleStickerSelect = (stickerUrl: string) => {
    setAttachments((prev) => [
      ...prev,
      { id: `att-${Date.now()}`, type: 'sticker', url: stickerUrl },
    ])
  }

  const handleEmojiSelect = (emoji: string) => {
    setContent((prev) => prev + emoji)
  }

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id))
  }

  const toggleUserTag = (userId: string) => {
    setTaggedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((u) => u !== userId)
        : [...prev, userId]
    )
  }

  const toggleSelectedUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((u) => u !== userId)
        : [...prev, userId]
    )
  }

  const toggleSelectedDepartment = (deptId: string) => {
    setSelectedDepartments((prev) =>
      prev.includes(deptId)
        ? prev.filter((d) => d !== deptId)
        : [...prev, deptId]
    )
  }

  const savePoll = () => {
    const options: PollOption[] = pollOptions
      .filter((opt) => opt.trim())
      .map((opt, idx) => ({
        id: `opt-${idx}`,
        text: opt,
        votes: [],
      }))
    if (pollQuestion && options.length >= 2) {
      setPoll({
        id: `poll-${Date.now()}`,
        question: pollQuestion,
        options,
        multipleChoice: pollMultipleChoice,
      })
      setShowPollDialog(false)
    }
  }

  const removePoll = () => {
    setPoll(undefined)
    setPollQuestion('')
    setPollOptions(['', ''])
    setPollMultipleChoice(false)
  }

  const handleSubmit = () => {
    if (!content.trim() && attachments.length === 0 && !poll) return

    const now = new Date()
    const scheduled = scheduledAt ? new Date(scheduledAt) : undefined

    const postData: Post = {
      id: editingPost?.id || `post-${Date.now()}`,
      authorId: currentUser.id,
      content,
      visibility,
      visibleTo: visibility === 'specific' ? selectedUsers : undefined,
      visibleToDepartments: visibility === 'department' ? selectedDepartments : undefined,
      attachments,
      poll,
      taggedUsers,
      reactions: editingPost?.reactions || [],
      comments: editingPost?.comments || [],
      scheduledAt: scheduled,
      createdAt: editingPost?.createdAt || now,
      updatedAt: now,
      isPublished: !scheduled || scheduled <= now,
    }

    if (editingPost) {
      updatePost(postData)
    } else {
      addPost(postData)
    }

    setContent('')
    setVisibility('company')
    setSelectedUsers([])
    setSelectedDepartments([])
    setAttachments([])
    setTaggedUsers([])
    setScheduledAt('')
    setPoll(undefined)
    onClose?.()
  }

  const VisibilityIcon = visibilityOptions.find((v) => v.value === visibility)?.icon || Globe

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
            <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium text-foreground">{currentUser.name}</p>
            <Select value={visibility} onValueChange={(v) => setVisibility(v as Visibility)}>
              <SelectTrigger className="h-7 w-auto gap-1 border-none bg-muted px-2 text-xs">
                <VisibilityIcon className="h-3 w-3" />
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
      </CardHeader>
      <CardContent className="space-y-4">
        {visibility === 'specific' && (
          <div className="rounded-lg border border-border bg-muted/50 p-3">
            <p className="mb-2 text-sm font-medium text-foreground">Chon nguoi xem:</p>
            <div className="flex flex-wrap gap-2">
              {users
                .filter((u) => u.id !== currentUser.id)
                .map((user) => (
                  <Badge
                    key={user.id}
                    variant={selectedUsers.includes(user.id) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleSelectedUser(user.id)}
                  >
                    {user.name}
                  </Badge>
                ))}
            </div>
          </div>
        )}

        {visibility === 'department' && (
          <div className="rounded-lg border border-border bg-muted/50 p-3">
            <p className="mb-2 text-sm font-medium text-foreground">Chon phong ban:</p>
            <div className="flex flex-wrap gap-2">
              {departments.map((dept) => (
                <Badge
                  key={dept.id}
                  variant={selectedDepartments.includes(dept.id) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleSelectedDepartment(dept.id)}
                >
                  {dept.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Textarea
          placeholder="Ban dang nghi gi?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[100px] resize-none border-none bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
        />

        {taggedUsers.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Tag:</span>
            {taggedUsers.map((userId) => {
              const user = users.find((u) => u.id === userId)
              return user ? (
                <Badge key={userId} variant="secondary" className="gap-1">
                  @{user.name}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => toggleUserTag(userId)}
                  />
                </Badge>
              ) : null
            })}
          </div>
        )}

        {attachments.length > 0 && (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {attachments.map((att) => (
              <div key={att.id} className="relative">
                {att.type === 'image' || att.type === 'sticker' ? (
                  <img
                    src={att.url || "/placeholder.svg"}
                    alt={att.name || 'attachment'}
                    className="h-32 w-full rounded-lg object-cover"
                  />
                ) : (
                  <video
                    src={att.url}
                    className="h-32 w-full rounded-lg object-cover"
                    controls
                  />
                )}
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute -right-2 -top-2 h-6 w-6"
                  onClick={() => removeAttachment(att.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {poll && (
          <div className="rounded-lg border border-border bg-muted/50 p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-medium text-foreground">{poll.question}</p>
              <Button size="icon" variant="ghost" onClick={removePoll}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {poll.options.map((opt) => (
                <div
                  key={opt.id}
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                >
                  {opt.text}
                </div>
              ))}
            </div>
            {poll.multipleChoice && (
              <p className="mt-2 text-xs text-muted-foreground">
                Cho phep chon nhieu
              </p>
            )}
          </div>
        )}

        {scheduledAt && (
          <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground">
              Len lich: {new Date(scheduledAt).toLocaleString('vi-VN')}
            </span>
            <Button
              size="icon"
              variant="ghost"
              className="ml-auto h-6 w-6"
              onClick={() => setScheduledAt('')}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageUpload}
          />
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            multiple
            className="hidden"
            onChange={handleVideoUpload}
          />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className="mr-1 h-4 w-4" />
            Hinh anh
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => videoInputRef.current?.click()}
          >
            <Video className="mr-1 h-4 w-4" />
            Video
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm">
                <Sticker className="mr-1 h-4 w-4" />
                Sticker
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="grid grid-cols-2 gap-2">
                {stickers.map((sticker, idx) => (
                  <img
                    key={idx}
                    src={sticker || "/placeholder.svg"}
                    alt={`sticker-${idx}`}
                    className="h-20 w-full cursor-pointer rounded-lg object-cover hover:opacity-80"
                    onClick={() => handleStickerSelect(sticker)}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm">
                <Smile className="mr-1 h-4 w-4" />
                Emoji
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto">
              <div className="flex flex-wrap gap-1">
                {commonEmojis.map((emoji, idx) => (
                  <button
                    key={idx}
                    className="rounded p-2 text-xl hover:bg-muted"
                    onClick={() => handleEmojiSelect(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Dialog open={showPollDialog} onOpenChange={setShowPollDialog}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <BarChart3 className="mr-1 h-4 w-4" />
                Khao sat
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tao khao sat</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Cau hoi</Label>
                  <Input
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                    placeholder="Nhap cau hoi cua ban..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Lua chon</Label>
                  {pollOptions.map((opt, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Input
                        value={opt}
                        onChange={(e) => {
                          const newOptions = [...pollOptions]
                          newOptions[idx] = e.target.value
                          setPollOptions(newOptions)
                        }}
                        placeholder={`Lua chon ${idx + 1}`}
                      />
                      {pollOptions.length > 2 && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            setPollOptions((prev) =>
                              prev.filter((_, i) => i !== idx)
                            )
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPollOptions((prev) => [...prev, ''])}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Them lua chon
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="multiple"
                    checked={pollMultipleChoice}
                    onCheckedChange={(checked) =>
                      setPollMultipleChoice(checked === true)
                    }
                  />
                  <Label htmlFor="multiple">Cho phep chon nhieu</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowPollDialog(false)}>
                  Huy
                </Button>
                <Button onClick={savePoll}>Tao khao sat</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm">
                <Clock className="mr-1 h-4 w-4" />
                Len lich
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto">
              <div className="space-y-2">
                <Label>Chon thoi gian dang bai</Label>
                <Input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm">
                <AtSign className="mr-1 h-4 w-4" />
                Tag
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="space-y-2">
                <p className="text-sm font-medium">Tag nguoi lien quan</p>
                {users
                  .filter((u) => u.id !== currentUser.id)
                  .map((user) => (
                    <div
                      key={user.id}
                      className="flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-muted"
                      onClick={() => toggleUserTag(user.id)}
                    >
                      <Checkbox checked={taggedUsers.includes(user.id)} />
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{user.name}</span>
                    </div>
                  ))}
              </div>
            </PopoverContent>
          </Popover>

          <Button className="ml-auto" onClick={handleSubmit}>
            <Send className="mr-1 h-4 w-4" />
            {editingPost ? 'Cap nhat' : scheduledAt ? 'Len lich' : 'Dang bai'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
