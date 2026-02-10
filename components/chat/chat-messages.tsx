"use client"

import React from "react"
import { Search, Users, ChevronRight, Plus, Hash, Send, Image as LucideImage, Paperclip, Smile, CheckCircle2, Video, AlarmClock, FileUp, BarChart2, BellOff, ThumbsUp, MoreHorizontal, Heart, Reply, Forward, Pin, Trash2, ClipboardCheck, X, Layers, Phone } from "lucide-react"
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
import { EmojiPicker } from "./emoji-picker"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

interface Message {
    id: string
    type: string
    title: string
    date: string
    content: string
    time?: string
    author?: string
    tags?: string[]
    options?: string[]
    isSelf?: boolean
    replyTo?: {
        author: string
        content: string
    }
    hasHeart?: boolean
    messageCount?: number
}

const MOCK_MESSAGES: Message[] = [
    {
        id: "1",
        type: "report",
        title: "DAILY REPORT!",
        time: "Cần 0 giây",
        date: "10/02/26 23:59",
        content: "Đã hoàn thành các task trong ngày. Chuẩn bị cho kế hoạch ngày mai.",
        author: "Nguyễn Thị Hồng Hạnh",
        tags: ["Daily meeting", "Todolist"]
    },
    {
        id: "2",
        type: "todo",
        title: "Giám định Bug_[816] - Đơn từ làm thêm đang áp dụng vào ca làm",
        date: "17/02/26 17:30",
        content: "QC nhận ticket bug và giám định xem có phải là Bug không. Nếu cần thì theo dõi.",
        tags: ["Quy trình"]
    },
    {
        id: "3",
        type: "text",
        title: "",
        date: "10/02/26 15:00",
        content: "Chào mọi người nhé!",
        author: "Trung",
        isSelf: false
    },
    {
        id: "4",
        type: "text",
        title: "",
        date: "10/02/26 15:01",
        content: "Đều ngồi cf chán lắm",
        author: "Trung",
        isSelf: false
    }
]

interface ChatMessagesProps {
    onThreadClick?: (thread: Message) => void
    activeChatId?: string
    isGroup?: boolean
}

const MOCK_MESSAGES_BY_CHAT: Record<string, Message[]> = {
    "1": [
        {
            id: "1",
            type: "text",
            title: "",
            date: "Sáng nay",
            content: "Chào mọi người, dự án Fastdo AI thế nào rồi?",
            author: "Nguyễn Thị Hồng Hạnh",
            tags: ["Dự án", "Fastdo"],
            isSelf: false
        },
        {
            id: "2",
            type: "text",
            title: "",
            date: "10:30",
            content: "Chúng tôi đang triển khai các tính năng mới cho phần Chat.",
            author: "Bạn",
            isSelf: true
        }
    ],
    "6": [
        {
            id: "1",
            type: "text",
            title: "",
            date: "Hôm qua",
            content: "Mọi người đã xem file thiết kế mới chưa?",
            author: "Nguyễn Văn A",
            isSelf: false
        },
        {
            id: "2",
            type: "text",
            title: "",
            date: "09:15",
            content: "Tôi vừa gửi file Figma vào nhóm rồi nhé.",
            author: "Nguyễn Văn A",
            isSelf: false
        }
    ],
    "3": [
        {
            id: "1",
            type: "text",
            title: "",
            date: "7 ngày trước",
            content: "Chào Như, bạn có rảnh không?",
            author: "Bạn",
            isSelf: true
        },
        {
            id: "2",
            type: "text",
            title: "",
            date: "Thứ 2",
            content: "ờ ra v",
            author: "Phạm Thị Quỳnh Như",
            isSelf: false
        }
    ],
    "4": [
        {
            id: "1",
            type: "text",
            title: "",
            date: "Vừa xong",
            content: "Bắt đầu cuộc trò chuyện với Bùi Anh Tuấn",
            author: "Hệ thống",
            isSelf: false
        }
    ],
    "2": [
        {
            id: "1",
            type: "text",
            title: "",
            date: "Hôm nay",
            content: "Tôi có thể giúp gì cho bạn trong việc tra cứu thông tin?",
            author: "AI tra cứu",
            isSelf: false
        }
    ],
    "5": [
        {
            id: "1",
            type: "text",
            title: "",
            date: "Sáng nay",
            content: "Chào Hiền, báo cáo hôm nay thế nào rồi?",
            author: "Bạn",
            isSelf: true
        }
    ]
}

