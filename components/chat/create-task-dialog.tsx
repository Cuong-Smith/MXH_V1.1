"use client"

import React from "react"
import {
    X, Plus, Calendar as CalendarIcon, Flag, Zap,
    Bold, Italic, Underline, Strikethrough, Type,
    AlignCenter, List, ListOrdered, Link2, Image as ImageIcon,
    FileUp, Bell, ChevronLeft, ChevronRight, MessageSquare, ChevronDown
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface CreateTaskDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    sourceMessage?: {
        author: string
        content: string
        date: string
    }
    onSubmit?: (data: any) => void
}

export function CreateTaskDialog({ open, onOpenChange, sourceMessage, onSubmit }: CreateTaskDialogProps) {
    const [title, setTitle] = React.useState(sourceMessage?.content || "")

    const handleSubmit = () => {
        if (!title.trim()) return

        onSubmit?.({
            type: 'todolist' as const,
            title: title,
            status: 'Todo',
            assigner: {
                name: 'Hoàng Tuấn Cường',
                avatar: '/placeholder.svg'
            },
            description: 'Công việc mới được tạo từ tin nhắn',
            source: 'Tin nhắn'
        })
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-[98vw] w-[98vw] p-0 overflow-hidden gap-0 h-[95vh] !max-h-[95vh]" showCloseButton={false}>
                <VisuallyHidden>
                    <DialogTitle>Tạo công việc từ tin nhắn</DialogTitle>
                </VisuallyHidden>
                <div className="flex flex-col h-full w-full">
                    {/* Header Tabs */}
                    <div className="flex items-center justify-between px-6 border-b bg-white h-14 shrink-0">
                        <Tabs defaultValue="message-task" className="w-auto">
                            <TabsList className="bg-transparent h-14 p-0 gap-8">
                                <TabsTrigger
                                    value="overview"
                                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-foreground rounded-none h-14 px-0 text-[15px] font-normal text-muted-foreground data-[state=active]:text-foreground"
                                >
                                    Việc tổng quan
                                </TabsTrigger>
                                <TabsTrigger
                                    value="message-task"
                                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-foreground rounded-none h-14 px-0 text-[15px] font-normal text-muted-foreground data-[state=active]:text-foreground"
                                >
                                    Công việc tin nhắn
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8 hover:bg-muted">
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="flex flex-1 overflow-hidden">
                        {/* Left Side - Task Form */}
                        <div className="flex-1 overflow-y-auto px-6 py-5 border-r flex flex-col gap-5 bg-white">
                            {/* Title Input */}
                            <div className="flex items-start gap-3">
                                <Input
                                    placeholder="Nhập nội dung..."
                                    className="border-none shadow-none text-base font-normal p-0 focus-visible:ring-0 h-auto"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                <div className="flex items-center gap-1 shrink-0">
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:bg-muted"><Flag className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:bg-muted"><Zap className="h-4 w-4" /></Button>
                                    <Button variant="outline" size="sm" className="h-7 gap-1 text-xs px-2.5 font-normal">
                                        Todo <ChevronDown className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>

                            {/* Description Section */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-foreground">
                                    Mô tả <Plus className="h-3.5 w-3.5 text-blue-500 cursor-pointer" />
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
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-xs font-bold">U</Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7"><Strikethrough className="h-3.5 w-3.5" /></Button>
                                        <div className="w-[1px] h-4 bg-border mx-1" />
                                        <Button variant="ghost" size="icon" className="h-7 w-7"><Type className="h-3.5 w-3.5" /></Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7"><Type className="h-3.5 w-3.5" /></Button>
                                        <div className="w-[1px] h-4 bg-border mx-1" />
                                        <Button variant="ghost" size="icon" className="h-7 w-7"><List className="h-3.5 w-3.5" /></Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7"><ListOrdered className="h-3.5 w-3.5" /></Button>
                                        <div className="w-[1px] h-4 bg-border mx-1" />
                                        <Button variant="ghost" size="icon" className="h-7 w-7"><ImageIcon className="h-3.5 w-3.5" /></Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7"><Link2 className="h-3.5 w-3.5" /></Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-xs">@</Button>
                                        <span className="text-[11px] text-blue-500 ml-auto cursor-pointer font-normal">Chế độ cơ bản</span>
                                    </div>
                                    <div className="p-3 min-h-[80px] text-sm text-muted-foreground/50">
                                        Nhập mô tả công việc...
                                    </div>
                                </div>
                            </div>

                            {/* Task Fields */}
                            <div className="grid grid-cols-1 gap-4 text-sm">
                                <div className="flex items-center gap-4">
                                    <span className="w-20 text-muted-foreground flex items-center gap-1.5 text-[13px]">
                                        <MessageSquare className="h-3.5 w-3.5" /> Nguồn:
                                    </span>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-200 flex items-center gap-1.5 font-normal py-0.5 px-2.5 text-xs">
                                            <MessageSquare className="h-3 w-3" /> Tin nhắn
                                        </Badge>
                                        <span className="text-[11px] text-muted-foreground italic">giao bởi</span>
                                        <div className="flex items-center gap-1.5">
                                            <Avatar className="h-5 w-5">
                                                <AvatarImage src="/placeholder.svg" />
                                                <AvatarFallback className="text-[10px]">HTC</AvatarFallback>
                                            </Avatar>
                                            <span className="font-normal text-[13px]">{sourceMessage?.author || "Hoàng Tuấn Cường"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className="w-20 text-muted-foreground flex items-center gap-1.5 text-[13px]">
                                        <Plus className="h-3.5 w-3.5" /> Thành viên:
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-7 w-7 border-2 border-white shadow-sm">
                                            <AvatarImage src="/placeholder.svg" />
                                            <AvatarFallback className="text-xs">HTC</AvatarFallback>
                                        </Avatar>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full border border-dashed border-muted-foreground/30 text-muted-foreground hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50">
                                            <Plus className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <span className="w-20 text-muted-foreground flex items-center gap-1.5 text-[13px] mt-0.5">
                                        <CalendarIcon className="h-3.5 w-3.5" /> Thời gian:
                                    </span>
                                    <div className="space-y-2.5">
                                        <div className="flex items-center gap-2 text-xs font-normal">
                                            <CalendarIcon className="h-3.5 w-3.5 text-blue-500" />
                                            <span>10/02/26 08:00 - 17/02/26 23:59</span>
                                        </div>
                                        <RadioGroup defaultValue="default" className="flex items-center gap-6">
                                            <div className="flex items-center space-x-1.5">
                                                <RadioGroupItem value="default" id="r1" className="h-4 w-4 text-blue-500" />
                                                <Label htmlFor="r1" className="text-xs font-normal cursor-pointer">Mặc định</Label>
                                            </div>
                                            <div className="flex items-center space-x-1.5">
                                                <RadioGroupItem value="shift" id="r2" className="h-4 w-4" />
                                                <Label htmlFor="r2" className="text-xs font-normal cursor-pointer">Theo ca</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className="w-20 text-muted-foreground flex items-center gap-1.5 text-[13px]">
                                        <Plus className="h-3.5 w-3.5" /> Loại công việc:
                                    </span>
                                    <span className="text-blue-500 text-xs font-normal cursor-pointer hover:underline">Chọn nhãn</span>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className="w-20 text-muted-foreground flex items-center gap-1.5 text-[13px]">
                                        <FileUp className="h-3.5 w-3.5" /> Đính kèm:
                                    </span>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-500 bg-blue-50 hover:bg-blue-100 rounded-md">
                                        <FileUp className="h-3.5 w-3.5" />
                                    </Button>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className="w-20 text-muted-foreground flex items-center gap-1.5 text-[13px]">
                                        <Bell className="h-3.5 w-3.5" /> Nhắc việc:
                                    </span>
                                    <Switch className="scale-90 origin-left" />
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="mt-auto pt-4 border-t">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm font-normal">
                                        Checklist (0/0)
                                        <Plus className="h-4 w-4 text-blue-500 cursor-pointer" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-red-500 hover:text-red-600 hover:bg-red-50 h-9 px-5 font-normal">
                                            Hủy
                                        </Button>
                                        <Button
                                            className="bg-blue-600 hover:bg-blue-700 h-9 px-5 font-normal"
                                            onClick={handleSubmit}
                                        >
                                            Cập nhật
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Message Preview */}
                        <div className="w-[400px] bg-[#FAFBFC] px-6 py-5 flex flex-col gap-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="/placeholder.svg" />
                                        <AvatarFallback className="text-xs">HTC</AvatarFallback>
                                    </Avatar>
                                    <span className="font-semibold text-sm">{sourceMessage?.author || "Hoàng Tuấn Cường"}</span>
                                </div>
                                <div className="flex items-center gap-0.5 border rounded-md bg-white px-1 py-0.5">
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-blue-500 bg-blue-50 hover:bg-blue-100">
                                        <CalendarIcon className="h-3.5 w-3.5" />
                                    </Button>
                                    <span className="text-[11px] px-1.5 font-medium">10/02/2026</span>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-muted">
                                        <ChevronLeft className="h-3 w-3" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-muted">
                                        <ChevronRight className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="text-xs text-muted-foreground font-medium">báo cáo chat</div>
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative">
                                    <p className="text-sm font-medium leading-relaxed pr-8">
                                        {sourceMessage?.content || "ờ ra v"}
                                    </p>
                                    <div className="flex items-center gap-2 absolute top-3 right-3 text-muted-foreground/30">
                                        <Flag className="h-3.5 w-3.5" />
                                        <MessageSquare className="h-3.5 w-3.5" />
                                    </div>
                                    <div className="flex items-center justify-end gap-2 text-[11px] text-muted-foreground mt-3">
                                        <span>11:21 - 17:30</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
