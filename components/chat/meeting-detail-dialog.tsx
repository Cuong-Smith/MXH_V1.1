"use client"

import React from "react"
import {
    X, Calendar, Clock, Lock, Shield, MapPin,
    Users, MessageSquare, MoreHorizontal, Play, LogOut,
    Plus, ChevronDown, Check, FileUp, Link2
} from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

interface MeetingDetailDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    meetingData?: any
}

export function MeetingDetailDialog({ open, onOpenChange, meetingData }: MeetingDetailDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-[98vw] w-[98vw] p-0 overflow-hidden gap-0 h-[95vh] !max-h-[95vh] rounded-xl border-none shadow-2xl flex flex-col bg-white" showCloseButton={false}>
                <VisuallyHidden>
                    <DialogTitle>Chi tiết cuộc họp</DialogTitle>
                    <DialogDescription>Xem thông tin chi tiết và tham gia cuộc họp</DialogDescription>
                </VisuallyHidden>

                {/* Header Tabs */}
                <div className="flex items-center justify-between px-6 border-b bg-white h-14 shrink-0">
                    <Tabs defaultValue="meeting-work" className="w-auto">
                        <TabsList className="bg-transparent h-14 p-0 gap-8">
                            <TabsTrigger
                                value="daily"
                                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none h-14 px-0 text-[15px] font-semibold text-muted-foreground data-[state=active]:text-blue-600"
                            >
                                Việc trong ngày
                            </TabsTrigger>
                            <TabsTrigger
                                value="meeting-work"
                                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none h-14 px-0 text-[15px] font-semibold text-muted-foreground data-[state=active]:text-blue-600"
                            >
                                Công việc cuộc họp
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="flex items-center gap-4">
                        <span className="text-[13px] text-slate-500 italic">Hôm nay: T4 11/02/2026</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-slate-50">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-muted"
                            onClick={() => onOpenChange(false)}
                        >
                            <X className="h-5 w-5 text-slate-500" />
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
                    <div className="max-w-[1200px] mx-auto p-10 space-y-10">
                        {/* Title Section */}
                        <div className="space-y-6">
                            <h2 className="text-[28px] font-bold text-slate-800">Cuộc họp ngày tesst</h2>

                            {/* Sub Tabs */}
                            <div className="flex items-center gap-8 border-b border-slate-100">
                                <button className="pb-3 border-b-2 border-blue-600 text-[15px] font-bold text-blue-600">
                                    Thông tin chi tiết
                                </button>
                                <button className="pb-3 border-b-2 border-transparent text-[15px] font-bold text-slate-400 hover:text-slate-600">
                                    Thành viên
                                </button>
                            </div>
                        </div>

                        {/* Information Grid */}
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[16px] font-bold text-slate-800">Thông tin chung</h3>
                                <ChevronDown className="h-4 w-4 text-slate-400" />
                            </div>

                            <div className="grid grid-cols-[1fr_2fr] gap-y-6 text-sm">
                                {/* Privacy */}
                                <div className="flex items-center gap-3 text-slate-400">
                                    <Lock className="h-4 w-4" />
                                    <span>Chế độ riêng tư:</span>
                                </div>
                                <div className="font-semibold text-slate-700">Công khai</div>

                                {/* Time */}
                                <div className="flex items-center gap-3 text-slate-400">
                                    <Clock className="h-4 w-4" />
                                    <span>Thời gian họp:</span>
                                </div>
                                <div className="space-y-3">
                                    <div className="font-semibold text-slate-700">11/02/2026 &nbsp; 08:30-08:50</div>
                                    <div className="flex items-center gap-2 text-blue-600/60 font-medium">
                                        <div className="h-4 w-4 border-2 border-current rounded flex items-center justify-center p-0.5">
                                            <Check className="h-3 w-3" />
                                        </div>
                                        <span>Giao xuống Todolist</span>
                                    </div>
                                </div>

                                {/* Members */}
                                <div className="flex items-center gap-3 text-slate-400">
                                    <Users className="h-4 w-4" />
                                    <span>Thành viên:</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8 ring-2 ring-white">
                                        <AvatarImage src="https://i.pravatar.cc/150?u=user1" />
                                        <AvatarFallback>U</AvatarFallback>
                                    </Avatar>
                                    <ChevronDown className="h-4 w-4 text-slate-400 -rotate-90" />
                                </div>

                                {/* Location */}
                                <div className="flex items-center gap-3 text-slate-400">
                                    <MapPin className="h-4 w-4" />
                                    <span>Địa điểm:</span>
                                </div>
                                <div className="italic text-slate-400 font-medium">Không có dữ liệu</div>

                                {/* Group */}
                                <div className="flex items-center gap-3 text-slate-400">
                                    <Users className="h-4 w-4" />
                                    <span>Nhóm cuộc họp:</span>
                                </div>
                                <div className="italic text-slate-400 font-medium">Không có dữ liệu</div>

                                {/* Content */}
                                <div className="flex items-center gap-3 text-slate-400">
                                    <MessageSquare className="h-4 w-4" />
                                    <span>Nội dung:</span>
                                </div>
                                <div className="italic text-slate-400 font-medium whitespace-pre-wrap"></div>
                            </div>
                        </div>

                        {/* File Attachments */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-slate-400 text-sm">
                                <Link2 className="h-4 w-4" />
                                <span>File đính kèm:</span>
                            </div>
                            <div className="italic text-slate-400 text-sm font-medium">
                                Không có file đính kèm nào
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-8 border-t bg-white shrink-0">
                    <div className="flex items-center gap-3">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 px-6 rounded-lg flex items-center gap-2 shadow-lg shadow-blue-100">
                            <Play className="h-4 w-4 fill-current" />
                            Bắt đầu họp
                        </Button>
                        <Button className="bg-red-700 hover:bg-red-800 text-white font-bold h-11 px-6 rounded-lg flex items-center gap-2 shadow-lg shadow-red-100">
                            <LogOut className="h-4 w-4" />
                            Kết thúc họp
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
