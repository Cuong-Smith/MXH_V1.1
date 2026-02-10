'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useNewsfeed } from '@/lib/newsfeed-store'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Bell, MoreVertical, Trash2, Eye } from 'lucide-react'

export function NotificationDropdown() {
  const { notifications, users, deleteNotification, markNotificationAsRead } = useNewsfeed()
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const unreadCount = notifications?.filter(n => !n.isRead).length || 0

  const handleMarkAsRead = (notificationId: string) => {
    markNotificationAsRead?.(notificationId)
  }

  const handleDelete = (notificationId: string) => {
    deleteNotification?.(notificationId)
  }

  const getNotificationUser = (userId: string) => {
    return users.find(u => u.id === userId)
  }

  const getNotificationTitle = (notification: any) => {
    const user = getNotificationUser(notification.fromUserId)
    const userName = user?.name || 'Unknown'

    const typeMap = {
      like: `${userName} thich bai viet cua ban`,
      comment: `${userName} da binh luan bai viet cua ban`,
      friend_request: `${userName} gui yeu cau ket ban`,
      post: `${userName} vua dang mot bai viet moi`,
      story: `${userName} vua dang mot story moi`,
      mention: `${userName} nhan ban trong mot bai viet`,
    }

    return typeMap[notification.type as keyof typeof typeMap] || notification.content
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
        <DropdownMenuLabel className="text-sm font-semibold">
          Thong bao ({notifications?.length || 0})
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {!notifications || notifications.length === 0 ? (
          <div className="py-8 text-center">
            <Bell className="h-8 w-8 mx-auto text-muted-foreground mb-2 opacity-50" />
            <p className="text-sm text-muted-foreground">Khong co thong bao</p>
          </div>
        ) : (
          <div className="space-y-1">
            {notifications.map(notification => {
              const notificationUser = getNotificationUser(notification.fromUserId)
              return (
                <div
                  key={notification.id}
                  className={`relative px-3 py-2 hover:bg-muted rounded-lg transition-colors ${
                    !notification.isRead ? 'bg-blue-50 dark:bg-blue-950/20' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 mt-0.5 flex-shrink-0">
                      <AvatarImage src={notificationUser?.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {notificationUser?.name?.[0] || '?'}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {getNotificationTitle(notification)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(notification.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>

                    {/* Menu Button */}
                    <DropdownMenu open={openMenuId === notification.id} onOpenChange={(open) => setOpenMenuId(open ? notification.id : null)}>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <button className="p-1 hover:bg-muted rounded transition-colors flex-shrink-0">
                          <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem asChild>
                          <Link href={notification.postId ? `/post/${notification.postId}` : '#'} className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            <span>Xem bai</span>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => handleDelete(notification.id)} className="flex items-center gap-2 text-destructive">
                          <Trash2 className="h-4 w-4" />
                          <span>Khong nhan thong bao</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <DropdownMenuSeparator className="mt-2" />
        <DropdownMenuItem asChild>
          <Link href="/notifications" className="text-center w-full py-2 text-sm font-medium text-primary hover:bg-muted">
            Xem tat ca thong bao
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
