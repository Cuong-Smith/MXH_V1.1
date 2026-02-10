"use client"

import React from "react"

import { useState } from 'react'
import { useNewsfeed } from '@/lib/newsfeed-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Building2, Users, Clock, Bell, GripVertical, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { EventHighlightCard } from './event-highlight-card'
import { GroupHighlightCard } from './group-highlight-card'

type CardType = 'event' | 'group' | 'profile' | 'departments' | 'colleagues'

interface DraggableCard {
  type: CardType
  id: string
}

export function NewsfeedSidebar() {
  const { currentUser, users, departments, posts } = useNewsfeed()
  const [cardOrder, setCardOrder] = useState<CardType[]>(['event', 'group', 'profile', 'departments', 'colleagues'])
  const [draggedCard, setDraggedCard] = useState<CardType | null>(null)

  const scheduledPosts = posts.filter(
    (p) =>
      p.authorId === currentUser.id &&
      p.scheduledAt &&
      new Date(p.scheduledAt) > new Date()
  )

  const recentActivity = posts
    .filter((p) => p.taggedUsers.includes(currentUser.id))
    .slice(0, 3)

  const handleDragStart = (cardType: CardType) => {
    setDraggedCard(cardType)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (dropCardType: CardType) => {
    if (!draggedCard || draggedCard === dropCardType) return

    setCardOrder((prev) => {
      const newOrder = [...prev]
      const draggedIndex = newOrder.indexOf(draggedCard)
      const dropIndex = newOrder.indexOf(dropCardType)

      const temp = newOrder[draggedIndex]
      newOrder[draggedIndex] = newOrder[dropIndex]
      newOrder[dropIndex] = temp

      return newOrder
    })

    setDraggedCard(null)
  }

  const renderCard = (cardType: CardType) => {
    const isDragging = draggedCard === cardType
    const cardClasses = `transition-opacity ${isDragging ? 'opacity-50' : 'opacity-100'}`

    switch (cardType) {
      case 'event':
        return (
          <div
            key="event"
            draggable
            onDragStart={() => handleDragStart('event')}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop('event')}
            className={`group relative ${cardClasses}`}
          >
            <div className="absolute -left-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab active:cursor-grabbing" />
            </div>
            <EventHighlightCard />
          </div>
        )
      case 'group':
        return (
          <div
            key="group"
            draggable
            onDragStart={() => handleDragStart('group')}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop('group')}
            className={`group relative ${cardClasses}`}
          >
            <div className="absolute -left-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab active:cursor-grabbing" />
            </div>
            <GroupHighlightCard />
          </div>
        )
      case 'profile':
        return (
          <div
            key="profile"
            draggable
            onDragStart={() => handleDragStart('profile')}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop('profile')}
            className={`group relative ${cardClasses}`}
          >
            <div className="absolute -left-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab active:cursor-grabbing" />
            </div>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{currentUser.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {currentUser.department.name}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Bai viet cua ban</span>
                  <span className="font-medium text-foreground">
                    {posts.filter((p) => p.authorId === currentUser.id).length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      case 'departments':
        return (
          <div
            key="departments"
            draggable
            onDragStart={() => handleDragStart('departments')}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop('departments')}
            className={`group relative ${cardClasses}`}
          >
            <div className="absolute -left-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab active:cursor-grabbing" />
            </div>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Building2 className="h-4 w-4" />
                  Phong ban
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {departments.map((dept) => (
                  <div
                    key={dept.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-foreground">{dept.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {users.filter((u) => u.department.id === dept.id).length}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )
      case 'colleagues':
        return (
          <div
            key="colleagues"
            draggable
            onDragStart={() => handleDragStart('colleagues')}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop('colleagues')}
            className={`group relative ${cardClasses}`}
          >
            <div className="absolute -left-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab active:cursor-grabbing" />
            </div>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Users className="h-4 w-4" />
                  Dong nghiep
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {users
                  .filter((u) => u.id !== currentUser.id)
                  .slice(0, 5)
                  .map((user) => (
                    <Link
                      key={user.id}
                      href="/chat"
                      className="flex items-center gap-2 p-1 rounded-md hover:bg-muted transition-colors cursor-pointer group/item"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        <p className="truncate text-sm font-medium text-foreground group-hover/item:text-primary transition-colors">
                          {user.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {user.department.name}
                        </p>
                      </div>
                      <MessageSquare className="h-3 w-3 text-muted-foreground opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                  ))}
              </CardContent>
            </Card>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {cardOrder.map(renderCard)}

      {scheduledPosts.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4" />
              Bai da len lich
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {scheduledPosts.map((post) => (
              <div key={post.id} className="rounded-md bg-muted/50 p-2">
                <p className="truncate text-sm text-foreground">
                  {post.content.slice(0, 50)}...
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(post.scheduledAt!).toLocaleString('vi-VN')}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {recentActivity.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Bell className="h-4 w-4" />
              Ban duoc tag
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentActivity.map((post) => {
              const author = users.find((u) => u.id === post.authorId)
              return (
                <div key={post.id} className="rounded-md bg-muted/50 p-2">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{author?.name}</span> da tag
                    ban trong mot bai viet
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {post.content.slice(0, 40)}...
                  </p>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
