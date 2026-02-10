"use client"

import React from "react"
import { Search, Plus, MoreHorizontal, Pin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const MOCK_CHATS = [
    {
        id: "1",
        name: "Fastdo AI",
        lastMessage: "Bạn: Đã nhận task",
        time: "16 phút",
        unread: 0,
        isPinned: true,
        avatar: "/placeholder.svg",
        type: "group"
    },
    {
        id: "6",
        name: "Team Design",
        lastMessage: "Nguyễn Văn A: Gửi file Figma",
        time: "10:30",
        unread: 2,
        isPinned: false,
        avatar: "/placeholder.svg",
        type: "group"
    },
    {
        id: "2",
        name: "AI tra cứu",
        lastMessage: "",
        time: "",
        unread: 0,
        isPinned: true,
        avatar: "/placeholder.svg",
        type: "direct"
    },
    {
        id: "3",
        name: "Phạm Thị Quỳnh ...",
        lastMessage: "Phạm Thị Quỳnh Như: ờ ra v",
        time: "7 ngày",
        unread: 0,
        avatar: "/placeholder.svg",
        type: "direct"
    },
    {
        id: "4",
        name: "Bùi Anh Tuấn",
        lastMessage: "",
        time: "",
        unread: 0,
        avatar: "/placeholder.svg",
        type: "direct"
    },
    {
        id: "5",
        name: "Bùi Thanh Hiền",
        lastMessage: "",
        time: "",
        unread: 0,
        avatar: "/placeholder.svg",
        type: "direct"
    }
]

interface ChatSidebarProps {
    selectedChatId?: string
    onSelectChat?: (id: string) => void
}

export function ChatSidebar({ selectedChatId, onSelectChat }: ChatSidebarProps) {
    const [activeTab, setActiveTab] = React.useState("all")

    const filteredChats = MOCK_CHATS.filter(chat => {
        if (activeTab === "all") return true
        if (activeTab === "group") return chat.type === "group"
        return true
    })

    return (
        <div className="flex h-full w-[330px] flex-col border-r bg-background">
            <div className="p-3 space-y-3">
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Tìm kiếm..." className="pl-8 bg-muted/50 border-none h-9 text-sm" />
                    </div>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                        <Plus className="h-5 w-5" />
                    </Button>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="bg-transparent h-auto p-0 gap-4 w-full justify-start">
                        <TabsTrigger value="all" className="p-0 pb-1 text-sm border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none shadow-none bg-transparent">Tất cả</TabsTrigger>
                        <TabsTrigger value="unread" className="p-0 pb-1 text-sm border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none shadow-none bg-transparent">Chưa đọc</TabsTrigger>
                        <TabsTrigger value="group" className="p-0 pb-1 text-sm border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none shadow-none bg-transparent">Nhóm</TabsTrigger>
                        <TabsTrigger value="label" className="p-0 pb-1 text-sm border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none shadow-none bg-transparent flex items-center gap-1">
                            Nhãn <MoreHorizontal className="h-3 w-3" />
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="flex-1 overflow-y-auto">
                {filteredChats.map((chat) => (
                    <div
                        key={chat.id}
                        className={`flex items-center gap-3 p-3 cursor-pointer transition-colors relative group ${selectedChatId === chat.id ? "bg-blue-50/50" : "hover:bg-muted/50"}`}
                        onClick={() => onSelectChat?.(chat.id)}
                    >
                        <div className="relative">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={chat.avatar} />
                                <AvatarFallback>{chat.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                                <p className="text-sm font-semibold truncate">{chat.name}</p>
                                <div className="flex items-center gap-2">
                                    {chat.isPinned && <Pin className="h-3 w-3 text-muted-foreground rotate-45" />}
                                    <span className="text-[10px] text-muted-foreground">{chat.time}</span>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
