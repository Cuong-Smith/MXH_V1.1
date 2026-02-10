"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Search, MessageCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NotificationDropdown } from "@/components/notification-dropdown"
import { cn } from "@/lib/utils"

const pageTitles: Record<string, string> = {
  "/": "Newsfeed",
  "/groups": "Nhom",
  "/events": "Su kien",
}

export function MobileHeader() {
  const pathname = usePathname()
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const getPageTitle = () => {
    if (pathname.startsWith("/profile")) return "Trang ca nhan"
    return pageTitles[pathname] || "Newsfeed"
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        {showSearch ? (
          <>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                autoFocus
                placeholder="Tim kiem..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-muted border-0 pl-9 pr-10"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-2 flex-shrink-0"
              onClick={() => {
                setShowSearch(false)
                setSearchQuery("")
              }}
            >
              <X className="h-5 w-5" />
            </Button>
          </>
        ) : (
          <>
            {/* Logo & Title */}
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <span className="text-base font-bold text-primary-foreground">N</span>
              </div>
              <span className="text-lg font-bold text-foreground">{getPageTitle()}</span>
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setShowSearch(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 relative">
                <MessageCircle className="h-5 w-5" />
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                  3
                </span>
              </Button>
              <NotificationDropdown />
            </div>
          </>
        )}
      </div>
    </header>
  )
}
