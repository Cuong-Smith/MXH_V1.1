"use client"

import React from "react"
import {
    X, Search, FileText, CheckCircle2, ChevronRight,
    LayoutList, Plus
} from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface SelectProcessDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSelect: (processId: string | null) => void
}

export function SelectProcessDialog({ open, onOpenChange, onSelect }: SelectProcessDialogProps) {
    const [search, setSearch] = React.useState("")
    const [selectedId, setSelectedId] = React.useState<string | null>(null)

    // Mock processes data
    const processes = [
        { id: "1", name: "Quy trình phê duyệt hợp đồng", steps: 5 },
        { id: "2", name: "Quy trình tuyển dụng nhân sự", steps: 8 },
        { id: "3", name: "Quy trình mua sắm tài sản", steps: 4 },
        { id: "4", name: "Quy trình thanh toán công tác phí", steps: 3 },
        { id: "5", name: "Quy trình tiếp nhận nhân viên mới", steps: 6 },
    ]

    const filteredProcesses = processes.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    )

    const handleContinue = () => {
        onSelect(selectedId)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-[500px] w-[500px] p-0 overflow-hidden gap-0" showCloseButton={false}>
                <VisuallyHidden>
                    <DialogTitle>Chọn quy trình</DialogTitle>
                </VisuallyHidden>

                <div className="flex flex-col h-[500px]">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b bg-white shrink-0">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <LayoutList className="h-5 w-5 text-blue-500" />
                            Chọn quy trình
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

                    {/* Search & Content */}
                    <div className="flex-1 overflow-hidden flex flex-col bg-white">
                        <div className="px-6 py-4 shrink-0">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Tìm kiếm quy trình..."
                                    className="pl-9 bg-gray-50"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto px-2">
                            <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Danh sách quy trình
                            </div>

                            {filteredProcesses.map((process) => (
                                <div
                                    key={process.id}
                                    className={cn(
                                        "px-4 py-3 mx-2 mb-2 rounded-lg cursor-pointer border hover:bg-gray-50 transition-colors flex items-center gap-3",
                                        selectedId === process.id ? "border-blue-500 bg-blue-50/50" : "border-transparent"
                                    )}
                                    onClick={() => setSelectedId(process.id)}
                                >
                                    <div className={cn(
                                        "flex items-center justify-center w-10 h-10 rounded-full",
                                        selectedId === process.id ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"
                                    )}>
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={cn("font-medium", selectedId === process.id && "text-blue-700")}>
                                            {process.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">{process.steps} bước</p>
                                    </div>
                                    {selectedId === process.id && <CheckCircle2 className="h-5 w-5 text-blue-600" />}
                                </div>
                            ))}
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
                            onClick={handleContinue}
                            disabled={!selectedId}
                        >
                            Tiếp tục <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
