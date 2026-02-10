"use client"

import { useState, useMemo, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useNewsfeed } from "@/lib/newsfeed-store"
import { users } from "@/lib/mock-data"
import { MobilePostCard } from "./mobile-post-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  MapPin,
  Home,
  Calendar,
  Briefcase,
  Edit2,
  Camera,
  Facebook,
  Linkedin,
  Github,
  Globe,
  ChevronLeft,
  MoreHorizontal,
  MessageCircle,
  UserPlus,
  Trophy,
  CheckCircle,
  Users,
  Star,
  Code,
  Palette,
  BookOpen,
  Plane,
  Heart,
  Plus,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { User, Post, UserProfile } from "@/lib/types"

interface MobileProfileProps {
  userId: string
}

export function MobileProfile({ userId }: MobileProfileProps) {
  const { posts, currentUser, updateAvatar, updateCoverImage, updateProfile } = useNewsfeed()
  const [activeTab, setActiveTab] = useState("posts")
  const [showEditDialog, setShowEditDialog] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarClick = () => avatarInputRef.current?.click()
  const handleCoverClick = () => coverInputRef.current?.click()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const url = event.target?.result as string
        if (type === 'avatar') {
          updateAvatar(url)
        } else {
          updateCoverImage(url)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const user = useMemo(() => {
    if (userId === currentUser.id) return currentUser
    return users.find((u) => u.id === userId)
  }, [userId, currentUser])

  const [editBio, setEditBio] = useState(user?.profile?.bio || "")
  const [editLocation, setEditLocation] = useState(user?.profile?.location || "")
  const [editHometown, setEditHometown] = useState(user?.profile?.hometown || "")
  const [editFacebook, setEditFacebook] = useState(user?.profile?.socialLinks?.facebook || "")
  const [editLinkedin, setEditLinkedin] = useState(user?.profile?.socialLinks?.linkedin || "")
  const [editGithub, setEditGithub] = useState(user?.profile?.socialLinks?.github || "")
  const [editWebsite, setEditWebsite] = useState(user?.profile?.socialLinks?.website || "")

  const handleSaveProfile = () => {
    updateProfile({
      bio: editBio,
      location: editLocation,
      hometown: editHometown,
      socialLinks: {
        facebook: editFacebook,
        linkedin: editLinkedin,
        github: editGithub,
        website: editWebsite,
      }
    })
    setShowEditDialog(false)
  }

  const userPosts = useMemo(() => {
    return posts
      .filter((post) => post.authorId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [posts, userId])

  const taggedPosts = useMemo(() => {
    return posts
      .filter((post) => post.taggedUsers.includes(userId))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [posts, userId])

  const isOwnProfile = currentUser.id === userId

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Khong tim thay nguoi dung</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Cover Photo */}
      <div className="relative">
        <div className="h-48 w-full bg-gradient-to-r from-primary/20 to-primary/10">
          {user.profile?.coverImage && (
            <Image
              src={user.profile.coverImage || "/placeholder.svg"}
              alt="Cover"
              fill
              className="object-cover"
            />
          )}
        </div>

        {isOwnProfile && (
          <button
            type="button"
            onClick={handleCoverClick}
            className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-transform active:scale-90"
          >
            <Camera className="h-5 w-5" />
          </button>
        )}

        <input
          type="file"
          ref={coverInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => handleFileChange(e, 'cover')}
        />
        <input
          type="file"
          ref={avatarInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => handleFileChange(e, 'avatar')}
        />

        {/* Back Button */}
        <Link
          href="/"
          className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>

        {/* More Options */}
        <button
          type="button"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>

        {/* Avatar */}
        <div className="absolute -bottom-16 left-4">
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback className="text-3xl">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {isOwnProfile && (
              <button
                type="button"
                onClick={handleAvatarClick}
                className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-muted text-foreground transition-transform active:scale-90"
              >
                <Camera className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="mt-20 px-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
            <p className="text-sm text-muted-foreground">
              {user.department.name} · {user.email}
            </p>
          </div>
        </div>

        {/* Bio */}
        {user.profile?.bio && (
          <p className="mt-3 text-foreground">{user.profile.bio}</p>
        )}

        {/* Quick Info */}
        <div className="mt-4 space-y-2">
          {user.profile?.location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Song tai {user.profile.location}</span>
            </div>
          )}
          {user.profile?.hometown && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Home className="h-4 w-4" />
              <span>Que quan {user.profile.hometown}</span>
            </div>
          )}
          {user.profile?.joinedAt && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              <span>Tham gia tu {formatDate(user.profile.joinedAt)}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
          {isOwnProfile ? (
            <>
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => setShowEditDialog(true)}
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Chinh sua trang ca nhan
              </Button>
            </>
          ) : (
            <>
              <Button className="flex-1">
                <UserPlus className="mr-2 h-4 w-4" />
                Theo doi
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                <MessageCircle className="mr-2 h-4 w-4" />
                Nhan tin
              </Button>
            </>
          )}
        </div>

        {/* Social Links */}
        {user.profile?.socialLinks && (
          <div className="mt-4 flex gap-3">
            {user.profile.socialLinks.facebook && (
              <a
                href={user.profile.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-muted"
              >
                <Facebook className="h-5 w-5 text-blue-600" />
              </a>
            )}
            {user.profile.socialLinks.linkedin && (
              <a
                href={user.profile.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-muted"
              >
                <Linkedin className="h-5 w-5 text-blue-700" />
              </a>
            )}
            {user.profile.socialLinks.github && (
              <a
                href={user.profile.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-muted"
              >
                <Github className="h-5 w-5" />
              </a>
            )}
            {user.profile.socialLinks.website && (
              <a
                href={user.profile.socialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-muted"
              >
                <Globe className="h-5 w-5 text-green-600" />
              </a>
            )}
          </div>
        )}

        {/* Featured Stories */}
        {user.profile?.featuredStories && user.profile.featuredStories.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-3 font-semibold text-foreground">Tin noi bat</h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {user.profile.featuredStories.map((story) => (
                <button
                  key={story.id}
                  type="button"
                  className="flex flex-col items-center gap-2 flex-shrink-0"
                >
                  <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-muted">
                    <Image
                      src={story.coverImage || "/placeholder.svg"}
                      alt={story.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-xs text-muted-foreground max-w-[80px] truncate">
                    {story.name}
                  </span>
                </button>
              ))}
              {isOwnProfile && (
                <button
                  type="button"
                  className="flex flex-col items-center gap-2 flex-shrink-0"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/30">
                    <Plus className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <span className="text-xs text-muted-foreground">Them moi</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Achievements */}
        {user.profile?.achievements && user.profile.achievements.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-3 font-semibold text-foreground">Thanh tich</h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {user.profile.achievements.map((achievement) => {
                const AchievementIcon =
                  achievement.icon === "trophy"
                    ? Trophy
                    : achievement.icon === "check-circle"
                      ? CheckCircle
                      : achievement.icon === "users"
                        ? Users
                        : Star
                return (
                  <div
                    key={achievement.id}
                    className="flex flex-shrink-0 flex-col items-center gap-2 rounded-xl bg-muted p-3"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                      <AchievementIcon className="h-6 w-6 text-amber-600" />
                    </div>
                    <span className="max-w-[100px] text-center text-xs font-medium text-foreground line-clamp-2">
                      {achievement.title}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Interests */}
        {user.profile?.interests && user.profile.interests.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-3 font-semibold text-foreground">So thich</h3>
            <div className="flex flex-wrap gap-2">
              {user.profile.interests.map((interest) => {
                const InterestIcon =
                  interest.icon === "code"
                    ? Code
                    : interest.icon === "palette"
                      ? Palette
                      : interest.icon === "trophy"
                        ? Trophy
                        : interest.icon === "book"
                          ? BookOpen
                          : interest.icon === "plane"
                            ? Plane
                            : Heart
                return (
                  <div
                    key={interest.id}
                    className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5"
                  >
                    <InterestIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm text-foreground">{interest.name}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="mt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent h-12 px-4">
            <TabsTrigger
              value="posts"
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Bai viet ({userPosts.length})
            </TabsTrigger>
            <TabsTrigger
              value="tagged"
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Duoc tag ({taggedPosts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-0">
            <div className="space-y-2">
              {userPosts.length > 0 ? (
                userPosts.map((post) => <MobilePostCard key={post.id} post={post} />)
              ) : (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">Chua co bai viet nao.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="tagged" className="mt-0">
            <div className="space-y-2">
              {taggedPosts.length > 0 ? (
                taggedPosts.map((post) => <MobilePostCard key={post.id} post={post} />)
              ) : (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">Chua co bai viet duoc tag.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="h-full max-h-screen w-full max-w-full rounded-none p-0 sm:rounded-none">
          <DialogHeader className="flex-row items-center justify-between border-b border-border px-4 py-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEditDialog(false)}
            >
              Huy
            </Button>
            <DialogTitle className="text-base font-semibold">
              Chinh sua trang ca nhan
            </DialogTitle>
            <Button size="sm" onClick={handleSaveProfile}>Luu</Button>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              <div>
                <Label>Tieu su</Label>
                <Textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Viet gi do ve ban than..."
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Vi tri hien tai</Label>
                <Input
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  placeholder="Vi du: Ha Noi, Viet Nam"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Que quan</Label>
                <Input
                  value={editHometown}
                  onChange={(e) => setEditHometown(e.target.value)}
                  placeholder="Vi du: Nam Dinh"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Facebook</Label>
                <Input
                  value={editFacebook}
                  onChange={(e) => setEditFacebook(e.target.value)}
                  placeholder="https://facebook.com/username"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>LinkedIn</Label>
                <Input
                  value={editLinkedin}
                  onChange={(e) => setEditLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>GitHub</Label>
                <Input
                  value={editGithub}
                  onChange={(e) => setEditGithub(e.target.value)}
                  placeholder="https://github.com/username"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Website</Label>
                <Input
                  value={editWebsite}
                  onChange={(e) => setEditWebsite(e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="mt-1.5"
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
