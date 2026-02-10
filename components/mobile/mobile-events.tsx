"use client"

import React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  ChevronRight,
  X,
} from "lucide-react"
import { initialEvents, users, currentUser } from "@/lib/mock-data"
import type { Event, EventType } from "@/lib/types"
import { cn } from "@/lib/utils"
import { MobileCreateEventDialog } from "./mobile-create-event-dialog"

const eventTypeConfig: Record<
  EventType,
  { label: string; icon: React.ReactNode; color: string }
> = {
  party: {
    label: "Tiec / Su kien",
    icon: <PartyPopper className="h-4 w-4" />,
    color: "bg-rose-500",
  },
  workshop: {
    label: "Workshop",
    icon: <Presentation className="h-4 w-4" />,
    color: "bg-violet-500",
  },
  meeting: {
    label: "Hop",
    icon: <Video className="h-4 w-4" />,
    color: "bg-blue-500",
  },
  training: {
    label: "Dao tao",
    icon: <GraduationCap className="h-4 w-4" />,
    color: "bg-emerald-500",
  },
  other: {
    label: "Khac",
    icon: <CalendarDays className="h-4 w-4" />,
    color: "bg-gray-500",
  },
}

function formatEventDate(date: Date) {
  return new Date(date).toLocaleDateString("vi-VN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })
}

function formatEventTime(date: Date) {
  return new Date(date).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

function getDaysUntil(date: Date) {
  const now = new Date()
  const eventDate = new Date(date)
  const diffTime = eventDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  if (diffDays < 0) return "Da qua"
  if (diffDays === 0) return "Hom nay"
  if (diffDays === 1) return "Ngay mai"
  return `Con ${diffDays} ngay`
}

export function MobileEvents() {
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("upcoming")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  const now = new Date()

  const upcomingEvents = events
    .filter((e) => new Date(e.startDate) >= now)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())

  const myEvents = events.filter(
    (e) =>
      e.organizerId === currentUser.id || (e.participants || []).includes(currentUser.id)
  )

  const pastEvents = events
    .filter((e) => new Date(e.endDate) < now)
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())

  const filteredEvents =
    activeTab === "upcoming"
      ? upcomingEvents
      : activeTab === "my"
        ? myEvents
        : pastEvents

  const searchedEvents = filteredEvents.filter(
    (e) =>
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleJoinEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? { ...e, participants: [...(e.participants || []), currentUser.id] }
          : e
      )
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* Search Bar */}
      <div className="sticky top-14 z-30 bg-background border-b border-border p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tim kiem su kien..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-muted border-0 pl-9"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start rounded-none border-b border-border bg-background h-12 px-2">
          <TabsTrigger
            value="upcoming"
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Sap toi ({upcomingEvents.length})
          </TabsTrigger>
          <TabsTrigger
            value="my"
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Cua toi ({myEvents.length})
          </TabsTrigger>
          <TabsTrigger
            value="past"
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Da qua
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          <div className="space-y-3 p-3">
            {searchedEvents.length > 0 ? (
              searchedEvents.map((event) => (
                <MobileEventCard
                  key={event.id}
                  event={event}
                  onSelect={() => setSelectedEvent(event)}
                  onJoin={() => handleJoinEvent(event.id)}
                />
              ))
            ) : (
              <div className="py-12 text-center">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">Khong co su kien nao.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* FAB - Create Event */}
      <button
        type="button"
        onClick={() => setShowCreateDialog(true)}
        className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Event Detail Sheet */}
      {selectedEvent && (
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent className="h-full max-h-screen w-full max-w-full rounded-none p-0 sm:rounded-none">
            <DialogHeader className="sr-only">
              <DialogTitle>{selectedEvent.title}</DialogTitle>
            </DialogHeader>
            <div className="relative h-48 w-full bg-gradient-to-br from-primary/20 to-primary/5">
              {selectedEvent.coverImage && (
                <Image
                  src={selectedEvent.coverImage || "/placeholder.svg"}
                  alt={selectedEvent.title}
                  fill
                  className="object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="absolute bottom-4 left-4 right-4">
                <Badge
                  className={cn(
                    "mb-2",
                    eventTypeConfig[selectedEvent.type].color,
                    "text-white border-0"
                  )}
                >
                  {eventTypeConfig[selectedEvent.type].icon}
                  <span className="ml-1">{eventTypeConfig[selectedEvent.type].label}</span>
                </Badge>
                <h2 className="text-xl font-bold text-white">{selectedEvent.title}</h2>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="h-5 w-5" />
                  <div>
                    <p className="font-medium text-foreground">
                      {formatEventDate(selectedEvent.startDate)}
                    </p>
                    <p className="text-sm">
                      {formatEventTime(selectedEvent.startDate)} -{" "}
                      {formatEventTime(selectedEvent.endDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                  <div>
                    <p className="font-medium text-foreground">{selectedEvent.location}</p>
                    {selectedEvent.isOnline && (
                      <Badge variant="outline" className="mt-1">
                        Online
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-muted-foreground">
                  <Users className="h-5 w-5" />
                  <p>{(selectedEvent.participants || []).length} nguoi tham gia</p>
                </div>

                <div className="border-t border-border pt-4">
                  <h3 className="mb-2 font-semibold text-foreground">Mo ta</h3>
                  <p className="text-muted-foreground">{selectedEvent.description}</p>
                </div>

                {/* Organizer */}
                <div className="border-t border-border pt-4">
                  <h3 className="mb-2 font-semibold text-foreground">Nguoi to chuc</h3>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={
                          users.find((u) => u.id === selectedEvent.organizerId)?.avatar ||
                          "/placeholder.svg"
                          || "/placeholder.svg"}
                      />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">
                        {users.find((u) => u.id === selectedEvent.organizerId)?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">Nguoi to chuc</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-border p-4">
              {(selectedEvent.participants || []).includes(currentUser.id) ? (
                <Button className="w-full bg-transparent" variant="outline" disabled>
                  Da dang ky
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => {
                    handleJoinEvent(selectedEvent.id)
                    setSelectedEvent(null)
                  }}
                >
                  Tham gia su kien
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Event Dialog */}
      <MobileCreateEventDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreateEvent={(event) => {
          setEvents((prev) => [...prev, event])
          setShowCreateDialog(false)
        }}
      />
    </div>
  )
}

interface MobileEventCardProps {
  event: Event
  onSelect: () => void
  onJoin: () => void
}

function MobileEventCard({ event, onSelect, onJoin }: MobileEventCardProps) {
  const organizer = users.find((u) => u.id === event.organizerId)
  const isJoined = (event.participants || []).includes(currentUser.id)
  const config = eventTypeConfig[event.type]

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
      className="w-full overflow-hidden rounded-xl bg-background text-left shadow-sm cursor-pointer active:bg-muted/50 transition-colors"
    >
      {/* Cover Image */}
      <div className="relative h-32 w-full bg-gradient-to-br from-muted to-muted/50">
        {event.coverImage && (
          <Image
            src={event.coverImage || "/placeholder.svg"}
            alt={event.title}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Type Badge */}
        <Badge
          className={cn(
            "absolute left-3 top-3",
            config.color,
            "text-white border-0"
          )}
        >
          {config.icon}
          <span className="ml-1">{config.label}</span>
        </Badge>

        {/* Days Until */}
        <div className="absolute bottom-3 left-3">
          <span className="rounded bg-black/60 px-2 py-1 text-xs font-medium text-white">
            {getDaysUntil(event.startDate)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-semibold text-foreground line-clamp-1">{event.title}</h3>

        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>{formatEventDate(event.startDate)}</span>
          <span>·</span>
          <Clock className="h-3.5 w-3.5" />
          <span>{formatEventTime(event.startDate)}</span>
        </div>

        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span className="line-clamp-1">{event.location}</span>
          {event.isOnline && (
            <Badge variant="outline" className="h-5 text-[10px]">
              Online
            </Badge>
          )}
        </div>

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={organizer?.avatar || "/placeholder.svg"} />
              <AvatarFallback>{organizer?.name?.[0]}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">
              {(event.participants || []).length} tham gia
            </span>
          </div>

          <Button
            size="sm"
            variant={isJoined ? "outline" : "default"}
            onClick={(e) => {
              e.stopPropagation()
              if (!isJoined) onJoin()
            }}
            disabled={isJoined}
            className="h-8 text-xs"
          >
            {isJoined ? "Da dang ky" : "Tham gia"}
          </Button>
        </div>
      </div>
    </div>
  )
}
