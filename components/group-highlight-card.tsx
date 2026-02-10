"use client"

import React from "react"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Users, 
  ArrowRight, 
  Lock,
  Globe,
  MessageCircle,
  UserPlus,
  Crown,
  Shield
} from 'lucide-react'
import { initialGroups, users } from '@/lib/mock-data'
import type { GroupMemberRole } from '@/lib/types'

const roleConfig: Record<GroupMemberRole, { label: string; icon: React.ReactNode; color: string }> = {
  admin: { label: 'Admin', icon: <Crown className="h-3 w-3" />, color: 'text-amber-400' },
  moderator: { label: 'Quan tri', icon: <Shield className="h-3 w-3" />, color: 'text-blue-400' },
  member: { label: 'Thanh vien', icon: <Users className="h-3 w-3" />, color: 'text-muted-foreground' },
}

export function GroupHighlightCard() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  // Get groups sorted by activity (most members/posts first)
  const sortedGroups = [...initialGroups]
    .sort((a, b) => b.members.length - a.members.length)
    .slice(0, 3)

  const totalGroups = initialGroups.length
  const myGroups = initialGroups.filter(g => 
    g.members.some(m => m.userId === 'user-1')
  ).length

  if (!mounted) return null

  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 shadow-xl">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute right-1/3 top-1/2 h-20 w-20 rounded-full bg-emerald-300/20 blur-2xl" />
      </div>

      <CardContent className="relative p-5">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white">Nhom cua ban</h3>
              <p className="text-xs text-white/70">{myGroups} nhom da tham gia</p>
            </div>
          </div>
          <Link href="/groups">
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

        {/* Groups List */}
        <div className="space-y-2">
          {sortedGroups.map((group) => {
            const isMember = group.members.some(m => m.userId === 'user-1')
            const memberInfo = group.members.find(m => m.userId === 'user-1')
            const pendingRequests = group.joinRequests.filter(r => r.status === 'pending').length
            
            return (
              <Link href={`/groups?id=${group.id}`} key={group.id} className="group block">
                <div className="flex items-center gap-3 rounded-lg bg-white/10 p-2.5 backdrop-blur-sm transition-all hover:bg-white/20">
                  {/* Group Cover/Icon */}
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                    {group.coverImage ? (
                      <img 
                        src={group.coverImage || "/placeholder.svg"} 
                        alt={group.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-white/20">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                    )}
                    {/* Visibility badge */}
                    <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-background shadow-sm">
                      {group.visibility === 'private' ? (
                        <Lock className="h-3 w-3 text-amber-500" />
                      ) : (
                        <Globe className="h-3 w-3 text-emerald-500" />
                      )}
                    </div>
                  </div>

                  {/* Group Info */}
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-sm font-semibold text-white">
                        {group.name}
                      </p>
                      {isMember && memberInfo && (
                        <span className={roleConfig[memberInfo.role].color}>
                          {roleConfig[memberInfo.role].icon}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/70">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {group.members.length}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {group.posts.length}
                      </span>
                      {pendingRequests > 0 && (memberInfo?.role === 'admin' || memberInfo?.role === 'moderator') && (
                        <Badge className="h-4 border-0 bg-amber-500/80 px-1 text-[10px] text-white">
                          {pendingRequests} cho duyet
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Action indicator */}
                  <div className="shrink-0">
                    {isMember ? (
                      <ArrowRight className="h-4 w-4 text-white/50 transition-transform group-hover:translate-x-0.5" />
                    ) : (
                      <UserPlus className="h-4 w-4 text-white/70" />
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Stats */}
        <div className="mt-3 flex items-center justify-between rounded-lg bg-white/10 px-3 py-2 backdrop-blur-sm">
          <div className="text-center">
            <p className="text-lg font-bold text-white">{totalGroups}</p>
            <p className="text-[10px] text-white/70">Tong nhom</p>
          </div>
          <div className="h-8 w-px bg-white/20" />
          <div className="text-center">
            <p className="text-lg font-bold text-white">{myGroups}</p>
            <p className="text-[10px] text-white/70">Da tham gia</p>
          </div>
          <div className="h-8 w-px bg-white/20" />
          <div className="text-center">
            <p className="text-lg font-bold text-white">
              {initialGroups.reduce((acc, g) => acc + g.joinRequests.filter(r => r.status === 'pending').length, 0)}
            </p>
            <p className="text-[10px] text-white/70">Yeu cau</p>
          </div>
        </div>

        {/* Create Group CTA */}
        <Link href="/groups?create=true" className="mt-3 block">
          <Button 
            className="w-full gap-2 border-2 border-dashed border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:border-white/50"
            variant="outline"
          >
            <Users className="h-4 w-4" />
            Tao nhom moi
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
