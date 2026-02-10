"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AppMenu } from './app-menu'
import {
  Home,
  Users,
  Calendar,
  Search,
  Filter
} from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type FilterConfig = {
  placeholder: string
  options: { value: string; label: string }[]
}

const filterConfigs: Record<string, FilterConfig> = {
  '/': {
    placeholder: 'Tat ca',
    options: [
      { value: 'all', label: 'Tat ca' },
      { value: 'friends', label: 'Ban be' },
      { value: 'following', label: 'Dang theo doi' },
      { value: 'recent', label: 'Gan day' },
    ],
  },
  '/groups': {
    placeholder: 'Che do',
    options: [
      { value: 'all', label: 'Tat ca' },
      { value: 'public', label: 'Cong khai' },
      { value: 'private', label: 'Rieng tu' },
    ],
  },
  '/events': {
    placeholder: 'Loai su kien',
    options: [
      { value: 'all', label: 'Tat ca' },
      { value: 'party', label: 'Tiec / Su kien' },
      { value: 'workshop', label: 'Workshop' },
      { value: 'meeting', label: 'Hop' },
      { value: 'training', label: 'Dao tao' },
    ],
  },
}

const searchPlaceholders: Record<string, string> = {
  '/': 'Tim kiem bai dang...',
  '/groups': 'Tim kiem nhom...',
  '/events': 'Tim kiem su kien...',
}

export function AppHeader() {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterValue, setFilterValue] = useState('all')

  const currentConfig = filterConfigs[pathname] || filterConfigs['/']
  const searchPlaceholder = searchPlaceholders[pathname] || 'Tim kiem...'

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        {/* Left: Menu & Logo */}
        <div className="flex items-center gap-3">
          <AppMenu />
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <span className="text-lg font-bold text-primary-foreground">N</span>
            </div>
            <span className="hidden text-xl font-bold text-foreground md:inline">
              {pathname === '/events' ? 'Su kien' : pathname === '/groups' ? 'Nhom' : pathname.startsWith('/profile') ? 'Trang ca nhan' : 'Newsfeed'}
            </span>
          </Link>
        </div>

        {/* Center: Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link href="/">
            <Button variant="ghost" size="lg" className="h-12 w-24 rounded-lg">
              <Home className="h-6 w-6" />
            </Button>
          </Link>
          <Link href="/groups">
            <Button variant="ghost" size="lg" className="h-12 w-24 rounded-lg">
              <Users className="h-6 w-6" />
            </Button>
          </Link>
          <Link href="/events">
            <Button variant="ghost" size="lg" className="h-12 w-24 rounded-lg">
              <Calendar className="h-6 w-6" />
            </Button>
          </Link>
        </nav>

        {/* Right: Search & Filter */}
        <div className="flex items-center gap-2">
          {/* Search Bar */}
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-56 bg-muted border-0 pl-9"
            />
          </div>

          {/* Filter Dropdown */}
          <Select value={filterValue} onValueChange={setFilterValue}>
            <SelectTrigger className="hidden w-32 bg-muted border-0 lg:flex">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currentConfig.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  )
}
