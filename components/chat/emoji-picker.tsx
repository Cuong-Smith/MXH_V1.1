"use client"

import React from "react"
import { Search, Smile, Cat, UtensilsCrossed, Trophy, Car, Lightbulb, Component, Flag } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

const EMOJI_GROUPS = [
    {
        title: "Mặt cười và hình người",
        emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "☺", "😚", "😙", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔", "🤐", "🤨", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "🤥", "😌", "😔", "😪", "🤤", "😴", "😷", "🤒"]
    }
]

const CATEGORIES = [
    { icon: Smile, id: "smile" },
    { icon: Cat, id: "animal" },
    { icon: UtensilsCrossed, id: "food" },
    { icon: Trophy, id: "sport" },
    { icon: Car, id: "travel" },
    { icon: Lightbulb, id: "objects" },
    { icon: Component, id: "symbols" },
    { icon: Flag, id: "flags" },
]

interface EmojiPickerProps {
    onSelect: (emoji: string) => void
    children: React.ReactNode
}

export function EmojiPicker({ onSelect, children }: EmojiPickerProps) {
    const [search, setSearch] = React.useState("")
    const [activeCategory, setActiveCategory] = React.useState("smile")

    return (
        <Popover>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent
                className="w-[350px] p-0 border-none shadow-2xl rounded-[20px] overflow-hidden bg-white"
                side="top"
                align="end"
                sideOffset={10}
            >
                {/* Search Bar */}
                <div className="p-4 bg-white">
                    <div className="relative flex items-center bg-[#F0F2F5] rounded-full px-3 h-10">
                        <Search className="h-5 w-5 text-muted-foreground mr-2" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Tìm kiếm biểu tượng cảm xúc"
                            className="bg-transparent border-none shadow-none focus-visible:ring-0 text-[15px] p-0 h-full"
                        />
                    </div>
                </div>

                {/* Emoji Content */}
                <div className="h-[280px] overflow-y-auto px-4 pb-4">
                    {EMOJI_GROUPS.map((group) => (
                        <div key={group.title} className="space-y-3">
                            <h4 className="text-[13px] text-muted-foreground font-medium">
                                {group.title}
                            </h4>
                            <div className="grid grid-cols-8 gap-2">
                                {group.emojis.map((emoji, i) => (
                                    <button
                                        key={i}
                                        onClick={() => onSelect(emoji)}
                                        className="text-2xl hover:bg-muted rounded-lg p-1 transition-colors flex items-center justify-center h-10 w-10"
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Navigation */}
                <div className="border-t flex items-center justify-between px-4 h-12 bg-white">
                    {CATEGORIES.map((cat) => (
                        <Button
                            key={cat.id}
                            variant="ghost"
                            size="icon"
                            className={`h-9 w-9 rounded-full ${activeCategory === cat.id ? "text-blue-600 bg-blue-50" : "text-muted-foreground"}`}
                            onClick={() => setActiveCategory(cat.id)}
                        >
                            <cat.icon className="h-5 w-5" />
                        </Button>
                    ))}
                </div>

                {/* Decoration Arrow */}
                <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white rotate-45 border-r border-b border-transparent shadow-[4px_4px_4px_-1px_rgba(0,0,0,0.05)]" />
            </PopoverContent>
        </Popover>
    )
}
