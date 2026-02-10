"use client"

import React from "react"
import { useState, useRef } from "react"
import { useNewsfeed } from "@/lib/newsfeed-store"
import { stickers, commonEmojis } from "@/lib/mock-data"
import type { Post, Visibility, Attachment, Poll, PollOption } from "@/lib/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ImageIcon,
  Video,
  BarChart3,
  X,
  Camera,
  Globe,
  Lock,
  Users,
  Building2,
  ChevronRight,
  Smile,
  Sticker,
  Clock,
  AtSign,
  Plus,
  Trash2,
  Check,
} from "lucide-react"

export function MobilePostComposer() {
  const { currentUser, users, departments, addPost } = useNewsfeed()
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState("")
  const [isPosting, setIsPosting] = useState(false)
  const [visibility, setVisibility] = useState<Visibility>("company")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([])
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [taggedUsers, setTaggedUsers] = useState<string[]>([])
  const [scheduledAt, setScheduledAt] = useState<string>("")
  const [poll, setPoll] = useState<Poll | undefined>()
  const [pollQuestion, setPollQuestion] = useState("")
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""])
  const [pollMultipleChoice, setPollMultipleChoice] = useState(false)

  // Sheet states
  const [showVisibilitySheet, setShowVisibilitySheet] = useState(false)
  const [showPollSheet, setShowPollSheet] = useState(false)
  const [showEmojiSheet, setShowEmojiSheet] = useState(false)
  const [showStickerSheet, setShowStickerSheet] = useState(false)
  const [showTagSheet, setShowTagSheet] = useState(false)
  const [showScheduleSheet, setShowScheduleSheet] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const visibilityOptions = [
    { value: "company", label: "Toan cong ty", icon: Globe, description: "Moi nguoi trong cong ty deu co the xem" },
    { value: "department", label: "Phong ban", icon: Building2, description: "Chi nguoi trong phong ban duoc chon" },
    { value: "specific", label: "Chi dinh nguoi xem", icon: Users, description: "Chi nhung nguoi duoc chon" },
    { value: "private", label: "Rieng tu", icon: Lock, description: "Chi minh ban co the xem" },
  ]

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const url = URL.createObjectURL(file)
        setAttachments((prev) => [
          ...prev,
          { id: `att-${Date.now()}`, type: "image", url, name: file.name },
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
          { id: `att-${Date.now()}`, type: "video", url, name: file.name },
        ])
      })
    }
  }

  const handleStickerSelect = (stickerUrl: string) => {
    setAttachments((prev) => [
      ...prev,
      { id: `att-${Date.now()}`, type: "sticker", url: stickerUrl },
    ])
    setShowStickerSheet(false)
  }

  const handleEmojiSelect = (emoji: string) => {
    setContent((prev) => prev + emoji)
  }

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id))
  }

  const toggleUserTag = (userId: string) => {
    setTaggedUsers((prev) =>
      prev.includes(userId) ? prev.filter((u) => u !== userId) : [...prev, userId]
    )
  }

  const toggleSelectedUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((u) => u !== userId) : [...prev, userId]
    )
  }

  const toggleSelectedDepartment = (deptId: string) => {
    setSelectedDepartments((prev) =>
      prev.includes(deptId) ? prev.filter((d) => d !== deptId) : [...prev, deptId]
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
      setShowPollSheet(false)
    }
  }

  const removePoll = () => {
    setPoll(undefined)
    setPollQuestion("")
    setPollOptions(["", ""])
    setPollMultipleChoice(false)
  }

  const resetForm = () => {
    setContent("")
    setVisibility("company")
    setSelectedUsers([])
    setSelectedDepartments([])
    setAttachments([])
    setTaggedUsers([])
    setScheduledAt("")
    setPoll(undefined)
    setPollQuestion("")
    setPollOptions(["", ""])
    setPollMultipleChoice(false)
  }

  const handlePost = async () => {
    if (!content.trim() && attachments.length === 0 && !poll) return

    setIsPosting(true)

    const now = new Date()
    const scheduled = scheduledAt ? new Date(scheduledAt) : undefined

    const postData: Post = {
      id: `post-${Date.now()}`,
      authorId: currentUser.id,
      content,
      visibility,
      visibleTo: visibility === "specific" ? selectedUsers : undefined,
      visibleToDepartments: visibility === "department" ? selectedDepartments : undefined,
      attachments,
      poll,
      taggedUsers,
      reactions: [],
      comments: [],
      scheduledAt: scheduled,
      createdAt: now,
      updatedAt: now,
      isPublished: !scheduled || scheduled <= now,
    }

    addPost(postData)
    resetForm()
    setIsPosting(false)
    setIsOpen(false)
  }

  const VisibilityIcon = visibilityOptions.find((v) => v.value === visibility)?.icon || Globe
  const visibilityLabel = visibilityOptions.find((v) => v.value === visibility)?.label || "Toan cong ty"

  return (
    <>
      {/* Compact Composer Bar */}
      <div className="bg-background border-b border-border">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex w-full items-center gap-3 px-4 py-3"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
            <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 rounded-full bg-muted px-4 py-2.5 text-left text-sm text-muted-foreground">
            Ban dang nghi gi?
          </div>
        </button>

        {/* Quick Actions */}
        <div className="flex border-t border-border">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex flex-1 items-center justify-center gap-2 py-2.5 text-sm text-muted-foreground"
          >
            <Camera className="h-5 w-5 text-green-500" />
            <span>Anh/Video</span>
          </button>
          <div className="w-px bg-border" />
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex flex-1 items-center justify-center gap-2 py-2.5 text-sm text-muted-foreground"
          >
            <BarChart3 className="h-5 w-5 text-amber-500" />
            <span>Khao sat</span>
          </button>
        </div>
      </div>

      {/* Full Screen Composer Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="flex h-full max-h-screen w-full max-w-full flex-col rounded-none p-0 sm:rounded-none">
          <DialogHeader className="flex-row items-center justify-between border-b border-border px-4 py-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-9 w-9"
            >
              <X className="h-5 w-5" />
            </Button>
            <DialogTitle className="text-base font-semibold">Tao bai viet</DialogTitle>
            <Button
              onClick={handlePost}
              disabled={(!content.trim() && attachments.length === 0 && !poll) || isPosting}
              size="sm"
              className="bg-primary px-4"
            >
              {isPosting ? "Dang..." : "Dang"}
            </Button>
          </DialogHeader>

          <ScrollArea className="flex-1">
            <div className="p-4">
              {/* User Info & Visibility */}
              <div className="mb-4 flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
                  <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">{currentUser.name}</p>
                  <button
                    type="button"
                    onClick={() => setShowVisibilitySheet(true)}
                    className="flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                  >
                    <VisibilityIcon className="h-3 w-3" />
                    {visibilityLabel}
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Visibility Detail */}
              {visibility === "specific" && selectedUsers.length > 0 && (
                <div className="mb-4 rounded-lg bg-muted/50 p-3">
                  <p className="mb-2 text-xs text-muted-foreground">Chi dinh nguoi xem:</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedUsers.map((userId) => {
                      const user = users.find((u) => u.id === userId)
                      return user ? (
                        <Badge key={userId} variant="secondary" className="text-xs">
                          {user.name}
                        </Badge>
                      ) : null
                    })}
                  </div>
                </div>
              )}

              {visibility === "department" && selectedDepartments.length > 0 && (
                <div className="mb-4 rounded-lg bg-muted/50 p-3">
                  <p className="mb-2 text-xs text-muted-foreground">Phong ban:</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedDepartments.map((deptId) => {
                      const dept = departments.find((d) => d.id === deptId)
                      return dept ? (
                        <Badge key={deptId} variant="secondary" className="text-xs">
                          {dept.name}
                        </Badge>
                      ) : null
                    })}
                  </div>
                </div>
              )}

              {/* Content Input */}
              <Textarea
                placeholder="Ban dang nghi gi?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[150px] resize-none border-0 p-0 text-lg focus-visible:ring-0"
                autoFocus
              />

              {/* Tagged Users */}
              {taggedUsers.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-sm text-muted-foreground">Tag:</span>
                  {taggedUsers.map((userId) => {
                    const user = users.find((u) => u.id === userId)
                    return user ? (
                      <Badge key={userId} variant="secondary" className="gap-1">
                        @{user.name}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => toggleUserTag(userId)} />
                      </Badge>
                    ) : null
                  })}
                </div>
              )}

              {/* Attachments */}
              {attachments.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {attachments.map((att) => (
                    <div key={att.id} className="relative">
                      {att.type === "image" || att.type === "sticker" ? (
                        <img
                          src={att.url || "/placeholder.svg"}
                          alt={att.name || "attachment"}
                          className="h-32 w-full rounded-lg object-cover"
                        />
                      ) : (
                        <video src={att.url} className="h-32 w-full rounded-lg object-cover" controls />
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

              {/* Poll Preview */}
              {poll && (
                <div className="mt-4 rounded-lg border border-border bg-muted/50 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-medium text-foreground">{poll.question}</p>
                    <Button size="icon" variant="ghost" onClick={removePoll}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {poll.options.map((opt) => (
                      <div key={opt.id} className="rounded-md border border-border bg-background px-3 py-2 text-sm">
                        {opt.text}
                      </div>
                    ))}
                  </div>
                  {poll.multipleChoice && (
                    <p className="mt-2 text-xs text-muted-foreground">Cho phep chon nhieu</p>
                  )}
                </div>
              )}

              {/* Schedule Preview */}
              {scheduledAt && (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1 text-sm text-foreground">
                    Len lich: {new Date(scheduledAt).toLocaleString("vi-VN")}
                  </span>
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setScheduledAt("")}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Bottom Actions */}
          <div className="border-t border-border p-4">
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

            <div className="flex flex-wrap gap-1">
                <Button variant="ghost" size="sm" className="flex-shrink-0" onClick={() => fileInputRef.current?.click()}>
                  <ImageIcon className="mr-1 h-5 w-5 text-green-500" />
                  Anh
                </Button>
                <Button variant="ghost" size="sm" className="flex-shrink-0" onClick={() => videoInputRef.current?.click()}>
                  <Video className="mr-1 h-5 w-5 text-red-500" />
                  Video
                </Button>
                <Button variant="ghost" size="sm" className="flex-shrink-0" onClick={() => setShowStickerSheet(true)}>
                  <Sticker className="mr-1 h-5 w-5 text-purple-500" />
                  Sticker
                </Button>
                <Button variant="ghost" size="sm" className="flex-shrink-0" onClick={() => setShowEmojiSheet(true)}>
                  <Smile className="mr-1 h-5 w-5 text-amber-500" />
                  Emoji
                </Button>
                <Button variant="ghost" size="sm" className="flex-shrink-0" onClick={() => setShowPollSheet(true)}>
                  <BarChart3 className="mr-1 h-5 w-5 text-blue-500" />
                  Khao sat
                </Button>
                <Button variant="ghost" size="sm" className="flex-shrink-0" onClick={() => setShowScheduleSheet(true)}>
                  <Clock className="mr-1 h-5 w-5 text-orange-500" />
                  Len lich
                </Button>
                <Button variant="ghost" size="sm" className="flex-shrink-0" onClick={() => setShowTagSheet(true)}>
                  <AtSign className="mr-1 h-5 w-5 text-cyan-500" />
                  Tag
                </Button>
              </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Visibility Sheet */}
      <Sheet open={showVisibilitySheet} onOpenChange={setShowVisibilitySheet}>
        <SheetContent side="bottom" className="h-auto max-h-[80vh] rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>Ai co the xem bai viet nay?</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-2">
            {visibilityOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setVisibility(opt.value as Visibility)
                  if (opt.value !== "specific" && opt.value !== "department") {
                    setShowVisibilitySheet(false)
                  }
                }}
                className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors ${
                  visibility === opt.value ? "bg-primary/10" : "hover:bg-muted"
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    visibility === opt.value ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <opt.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{opt.label}</p>
                  <p className="text-xs text-muted-foreground">{opt.description}</p>
                </div>
                {visibility === opt.value && <Check className="h-5 w-5 text-primary" />}
              </button>
            ))}
          </div>

          {/* Specific Users Selection */}
          {visibility === "specific" && (
            <div className="mt-4 border-t border-border pt-4">
              <p className="mb-3 font-medium">Chon nguoi xem:</p>
              <ScrollArea className="h-48">
                <div className="space-y-2">
                  {users
                    .filter((u) => u.id !== currentUser.id)
                    .map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => toggleSelectedUser(user.id)}
                        className={`flex w-full items-center gap-3 rounded-lg p-2 text-left ${
                          selectedUsers.includes(user.id) ? "bg-primary/10" : "hover:bg-muted"
                        }`}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="flex-1 text-sm">{user.name}</span>
                        {selectedUsers.includes(user.id) && <Check className="h-4 w-4 text-primary" />}
                      </button>
                    ))}
                </div>
              </ScrollArea>
              <Button className="mt-4 w-full" onClick={() => setShowVisibilitySheet(false)}>
                Xong ({selectedUsers.length} nguoi)
              </Button>
            </div>
          )}

          {/* Department Selection */}
          {visibility === "department" && (
            <div className="mt-4 border-t border-border pt-4">
              <p className="mb-3 font-medium">Chon phong ban:</p>
              <div className="space-y-2">
                {departments.map((dept) => (
                  <button
                    key={dept.id}
                    type="button"
                    onClick={() => toggleSelectedDepartment(dept.id)}
                    className={`flex w-full items-center gap-3 rounded-lg p-2 text-left ${
                      selectedDepartments.includes(dept.id) ? "bg-primary/10" : "hover:bg-muted"
                    }`}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <span className="flex-1 text-sm">{dept.name}</span>
                    {selectedDepartments.includes(dept.id) && <Check className="h-4 w-4 text-primary" />}
                  </button>
                ))}
              </div>
              <Button className="mt-4 w-full" onClick={() => setShowVisibilitySheet(false)}>
                Xong ({selectedDepartments.length} phong ban)
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Poll Dialog */}
      <Dialog open={showPollSheet} onOpenChange={setShowPollSheet}>
        <DialogContent className="max-w-[95vw] rounded-xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tao khao sat</DialogTitle>
          </DialogHeader>
          <div className="mt-2 space-y-4">
            <div>
              <Label>Cau hoi</Label>
              <Input
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                placeholder="Nhap cau hoi cua ban..."
                className="mt-1"
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
                      onClick={() => setPollOptions((prev) => prev.filter((_, i) => i !== idx))}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-transparent"
                onClick={() => setPollOptions((prev) => [...prev, ""])}
              >
                <Plus className="mr-1 h-4 w-4" />
                Them lua chon
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="multiple-mobile"
                checked={pollMultipleChoice}
                onCheckedChange={(checked) => setPollMultipleChoice(checked === true)}
              />
              <Label htmlFor="multiple-mobile">Cho phep chon nhieu</Label>
            </div>
          </div>
          <DialogFooter className="flex-row gap-2">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowPollSheet(false)}>
              Huy
            </Button>
            <Button className="flex-1" onClick={savePoll}>
              Tao khao sat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Emoji Sheet */}
      <Sheet open={showEmojiSheet} onOpenChange={setShowEmojiSheet}>
        <SheetContent side="bottom" className="h-auto max-h-[50vh] rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>Chon emoji</SheetTitle>
          </SheetHeader>
          <div className="mt-4 flex flex-wrap gap-2">
            {commonEmojis.map((emoji, idx) => (
              <button
                key={idx}
                className="rounded-lg p-3 text-2xl hover:bg-muted active:bg-muted"
                onClick={() => handleEmojiSelect(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Sticker Sheet */}
      <Sheet open={showStickerSheet} onOpenChange={setShowStickerSheet}>
        <SheetContent side="bottom" className="h-auto max-h-[60vh] rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>Chon sticker</SheetTitle>
          </SheetHeader>
          <ScrollArea className="mt-4 h-64">
            <div className="grid grid-cols-2 gap-2">
              {stickers.map((sticker, idx) => (
                <img
                  key={idx}
                  src={sticker || "/placeholder.svg"}
                  alt={`sticker-${idx}`}
                  className="h-24 w-full cursor-pointer rounded-lg object-cover hover:opacity-80 active:opacity-60"
                  onClick={() => handleStickerSelect(sticker)}
                />
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Tag Sheet */}
      <Sheet open={showTagSheet} onOpenChange={setShowTagSheet}>
        <SheetContent side="bottom" className="h-auto max-h-[70vh] rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>Tag nguoi lien quan</SheetTitle>
          </SheetHeader>
          <ScrollArea className="mt-4 h-64">
            <div className="space-y-2">
              {users
                .filter((u) => u.id !== currentUser.id)
                .map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => toggleUserTag(user.id)}
                    className={`flex w-full items-center gap-3 rounded-lg p-2 text-left ${
                      taggedUsers.includes(user.id) ? "bg-primary/10" : "hover:bg-muted"
                    }`}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.department.name}</p>
                    </div>
                    {taggedUsers.includes(user.id) && <Check className="h-5 w-5 text-primary" />}
                  </button>
                ))}
            </div>
          </ScrollArea>
          <Button className="mt-4 w-full" onClick={() => setShowTagSheet(false)}>
            Xong ({taggedUsers.length} nguoi)
          </Button>
        </SheetContent>
      </Sheet>

      {/* Schedule Sheet */}
      <Sheet open={showScheduleSheet} onOpenChange={setShowScheduleSheet}>
        <SheetContent side="bottom" className="h-auto rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>Len lich dang bai</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            <div>
              <Label>Chon thoi gian</Label>
              <Input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="mt-1"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => {
                  setScheduledAt("")
                  setShowScheduleSheet(false)
                }}
              >
                Xoa lich
              </Button>
              <Button className="flex-1" onClick={() => setShowScheduleSheet(false)}>
                Xong
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
