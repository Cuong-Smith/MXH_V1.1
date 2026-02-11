"use client"

import React from "react"
import {
    X, Flag, Zap, Calendar, Bell,
    ChevronDown, Plus, MessageSquare, Menu,
    Send, Image as LucideImage, Smile,
    Bold, Italic, Strikethrough, Type,
    List, ListOrdered, Link2, FileUp
} from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface TodolistDetailDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    taskData?: any
}

export function TodolistDetailDialog({ open, onOpenChange, taskData }: TodolistDetailDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-[98vw] w-[98vw] p-0 overflow-hidden gap-0 h-[95vh] !max-h-[95vh] rounded-xl border-none shadow-2xl flex flex-col" showCloseButton={false}>
                <VisuallyHidden>
                    <DialogTitle>Chi tiết công việc</DialogTitle>
                    <DialogDescription>Xem thông tin chi tiết và bình luận về công việc</DialogDescription>
                </VisuallyHidden>

                {/* Header Tabs - Matched with CreateTaskDialog */}
                <div className="flex items-center justify-between px-6 border-b bg-white h-14 shrink-0">
                    <Tabs defaultValue="chat-work" className="w-auto">
                        <TabsList className="bg-transparent h-14 p-0 gap-8">
                            <TabsTrigger
                                value="overview"
                                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-foreground rounded-none h-14 px-0 text-[15px] font-normal text-muted-foreground data-[state=active]:text-foreground"
                            >
                                Việc tổng quan
                            </TabsTrigger>
                            <TabsTrigger
                                value="chat-work"
                                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-foreground rounded-none h-14 px-0 text-[15px] font-normal text-muted-foreground data-[state=active]:text-foreground"
                            >
                                Công việc tin nhắn
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-muted"
                        onClick={() => onOpenChange(false)}
                    >
                        <X className="h-5 w-5 text-slate-500" />
                    </Button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Left Side: Task Content - Matched with CreateTaskDialog gap and padding */}
                    <div className="flex-1 overflow-y-auto px-6 py-5 border-r flex flex-col gap-6 bg-white custom-scrollbar">
                        {/* Title Row */}
                        <div className="flex items-start justify-between">
                            <h2 className="text-2xl font-bold text-slate-800">Công việc mới</h2>
                            <div className="flex items-center gap-1 shrink-0">
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:bg-muted">
                                    <Flag className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:bg-muted">
                                    <Zap className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" className="h-7 gap-1 text-xs px-2.5 font-normal ml-2">
                                    Todo <ChevronDown className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>

                        {/* Editor Section */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-foreground">
                                <span>Mô tả</span>
                                <Plus className="h-3.5 w-3.5 text-blue-500 cursor-pointer" />
                            </div>
                            <div className="border rounded-lg overflow-hidden bg-white">
                                {/* Toolbar */}
                                <div className="flex items-center gap-0.5 px-2 py-1.5 bg-muted/20 border-b">
                                    <select className="text-xs border-none bg-transparent outline-none h-7 px-2 font-normal">
                                        <option>Normal</option>
                                    </select>
                                    <div className="w-[1px] h-4 bg-border mx-1" />
                                    <Button variant="ghost" size="icon" className="h-7 w-7"><Bold className="h-3.5 w-3.5" /></Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7"><Italic className="h-3.5 w-3.5" /></Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-xs font-bold font-serif">U</Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7"><Strikethrough className="h-3.5 w-3.5" /></Button>
                                    <div className="w-[1px] h-4 bg-border mx-1" />
                                    <Button variant="ghost" size="icon" className="h-7 w-7"><Type className="h-3.5 w-3.5" /></Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7"><Type className="h-3.5 w-3.5" /></Button>
                                    <div className="w-[1px] h-4 bg-border mx-1" />
                                    <Button variant="ghost" size="icon" className="h-7 w-7"><List className="h-3.5 w-3.5" /></Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7"><ListOrdered className="h-3.5 w-3.5" /></Button>
                                    <div className="w-[1px] h-4 bg-border mx-1" />
                                    <Button variant="ghost" size="icon" className="h-7 w-7"><LucideImage className="h-3.5 w-3.5" /></Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7"><Link2 className="h-3.5 w-3.5" /></Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-xs">@</Button>
                                    <span className="text-[11px] text-blue-500 ml-auto cursor-pointer font-normal">Chế độ cơ bản</span>
                                </div>
                                <div className="p-4 min-h-[100px] text-slate-600 text-[14px]">
                                    Bhh
                                </div>
                            </div>
                        </div>

                        {/* Metadata Fields Area */}
                        <div className="grid grid-cols-1 gap-5 text-sm">
                            {/* Source */}
                            <div className="flex items-center gap-4">
                                <span className="w-24 text-muted-foreground flex items-center gap-1.5 text-[13px]">
                                    <MessageSquare className="h-3.5 w-3.5" /> Nguồn:
                                </span>
                                <div className="flex items-center gap-2 flex-wrap text-[13px]">
                                    <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-200 flex items-center gap-1.5 font-normal py-0.5 px-2.5 text-xs">
                                        <MessageSquare className="h-3 w-3" /> Tin nhắn
                                    </Badge>
                                    <span className="text-[11px] text-muted-foreground italic">giao bởi</span>
                                    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                                        <Avatar className="h-5 w-5">
                                            <AvatarImage src="https://i.pravatar.cc/150?u=nhu" />
                                            <AvatarFallback className="text-[10px]">PN</AvatarFallback>
                                        </Avatar>
                                        <span className="font-semibold text-slate-700">Phạm Thị Quỳnh Như</span>
                                    </div>
                                </div>
                            </div>

                            {/* Members */}
                            <div className="flex items-center gap-4">
                                <span className="w-24 text-muted-foreground flex items-center gap-1.5 text-[13px]">
                                    <Plus className="h-3.5 w-3.5" /> Thành viên:
                                </span>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full border border-dashed border-muted-foreground/30 text-muted-foreground hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50">
                                        <Plus className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </div>

                            {/* Time */}
                            <div className="flex items-start gap-4">
                                <span className="w-24 text-muted-foreground flex items-center gap-1.5 text-[13px] mt-0.5">
                                    <Calendar className="h-3.5 w-3.5" /> Thời gian:
                                </span>
                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                                    <Calendar className="h-3.5 w-3.5 text-blue-500" />
                                    <span>01/01/01 10:30 - 01/01/01 11:30</span>
                                </div>
                            </div>

                            {/* Type */}
                            <div className="flex items-center gap-4">
                                <span className="w-24 text-muted-foreground flex items-center gap-1.5 text-[13px]">
                                    <Plus className="h-3.5 w-3.5" /> Loại công việc:
                                </span>
                                <span className="text-blue-500 text-xs font-semibold cursor-pointer hover:underline flex items-center gap-2">
                                    <div className="w-3 h-3 bg-blue-600 rounded-[2px]" />
                                    Chọn nhãn
                                </span>
                            </div>

                            {/* Attachments */}
                            <div className="flex items-center gap-4">
                                <span className="w-24 text-muted-foreground flex items-center gap-1.5 text-[13px]">
                                    <FileUp className="h-3.5 w-3.5" /> Đính kèm:
                                </span>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-500 bg-blue-50 hover:bg-blue-100 rounded-md">
                                    <FileUp className="h-3.5 w-3.5" />
                                </Button>
                            </div>

                            {/* Reminder */}
                            <div className="flex items-center gap-4">
                                <span className="w-24 text-muted-foreground flex items-center gap-1.5 text-[13px]">
                                    <Bell className="h-3.5 w-3.5" /> Nhắc việc:
                                </span>
                                <div className="w-8 h-4 bg-slate-200 rounded-full relative cursor-pointer scale-90 origin-left">
                                    <div className="absolute left-1 top-1 w-2 h-2 bg-white rounded-full" />
                                </div>
                            </div>
                        </div>

                        {/* Checklist Section - Updated design */}
                        <div className="mt-4 pt-6 border-t space-y-5">
                            <div className="flex items-center gap-2 text-[15px] font-bold text-slate-800">
                                Checklist (0/0)
                                <Plus className="h-4 w-4 text-blue-500 cursor-pointer" />
                            </div>

                            <div className="space-y-4">
                                <div className="text-[14px] font-bold text-slate-700 uppercase tracking-tight">Danh sách công việc</div>
                                <div className="space-y-4 ml-1">
                                    <div className="flex items-start gap-4">
                                        <ChevronDown className="h-4 w-4 text-slate-400 mt-1.5 cursor-pointer shrink-0" />
                                        <Avatar className="h-9 w-9 ring-2 ring-white shadow-sm shrink-0">
                                            <AvatarImage src="https://i.pravatar.cc/150?u=nhu" />
                                            <AvatarFallback>PN</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 space-y-3 pt-1">
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-slate-800 text-[14px]">Phạm Thị Quỳnh Như</span>
                                                <span className="text-[11px] text-slate-400 font-semibold uppercase">Hoàn thành 0/3</span>
                                            </div>
                                            <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100 shadow-sm space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3 text-slate-600">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                                        <span className="text-[13px] font-medium">dd/MM/yyyy 10:30 - 11:30</span>
                                                    </div>
                                                    <Badge variant="outline" className="h-7 px-5 bg-white border-slate-200 text-slate-500 shadow-sm text-xs rounded-lg font-semibold">Todo</Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Comments - Matches width of CreateTaskDialog sidebar */}
                    <div className="w-[400px] flex flex-col bg-[#FAFBFC] border-l">
                        <div className="p-4 border-b bg-white">
                            <h3 className="text-[15px] font-bold text-slate-700">Bình luận</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                            {/* Comments area */}
                        </div>
                        <div className="p-4 border-t bg-white space-y-3">
                            <div className="flex items-center gap-2 border border-slate-200 p-2 rounded-xl bg-[#F8F9FB] shadow-inner focus-within:border-blue-300 transition-colors">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 shrink-0 hover:bg-slate-200">
                                    <Plus className="h-5 w-5 rotate-45" />
                                </Button>
                                <Input
                                    placeholder="Nhập bình luận"
                                    className="flex-1 border-none bg-transparent h-9 px-1 text-sm shadow-none focus-visible:ring-0"
                                />
                                <Button size="icon" className="h-8 w-8 bg-blue-600 hover:bg-blue-700 rounded-lg shrink-0 shadow-lg shadow-blue-200">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
