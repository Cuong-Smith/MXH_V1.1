"use client"

import React from "react"
import {
    X, Settings2, User, ChevronDown, Plus,
    MessageSquare, Send, Image as LucideImage,
    Smile, MoreHorizontal, FileText, Info,
    Pin, Check, Share2, CornerUpRight
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

interface ProcessDetailDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    processData?: any
}

export function ProcessDetailDialog({ open, onOpenChange, processData }: ProcessDetailDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-[98vw] w-[98vw] p-0 overflow-hidden gap-0 h-[95vh] !max-h-[95vh] rounded-xl border-none shadow-2xl flex flex-col bg-slate-50/30" showCloseButton={false}>
                <VisuallyHidden>
                    <DialogTitle>Chi tiết quy trình</DialogTitle>
                    <DialogDescription>Xử lý và theo dõi tiến độ quy trình</DialogDescription>
                </VisuallyHidden>

                {/* Header Tabs */}
                <div className="flex items-center justify-between px-6 border-b bg-white h-14 shrink-0">
                    <Tabs defaultValue="process-work" className="w-auto">
                        <TabsList className="bg-transparent h-14 p-0 gap-8">
                            <TabsTrigger
                                value="overview"
                                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none h-14 px-0 text-[15px] font-semibold text-muted-foreground data-[state=active]:text-blue-600"
                            >
                                Việc tổng quan
                            </TabsTrigger>
                            <TabsTrigger
                                value="process-work"
                                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none h-14 px-0 text-[15px] font-semibold text-muted-foreground data-[state=active]:text-blue-600"
                            >
                                Công việc quy trình
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

                <div className="flex-1 overflow-hidden flex flex-col bg-white">
                    {/* Title & Top Badges Section */}
                    <div className="px-8 pt-8 pb-4 space-y-4">
                        <h2 className="text-[22px] font-bold text-slate-800 leading-tight">
                            Kết nối mạnh hơn Quy trình & Dữ liệu (fData) để thành một CRM thu nhỏ
                        </h2>
                        <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-none px-3 py-1 gap-2 text-[13px] font-medium rounded-lg">
                                <Settings2 className="w-4 h-4" />
                                Phân tích ticket
                            </Badge>
                            <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-none px-3 py-1 gap-2 text-[13px] font-medium rounded-lg">
                                Chủ nhận việc
                            </Badge>
                        </div>
                    </div>

                    {/* Navigation Tabs (Internal) */}
                    <div className="px-8 flex items-center justify-between border-b border-slate-100 shrink-0">
                        <div className="flex items-center gap-8">
                            <button className="h-12 border-b-2 border-blue-600 text-[14px] font-bold text-blue-600">
                                Xử lý công việc
                            </button>
                            <button className="h-12 border-b-2 border-transparent text-[14px] font-bold text-slate-400 hover:text-slate-600">
                                Sơ đồ quy trình
                            </button>
                            <button className="h-12 border-b-2 border-transparent text-[14px] font-bold text-slate-400 hover:text-slate-600">
                                Lịch sử nhiệm vụ
                            </button>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                            <MoreHorizontal className="w-5 h-5" />
                        </Button>
                    </div>

                    <div className="flex flex-1 overflow-hidden">
                        {/* Left Side: Process Fields */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar border-r border-slate-50">
                            {/* Template Selector */}
                            <div className="flex items-center gap-3">
                                <h3 className="text-[18px] font-bold text-blue-800">Mẫu công việc</h3>
                                <ChevronDown className="w-5 h-5 text-blue-600 cursor-pointer" />
                            </div>

                            {/* Detailed Info Group */}
                            <div className="bg-[#F8F9FA] rounded-2xl p-6 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[16px] font-bold text-slate-800">Nhập thông tin ticket</h4>
                                    <ChevronDown className="w-4 h-4 text-slate-400 rotate-180" />
                                </div>

                                <div className="grid grid-cols-[200px_1fr] gap-x-8 gap-y-5 text-[14px]">
                                    {/* Row: Customer */}
                                    <div className="space-y-1">
                                        <div className="text-slate-500 font-medium">Thông tin khách hàng :</div>
                                        <div className="text-[11px] text-slate-400 italic font-normal text-[12px]">Tên, số điện thoại khách hàng liên hệ</div>
                                    </div>
                                    <div className="font-bold text-slate-700 self-center">Mr. Thiện</div>

                                    {/* Row: Org */}
                                    <div className="text-slate-500 font-medium self-center">Tên đơn vị / tổ chức (*) :</div>
                                    <div className="font-bold text-slate-700 self-center">Tâm An Long An</div>

                                    {/* Row: Code */}
                                    <div className="text-slate-500 font-medium self-center">Mã đơn vị/tổ chức :</div>
                                    <div className="italic text-slate-400 font-medium self-center">Không có dữ liệu</div>

                                    {/* Row: Product */}
                                    <div className="text-slate-500 font-medium self-center">Loại sản phẩm :</div>
                                    <div className="font-bold text-slate-700 self-center">SaaS</div>

                                    {/* Row: Module */}
                                    <div className="text-slate-500 font-medium self-center">Module :</div>
                                    <div className="flex items-center gap-2 self-center">
                                        <Badge variant="secondary" className="bg-[#EBF5FF] text-[#0066FF] border-none px-4 py-1 font-medium text-[13px] rounded-full">
                                            fWorkflow
                                        </Badge>
                                        <Badge variant="secondary" className="bg-[#EBF5FF] text-[#0066FF] border-none px-4 py-1 font-medium text-[13px] rounded-full">
                                            fData
                                        </Badge>
                                    </div>

                                    {/* Row: Platform */}
                                    <div className="text-slate-500 font-medium self-center">Nền tảng :</div>
                                    <div className="font-bold text-slate-700 self-center">Web</div>

                                    {/* Row: Ticket Class */}
                                    <div className="text-slate-500 font-medium self-center">Loại ticket :</div>
                                    <div className="font-bold text-slate-700 self-center">Update</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Task Info & Comments */}
                        <div className="w-[450px] flex flex-col bg-white border-l border-slate-100">
                            {/* Task Info Section */}
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
                                    <h3 className="text-[18px] font-bold text-blue-900">Thông tin công việc</h3>

                                    {/* Sub navigation items */}
                                    <div className="flex items-center gap-3">
                                        <Badge variant="secondary" className="bg-[#E9EDF5] text-slate-600 px-4 py-1.5 font-bold text-[13px] rounded-lg border-none shadow-none">Công việc</Badge>
                                        <Badge className="bg-transparent text-slate-400 px-4 py-1.5 font-bold text-[13px] rounded-lg shadow-none border-none hover:bg-slate-50">Nhiệm vụ</Badge>
                                        <Badge className="bg-transparent text-slate-400 px-4 py-1.5 font-bold text-[13px] rounded-lg shadow-none border-none hover:bg-slate-50">Thông tin ghim (0)</Badge>
                                    </div>

                                    <div className="space-y-6 text-[14px]">
                                        <div className="space-y-3">
                                            <div className="text-slate-400 font-medium">Mô tả:</div>
                                            <div className="text-slate-600 leading-relaxed font-medium">
                                                Link file quản lý ticket update: <br />
                                                <a href="#" className="text-blue-600 hover:underline break-all">https://docs.google.com/spreadsheets/d/1VMIU3VEPs_Qj_j7TLmQzEGmLfptBsZWDoc3jrZvbnxY/edit?...</a>
                                                <div className="text-blue-600 font-bold mt-1 cursor-pointer">Xem thêm</div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-[140px_1fr] gap-y-6">
                                            <div className="text-slate-400 font-medium">File đính kèm:</div>
                                            <div className="italic text-slate-400 font-medium">Không có dữ liệu</div>

                                            <div className="text-slate-400 font-medium">Cách thức giao việc:</div>
                                            <div className="text-slate-700 font-bold tracking-tight">Cho phép thành viên nhận việc</div>
                                        </div>
                                    </div>

                                    {/* Comments Section */}
                                    <div className="space-y-6 pt-6 border-t border-slate-50">
                                        <h3 className="text-[18px] font-bold text-blue-900">Bình luận nhiệm vụ</h3>
                                        {/* Input Box for Comments */}
                                        <div className="bg-[#F8F9FA] rounded-xl p-3 border border-slate-100 shadow-inner flex items-center gap-3">
                                            <div className="bg-blue-600 p-1 rounded-md">
                                                <Plus className="w-4 h-4 text-white" />
                                            </div>
                                            <Input
                                                className="border-none bg-transparent shadow-none focus-visible:ring-0 text-[14px] px-0 h-8"
                                                placeholder="Nhập nội dung"
                                            />
                                            <Send className="w-4 h-4 text-blue-600 cursor-pointer" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer for Right Side / Global Footer Placeholder */}
                            <div className="p-4 border-t flex items-center justify-end gap-3 bg-white shrink-0">
                                <Button variant="ghost" className="text-slate-500 font-bold text-[14px] px-6 h-10 hover:bg-slate-50" onClick={() => onOpenChange(false)}>
                                    <X className="w-4 h-4 mr-2" />
                                    Huỷ
                                </Button>
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[14px] px-8 h-10 rounded-lg shadow-lg shadow-blue-100 flex items-center gap-2">
                                    <Check className="w-4 h-4 border-2 border-white rounded-sm p-0.5" />
                                    Nhận việc
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
