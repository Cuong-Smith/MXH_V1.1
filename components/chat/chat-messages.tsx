"use client"

import React from "react"
import { Search, Users, ChevronRight, Plus, Hash, Send, Image as LucideImage, Paperclip, Smile, CheckCircle2, Video, AlarmClock, FileUp, BarChart2, BellOff, ThumbsUp, MoreHorizontal, Heart, Reply, Forward, Pin, Trash2, ClipboardCheck, X, Layers, Phone, ChevronDown, Bot, Share2, ExternalLink, Flag, Zap, Calendar, MessageSquare, Settings2, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { CreatePollDialog } from "./create-poll-dialog"
import { CreateThreadDialog } from "./create-thread-dialog"
import { CreateTaskDialog } from "./create-task-dialog"
import { CreateMeetingDialog } from "./create-meeting-dialog"
import { CreateMissionDialog } from "./create-mission-dialog"
import { SelectProcessDialog } from "./select-process-dialog"
import { EmojiPicker } from "./emoji-picker"
import { TodolistDetailDialog } from "./todolist-detail-dialog"
import { MeetingDetailDialog } from "./meeting-detail-dialog"
import { ProcessDetailDialog } from "./process-detail-dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

export interface Message {
    id: string
    type?: string
    title?: string
    date: string
    content: string
    time?: string
    author?: string
    avatar?: string
    tags?: string[]
    options?: string[]
    isSelf?: boolean
    replyTo?: {
        author: string
        content: string
    }
    hasHeart?: boolean
    isPinned?: boolean
    isAutomated?: boolean
    messageCount?: number
    linkPreview?: {
        type: 'todolist' | 'meeting' | 'workflow'
        title: string
        time: string
        status: string
        isLate?: boolean
        assigner?: { name: string; avatar: string }
        description?: string
        source: 'message' | 'workflow' | 'meeting'
        category?: string
        location?: string
        participants?: Array<{ name: string; avatar: string }>
        url: string
    }
}



interface ChatMessagesProps {
    onThreadClick?: (thread: Message) => void
    activeChatId?: string
    isGroup?: boolean
    messages: Message[]
    onUpdateMessages: (messages: Message[]) => void
    chatName?: string
}

export function ChatMessages({ onThreadClick, activeChatId = "1", isGroup = true, messages, onUpdateMessages, chatName }: ChatMessagesProps) {
    const [pollOpen, setPollOpen] = React.useState(false)
    const [threadOpen, setThreadOpen] = React.useState(false)
    const [taskDialogOpen, setTaskDialogOpen] = React.useState(false)
    const [meetingDialogOpen, setMeetingDialogOpen] = React.useState(false)
    const [missionDialogOpen, setMissionDialogOpen] = React.useState(false)
    const [processDialogOpen, setProcessDialogOpen] = React.useState(false)
    const [todolistDetailOpen, setTodolistDetailOpen] = React.useState(false)
    const [meetingDetailOpen, setMeetingDetailOpen] = React.useState(false)
    const [processDetailOpen, setProcessDetailOpen] = React.useState(false)
    const [selectedProcessId, setSelectedProcessId] = React.useState<string | null>(null)
    const [selectedMessageForTask, setSelectedMessageForTask] = React.useState<Message | null>(null)
    const [selectedMessageForMeeting, setSelectedMessageForMeeting] = React.useState<Message | null>(null)
    // messages state moved to parent
    const [messageInput, setMessageInput] = React.useState("")
    const [replyMessage, setReplyMessage] = React.useState<Message | null>(null)
    const [showPinnedList, setShowPinnedList] = React.useState(false)
    const [showMentions, setShowMentions] = React.useState(false)
    const [mentionQuery, setMentionQuery] = React.useState("")
    const [mentionStartPos, setMentionStartPos] = React.useState(0)
    const [showAIPrompts, setShowAIPrompts] = React.useState(false)
    const scrollRef = React.useRef<HTMLDivElement>(null)
    const mentionDropdownRef = React.useRef<HTMLDivElement>(null)
    const aiPromptsDropdownRef = React.useRef<HTMLDivElement>(null)

    const handleDialogSubmit = (previewData: any) => {
        const newMessage: Message = {
            id: Date.now().toString(),
            type: "text", // Crucial: must be "text" to trigger the correct rendering block
            isAutomated: true,
            author: "Bạn",
            avatar: "/placeholder.svg",
            content: previewData.type === 'todolist' ? "https://work.fastdo.vn/todolist/" :
                previewData.type === 'meeting' ? "https://work.fastdo.vn/todolist/meeting" :
                    "https://work.fastdo.vn/todolist/workflow",
            date: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            isSelf: true,
            linkPreview: {
                ...previewData,
                title: previewData.title.toUpperCase(), // Match uppercase style in screenshot
                time: "10/02/26 17:30",
                status: "Todo",
                isLate: true, // Match "Trễ" badge in screenshot
                url: previewData.type === 'meeting' ? "https://work.fastdo.vn/todolist/meeting" : "https://work.fastdo.vn/todolist",
                source: previewData.type === 'workflow' ? 'workflow' :
                    previewData.type === 'meeting' ? 'meeting' : 'message',
                assigner: {
                    name: "Hoàng Tuấn Cường",
                    avatar: "https://i.pravatar.cc/150?u=cuong"
                },
                participants: [
                    { name: 'User 1', avatar: 'https://i.pravatar.cc/150?u=user1' },
                    { name: 'User 2', avatar: 'https://i.pravatar.cc/150?u=user2' },
                    { name: 'User 3', avatar: 'https://i.pravatar.cc/150?u=user3' }
                ]
            }
        }
        onUpdateMessages([...messages, newMessage])
    }

    // Removed useEffect for fetching messages

    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    // Click outside to close dropdowns
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (mentionDropdownRef.current && !mentionDropdownRef.current.contains(event.target as Node)) {
                setShowMentions(false)
            }
            if (aiPromptsDropdownRef.current && !aiPromptsDropdownRef.current.contains(event.target as Node)) {
                setShowAIPrompts(false)
            }
        }

        if (showMentions || showAIPrompts) {
            document.addEventListener('mousedown', handleClickOutside)
            return () => {
                document.removeEventListener('mousedown', handleClickOutside)
            }
        }
    }, [showMentions, showAIPrompts])

    const handleSendMessage = () => {
        if (!messageInput.trim()) return

        // Detect work.fastdo.vn URLs
        const workUrlRegex = /https?:\/\/work\.fastdo\.vn\/todolist[^\s]*/gi
        const workUrl = messageInput.match(workUrlRegex)?.[0]


        let linkPreview = undefined
        if (workUrl) {
            // Determine type from URL
            const urlType = workUrl.includes('/meeting') ? 'meeting'
                : workUrl.includes('/workflow') ? 'workflow'
                    : 'todolist'

            // Mock data based on type
            if (urlType === 'todolist') {
                linkPreview = {
                    type: 'todolist' as const,
                    title: 'BÁO CÁO CHAT',
                    time: '10/02/26 17:30',
                    status: 'Todo',
                    isLate: true,
                    assigner: { name: 'Hoàng Tuấn Cường', avatar: 'https://i.pravatar.cc/150?u=cuong' },
                    description: 'Phân tích một số điểm còn thiếu sót và cải thiện UI/UX của chat desktoplink',
                    source: 'message' as const,
                    participants: [
                        { name: 'User 1', avatar: 'https://i.pravatar.cc/150?u=user1' }
                    ],
                    url: workUrl
                }
            } else if (urlType === 'meeting') {
                linkPreview = {
                    type: 'meeting' as const,
                    title: 'DAILY REPORT!',
                    time: '10/02/26 23:59',
                    status: 'Todo',
                    isLate: true,
                    assigner: { name: 'Nguyễn Thị Hồng Hạnh', avatar: 'https://i.pravatar.cc/150?u=hanh' },
                    description: 'HÔM QUA TÔI ĐÃ LÀM GÌ? TIẾN ĐỘ CÔNG VIỆC?',
                    source: 'meeting' as const,
                    participants: [
                        { name: 'User 1', avatar: 'https://i.pravatar.cc/150?u=user1' },
                        { name: 'User 2', avatar: 'https://i.pravatar.cc/150?u=user2' },
                        { name: 'User 3', avatar: 'https://i.pravatar.cc/150?u=user3' }
                    ],
                    url: workUrl
                }
            } else if (urlType === 'workflow') {
                linkPreview = {
                    type: 'workflow' as const,
                    title: 'Retest production _ [794] - KHÔNG đồng bộ giữa công tính lươn...',
                    time: '11/02/26 17:30',
                    status: 'Todo',
                    isLate: false,
                    assigner: { name: 'Tester', avatar: 'https://i.pravatar.cc/150?u=tester' },
                    description: 'Tester tiến hành retest trên môi trường production',
                    source: 'workflow' as const,
                    category: 'Quy trình',
                    participants: [
                        { name: 'User 1', avatar: 'https://i.pravatar.cc/150?u=user1' }
                    ],
                    url: workUrl
                }
            }
        }

        const newMessage: Message = {
            id: Date.now().toString(),
            type: "text",
            title: "",
            date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            content: messageInput,
            author: "Bạn",
            tags: [],
            isSelf: true,
            linkPreview,
            replyTo: replyMessage ? {
                author: replyMessage.author || "Người dùng",
                content: replyMessage.content
            } : undefined
        }

        onUpdateMessages([...messages, newMessage])
        setMessageInput("")
        setReplyMessage(null)
    }

    const handleEmojiSelect = (emoji: string) => {
        setMessageInput(prev => prev + emoji)
    }

    const handleCreatePoll = (pollData: { question: string; options: string[] }) => {
        const newPollMessage = {
            id: Date.now().toString(),
            type: "poll",
            title: "BÌNH CHỌN MỚI",
            date: new Date().toLocaleString(),
            content: pollData.question,
            options: pollData.options,
            author: "Bạn",
            tags: ["Thăm dò ý kiến"]
        }
        onUpdateMessages([...messages, newPollMessage])
    }

    const toggleReaction = (id: string) => {
        onUpdateMessages(messages.map(msg =>
            msg.id === id ? { ...msg, hasHeart: !msg.hasHeart } : msg
        ))
    }

    const togglePin = (id: string) => {
        onUpdateMessages(messages.map(msg =>
            msg.id === id ? { ...msg, isPinned: !msg.isPinned } : msg
        ))
    }

    const handleLinkPreviewStatusChange = (id: string, newStatus: string) => {
        onUpdateMessages(messages.map(msg =>
            msg.id === id && msg.linkPreview ? {
                ...msg,
                linkPreview: { ...msg.linkPreview, status: newStatus }
            } : msg
        ))
    }

    const handleCreateThread = (threadName: string) => {
        const newThreadMessage: Message = {
            id: Date.now().toString(),
            type: "thread",
            title: threadName,
            date: new Date().toLocaleString(),
            content: "Không có tin nhắn nào gần đây trong chủ đề này.",
            author: "Bạn",
            messageCount: 0
        }
        onUpdateMessages([...messages, newThreadMessage])
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setMessageInput(value)

        // Detect @ mention
        const cursorPos = e.target.selectionStart || 0
        const textBeforeCursor = value.slice(0, cursorPos)
        const lastAtIndex = textBeforeCursor.lastIndexOf('@')

        if (lastAtIndex !== -1) {
            const textAfterAt = textBeforeCursor.slice(lastAtIndex + 1)
            // Check if there's no space after @
            if (!textAfterAt.includes(' ')) {
                console.log('[Mention] Showing dropdown, query:', textAfterAt)
                setShowMentions(true)
                setMentionQuery(textAfterAt.toLowerCase())
                setMentionStartPos(lastAtIndex)
            } else {
                setShowMentions(false)
            }
        } else {
            setShowMentions(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        } else if (e.key === "Escape") {
            if (showMentions) {
                setShowMentions(false)
            } else if (showAIPrompts) {
                setShowAIPrompts(false)
            }
        }
    }

    const handleMentionSelect = (mention: string) => {
        const beforeMention = messageInput.slice(0, mentionStartPos)
        const afterMention = messageInput.slice(mentionStartPos + mentionQuery.length + 1)
        setMessageInput(beforeMention + '@' + mention + ' ')
        setShowMentions(false)

        // Show AI prompts if @AI was selected
        if (mention === 'AI') {
            setShowAIPrompts(true)
        }
    }

    const handleAIPromptSelect = (prompt: string) => {
        setMessageInput(prev => prev + prompt)
        setShowAIPrompts(false)
    }

    // AI Quick Prompts
    const AI_QUICK_PROMPTS = [
        "Tóm tắt những thông tin tôi bỏ lỡ",
        "Tóm tắt cuộc trò chuyện này",
        "Giải thích tin nhắn phía trên",
        "Dịch sang tiếng Anh",
        "Tạo danh sách công việc từ cuộc trò chuyện",
    ]

    // Mock members data
    const MOCK_MEMBERS = [
        { name: "Nguyễn Thị Hồng Hạnh", avatar: "https://i.pravatar.cc/150?u=hanh" },
        { name: "Phạm Thị Quỳnh Như", avatar: "https://i.pravatar.cc/150?u=nhu" },
        { name: "Bùi Anh Tuấn", avatar: "https://i.pravatar.cc/150?u=tuan" },
    ]

    const mentionSuggestions = [
        { type: 'special', name: 'nhom', label: '@nhom', icon: Users },
        { type: 'special', name: 'AI', label: '@AI', icon: Bot },
        ...MOCK_MEMBERS.map(m => ({ type: 'member', name: m.name, label: m.name, avatar: m.avatar }))
    ].filter(s => s.name.toLowerCase().includes(mentionQuery))

    console.log('[Mention] State:', { showMentions, mentionQuery, suggestionsCount: mentionSuggestions.length })

    const handleCreateTaskTrigger = (msg: Message) => {
        setSelectedMessageForTask(msg)
        setTaskDialogOpen(true)
    }

    const handleCreateMeetingTrigger = (msg: Message) => {
        setSelectedMessageForMeeting(msg)
        setMeetingDialogOpen(true)
    }

    return (
        <TooltipProvider>
            <div className="flex flex-1 flex-col h-full bg-[#F0F2F5]">
                {/* Header */}
                <header className="flex h-14 items-center justify-between border-b bg-background px-4">
                    <div className="flex items-center gap-2">
                        <Hash className="h-5 w-5 text-primary" />
                        <h2 className="font-semibold">{chatName || "Trò chuyện"}</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        {isGroup && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-1 rounded-full px-3"
                                onClick={() => setThreadOpen(true)}
                            >
                                <Plus className="h-4 w-4" />
                                Tạo thread
                            </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary">
                            <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary">
                            <Video className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost" size="icon" className="h-9 w-9">
                            <Search className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <Users className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </header>

                {/* Pinned Messages Bar */}
                {messages.some(m => m.isPinned) && (
                    <div className="bg-white/80 backdrop-blur-sm border-b shadow-sm relative z-10">
                        <div
                            className="px-4 py-2 flex items-center justify-between text-xs text-muted-foreground cursor-pointer hover:bg-white/50 transition-colors"
                            onClick={() => setShowPinnedList(!showPinnedList)}
                        >
                            <div className="flex items-center gap-2 overflow-hidden">
                                <Pin className="h-3.5 w-3.5 text-primary fill-current rotate-45 shrink-0" />
                                <div className="flex flex-col">
                                    <span className="font-semibold text-foreground">Tin nhắn đã ghim</span>
                                    {!showPinnedList && (
                                        <span className="truncate max-w-[300px] sm:max-w-[400px]">
                                            {messages.filter(m => m.isPinned).slice(-1)[0].content}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center">
                                {!showPinnedList && messages.filter(m => m.isPinned).length > 1 && (
                                    <Badge variant="secondary" className="ml-2 shrink-0">
                                        +{messages.filter(m => m.isPinned).length - 1}
                                    </Badge>
                                )}
                                <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 shrink-0">
                                    <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", showPinnedList && "rotate-180")} />
                                </Button>
                            </div>
                        </div>

                        {/* Expanded Pinned List */}
                        {showPinnedList && (
                            <div className="max-h-[200px] overflow-y-auto border-t bg-white/50">
                                {messages.filter(m => m.isPinned).slice().reverse().map((msg) => (
                                    <div key={msg.id} className="px-4 py-2 border-b last:border-0 hover:bg-white/80 transition-colors flex gap-3 group">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="font-semibold text-xs text-foreground">{msg.author}</span>
                                                <span className="text-[10px] text-muted-foreground">{msg.date}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground truncate">{msg.content}</p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                togglePin(msg.id)
                                            }}
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Message Feed */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
                    {messages.map((msg) => {
                        const isSelf = msg.isSelf;

                        if (msg.type === "text") {
                            return (
                                <div key={msg.id} className={cn("flex w-full mb-2", isSelf ? "justify-end" : "justify-start")}>
                                    <div className={cn("flex max-w-[75%] gap-2", isSelf ? "flex-row-reverse" : "flex-row")}>
                                        {!isSelf && (
                                            <Avatar className="h-8 w-8 mt-6">
                                                <AvatarImage src={`https://i.pravatar.cc/150?u=${encodeURIComponent(msg.author || "User")}`} />
                                                <AvatarFallback>{msg.author?.[0] || "U"}</AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div className="flex flex-col gap-1">
                                            {!isSelf && (
                                                <span className="text-[11px] text-muted-foreground font-medium ml-1">
                                                    {msg.author}
                                                </span>
                                            )}
                                            <div className={cn(
                                                "px-4 py-2 rounded-[18px] text-[14px] leading-relaxed shadow-sm group relative",
                                                isSelf
                                                    ? (msg.linkPreview ? "bg-transparent text-foreground shadow-none p-0" : "bg-[#00A3FF] text-white rounded-tr-[4px]")
                                                    : "bg-white text-foreground border rounded-tl-[4px]"
                                            )}>
                                                {msg.replyTo && (
                                                    <div className={cn(
                                                        "mb-2 p-2 rounded-lg text-[13px] border-l-2",
                                                        isSelf
                                                            ? "bg-white/10 border-white/50 text-white/90"
                                                            : "bg-muted/50 border-primary text-muted-foreground"
                                                    )}>
                                                        <div className="font-bold text-[11px] mb-0.5">
                                                            {msg.replyTo.author}
                                                        </div>
                                                        <div className="truncate opacity-80">
                                                            {msg.replyTo.content}
                                                        </div>
                                                    </div>
                                                )}
                                                {msg.linkPreview && !isSelf && !msg.isAutomated && msg.content}
                                                {msg.linkPreview && isSelf && !msg.isAutomated && <div className="text-[#00A3FF] text-[15px] font-bold mb-3 px-1 hover:underline cursor-pointer">{msg.content}</div>}
                                                {!msg.linkPreview && msg.content}

                                                {/* Redesigned Link Preview Card */}
                                                {msg.linkPreview && (
                                                    <div
                                                        className="mt-2 border rounded-xl p-6 bg-white shadow-xl hover:shadow-2xl transition-all cursor-pointer border-slate-100 max-w-[650px]"
                                                        onClick={() => {
                                                            if (msg.linkPreview?.type === 'todolist') {
                                                                setTodolistDetailOpen(true)
                                                            } else if (msg.linkPreview?.type === 'meeting') {
                                                                setMeetingDetailOpen(true)
                                                            } else if (msg.linkPreview?.type === 'workflow') {
                                                                setProcessDetailOpen(true)
                                                            }
                                                        }}
                                                    >
                                                        {/* Row 1: Header */}
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div className="flex items-center gap-2">
                                                                <h4 className={`text-[19px] font-black uppercase tracking-tight ${msg.linkPreview.status === 'Done' ? 'text-green-600 line-through opacity-70' :
                                                                    msg.linkPreview.status === 'Cancel' ? 'text-slate-400 line-through opacity-50' :
                                                                        'text-slate-900'
                                                                    }`}>
                                                                    {msg.linkPreview.title}
                                                                </h4>
                                                                {msg.linkPreview.isLate && (
                                                                    <Badge variant="outline" className="text-[10px] h-5 border-red-200 text-red-500 bg-red-50 uppercase font-black px-2 rounded-lg">
                                                                        Trễ
                                                                    </Badge>
                                                                )}
                                                                <div className="flex items-center gap-1.5 ml-2">
                                                                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                                                                        <ExternalLink className="w-4 h-4 text-blue-600" />
                                                                    </div>
                                                                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                                                                        <Share2 className="w-4 h-4 text-blue-600" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Row 2: Metadata */}
                                                        <div className="flex items-center gap-4 mb-5 flex-wrap">
                                                            {/* Avatars */}
                                                            <div className="flex items-center gap-1">
                                                                <div className="flex -space-x-2">
                                                                    {msg.linkPreview.participants?.slice(0, 3).map((p, i) => (
                                                                        <Avatar key={i} className="h-9 w-9 border-2 border-white shadow-sm">
                                                                            <AvatarImage src={p.avatar} />
                                                                            <AvatarFallback className="text-[10px]">U</AvatarFallback>
                                                                        </Avatar>
                                                                    ))}
                                                                </div>
                                                                {msg.linkPreview.participants && msg.linkPreview.participants.length > 3 && (
                                                                    <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center ml-1 text-slate-400">
                                                                        <Plus className="w-3.5 h-3.5" />
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Priority Icons */}
                                                            <div className="flex items-center gap-2 px-3.5 py-2 border border-slate-100 rounded-xl bg-slate-50/50">
                                                                <Flag className="w-4 h-4 text-slate-400" />
                                                            </div>
                                                            <div className="flex items-center gap-2 px-3.5 py-2 border border-slate-100 rounded-xl bg-slate-50/50">
                                                                <Zap className="w-4 h-4 text-slate-400" />
                                                            </div>

                                                            {/* Time */}
                                                            <div className="flex items-center gap-2.5 text-[15px] text-slate-600 font-semibold ml-1">
                                                                <Calendar className="w-5 h-5 text-slate-400" />
                                                                <span>{msg.linkPreview.time}</span>
                                                            </div>

                                                            {/* Status Badge with Dropdown */}
                                                            <div className="ml-auto">
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Badge className={`px-6 py-2 h-auto text-[15px] font-bold rounded-xl shadow-sm border-none cursor-pointer transition-colors ${msg.linkPreview.status === 'Doing' ? 'bg-blue-600 hover:bg-blue-700' :
                                                                            msg.linkPreview.status === 'Done' ? 'bg-green-600 hover:bg-green-700' :
                                                                                msg.linkPreview.status === 'Pending' ? 'bg-yellow-500 hover:bg-yellow-600' :
                                                                                    msg.linkPreview.status === 'Cancel' ? 'bg-red-500 hover:bg-red-600 text-white' :
                                                                                        'bg-slate-100 text-slate-700 hover:bg-slate-200 shadow-none border border-slate-200'
                                                                            }`}>
                                                                            {msg.linkPreview.status}
                                                                            <ChevronDown className="w-4 h-4 ml-1 opacity-50" />
                                                                        </Badge>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end" className="w-[140px] p-1 rounded-xl shadow-xl border-slate-100">
                                                                        <DropdownMenuItem
                                                                            className="rounded-lg gap-2 text-sm font-medium focus:bg-slate-50"
                                                                            onClick={() => handleLinkPreviewStatusChange(msg.id, 'Todo')}
                                                                        >
                                                                            <div className="w-2 h-2 rounded-full bg-slate-400" />
                                                                            Todo
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem
                                                                            className="rounded-lg gap-2 text-sm font-medium focus:bg-yellow-50 focus:text-yellow-600"
                                                                            onClick={() => handleLinkPreviewStatusChange(msg.id, 'Pending')}
                                                                        >
                                                                            <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                                                            Pending
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem
                                                                            className="rounded-lg gap-2 text-sm font-medium focus:bg-blue-50 focus:text-blue-600"
                                                                            onClick={() => handleLinkPreviewStatusChange(msg.id, 'Doing')}
                                                                        >
                                                                            <div className="w-2 h-2 rounded-full bg-blue-600" />
                                                                            Doing
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem
                                                                            className="rounded-lg gap-2 text-sm font-medium focus:bg-green-50 focus:text-green-600"
                                                                            onClick={() => handleLinkPreviewStatusChange(msg.id, 'Done')}
                                                                        >
                                                                            <div className="w-2 h-2 rounded-full bg-green-600" />
                                                                            Done
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem
                                                                            className="rounded-lg gap-2 text-sm font-medium focus:bg-red-50 focus:text-red-600"
                                                                            onClick={() => handleLinkPreviewStatusChange(msg.id, 'Cancel')}
                                                                        >
                                                                            <div className="w-2 h-2 rounded-full bg-red-600" />
                                                                            Cancel
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </div>
                                                        </div>

                                                        {/* Row 3: Source */}
                                                        <div className="flex items-center gap-3 mb-5 py-3 border-y border-slate-100">
                                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${msg.linkPreview.source === 'message' ? 'bg-yellow-100/50' :
                                                                msg.linkPreview.source === 'workflow' ? 'bg-yellow-200/50' :
                                                                    'bg-purple-100/50'
                                                                }`}>
                                                                {msg.linkPreview.source === 'message' && <MessageSquare className="w-5 h-5 text-yellow-600 fill-yellow-600/20" />}
                                                                {msg.linkPreview.source === 'workflow' && <Settings2 className="w-5 h-5 text-yellow-700" />}
                                                                {msg.linkPreview.source === 'meeting' && <Bot className="w-5 h-5 text-purple-600" />}
                                                            </div>
                                                            <span className="text-[16px] font-black text-slate-800">
                                                                {msg.linkPreview.category || (msg.linkPreview.source === 'message' ? 'Tin nhắn' : msg.linkPreview.source === 'workflow' ? 'Quy trình' : 'Daily meeting')}
                                                            </span>
                                                            {msg.linkPreview.assigner && (
                                                                <div className="flex items-center gap-2 text-[15px] text-slate-500 italic ml-1">
                                                                    <span>giao bởi</span>
                                                                    <Avatar className="h-8 w-8 ring-1 ring-slate-100 shadow-sm">
                                                                        <AvatarImage src={msg.linkPreview.assigner.avatar} />
                                                                        <AvatarFallback className="text-[8px]">A</AvatarFallback>
                                                                    </Avatar>
                                                                    <span className="font-bold text-slate-700 not-italic">{msg.linkPreview.assigner.name}</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Row 4: Description */}
                                                        <div className="flex items-start gap-4">
                                                            <Menu className="w-5 h-5 text-slate-400 mt-1 shrink-0" />
                                                            <div className="flex flex-col gap-1">
                                                                <p className="text-[17px] font-bold text-slate-800 leading-snug">
                                                                    {msg.linkPreview.description}
                                                                </p>
                                                                <span className="text-[15px] font-black text-blue-600 hover:underline cursor-pointer">
                                                                    Xem thêm
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Hover Actions Menu */}
                                                <div className={cn(
                                                    "absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5",
                                                    isSelf ? "-left-28" : "-right-28"
                                                )}>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-muted-foreground hover:bg-muted/50 rounded-full"
                                                                onClick={() => setReplyMessage(msg)}
                                                            >
                                                                <Reply className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="top">
                                                            <p className="text-xs font-medium">Trả lời</p>
                                                        </TooltipContent>
                                                    </Tooltip>

                                                    <DropdownMenu>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted/50 rounded-full">
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="top">
                                                                <p className="text-xs font-medium">Thêm</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                        <DropdownMenuContent align={isSelf ? "start" : "end"} className="w-52 rounded-xl shadow-xl border-none p-1">
                                                            <DropdownMenuItem
                                                                className="gap-2 px-3 py-2 cursor-pointer rounded-lg hover:bg-muted/80"
                                                                onClick={() => handleCreateTaskTrigger(msg)}
                                                            >
                                                                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                                                                <span className="text-[13.5px] font-medium">Tạo công việc</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="gap-2 px-3 py-2 cursor-pointer rounded-lg hover:bg-muted/80"
                                                                onClick={() => handleCreateMeetingTrigger(msg)}
                                                            >
                                                                <Video className="h-4 w-4 text-muted-foreground" />
                                                                <span className="text-[13.5px] font-medium">Tạo cuộc họp</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="gap-2 px-3 py-2 cursor-pointer rounded-lg hover:bg-muted/80"
                                                                onClick={() => togglePin(msg.id)}
                                                            >
                                                                <Pin className={cn("h-4 w-4 text-muted-foreground", msg.isPinned && "fill-current text-primary")} />
                                                                <span className="text-[13.5px] font-medium">{msg.isPinned ? "Bỏ ghim tin nhắn" : "Ghim tin nhắn"}</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="gap-2 px-3 py-2 cursor-pointer rounded-lg hover:bg-muted/80">
                                                                <Forward className="h-4 w-4 text-muted-foreground" />
                                                                <span className="text-[13.5px] font-medium">Chuyển tiếp</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator className="my-1 bg-muted" />
                                                            <DropdownMenuItem className="gap-2 px-3 py-2 cursor-pointer rounded-lg hover:bg-muted/80 text-red-500 hover:text-red-600">
                                                                <Trash2 className="h-4 w-4" />
                                                                <span className="text-[13.5px] font-medium">Xoá với tôi</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="gap-2 px-3 py-2 cursor-pointer rounded-lg hover:bg-muted/80 text-red-500 hover:text-red-600">
                                                                <Trash2 className="h-4 w-4" />
                                                                <span className="text-[13.5px] font-medium">Xoá với tất cả</span>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>

                                                {/* Heart Reaction Button */}
                                                <div className={cn(
                                                    "absolute -bottom-3 z-10",
                                                    isSelf ? "-left-1" : "-right-1"
                                                )}>
                                                    <Button
                                                        variant="secondary"
                                                        size="icon"
                                                        className={cn(
                                                            "h-6 w-6 rounded-full bg-white border shadow-sm hover:scale-110 active:scale-95 transition-all p-0 group/heart",
                                                            msg.hasHeart && "border-red-100 bg-red-50"
                                                        )}
                                                        onClick={() => toggleReaction(msg.id)}
                                                    >
                                                        <Heart className={cn(
                                                            "h-3.5 w-3.5 transition-colors",
                                                            msg.hasHeart
                                                                ? "text-red-500 fill-red-500"
                                                                : "text-muted-foreground group-hover/heart:text-red-500 group-hover/heart:fill-red-500"
                                                        )} />
                                                    </Button>
                                                </div>
                                            </div>
                                            {isSelf && (
                                                <div className="flex justify-end mt-0.5 items-center gap-1">
                                                    {msg.isPinned && <Pin className="h-3 w-3 text-red-500 fill-current rotate-45" />}
                                                    <span className="text-[10px] text-muted-foreground/60">{msg.date}</span>
                                                </div>
                                            )}
                                            {!isSelf && (
                                                <div className="flex items-center gap-1 ml-1">
                                                    <span className="text-[10px] text-muted-foreground/60">{msg.date}</span>
                                                    {msg.isPinned && <Pin className="h-3 w-3 text-red-500 fill-current rotate-45" />}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                        if (msg.type === "thread") {
                            return (
                                <div key={msg.id} className="flex w-full mb-6 justify-start">
                                    <div className="flex w-full gap-3">
                                        <div className="flex flex-col items-center">
                                            <div className="h-10 w-10 bg-[#2c2d31] rounded-full flex items-center justify-center mb-1">
                                                <Layers className="h-5 w-5 text-gray-400 rotate-12" />
                                            </div>
                                            <div className="w-[2px] flex-1 bg-gray-200 rounded-full my-1" />
                                        </div>
                                        <div className="flex flex-col flex-1 pt-2">
                                            <div className="flex items-center gap-1 text-[13px]">
                                                <span className="font-bold text-[#FF8A00]">{msg.author}</span>
                                                <span className="text-muted-foreground">đã bắt đầu một chủ đề:</span>
                                                <span className="font-bold text-foreground truncate max-w-[200px]">{msg.title}.</span>
                                                <Button variant="link" className="h-auto p-0 text-blue-500 font-medium text-[13px]">Xem tất cả chủ đề.</Button>
                                            </div>
                                            <span className="text-[11px] text-muted-foreground mt-0.5">{msg.date}</span>

                                            <div
                                                className="mt-3 bg-white border border-gray-100 rounded-2xl p-4 max-w-md shadow-sm group cursor-pointer hover:shadow-md hover:border-blue-200 transition-all active:scale-[0.98]"
                                                onClick={() => onThreadClick?.(msg)}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-foreground text-sm">{msg.title}</span>
                                                        <span className="text-[12px] text-blue-500 font-semibold flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-full">
                                                            {msg.messageCount} Tin Nhắn <ChevronRight className="h-3 w-3" />
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-[13px] text-muted-foreground leading-relaxed">
                                                    {msg.content}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                        return (
                            <Card key={msg.id} className="max-w-3xl overflow-hidden border-none shadow-sm">
                                <div className="p-4 space-y-4">
                                    {msg.type !== "poll" && (
                                        <>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                                                    {msg.title}
                                                    {msg.type === "report" && (
                                                        <Badge variant="outline" className="text-primary border-primary">Cần 0 giây</Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8"><Paperclip className="h-4 w-4" /></Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8"><LucideImage className="h-4 w-4" /></Button>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                <div className="flex -space-x-2">
                                                    <Avatar className="h-6 w-6 border-2 border-background">
                                                        <AvatarImage src="/placeholder.svg" />
                                                        <AvatarFallback>U</AvatarFallback>
                                                    </Avatar>
                                                    <Avatar className="h-6 w-6 border-2 border-background">
                                                        <AvatarImage src="/placeholder.svg" />
                                                        <AvatarFallback>U</AvatarFallback>
                                                    </Avatar>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="bg-muted px-1.5 py-0.5 rounded">Tự động</span>
                                                    <span className="bg-muted px-1.5 py-0.5 rounded">Tag</span>
                                                    <span>{msg.date}</span>
                                                    {msg.isPinned && <Pin className="h-3 w-3 text-red-500 fill-current rotate-45" />}
                                                </div>
                                                <Button variant="outline" size="sm" className="h-6 text-[10px] ml-auto">Todo</Button>
                                                {msg.author && <span className="ml-auto text-[10px] italic">Bởi {msg.author}</span>}
                                            </div>
                                        </>
                                    )}

                                    <div className="space-y-2">
                                        {msg.type !== "poll" && msg.tags && msg.tags.map(tag => (
                                            <div key={tag} className="flex items-center gap-2 text-xs font-medium text-primary">
                                                <span className="h-2 w-2 rounded-full bg-primary" />
                                                {tag}
                                            </div>
                                        ))}
                                        {msg.type !== "poll" && (
                                            <p className="text-sm text-foreground font-medium">
                                                {msg.content}
                                            </p>
                                        )}

                                        {msg.type === "poll" && msg.options && (
                                            <div className="mt-4 space-y-4 bg-[#F2F2F2] p-6 rounded-[24px]">
                                                <h4 className="text-center font-bold text-base text-foreground mb-4">
                                                    {msg.content}
                                                </h4>
                                                <div className="space-y-5">
                                                    {msg.options.map((option, idx) => {
                                                        const progress = idx === 0 ? 35 : idx === 1 ? 60 : 25;
                                                        return (
                                                            <div key={idx} className="space-y-1.5">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-sm font-bold text-foreground">
                                                                        {option}
                                                                    </span>
                                                                    <Avatar className="h-6 w-6 grayscale opacity-80">
                                                                        <AvatarImage src="/placeholder.svg" />
                                                                        <AvatarFallback>V</AvatarFallback>
                                                                    </Avatar>
                                                                </div>
                                                                <Progress
                                                                    value={progress}
                                                                    className="h-2 bg-[#E0E0E0]"
                                                                />
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                                <p className="text-xs text-muted-foreground/80 mt-2">
                                                    1 lựa chọn khác
                                                </p>
                                                <Button
                                                    variant="secondary"
                                                    className="w-full bg-[#E8E8E8] hover:bg-[#D8D8D8] text-foreground font-bold h-11 rounded-xl mt-4 border-none shadow-none"
                                                >
                                                    Thay đổi bình chọn
                                                </Button>
                                            </div>
                                        )}

                                        {msg.type !== "poll" && (
                                            <Button variant="ghost" size="sm" className="text-xs text-primary h-auto p-0 hover:bg-transparent">Xem thêm</Button>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        )
                    })}
                </div>

                {/* Footer / Input */}
                <footer className="bg-background border-t p-4">
                    <div className="flex flex-col gap-2 rounded-lg bg-muted/30 border p-2">
                        <div className="flex items-center gap-1 border-b pb-2 mb-2">
                            {isGroup && (
                                <Button variant="ghost" size="sm" className="text-xs h-7 gap-1 text-primary hover:bg-primary/5">
                                    Action AI <ChevronRight className="h-3 w-3" />
                                </Button>
                            )}
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => {
                                                setSelectedMessageForTask(null)
                                                setTaskDialogOpen(true)
                                            }}
                                        >
                                            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">Tạo công việc</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => {
                                                setSelectedMessageForMeeting(null)
                                                setMeetingDialogOpen(true)
                                            }}
                                        >
                                            <Video className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">Tạo cuộc họp</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => setProcessDialogOpen(true)}
                                        >
                                            <AlarmClock className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">Tạo nhiệm vụ</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7"><Paperclip className="h-4 w-4 text-muted-foreground" /></Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">Tải lên file</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => setPollOpen(true)}
                                        >
                                            <BarChart2 className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    </TooltipTrigger>
                                </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => setThreadOpen(true)}
                                        >
                                            <span className="text-[14px] font-bold text-muted-foreground">T r</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">Tạo chủ đề</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        {replyMessage && (
                            <div className="flex items-center justify-between bg-[#F0F2F5] p-2 rounded-lg border-l-4 border-blue-500 mb-2 mx-2">
                                <div className="flex flex-col truncate pr-4">
                                    <span className="text-[11px] font-bold text-blue-600">Đang trả lời {replyMessage.author}</span>
                                    <span className="text-[13px] text-muted-foreground truncate">{replyMessage.content}</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 rounded-full hover:bg-muted"
                                    onClick={() => setReplyMessage(null)}
                                >
                                    <X className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        )}

                        <div className="relative">
                            {/* Mention Suggestions */}
                            {showMentions && mentionSuggestions.length > 0 && (
                                <div ref={mentionDropdownRef} className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-800 border rounded-lg shadow-2xl max-h-[200px] overflow-y-auto z-[9999]">
                                    {mentionSuggestions.map((suggestion, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2 px-3 py-2 hover:bg-muted cursor-pointer transition-colors"
                                            onClick={() => handleMentionSelect(suggestion.name)}
                                        >
                                            {suggestion.type === 'special' ? (
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                    {'icon' in suggestion && React.createElement(suggestion.icon, { className: "h-4 w-4 text-primary" })}
                                                </div>
                                            ) : (
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={'avatar' in suggestion ? suggestion.avatar : ''} />
                                                    <AvatarFallback>{suggestion.name[0]}</AvatarFallback>
                                                </Avatar>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">
                                                    {suggestion.type === 'special' ? suggestion.label : suggestion.name}
                                                </p>
                                                {suggestion.type === 'special' && (
                                                    <p className="text-xs text-muted-foreground">
                                                        {suggestion.name === 'nhom' ? 'Nhắc đến mọi người' : 'Hỏi AI trợ lý'}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* AI Quick Prompts */}
                            {showAIPrompts && (
                                <div ref={aiPromptsDropdownRef} className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-800 border rounded-lg shadow-2xl max-h-[250px] overflow-y-auto z-[9999]">
                                    <div className="px-3 py-2 border-b bg-muted/50">
                                        <p className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                                            <Bot className="h-3.5 w-3.5" />
                                            Gợi ý câu hỏi cho AI
                                        </p>
                                    </div>
                                    {AI_QUICK_PROMPTS.map((prompt, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start gap-2 px-3 py-2.5 hover:bg-muted cursor-pointer transition-colors border-b last:border-b-0"
                                            onClick={() => handleAIPromptSelect(prompt)}
                                        >
                                            <div className="h-6 w-6 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                                <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                                            </div>
                                            <p className="text-sm text-foreground flex-1">{prompt}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                <div className="relative flex-1 flex items-center bg-muted/50 rounded-full px-4">
                                    <Input
                                        placeholder="Aa"
                                        value={messageInput}
                                        onChange={handleInputChange}
                                        onKeyDown={handleKeyDown}
                                        className="flex-1 border-none bg-transparent shadow-none focus-visible:ring-0 placeholder:text-muted-foreground h-10 px-0"
                                    />
                                    <EmojiPicker onSelect={handleEmojiSelect}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-[#00D1FF] hover:bg-transparent -mr-2">
                                            <Smile className="h-6 w-6 stroke-[2.5]" />
                                        </Button>
                                    </EmojiPicker>
                                </div>
                                <Button
                                    size="icon"
                                    className="h-9 w-9 bg-blue-600 hover:bg-blue-700"
                                    onClick={handleSendMessage}
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </footer >

                <CreatePollDialog
                    open={pollOpen}
                    onOpenChange={setPollOpen}
                    onCreate={handleCreatePoll}
                />

                <CreateThreadDialog
                    open={threadOpen}
                    onOpenChange={setThreadOpen}
                    onCreate={handleCreateThread}
                />

                <CreateTaskDialog
                    open={taskDialogOpen}
                    onOpenChange={setTaskDialogOpen}
                    onSubmit={handleDialogSubmit}
                    sourceMessage={selectedMessageForTask ? {
                        author: selectedMessageForTask.author || "Người dùng",
                        content: selectedMessageForTask.content,
                        date: selectedMessageForTask.date
                    } : undefined}
                />

                <CreateMeetingDialog
                    open={meetingDialogOpen}
                    onOpenChange={setMeetingDialogOpen}
                    onSubmit={handleDialogSubmit}
                    sourceMessage={selectedMessageForMeeting ? {
                        author: selectedMessageForMeeting.author || "Người dùng",
                        content: selectedMessageForMeeting.content,
                        date: selectedMessageForMeeting.date
                    } : undefined}
                />
                <CreateMissionDialog
                    open={missionDialogOpen}
                    onOpenChange={setMissionDialogOpen}
                    onSubmit={handleDialogSubmit}
                />

                <SelectProcessDialog
                    open={processDialogOpen}
                    onOpenChange={setProcessDialogOpen}
                    onSelect={(processId) => {
                        setSelectedProcessId(processId)
                        setMissionDialogOpen(true)
                    }}
                />

                <TodolistDetailDialog
                    open={todolistDetailOpen}
                    onOpenChange={setTodolistDetailOpen}
                />

                <MeetingDetailDialog
                    open={meetingDetailOpen}
                    onOpenChange={setMeetingDetailOpen}
                />

                <ProcessDetailDialog
                    open={processDetailOpen}
                    onOpenChange={setProcessDetailOpen}
                />
            </div >
        </TooltipProvider>
    )
}
