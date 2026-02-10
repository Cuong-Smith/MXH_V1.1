"use client"

import React from "react"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Calendar, 
  MapPin, 
  Users, 
  ArrowRight, 
  Sparkles,
  Video,
  PartyPopper,
  GraduationCap,
  Presentation,
  CalendarDays
} from 'lucide-react'
import { initialEvents, users } from '@/lib/mock-data'
import type { Event, EventType } from '@/lib/types'

const eventTypeConfig: Record<EventType, { label: string; icon: React.ReactNode; gradient: string }> = {
  party: { 
    label: 'Tiec / Su kien', 
    icon: <PartyPopper className="h-4 w-4" />,
    gradient: 'from-rose-500 to-orange-500'
  },
  workshop: { 
    label: 'Workshop', 
    icon: <Presentation className="h-4 w-4" />,
    gradient: 'from-violet-500 to-purple-500'
  },
  meeting: { 
    label: 'Hop', 
    icon: <Video className="h-4 w-4" />,
    gradient: 'from-blue-500 to-cyan-500'
  },
  training: { 
    label: 'Dao tao', 
    icon: <GraduationCap className="h-4 w-4" />,
    gradient: 'from-emerald-500 to-teal-500'
  },
  other: { 
    label: 'Khac', 
    icon: <CalendarDays className="h-4 w-4" />,
    gradient: 'from-gray-500 to-slate-500'
  },
}

function formatEventDate(date: Date) {
  return new Date(date).toLocaleDateString('vi-VN', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
  })
}

function getTimeUntil(date: Date) {
  const now = new Date()
  const diff = new Date(date).getTime() - now.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  
  if (days > 0) return `${days} ngay nua`
  if (hours > 0) return `${hours} gio nua`
  return 'Sap dien ra'
}

export function EventHighlightCard() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  // Get upcoming events sorted by date
  const upcomingEvents = initialEvents
    .filter(e => new Date(e.startDate) > new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 2)

  const featuredEvent = upcomingEvents[0]
  const nextEvent = upcomingEvents[1]

  if (!mounted) return null

  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-orange-500 via-rose-500 to-purple-600 shadow-xl">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute right-1/4 top-1/2 h-24 w-24 rounded-full bg-yellow-300/20 blur-2xl" />
      </div>

      <CardContent className="relative p-5">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white">Su kien sap toi</h3>
              <p className="text-xs text-white/70">{upcomingEvents.length} su kien dang cho ban</p>
            </div>
          </div>
          <Link href="/events">
            <Button 
              size="sm" 
              variant="secondary"
              className="gap-1 bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
            >
              Xem tat ca
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>

        {/* Featured Event */}
        {featuredEvent && (
          <Link href="/events" className="group block">
            <div className="mb-3 overflow-hidden rounded-xl bg-white/10 backdrop-blur-sm transition-all hover:bg-white/20">
              {featuredEvent.coverImage && (
                <div className="relative h-28 w-full overflow-hidden">
                  <img 
                    src={featuredEvent.coverImage || "/placeholder.svg"} 
                    alt={featuredEvent.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <Badge 
                    className={`absolute left-2 top-2 gap-1 border-0 bg-gradient-to-r ${eventTypeConfig[featuredEvent.type].gradient} text-white`}
                  >
                    {eventTypeConfig[featuredEvent.type].icon}
                    {eventTypeConfig[featuredEvent.type].label}
                  </Badge>
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-sm font-bold text-white line-clamp-1">
                      {featuredEvent.title}
                    </p>
                  </div>
                </div>
              )}
              <div className="p-3">
                <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-white/80">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatEventDate(featuredEvent.startDate)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {featuredEvent.location}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <div className="flex -space-x-2">
                      {featuredEvent.participants.slice(0, 3).map((userId) => {
                        const user = users.find(u => u.id === userId)
                        return (
                          <Avatar key={userId} className="h-6 w-6 border-2 border-white/20">
                            <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-[10px] bg-white/20 text-white">
                              {user?.name[0]}
                            </AvatarFallback>
                          </Avatar>
                        )
                      })}
                    </div>
                    <span className="ml-1 text-xs text-white/70">
                      +{featuredEvent.participants.length} tham gia
                    </span>
                  </div>
                  <Badge className="border-0 bg-white/20 text-white">
                    {getTimeUntil(featuredEvent.startDate)}
                  </Badge>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Next Event (Smaller) */}
        {nextEvent && (
          <Link href="/events" className="group block">
            <div className="flex items-center gap-3 rounded-lg bg-white/10 p-2.5 backdrop-blur-sm transition-all hover:bg-white/20">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${eventTypeConfig[nextEvent.type].gradient}`}>
                {eventTypeConfig[nextEvent.type].icon}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-white">
                  {nextEvent.title}
                </p>
                <p className="text-xs text-white/70">
                  {formatEventDate(nextEvent.startDate)} - {nextEvent.location}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-white/50 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        )}

        {/* Create Event CTA */}
        <Link href="/events?create=true" className="mt-3 block">
          <Button 
            className="w-full gap-2 border-2 border-dashed border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:border-white/50"
            variant="outline"
          >
            <Calendar className="h-4 w-4" />
            Tao su kien moi
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