const CHAT_NAMES: Record<string, string> = {
    "1": "Fastdo AI",
    "6": "Team Design",
    "2": "AI tra cứu",
    "3": "Phạm Thị Quỳnh Như",
    "4": "Bùi Anh Tuấn",
    "5": "Bùi Thanh Hiền"
}

export function ChatMessages({ onThreadClick, activeChatId = "1", isGroup = true }: ChatMessagesProps) {
    const [pollOpen, setPollOpen] = React.useState(false)
    const [threadOpen, setThreadOpen] = React.useState(false)
    const [messages, setMessages] = React.useState<Message[]>([])
    const [messageInput, setMessageInput] = React.useState("")
    const [replyMessage, setReplyMessage] = React.useState<Message | null>(null)
    const scrollRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        setMessages(MOCK_MESSAGES_BY_CHAT[activeChatId] || [])
    }, [activeChatId])

    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSendMessage = () => {
        if (!messageInput.trim()) return

        const newMessage: Message = {
            id: Date.now().toString(),
            type: "text",
            title: "",
            date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            content: messageInput,
            author: "Bạn",
            tags: [],
            isSelf: true,
            replyTo: replyMessage ? {
                author: replyMessage.author || "Người dùng",
                content: replyMessage.content
            } : undefined
        }

        setMessages([...messages, newMessage])
        setMessageInput("")
        setReplyMessage(null)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
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
        setMessages([...messages, newPollMessage])
    }

    const toggleReaction = (id: string) => {
        setMessages(prev => prev.map(msg =>
            msg.id === id ? { ...msg, hasHeart: !msg.hasHeart } : msg
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
        setMessages([...messages, newThreadMessage])
    }

    return (
        <div className="flex flex-1 flex-col h-full bg-[#F0F2F5]">
            {/* Header */}
            <header className="flex h-14 items-center justify-between border-b bg-background px-4">
                <div className="flex items-center gap-2">
                    <Hash className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold">{CHAT_NAMES[activeChatId] || "Trò chuyện"}</h2>
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
                                            <AvatarImage src="/placeholder.svg" />
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
                                                ? "bg-[#00A3FF] text-white rounded-tr-[4px]"
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
                                            {msg.content}

                                            {/* Hover Actions Menu */}
                                            <div className={cn(
                                                "absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5",
                                                isSelf ? "-left-28" : "-right-28"
                                            )}>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:bg-muted/50 rounded-full"
                                                    onClick={() => setReplyMessage(msg)}
                                                >
                                                    <Reply className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted/50 rounded-full">
                                                    <ClipboardCheck className="h-4 w-4" />
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted/50 rounded-full">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align={isSelf ? "start" : "end"} className="w-52 rounded-xl shadow-xl border-none p-1">
                                                        <DropdownMenuItem className="gap-2 px-3 py-2 cursor-pointer rounded-lg hover:bg-muted/80">
                                                            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                                                            <span className="text-[13.5px] font-medium">Tạo công việc</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="gap-2 px-3 py-2 cursor-pointer rounded-lg hover:bg-muted/80">
                                                            <Video className="h-4 w-4 text-muted-foreground" />
                                                            <span className="text-[13.5px] font-medium">Tạo cuộc họp</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="gap-2 px-3 py-2 cursor-pointer rounded-lg hover:bg-muted/80">
                                                            <Pin className="h-4 w-4 text-muted-foreground" />
                                                            <span className="text-[13.5px] font-medium">Ghim tin nhắn</span>
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
                                            <div className="flex justify-end mt-0.5">
                                                <span className="text-[10px] text-muted-foreground/60">{msg.date}</span>
                                            </div>
                                        )}
                                        {!isSelf && (
                                            <span className="text-[10px] text-muted-foreground/60 ml-1">{msg.date}</span>
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
                                    <Button variant="ghost" size="icon" className="h-7 w-7"><CheckCircle2 className="h-4 w-4 text-muted-foreground" /></Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">Tạo công việc</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-7 w-7"><Video className="h-4 w-4 text-muted-foreground" /></Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">Tạo cuộc họp</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-7 w-7"><AlarmClock className="h-4 w-4 text-muted-foreground" /></Button>
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
                                <TooltipContent side="top">Tạo bình chọn</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <Button variant="ghost" size="icon" className="h-7 w-7">T r</Button>
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
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1 flex items-center bg-muted/50 rounded-full px-4">
                            <Input
                                placeholder="Aa"
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
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
            </footer>

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
        </div>
    )
}
