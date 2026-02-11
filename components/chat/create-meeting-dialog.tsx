"use client"

import React from "react"
import {
    X, Plus, Calendar as CalendarIcon, MapPin, Users, Bell, Clock,
    Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight,
    List, ListOrdered, Link2, Image as ImageIcon, ChevronDown
} from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface CreateMeetingDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    sourceMessage?: {
        author: string
        content: string
        date: string
    }
    onSubmit?: (data: any) => void
}

export function CreateMeetingDialog({ open, onOpenChange, sourceMessage, onSubmit }: CreateMeetingDialogProps) {
    const [title, setTitle] = React.useState(sourceMessage?.content ? `Cuộc họp về ${sourceMessage.content}` : "")
    const [startDate, setStartDate] = React.useState("10/02/2026")
    const [startTime, setStartTime] = React.useState("16:45")
    const [endTime, setEndTime] = React.useState("17:45")

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-[850px] w-[850px] p-0 overflow-hidden gap-0 h-auto max-h-[90vh]" showCloseButton={false}>
                <VisuallyHidden>
                    <DialogTitle>Tạo cuộc họp</DialogTitle>
                </VisuallyHidden>

                <div className="flex flex-col max-h-[90vh]">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b bg-white shrink-0">
                        <h2 className="text-lg font-semibold">Tạo cuộc họp</h2>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="link"
                                className="text-blue-500 hover:text-blue-600 h-auto p-0 text-sm font-normal"
                                onClick={() => onOpenChange(false)}
                            >
                                Đóng
                            </Button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto px-6 py-5 bg-white">
                        <div className="space-y-5">
                            {/* Section: Thông tin chung */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-foreground">Thông tin chung</h3>

                                {/* Tiêu đề cuộc họp */}
                                <div className="flex items-start gap-3">
                                    <div className="flex items-center gap-2 w-32 pt-2 text-sm text-muted-foreground">
                                        <CalendarIcon className="h-4 w-4" />
                                        <span>Tiêu đề cuộc họp (*):</span>
                                    </div>
                                    <div className="flex-1">
                                        <Input
                                            placeholder="Nhập tên cuộc họp..."
                                            className="w-full h-9 text-sm"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Chế độ riêng tư */}
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 w-32 text-sm text-muted-foreground">
                                        <Users className="h-4 w-4" />
                                        <span>Chế độ riêng tư:</span>
                                    </div>
                                    <div className="flex-1">
                                        <Button variant="outline" size="sm" className="h-8 gap-2 text-sm font-normal">
                                            Công khai <ChevronDown className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Thời gian họp */}
                                <div className="flex items-start gap-3">
                                    <div className="flex items-center gap-2 w-32 pt-2 text-sm text-muted-foreground">
                                        <Clock className="h-4 w-4" />
                                        <span>Thời gian họp:</span>
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-2">
                                            <CalendarIcon className="h-4 w-4 text-blue-500" />
                                            <Input
                                                type="text"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                className="w-32 h-8 text-sm"
                                            />
                                            <Input
                                                type="time"
                                                value={startTime}
                                                onChange={(e) => setStartTime(e.target.value)}
                                                className="w-24 h-8 text-sm"
                                            />
                                            <span className="text-sm text-muted-foreground">-</span>
                                            <Input
                                                type="time"
                                                value={endTime}
                                                onChange={(e) => setEndTime(e.target.value)}
                                                className="w-24 h-8 text-sm"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input type="checkbox" id="todolist" className="h-4 w-4 rounded border-gray-300" defaultChecked />
                                            <Label htmlFor="todolist" className="text-sm font-normal cursor-pointer">
                                                Giao xuống Todolist
                                            </Label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Cuộc họp lặp */}
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 w-32 text-sm text-muted-foreground">
                                    <CalendarIcon className="h-4 w-4" />
                                    <span>Cuộc họp lặp:</span>
                                </div>
                                <div className="flex-1">
                                    <Button variant="outline" size="sm" className="h-8 gap-2 text-sm font-normal text-muted-foreground">
                                        Không <ChevronDown className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </div>

                            {/* Thành viên */}
                            <div className="flex items-start gap-3">
                                <div className="flex items-center gap-2 w-32 pt-1 text-sm text-muted-foreground">
                                    <Users className="h-4 w-4" />
                                    <span>Thành viên:</span>
                                </div>
                                <div className="flex-1 flex items-center gap-2">
                                    <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                                        <AvatarImage src="/placeholder.svg" />
                                        <AvatarFallback className="text-xs">HTC</AvatarFallback>
                                    </Avatar>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full border border-dashed border-muted-foreground/30 text-muted-foreground hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Địa điểm */}
                            <div className="flex items-start gap-3">
                                <div className="flex items-center gap-2 w-32 pt-2 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    <span>Địa điểm:</span>
                                </div>
                                <div className="flex-1">
                                    <Button variant="outline" size="sm" className="h-8 gap-2 text-sm font-normal text-blue-500 border-blue-200 hover:bg-blue-50">
                                        Chọn địa điểm <ChevronDown className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </div>

                            {/* Nhóm cuộc họp */}
                            <div className="flex items-start gap-3">
                                <div className="flex items-center gap-2 w-32 pt-2 text-sm text-muted-foreground">
                                    <Users className="h-4 w-4" />
                                    <span>Nhóm cuộc họp:</span>
                                </div>
                                <div className="flex-1">
                                    <Button variant="outline" size="sm" className="h-8 gap-2 text-sm font-normal text-muted-foreground">
                                        Nhóm cuộc họp <ChevronDown className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </div>

                            {/* Nhắc việc */}
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 w-32 text-sm text-muted-foreground">
                                    <Bell className="h-4 w-4" />
                                    <span>Nhắc việc:</span>
                                </div>
                                <div className="flex-1">
                                    <Switch className="scale-90 origin-left" />
                                </div>
                            </div>

                            {/* Mô tả */}
                            <div className="flex items-start gap-3">
                                <div className="flex items-center gap-2 w-32 pt-2 text-sm text-muted-foreground">
                                    <AlignLeft className="h-4 w-4" />
                                    <span>Mô tả:</span>
                                </div>
                                <div className="flex-1">
                                    <div className="border rounded-lg overflow-hidden bg-white">
                                        {/* Toolbar */}
                                        <div className="flex items-center gap-0.5 px-2 py-1.5 bg-muted/20 border-b flex-wrap">
                                            <select className="text-xs border-none bg-transparent outline-none h-7 px-2 font-normal">
                                                <option>Normal</option>
                                            </select>
                                            <div className="w-[1px] h-4 bg-border mx-1" />
                                            <Button variant="ghost" size="icon" className="h-7 w-7"><Bold className="h-3.5 w-3.5" /></Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7"><Italic className="h-3.5 w-3.5" /></Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-xs font-bold">U</Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7"><Strikethrough className="h-3.5 w-3.5" /></Button>
                                            <div className="w-[1px] h-4 bg-border mx-1" />
                                            <Button variant="ghost" size="icon" className="h-7 w-7"><AlignLeft className="h-3.5 w-3.5" /></Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7"><AlignCenter className="h-3.5 w-3.5" /></Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7"><AlignRight className="h-3.5 w-3.5" /></Button>
                                            <div className="w-[1px] h-4 bg-border mx-1" />
                                            <Button variant="ghost" size="icon" className="h-7 w-7"><List className="h-3.5 w-3.5" /></Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7"><ListOrdered className="h-3.5 w-3.5" /></Button>
                                            <div className="w-[1px] h-4 bg-border mx-1" />
                                            <Button variant="ghost" size="icon" className="h-7 w-7"><ImageIcon className="h-3.5 w-3.5" /></Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7"><Link2 className="h-3.5 w-3.5" /></Button>
                                            <span className="text-[11px] text-blue-500 ml-auto cursor-pointer font-normal">Chế độ cơ bản</span>
                                        </div>
                                        <textarea
                                            placeholder="Nhập mô tả..."
                                            className="w-full p-3 min-h-[100px] text-sm resize-none outline-none border-none"
                                            defaultValue={sourceMessage?.content}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t bg-white shrink-0">
                        <div className="flex items-center justify-between">
                            <Button
                                variant="link"
                                className="text-blue-500 hover:text-blue-600 h-auto p-0 text-sm font-normal flex items-center gap-1"
                            >
                                <Plus className="h-4 w-4" />
                                Bật đầu họp
                            </Button>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    onClick={() => onOpenChange(false)}
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50 h-9 px-5 font-normal"
                                >
                                    Hủy
                                </Button>
                                <Button
                                    className="bg-blue-600 hover:bg-blue-700 h-9 px-5 font-normal"
                                    onClick={() => {
                                        if (!title.trim()) return
                                        onSubmit?.({
                                            type: 'meeting' as const,
                                            title: title,
                                            status: 'Todo',
                                            assigner: {
                                                name: 'Hoàng Tuấn Cường',
                                                avatar: '/placeholder.svg'
                                            },
                                            description: 'Cuộc họp mới được tạo từ tin nhắn',
                                            source: 'Tin nhắn'
                                        })
                                        onOpenChange(false)
                                    }}
                                >
                                    Cập nhật
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
