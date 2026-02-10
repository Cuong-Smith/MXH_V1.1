"use client"

import React, { useState } from "react"
import { Search, X, Check, ArrowLeft, CheckCircle2 } from "lucide-react"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface User {
    id: string
    name: string
    avatar: string
}

const MOCK_USERS: User[] = [
    { id: "1", name: "Lê Hữu Phương Đông", avatar: "/placeholder.svg" },
    { id: "2", name: "Thái Doãn Kiên", avatar: "/placeholder.svg" },
    { id: "3", name: "Nguyễn Thị Ngân Hà", avatar: "/placeholder.svg" },
    { id: "4", name: "Bùi Thanh Hiền", avatar: "/placeholder.svg" },
    { id: "5", name: "Nguyễn Thu Hiền", avatar: "/placeholder.svg" },
    { id: "6", name: "Dương Thị Dung", avatar: "/placeholder.svg" },
    { id: "7", name: "Nguyễn Trung Hiếu", avatar: "/placeholder.svg" },
    { id: "8", name: "Trần Quốc Hiệu", avatar: "/placeholder.svg" },
    { id: "9", name: "Võ Ngọc Kim Nhi", avatar: "/placeholder.svg" },
    { id: "10", name: "Phạm Trần Minh Trí", avatar: "/placeholder.svg" },
    { id: "11", name: "Trương Công Hiếu", avatar: "/placeholder.svg" },
]

interface AddMemberDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function AddMemberDialog({ open, onOpenChange }: AddMemberDialogProps) {
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])
    const [searchQuery, setSearchQuery] = useState("")

    const toggleUser = (userId: string) => {
        setSelectedUsers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        )
    }

    const filteredUsers = MOCK_USERS.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] p-0 gap-0 overflow-hidden flex flex-col h-[80vh]">
                <DialogHeader className="p-4 border-b flex-row items-center gap-4 space-y-0">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600"
                        onClick={() => onOpenChange(false)}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <DialogTitle className="text-base font-medium text-muted-foreground flex-1 text-center pr-8">
                        Thêm thành viên
                    </DialogTitle>
                </DialogHeader>

                <div className="p-4 space-y-4 flex-1 overflow-hidden flex flex-col">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-foreground">
                            Tìm kiếm thành viên
                        </p>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm..."
                                className="pl-9 bg-muted/30 border-none h-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <Tabs defaultValue="all" className="w-full flex-1 flex flex-col overflow-hidden">
                        <TabsList className="bg-transparent h-auto p-0 border-b w-full justify-start rounded-none">
                            <TabsTrigger
                                value="all"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 bg-transparent px-4 pb-2"
                            >
                                Tất cả
                            </TabsTrigger>
                            <TabsTrigger
                                value="selected"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 bg-transparent px-4 pb-2"
                            >
                                Đã chọn
                            </TabsTrigger>
                        </TabsList>

                        <div className="flex-1 overflow-y-auto mt-2">
                            <div className="space-y-1">
                                {filteredUsers.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-md cursor-pointer transition-colors"
                                        onClick={() => toggleUser(user.id)}
                                    >
                                        <Checkbox
                                            checked={selectedUsers.includes(user.id)}
                                            onCheckedChange={() => toggleUser(user.id)}
                                            className="h-5 w-5 border-muted-foreground data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                        />
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user.avatar} />
                                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm font-medium">{user.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Tabs>
                </div>

                <DialogFooter className="p-4 border-t flex-row items-center justify-end gap-2 sm:justify-end">
                    <Button
                        variant="ghost"
                        className="gap-2 h-10 px-4 text-foreground font-medium"
                        onClick={() => onOpenChange(false)}
                    >
                        <X className="h-4 w-4" />
                        Hủy
                    </Button>
                    <Button
                        className="gap-2 h-10 px-6 bg-blue-600 hover:bg-blue-700 font-medium"
                        onClick={() => onOpenChange(false)}
                    >
                        <Check className="h-4 w-4" />
                        Xác nhận
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
