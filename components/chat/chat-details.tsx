"use client"

import React from "react"
import { Pin, Trash2, ChevronDown, CheckCircle2, Video, FileText, Link, ShieldAlert, Edit2, UserPlus, MoreHorizontal, Shield, MessageSquare, BellOff, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { AddMemberDialog } from "./add-member-dialog"
import { MuteChatDialog } from "./mute-chat-dialog"
import { LeaveGroupDialog } from "./leave-group-dialog"
import { DeleteChatDialog } from "./delete-chat-dialog"
import { Message } from "./chat-messages"

interface Chat {
    id: string
    name: string
    avatar: string
    type: string
    isPinned?: boolean
}

interface ChatDetailsProps {
    isGroup?: boolean
    chat?: Chat
    pinnedMessages?: Message[]
}

export function ChatDetails({ isGroup = true, chat, pinnedMessages = [] }: ChatDetailsProps) {
    const [addMemberOpen, setAddMemberOpen] = React.useState(false)
    const [muteOpen, setMuteOpen] = React.useState(false)
    const [leaveGroupOpen, setLeaveGroupOpen] = React.useState(false)
    const [deleteChatOpen, setDeleteChatOpen] = React.useState(false)
    const [onlyAdminsPost, setOnlyAdminsPost] = React.useState(false)

    const MOCK_MEMBERS = [
        { name: "Nguyễn Thị Hồng Hạnh", role: "Admin", avatar: "https://i.pravatar.cc/150?u=hanh" },
        { name: "Phạm Thị Quỳnh Như", role: "Thành viên", avatar: "https://i.pravatar.cc/150?u=nhu" },
        { name: "Bùi Anh Tuấn", role: "Thành viên", avatar: "https://i.pravatar.cc/150?u=tuan" },
    ]

    if (!chat) {
        return <div className="flex h-full w-[300px] flex-col border-l bg-background items-center justify-center text-muted-foreground text-sm">Chọn một cuộc trò chuyện</div>
    }

    return (
        <div className="flex h-full w-[300px] flex-col border-l bg-background overflow-y-auto">
            {/* Profile Header */}
            <div className="flex flex-col items-center p-6 text-center space-y-3 border-b">
                <div className="relative">
                    <Avatar className="h-16 w-16 rounded-lg pointer-events-none">
                        <AvatarImage src={chat.avatar} />
                        <AvatarFallback className="rounded-lg text-lg bg-yellow-400 text-white">{chat.name[0]}</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="icon" className="absolute -right-2 -bottom-2 h-6 w-6 rounded-full bg-background scale-75">
                        <Edit2 className="h-3 w-3" />
                    </Button>
                </div>
                <div>
                    <h3 className="font-bold text-lg">{chat.name}</h3>
                    <div className="flex items-center justify-center gap-4 mt-1">
                        <div className="flex items-center gap-1 text-[11px] text-primary font-semibold cursor-pointer hover:opacity-80">
                            <Pin className={cn("h-3 w-3 text-primary", chat.isPinned && "rotate-45")} />
                            {chat.isPinned ? "Bỏ Ghim" : "Ghim"}
                        </div>
                        <div
                            className="flex items-center gap-1 text-[11px] text-primary font-semibold cursor-pointer hover:opacity-80"
                            onClick={() => setMuteOpen(true)}
                        >
                            <BellOff className="h-3 w-3 text-primary" />
                            Tắt thông báo
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Sections */}
            <div className="flex-1">
                <Accordion type="multiple" defaultValue={["tasks", "members"]} className="w-full">
                    {isGroup && (
                        <AccordionItem value="members" className="border-b px-4">
                            <AccordionTrigger className="hover:no-underline py-3 text-sm font-semibold">
                                <div className="flex items-center gap-2">
                                    Danh sách thành viên
                                    <span className="text-muted-foreground font-normal">({MOCK_MEMBERS.length})</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-3 pb-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-start gap-2 h-9 px-2 text-primary border-primary hover:bg-primary/5"
                                    onClick={() => setAddMemberOpen(true)}
                                >
                                    <UserPlus className="h-4 w-4" />
                                    Thêm người vào nhóm
                                </Button>
                                <div className="space-y-2 mt-2">
                                    {MOCK_MEMBERS.map((member, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm p-1 rounded hover:bg-muted transition-colors group">
                                            <Avatar className="h-7 w-7">
                                                <AvatarImage src={member.avatar} />
                                                <AvatarFallback>{member.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="truncate font-medium">{member.name}</p>
                                                <p className="text-[10px] text-muted-foreground">{member.role}</p>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    <DropdownMenuItem className="gap-2 cursor-pointer">
                                                        <Shield className="h-4 w-4 text-muted-foreground" />
                                                        <span>Phân quyền</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="gap-2 cursor-pointer">
                                                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                                        <span>Nhắn tin riêng</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    ))}
                                </div>
                                <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground hover:bg-transparent">
                                    Xem tất cả thành viên
                                </Button>
                            </AccordionContent>
                        </AccordionItem>

                    )}



                    <AccordionItem value="tasks" className="border-b px-4">
                        <AccordionTrigger className="hover:no-underline py-3 text-sm font-semibold">
                            Quản lý công việc
                        </AccordionTrigger>
                        <AccordionContent className="space-y-3 pb-3">
                            <div className="flex items-center gap-2 text-sm text-foreground/80 hover:bg-muted p-1 rounded cursor-pointer transition-colors">
                                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                                <span>Giao việc</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-foreground/80 hover:bg-muted p-1 rounded cursor-pointer transition-colors">
                                <Video className="h-4 w-4 text-muted-foreground" />
                                <span>Cuộc họp</span>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="pinned" className="border-b px-4">
                        <AccordionTrigger className="hover:no-underline py-3 text-sm font-semibold">
                            Tin nhắn đã ghim
                            {pinnedMessages.length > 0 && (
                                <span className="ml-2 text-muted-foreground font-normal">({pinnedMessages.length})</span>
                            )}
                        </AccordionTrigger>
                        <AccordionContent className="space-y-3 pb-3">
                            {pinnedMessages.length === 0 ? (
                                <div className="text-xs text-muted-foreground italic text-center py-2">
                                    Chưa có tin nhắn nào được ghim
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {pinnedMessages.map((msg) => (
                                        <div key={msg.id} className="bg-muted/50 rounded p-2 text-sm">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Avatar className="h-5 w-5">
                                                    <AvatarImage src={`https://i.pravatar.cc/150?u=${encodeURIComponent(msg.author || "User")}`} />
                                                    <AvatarFallback>{msg.author?.[0]}</AvatarFallback>
                                                </Avatar>
                                                <span className="font-semibold text-xs">{msg.author}</span>
                                                <span className="text-[10px] text-muted-foreground ml-auto">{msg.date}</span>
                                            </div>
                                            <p className="text-foreground/90 line-clamp-2 text-xs">
                                                {msg.content}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="media" className="border-b px-4">
                        <AccordionTrigger className="hover:no-underline py-3 text-sm font-semibold">
                            Ảnh/video
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground italic text-center py-2">
                            Chưa có hình ảnh
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="files" className="border-b px-4">
                        <AccordionTrigger className="hover:no-underline py-3 text-sm font-semibold">
                            File
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground italic text-center py-2">
                            Chưa có file
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="links" className="border-b px-4">
                        <AccordionTrigger className="hover:no-underline py-3 text-sm font-semibold">
                            Link
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground italic text-center py-2">
                            Chưa có link
                        </AccordionContent>
                    </AccordionItem>

                    {isGroup && (
                        <AccordionItem value="permissions" className="border-b px-4">
                            <AccordionTrigger className="hover:no-underline py-3 text-sm font-semibold">
                                Quyền thành viên
                            </AccordionTrigger>
                            <AccordionContent className="pb-3 px-1">
                                <div className="flex items-start space-x-3 bg-muted/40 p-2 rounded-lg border">
                                    <ShieldAlert className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <div className="flex-1 space-y-1">
                                        <div className="text-sm font-medium leading-none">
                                            Chỉ trưởng nhóm gửi tin nhắn
                                        </div>
                                        <p className="text-[11px] text-muted-foreground">
                                            Thành viên chỉ được phép xem và thả cảm xúc
                                        </p>
                                    </div>
                                    <Switch
                                        checked={onlyAdminsPost}
                                        onCheckedChange={setOnlyAdminsPost}
                                        className="scale-75 origin-right"
                                    />
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )}

                    <AccordionItem value="security" className="border-none px-4">
                        <AccordionTrigger className="hover:no-underline py-3 text-sm font-semibold">
                            Thiết lập bảo mật
                        </AccordionTrigger>
                        <AccordionContent className="pb-3 px-1">
                            {isGroup && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 gap-2 h-9 px-2"
                                    onClick={() => setLeaveGroupOpen(true)}
                                >
                                    <LogOut className="h-4 w-4" />
                                    Rời khỏi cuộc trò chuyện
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 gap-2 h-9 px-2"
                                onClick={() => setDeleteChatOpen(true)}
                            >
                                <Trash2 className="h-4 w-4" />
                                Xóa cuộc trò chuyện
                            </Button>
                        </AccordionContent>
                    </AccordionItem>

                </Accordion>
            </div>

            <AddMemberDialog open={addMemberOpen} onOpenChange={setAddMemberOpen} />
            <MuteChatDialog open={muteOpen} onOpenChange={setMuteOpen} />
            <LeaveGroupDialog open={leaveGroupOpen} onOpenChange={setLeaveGroupOpen} />
            <DeleteChatDialog open={deleteChatOpen} onOpenChange={setDeleteChatOpen} chatName={chat.name} />

            <div className="p-4 border-t flex items-center justify-between text-[10px] text-muted-foreground">
                <span>v2.17.8.6</span>
            </div>
        </div >
    )
}
