"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, Calendar, User, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { AppMenu } from "@/components/app-menu"

const tabs = [
  { href: "/", icon: Home, label: "Trang chu" },
  { href: "/groups", icon: Users, label: "Nhom" },
  { href: "/events", icon: Calendar, label: "Su kien" },
  { href: "/profile/user-1", icon: User, label: "Ca nhan" },
]

export function MobileTabBar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 safe-area-bottom">
      <div className="flex h-16 items-center justify-around px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const active = isActive(tab.href)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className={cn("h-6 w-6", active && "stroke-[2.5px]")} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          )
        })}

        {/* Menu Button */}
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-muted-foreground transition-colors"
            >
              <Menu className="h-6 w-6" />
              <span className="text-[10px] font-medium">Menu</span>
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full p-0 sm:w-[400px]">
            <SheetHeader className="sr-only">
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <AppMenu isMobileSheet onClose={() => setMenuOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
