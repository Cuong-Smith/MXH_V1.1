"use client"

import React, { useState } from "react"
import { Search, X, Check, ArrowLeft, ShieldAlert } from "lucide-react"
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
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface User {
    id: string
    name: string
    avatar: string
}

const MOCK_USERS: User[] = [
    { id: "1", name: "Lê Hữu Phương Đông", avatar: "https://i.pravatar.cc/150?u=1" },
    { id: "2", name: "Thái Doãn Kiên", avatar: "https://i.pravatar.cc/150?u=2" },
    { id: "3", name: "Nguyễn Thị Ngân Hà", avatar: "https://i.pravatar.cc/150?u=3" },
    { id: "4", name: "Bùi Thanh Hiền", avatar: "https://i.pravatar.cc/150?u=4" },
    { id: "5", name: "Nguyễn Thu Hiền", avatar: "https://i.pravatar.cc/150?u=5" },
    { id: "6", name: "Dương Thị Dung", avatar: "https://i.pravatar.cc/150?u=6" },
    { id: "7", name: "Nguyễn Trung Hiếu", avatar: "https://i.pravatar.cc/150?u=7" },
    { id: "8", name: "Trần Quốc Hiệu", avatar: "https://i.pravatar.cc/150?u=8" },
    { id: "9", name: "Võ Ngọc Kim Nhi", avatar: "https://i.pravatar.cc/150?u=9" },
    { id: "10", name: "Phạm Trần Minh Trí", avatar: "https://i.pravatar.cc/150?u=10" },
    { id: "11", name: "Trương Công Hiếu", avatar: "https://i.pravatar.cc/150?u=11" },
]

interface CreateGroupDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void

    onCreate?: (groupName: string, memberIds: string[], onlyAdminsPost: boolean) => void
}

export function CreateGroupDialog({ open, onOpenChange, onCreate }: CreateGroupDialogProps) {
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [groupName, setGroupName] = useState("")
    const [onlyAdminsPost, setOnlyAdminsPost] = useState(false)

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

    const handleCreate = () => {
        if (groupName.trim()) {
            onCreate?.(groupName, selectedUsers, onlyAdminsPost)
            onOpenChange(false)
            // Reset form
            setGroupName("")
            setSelectedUsers([])
            setSearchQuery("")
            setOnlyAdminsPost(false)
        }
    }

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
                        Tạo nhóm
                    </DialogTitle>
                    <div className="w-8" />
                </DialogHeader>

                <div className="p-4 space-y-4 flex-1 overflow-hidden flex flex-col">
                    <div className="space-y-2">
                        <Label>Tên nhóm</Label>
                        <Input
                            placeholder="Nhập tên nhóm"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                        />
                    </div>

                    <div className="flex items-start space-x-3 bg-muted/40 p-3 rounded-lg border">
                        <ShieldAlert className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div className="flex-1 space-y-1">
                            <Label htmlFor="only-admins" className="text-sm font-medium leading-none">
                                Chỉ trưởng nhóm gửi tin nhắn
                            </Label>
                            <p className="text-[13px] text-muted-foreground">
                                Thành viên chỉ được phép xem và thả cảm xúc
                            </p>
                        </div>
                        <Switch
                            id="only-admins"
                            checked={onlyAdminsPost}
                            onCheckedChange={setOnlyAdminsPost}
                        />
                    </div>

                    <div className="space-y-2 flex-col flex flex-1 overflow-hidden">
                        <Label>Tìm kiếm thành viên</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm..."
                                className="pl-9 bg-muted/30 border-none h-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <Tabs defaultValue="all" className="w-full flex-1 flex flex-col overflow-hidden mt-2">
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
                        onClick={handleCreate}
                        disabled={!groupName.trim()}
                    >
                        <Check className="h-4 w-4" />
                        Xác nhận
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
