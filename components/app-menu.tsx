"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useNewsfeed } from '@/lib/newsfeed-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  LayoutGrid,
  Search,
  User,
  Calendar,
  Users,
  Newspaper,
  MessageCircle,
  Bell,
  Settings,
  PenSquare,
  Film,
  ImagePlus,
  UserPlus,
  CalendarPlus,
  UsersRound,
  BookmarkIcon,
  Clock,
  HelpCircle,
  LogOut,
  Moon,
  Sun,
  ChevronRight,
} from 'lucide-react'

const socialMenuItems = [
  {
    icon: User,
    label: 'Trang ca nhan',
    description: 'Xem va chinh sua thong tin ca nhan cua ban',
    href: '/profile/user-1',
    color: 'bg-blue-500',
    isDynamic: true,
  },
  {
    icon: Calendar,
    label: 'Su kien',
    description: 'To chuc hoac tim su kien cung cac hoat dong khac',
    href: '/events',
    color: 'bg-red-500',
  },
  {
    icon: Users,
    label: 'Nhom',
    description: 'Ket noi voi nhung nguoi cung so thich',
    href: '/groups',
    color: 'bg-cyan-500',
  },
  {
    icon: Newspaper,
    label: 'Bang tin',
    description: 'Xem bai viet moi nhat tu dong nghiep',
    href: '/',
    color: 'bg-green-500',
  },
  {
    icon: MessageCircle,
    label: 'Tin nhan',
    description: 'Nhan tin voi dong nghiep',
    href: '/messages',
    color: 'bg-purple-500',
  },
  {
    icon: BookmarkIcon,
    label: 'Da luu',
    description: 'Xem lai cac bai viet da luu',
    href: '/saved',
    color: 'bg-amber-500',
  },
]

const createMenuItems = [
  {
    icon: PenSquare,
    label: 'Dang bai',
    description: 'Tao bai viet moi',
    action: 'create-post',
    color: 'bg-blue-500',
  },
  {
    icon: Film,
    label: 'Story',
    description: 'Chia se khoang khac trong 24h',
    action: 'create-story',
    color: 'bg-gradient-to-r from-pink-500 to-orange-500',
  },
  {
    icon: CalendarPlus,
    label: 'Su kien',
    description: 'Tao su kien moi',
    href: '/events?create=true',
    color: 'bg-red-500',
  },
  {
    icon: UsersRound,
    label: 'Nhom',
    description: 'Tao nhom moi',
    href: '/groups?create=true',
    color: 'bg-cyan-500',
  },
  {
    icon: ImagePlus,
    label: 'Khao sat',
    description: 'Tao khao sat lay y kien',
    action: 'create-poll',
    color: 'bg-emerald-500',
  },
]

const settingsMenuItems = [
  {
    icon: Settings,
    label: 'Cai dat',
    href: '/settings',
  },
  {
    icon: HelpCircle,
    label: 'Tro giup & Ho tro',
    href: '/help',
  },
]

interface AppMenuProps {
  isMobileSheet?: boolean
  onClose?: () => void
}

export function AppMenu({ isMobileSheet = false, onClose }: AppMenuProps) {
  const { currentUser } = useNewsfeed()
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleClose = () => {
    if (isMobileSheet && onClose) {
      onClose()
    } else {
      setOpen(false)
    }
  }

  const getSocialItemsWithDynamicHref = () => {
    return socialMenuItems.map(item => {
      if (item.isDynamic) {
        return { ...item, href: `/profile/${currentUser.id}` }
      }
      return item
    })
  }

  const filteredSocialItems = getSocialItemsWithDynamicHref().filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredCreateItems = createMenuItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const menuContent = (
    <ScrollArea className={isMobileSheet ? "h-[calc(100vh-60px)]" : "h-[calc(100vh-80px)]"}>
      <div className="p-4">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tim kiem trong menu"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-muted border-0"
          />
        </div>

        <div className={`grid gap-6 ${isMobileSheet ? "grid-cols-1" : "md:grid-cols-2"}`}>
          {/* Social Section */}
          <div className="rounded-xl bg-card p-4 shadow-sm border border-border">
            <h3 className="mb-4 font-semibold text-foreground">Xa hoi</h3>
            <div className="space-y-1">
              {filteredSocialItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={handleClose}
                  className="group flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted"
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${item.color}`}>
                    <item.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground group-hover:text-primary">
                      {item.label}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Create Section */}
          <div className="rounded-xl bg-card p-4 shadow-sm border border-border">
            <h3 className="mb-4 font-semibold text-foreground">Tao</h3>
            <div className="space-y-1">
              {filteredCreateItems.map((item) => (
                item.href ? (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={handleClose}
                    className="group flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted"
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${item.color}`}>
                      <item.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground group-hover:text-primary">
                        {item.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                ) : (
                  <button
                    key={item.label}
                    onClick={() => {
                      handleClose()
                      if (item.action === 'create-post') {
                        document.querySelector<HTMLTextAreaElement>('[data-post-composer]')?.focus()
                      }
                    }}
                    className="group flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted"
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${item.color}`}>
                      <item.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground group-hover:text-primary">
                        {item.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </button>
                )
              ))}
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* User Profile Quick Access */}
        <div className="rounded-xl bg-card p-4 shadow-sm border border-border">
          <Link
            href={`/profile/${currentUser.id}`}
            onClick={handleClose}
            className="group flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-muted"
          >
            <Avatar className="h-12 w-12 ring-2 ring-primary/20">
              <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
              <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold text-foreground">{currentUser.name}</p>
              <p className="text-sm text-muted-foreground">{currentUser.position}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
          </Link>
        </div>

        <Separator className="my-6" />

        {/* Settings */}
        <div className="space-y-1">
          {settingsMenuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={handleClose}
              className="group flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted group-hover:bg-muted-foreground/10">
                <item.icon className="h-5 w-5 text-foreground" />
              </div>
              <span className="font-medium text-foreground">{item.label}</span>
            </Link>
          ))}

          <button
            className="group flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-destructive/10"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted group-hover:bg-destructive/20">
              <LogOut className="h-5 w-5 text-foreground group-hover:text-destructive" />
            </div>
            <span className="font-medium text-foreground group-hover:text-destructive">Dang xuat</span>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>Newsfeed - Mang xa hoi noi bo</p>
          <p className="mt-1">Version 1.0.0</p>
        </div>
      </div>
    </ScrollArea>
  )

  // If used in mobile sheet, just return the content
  if (isMobileSheet) {
    return (
      <div className="h-full">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-2xl font-bold">Menu</h2>
        </div>
        {menuContent}
      </div>
    )
  }

  // Desktop: wrap in Sheet
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative h-10 w-10 rounded-full bg-muted hover:bg-muted/80"
        >
          <LayoutGrid className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[400px] p-0 sm:w-[540px]">
        <SheetHeader className="border-b border-border px-6 py-4">
          <SheetTitle className="text-2xl font-bold">Menu</SheetTitle>
        </SheetHeader>
        {menuContent}
      </SheetContent>
    </Sheet>
  )
}
