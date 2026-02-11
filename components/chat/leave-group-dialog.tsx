"use client"

import React, { useState } from "react"
import { Search, X, Check, ArrowLeft, LogOut } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface Member {
    id: string
    name: string
    avatar: string
    role: string
}

const MOCK_MEMBERS: Member[] = [
    { id: "1", name: "Nguyễn Thị Hồng Hạnh", role: "Admin", avatar: "https://i.pravatar.cc/150?u=hanh" },
    { id: "2", name: "Phạm Thị Quỳnh Như", role: "Thành viên", avatar: "https://i.pravatar.cc/150?u=nhu" },
    { id: "3", name: "Bùi Anh Tuấn", role: "Thành viên", avatar: "https://i.pravatar.cc/150?u=tuan" },
]

interface LeaveGroupDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function LeaveGroupDialog({ open, onOpenChange }: LeaveGroupDialogProps) {
    const [selectedAdminId, setSelectedAdminId] = useState<string>("")
    const [searchQuery, setSearchQuery] = useState("")

    const filteredMembers = MOCK_MEMBERS.filter(m => m.role !== "Admin" && m.name.toLowerCase().includes(searchQuery.toLowerCase()))

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] p-0 gap-0 overflow-hidden flex flex-col h-[70vh]">
                <DialogHeader className="p-4 border-b flex-row items-center gap-4 space-y-0">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onOpenChange(false)}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <DialogTitle className="text-base font-bold flex-1 text-center pr-8 uppercase tracking-wide">
                        Rời khỏi cuộc trò chuyện
                    </DialogTitle>
                </DialogHeader>

                <div className="p-4 space-y-4 flex-1 overflow-hidden flex flex-col">
                    <div className="space-y-1">
                        <p className="text-sm font-semibold text-foreground">
                            Chuyển quyền quản trị viên
                        </p>
                        <p className="text-[13px] text-muted-foreground leading-snug">
                            Bạn là quản trị viên. Hãy chọn một thành viên khác để thay thế bạn quản lý nhóm trước khi rời đi.
                        </p>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Tìm danh sách thành viên..."
                            className="pl-9 bg-muted/40 border-none h-10 rounded-lg text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto mt-2">
                        <RadioGroup value={selectedAdminId} onValueChange={setSelectedAdminId} className="gap-0">
                            {filteredMembers.map((member) => (
                                <Label
                                    key={member.id}
                                    className="flex items-center gap-3 p-2.5 hover:bg-muted/50 rounded-xl cursor-pointer transition-colors"
                                >
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={member.avatar} />
                                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{member.name}</p>
                                    </div>
                                    <RadioGroupItem
                                        value={member.id}
                                        className="h-5 w-5 border-muted-foreground data-[state=checked]:border-blue-600 data-[state=checked]:text-blue-600"
                                    />
                                </Label>
                            ))}
                            {filteredMembers.length === 0 && (
                                <div className="text-center py-10 text-muted-foreground text-sm">
                                    Không tìm thấy thành viên phù hợp
                                </div>
                            )}
                        </RadioGroup>
                    </div>
                </div>

                <DialogFooter className="p-4 border-t flex-row items-center justify-end gap-2 px-6">
                    <Button
                        variant="ghost"
                        className="h-10 px-6 text-foreground font-semibold hover:bg-muted"
                        onClick={() => onOpenChange(false)}
                    >
                        Hủy
                    </Button>
                    <Button
                        disabled={!selectedAdminId}
                        className="gap-2 h-10 px-8 bg-blue-600 hover:bg-blue-700 font-bold text-white shadow-lg shadow-blue-500/20"
                        onClick={() => onOpenChange(false)}
                    >
                        <LogOut className="h-4 w-4" />
                        Rời nhóm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
