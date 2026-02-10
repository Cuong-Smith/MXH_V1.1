'use client'

import React from "react"

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useNewsfeed } from '@/lib/newsfeed-store'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { X, Upload, Type, Palette, ArrowLeft } from 'lucide-react'
import type { Visibility, Story } from '@/lib/types'

export default function CreateStoryPage() {
  const router = useRouter()
  const { currentUser, addStory } = useNewsfeed()
  const [storyText, setStoryText] = useState('')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [visibility, setVisibility] = useState<Visibility>('company')
  const [textColor, setTextColor] = useState('#FFFFFF')
  const [backgroundColor, setBackgroundColor] = useState('#000000')
  const [isCreating, setIsCreating] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCreateStory = async () => {
    if (!selectedImage && !storyText) {
      alert('Vui long them anh hoac text vao cau chuyen')
      return
    }

    setIsCreating(true)

    try {
      const story: Story = {
        id: `story-${Date.now()}`,
        authorId: currentUser.id,
        media: {
          id: `media-${Date.now()}`,
          type: 'image',
          url: selectedImage || '/placeholder.svg',
        },
        text: storyText || undefined,
        textColor,
        backgroundColor,
        visibility,
        taggedUsers: [],
        reactions: [],
        replies: [],
        views: [],
        isHighlight: false,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      }

      addStory(story)
      alert('Tao cau chuyen thanh cong!')
      router.push('/')
    } catch (error) {
      console.error('Error creating story:', error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between bg-black/80 backdrop-blur px-6 py-4 border-b border-border">
        <button
          onClick={() => router.back()}
          className="text-white hover:bg-white/10 p-2 rounded-lg transition"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-white font-bold text-xl">Tao cau chuyen</h1>
        <div className="w-10" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center overflow-auto">
        <div className="flex w-full h-full max-w-6xl">
          {/* Preview */}
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-900 to-black">
            {selectedImage ? (
              <div className="relative w-full h-full">
                <Image
                  src={selectedImage || "/placeholder.svg"}
                  alt="Story preview"
                  fill
                  className="object-cover"
                />
                {storyText && (
                  <div
                    className="absolute inset-0 flex items-center justify-center p-6"
                    style={{ backgroundColor: `${backgroundColor}CC` }}
                  >
                    <p
                      className="text-2xl font-bold text-center max-w-xs leading-relaxed"
                      style={{ color: textColor }}
                    >
                      {storyText}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div
                className="w-full h-full flex flex-col items-center justify-center p-8"
                style={{ backgroundColor }}
              >
                {storyText && (
                  <p
                    className="text-4xl font-bold text-center leading-relaxed"
                    style={{ color: textColor }}
                  >
                    {storyText}
                  </p>
                )}
                {!storyText && (
                  <div className="text-white/50 text-center">
                    <Upload className="h-12 w-12 mx-auto mb-2" />
                    <p>Them anh hoac text de xem truoc</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tools */}
          <div className="w-96 bg-background border-l border-border overflow-y-auto p-6 space-y-6">
            {/* Image Upload */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">Them anh</label>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-border rounded-lg p-4 hover:border-primary hover:bg-primary/5 transition"
              >
                <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Bam de tai anh</p>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              {selectedImage && (
                <button
                  onClick={() => setSelectedImage(null)}
                  className="w-full text-sm text-destructive hover:bg-destructive/10 p-2 rounded transition"
                >
                  Xoa anh
                </button>
              )}
            </div>

            {/* Text Content */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Type className="h-4 w-4" />
                Text
              </label>
              <Textarea
                placeholder="Them text vao cau chuyen..."
                value={storyText}
                onChange={(e) => setStoryText(e.target.value)}
                className="resize-none h-24"
              />
            </div>

            {/* Text Color */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Mau text
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <Input
                  type="text"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="flex-1"
                  placeholder="#FFFFFF"
                />
              </div>
            </div>

            {/* Background Color */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Mau nen
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <Input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="flex-1"
                  placeholder="#000000"
                />
              </div>
            </div>

            {/* Visibility */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">Ai co the thay</label>
              <Select value={visibility} onValueChange={(v) => setVisibility(v as Visibility)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Cong khai</SelectItem>
                  <SelectItem value="company">Cong ty</SelectItem>
                  <SelectItem value="friends">Ban be</SelectItem>
                  <SelectItem value="private">Rieng tu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t border-border">
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => router.back()}
              >
                Huy
              </Button>
              <Button
                className="flex-1"
                onClick={handleCreateStory}
                disabled={isCreating}
              >
                {isCreating ? 'Dang tao...' : 'Dang cau chuyen'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
