"use client"

import React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Calendar,
  Video,
  PartyPopper,
  GraduationCap,
  Presentation,
  CalendarDays,
  Globe,
  Building2,
  Users,
  Lock,
  Link as LinkIcon,
} from "lucide-react"
import { currentUser } from "@/lib/mock-data"
import type { Event, EventType, Visibility } from "@/lib/types"

const eventTypeConfig: Record<
  EventType,
  { label: string; icon: React.ReactNode; color: string; gradient: string }
> = {
  party: {
    label: "Tiec / Su kien",
    icon: <PartyPopper className="h-4 w-4" />,
    color: "bg-rose-500",
    gradient: "from-rose-500 to-orange-500",
  },
  workshop: {
    label: "Workshop",
    icon: <Presentation className="h-4 w-4" />,
    color: "bg-violet-500",
    gradient: "from-violet-500 to-purple-500",
  },
  meeting: {
    label: "Hop",
    icon: <Video className="h-4 w-4" />,
    color: "bg-blue-500",
    gradient: "from-blue-500 to-cyan-500",
  },
  training: {
    label: "Dao tao",
    icon: <GraduationCap className="h-4 w-4" />,
    color: "bg-emerald-500",
    gradient: "from-emerald-500 to-teal-500",
  },
  other: {
    label: "Khac",
    icon: <CalendarDays className="h-4 w-4" />,
    color: "bg-gray-500",
    gradient: "from-gray-500 to-slate-500",
  },
}

const visibilityOptions = [
  { value: "company", label: "Toan cong ty", icon: Globe },
  { value: "department", label: "Phong ban", icon: Building2 },
  { value: "specific", label: "Chi dinh", icon: Users },
  { value: "private", label: "Rieng tu", icon: Lock },
]

interface MobileCreateEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateEvent: (event: Event) => void
}

export function MobileCreateEventDialog({
  open,
  onOpenChange,
  onCreateEvent,
}: MobileCreateEventDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "meeting" as EventType,
    location: "",
    isOnline: false,
    meetingUrl: "",
    startDate: "",
    startTime: "09:00",
    endDate: "",
    endTime: "10:00",
    visibility: "company" as Visibility,
    maxParticipants: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "meeting",
      location: "",
      isOnline: false,
      meetingUrl: "",
      startDate: "",
      startTime: "09:00",
      endDate: "",
      endTime: "10:00",
      visibility: "company",
      maxParticipants: "",
    })
  }

  const handleSubmit = () => {
    if (!formData.title || !formData.startDate || !formData.endDate) return

    setIsSubmitting(true)

    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`)
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`)

    const newEvent: Event = {
      id: `event-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      type: formData.type,
      location: formData.location || (formData.isOnline ? "Online" : ""),
      isOnline: formData.isOnline,
      meetingUrl: formData.isOnline ? formData.meetingUrl : undefined,
      startDate: startDateTime,
      endDate: endDateTime,
      organizerId: currentUser.id,
      participants: [currentUser.id],
      visibility: formData.visibility,
      maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined,
      createdAt: new Date(),
    }

    onCreateEvent(newEvent)
    resetForm()
    setIsSubmitting(false)
  }

  const isValid = formData.title && formData.startDate && formData.endDate

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-full max-h-screen w-full max-w-full flex-col rounded-none p-0 sm:rounded-none">
        <DialogHeader className="flex-row items-center justify-between border-b border-border px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              resetForm()
              onOpenChange(false)
            }}
          >
            Huy
          </Button>
          <DialogTitle className="text-base font-semibold">Tao su kien</DialogTitle>
          <Button size="sm" onClick={handleSubmit} disabled={!isValid || isSubmitting}>
            {isSubmitting ? "Dang tao..." : "Tao"}
          </Button>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="space-y-6 p-4">
            {/* Event Type */}
            <div>
              <Label className="mb-3 block">Loai su kien</Label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(eventTypeConfig).map(([type, config]) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: type as EventType })}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all ${
                      formData.type === type
                        ? `border-transparent bg-gradient-to-br ${config.gradient} text-white`
                        : "border-border hover:border-muted-foreground/30"
                    }`}
                  >
                    {config.icon}
                    <span className="text-xs font-medium">{config.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <Label htmlFor="title">Ten su kien *</Label>
              <Input
                id="title"
                placeholder="VD: Hop kiem diem du an..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1.5"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Mo ta</Label>
              <Textarea
                id="description"
                placeholder="Mo ta chi tiet ve su kien..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1.5 min-h-[100px]"
              />
            </div>

            {/* Location & Online */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Su kien online</Label>
                <Switch
                  checked={formData.isOnline}
                  onCheckedChange={(checked) => setFormData({ ...formData, isOnline: checked })}
                />
              </div>

              {formData.isOnline ? (
                <div>
                  <Label htmlFor="meetingUrl">Link cuoc hop</Label>
                  <div className="relative mt-1.5">
                    <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="meetingUrl"
                      placeholder="https://meet.google.com/..."
                      value={formData.meetingUrl}
                      onChange={(e) => setFormData({ ...formData, meetingUrl: e.target.value })}
                      className="pl-9"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <Label htmlFor="location">Dia diem</Label>
                  <Input
                    id="location"
                    placeholder="VD: Phong hop A301"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
              )}
            </div>

            {/* Date & Time */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Label>Thoi gian</Label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Ngay bat dau *</Label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        startDate: e.target.value,
                        endDate: formData.endDate || e.target.value,
                      })
                    }}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Gio bat dau</Label>
                  <Input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Ngay ket thuc *</Label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    min={formData.startDate}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Gio ket thuc</Label>
                  <Input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Visibility */}
            <div>
              <Label>Ai co the xem</Label>
              <Select
                value={formData.visibility}
                onValueChange={(v) => setFormData({ ...formData, visibility: v as Visibility })}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {visibilityOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <div className="flex items-center gap-2">
                        <opt.icon className="h-4 w-4" />
                        {opt.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Max Participants */}
            <div>
              <Label htmlFor="maxParticipants">So nguoi tham gia toi da</Label>
              <Input
                id="maxParticipants"
                type="number"
                placeholder="Khong gioi han"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                className="mt-1.5"
                min="1"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                De trong neu khong gioi han so nguoi
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
