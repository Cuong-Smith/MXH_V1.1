"use client"

import React, { useState } from "react"
import { Layers } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CreateThreadDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onCreate: (threadName: string) => void
}

export function CreateThreadDialog({ open, onOpenChange, onCreate }: CreateThreadDialogProps) {
    const [threadName, setThreadName] = useState("")

    const handleCreate = () => {
        if (threadName.trim()) {
            onCreate(threadName)
            onOpenChange(false)
            setThreadName("")
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-white border-none rounded-[24px] shadow-xl">
                <DialogHeader className="flex flex-col items-center gap-4 py-4">
                    <div className="h-16 w-16 bg-[#F0F2F5] rounded-full flex items-center justify-center">
                        <Layers className="h-8 w-8 text-blue-500 rotate-12" />
                    </div>
                    <div className="space-y-1 text-center font-bold">
                        <DialogTitle className="text-xl">Tên Chủ Đề</DialogTitle>
                    </div>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    <div className="space-y-2">
                        <Input
                            placeholder="Chủ Đề Mới"
                            value={threadName}
                            onChange={(e) => setThreadName(e.target.value)}
                            className="bg-[#F0F2F5] border-none text-foreground placeholder:text-muted-foreground h-12 rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500"
                        />
                    </div>
                </div>

                <DialogFooter className="sm:justify-center">
                    <Button
                        onClick={handleCreate}
                        disabled={!threadName.trim()}
                        className="w-full bg-[#00A3FF] hover:bg-[#0088D6] text-white font-bold h-12 rounded-xl transition-all shadow-md active:scale-95"
                    >
                        Tạo Chủ Đề
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
