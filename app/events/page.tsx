"use client"

import { cn } from "@/lib/utils"

import React from "react"

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useDevice } from '@/hooks/use-device'
import { MobileEvents } from '@/components/mobile/mobile-events'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Calendar, 
  MapPin, 
  Users, 
  Plus, 
  Clock,
  Video,
  PartyPopper,
  GraduationCap,
  Presentation,
  CalendarDays,
  Search,
  Filter,
  CheckCircle2,
  UserPlus,
  ExternalLink,
  Building2,
  Globe,
  Lock,
  UserCheck
} from 'lucide-react'
import { initialEvents, users, departments, currentUser } from '@/lib/mock-data'
import type { Event, EventType, Visibility } from '@/lib/types'

const eventTypeConfig: Record<EventType, { label: string; icon: React.ReactNode; gradient: string; bg: string }> = {
  party: { 
    label: 'Tiec / Su kien', 
    icon: <PartyPopper className="h-4 w-4" />,
    gradient: 'from-rose-500 to-orange-500',
    bg: 'bg-rose-50 text-rose-700 border-rose-200'
  },
  workshop: { 
    label: 'Workshop', 
    icon: <Presentation className="h-4 w-4" />,
    gradient: 'from-violet-500 to-purple-500',
    bg: 'bg-violet-50 text-violet-700 border-violet-200'
  },
  meeting: { 
    label: 'Hop', 
    icon: <Video className="h-4 w-4" />,
    gradient: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  training: { 
    label: 'Dao tao', 
    icon: <GraduationCap className="h-4 w-4" />,
    gradient: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  other: { 
    label: 'Khac', 
    icon: <CalendarDays className="h-4 w-4" />,
    gradient: 'from-gray-500 to-slate-500',
    bg: 'bg-gray-50 text-gray-700 border-gray-200'
  },
}

const visibilityOptions = [
  { value: 'company', label: 'Toan cong ty', icon: <Globe className="h-4 w-4" /> },
  { value: 'department', label: 'Phong ban', icon: <Building2 className="h-4 w-4" /> },
  { value: 'specific', label: 'Chi dinh', icon: <Users className="h-4 w-4" /> },
  { value: 'private', label: 'Rieng tu', icon: <Lock className="h-4 w-4" /> },
]

function formatEventDate(date: Date, includeTime = false) {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }
  if (includeTime) {
    options.hour = '2-digit'
    options.minute = '2-digit'
  }
  return new Date(date).toLocaleDateString('vi-VN', options)
}

function formatTime(date: Date) {
  return new Date(date).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getTimeUntil(date: Date) {
  const now = new Date()
  const diff = new Date(date).getTime() - now.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  
  if (days > 0) return `Con ${days} ngay`
  if (hours > 0) return `Con ${hours} gio`
  return 'Sap dien ra'
}

function CreateEventDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'meeting' as EventType,
    location: '',
    isOnline: false,
    meetingUrl: '',
    startDate: '',
    startTime: '09:00',
    endDate: '',
    endTime: '10:00',
    visibility: 'company' as Visibility,
    maxParticipants: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save to the database
    alert('Su kien da duoc tao thanh cong!')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-rose-500">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            Tao su kien moi
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Type */}
          <div className="space-y-2">
            <Label>Loai su kien</Label>
            <div className="grid grid-cols-5 gap-2">
              {Object.entries(eventTypeConfig).map(([type, config]) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: type as EventType })}
                  className={`flex flex-col items-center gap-1 rounded-xl border-2 p-3 transition-all ${
                    formData.type === type
                      ? `border-transparent bg-gradient-to-br ${config.gradient} text-white`
                      : 'border-border hover:border-muted-foreground/30'
                  }`}
                >
                  {config.icon}
                  <span className="text-xs font-medium">{config.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Ten su kien *</Label>
            <Input
              id="title"
              placeholder="VD: Hop kiem diem tien do du an..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Mo ta</Label>
            <Textarea
              id="description"
              placeholder="Mo ta chi tiet ve su kien..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          {/* Date & Time */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Bat dau *</Label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                  className="flex-1"
                />
                <Input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-28"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Ket thuc *</Label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                  className="flex-1"
                />
                <Input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-28"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="location">Dia diem</Label>
              <div className="flex items-center gap-2">
                <Label htmlFor="isOnline" className="text-sm font-normal text-muted-foreground">
                  Su kien online
                </Label>
                <Switch
                  id="isOnline"
                  checked={formData.isOnline}
                  onCheckedChange={(checked) => setFormData({ ...formData, isOnline: checked })}
                />
              </div>
            </div>
            <Input
              id="location"
              placeholder={formData.isOnline ? "VD: Zoom Meeting" : "VD: Phong hop A301"}
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            {formData.isOnline && (
              <Input
                placeholder="Link tham gia (Zoom, Google Meet, Teams...)"
                value={formData.meetingUrl}
                onChange={(e) => setFormData({ ...formData, meetingUrl: e.target.value })}
              />
            )}
          </div>

          {/* Visibility & Max Participants */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Hien thi cho</Label>
              <Select
                value={formData.visibility}
                onValueChange={(v) => setFormData({ ...formData, visibility: v as Visibility })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {visibilityOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <div className="flex items-center gap-2">
                        {opt.icon}
                        {opt.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxParticipants">So nguoi toi da (tuy chon)</Label>
              <Input
                id="maxParticipants"
                type="number"
                placeholder="Khong gioi han"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Huy
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-orange-500 to-rose-500 text-white hover:from-orange-600 hover:to-rose-600"
            >
              Tao su kien
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function EventCard({ event, onJoin }: { event: Event; onJoin: (eventId: string) => void }) {
  const organizer = users.find(u => u.id === event.organizerId)
  const isJoined = event.participants.includes(currentUser.id)
  const config = eventTypeConfig[event.type]
  const spotsLeft = event.maxParticipants ? event.maxParticipants - event.participants.length : null

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      {/* Cover Image */}
      {event.coverImage && (
        <div className="relative h-40 overflow-hidden">
          <img 
            src={event.coverImage || "/placeholder.svg"} 
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <Badge 
            className={`absolute left-3 top-3 gap-1 border-0 bg-gradient-to-r ${config.gradient} text-white`}
          >
            {config.icon}
            {config.label}
          </Badge>
          <div className="absolute bottom-3 left-3 right-3">
            <Badge className="mb-1 border-0 bg-white/20 text-white backdrop-blur-sm">
              {getTimeUntil(event.startDate)}
            </Badge>
          </div>
        </div>
      )}

      {!event.coverImage && (
        <div className={`flex h-24 items-center justify-center bg-gradient-to-br ${config.gradient}`}>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            {React.cloneElement(config.icon as React.ReactElement, { className: 'h-7 w-7 text-white' })}
          </div>
        </div>
      )}

      <CardContent className="p-4">
        {/* Title */}
        <h3 className="mb-2 text-lg font-semibold text-foreground line-clamp-2">
          {event.title}
        </h3>

        {/* Meta info */}
        <div className="mb-3 space-y-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>{formatEventDate(event.startDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0" />
            <span>{formatTime(event.startDate)} - {formatTime(event.endDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{event.location}</span>
            {event.isOnline && (
              <Badge variant="secondary" className="shrink-0 text-xs">
                Online
              </Badge>
            )}
          </div>
        </div>

        {/* Description */}
        {event.description && (
          <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
            {event.description}
          </p>
        )}

        {/* Organizer */}
        <div className="mb-4 flex items-center gap-2 border-t border-border pt-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={organizer?.avatar || "/placeholder.svg"} />
            <AvatarFallback>{organizer?.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-foreground">{organizer?.name}</p>
            <p className="text-xs text-muted-foreground">Nguoi to chuc</p>
          </div>
        </div>

        {/* Participants & Action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {event.participants.slice(0, 4).map((userId) => {
                const user = users.find(u => u.id === userId)
                return (
                  <Avatar key={userId} className="h-7 w-7 border-2 border-background">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-[10px]">{user?.name[0]}</AvatarFallback>
                  </Avatar>
                )
              })}
              {event.participants.length > 4 && (
                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                  +{event.participants.length - 4}
                </div>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {event.participants.length} tham gia
              {spotsLeft !== null && spotsLeft > 0 && (
                <span className="text-orange-500"> ({spotsLeft} cho trong)</span>
              )}
            </span>
          </div>

          {isJoined ? (
            <Button size="sm" variant="outline" className="gap-1 text-emerald-600 border-emerald-200 bg-emerald-50">
              <CheckCircle2 className="h-4 w-4" />
              Da dang ky
            </Button>
          ) : (
            <Button 
              size="sm" 
              onClick={() => onJoin(event.id)}
              className="gap-1 bg-gradient-to-r from-orange-500 to-rose-500 text-white hover:from-orange-600 hover:to-rose-600"
            >
              <UserPlus className="h-4 w-4" />
              Tham gia
            </Button>
          )}
        </div>

        {/* Online meeting link */}
        {event.isOnline && event.meetingUrl && isJoined && (
          <a
            href={event.meetingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-blue-50 p-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
          >
            <Video className="h-4 w-4" />
            Tham gia meeting
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </CardContent>
    </Card>
  )
}

export default function EventsPage() {
  const searchParams = useSearchParams()
  const { isMobile } = useDevice()
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<EventType | 'all'>('all')
  const [showCreateDialog, setShowCreateDialog] = useState(searchParams.get('create') === 'true')
  const [activeTab, setActiveTab] = useState('upcoming')

  if (isMobile) {
    return <MobileEvents />
  }

  const handleJoin = (eventId: string) => {
    setEvents(events.map(e => 
      e.id === eventId 
        ? { ...e, participants: [...e.participants, currentUser.id] }
        : e
    ))
  }

  const filteredEvents = events.filter(event => {
    if (filterType !== 'all' && event.type !== filterType) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query)
      )
    }
    return true
  })

  const upcomingEvents = filteredEvents
    .filter(e => new Date(e.startDate) > new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())

  const myEvents = filteredEvents.filter(e => 
    e.participants.includes(currentUser.id) || e.organizerId === currentUser.id
  )

  const pastEvents = filteredEvents
    .filter(e => new Date(e.endDate) < new Date())
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Su kien</h1>
            <p className="text-sm text-muted-foreground">Quan ly va tham gia cac su kien cong ty</p>
          </div>
          <Button 
            onClick={() => setShowCreateDialog(true)}
            className="gap-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white hover:from-orange-600 hover:to-rose-600"
          >
            <Plus className="h-4 w-4" />
            Tao su kien
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tim kiem su kien..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={filterType}
            onValueChange={(v) => setFilterType(v as EventType | 'all')}
          >
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Loai su kien" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tat ca loai</SelectItem>
              {Object.entries(eventTypeConfig).map(([type, config]) => (
                <SelectItem key={type} value={type}>
                  <div className="flex items-center gap-2">
                    {config.icon}
                    {config.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <div className="space-y-6">
          {/* Online Status */}
          <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-2 w-fit text-sm font-medium">
            <span className="inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            <span className="text-foreground">{upcomingEvents.length + myEvents.length} online</span>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="upcoming">Sap toi</TabsTrigger>
              <TabsTrigger value="my-events">Cua toi</TabsTrigger>
              <TabsTrigger value="past">Da qua</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              {upcomingEvents.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {upcomingEvents.map(event => (
                    <EventCard key={event.id} event={event} onJoin={handleJoin} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                    <Calendar className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">Chua co su kien nao</h3>
                  <p className="mb-4 text-muted-foreground">Hay tao su kien dau tien cho cong ty!</p>
                  <Button
                    onClick={() => setShowCreateDialog(true)}
                    className="gap-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white"
                  >
                    <Plus className="h-4 w-4" />
                    Tao su kien
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="my-events">
              {myEvents.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {myEvents.map(event => (
                    <EventCard key={event.id} event={event} onJoin={handleJoin} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                    <UserCheck className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">Ban chua tham gia su kien nao</h3>
                  <p className="text-muted-foreground">Hay tham gia cac su kien sap toi!</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="past">
              {pastEvents.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {pastEvents.map(event => (
                    <EventCard key={event.id} event={event} onJoin={handleJoin} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                    <Clock className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">Chua co su kien da qua</h3>
                  <p className="text-muted-foreground">Cac su kien da ket thuc se hien thi o day.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <CreateEventDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
    </div>
  )
}
