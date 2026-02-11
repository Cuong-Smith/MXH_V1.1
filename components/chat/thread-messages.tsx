"use client"

import React from "react"
import { ArrowLeft, Send, Image as LucideImage, Paperclip, Smile, MoreHorizontal, Heart, Reply, Phone, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { EmojiPicker } from "./emoji-picker"

interface Message {
    id: string
    type: string
    title: string
    date: string
    content: string
    author?: string
    isSelf?: boolean
    hasHeart?: boolean
}

interface ThreadMessagesProps {
    thread: {
        id: string
        title: string
        author: string
    }
    onBack: () => void
}

const MOCK_THREAD_MESSAGES: Message[] = [
    {
        id: "t1",
        type: "text",
        title: "",
        date: "10:01 CH",
        content: "Chào mừng mọi người đến với chủ đề mới!",
        author: "Admin",
        isSelf: false
    }
]

export function ThreadMessages({ thread, onBack }: ThreadMessagesProps) {
    const [messages, setMessages] = React.useState(MOCK_THREAD_MESSAGES)
    const [messageInput, setMessageInput] = React.useState("")
    const scrollRef = React.useRef<HTMLDivElement>(null)

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
            isSelf: true
        }

        setMessages([...messages, newMessage])
        setMessageInput("")
    }

    const toggleReaction = (id: string) => {
        setMessages(prev => prev.map(msg =>
            msg.id === id ? { ...msg, hasHeart: !msg.hasHeart } : msg
        ))
    }

    return (
        <div className="flex flex-1 flex-col h-full bg-[#F0F2F5]">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border-b sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex flex-col">
                        <h2 className="font-bold text-[15px] leading-tight text-foreground truncate max-w-[250px]">{thread.title}</h2>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[11px] text-muted-foreground">General Chat</span>
                            <span className="text-[10px] text-muted-foreground/50">/</span>
                            <span className="text-[11px] text-blue-500 font-medium">Thread</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-gray-100 rounded-full transition-colors">
                        <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-gray-100 rounded-full transition-colors">
                        <Video className="h-4 w-4" />
                    </Button>
                    <Avatar className="h-7 w-7 border border-white shadow-sm transition-transform hover:scale-105 ml-1">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${encodeURIComponent(thread.author)}`} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 font-bold text-[10px]">{thread.author[0]}</AvatarFallback>
                    </Avatar>
                </div>
            </div>

            {/* Message Feed */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth custom-scrollbar">
                {messages.map((msg) => {
                    const isSelf = msg.isSelf
                    return (
                        <div key={msg.id} className={cn("flex w-full mb-1", isSelf ? "justify-end" : "justify-start")}>
                            <div className={cn("flex max-w-[70%] group relative", isSelf ? "flex-row-reverse" : "flex-row")}>
                                {!isSelf && (
                                    <Avatar className="h-8 w-8 mt-1 shrink-0 shadow-sm">
                                        <AvatarImage src={`https://i.pravatar.cc/150?u=${encodeURIComponent(msg.author || "User")}`} />
                                        <AvatarFallback className="bg-gray-100 text-gray-600 text-[10px] font-bold">{msg.author?.[0]}</AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={cn("flex flex-col", isSelf ? "mr-3" : "ml-3")}>
                                    {!isSelf && (
                                        <span className="text-[11px] font-bold text-muted-foreground mb-1 ml-1">{msg.author}</span>
                                    )}
                                    <div className="relative group/bubble">
                                        <div className={cn(
                                            "px-4 py-2.5 rounded-2xl text-[14px] shadow-sm transition-all",
                                            isSelf
                                                ? "bg-[#00A3FF] text-white rounded-tr-none hover:bg-[#0095E5]"
                                                : "bg-white border text-foreground rounded-tl-none hover:border-gray-300"
                                        )}>
                                            {msg.content}
                                        </div>

                                        {/* Hover Actions */}
                                        <div className={cn(
                                            "absolute top-0 opacity-0 group-hover/bubble:opacity-100 transition-all duration-200 flex items-center gap-1 bg-white/90 backdrop-blur-sm border shadow-lg rounded-full px-1.5 py-1 z-30",
                                            isSelf ? "right-full mr-2" : "left-full ml-2"
                                        )}>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-muted-foreground hover:bg-red-50 hover:text-red-500 rounded-full transition-colors"
                                                onClick={() => toggleReaction(msg.id)}
                                            >
                                                <Heart className={cn("h-3.5 w-3.5", msg.hasHeart && "fill-red-500 text-red-500")} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-muted-foreground hover:bg-blue-50 hover:text-blue-500 rounded-full transition-colors"
                                            >
                                                <Reply className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-muted-foreground hover:bg-gray-100 rounded-full transition-colors"
                                            >
                                                <MoreHorizontal className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>

                                        {/* Reaction Display */}
                                        {msg.hasHeart && (
                                            <div className={cn(
                                                "absolute -bottom-2 z-10",
                                                isSelf ? "left-1" : "right-1"
                                            )}>
                                                <div className="h-5 w-5 rounded-full bg-white border shadow-sm flex items-center justify-center p-0">
                                                    <Heart className="h-2.5 w-2.5 text-red-500 fill-red-500" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <span className={cn("text-[10px] text-muted-foreground mt-1.5", isSelf ? "text-right mr-1" : "ml-1")}>
                                        {msg.date}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Input Area */}
            <div className="bg-white p-4 border-t shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 shrink-0">
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:bg-gray-100 rounded-full transition-colors">
                            <Paperclip className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:bg-gray-100 rounded-full transition-colors">
                            <LucideImage className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="flex-1 relative group">
                        <Input
                            placeholder="Nhập nội dung trả lời..."
                            className="bg-[#F0F2F5] border-transparent focus-visible:ring-2 focus-visible:ring-blue-500/50 h-11 pr-12 rounded-xl transition-all"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                            <EmojiPicker onSelect={(emoji) => setMessageInput(prev => prev + emoji)}>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-gray-100 rounded-full transition-colors">
                                    <Smile className="h-5 w-5" />
                                </Button>
                            </EmojiPicker>
                        </div>
                    </div>

                    <Button
                        size="icon"
                        className={cn(
                            "h-10 w-10 rounded-full transition-all shadow-md active:scale-90 shrink-0",
                            messageInput.trim() ? "bg-[#00A3FF] hover:bg-[#0088D6] text-white" : "bg-gray-100 text-gray-400"
                        )}
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim()}
                    >
                        <Send className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
