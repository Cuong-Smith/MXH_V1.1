"use client"

import React from "react"

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useDevice } from '@/hooks/use-device'
import { MobileGroups } from '@/components/mobile/mobile-groups'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Users,
  Plus,
  Search,
  Lock,
  Globe,
  Crown,
  Shield,
  MoreVertical,
  UserPlus,
  UserMinus,
  MessageCircle,
  ImageIcon,
  Video,
  FileText,
  Pin,
  Eye,
  EyeOff,
  Trash2,
  Check,
  X,
  ArrowLeft,
  Settings,
  LogOut,
  Filter,
  ChevronDown,
  Send,
  Clock,
  ThumbsUp,
  AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { initialGroups as mockGroups, users, currentUser } from '@/lib/mock-data'
import type { Group, GroupMember, GroupPost, GroupMemberRole, GroupJoinRequest, User } from '@/lib/types'

const commonEmojis = ['👍', '❤️', '😂', '😮', '😢', '🎉']

const roleConfig: Record<GroupMemberRole, { label: string; icon: React.ReactNode; color: string; bgColor: string }> = {
  admin: { label: 'Admin', icon: <Crown className="h-3.5 w-3.5" />, color: 'text-amber-600', bgColor: 'bg-amber-100' },
  moderator: { label: 'Quan tri vien', icon: <Shield className="h-3.5 w-3.5" />, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  member: { label: 'Thanh vien', icon: <Users className="h-3.5 w-3.5" />, color: 'text-muted-foreground', bgColor: 'bg-muted' },
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function formatRelativeTime(date: Date) {
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) return `${minutes} phut truoc`
  if (hours < 24) return `${hours} gio truoc`
  if (days < 7) return `${days} ngay truoc`
  return formatDate(date)
}

export default function GroupsPage() {
  const searchParams = useSearchParams()
  const { isMobile } = useDevice()
  const [groups, setGroups] = useState<Group[]>(mockGroups)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterVisibility, setFilterVisibility] = useState<'all' | 'public' | 'private'>('all')
  const [filterMembership, setFilterMembership] = useState<'all' | 'joined' | 'not-joined'>('all')
  
  // Selected group state
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('posts')
  
  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [showLeaveDialog, setShowLeaveDialog] = useState(false)
  const [showDeleteMemberDialog, setShowDeleteMemberDialog] = useState<string | null>(null)
  const [showTransferAdminDialog, setShowTransferAdminDialog] = useState(false)
  const [showJoinRequestDialog, setShowJoinRequestDialog] = useState(false)
  
  // Form states
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    visibility: 'public' as 'public' | 'private',
    requirePostApproval: false,
  })
  const [newPostContent, setNewPostContent] = useState('')
  const [joinRequestMessage, setJoinRequestMessage] = useState('')
  
  // Member filters
  const [memberRoleFilter, setMemberRoleFilter] = useState<'all' | GroupMemberRole>('all')
  const [memberSearchQuery, setMemberSearchQuery] = useState('')
  
  // Post filters
  const [postFilter, setPostFilter] = useState<'all' | 'pinned' | 'pending'>('all')
  const [postAuthorFilter, setPostAuthorFilter] = useState<string>('all')
  const [postSearchQuery, setPostSearchQuery] = useState('')
  
  // Media view
  const [mediaViewType, setMediaViewType] = useState<'all' | 'images' | 'videos' | 'files'>('all')

  const selectedGroup = useMemo(() => 
    groups.find(g => g.id === selectedGroupId),
    [groups, selectedGroupId]
  )

  const currentMember = useMemo(() => 
    selectedGroup?.members.find(m => m.userId === currentUser.id),
    [selectedGroup]
  )

  useEffect(() => {
    const id = searchParams.get('id')
    const create = searchParams.get('create')
    if (id) setSelectedGroupId(id)
    if (create === 'true') setShowCreateDialog(true)
  }, [searchParams])

  const isAdmin = currentMember?.role === 'admin'
  const isModerator = currentMember?.role === 'moderator'
  const canManage = isAdmin || isModerator

  // Filter groups
  const filteredGroups = useMemo(() => {
    return groups.filter(group => {
      const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesVisibility = filterVisibility === 'all' || group.visibility === filterVisibility
      const isMember = group.members.some(m => m.userId === currentUser.id)
      const matchesMembership = filterMembership === 'all' || 
        (filterMembership === 'joined' && isMember) ||
        (filterMembership === 'not-joined' && !isMember)
      return matchesSearch && matchesVisibility && matchesMembership
    })
  }, [groups, searchQuery, filterVisibility, filterMembership])

  // Filter members
  const filteredMembers = useMemo(() => {
    if (!selectedGroup) return []
    return selectedGroup.members.filter(member => {
      const user = users.find(u => u.id === member.userId)
      const matchesRole = memberRoleFilter === 'all' || member.role === memberRoleFilter
      const matchesSearch = !memberSearchQuery || 
        user?.name.toLowerCase().includes(memberSearchQuery.toLowerCase())
      return matchesRole && matchesSearch
    }).sort((a, b) => {
      const roleOrder = { admin: 0, moderator: 1, member: 2 }
      return roleOrder[a.role] - roleOrder[b.role]
    })
  }, [selectedGroup, memberRoleFilter, memberSearchQuery])

  // Filter posts
  const filteredPosts = useMemo(() => {
    if (!selectedGroup) return []
    return selectedGroup.posts.filter(post => {
      if (post.isHidden && !canManage) return false
      const matchesFilter = 
        postFilter === 'all' ||
        (postFilter === 'pinned' && post.isPinned) ||
        (postFilter === 'pending' && !post.isApproved)
      const matchesAuthor = postAuthorFilter === 'all' || post.authorId === postAuthorFilter
      const matchesSearch = !postSearchQuery ||
        post.content.toLowerCase().includes(postSearchQuery.toLowerCase()) ||
        post.taggedUsers.some(userId => {
          const user = users.find(u => u.id === userId)
          return user?.name.toLowerCase().includes(postSearchQuery.toLowerCase())
        })
      return matchesFilter && matchesAuthor && matchesSearch
    }).sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [selectedGroup, postFilter, postAuthorFilter, postSearchQuery, canManage])

  // Get media from posts
  const mediaItems = useMemo(() => {
    if (!selectedGroup) return []
    const items: { type: 'image' | 'video' | 'file'; url: string; name?: string; postId: string }[] = []
    for (const post of selectedGroup.posts) {
      if (post.isHidden && !canManage) continue
      for (const att of post.attachments) {
        items.push({ ...att, postId: post.id })
      }
    }
    return items.filter(item => 
      mediaViewType === 'all' ||
      (mediaViewType === 'images' && item.type === 'image') ||
      (mediaViewType === 'videos' && item.type === 'video') ||
      (mediaViewType === 'files' && item.type === 'sticker')
    )
  }, [selectedGroup, mediaViewType, canManage])

  if (isMobile) {
    return <MobileGroups />
  }

  // Handlers
  const handleCreateGroup = () => {
    if (!newGroup.name.trim()) return
    const group: Group = {
      id: `group-${Date.now()}`,
      name: newGroup.name,
      description: newGroup.description,
      visibility: newGroup.visibility,
      members: [{ userId: currentUser.id, role: 'admin', joinedAt: new Date() }],
      joinRequests: [],
      invitations: [],
      posts: [],
      requirePostApproval: newGroup.requirePostApproval,
      createdAt: new Date(),
      createdBy: currentUser.id,
    }
    setGroups([group, ...groups])
    setShowCreateDialog(false)
    setNewGroup({ name: '', description: '', visibility: 'public', requirePostApproval: false })
    setSelectedGroupId(group.id)
  }

  const handleJoinGroup = (groupId: string) => {
    const group = groups.find(g => g.id === groupId)
    if (!group) return

    if (group.visibility === 'public') {
      // Direct join for public groups
      setGroups(groups.map(g => 
        g.id === groupId 
          ? { ...g, members: [...g.members, { userId: currentUser.id, role: 'member', joinedAt: new Date() }] }
          : g
      ))
    } else {
      // Request to join for private groups
      setSelectedGroupId(groupId)
      setShowJoinRequestDialog(true)
    }
  }

  const handleSendJoinRequest = () => {
    if (!selectedGroupId) return
    const request: GroupJoinRequest = {
      id: `req-${Date.now()}`,
      userId: currentUser.id,
      message: joinRequestMessage,
      createdAt: new Date(),
      status: 'pending',
    }
    setGroups(groups.map(g =>
      g.id === selectedGroupId
        ? { ...g, joinRequests: [...g.joinRequests, request] }
        : g
    ))
    setShowJoinRequestDialog(false)
    setJoinRequestMessage('')
  }

  const handleApproveRequest = (requestId: string) => {
    if (!selectedGroup) return
    const request = selectedGroup.joinRequests.find(r => r.id === requestId)
    if (!request) return

    setGroups(groups.map(g =>
      g.id === selectedGroup.id
        ? {
            ...g,
            members: [...g.members, { userId: request.userId, role: 'member', joinedAt: new Date() }],
            joinRequests: g.joinRequests.map(r => 
              r.id === requestId ? { ...r, status: 'approved' as const } : r
            ),
          }
        : g
    ))
  }

  const handleRejectRequest = (requestId: string) => {
    if (!selectedGroup) return
    setGroups(groups.map(g =>
      g.id === selectedGroup.id
        ? {
            ...g,
            joinRequests: g.joinRequests.map(r =>
              r.id === requestId ? { ...r, status: 'rejected' as const } : r
            ),
          }
        : g
    ))
  }

  const handleInviteUser = (userId: string) => {
    if (!selectedGroup) return
    const invitation = {
      id: `inv-${Date.now()}`,
      groupId: selectedGroup.id,
      invitedUserId: userId,
      invitedBy: currentUser.id,
      createdAt: new Date(),
      status: 'pending' as const,
    }
    setGroups(groups.map(g =>
      g.id === selectedGroup.id
        ? { ...g, invitations: [...g.invitations, invitation] }
        : g
    ))
  }

  const handleChangeMemberRole = (userId: string, newRole: GroupMemberRole) => {
    if (!selectedGroup || !isAdmin) return
    setGroups(groups.map(g =>
      g.id === selectedGroup.id
        ? {
            ...g,
            members: g.members.map(m =>
              m.userId === userId ? { ...m, role: newRole } : m
            ),
          }
        : g
    ))
  }

  const handleRemoveMember = (userId: string) => {
    if (!selectedGroup || !canManage) return
    setGroups(groups.map(g =>
      g.id === selectedGroup.id
        ? { ...g, members: g.members.filter(m => m.userId !== userId) }
        : g
    ))
    setShowDeleteMemberDialog(null)
  }

  const handleLeaveGroup = () => {
    if (!selectedGroup || !currentMember) return

    if (isAdmin) {
      // Check for moderators
      const moderators = selectedGroup.members.filter(m => m.role === 'moderator')
      if (moderators.length > 0) {
        // Auto-transfer to first moderator
        setGroups(groups.map(g =>
          g.id === selectedGroup.id
            ? {
                ...g,
                members: g.members
                  .filter(m => m.userId !== currentUser.id)
                  .map(m => m.userId === moderators[0].userId ? { ...m, role: 'admin' as const } : m),
              }
            : g
        ))
      } else if (selectedGroup.members.length > 1) {
        // Need to transfer admin
        setShowTransferAdminDialog(true)
        return
      } else {
        // Last member, delete group
        setGroups(groups.filter(g => g.id !== selectedGroup.id))
      }
    } else {
      // Regular member leave
      setGroups(groups.map(g =>
        g.id === selectedGroup.id
          ? { ...g, members: g.members.filter(m => m.userId !== currentUser.id) }
          : g
      ))
    }
    setShowLeaveDialog(false)
    setSelectedGroupId(null)
  }

  const handleTransferAdmin = (newAdminId: string) => {
    if (!selectedGroup) return
    setGroups(groups.map(g =>
      g.id === selectedGroup.id
        ? {
            ...g,
            members: g.members
              .filter(m => m.userId !== currentUser.id)
              .map(m => m.userId === newAdminId ? { ...m, role: 'admin' as const } : m),
          }
        : g
    ))
    setShowTransferAdminDialog(false)
    setSelectedGroupId(null)
  }

  const handleCreatePost = () => {
    if (!selectedGroup || !newPostContent.trim()) return
    const post: GroupPost = {
      id: `gpost-${Date.now()}`,
      groupId: selectedGroup.id,
      authorId: currentUser.id,
      content: newPostContent,
      attachments: [],
      taggedUsers: [],
      reactions: [],
      comments: [],
      isPinned: false,
      isHidden: false,
      isApproved: !selectedGroup.requirePostApproval || canManage,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setGroups(groups.map(g =>
      g.id === selectedGroup.id
        ? { ...g, posts: [post, ...g.posts] }
        : g
    ))
    setNewPostContent('')
  }

  const handleTogglePin = (postId: string) => {
    if (!selectedGroup || !canManage) return
    setGroups(groups.map(g =>
      g.id === selectedGroup.id
        ? {
            ...g,
            posts: g.posts.map(p =>
              p.id === postId ? { ...p, isPinned: !p.isPinned } : p
            ),
          }
        : g
    ))
  }

  const handleToggleHide = (postId: string) => {
    if (!selectedGroup || !canManage) return
    setGroups(groups.map(g =>
      g.id === selectedGroup.id
        ? {
            ...g,
            posts: g.posts.map(p =>
              p.id === postId ? { ...p, isHidden: !p.isHidden } : p
            ),
          }
        : g
    ))
  }

  const handleApprovePost = (postId: string) => {
    if (!selectedGroup || !canManage) return
    setGroups(groups.map(g =>
      g.id === selectedGroup.id
        ? {
            ...g,
            posts: g.posts.map(p =>
              p.id === postId ? { ...p, isApproved: true } : p
            ),
          }
        : g
    ))
  }

  const handleDeletePost = (postId: string) => {
    if (!selectedGroup) return
    const post = selectedGroup.posts.find(p => p.id === postId)
    if (!post) return
    // Can delete if admin/mod or own post
    if (!canManage && post.authorId !== currentUser.id) return
    
    setGroups(groups.map(g =>
      g.id === selectedGroup.id
        ? { ...g, posts: g.posts.filter(p => p.id !== postId) }
        : g
    ))
  }

  const handleReactPost = (postId: string, emoji: string) => {
    if (!selectedGroup) return
    setGroups(groups.map(g =>
      g.id === selectedGroup.id
        ? {
            ...g,
            posts: g.posts.map(p => {
              if (p.id !== postId) return p
              const reactionIndex = p.reactions.findIndex(r => r.emoji === emoji)
              if (reactionIndex === -1) {
                return { ...p, reactions: [...p.reactions, { emoji, users: [currentUser.id] }] }
              }
              const reaction = p.reactions[reactionIndex]
              if (reaction.users.includes(currentUser.id)) {
                const newUsers = reaction.users.filter(u => u !== currentUser.id)
                if (newUsers.length === 0) {
                  return { ...p, reactions: p.reactions.filter((_, i) => i !== reactionIndex) }
                }
                return {
                  ...p,
                  reactions: p.reactions.map((r, i) =>
                    i === reactionIndex ? { ...r, users: newUsers } : r
                  ),
                }
              }
              return {
                ...p,
                reactions: p.reactions.map((r, i) =>
                  i === reactionIndex ? { ...r, users: [...r.users, currentUser.id] } : r
                ),
              }
            }),
          }
        : g
    ))
  }

  // Render Group List
  const renderGroupList = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nhom</h1>
          <p className="text-sm text-muted-foreground">Quan ly va tham gia cac nhom trong cong ty</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Tao nhom moi
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tim kiem nhom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterVisibility} onValueChange={(v: typeof filterVisibility) => setFilterVisibility(v)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Che do" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tat ca</SelectItem>
            <SelectItem value="public">Cong khai</SelectItem>
            <SelectItem value="private">Rieng tu</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterMembership} onValueChange={(v: typeof filterMembership) => setFilterMembership(v)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Thanh vien" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tat ca</SelectItem>
            <SelectItem value="joined">Da tham gia</SelectItem>
            <SelectItem value="not-joined">Chua tham gia</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Groups Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredGroups.map((group) => {
          const isMember = group.members.some(m => m.userId === currentUser.id)
          const memberInfo = group.members.find(m => m.userId === currentUser.id)
          const pendingRequests = group.joinRequests.filter(r => r.status === 'pending').length
          const hasPendingInvite = group.invitations.some(
            i => i.invitedUserId === currentUser.id && i.status === 'pending'
          )
          const hasPendingRequest = group.joinRequests.some(
            r => r.userId === currentUser.id && r.status === 'pending'
          )

          return (
            <Card 
              key={group.id} 
              className="group cursor-pointer overflow-hidden transition-all hover:shadow-md"
              onClick={() => setSelectedGroupId(group.id)}
            >
              {/* Cover Image */}
              <div className="relative h-32 overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                {group.coverImage && (
                  <img
                    src={group.coverImage || "/placeholder.svg"}
                    alt={group.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <Badge 
                  className={`absolute right-2 top-2 gap-1 ${
                    group.visibility === 'private' 
                      ? 'bg-amber-100 text-amber-700' 
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                  variant="secondary"
                >
                  {group.visibility === 'private' ? <Lock className="h-3 w-3" /> : <Globe className="h-3 w-3" />}
                  {group.visibility === 'private' ? 'Rieng tu' : 'Cong khai'}
                </Badge>
              </div>

              <CardContent className="p-4">
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground line-clamp-1">{group.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{group.description}</p>
                  </div>
                  {isMember && memberInfo && (
                    <Badge className={`shrink-0 ${roleConfig[memberInfo.role].bgColor} ${roleConfig[memberInfo.role].color}`}>
                      {roleConfig[memberInfo.role].icon}
                      <span className="ml-1">{roleConfig[memberInfo.role].label}</span>
                    </Badge>
                  )}
                </div>

                <div className="mb-3 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {group.members.length} thanh vien
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    {group.posts.length} bai viet
                  </span>
                </div>

                {/* Member avatars */}
                <div className="mb-3 flex -space-x-2">
                  {group.members.slice(0, 5).map((member) => {
                    const user = users.find(u => u.id === member.userId)
                    return (
                      <Avatar key={member.userId} className="h-8 w-8 border-2 border-background">
                        <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">{user?.name[0]}</AvatarFallback>
                      </Avatar>
                    )
                  })}
                  {group.members.length > 5 && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                      +{group.members.length - 5}
                    </div>
                  )}
                </div>

                {/* Action button */}
                {isMember ? (
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" className="flex-1" onClick={(e) => { e.stopPropagation(); setSelectedGroupId(group.id) }}>
                      Xem nhom
                    </Button>
                    {(memberInfo?.role === 'admin' || memberInfo?.role === 'moderator') && pendingRequests > 0 && (
                      <Badge variant="destructive" className="animate-pulse">
                        {pendingRequests}
                      </Badge>
                    )}
                  </div>
                ) : hasPendingInvite ? (
                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={(e) => { e.stopPropagation(); handleJoinGroup(group.id) }}>
                      Chap nhan loi moi
                    </Button>
                    <Button variant="outline" onClick={(e) => e.stopPropagation()}>
                      Tu choi
                    </Button>
                  </div>
                ) : hasPendingRequest ? (
                  <Button variant="secondary" className="w-full" disabled>
                    <Clock className="mr-2 h-4 w-4" />
                    Dang cho phe duyet
                  </Button>
                ) : (
                  <Button 
                    className="w-full" 
                    onClick={(e) => { e.stopPropagation(); handleJoinGroup(group.id) }}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    {group.visibility === 'private' ? 'Yeu cau tham gia' : 'Tham gia nhom'}
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredGroups.length === 0 && (
        <div className="py-12 text-center">
          <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <p className="mt-2 text-muted-foreground">Khong tim thay nhom nao</p>
        </div>
      )}
    </div>
  )

  // Render Group Detail
  const renderGroupDetail = () => {
    if (!selectedGroup) return null

    const pendingRequests = selectedGroup.joinRequests.filter(r => r.status === 'pending')
    const pendingPosts = selectedGroup.posts.filter(p => !p.isApproved)

    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="relative overflow-hidden rounded-xl">
          <div className="h-48 w-full overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600">
            {selectedGroup.coverImage && (
              <img
                src={selectedGroup.coverImage || "/placeholder.svg"}
                alt={selectedGroup.name}
                className="h-full w-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-end justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 bg-background/50 backdrop-blur-sm"
                    onClick={() => setSelectedGroupId(null)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Badge className={selectedGroup.visibility === 'private' ? 'bg-amber-500' : 'bg-emerald-500'}>
                    {selectedGroup.visibility === 'private' ? <Lock className="mr-1 h-3 w-3" /> : <Globe className="mr-1 h-3 w-3" />}
                    {selectedGroup.visibility === 'private' ? 'Rieng tu' : 'Cong khai'}
                  </Badge>
                </div>
                <h1 className="text-2xl font-bold text-foreground">{selectedGroup.name}</h1>
                <p className="text-sm text-muted-foreground">{selectedGroup.description}</p>
                <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{selectedGroup.members.length} thanh vien</span>
                  <span>{selectedGroup.posts.length} bai viet</span>
                  <span>Tao ngay {formatDate(selectedGroup.createdAt)}</span>
                </div>
              </div>
              
              {currentMember && (
                <div className="flex items-center gap-2">
                  {canManage && (
                    <Button variant="outline" className="gap-2 bg-transparent" onClick={() => setShowInviteDialog(true)}>
                      <UserPlus className="h-4 w-4" />
                      Moi thanh vien
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {isAdmin && (
                        <>
                          <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            Cai dat nhom
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => setShowLeaveDialog(true)}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Roi nhom
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Notifications for admin/mod */}
        {canManage && (pendingRequests.length > 0 || pendingPosts.length > 0) && (
          <div className="flex flex-wrap gap-2">
            {pendingRequests.length > 0 && (
              <Button 
                variant="outline" 
                className="gap-2 border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                onClick={() => setActiveTab('members')}
              >
                <Clock className="h-4 w-4" />
                {pendingRequests.length} yeu cau cho phe duyet
              </Button>
            )}
            {pendingPosts.length > 0 && (
              <Button 
                variant="outline" 
                className="gap-2 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                onClick={() => { setActiveTab('posts'); setPostFilter('pending') }}
              >
                <FileText className="h-4 w-4" />
                {pendingPosts.length} bai viet cho duyet
              </Button>
            )}
          </div>
        )}

        {/* Tabs */}
        <div>
          {/* Online Status */}
          <div className="mb-4 flex items-center gap-2 rounded-full bg-muted px-3 py-2 w-fit text-sm font-medium">
            <span className="inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            <span className="text-foreground">{selectedGroup?.members.length || 0} online</span>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="posts">Bai viet</TabsTrigger>
              <TabsTrigger value="members">
                Thanh vien
                {canManage && pendingRequests.length > 0 && (
                  <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-[10px]">
                    {pendingRequests.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="about">Gioi thieu</TabsTrigger>
            </TabsList>

          {/* Posts Tab */}
          <TabsContent value="posts" className="space-y-4">
            {/* Create Post */}
            {currentMember && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <Avatar>
                      <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea
                        placeholder="Ban dang nghi gi?"
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        className="min-h-[80px] resize-none"
                      />
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <ImageIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Video className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button 
                          onClick={handleCreatePost} 
                          disabled={!newPostContent.trim()}
                          className="gap-2"
                        >
                          <Send className="h-4 w-4" />
                          {selectedGroup.requirePostApproval && !canManage ? 'Gui de duyet' : 'Dang bai'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Post Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tim kiem bai viet, tag..."
                  value={postSearchQuery}
                  onChange={(e) => setPostSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={postFilter} onValueChange={(v: typeof postFilter) => setPostFilter(v)}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Loc" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tat ca</SelectItem>
                  <SelectItem value="pinned">Da ghim</SelectItem>
                  {canManage && <SelectItem value="pending">Cho duyet</SelectItem>}
                </SelectContent>
              </Select>
              <Select value={postAuthorFilter} onValueChange={setPostAuthorFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Nguoi dang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tat ca</SelectItem>
                  {selectedGroup.members.map((member) => {
                    const user = users.find(u => u.id === member.userId)
                    return (
                      <SelectItem key={member.userId} value={member.userId}>
                        {user?.name}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Posts List */}
            <div className="space-y-4">
              {filteredPosts.map((post) => {
                const author = users.find(u => u.id === post.authorId)
                const memberInfo = selectedGroup.members.find(m => m.userId === post.authorId)

                return (
                  <Card key={post.id} className={`${post.isHidden ? 'opacity-60' : ''} ${post.isPinned ? 'border-amber-300 bg-amber-50/50' : ''}`}>
                    <CardContent className="p-4">
                      {/* Post badges */}
                      <div className="mb-2 flex flex-wrap gap-2">
                        {post.isPinned && (
                          <Badge variant="secondary" className="gap-1 bg-amber-100 text-amber-700">
                            <Pin className="h-3 w-3" />
                            Da ghim
                          </Badge>
                        )}
                        {post.isHidden && (
                          <Badge variant="secondary" className="gap-1">
                            <EyeOff className="h-3 w-3" />
                            Da an
                          </Badge>
                        )}
                        {!post.isApproved && (
                          <Badge variant="secondary" className="gap-1 bg-blue-100 text-blue-700">
                            <Clock className="h-3 w-3" />
                            Cho phe duyet
                          </Badge>
                        )}
                      </div>

                      {/* Author */}
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={author?.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{author?.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-foreground">{author?.name}</span>
                              {memberInfo && (
                                <span className={roleConfig[memberInfo.role].color}>
                                  {roleConfig[memberInfo.role].icon}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {formatRelativeTime(post.createdAt)}
                            </p>
                          </div>
                        </div>

                        {(canManage || post.authorId === currentUser.id) && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {canManage && (
                                <>
                                  {!post.isApproved && (
                                    <DropdownMenuItem onClick={() => handleApprovePost(post.id)}>
                                      <Check className="mr-2 h-4 w-4" />
                                      Phe duyet
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem onClick={() => handleTogglePin(post.id)}>
                                    <Pin className="mr-2 h-4 w-4" />
                                    {post.isPinned ? 'Bo ghim' : 'Ghim bai'}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleToggleHide(post.id)}>
                                    {post.isHidden ? <Eye className="mr-2 h-4 w-4" /> : <EyeOff className="mr-2 h-4 w-4" />}
                                    {post.isHidden ? 'Hien bai' : 'An bai'}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                </>
                              )}
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleDeletePost(post.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Xoa bai
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>

                      {/* Content */}
                      <p className="mb-3 whitespace-pre-wrap text-foreground">{post.content}</p>

                      {/* Attachments */}
                      {post.attachments.length > 0 && (
                        <div className="mb-3 grid gap-2 grid-cols-2">
                          {post.attachments.map((att) => (
                            <div key={att.id} className="overflow-hidden rounded-lg">
                              {att.type === 'image' && (
                                <img src={att.url || "/placeholder.svg"} alt="" className="h-40 w-full object-cover" />
                              )}
                              {att.type === 'video' && (
                                <video src={att.url} controls className="h-40 w-full object-cover" />
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Tagged users */}
                      {post.taggedUsers.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-1">
                          {post.taggedUsers.map((userId) => {
                            const user = users.find(u => u.id === userId)
                            return (
                              <Badge key={userId} variant="secondary" className="text-xs">
                                @{user?.name}
                              </Badge>
                            )
                          })}
                        </div>
                      )}

                      {/* Reactions */}
                      <div className="flex items-center gap-2 border-t pt-3">
                        <div className="flex gap-1">
                          {commonEmojis.slice(0, 6).map((emoji) => {
                            const reaction = post.reactions.find(r => r.emoji === emoji)
                            const isActive = reaction?.users.includes(currentUser.id)
                            return (
                              <Button
                                key={emoji}
                                variant={isActive ? 'secondary' : 'ghost'}
                                size="sm"
                                className="h-8 px-2"
                                onClick={() => handleReactPost(post.id, emoji)}
                              >
                                {emoji}
                                {reaction && reaction.users.length > 0 && (
                                  <span className="ml-1 text-xs">{reaction.users.length}</span>
                                )}
                              </Button>
                            )
                          })}
                        </div>
                        <Button variant="ghost" size="sm" className="ml-auto gap-2">
                          <MessageCircle className="h-4 w-4" />
                          {post.comments.length > 0 && post.comments.length}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}

              {filteredPosts.length === 0 && (
                <div className="py-12 text-center">
                  <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-2 text-muted-foreground">Chua co bai viet nao</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-4">
            {/* Pending Requests */}
            {canManage && pendingRequests.length > 0 && (
              <Card className="border-amber-200 bg-amber-50/50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Clock className="h-4 w-4 text-amber-600" />
                    Yeu cau tham gia ({pendingRequests.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {pendingRequests.map((request) => {
                    const user = users.find(u => u.id === request.userId)
                    return (
                      <div key={request.id} className="flex items-center gap-3 rounded-lg bg-background p-3">
                        <Avatar>
                          <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{user?.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{user?.name}</p>
                          {request.message && (
                            <p className="text-sm text-muted-foreground">{request.message}</p>
                          )}
                          <p className="text-xs text-muted-foreground">{formatRelativeTime(request.createdAt)}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleApproveRequest(request.id)}>
                            <Check className="mr-1 h-4 w-4" />
                            Duyet
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleRejectRequest(request.id)}>
                            <X className="mr-1 h-4 w-4" />
                            Tu choi
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            )}

            {/* Member Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tim kiem thanh vien..."
                  value={memberSearchQuery}
                  onChange={(e) => setMemberSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={memberRoleFilter} onValueChange={(v: typeof memberRoleFilter) => setMemberRoleFilter(v)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Vai tro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tat ca vai tro</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="moderator">Quan tri vien</SelectItem>
                  <SelectItem value="member">Thanh vien</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Members List */}
            <Card>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  <div className="divide-y">
                    {filteredMembers.map((member) => {
                      const user = users.find(u => u.id === member.userId)
                      const canModify = isAdmin && member.userId !== currentUser.id

                      return (
                        <div key={member.userId} className="flex items-center gap-3 p-4">
                          <Avatar>
                            <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{user?.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-foreground">{user?.name}</span>
                              <Badge className={`${roleConfig[member.role].bgColor} ${roleConfig[member.role].color}`}>
                                {roleConfig[member.role].icon}
                                <span className="ml-1">{roleConfig[member.role].label}</span>
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {user?.department.name} - Tham gia {formatDate(member.joinedAt)}
                            </p>
                          </div>
                          
                          {canModify && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleChangeMemberRole(member.userId, member.role === 'moderator' ? 'member' : 'moderator')}>
                                  <Shield className="mr-2 h-4 w-4" />
                                  {member.role === 'moderator' ? 'Huy quyen quan tri' : 'Cap quyen quan tri'}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  onClick={() => setShowDeleteMemberDialog(member.userId)}
                                >
                                  <UserMinus className="mr-2 h-4 w-4" />
                                  Xoa khoi nhom
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="space-y-4">
            <div className="flex items-center gap-2">
              <Button 
                variant={mediaViewType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMediaViewType('all')}
              >
                Tat ca
              </Button>
              <Button 
                variant={mediaViewType === 'images' ? 'default' : 'outline'}
                size="sm"
                className="gap-2"
                onClick={() => setMediaViewType('images')}
              >
                <ImageIcon className="h-4 w-4" />
                Hinh anh
              </Button>
              <Button 
                variant={mediaViewType === 'videos' ? 'default' : 'outline'}
                size="sm"
                className="gap-2"
                onClick={() => setMediaViewType('videos')}
              >
                <Video className="h-4 w-4" />
                Video
              </Button>
              <Button 
                variant={mediaViewType === 'files' ? 'default' : 'outline'}
                size="sm"
                className="gap-2"
                onClick={() => setMediaViewType('files')}
              >
                <FileText className="h-4 w-4" />
                Tai lieu
              </Button>
            </div>

            {mediaItems.length > 0 ? (
              <div className="grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {mediaItems.map((item, idx) => (
                  <div key={idx} className="group relative aspect-square overflow-hidden rounded-lg bg-muted">
                    {item.type === 'image' && (
                      <img src={item.url || "/placeholder.svg"} alt="" className="h-full w-full object-cover" />
                    )}
                    {item.type === 'video' && (
                      <div className="flex h-full items-center justify-center bg-muted">
                        <Video className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button variant="secondary" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-muted-foreground">Chua co media nao</p>
              </div>
            )}
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about">
            <Card>
              <CardContent className="space-y-4 p-6">
                <div>
                  <h3 className="mb-2 font-semibold text-foreground">Gioi thieu</h3>
                  <p className="text-muted-foreground">{selectedGroup.description}</p>
                </div>
                <Separator />
                <div>
                  <h3 className="mb-2 font-semibold text-foreground">Thong tin</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Che do</dt>
                      <dd className="flex items-center gap-1 text-foreground">
                        {selectedGroup.visibility === 'private' ? <Lock className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
                        {selectedGroup.visibility === 'private' ? 'Rieng tu' : 'Cong khai'}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Duyet bai truoc khi dang</dt>
                      <dd className="text-foreground">{selectedGroup.requirePostApproval ? 'Co' : 'Khong'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Ngay tao</dt>
                      <dd className="text-foreground">{formatDate(selectedGroup.createdAt)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Nguoi tao</dt>
                      <dd className="text-foreground">{users.find(u => u.id === selectedGroup.createdBy)?.name}</dd>
                    </div>
                  </dl>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl p-4 md:p-6">
        {/* Back to newsfeed */}
        <Link href="/" className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Quay lai Newsfeed
        </Link>

        {selectedGroupId ? renderGroupDetail() : renderGroupList()}
      </div>

      {/* Create Group Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tao nhom moi</DialogTitle>
            <DialogDescription>
              Tao nhom de ket noi va chia se voi dong nghiep
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ten nhom</Label>
              <Input
                id="name"
                placeholder="VD: Frontend Developers"
                value={newGroup.name}
                onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Mo ta</Label>
              <Textarea
                id="description"
                placeholder="Mo ta ve nhom..."
                value={newGroup.description}
                onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Che do hien thi</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={newGroup.visibility === 'public' ? 'default' : 'outline'}
                  className="flex-1 gap-2"
                  onClick={() => setNewGroup({ ...newGroup, visibility: 'public' })}
                >
                  <Globe className="h-4 w-4" />
                  Cong khai
                </Button>
                <Button
                  type="button"
                  variant={newGroup.visibility === 'private' ? 'default' : 'outline'}
                  className="flex-1 gap-2"
                  onClick={() => setNewGroup({ ...newGroup, visibility: 'private' })}
                >
                  <Lock className="h-4 w-4" />
                  Rieng tu
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Duyet bai truoc khi dang</Label>
                <p className="text-xs text-muted-foreground">Bai viet can duoc duyet truoc khi hien thi</p>
              </div>
              <Switch
                checked={newGroup.requirePostApproval}
                onCheckedChange={(checked) => setNewGroup({ ...newGroup, requirePostApproval: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Huy</Button>
            <Button onClick={handleCreateGroup} disabled={!newGroup.name.trim()}>Tao nhom</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Moi thanh vien</DialogTitle>
            <DialogDescription>
              Chon nguoi ban muon moi vao nhom
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {users
                .filter(u => !selectedGroup?.members.some(m => m.userId === u.id))
                .map((user) => {
                  const isInvited = selectedGroup?.invitations.some(
                    i => i.invitedUserId === user.id && i.status === 'pending'
                  )
                  return (
                    <div key={user.id} className="flex items-center gap-3 rounded-lg border p-3">
                      <Avatar>
                        <AvatarImage src={user.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.department.name}</p>
                      </div>
                      <Button 
                        size="sm" 
                        disabled={isInvited}
                        onClick={() => handleInviteUser(user.id)}
                      >
                        {isInvited ? 'Da moi' : 'Moi'}
                      </Button>
                    </div>
                  )
                })}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Join Request Dialog */}
      <Dialog open={showJoinRequestDialog} onOpenChange={setShowJoinRequestDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Yeu cau tham gia nhom</DialogTitle>
            <DialogDescription>
              Gui yeu cau de tham gia nhom rieng tu nay
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="message">Loi nhan (khong bat buoc)</Label>
              <Textarea
                id="message"
                placeholder="Gioi thieu ban than hoac ly do muon tham gia..."
                value={joinRequestMessage}
                onChange={(e) => setJoinRequestMessage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowJoinRequestDialog(false)}>Huy</Button>
            <Button onClick={handleSendJoinRequest}>Gui yeu cau</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Leave Group Dialog */}
      <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Roi khoi nhom?</AlertDialogTitle>
            <AlertDialogDescription>
              {isAdmin ? (
                selectedGroup && selectedGroup.members.filter(m => m.role === 'moderator').length > 0 ? (
                  'Ban la admin cua nhom nay. Quyen admin se duoc chuyen cho quan tri vien.'
                ) : selectedGroup && selectedGroup.members.length > 1 ? (
                  'Ban la admin va chua co quan tri vien. Vui long chon nguoi ke nhiem truoc khi roi nhom.'
                ) : (
                  'Ban la thanh vien cuoi cung. Nhom se bi xoa neu ban roi di.'
                )
              ) : (
                'Ban co chac chan muon roi khoi nhom nay?'
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Huy</AlertDialogCancel>
            <AlertDialogAction onClick={handleLeaveGroup} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Roi nhom
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Transfer Admin Dialog */}
      <Dialog open={showTransferAdminDialog} onOpenChange={setShowTransferAdminDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chuyen quyen Admin</DialogTitle>
            <DialogDescription>
              Chon nguoi se tro thanh Admin moi cua nhom
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {selectedGroup?.members
                .filter(m => m.userId !== currentUser.id)
                .map((member) => {
                  const user = users.find(u => u.id === member.userId)
                  return (
                    <div key={member.userId} className="flex items-center gap-3 rounded-lg border p-3">
                      <Avatar>
                        <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{user?.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{roleConfig[member.role].label}</p>
                      </div>
                      <Button size="sm" onClick={() => handleTransferAdmin(member.userId)}>
                        Chon
                      </Button>
                    </div>
                  )
                })}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Delete Member Dialog */}
      <AlertDialog open={!!showDeleteMemberDialog} onOpenChange={() => setShowDeleteMemberDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xoa thanh vien?</AlertDialogTitle>
            <AlertDialogDescription>
              Thanh vien se bi xoa khoi nhom nhung cac bai dang cua ho van duoc giu lai.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Huy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => showDeleteMemberDialog && handleRemoveMember(showDeleteMemberDialog)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xoa thanh vien
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
