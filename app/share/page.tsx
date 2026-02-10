'use client'

import { useState } from 'react'
import { ArrowLeft, Globe, Lock, Users, Send } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

const privacy = [
  { id: 'public', label: 'Công khai', icon: Globe, description: 'Bất kỳ ai cũng có thể thấy' },
  { id: 'friends', label: 'Bạn bè', icon: Users, description: 'Chỉ bạn bè có thể thấy' },
  { id: 'private', label: 'Riêng tư', icon: Lock, description: 'Chỉ bạn có thể thấy' },
]

export default function SharePage() {
  const [selectedPrivacy, setSelectedPrivacy] = useState('public')
  const [message, setMessage] = useState('')

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-6">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Chia sẻ bài viết</h1>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* User Card */}
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/avatar.jpg" />
                <AvatarFallback>TH</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">Thành Hiền</p>
                <p className="text-sm text-muted-foreground">@thanhien</p>
              </div>
            </div>
          </Card>

          {/* Message Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Thêm lời nhắn (tùy chọn)
            </label>
            <Textarea
              placeholder="Bạn muốn nói gì về bài viết này?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-24"
            />
          </div>

          {/* Privacy Settings */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Ai có thể thấy?</label>
            <div className="grid gap-2">
              {privacy.map((option) => {
                const Icon = option.icon
                return (
                  <button
                    key={option.id}
                    onClick={() => setSelectedPrivacy(option.id)}
                    className={`flex items-center gap-3 rounded-lg border-2 px-4 py-3 transition-all ${
                      selectedPrivacy === option.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-foreground">{option.label}</p>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                    <div
                      className={`h-5 w-5 rounded-full border-2 ${
                        selectedPrivacy === option.id
                          ? 'border-primary bg-primary'
                          : 'border-border'
                      }`}
                    />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Post Preview */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Xem trước</label>
            <Card className="overflow-hidden">
              <div className="bg-muted p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/avatar.jpg" />
                    <AvatarFallback>TH</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Thành Hiền</p>
                    <p className="text-xs text-muted-foreground">Vừa xong</p>
                  </div>
                </div>
                {message && <p className="text-sm text-foreground mb-3">{message}</p>}
                <div className="rounded bg-background p-3 text-center text-sm text-muted-foreground">
                  Bài viết được chia sẻ
                </div>
              </div>
            </Card>
          </div>

          {/* Share Recipients Info */}
          <Card className="border-primary/20 bg-primary/5 p-4">
            <p className="text-sm text-foreground">
              Bài viết sẽ được chia sẻ tới người dùng{' '}
              <span className="font-semibold">
                {selectedPrivacy === 'public'
                  ? 'công khai'
                  : selectedPrivacy === 'friends'
                  ? 'bạn bè của bạn'
                  : 'riêng tư của bạn'}
              </span>
              .
            </p>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                Hủy
              </Button>
            </Link>
            <Button className="flex-1 gap-2 bg-primary hover:bg-primary/90">
              <Send className="h-4 w-4" />
              Chia sẻ
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
