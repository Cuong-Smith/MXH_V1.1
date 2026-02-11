"use client"

import React, { useState } from "react"
import { X, Plus, Trash2, LayoutList, Clock } from "lucide-react"
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
import { Switch } from "@/components/ui/switch"

interface CreatePollDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onCreate: (poll: { question: string; options: string[]; endTime?: string }) => void
}

export function CreatePollDialog({ open, onOpenChange, onCreate }: CreatePollDialogProps) {
    const [question, setQuestion] = useState("")
    const [options, setOptions] = useState(["", ""])
    const [endTime, setEndTime] = useState("")

    const addOption = () => {
        setOptions([...options, ""])
    }

    const removeOption = (index: number) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index))
        }
    }

    const updateOption = (index: number, value: string) => {
        const newOptions = [...options]
        newOptions[index] = value
        setOptions(newOptions)
    }

    const handleCreate = () => {
        onCreate({
            question,
            options: options.filter(opt => opt.trim() !== ""),
            endTime: endTime || undefined
        })
        onOpenChange(false)
        setQuestion("")
        setOptions(["", ""])
        setEndTime("")
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-2 text-primary font-semibold">
                        <LayoutList className="h-5 w-5" />
                        <DialogTitle className="text-xl">Tạo thăm dò</DialogTitle>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Tạo một cuộc khảo sát ý kiến trong nhóm của bạn.
                    </p>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="question" className="text-base font-semibold">
                            Câu hỏi <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="question"
                            placeholder="Nhập câu hỏi thăm dò..."
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            className="h-11"
                        />
                    </div>

                    <div className="space-y-3">
                        <Label className="text-base font-semibold">
                            Các lựa chọn <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 scrollbar-thin">
                            {options.map((option, index) => (
                                <div key={index} className="flex gap-2 group">
                                    <div className="relative flex-1">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground bg-muted w-5 h-5 rounded-full flex items-center justify-center">
                                            {index + 1}
                                        </span>
                                        <Input
                                            placeholder={`Lựa chọn ${index + 1}...`}
                                            value={option}
                                            onChange={(e) => updateOption(index, e.target.value)}
                                            className="pl-10 h-10 border-muted group-hover:border-primary transition-colors"
                                        />
                                    </div>
                                    {options.length > 2 && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-10 w-10 text-muted-foreground hover:text-red-500"
                                            onClick={() => removeOption(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full gap-2 border-dashed h-10 border-primary text-primary hover:bg-primary/5"
                            onClick={addOption}
                        >
                            <Plus className="h-4 w-4" />
                            Thêm lựa chọn
                        </Button>
                    </div>

                    <div className="pt-4 border-t space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-sm font-medium">Bình chọn ẩn danh</Label>
                                <p className="text-xs text-muted-foreground">Tên người bình chọn sẽ không được hiển thị</p>
                            </div>
                            <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-sm font-medium">Chọn nhiều lựa chọn</Label>
                                <p className="text-xs text-muted-foreground">Người tham gia có thể chọn nhiều câu trả lời</p>
                            </div>
                            <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5 flex-1">
                                <Label htmlFor="endTime" className="text-sm font-medium flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    Thời gian kết thúc
                                </Label>
                                <p className="text-xs text-muted-foreground">Thăm dò sẽ tự động đóng vào thời điểm này</p>
                            </div>
                            <Input
                                id="endTime"
                                type="datetime-local"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="w-[200px] h-9 text-sm"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>
                        Hủy
                    </Button>
                    <Button
                        className="bg-blue-600 hover:bg-blue-700 font-semibold px-8"
                        onClick={handleCreate}
                        disabled={!question || options.some(opt => !opt)}
                    >
                        Tạo bình chọn
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
