"use client"

import React from "react"
import { ChevronLeft, X } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface MuteChatDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const MUTE_OPTIONS = [
    { id: "15min", label: "Trong 15 phút" },
    { id: "1hour", label: "Trong 1 giờ" },
    { id: "8hours", label: "Trong 8 giờ" },
    { id: "24hours", label: "Trong 24 giờ" },
    { id: "until-change", label: "Đến khi tôi thay đổi" },
]

export function MuteChatDialog({ open, onOpenChange }: MuteChatDialogProps) {
    const [selectedValue, setSelectedValue] = React.useState("")

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-[20px]"
                showCloseButton={false}
            >
                <DialogHeader className="p-4 flex flex-row items-center justify-between">
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-[#F0F2F5] hover:bg-[#E4E6EB]">
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <DialogTitle className="text-[20px] font-bold text-center flex-1">
                        Tắt thông báo về đoạn chat này?
                    </DialogTitle>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full bg-[#F0F2F5] hover:bg-[#E4E6EB]"
                        onClick={() => onOpenChange(false)}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </DialogHeader>

                <div className="px-6 py-2 space-y-4">
                    <RadioGroup
                        value={selectedValue}
                        onValueChange={setSelectedValue}
                        className="space-y-1"
                    >
                        {MUTE_OPTIONS.map((option) => (
                            <div
                                key={option.id}
                                className="flex items-center justify-between py-3 cursor-pointer group"
                                onClick={() => setSelectedValue(option.id)}
                            >
                                <Label
                                    htmlFor={option.id}
                                    className="text-[16px] font-semibold cursor-pointer flex-1"
                                >
                                    {option.label}
                                </Label>
                                <RadioGroupItem
                                    value={option.id}
                                    id={option.id}
                                    className="h-6 w-6 border-2 border-[#8E8E8E] data-[state=checked]:border-blue-600 data-[state=checked]:text-blue-600"
                                />
                            </div>
                        ))}
                    </RadioGroup>

                    <p className="text-[13px] text-muted-foreground leading-relaxed">
                        Cửa sổ chat vẫn đóng và bạn sẽ không nhận được thông báo đẩy trên thiết bị.
                    </p>
                </div>

                <DialogFooter className="p-6 flex flex-row gap-3 sm:justify-center">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="flex-1 bg-[#E4E6EB] hover:bg-[#D8DADF] text-black font-bold h-12 rounded-[12px] border-none shadow-none text-base"
                    >
                        Hủy
                    </Button>
                    <Button
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-[12px] disabled:bg-[#E4E6EB] disabled:text-[#BCC0C4] border-none shadow-none text-base"
                        disabled={!selectedValue}
                        onClick={() => onOpenChange(false)}
                    >
                        Xác nhận
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
