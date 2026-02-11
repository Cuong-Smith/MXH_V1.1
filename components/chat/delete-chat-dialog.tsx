"use client"

import React from "react"
import { AlertTriangle, Trash2, X } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DeleteChatDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    chatName?: string
}

export function DeleteChatDialog({ open, onOpenChange, chatName }: DeleteChatDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
                <div className="p-6 flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-2">
                        <AlertTriangle className="h-8 w-8 text-red-600" />
                    </div>

                    <DialogHeader className="space-y-2">
                        <DialogTitle className="text-xl font-bold text-slate-800">
                            Xác nhận xoá cuộc trò chuyện
                        </DialogTitle>
                        <DialogDescription className="text-sm text-slate-500 px-2 leading-relaxed">
                            Bạn có chắc chắn muốn xoá toàn bộ cuộc trò chuyện với <span className="font-semibold text-slate-700">"{chatName}"</span>?
                            Hành động này sẽ xoá tất cả tin nhắn và không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <DialogFooter className="p-4 bg-slate-50 flex-row gap-3 sm:justify-center px-6 pb-6">
                    <Button
                        variant="ghost"
                        className="flex-1 h-11 rounded-xl text-slate-600 font-semibold hover:bg-slate-200"
                        onClick={() => onOpenChange(false)}
                    >
                        Hủy
                    </Button>
                    <Button
                        className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-700 font-bold text-white shadow-lg shadow-red-500/20 gap-2"
                        onClick={() => onOpenChange(false)}
                    >
                        <Trash2 className="h-4 w-4" />
                        Xoá ngay
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
