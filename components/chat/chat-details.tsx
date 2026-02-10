"use client"

import React from "react"
import { Pin, Trash2, ChevronDown, CheckCircle2, Video, FileText, Link, ShieldAlert, Edit2, UserPlus, MoreHorizontal, Shield, MessageSquare, BellOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AddMemberDialog } from "./add-member-dialog"
import { MuteChatDialog } from "./mute-chat-dialog"

interface ChatDetailsProps {
    isGroup?: boolean
}

export function ChatDetails({ isGroup = true }: ChatDetailsProps) {
    const [addMemberOpen, setAddMemberOpen] = React.useState(false)
    const [muteOpen, setMuteOpen] = React.useState(false)

    const MOCK_MEMBERS = [
        { name: "Nguyễn Thị Hồng Hạnh", role: "Admin", avatar: "/placeholder.svg" },
        { name: "Phạm Thị Quỳnh Như", role: "Thành viên", avatar: "/placeholder.svg" },
        { name: "Bùi Anh Tuấn", role: "Thành viên", avatar: "/placeholder.svg" },
    ]

    return (
        <div className="flex h-full w-[300px] flex-col border-l bg-background overflow-y-auto">
            {/* Profile Header */}
            <div className="flex flex-col items-center p-6 text-center space-y-3 border-b">
                <div className="relative">
                    <div className="h-16 w-16 bg-yellow-400 rounded-lg flex items-center justify-center p-2">
                        <svg viewBox="0 0 24 24" className="text-white fill-current w-full h-full">
                            <path d="M13 10V3L4 14H11V21L20 10H13Z" />
                        </svg>
                    </div>
                    <Button variant="outline" size="icon" className="absolute -right-2 -bottom-2 h-6 w-6 rounded-full bg-background scale-75">
                        <Edit2 className="h-3 w-3" />
                    </Button>
                </div>
                <div>
                    <h3 className="font-bold text-lg">Fastdo AI</h3>
                    <div className="flex items-center justify-center gap-4 mt-1">
                        <div className="flex items-center gap-1 text-[11px] text-primary font-semibold cursor-pointer hover:opacity-80">
                            <Pin className="h-3 w-3 rotate-45 text-primary" />
                            Bỏ Ghim
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

                    <AccordionItem value="security" className="border-none px-4">
                        <AccordionTrigger className="hover:no-underline py-3 text-sm font-semibold">
                            Thiết lập bảo mật
                        </AccordionTrigger>
                        <AccordionContent className="pb-3 px-1">
                            <Button variant="ghost" size="sm" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 gap-2 h-9 px-2">
                                <Trash2 className="h-4 w-4" />
                                Xóa cuộc trò chuyện
                            </Button>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

            <AddMemberDialog open={addMemberOpen} onOpenChange={setAddMemberOpen} />
            <MuteChatDialog open={muteOpen} onOpenChange={setMuteOpen} />

            <div className="p-4 border-t flex items-center justify-between text-[10px] text-muted-foreground">
                <span>v2.17.8.6</span>
            </div>
        </div>
    )
}
