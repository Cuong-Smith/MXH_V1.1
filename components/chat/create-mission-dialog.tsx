"use client"

import React from "react"
import {
    X, Calendar as CalendarIcon, Clock, Flag, Zap,
    Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight,
    List, ListOrdered, Link2, Image as ImageIcon, ChevronDown, User, Bell
} from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface CreateMissionDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    sourceMessage?: {
        author: string
        content: string
        date: string
    }
    onSubmit?: (data: any) => void
}

export function CreateMissionDialog({ open, onOpenChange, sourceMessage, onSubmit }: CreateMissionDialogProps) {
    const [title, setTitle] = React.useState(sourceMessage?.content || "")
    const [date, setDate] = React.useState("10/02/2026")
    const [time, setTime] = React.useState("09:00")

    const handleSubmit = () => {
        if (!title.trim()) return

        onSubmit?.({
            type: 'workflow' as const,
            title: title,
            status: 'Todo',
            assigner: {
                name: 'Hoàng Tuấn Cường',
                avatar: '/placeholder.svg'
            },
            description: 'Nhiệm vụ mới được tạo từ tin nhắn',
            source: 'Tin nhắn'
        })
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-[700px] w-[700px] p-0 overflow-hidden gap-0 h-auto max-h-[90vh]" showCloseButton={false}>
                <VisuallyHidden>
                    <DialogTitle>Tạo nhiệm vụ</DialogTitle>
                </VisuallyHidden>

                <div className="flex flex-col max-h-[90vh]">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b bg-white shrink-0">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Clock className="h-5 w-5 text-blue-500" />
                            Tạo nhiệm vụ
                        </h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:bg-muted"
                            onClick={() => onOpenChange(false)}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto px-6 py-5 bg-white">
                        <div className="space-y-6">
                            {/* Tiêu đề */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-muted-foreground">Tên nhiệm vụ (*)</Label>
                                <Input
                                    placeholder="Nhập tên nhiệm vụ..."
                                    className="text-base font-medium"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            {/* Thời hạn & Người thực hiện Row */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">Thời hạn</Label>
                                    <div className="flex items-center gap-2">
                                        <div className="relative flex-1">
                                            <CalendarIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                value={date}
                                                onChange={(e) => setDate(e.target.value)}
                                                className="pl-9"
                                            />
                                        </div>
                                        <Input
                                            type="time"
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                            className="w-24"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">Người thực hiện</Label>
                                    <div className="flex items-center gap-2 p-1 rounded-md border border-input h-10 px-3">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src="/placeholder.svg" />
                                            <AvatarFallback>U</AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm flex-1">Tôi</span>
                                        <ChevronDown className="h-4 w-4 text-muted-foreground opacity-50" />
                                    </div>
                                </div>
                            </div>

                            {/* Options Row */}
                            <div className="flex items-center justify-between py-2">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <Switch id="important" />
                                        <Label htmlFor="important" className="text-sm font-normal cursor-pointer flex items-center gap-1">
                                            <Flag className="h-3.5 w-3.5" /> Quan trọng
                                        </Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Switch id="remind" defaultChecked />
                                        <Label htmlFor="remind" className="text-sm font-normal cursor-pointer flex items-center gap-1">
                                            <Bell className="h-3.5 w-3.5" /> Nhắc nhở
                                        </Label>
                                    </div>
                                </div>
                            </div>

                            {/* Mô tả */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-muted-foreground">Mô tả chi tiết</Label>
                                <div className="border rounded-lg overflow-hidden bg-white">
                                    {/* Toolbar */}
                                    <div className="flex items-center gap-0.5 px-2 py-1.5 bg-muted/20 border-b flex-wrap">
                                        <Button variant="ghost" size="icon" className="h-7 w-7"><Bold className="h-3.5 w-3.5" /></Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7"><Italic className="h-3.5 w-3.5" /></Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7"><Underline className="h-3.5 w-3.5" /></Button>
                                        <div className="w-[1px] h-4 bg-border mx-1" />
                                        <Button variant="ghost" size="icon" className="h-7 w-7"><List className="h-3.5 w-3.5" /></Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7"><ListOrdered className="h-3.5 w-3.5" /></Button>
                                        <div className="w-[1px] h-4 bg-border mx-1" />
                                        <Button variant="ghost" size="icon" className="h-7 w-7"><ImageIcon className="h-3.5 w-3.5" /></Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7"><Link2 className="h-3.5 w-3.5" /></Button>
                                    </div>
                                    <textarea
                                        placeholder="Nhập ghi chú hoặc mô tả..."
                                        className="w-full p-3 min-h-[120px] text-sm resize-none outline-none border-none focus:ring-0"
                                        defaultValue={sourceMessage?.content}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t bg-gray-50/50 shrink-0 flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="h-9 px-5"
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 h-9 px-6 gap-2"
                            onClick={handleSubmit}
                        >
                            <Clock className="h-4 w-4" />
                            Tạo nhiệm vụ
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
