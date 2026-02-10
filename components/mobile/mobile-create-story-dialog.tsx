'use client'

import React from "react"
import Image from 'next/image'
import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X, Type, Pencil, Send, Download, ImageIcon, Video as VideoIcon, Play, Settings } from 'lucide-react'
import type { Visibility, Story } from '@/lib/types'
import { useNewsfeed } from '@/lib/newsfeed-store'

interface MobileCreateStoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MobileCreateStoryDialog({
  open,
  onOpenChange,
}: MobileCreateStoryDialogProps) {
  const { currentUser, addStory } = useNewsfeed()
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null)
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null)
  const [storyText, setStoryText] = useState('')
  const [textColor, setTextColor] = useState('#FFFFFF')
  const [textSize, setTextSize] = useState(24)
  const [visibility, setVisibility] = useState<Visibility>('company')
  const [isCreating, setIsCreating] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [showTextInput, setShowTextInput] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawingRef = useRef(false)

  const handleMediaSelect = (type: 'image' | 'video') => {
    setMediaType(type)
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'image' ? 'image/*' : 'video/*'
      fileInputRef.current.click()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setSelectedMedia(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    isDrawingRef.current = true
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = textColor
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    isDrawingRef.current = false
  }

  const handleCreateStory = async () => {
    if (!selectedMedia) {
      alert('Hay chon anh hoac video')
      return
    }

    setIsCreating(true)

    try {
      const story: Story = {
        id: `story-${Date.now()}`,
        authorId: currentUser.id,
        media: {
          id: `media-${Date.now()}`,
          type: mediaType === 'video' ? 'video' : 'image',
          url: selectedMedia,
        },
        text: storyText || undefined,
        textColor,
        visibility,
        taggedUsers: [],
        reactions: [],
        replies: [],
        views: [],
        isHighlight: false,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      }

      if (addStory) addStory(story)
      onOpenChange(false)

      setStoryText('')
      setSelectedMedia(null)
      setMediaType(null)
      setTextColor('#FFFFFF')
      setTextSize(24)
      setVisibility('company')
      setIsDrawing(false)
    } catch (error) {
      console.error('Error creating story:', error)
      alert('Tao story that bai')
    } finally {
      setIsCreating(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setStoryText('')
    setSelectedMedia(null)
    setMediaType(null)
    setTextColor('#FFFFFF')
    setTextSize(24)
    setIsDrawing(false)
    setShowTextInput(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="h-screen max-h-screen w-screen max-w-none rounded-none p-0 flex flex-col bg-black overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Tao story</DialogTitle>
        </DialogHeader>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-black to-black/80 backdrop-blur z-50 border-b border-white/10">
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/10 rounded-full transition text-white"
          >
            <X className="h-6 w-6" />
          </button>
          <h2 className="text-white font-semibold text-sm">Them vao story</h2>
          <button className="p-2 hover:bg-white/10 rounded-full transition text-white">
            <Settings className="h-6 w-6" />
          </button>
        </div>

        {/* Main Editor */}
        <div className="flex-1 flex relative overflow-hidden">
          {/* Canvas/Media Area */}
          <div className="flex-1 relative bg-black flex items-center justify-center">
            {!selectedMedia ? (
              <div className="flex flex-col items-center gap-6 p-6">
                <div className="text-center">
                  <p className="text-lg font-semibold text-white mb-6">
                    Chon loai noi dung
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                  {/* Image Option */}
                  <button
                    onClick={() => handleMediaSelect('image')}
                    disabled={isCreating}
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
                  >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition" />
                    <div className="relative flex flex-col items-center gap-3 text-white z-10">
                      <ImageIcon className="h-8 w-8" />
                      <div>
                        <p className="font-semibold text-sm">Anh</p>
                        <p className="text-xs text-white/80">Chup hoac tai len</p>
                      </div>
                    </div>
                  </button>

                  {/* Video Option */}
                  <button
                    onClick={() => handleMediaSelect('video')}
                    disabled={isCreating}
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
                  >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition" />
                    <div className="relative flex flex-col items-center gap-3 text-white z-10">
                      <VideoIcon className="h-8 w-8" />
                      <div>
                        <p className="font-semibold text-sm">Video</p>
                        <p className="text-xs text-white/80">Tai len video</p>
                      </div>
                    </div>
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative w-full h-full">
                {mediaType === 'image' ? (
                  <Image
                    src={selectedMedia || "/placeholder.svg"}
                    alt="Story"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center bg-gray-900">
                    <video
                      src={selectedMedia}
                      className="h-full w-full object-cover"
                      controls
                    />
                  </div>
                )}

                {/* Drawing Canvas */}
                {isDrawing && (
                  <canvas
                    ref={canvasRef}
                    width={window.innerWidth}
                    height={window.innerHeight}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="absolute inset-0 cursor-crosshair z-20"
                  />
                )}

                {/* Text Overlay */}
                {storyText && (
                  <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none z-10">
                    <p
                      className="text-center font-bold line-clamp-6"
                      style={{
                        color: textColor,
                        fontSize: `${textSize}px`,
                        textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
                        fontWeight: 700,
                      }}
                    >
                      {storyText}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Toolbar */}
          {selectedMedia && (
            <div className="w-16 bg-black/60 backdrop-blur border-l border-white/10 flex flex-col items-center justify-start gap-2 py-4 z-40">
              {/* Text Tool */}
              <button
                onClick={() => setShowTextInput(!showTextInput)}
                className="p-3 hover:bg-white/20 rounded-lg transition text-white"
                title="Van ban"
              >
                <Type className="h-5 w-5" />
              </button>

              {/* Text Size Up */}
              <button
                onClick={() => setTextSize(Math.min(textSize + 2, 48))}
                className="p-2 hover:bg-white/20 rounded text-white text-xs font-bold"
                title="Tang kich co"
              >
                A+
              </button>

              {/* Text Size Down */}
              <button
                onClick={() => setTextSize(Math.max(textSize - 2, 12))}
                className="p-2 hover:bg-white/20 rounded text-white text-xs font-bold"
                title="Giam kich co"
              >
                A-
              </button>

              {/* Color Picker */}
              <div className="p-2">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="h-8 w-8 rounded cursor-pointer border border-white/30 hover:border-white/60"
                  title="Mau van ban"
                />
              </div>

              {/* Draw Tool */}
              <button
                onClick={() => setIsDrawing(!isDrawing)}
                className={`p-3 rounded-lg transition ${isDrawing
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-white/20 text-white'
                  }`}
                title="Ve"
              >
                <Pencil className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Text Input Modal */}
        {showTextInput && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur flex items-end z-50">
            <div className="w-full bg-black border-t border-white/20 p-4 space-y-3">
              <textarea
                value={storyText}
                onChange={(e) => setStoryText(e.target.value)}
                placeholder="Viet van ban..."
                className="w-full h-20 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 p-3 focus:outline-none focus:border-blue-500"
                maxLength={200}
              />
              <div className="text-xs text-gray-400 text-right">
                {storyText.length}/200
              </div>
              <button
                onClick={() => setShowTextInput(false)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
              >
                Xong
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        {selectedMedia && (
          <div className="border-t border-white/10 bg-black/70 backdrop-blur px-4 py-4 flex gap-3 z-40">
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as Visibility)}
              className="flex-1 bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="company" className="bg-black text-white">Tat ca</option>
              <option value="department" className="bg-black text-white">Cong ty</option>
              <option value="private" className="bg-black text-white">Chi toi</option>
            </select>

            <Button
              onClick={() => setSelectedMedia(null)}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Doi
            </Button>

            <Button
              onClick={handleCreateStory}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6"
              disabled={isCreating}
            >
              {isCreating ? 'Dang...' : <Send className="h-4 w-4" />}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
